import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Home, Users, Store, Settings } from "lucide-react";

export default async function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  // Basic check for superadmin. 
  if (session?.user?.role !== "SUPERADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r">
        <div className="p-6">
          <h2 className="text-xl font-bold">Wazo.Market Admin</h2>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            href="/superadmin"
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
          >
            <Home className="w-5 h-5" /> Dashboard
          </Link>
          <Link
            href="/superadmin/stores"
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
          >
            <Store className="w-5 h-5" /> Stores
          </Link>
          <Link
            href="/superadmin/users"
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
          >
            <Users className="w-5 h-5" /> Users
          </Link>
          <Link
            href="/superadmin/settings"
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
          >
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
