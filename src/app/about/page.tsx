import { Metadata } from "next";
import { Users, Target, Heart, Shield, Zap, Award, TrendingUp, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Про нас | Wazo.Market",
  description: "Wazo.Market — український маркетплейс нового покоління. Дізнайтеся про нашу місію, цінності та команду.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero секція */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Wazo.Market — маркетплейс нового покоління
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Створюємо єдиний простір для покупців та продавців, де кожна угода — це крок до успіху
        </p>
      </section>

      {/* Місія */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Наша місія</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Ми віримо, що торгівля має бути доступною, прозорою та вигідною для всіх. 
              Саме тому створили платформу, яка поєднує потужні інструменти для продавців 
              та зручність для покупців.
            </p>
            <p className="text-lg text-muted-foreground">
              Wazo.Market — це український маркетплейс, який об'єднує тисячі магазинів 
              та мільйони товарів по всій країні.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white">
            <div className="grid grid-cols-2 gap-6">
              <StatItem number="1000+" label="Перевірених продавців" />
              <StatItem number="50 000+" label="Товарів на платформі" />
              <StatItem number="24/7" label="Підтримка клієнтів" />
              <StatItem number="100%" label="Гарантія безпеки" />
            </div>
          </div>
        </div>
      </section>

      {/* Цінності */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Наші цінності</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ValueCard
            icon={<Heart className="w-6 h-6" />}
            title="Клієнтоорієнтованість"
            description="Ваше задоволення — наш пріоритет. Ми завжди готові допомогти та вдосконалити сервіс."
          />
          <ValueCard
            icon={<Shield className="w-6 h-6" />}
            title="Безпека"
            description="Гарантуємо захист коштів та особистих даних кожної транзакції."
          />
          <ValueCard
            icon={<Zap className="w-6 h-6" />}
            title="Швидкість"
            description="Швидка доставка, миттєва підтримка та оперативне вирішення будь-яких питань."
          />
          <ValueCard
            icon={<Award className="w-6 h-6" />}
            title="Якість"
            description="Ретельно відбираємо продавців та контролюємо якість товарів."
          />
        </div>
      </section>

      {/* Переваги */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Чому обирають Wazo.Market</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <AdvantageCard
            icon={<Globe className="w-8 h-8" />}
            title="Єдиний простір"
            description="Тисячі магазинів в одному місці. Порівнюйте, обирайте та купуйте зручно."
          />
          <AdvantageCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Ріст бізнесу"
            description="Допомагаємо продавцям збільшувати продажі та знаходити нових клієнтів."
          />
          <AdvantageCard
            icon={<Users className="w-8 h-8" />}
            title="Довіра"
            description="Система рейтингів та відгуків гарантує прозорість угод."
          />
        </div>
      </section>

      {/* Для кого Wazo.Market */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Wazo.Market для</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Покупців</h3>
            <ul className="space-y-3">
              <ListItem text="Величезний вибір товарів" />
              <ListItem text="Конкурентні ціни" />
              <ListItem text="Швидка доставка по Україні" />
              <ListItem text="Гарантія поверхнення" />
              <ListItem text="Ц цілодобова підтримка" />
            </ul>
          </div>
          <div className="border rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Продавців</h3>
            <ul className="space-y-3">
              <ListItem text="Готовий інструментарій для торгівлі" />
              <ListItem text="Мільйони потенційних покупців" />
              <ListItem text="Прозора система комісій" />
              <ListItem text="Аналітика та звітність" />
              <ListItem text="Підтримка на всіх етапах" />
            </ul>
          </div>
        </div>
      </section>

      {/* Контакти */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Зв'яжіться з нами</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Email</p>
            <a href="mailto:info@wazo.market" className="text-blue-600 hover:underline font-medium">
              info@wazo.market
            </a>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Телефон</p>
            <a href="tel:08001234567" className="text-blue-600 hover:underline font-medium">
              0 800 123 45 67
            </a>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Адреса</p>
            <p className="font-medium">м. Київ, Україна</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold mb-1">{number}</div>
      <div className="text-blue-100 text-sm">{label}</div>
    </div>
  );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function AdvantageCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-muted-foreground">
      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      {text}
    </li>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
