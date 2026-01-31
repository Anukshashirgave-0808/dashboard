"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { account } from "@/lib/appwrite";
import { LayoutDashboard, LogOut } from "lucide-react";

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

  return (
    <aside className="w-56 min-w-[14rem] bg-black min-h-screen flex flex-col border-r border-gray-800">
      {/* ↑ NARROWER SIDEBAR */}

      {/* ===== LOGO ===== */}
      <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-800">
        <div className="w-8 h-8 flex items-center justify-center bg-gray-900 rounded-full">
          {/* <img src="/logo.png" className="w-full h-full object-contain" /> */}
        </div>
        <span className="text-base font-bold text-white tracking-wide">
          Aathidyam
        </span>
      </div>

      {/* ===== MENU ===== */}
      <nav className="flex-1 px-6 py-6">
        <Link
          href="/admin/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition ${
            pathname === "/admin/dashboard"
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:bg-gray-900 hover:text-white"
          }`}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
      </nav>

      {/* ===== LOGOUT ===== */}
      <div className="px-6 py-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 w-full justify-center
          rounded-md bg-red-600 text-white text-sm font-medium
          hover:bg-red-500 hover:scale-105 transition-transform duration-200 shadow-md"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
