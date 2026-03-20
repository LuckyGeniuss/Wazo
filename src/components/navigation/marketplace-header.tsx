import { Search } from "lucide-react";
import { CurrencySwitcher } from "./currency-switcher";
import { InstallPwaButton } from "@/components/ui/install-pwa-button";

export function MarketplaceHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">Wazo.Market</span>
          </a>
        </div>
        
        <div className="flex-1 max-w-xl px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              className="flex h-10 w-full rounded-full border border-input bg-muted/50 px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search products, stores, categories..."
              type="search"
            />
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <InstallPwaButton />
          <CurrencySwitcher />
          <select className="text-xs border rounded-lg px-2 py-1 outline-none bg-transparent hover:bg-muted/50 transition-colors">
            <option value="uk">🇺🇦 UA</option>
            <option value="en">🇬🇧 EN</option>
            <option value="kk">🇰🇿 KZ</option>
            <option value="pl">🇵🇱 PL</option>
          </select>
          <a href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
            Dashboard
          </a>
          <a href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Sign In
          </a>
        </nav>
      </div>
    </header>
  );
}