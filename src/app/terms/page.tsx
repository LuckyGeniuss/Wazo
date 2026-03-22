import { Metadata } from "next";
import { FileText, User, ShoppingCart, Package, CreditCard, Shield, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Умови використання | Wazo.Market",
  description: "Умови використання платформи Wazo.Market. Правила та положення для покупців і продавців.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold">Умови використання</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Останнє оновлення: 1 січня 2025 року
        </p>
      </div>

      {/* Вступ */}
      <section className="mb-12">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <p className="text-muted-foreground">
            Ласкаво просимо на Wazo.Market! Ці Умови використання регулюють ваші стосунки з 
            нашою платформою. Використовуючи Wazo.Market, ви погоджуєтеся з цими умовами.
          </p>
        </div>
      </section>

      {/* Зміст */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Зміст</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <TermsLink number="1" title="Загальні положення" href="#general" />
          <TermsLink number="2" title="Реєстрація" href="#registration" />
          <TermsLink number="3" title="Для покупців" href="#buyers" />
          <TermsLink number="4" title="Для продавців" href="#sellers" />
          <TermsLink number="5" title="Платежі" href="#payments" />
          <TermsLink number="6" title="Відповідальність" href="#liability" />
          <TermsLink number="7" title="Припинення" href="#termination" />
          <TermsLink number="8" title="Контакти" href="#contacts" />
        </div>
      </section>

      {/* Розділи */}
      <article id="general" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">1. Загальні положення</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <strong>1.1.</strong> Wazo.Market — це багатокористувацька платформа, що об'єднує 
            покупців та продавців для здійснення комерційних угод.
          </p>
          <p>
            <strong>1.2.</strong> Ці Умови застосовуються до всіх користувачів платформи, 
            включаючи покупців, продавців та відвідувачів.
          </p>
          <p>
            <strong>1.3.</strong> Ми залишаємо за собою право змінювати ці Умови в будь-який час. 
            Зміни набирають чинності після публікації на сайті.
          </p>
        </div>
      </article>

      <article id="registration" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold">2. Реєстрація та обліковий запис</h2>
        </div>
        <div className="space-y-4">
          <TermsCard
            title="Вимоги до реєстрації"
            items={[
              "Досягнення 18-річного віку",
              "Надання достовірної інформації",
              "Наявність чинного email та телефону",
              "Погодження з цими Умовами"
            ]}
          />
          <TermsCard
            title="Обов'язки користувача"
            items={[
              "Збереження конфіденційності облікового запису",
              "Повідомлення про несанкціонований доступ",
              "Використання платформи згідно із законом",
              "Утримання від шахрайських дій"
            ]}
          />
        </div>
      </article>

      <article id="buyers" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">3. Для покупців</h2>
        </div>
        <div className="space-y-4">
          <div className="border rounded-xl p-6">
            <h3 className="font-bold mb-3">Правила здійснення покупок:</h3>
            <ul className="space-y-3">
              <ListItem text="Перевіряйте інформацію про товар перед покупкою" />
              <ListItem text="Здійснюйте оплату тільки через платформу" />
              <ListItem text="Зберігайте підтвердження замовлення" />
              <ListItem text="Перевіряйте товар при отриманні" />
              <ListItem text="Повідомляйте про проблеми протягом 14 днів" />
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-bold mb-2">Гарантії покупця:</h3>
            <p className="text-sm text-muted-foreground">
              Покупці Wazo.Market захищені системою гарантованих платежів. 
              Кошти переказуються продавцю тільки після підтвердження отримання товару.
            </p>
          </div>
        </div>
      </article>

      <article id="sellers" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold">4. Для продавців</h2>
        </div>
        <div className="space-y-4">
          <div className="border rounded-xl p-6">
            <h3 className="font-bold mb-3">Вимоги до продавців:</h3>
            <ul className="space-y-3">
              <ListItem text="Реєстрація як суб'єкт господарювання (ФОП/ТОВ)" />
              <ListItem text="Надання достовірної інформації про товари" />
              <ListItem text="Вчасне відвантаження замовлень" />
              <ListItem text="Дотримання гарантійних зобов'язань" />
              <ListItem text="Повага до прав покупців" />
            </ul>
          </div>
          <div className="border rounded-xl p-6">
            <h3 className="font-bold mb-3">Заборонені товари:</h3>
            <ul className="space-y-3">
              <ListItem text="Підроблені або контрафактні товари" />
              <ListItem text="Зброя та вибухові речовини" />
              <ListItem text="Наркотичні речовини" />
              <ListItem text="Товари, що порушують права інтелектуальної власності" />
              <ListItem text="Інші товари, заборонені законодавством" />
            </ul>
          </div>
        </div>
      </article>

      <article id="payments" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <CreditCard className="w-5 h-5 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold">5. Платежі та комісії</h2>
        </div>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <TermsCard
              title="Для покупців"
              items={[
                "Оплата через захищені платіжні системи",
                "Миттєве підтвердження платежу",
                "Поверхнення згідно з політикою",
                "Жодних прихованих комісій"
              ]}
            />
            <TermsCard
              title="Для продавців"
              items={[
                "Комісія платформи від 5% до 15%",
                "Виплати щотижня",
                "Прозора звітність",
                "Можливість повернення"
              ]}
            />
          </div>
        </div>
      </article>

      <article id="liability" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold">6. Відповідальність</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <div className="border rounded-xl p-6">
            <h3 className="font-bold mb-2">Відповідальність платформи:</h3>
            <p className="text-sm">
              Wazo.Market виступає посередником між покупцями та продавцями. 
              Ми не несемо відповідальності за якість товарів, дії продавців або покупців, 
              але вживаємо всіх заходів для забезпечення безпеції угод.
            </p>
          </div>
          <div className="border rounded-xl p-6">
            <h3 className="font-bold mb-2">Обмеження відповідальності:</h3>
            <p className="text-sm">
              Платформа не несе відповідальності за непрямі збитки, втрату прибутку 
              або інші наслідки використання сервісу.
            </p>
          </div>
        </div>
      </article>

      <article id="termination" className="mb-12 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold">7. Припинення доступу</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <strong>7.1.</strong> Ми залишаємо за собою право призупинити або назавжди 
            заблокувати обліковий запис користувача в разі порушення цих Умов.
          </p>
          <p>
            <strong>7.2.</strong> Користувач може в будь-який час видалити свій обліковий 
            запис через налаштування або звернувшись до підтримки.
          </p>
          <p>
            <strong>7.3.</strong> Після видалення облікового запису дані користувача 
            зберігаються згідно з Політикою конфіденційності.
          </p>
        </div>
      </article>

      <article id="contacts" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">8. Контакти</h2>
        <div className="bg-gray-50 rounded-2xl p-6">
          <p className="text-muted-foreground mb-4">
            Якщо у вас виникли питання щодо цих Умов використання, будь ласка, зв'яжіться з нами:
          </p>
          <div className="space-y-2">
            <p><strong>Email:</strong> <a href="mailto:legal@wazo.market" className="text-blue-600 hover:underline">legal@wazo.market</a></p>
            <p><strong>Телефон:</strong> <a href="tel:08001234567" className="text-blue-600 hover:underline">0 800 123 45 67</a></p>
            <p><strong>Адреса:</strong> м. Київ, Україна</p>
          </div>
        </div>
      </article>

      {/* Останнє повідомлення */}
      <section className="border-t pt-8">
        <p className="text-muted-foreground text-sm">
          Використовуючи Wazo.Market, ви підтверджуєте, що прочитали, зрозуміли та погодилися 
          з цими Умовами використання.
        </p>
      </section>
    </div>
  );
}

function TermsLink({ number, title, href }: { number: string; title: string; href: string }) {
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
    <li className="flex items-start gap-2 text-sm">
      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
      <span>{text}</span>
    </li>
  );
}

function TermsCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border rounded-xl p-6">
      <h3 className="font-bold mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
