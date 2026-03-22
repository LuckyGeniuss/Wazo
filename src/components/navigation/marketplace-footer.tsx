import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function MarketplaceFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Про маркетплейс */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-bold">Wazo.Market</span>
                <p className="text-xs text-muted-foreground">Український маркетплейс</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Wazo.Market — маркетплейс нового покоління для України, Європи та Казахстану. 
              Тисячі магазинів, мільйони товарів та гарантія безпеки кожної угоди.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-pink-100 hover:text-pink-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-blue-400 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Покупцям */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Покупцям</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  Пошук товарів
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-primary transition-colors">
                  Доставка та оплата
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-primary transition-colors">
                  Повернення та обмін
                </Link>
              </li>
              <li>
                <Link href="/buyer-protection" className="hover:text-primary transition-colors">
                  Захист покупця
                </Link>
              </li>
            </ul>
          </div>

          {/* Компанія */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Компанія</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  Про нас
                </Link>
              </li>
              <li>
                <Link href="/sellers" className="hover:text-primary transition-colors">
                  Для продавців
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Контакти
                </Link>
              </li>
              <li>
                <a href="tel:08001234567" className="hover:text-primary transition-colors">
                  0 800 123 45 67
                </a>
              </li>
            </ul>
          </div>

          {/* Правильна інформація */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Документи</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Умови використання
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Політика конфіденційності
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-primary transition-colors">
                  Політика cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижня частина */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Wazo.Market. Всі права захищено.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Theme:</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
