import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q || q.length < 2) {
    return NextResponse.json({ products: [], stores: [] });
  }

  try {
    const [products, stores] = await Promise.all([
      prisma.product.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' },
          isArchived: false,
        },
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
          store: {
            select: {
              slug: true
            }
          }
        },
        take: 5
      }),
      prisma.store.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' }
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        take: 3
      })
    ]);

    return NextResponse.json({ products, stores });
  } catch (error) {
    console.error('Suggest search error:', error);
    return NextResponse.json({ products: [], stores: [] }, { status: 500 });
  }
}
