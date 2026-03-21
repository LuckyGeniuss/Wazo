import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Multi-tenant SaaS",
  description: "Learn more about our mission and the team behind the platform.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Empowering businesses to succeed online</h1>
        <p className="text-lg text-muted-foreground">
          We believe that starting and running an online business should be accessible to everyone. 
          Our platform provides the tools you need to build, manage, and scale your operations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-24 max-w-5xl mx-auto">
        <div className="bg-muted rounded-2xl aspect-video flex items-center justify-center">
          {/* Placeholder for an image */}
          <span className="text-muted-foreground">Our Story Image</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-muted-foreground mb-4">
            Founded in 2024, we started with a simple idea: to create an ecosystem that seamlessly integrates 
            a visual website builder, e-commerce capabilities, and CRM tools.
          </p>
          <p className="text-muted-foreground">
            Today, we are proud to support thousands of merchants worldwide, helping them reach their customers 
            and grow their businesses through our robust, multi-tenant architecture.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Innovation</h3>
            <p className="text-muted-foreground text-sm">We constantly push boundaries to provide the most advanced tools.</p>
          </div>
          <div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🤝</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Customer First</h3>
            <p className="text-muted-foreground text-sm">Your success is our success. We are dedicated to supporting you.</p>
          </div>
          <div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Security</h3>
            <p className="text-muted-foreground text-sm">We take the security and privacy of your data seriously.</p>
          </div>
        </div>
      </div>
    </div>
  );
}