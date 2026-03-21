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

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    await prisma.telegramLinkCode.create({
      data: {
        storeId,
        code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
      },
    });

    const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'PlatformBot';
    const link = `https://t.me/${botUsername}?start=${code}`;

    return NextResponse.json({ link, code });
  } catch (error) {
    console.error('[TELEGRAM_CONNECT]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
