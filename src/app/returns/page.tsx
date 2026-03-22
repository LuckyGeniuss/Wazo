import { Metadata } from "next";
import { ArrowLeftRight, Clock, FileCheck, Package, Shield, Headphones } from "lucide-react";

export const metadata: Metadata = {
  title: "Повернення та обмін | Wazo.Market",
  description: "Політика повернення та обміну товарів. Поверніть або обміняйте товар протягом 14 днів.",
};

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Повернення та обмін</h1>
        <p className="text-lg text-muted-foreground">
          Якщо товар не підійшов або не сподобся, ви можете поверхнути його протягом 14 днів
        </p>
      </div>

      {/* Основна інформація */}
      <section className="mb-12">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold mb-2">Гарантія поверхнення</h2>
              <p className="text-muted-foreground">
                Ви маєте право поверхнути або обміняти товар протягом <strong>14 календарних днів</strong> з моменту отримання замовлення. 
                Товар повинен бути в оригінальній упаковці, без слідів використання, з усіма ярликами та документами.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <ReturnStep
            icon={<Clock className="w-6 h-6" />}
            step="Крок 1"
            title="Зв'яжіться з нами"
            description="Заповніть форму на поверхнення або зв'яжіться зі службою підтримки"
          />
          <ReturnStep
            icon={<FileCheck className="w-6 h-6" />}
            step="Крок 2"
            title="Отримайте інструкції"
            description="Ми надішлемо вам інструкції щодо пакування та відправки"
          />
          <ReturnStep
            icon={<Package className="w-6 h-6" />}
            step="Крок 3"
            title="Відправте товар"
            description="Відправте товар кур'єром або через пошту за наш рахунок"
          />
        </div>
      </section>

      {/* Умови поверхнення */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Умови поверхнення</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-xl p-6 bg-green-50 border-green-200">
            <h3 className="text-lg font-bold mb-4 text-green-800">✓ Можна поверхнути</h3>
            <ul className="space-y-3">
              <ConditionItem text="Товар не сподобався або не підійшов за розміром" />
              <ConditionItem text="Змінилася думка про покупку" />
              <ConditionItem text="Знайшли дешевше в іншому місці" />
              <ConditionItem text="Отримали товар з дефектом" />
              <ConditionItem text="Не той колір або модель" />
            </ul>
          </div>
          <div className="border rounded-xl p-6 bg-red-50 border-red-200">
            <h3 className="text-lg font-bold mb-4 text-red-800">✗ Не можна поверхнути</h3>
            <ul className="space-y-3">
              <ConditionItem text="Товар вживали або використовували" />
              <ConditionItem text="Зірвані або пошкоджені ярлики" />
              <ConditionItem text="Відсутня оригінальна упаковка" />
              <ConditionItem text="Минув 14-денний термін" />
              <ConditionItem text="Персоналізовані товари" />
            </ul>
          </div>
        </div>
      </section>

      {/* Терміни */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <ArrowLeftRight className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold">Терміни поверхнення коштів</h2>
        </div>
        <div className="space-y-4">
          <div className="border rounded-xl p-6">
            <h3 className="font-bold mb-2">Після отримання товару</h3>
            <p className="text-muted-foreground">
              Поверхнення коштів здійснюється протягом <strong>3-5 робочих днів</strong> після отримання та перевірки поверхнутого товару.
            </p>
          </div>
          <div className="border rounded-xl p-6">
            <h3 className="font-bold mb-2">Спосіб поверхнення</h3>
            <p className="text-muted-foreground">
              Кошти повертаються тим самим способом, яким було здійснено оплату. Якщо оплата була карткою — поверхнення на картку, 
              готівкою — поверхнення готівкою або на картку.
            </p>
          </div>
        </div>
      </section>

      {/* Обмін товару */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Обмін товару</h2>
        <div className="bg-gray-50 rounded-2xl p-8">
          <p className="text-muted-foreground mb-6">
            Якщо ви хочете обміняти товар на аналогічний або інший, будь ласка, зв'яжіться з нашою службою підтримки. 
            Ми допоможемо оформити обмін максимально швидко та зручно для вас.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="mailto:support@wazo.market" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <FileCheck className="w-4 h-4" />
              Написати в підтримку
            </a>
            <a 
              href="tel:08001234567" 
              className="inline-flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Headphones className="w-4 h-4" />
              0 800 123 45 67
            </a>
          </div>
        </div>
      </section>

      {/* Контакти */}
      <section className="bg-blue-50 rounded-2xl p-8">
        <div className="flex items-start gap-4">
          <Headphones className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold mb-2">Питання щодо поверхнення?</h3>
            <p className="text-muted-foreground mb-4">
              Наші менеджери допоможуть з будь-якими питаннями щодо поверхнення та обміну товарів
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:08001234567" className="text-blue-600 hover:underline font-medium">
                0 800 123 45 67
              </a>
              <a href="mailto:support@wazo.market" className="text-blue-600 hover:underline font-medium">
                support@wazo.market
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface ReturnStepProps {
  icon: React.ReactNode;
  step: string;
  title: string;
  description: string;
}

function ReturnStep({ icon, step, title, description }: ReturnStepProps) {
  return (
    <div className="border rounded-xl p-6 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full text-blue-600 mb-4">
        {icon}
      </div>
      <div className="text-sm text-blue-600 font-medium mb-2">{step}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

function ConditionItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-muted-foreground">
      <span className="w-1.5 h-1.5 bg-current rounded-full flex-shrink-0 mt-1" />
      {text}
    </li>
  );
}
