"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import { getOrders, updateOrderStatus, Order } from "@/lib/orders";
import { Loader2, RefreshCw, ShoppingBag, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [authLoading, setAuthLoading] = useState(true); // Default to true
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch orders.");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Step 1: Check if user is logged in
        await account.get();
        // Step 2: If yes, allow dashboard to show
        setAuthLoading(false);
        fetchOrders();
      } catch (err) {
        // Step 3: If no, redirect to login page immediately
        router.replace("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  const parseItems = (itemsStr: string) => {
    try {
      return JSON.parse(itemsStr || "[]");
    } catch (e) {
      return [];
    }
  };

  // BLOCK RENDERING: This prevents the dashboard from showing even for 1ms
  if (authLoading) return (
    <div className="fixed inset-0 min-h-screen bg-white flex flex-col items-center justify-center z-[9999]">
      <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
      <p className="text-slate-500 font-bold tracking-tight animate-pulse">Verifying Admin Access...</p>
    </div>
  );

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">
        
        {/* Schema Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-start gap-3 shadow-sm">
            <AlertTriangle className="mt-0.5 shrink-0" size={18} />
            <div>
              <p className="font-bold text-sm">Action Required</p>
              <p className="text-xs opacity-80">{error}</p>
            </div>
          </div>
        )}

        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Kitchen Dashboard</h1>
            <p className="text-slate-500 mt-1 font-medium italic">Monitor incoming guest requests</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatsCard title="Total" value={orders.length.toString()} icon="orders" />
          <StatsCard title="Pending" value={orders.filter(o => o.status === "pending").length.toString()} icon="pending" />
          <StatsCard title="Done" value={orders.filter(o => (o.status === "delivered" || o.status === "completed")).length.toString()} icon="delivered" />
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-2">
            <ShoppingBag className="text-orange-500" size={20} />
            <h2 className="text-lg font-bold text-slate-800">Order Feed</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Items</th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Qty</th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-slate-400 font-medium">No orders found. Check Appwrite connection.</td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const items = parseItems(order.items);
                    return (
                      <tr key={order.$id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-5">
                          <div className="font-bold text-slate-900">{order.name || "Guest"}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{order.phone}</div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-1">
                            {items.map((it: any, i: number) => (
                              <span key={i} className="text-xs font-semibold text-slate-600"> {it.name}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <div className="flex flex-col gap-1">
                            {items.map((it: any, i: number) => (
                              <span key={i} className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded w-fit mx-auto">{it.quantity}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <select
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 outline-none focus:border-orange-500 cursor-pointer"
                            value={order.status || "pending"}
                            onChange={async e => {
                              await updateOrderStatus(order.$id, e.target.value as any);
                              fetchOrders();
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}