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
    <aside className="w-72 bg-gradient-to-b from-[#1a2847] via-[#0f1729] to-[#0a0e27] min-h-screen flex flex-col shadow-2xl border-r border-cyan-500/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>
      </div>

      <div className="p-10 relative z-10">
        <div className="flex items-center gap-6 mb-14">
          <div className="bg-gradient-to-r from-cyan-500 to-indigo-600 p-5 rounded-3xl shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
            <Utensils className="text-white" size={32} />
          </div>
          <div>
            <span className="text-3xl font-black bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent tracking-tight">RestoAdmin</span>
            <p className="text-cyan-200/60 text-sm font-semibold">Kitchen Control Center</p>
          </div>
        </div>

        <nav className="space-y-4 flex-1">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-5 px-6 py-5 rounded-3xl font-bold transition-all duration-300 hover:scale-105 animate-fade-in-up relative overflow-hidden group ${
                  isActive 
                    ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-2xl shadow-cyan-500/30" 
                    : "text-cyan-200/60 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-indigo-500/20 hover:text-cyan-300 hover:shadow-2xl"
                }`}
                style={{animationDelay: `${index * 100}ms`}}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-cyan-300 rounded-r-2xl shadow-lg"></div>
                )}
                
                <div className={`p-3 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20' 
                    : 'bg-cyan-500/20 group-hover:bg-cyan-500/30 group-hover:shadow-lg'
                }`}>
                  <item.icon size={22} className={isActive ? 'text-white' : 'text-cyan-400/60 group-hover:text-cyan-300'} />
                </div>
                <span className="text-base">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-8 mt-auto border-t border-cyan-500/20 relative z-10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-5 px-6 py-5 w-full rounded-3xl font-bold text-red-400 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-orange-500/20 hover:text-red-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
        >
          <div className="p-3 rounded-2xl bg-red-500/20 group-hover:bg-red-500/30 transition-colors duration-300">
            <LogOut size={22} />
          </div>
          <span className="text-base">Logout</span>
        </button>
      </div>
    </aside>
  );
}
