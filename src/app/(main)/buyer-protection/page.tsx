import { Metadata } from "next";
import { Shield, Lock, Headphones, FileCheck, CheckCircle, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Захист покупця | Wazo.Market",
  description: "Гарантія безпеки ваших покупок. Повний захист коштів та якості товарів на Wazo.Market.",
};

export default function BuyerProtectionPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-blue-100 rounded-2xl">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Захист покупця</h1>
            <p className="text-lg text-muted-foreground">
              Гарантуємо безпеку кожної вашої покупки
            </p>
          </div>
        </div>
      </div>

      {/* Головна гарантія */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Гарантія Wazo.Market</h2>
          <p className="text-blue-100 mb-6">
            Ми повністю захищаємо ваші інтереси як покупця. Кожна транзакція на нашому маркетплейсі 
            захищена системою гарантованих платежів.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <ProtectionFeature
              icon={<Lock className="w-6 h-6" />}
              title="Безпечна оплата"
              description="Ваші кошти в безпеці до отримання товару"
            />
            <ProtectionFeature
              icon={<CheckCircle className="w-6 h-6" />}
              title="Перевірені продавці"
              description="Усі продавці проходять ретельну перевірку"
            />
            <ProtectionFeature
              icon={<AlertCircle className="w-6 h-6" />}
              title="Гарантія якості"
              description="Повернення коштів у разі проблем"
            />
          </div>
        </div>
      </section>

      {/* Як працює захист */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Як працює захист покупця</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <ProtectionStep
            number="1"
            title="Замовлення"
            description="Ви оформлюєте замовлення та оплачуєте через захищену систему"
          />
          <ProtectionStep
            number="2"
            title="Блокування"
            description="Кошти тимчасово блокуються на рахунку до отримання товару"
          />
          <ProtectionStep
            number="3"
            title="Отримання"
            description="Ви отримуєте та перевіряєте товар"
          />
          <ProtectionStep
            number="4"
            title="Підтвердження"
            description="Після підтвердження кошти переказуються продавцю"
          />
        </div>
      </section>

      {/* Що захищено */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Що захищено</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <ProtectionCard
            title="Фінансова безпека"
            items={[
              "Повне поверхнення коштів при невідповідності товару",
              "Захист від шахрайства",
              "Безпечні платежі через перевірених провайдерів",
              "Конфіденційність платіжних даних"
            ]}
          />
          <ProtectionCard
            title="Якість товарів"
            items={[
              "Гарантія оригінальності товарів",
              "Відповідність опису та фото",
              "Перевірка термінів придатності",
              "Гарантійне обслуговування"
            ]}
          />
          <ProtectionCard
            title="Доставка"
            items={[
              "Відстеження посилки",
              "Страхування вартості",
              "Захист від втрати посилки",
              "Компенсація затримки"
            ]}
          />
          <ProtectionCard
            title="Підтримка"
            items={[
              "Допомога 24/7",
              "Вирішення суперечок",
              "Медіація між покупцем і продавцем",
              "Юридичний супровід"
            ]}
          />
        </div>
      </section>

      {/* Випадки покриття */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Випадки гарантованого поверхнення</h2>
        <div className="border rounded-2xl divide-y">
          <CoverageItem
            icon={<FileCheck className="w-5 h-5" />}
            title="Товар не прийшов"
            description="Якщо товар не прийшов у зазначений термін, ми поверхнемо повну вартість"
          />
          <CoverageItem
            icon={<AlertCircle className="w-5 h-5" />}
            title="Товар не відповідає опису"
            description="Якщо отриманий товар відрізняється від опису або фото на сайті"
          />
          <CoverageItem
            icon={<Shield className="w-5 h-5" />}
            title="Підроблений товар"
            description="При виявленні підробки — повне поверхнення плюс компенсація"
          />
          <CoverageItem
            icon={<Lock className="w-5 h-5" />}
            title="Шахрайство продавця"
            description="Повний захист у разі шахрайських дій з боку продавця"
          />
        </div>
      </section>

      {/* Поради покупцям */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Поради для безпечних покупок</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <ul className="space-y-4">
            <SafetyTip
            number={1}
            text="Завжди перевіряйте рейтинг та відгуки про продавця перед покупкою"
            />
            <SafetyTip
            number={2}
            text="Уважно вивчайте опис товару, фото та умови доставки"
            />
            <SafetyTip
            number={3}
            text="Не погоджуйтесь на оплату поза системою маркетплейсу"
            />
            <SafetyTip
            number={4}
            text="Зберігайте всі листування та документи щодо замовлення"
            />
            <SafetyTip
            number={5}
            text="Перевіряйте товар при отриманні перед підписанням документів"
            />
          </ul>
        </div>
      </section>

      {/* Контакти */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <div className="flex items-start gap-4">
          <Headphones className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold mb-2">Потрібна допомога?</h3>
            <p className="text-muted-foreground mb-4">
              Наша служба підтримки готова допомогти з будь-якими питаннями щодо захисту покупців
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

function ProtectionFeature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/10 rounded-xl p-4">
      <div className="text-white mb-3">{icon}</div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-blue-100 text-sm">{description}</p>
    </div>
  );
}

function ProtectionStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600 font-bold">
        {number}
      </div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function ProtectionCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CoverageItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 flex items-start gap-4">
      <div className="p-2 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function SafetyTip({ number, text }: { number: number; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-800 text-sm font-bold flex-shrink-0">
        {number}
      </span>
      <span className="text-yellow-900">{text}</span>
    </li>
  );
}
