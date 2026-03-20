import { MarketplaceHeader } from "@/components/navigation/marketplace-header";
import { MarketplaceFooter } from "@/components/navigation/marketplace-footer";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketplaceHeader />
      <main className="flex-1">
        {children}
      </main>
      <MarketplaceFooter />
    </div>
  );
}
