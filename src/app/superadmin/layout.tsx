import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  Settings, 
  ShieldCheck,
  TrendingUp,
  LogOut,
  Globe
} from "lucide-react";

export default async function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "SUPERADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 relative overflow-hidden">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none" />
        
        {/* Logo Section */}
        <div className="p-6 pb-2 border-b border-slate-800/60 relative z-10">
          <Link href="/superadmin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight leading-none group-hover:text-indigo-400 transition-colors">Wazo<span className="text-indigo-500">.</span>Admin</h2>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mt-1 block">Superuser Portal</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto relative z-10 mt-4">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Головне</p>
          
          <Link
            href="/superadmin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group font-medium"
          >
            <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" /> 
            Дашборд
          </Link>
          
          <Link
            href="/superadmin/stores"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group font-medium"
          >
            <Store className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" /> 
            Магазини
          </Link>

          <Link
            href="/superadmin/users"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group font-medium"
          >
            <Users className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" /> 
            Користувачі
          </Link>

          <Link
            href="/superadmin/analytics"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group font-medium"
          >
            <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-rose-400 transition-colors" /> 
            Аналітика <span className="ml-auto text-[10px] bg-slate-800 px-2 py-0.5 rounded-md text-slate-400 border border-slate-700">Soon</span>
          </Link>

          <div className="pt-6 pb-2">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Система</p>
          </div>

          <Link
            href="/superadmin/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group font-medium"
          >
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" /> 
            Налаштування
          </Link>
          
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group font-medium mt-auto"
            target="_blank"
          >
            <Globe className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" /> 
            Вітрина
          </Link>
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 relative z-10">
          <div className="flex items-center gap-3 mb-4 px-2">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                {session.user.email?.[0]?.toUpperCase() || 'A'}
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-semibold text-white truncate">{session.user.name || 'Admin'}</p>
               <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
             </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 text-slate-300 rounded-xl transition-all font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            Вийти з панелі
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
