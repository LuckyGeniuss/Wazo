import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

const OrderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
  price: z.number().min(0),
});

const CreateOrderSchema = z.object({
  storeId: z.string().min(1),
  items: z.array(OrderItemSchema).min(1),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(5),
  shippingAddress: z.string().min(5),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    // Allow guest checkout for now, or require auth based on your app logic
    
    const body = await req.json();
    const result = CreateOrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: result.error.format() },
        { status: 400 }
      );
    }

    const { storeId, items, customerName, customerEmail, customerPhone, shippingAddress } = result.data;

    // Optional: Verify products exist and stock is available
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map(p => [p.id, p]));

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${product.name}` }, { status: 400 });
      }
    }

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create Order and Update Stock in a Transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          storeId,
          // customerId: session?.user?.id, // nullable for guests - removed for now since it's not in schema
          customerName,
          customerEmail,
          customerPhone,
          // shippingAddress, // Removed since not in schema
          totalPrice,
          status: 'PENDING',
          orderItems: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      // Update stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });

  } catch (error) {
    console.error('[Create Order Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
