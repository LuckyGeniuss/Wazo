import { MarketplaceHeader } from "@/components/navigation/marketplace-header";
import { MarketplaceFooter } from "@/components/navigation/marketplace-footer";
import { BackToTop } from "@/components/ui/back-to-top";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col relative">
      <MarketplaceHeader />
      <main className="flex-1">
        {children}
      </main>
      <MarketplaceFooter />
      <BackToTop />
    </div>
  );
}
