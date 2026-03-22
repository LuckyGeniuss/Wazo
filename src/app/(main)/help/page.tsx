import { Metadata } from "next";
import { Phone, Mail, MessageCircle, Clock, HelpCircle, Book, FileText, Video } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Допомога | Wazo.Market",
  description: "Центр підтримки користувачів Wazo.Market. Знайдіть відповіді на свої запитання та отримайте допомогу.",
};

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero секція */}
      <section className="mb-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
          <HelpCircle className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Центр підтримки
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Знайдіть відповіді на запитання або зв'яжіться з нашою командою підтримки
        </p>
      </section>

      {/* Пошукова рядок */}
      <section className="mb-12">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Пошук відповідей..."
              className="w-full px-6 py-4 pl-12 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Основні розділи */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Категорії допомоги</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <HelpCategoryCard
            icon={<Book className="w-6 h-6" />}
            title="Порадник покупця"
            description="Як замовляти, оплачувати та отримувати товари"
            href="/help/buying"
          />
          <HelpCategoryCard
            icon={<FileText className="w-6 h-6" />}
            title="Порадник продавця"
            description="Створення магазину, додавання товарів, продажі"
            href="/help/selling"
          />
          <HelpCategoryCard
            icon={<Video className="w-6 h-6" />}
            title="Відеоінструкції"
            description="Наочні інструкції з використання платформи"
            href="/help/tutorials"
          />
        </div>
      </section>

      {/* Популярні запитання */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Популярні запитання</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <FAQItem
            question="Як оформити замовлення?"
            answer="Оберіть товар, натисніть 'Купити', заповніть дані доставки та оплати, підтвердіть замовлення."
          />
          <FAQItem
            question="Які способи оплати доступні?"
            answer="Банківська картка, Apple Pay, Google Pay, переказ на рахунок, оплата частинами."
          />
          <FAQItem
            question="Як повернути товар?"
            answer="У кабінеті перейдіть до 'Мої замовлення', оберіть замовлення та натисніть 'Повернути товар'."
          />
          <FAQItem
            question="Як зв'язатися з продавцем?"
            answer="На сторінці товару натисніть 'Запитання продавцю' або знайдіть контакти у картці магазину."
          />
        </div>
      </section>

      {/* Контакти */}
      <section className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 md:p-12 text-white">
        <h2 className="text-2xl font-bold mb-8 text-center">Зв'яжіться з нами</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <p className="text-blue-100 mb-2">Телефон</p>
            <a href="tel:08001234567" className="text-lg font-bold hover:underline">
              0 800 123 45 67
            </a>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <p className="text-blue-100 mb-2">Email</p>
            <a href="mailto:support@wazo.market" className="text-lg font-bold hover:underline">
              support@wazo.market
            </a>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <p className="text-blue-100 mb-2">Чат підтримки</p>
            <button className="text-lg font-bold hover:underline bg-white/20 px-4 py-2 rounded-lg">
              Почати діалог
            </button>
          </div>
        </div>
        <div className="mt-8 text-center text-blue-100 flex items-center justify-center gap-2">
          <Clock className="w-5 h-5" />
          <span>Підтримка працює цілодобово 24/7</span>
        </div>
      </section>
    </div>
  );
}

function HelpCategoryCard({ icon, title, description, href }: { icon: React.ReactNode; title: string; description: string; href: string }) {
  return (
    <Link href={href} className="border rounded-2xl p-6 hover:shadow-lg transition-all hover:border-blue-300 group">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border rounded-2xl p-6">
      <h3 className="font-bold mb-3">{question}</h3>
      <p className="text-sm text-muted-foreground">{answer}</p>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
