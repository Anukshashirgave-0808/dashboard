"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { account } from "@/lib/appwrite";
import { 
  LayoutDashboard, 
  Utensils, 
  Settings, 
  LogOut, 
  ClipboardList 
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ClipboardList },
    { name: "Menu Items", href: "/admin/menu", icon: Utensils },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 min-h-screen flex flex-col shadow-2xl">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-500/30">
            <Utensils className="text-white" size={20} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">RestoAdmin</h2>
            <p className="text-xs text-slate-400 font-medium">Kitchen Control</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive 
                  ? "bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-300 border border-transparent"
              }`}
            >
              <item.icon size={18} strokeWidth={1.5} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 border border-transparent transition-all duration-200"
        >
          <LogOut size={18} strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </aside>
  );
}
