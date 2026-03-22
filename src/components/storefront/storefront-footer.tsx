import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

interface StorefrontFooterProps {
  storeName: string;
  storeSlug: string;
}

export function StorefrontFooter({ storeName, storeSlug }: StorefrontFooterProps) {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Логотип/назва магазину */}
          <div className="flex items-center gap-3">
            <Link 
              href={`/${storeSlug}`}
              className="text-lg font-bold hover:text-primary transition-colors"
            >
              {storeName}
            </Link>
            <span className="text-sm text-muted-foreground">
              на Wazo.Market
            </span>
          </div>

          {/* Посилання */}
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <a 
              href={`/${storeSlug}/about`}
              className="hover:text-primary transition-colors"
            >
              Про магазин
            </a>
            <Link 
              href="/delivery"
              className="hover:text-primary transition-colors"
            >
              Доставка
            </Link>
            <Link 
              href="/returns"
              className="hover:text-primary transition-colors"
            >
              Повернення
            </Link>
          </nav>

          {/* Контакти */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:+380000000000`}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Написати</span>
            </a>
            <button
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Уподобане</span>
            </button>
          </div>
        </div>

        {/* Нижня частина */}
        <div className="border-t mt-6 pt-6 text-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {storeName}. Усі права захищено.
          </p>
          <p className="mt-2">
            Працює на базі{" "}
            <Link 
              href="/" 
              className="text-blue-600 hover:underline"
            >
              Wazo.Market
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
