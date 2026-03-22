import { Metadata } from "next";
import { Truck, CreditCard, Package, Clock, Shield, Headphones } from "lucide-react";

export const metadata: Metadata = {
  title: "Доставка та оплата | Wazo.Market",
  description: "Інформація про способи доставки та оплати на Wazo.Market. Зручні варіанти доставки по всій Україні.",
};

export default function DeliveryPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Доставка та оплата</h1>
        <p className="text-lg text-muted-foreground">
          Обирайте зручний спосіб доставки та оплати для ваших замовлень
        </p>
      </div>

      {/* Способи доставки */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Truck className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold">Способи доставки</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <DeliveryCard
            icon={<Truck className="w-6 h-6" />}
            title="Кур'єрська доставка"
            description="Доставка до дверей вашого будинку або офісу"
            features={["Термін: 1-3 дні", "Вартість: від 60 грн", "Безкоштовно від 1500 грн"]}
          />
          <DeliveryCard
            icon={<Package className="w-6 h-6" />}
            title="Відділення пошти"
            description="Отримайте замовлення у найближчому відділенні"
            features={["Термін: 1-4 дні", "Вартість: від 45 грн", "Безкоштовно від 1200 грн"]}
          />
          <DeliveryCard
            icon={<Clock className="w-6 h-6" />}
            title="Експрес-доставка"
            description="Термінова доставка в день замовлення"
            features={["Термін: до 24 годин", "Вартість: від 120 грн", "Доступно у великих містах"]}
          />
          <DeliveryCard
            icon={<Shield className="w-6 h-6" />}
            title="Самовивіз"
            description="Замовлення з магазину або пункту видачі"
            features={["Термін: 1-2 дні", "Вартість: безкоштовно", "Зручний графік роботи"]}
          />
        </div>
      </section>

      {/* Способи оплати */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-xl">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Способи оплати</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <PaymentCard
            title="Банківською карткою"
            description="Приймаємо картки Visa, Mastercard, Apple Pay та Google Pay"
            icon="💳"
          />
          <PaymentCard
            title="При отриманні"
            description="Оплата готівкою або карткою при отриманні замовлення"
            icon="💵"
          />
          <PaymentCard
            title="Безконтактно"
            description="Швидка оплата через NFC або QR-код"
            icon="📱"
          />
        </div>
      </section>

      {/* Інформація */}
      <section className="bg-gray-50 rounded-2xl p-8 mb-12">
        <div className="flex items-start gap-4 mb-6">
          <Headphones className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold mb-2">Підтримка</h3>
            <p className="text-muted-foreground mb-4">
              Наші менеджери готові відповісти на ваші запитання з питань доставки та оплати
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

      {/* Умови доставки */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Загальні умови доставки</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">1. Терміни доставки:</strong> Замовлення доставляються протягом 1-5 робочих днів з моменту підтвердження замовлення.
          </p>
          <p>
            <strong className="text-foreground">2. Відстеження:</strong> Після відправки замовлення ви отримаєте трек-номер для відстеження посилки.
          </p>
          <p>
            <strong className="text-foreground">3. Отримання:</strong> При отриманні замовлення перевіте цілісність упаковки та наявність товару.
          </p>
          <p>
            <strong className="text-foreground">4. Недостача:</strong> У разі виявлення нестачі або пошкодження товару, будь ласка, зв'яжіться з нашою службою підтримки.
          </p>
        </div>
      </section>
    </div>
  );
}

interface DeliveryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

function DeliveryCard({ icon, title, description, features }: DeliveryCardProps) {
  return (
    <div className="border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">{icon}</div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="text-muted-foreground mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface PaymentCardProps {
  title: string;
  description: string;
  icon: string;
}

function PaymentCard({ title, description, icon }: PaymentCardProps) {
  return (
    <div className="border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
