import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function ApiKeysPage(
  props: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await props.params;
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const store = await prisma.store.findFirst({
    where: { id: storeId },
    select: {
      id: true, name: true,
      telegramChatId: true,
      openaiApiKey: true,
      novaPoshtaApiKey: true,
    },
  });
  if (!store) redirect('/dashboard');

  const API_SECTIONS = [
    {
      id: 'ai',
      title: '🤖 Штучний інтелект',
      desc: 'Підключіть власний OpenAI або інший AI для генерації описів товарів',
      fields: [
        {
          name: 'openaiApiKey',
          label: 'OpenAI API Key',
          placeholder: 'sk-...',
          type: 'password',
          current: store.openaiApiKey ? '••••••••' : '',
          help: 'Отримати на platform.openai.com',
          link: 'https://platform.openai.com/api-keys',
        },
      ],
    },
    {
      id: 'telegram',
      title: '📱 Telegram сповіщення',
      desc: 'Отримуйте миттєві повідомлення про нові замовлення в Telegram',
      fields: [
        {
          name: 'telegramChatId',
          label: 'Telegram Chat ID',
          placeholder: '123456789',
          type: 'text',
          current: store.telegramChatId || '',
          help: 'Відкрийте @wazo_market_bot і натисніть /start',
          link: 'https://t.me/wazo_market_bot',
        },
      ],
    },
    {
      id: 'delivery',
      title: '📦 Нова Пошта',
      desc: 'Інтеграція для автоматичного відстеження посилок',
      fields: [
        {
          name: 'novaPoshtaApiKey',
          label: 'Нова Пошта API Key',
          placeholder: 'Ваш API ключ НП',
          type: 'password',
          current: store.novaPoshtaApiKey ? '••••••••' : '',
          help: 'Отримати в особистому кабінеті novaposhta.ua',
          link: 'https://my.novaposhta.ua/settings/index#apikeys',
        },
      ],
    },
  ];

  return (
    <div className="p-6 max-w-2xl">
      <a href={`/dashboard/${storeId}/settings`}
         className="text-sm text-slate-400 hover:text-slate-600">← Налаштування</a>
      <h1 className="text-2xl font-black mt-2 mb-2">API та інтеграції</h1>
      <p className="text-slate-500 text-sm mb-8">
        Підключіть сторонні сервіси для розширення функціоналу вашого магазину
      </p>

      <div className="space-y-6">
        {API_SECTIONS.map(section => (
          <div key={section.id} className="bg-white border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50">
              <h3 className="font-bold">{section.title}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{section.desc}</p>
            </div>
            <div className="p-6 space-y-4">
              {section.fields.map(field => (
                <form key={field.name}
                      action={`/api/dashboard/stores/${storeId}/settings`}
                      method="POST"
                      className="space-y-2">
                  <input type="hidden" name="field" value={field.name} />
                  <label className="text-sm font-medium text-slate-600 block">
                    {field.label}
                  </label>
                  <div className="flex gap-2">
                    <input type={field.type} name="value"
                           placeholder={field.current || field.placeholder}
                           className="flex-1 px-4 py-2.5 border rounded-xl text-sm
                                      focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
                    <button type="submit"
                            className="px-4 py-2.5 bg-violet-600 text-white rounded-xl
                                       text-sm font-semibold hover:bg-violet-700 transition-colors">
                      Зберегти
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {field.current && (
                      <span className="text-xs text-green-600 font-medium">✓ Підключено</span>
                    )}
                    <a href={field.link} target="_blank"
                       className="text-xs text-violet-600 hover:text-violet-700">
                      {field.help} →
                    </a>
                  </div>
                </form>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
