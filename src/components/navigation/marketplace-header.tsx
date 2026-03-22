"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Search, User, Menu, LogOut, Package, Settings, LayoutDashboard, MapPin, Phone, HelpCircle, Heart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { CurrencySwitcher } from "./currency-switcher";
import { InstallPwaButton } from "@/components/ui/install-pwa-button";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { SearchDropdown } from "./search-dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CategoryMenu } from "./category-menu";

export function MarketplaceHeader() {
  const cart = useCart();
  const { data: session } = useSession();

  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    setCartCount(cart.items.reduce((total, item) => total + item.quantity, 0));

    const handleCartUpdated = () => {
      setCartCount(cart.items.reduce((total, item) => total + item.quantity, 0));
    };

    window.addEventListener('cart-updated', handleCartUpdated);
    return () => window.removeEventListener('cart-updated', handleCartUpdated);
  }, [cart.items]);

  const cartItemsCount = mounted ? cartCount : 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b">
      {/* Рядок 1: Топ-бар з інформацією */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="container flex h-8 items-center justify-between px-4 md:px-6 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-600">
              <MapPin className="w-3.5 h-3.5" />
              <span>Доставка: <span className="font-medium">Київ, вул. Хрещатик, 1</span></span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-gray-600">
              <Phone className="w-3.5 h-3.5" />
              <span className="font-medium">0 800 123 45 67</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/help" className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors">
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Допомога</span>
            </Link>
            <Link href="/compare" className="text-gray-600 hover:text-gray-900 transition-colors hidden sm:inline">
              Порівняння
            </Link>
            <Link href="/favorites" className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors">
              <Heart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Обране</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Рядок 2: Основний header */}
      <div className="container flex h-16 items-center gap-6 px-4 md:px-6">
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Wazo.Market
            </span>
            <p className="text-[10px] text-gray-500 -mt-1">Український маркетплейс</p>
          </div>
        </Link>

        {/* Пошук */}
        <SearchDropdown />

        {/* Дії */}
        <nav className="flex items-center gap-2 md:gap-4">
          {/* Мобільний пошук */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <div className="hidden md:flex items-center gap-2">
            <CurrencySwitcher />
          </div>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-medium text-white">
                  {cartItemsCount}
                </span>
              )}
              <span className="sr-only">Кошик</span>
            </Button>
          </Link>

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                    <AvatarFallback>{session.user.name?.charAt(0) || <User className="h-4 w-4" />}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Особистий кабінет</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders" className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    <span>Замовлення</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favorites" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Обране</span>
                  </Link>
                </DropdownMenuItem>
                {(session.user.role === "SELLER" || session.user.role === "ADMIN" || session.user.role === "SUPERADMIN") ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>CRM →</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Вийти</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                Увійти
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Меню</span>
          </Button>
        </nav>
      </div>

      {/* Рядок 3: Навігація категорій */}
      <div className="container flex h-11 items-center gap-6 px-4 md:px-6 border-t border-gray-100">
        <CategoryMenu />
        
        <nav className="hidden lg:flex items-center gap-6 text-sm">
          <Link href="/promotions" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            Акції
          </Link>
          <Link href="/new" className="text-gray-700 hover:text-blue-600 transition-colors">
            Новинки
          </Link>
          <Link href="/bestsellers" className="text-gray-700 hover:text-blue-600 transition-colors">
            Хіти продажів
          </Link>
          <Link href="/outlet" className="text-gray-700 hover:text-blue-600 transition-colors">
            Аутлет
          </Link>
          <Link href="/brands" className="text-gray-700 hover:text-blue-600 transition-colors">
            Бренди
          </Link>
        </nav>

        <div className="ml-auto hidden md:flex items-center gap-2">
          <InstallPwaButton />
        </div>
      </div>
    </header>
  );
}
