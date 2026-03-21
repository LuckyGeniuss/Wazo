"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, User, Heart } from "lucide-react";
import { useCartStore } from "@/components/providers/cart-sync-provider"; // assuming this exists or use a generic badge

export function MobileBottomNav() {
  const pathname = usePathname();
  // Attempt to get cart items count if the store exists, else default to 0
  let cartCount = 0;
  try {
    const state = useCartStore.getState() as any;
    cartCount = state.items?.length || 0;
  } catch(e) {}

  const navItems = [
    { label: "Головна", icon: Home, href: "/" },
    { label: "Каталог", icon: Search, href: "/search" },
    { label: "Кошик", icon: ShoppingCart, href: "/checkout", badge: cartCount },
    { label: "Улюблене", icon: Heart, href: "/dashboard/wishlist" }, // Or similar
    { label: "Профіль", icon: User, href: "/dashboard" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t pb-safe md:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <nav className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative ${
                isActive ? "text-violet-600" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <item.icon size={22} className={isActive ? "fill-violet-100" : ""} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center shadow-sm">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
