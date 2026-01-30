"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import { getOrders, updateOrderStatus, Order } from "@/lib/orders";
import { Loader2, RefreshCw, ShoppingBag, AlertTriangle, Clock, CheckCircle, Zap } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
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
        await account.get();
        setAuthLoading(false);
        fetchOrders();
      } catch (err) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "preparing":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "preparing":
        return <Zap className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (authLoading) return (
    <div className="fixed inset-0 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center z-[9999]">
      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
      <p className="text-slate-400 font-semibold tracking-tight animate-pulse">Verifying Admin Access...</p>
    </div>
  );

  return (
    <div className="flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">
        
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl flex items-start gap-3 backdrop-blur-sm">
            <AlertTriangle className="mt-0.5 shrink-0 w-5 h-5" />
            <div>
              <p className="font-semibold text-sm">Action Required</p>
              <p className="text-xs opacity-80">{error}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Kitchen Dashboard</h1>
            <p className="text-slate-400 mt-2 font-medium">Real-time order management system</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/60 px-6 py-2.5 rounded-xl text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all active:scale-95"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatsCard title="Total Orders" value={orders.length.toString()} icon="orders" />
          <StatsCard title="Pending" value={orders.filter(o => o.status === "pending").length.toString()} icon="pending" />
          <StatsCard title="Completed" value={orders.filter(o => (o.status === "delivered" || o.status === "completed")).length.toString()} icon="delivered" />
        </div>

        {/* Order Table */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-700/50 flex items-center gap-3 bg-slate-800/80">
              <ShoppingBag className="text-emerald-500" size={22} strokeWidth={1.5} />
              <h2 className="text-xl font-bold text-white">Active Orders</h2>
              <div className="ml-auto bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                {orders.length} Total
              </div>
            </div>
            
            {orders.length === 0 ? (
              <div className="py-20 text-center">
                <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
                <p className="text-slate-400 font-medium">No orders at the moment</p>
                <p className="text-slate-500 text-sm mt-1">Check back soon or refresh the page</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-800/30">
                      <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Items</th>
                      <th className="px-8 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Qty</th>
                      <th className="px-8 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {orders.map((order) => {
                      const items = parseItems(order.items);
                      return (
                        <tr key={order.$id} className="hover:bg-slate-700/20 transition-colors duration-200">
                          <td className="px-8 py-6">
                            <div className="font-semibold text-white">{order.name || "Guest"}</div>
                            <div className="text-xs text-slate-400 font-mono mt-1">{order.phone}</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-2">
                              {items.map((it: any, i: number) => (
                                <span key={i} className="text-sm font-medium text-slate-300">{it.name}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <div className="flex flex-col gap-2">
                              {items.map((it: any, i: number) => (
                                <span key={i} className="text-sm font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-lg w-fit mx-auto">
                                  {it.quantity}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <select
                              className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all outline-none cursor-pointer ${getStatusColor(order.status || "pending")} bg-slate-700/30`}
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
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
