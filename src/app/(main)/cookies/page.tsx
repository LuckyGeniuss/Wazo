import { Metadata } from "next";
import { Cookie, Settings, Shield, Trash2, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Політика cookies | Wazo.Market",
  description: "Політика використання cookies на Wazo.Market. Дізнайтеся, які cookies ми використовуємо та як ними керувати.",
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Cookie className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold">Політика cookies</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Останнє оновлення: 1 січня 2025 року
        </p>
      </div>

      {/* Вступ */}
      <section className="mb-12">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <p className="text-muted-foreground">
            Ця сторінка пояснює, що таке cookies, які cookies ми використовуємо на Wazo.Market, 
            чому ми їх використовуємо та як ви можете керувати своїми уподобаннями.
          </p>
        </div>
      </section>

      {/* Що таке cookies */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Що таке cookies?</h2>
        <p className="text-muted-foreground mb-4">
          Cookies — це невеликі текстові файли, які зберігаються на вашому пристрої 
          (комп'ютері, смартфоні або планшеті) під час відвідування вебсайтів.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <InfoCard
            icon="🍪"
            title="Сесійні"
            description="Тимчасові cookies, які видаляються після завершення сеансу"
          />
          <InfoCard
            icon="📝"
            title="Постійні"
            description="Залишаються на пристрої протягом вказаного терміну або до видалення"
          />
          <InfoCard
            icon="🔒"
            title="Безпечні"
            description="Передаються тільки через захищене HTTPS-з'єднання"
          />
        </div>
      </section>

      {/* Які cookies ми використовуємо */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Які cookies ми використовуємо</h2>
        <div className="space-y-6">
          <CookieCategory
            type="Необхідні"
            icon={<Settings className="w-5 h-5" />}
            description="Ці cookies необхідні для роботи сайту. Без них сайт не може функціонувати правильно."
            items={[
              "Аутентифікація користувачів",
              "Збереження кошика покупок",
              "Налаштування безпеки",
              "Балансування навантаження"
            ]}
            canDisable={false}
          />
          <CookieCategory
            type="Функціональні"
            icon={<Settings className="w-5 h-5" />}
            description="Ці cookies дозволяють сайту запам'ятовувати ваші уподобання та налаштування."
            items={[
              "Мовні уподобання",
              "Регіональні налаштування",
              "Налаштування відображення",
              "Збереження історії переглядів"
            ]}
            canDisable={true}
          />
          <CookieCategory
            type="Аналітичні"
            icon={<Settings className="w-5 h-5" />}
            description="Допомагають нам зрозуміти, як відвідувачі використовують сайт, щоб покращити його."
            items={[
              "Кількість відвідувачів",
              "Тривалість сеансів",
              "Популярні сторінки",
              "Шляхи навігації"
            ]}
            canDisable={true}
          />
          <CookieCategory
            type="Маркетингові"
            icon={<Settings className="w-5 h-5" />}
            description="Використовуються для показу релевантної реклами та відстеження ефективності кампаній."
            items={[
              "Персоналізована реклама",
              "Відстеження конверсій",
              "Ретаргетинг",
              "Соціальні мережі"
            ]}
            canDisable={true}
          />
        </div>
      </section>

      {/* Тривалість зберігання */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Тривалість зберігання cookies</h2>
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold">Тип cookie</th>
                <th className="text-left p-4 font-semibold">Термін дії</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <TableRow type="Сесійні" duration="До завершення сеансу" />
              <TableRow type="Аутентифікація" duration="7 днів" />
              <TableRow type="Уподобання" duration="1 рік" />
              <TableRow type="Аналітика" duration="2 роки" />
              <TableRow type="Маркетинг" duration="90 днів" />
            </tbody>
          </table>
        </div>
      </section>

      {/* Керування cookies */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Як керувати cookies</h2>
        <div className="space-y-6">
          <div className="border rounded-xl p-6">
            <h3 className="font-bold mb-4">Налаштування в браузері</h3>
            <p className="text-muted-foreground mb-4">
              Більшість браузерів дозволяють вам керувати cookies через свої налаштування:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <BrowserGuide browser="Chrome" path="Налаштування → Конфіденційність → Cookies" />
              <BrowserGuide browser="Firefox" path="Налаштування → Приватність → Cookies" />
              <BrowserGuide browser="Safari" path="Налаштування → Конфіденційність → Cookies" />
              <BrowserGuide browser="Edge" path="Налаштування → Конфіденційність → Cookies" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold mb-2">Налаштування на сайті</h3>
            <p className="text-muted-foreground">
              Ви можете змінити свої уподобання щодо cookies в будь-який час через 
              <a href="#" className="text-blue-600 hover:underline ml-1">Налаштування cookies</a>
              на нашому сайті.
            </p>
          </div>
        </div>
      </section>

      {/* Сторонні cookies */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Сторонні cookies</h2>
        <p className="text-muted-foreground mb-4">
          Деякі cookies на нашому сайті встановлюються третіми сторонами, такими як:
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <ThirdPartyCard name="Google Analytics" purpose="Аналітика" />
          <ThirdPartyCard name="Facebook Pixel" purpose="Маркетинг" />
          <ThirdPartyCard name="Stripe" purpose="Платежі" />
        </div>
        <p className="text-muted-foreground mt-4 text-sm">
          Ці треті сторони можуть збирати інформацію про ваші дії на нашому сайті та 
          використовувати її для своїх цілей згідно з їхніми політиками конфіденційності.
        </p>
      </section>

      {/* Висновки */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Ваші права</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <p className="text-muted-foreground mb-4">
            Ви маєте право:
          </p>
          <ul className="space-y-2">
            <RightItem text="Дізнатися, які cookies ми використовуємо" />
            <RightItem text="Дозволити або заборонити певні типи cookies" />
            <RightItem text="Видалити cookies у будь-який час" />
            <RightItem text="Отримати копію збережених даних" />
          </ul>
        </div>
      </section>

      {/* Контакти */}
      <section className="bg-gray-50 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Контакти</h2>
        <p className="text-muted-foreground mb-4">
          Якщо у вас виникли питання щодо цієї Політики cookies, будь ласка, зв'яжіться з нами:
        </p>
        <div className="space-y-2">
          <p><strong>Email:</strong> <a href="mailto:privacy@wazo.market" className="text-blue-600 hover:underline">privacy@wazo.market</a></p>
          <p><strong>Телефон:</strong> <a href="tel:08001234567" className="text-blue-600 hover:underline">0 800 123 45 67</a></p>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="border rounded-xl p-4 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function CookieCategory({ type, icon, description, items, canDisable }: { 
  type: string; 
  icon: React.ReactNode; 
  description: string; 
  items: string[];
  canDisable: boolean;
}) {
  return (
    <div className="border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            {icon}
          </div>
          <h3 className="text-lg font-bold">{type}</h3>
        </div>
        <div className="flex items-center gap-2">
          {canDisable ? (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <Check className="w-4 h-4" />
              Можна вимкнути
            </span>
          ) : (
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Обов'язкові
            </span>
          )}
        </div>
      </div>
      <p className="text-muted-foreground mb-4">{description}</p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TableRow({ type, duration }: { type: string; duration: string }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-4 border-r">{type}</td>
      <td className="p-4">{duration}</td>
    </tr>
  );
}

function BrowserGuide({ browser, path }: { browser: string; path: string }) {
  return (
    <div className="border rounded-lg p-3">
      <h4 className="font-medium mb-1">{browser}</h4>
      <p className="text-sm text-muted-foreground">{path}</p>
    </div>
  );
}

function ThirdPartyCard({ name, purpose }: { name: string; purpose: string }) {
  return (
    <div className="border rounded-xl p-4">
      <h4 className="font-bold mb-1">{name}</h4>
      <p className="text-sm text-muted-foreground">{purpose}</p>
    </div>
  );
}

function RightItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-muted-foreground">
      <Check className="w-4 h-4 text-green-600" />
      {text}
    </li>
  );
}
