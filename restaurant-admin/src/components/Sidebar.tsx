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
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col shadow-sm">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-orange-600 p-2 rounded-xl shadow-lg shadow-orange-200">
            <Utensils className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">RestoAdmin</span>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isActive 
                    ? "bg-orange-50 text-orange-600" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 mt-auto border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-semibold text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}