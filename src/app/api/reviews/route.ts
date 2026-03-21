import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { productId, rating, comment } = body;

    if (!productId || !rating) {
      return NextResponse.json(
        { error: 'Product ID and rating are required' },
        { status: 400 }
      );
    }

    // Check if user has bought the product
    const hasBought = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: 'COMPLETED',
        },
      },
    });

    const isVerified = !!hasBought;

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating: Number(rating),
        comment,
        isVerified,
      },
    });

    // Update product stats
    const allReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const avgRating =
      allReviews.reduce((acc, curr) => acc + curr.rating, 0) /
      allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        avgRating,
        reviewsCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('[REVIEW_POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
