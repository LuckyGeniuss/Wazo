import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Multi-tenant SaaS",
  description: "Get in touch with our team for support or inquiries.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Get in Touch</h1>
        <p className="text-lg text-muted-foreground">
          Have questions? We're here to help. Reach out to our team.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="first-name" className="text-sm font-medium">First name</label>
                <input id="first-name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label htmlFor="last-name" className="text-sm font-medium">Last name</label>
                <input id="last-name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input id="email" type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea id="message" className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="w-full py-2 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Send Message
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-2">Office Location</h3>
            <p className="text-muted-foreground">
              123 Innovation Drive<br />
              Tech City, TC 10101<br />
              United States
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Email Us</h3>
            <p className="text-muted-foreground">
              Support: support@example.com<br />
              Sales: sales@example.com
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Call Us</h3>
            <p className="text-muted-foreground">
              +1 (555) 123-4567<br />
              Mon-Fri from 9am to 6pm EST.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}