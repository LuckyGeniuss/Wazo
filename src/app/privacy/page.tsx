import { Metadata } from "next";
import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Політика конфіденційності | Wazo.Market",
  description: "Політика конфіденційності Wazo.Market. Дізнайтеся, як ми захищаємо ваші персональні дані.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold">Політика конфіденційності</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Останнє оновлення: 1 січня 2025 року
        </p>
      </div>

      {/* Вступ */}
      <section className="mb-12">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <p className="text-muted-foreground">
            Wazo.Market (надалі — «Ми», «Нас» або «Наш») поважає вашу конфіденційність та прагне 
            захищати ваші персональні дані. Ця Політика конфіденційності пояснює, як ми збираємо, 
            використовуємо та захищаємо вашу інформацію.
          </p>
        </div>
      </section>

      {/* Зміст */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Зміст</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <PrivacyLink number="1" title="Які дані ми збираємо" href="#data-collection" />
          <PrivacyLink number="2" title="Як ми використовуємо дані" href="#data-usage" />
          <PrivacyLink number="3" title="Захист даних" href="#data-protection" />
          <PrivacyLink number="4" title="Cookies та стеження" href="#cookies" />
          <PrivacyLink number="5" title="Права користувачів" href="#user-rights" />
          <PrivacyLink number="6" title="Контакти" href="#contacts" />
        </div>
      </section>

      {/* Розділи */}
      <article id="data-collection" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Database className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">1. Які дані ми збираємо</h2>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="font-bold mb-2">Персональна інформація:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <ListItem text="Ім'я та прізвище" />
              <ListItem text="Електронна пошта" />
              <ListItem text="Номер телефону" />
              <ListItem text="Адреса доставки" />
              <ListItem text="Платіжна інформація" />
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Технічна інформація:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <ListItem text="IP-адреса та тип пристрою" />
              <ListItem text="Браузер та операційна система" />
              <ListItem text="Історія відвідування сайту" />
              <ListItem text="Дані про замовлення та покупки" />
            </ul>
          </div>
        </div>
      </article>

      <article id="data-usage" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold">2. Як ми використовуємо дані</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Ми використовуємо зібрану інформацію для:
        </p>
        <ul className="space-y-3">
          <UsageItem 
            title="Обробки замовлень" 
            text="Для оформлення, доставки та супроводу ваших покупок" 
          />
          <UsageItem 
            title="Комунікації" 
            text="Для надсилання сповіщень, відповідей на запити та підтримки" 
          />
          <UsageItem 
            title="Покращення сервісу" 
            text="Для аналізу використання та вдосконалення наших послуг" 
          />
          <UsageItem 
            title="Безпеки" 
            text="Для запобіг шахрайству та захисту облікових записів" 
          />
          <UsageItem 
            title="Маркетингу" 
            text="Для надсилання акційних пропозицій (за вашою згодою)" 
          />
        </ul>
      </article>

      <article id="data-protection" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Lock className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold">3. Захист даних</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Ми вживаємо таких заходів для захисту ваших даних:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <ProtectionCard title="Шифрування" description="Усі дані передаються через захищені SSL-з'єднання" />
          <ProtectionCard title="Зберігання" description="Дані зберігаються на захищених серверах в ЄС" />
          <ProtectionCard title="Доступ" description="Обмежений доступ для авторизованого персоналу" />
          <ProtectionCard title="Моніторинг" description="Постійний нагляд за безпекою систем" />
        </div>
      </article>

      <article id="cookies" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FileText className="w-5 h-5 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold">4. Cookies та стеження</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Ми використовуємо cookies для:
        </p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <ListItem text="Збереження налаштувань користувача" />
          <ListItem text="Аналізу відвідуваності та поведінки" />
          <ListItem text="Персоналізації контенту та реклами" />
          <ListItem text="Забезпечення безпеки" />
        </ul>
        <p className="text-muted-foreground">
          Ви можете керувати налаштуваннями cookies у своєму браузері. 
          Більшість браузерів дозволяють блокувати або видаляти cookies.
        </p>
      </article>

      <article id="user-rights" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">5. Ваші права</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Ви маєте право:
        </p>
        <ul className="space-y-3">
          <RightItem title="Отримати доступ" description="Дізнатися, які дані ми зберігаємо про вас" />
          <RightItem title="Виправлення" description="Виправити неповні або неправильні дані" />
          <RightItem title="Видалення" description="Запитати видалення ваших персональних даних" />
          <RightItem title="Обмеження" description="Обмежити обробку ваших даних" />
          <RightItem title="Переносимість" description="Отримати копію даних у структурованому форматі" />
          <RightItem title="Заперечення" description="Заперечувати проти обробки даних" />
        </ul>
      </article>

      <article id="contacts" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold">6. Контакти</h2>
        </div>
        <div className="bg-gray-50 rounded-2xl p-6">
          <p className="text-muted-foreground mb-4">
            Якщо у вас виникли питання щодо цієї Політики конфіденційності або ви хочете 
            скористатися своїми правами, будь ласка, зв'яжіться з нами:
          </p>
          <div className="space-y-2">
            <p><strong>Email:</strong> <a href="mailto:privacy@wazo.market" className="text-blue-600 hover:underline">privacy@wazo.market</a></p>
            <p><strong>Телефон:</strong> <a href="tel:08001234567" className="text-blue-600 hover:underline">0 800 123 45 67</a></p>
            <p><strong>Адреса:</strong> м. Київ, Україна</p>
          </div>
        </div>
      </article>

      {/* Додаткова інформація */}
      <section className="border-t pt-8">
        <h2 className="text-xl font-bold mb-4">Зміни до Політики конфіденційності</h2>
        <p className="text-muted-foreground mb-4">
          Ми можемо періодично оновлювати цю Політику конфіденційності. 
          Про будь-які зміни ми повідомимо вас на сайті та/або електронною поштою.
        </p>
        <p className="text-muted-foreground">
          Використовуючи Wazo.Market, ви погоджуєтеся з цією Політикою конфіденційності.
        </p>
      </section>
    </div>
  );
}

function PrivacyLink({ number, title, href }: { number: string; title: string; href: string }) {
  return (
    <a 
      href={href}
      className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors"
    >
      <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
        {number}
      </span>
      <span className="text-sm font-medium">{title}</span>
    </a>
  );
}

function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
      <span>{text}</span>
    </li>
  );
}

function UsageItem({ title, text }: { title: string; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold flex-shrink-0">
        ✓
      </span>
      <div>
        <strong className="text-foreground">{title}</strong>
        <p className="text-muted-foreground text-sm">{text}</p>
      </div>
    </li>
  );
}

function ProtectionCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="border rounded-xl p-4">
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function RightItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="border rounded-xl p-4">
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
