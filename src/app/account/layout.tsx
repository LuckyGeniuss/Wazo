import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountLayout({
  children,
}: { 
  children: React.ReactNode 
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="relative flex min-h-screen flex-col bg-background">
      {/* TODO: Add account navigation / header here */}
      {children}
    </main>
  );
}