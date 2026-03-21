import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(
  req: Request,
  props: { params: Promise<{ storeId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { storeId } = await props.params;

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        ownerId: session.user.id,
      },
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    await prisma.store.update({
      where: { id: storeId },
      data: {
        telegramChatId: null,
        telegramBotEnabled: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[TELEGRAM_DISCONNECT]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
