import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await props.params;
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const contentType = req.headers.get('content-type') || '';
    let field: string, value: string;

    if (contentType.includes('application/json')) {
      const body = await req.json();
      field = body.field;
      value = body.value;
    } else {
      const formData = await req.formData();
      field = formData.get('field')?.toString() || '';
      value = formData.get('value')?.toString() || '';
    }

    // Тільки дозволені поля
    const ALLOWED_FIELDS = [
      'telegramChatId', 'openaiApiKey', 'novaPoshtaApiKey',
      'sendgridApiKey', 'stripeAccountId',
    ];
    if (!ALLOWED_FIELDS.includes(field)) {
      return NextResponse.json({ error: 'Заборонене поле' }, { status: 400 });
    }

    await prisma.store.update({
      where: { id: storeId },
      data: { [field]: value || null },
    });

    const redirectUrl = new URL(req.headers.get('referer') || `/dashboard/${storeId}/settings/api-keys`, req.url);
    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('[Store/Settings]', error);
    return NextResponse.json({ error: 'Помилка' }, { status: 500 });
  }
}
