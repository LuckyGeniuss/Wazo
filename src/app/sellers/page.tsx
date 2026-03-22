import { Metadata } from "next";
import { Store, TrendingUp, Shield, Zap, Users, DollarSign, BarChart3, Headphones, Package, CreditCard } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Для продавців | Wazo.Market",
  description: "Відкрийте свій магазин на Wazo.Market. Потужні інструменти для торгівлі, мільйони покупців, прозорі умови.",
};

export default function SellersPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero */}
      <section className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Store className="w-4 h-4" />
          Wazo.Market для бізнесу
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Відкрийте свій магазин на Wazo.Market
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Долучайтеся до провідного українського маркетплейсу. 
          Мільйони покупців, потужні інструменти та підтримка на кожному етапі.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link 
            href="/register" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Відкрити магазин
            <TrendingUp className="w-5 h-5" />
          </Link>
          <a 
            href="#features" 
            className="inline-flex items-center gap-2 border border-gray-300 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors font-medium"
          >
            Дізнатися більше
          </a>
        </div>
      </section>

      {/* Статистика */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem number="10 000+" label="Активних продавців" />
            <StatItem number="1M+" label="Покупців щомісяця" />
            <StatItem number="500K+" label="Товарів на платформі" />
            <StatItem number="98%" label="Задоволених партнерів" />
          </div>
        </div>
      </section>

      {/* Переваги */}
      <section id="features" className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Чому обирають Wazo.Market</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Зростання продажів"
            description="Отримайте доступ до мільйонів активних покупців та збільште виручку"
          />
          <FeatureCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Прозорі умови"
            description="Фікована комісія, жодних прихованих платежів. Оплата тільки за результат"
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Потужна аналітика"
            description="Стежте за продажами, попитом та ефективністю в реальному часі"
          />
          <FeatureCard
            icon={<Package className="w-6 h-6" />}
            title="Логістика"
            description="Інтеграція з провідними службами доставки. Автоматичне оформлення"
          />
          <FeatureCard
            icon={<CreditCard className="w-6 h-6" />}
            title="Швидкі виплати"
            description="Отримуйте кошти на рахунок одразу після підтвердження замовлення"
          />
          <FeatureCard
            icon={<Headphones className="w-6 h-6" />}
            title="Підтримка 24/7"
            description="Допомога з будь-яких питань. Персональний менеджер для великих партнерів"
          />
        </div>
      </section>

      {/* Як почати */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Як почати продавати</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <StepCard
            number="1"
            title="Реєстрація"
            description="Створіть обліковий запис за 5 хвилин"
          />
          <StepCard
            number="2"
            title="Налаштування"
            description="Заповніть профіль магазину та додайте товари"
          />
          <StepCard
            number="3"
            title="Перші продажі"
            description="Отримуйте замовлення та обробляйте їх"
          />
          <StepCard
            number="4"
            title="Прибуток"
            description="Отримуйте кошти на рахунок щотижня"
          />
        </div>
      </section>

      {/* Тарифи */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Умови співпраці</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard
            title="Старт"
            commission="8%"
            description="Для нових продавців"
            features={[
              "Комісія з продажу",
              "Базова аналітика",
              "Підтримка в чаті",
              "До 100 товарів"
            ]}
          />
          <PricingCard
            title="Бізнес"
            commission="5%"
            description="Для активних продажів"
            features={[
              "Знижена комісія",
              "Розширена аналітика",
              "Пріоритетна підтримка",
              "Необмежена кількість товарів",
              "Просування в каталозі"
            ]}
            popular
          />
          <PricingCard
            title="Преміум"
            commission="Інд."
            description="Для великих партнерів"
            features={[
              "Індивідуальна комісія",
              "Персональний менеджер",
              "VIP-підтримка",
              "Пріоритетне розміщення",
              "Рекламні інструменти",
              "API доступ"
            ]}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          * Комісія залежить від категорії товарів. Деталі в договорі оферти.
        </p>
      </section>

      {/* Для кого */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Wazo.Market для</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Підприємців</h3>
            <p className="text-muted-foreground mb-4">
              Відкрийте онлайн-магазин без інвестицій у розробку сайту. 
              Використовуйте готову інфраструктуру та клієнтську базу.
            </p>
            <ul className="space-y-2">
              <ListItem text="Швидкий старт бізнесу" />
              <ListItem text="Мінімальні вкладення" />
              <ListItem text="Готові інструменти продажів" />
            </ul>
          </div>
          <div className="border rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Виробників</h3>
            <p className="text-muted-foreground mb-4">
              Знайдіть нові канали збуту. Безпосередньо спілкуйтеся з покупцями 
              та контролюйте свій бренд.
            </p>
            <ul className="space-y-2">
              <ListItem text="Прямі продажі без посередників" />
              <ListItem text="Контроль цін та бренду" />
              <ListItem text="Зворотний зв'язок від клієнтів" />
            </ul>
          </div>
        </div>
      </section>

      {/* Гарантії */}
      <section className="mb-16">
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold">Гарантії для партнерів</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold mb-2">Прозорість</h3>
              <p className="text-sm text-muted-foreground">
                Повна прозорість угод, комісій та виплат. Доступ до детальної звітності.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Безпека</h3>
              <p className="text-sm text-muted-foreground">
                Захист від шахрайства. Гарантовані виплати незалежно від оплати покупця.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Підтримка</h3>
              <p className="text-sm text-muted-foreground">
                Допомога на всіх етапах: від налаштування магазину до масштабування бізнесу.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6">Готові почати?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Приєднуйтеся до Wazo.Market сьогодні та отримайте доступ до мільйонів покупців
        </p>
        <Link 
          href="/register" 
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          Відкрити магазин безкоштовно
          <Zap className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold mb-2">{number}</div>
      <div className="text-blue-100 text-sm">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="border rounded-2xl p-6 hover:shadow-lg transition-shadow">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
        {number}
      </div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function PricingCard({ title, commission, description, features, popular }: { title: string; commission: string; description: string; features: string[]; popular?: boolean }) {
  return (
    <div className={`border rounded-2xl p-8 ${popular ? 'border-blue-600 bg-blue-50' : ''}`}>
      {popular && (
        <div className="inline-block bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
          Популярний
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="mb-2">
        <span className="text-3xl font-bold">{commission}</span>
        {commission !== 'Інд.' && <span className="text-muted-foreground"> комісії</span>}
      </div>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <CheckIcon />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-muted-foreground text-sm">
      <CheckIcon />
      {text}
    </li>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
