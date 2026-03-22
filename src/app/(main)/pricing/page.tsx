import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Multi-tenant SaaS",
  description: "Transparent pricing for businesses of all sizes.",
};

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Simple, transparent pricing</h1>
        <p className="text-lg text-muted-foreground">
          Choose the perfect plan for your business. No hidden fees.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Starter Plan */}
        <div className="border rounded-2xl p-8 shadow-sm flex flex-col">
          <h3 className="text-2xl font-semibold mb-2">Starter</h3>
          <p className="text-muted-foreground mb-6">Perfect for small businesses just getting started.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-2">✓ Up to 100 products</li>
            <li className="flex items-center gap-2">✓ Basic analytics</li>
            <li className="flex items-center gap-2">✓ Community support</li>
          </ul>
          <button className="w-full py-2 px-4 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
            Get Started
          </button>
        </div>

        {/* Professional Plan */}
        <div className="border-2 border-primary rounded-2xl p-8 shadow-md relative flex flex-col">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
          <h3 className="text-2xl font-semibold mb-2">Professional</h3>
          <p className="text-muted-foreground mb-6">Everything you need to grow your business.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">$49</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-2">✓ Unlimited products</li>
            <li className="flex items-center gap-2">✓ Advanced analytics</li>
            <li className="flex items-center gap-2">✓ Priority email support</li>
            <li className="flex items-center gap-2">✓ Custom domain</li>
            <li className="flex items-center gap-2">✓ Remove platform branding</li>
          </ul>
          <button className="w-full py-2 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Start Free Trial
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="border rounded-2xl p-8 shadow-sm flex flex-col">
          <h3 className="text-2xl font-semibold mb-2">Enterprise</h3>
          <p className="text-muted-foreground mb-6">Advanced features for scaling organizations.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">Custom</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-2">✓ Dedicated account manager</li>
            <li className="flex items-center gap-2">✓ 24/7 phone support</li>
            <li className="flex items-center gap-2">✓ Custom integrations</li>
            <li className="flex items-center gap-2">✓ SLA guarantee</li>
            <li className="flex items-center gap-2">✓ Advanced security</li>
          </ul>
          <button className="w-full py-2 px-4 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}