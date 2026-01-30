"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import { getOrders, updateOrderStatus, Order } from "@/lib/orders";
import { Loader2, RefreshCw, ShoppingBag, AlertTriangle, User, Hash, Clock } from "lucide-react";

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
      } catch (error) {
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

  if (authLoading) return (
    <div className="fixed inset-0 min-h-screen bg-white flex flex-col items-center justify-center z-[9999]">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-20 h-20 border-4 border-orange-100 rounded-full"></div>
        <div className="absolute w-20 h-20 border-4 border-t-orange-600 rounded-full animate-spin"></div>
        <ShoppingBag className="text-orange-600" size={30} />
      </div>
      <p className="mt-6 text-slate-900 font-bold tracking-tight">Syncing Kitchen...</p>
    </div>
  );

  return (
    <div className="flex bg-gradient-to-br from-[#0f1729] via-[#1a2847] to-[#0a0e27] min-h-screen font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl animate-bounce delay-500"></div>
      </div>

      <Sidebar />
      <main className="flex-1 p-6 lg:p-10 relative z-10">
        
        {/* Top Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-4 h-16 bg-gradient-to-b from-cyan-500 via-indigo-500 to-orange-500 rounded-full shadow-2xl shadow-cyan-500/30"></div>
              <div>
                <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent leading-tight">
                  Orders Room
                </h1>
                <p className="text-cyan-200/70 font-semibold text-xl mt-2 tracking-wide">Manage and fulfill live restaurant requests with precision.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-semibold text-sm">Live System</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                <Clock size={14} className="text-blue-600" />
                <span className="text-blue-700 font-semibold text-sm">Real-time Updates</span>
              </div>
            </div>
          </div>
          <button 
            onClick={fetchOrders}
            className="group flex items-center gap-4 bg-gradient-to-r from-cyan-600 via-indigo-600 to-blue-600 hover:from-orange-500 hover:via-orange-600 hover:to-red-600 text-white px-10 py-5 rounded-3xl font-bold hover:scale-105 transition-all duration-500 shadow-2xl shadow-cyan-500/30 active:scale-95 animate-fade-in-up delay-200 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            <div className="relative flex items-center gap-4">
              <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-700" />
              <span className="text-lg">Live Refresh</span>
            </div>
          </button>
        </header>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          <StatsCard title="Incoming" value={orders.length.toString()} icon="orders" />
          <StatsCard title="In Progress" value={orders.filter(o => o.status === "preparing").length.toString()} icon="pending" />
          <StatsCard title="Ready/Done" value={orders.filter(o => o.status === "delivered").length.toString()} icon="delivered" />
        </div>

        {/* Main Feed Container */}
        <div className="bg-gradient-to-br from-[#1a2847]/80 via-[#0f1729]/70 to-[#1a2847]/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden animate-fade-in-up delay-300">
          <div className="px-10 py-8 border-b border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 via-cyan-950/30 to-indigo-950/30 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-blue-500/20 rounded-3xl shadow-2xl shadow-cyan-500/20 border border-cyan-500/30">
                <Clock className="text-cyan-400" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent tracking-tight">Live Order Feed</h2>
                <p className="text-cyan-200/60 font-semibold text-lg mt-1">Real-time kitchen management system</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/20 border-2 border-emerald-400/40 rounded-2xl">
                <span className="w-3 h-3 bg-emerald-400 rounded-full animate-ping shadow-lg shadow-emerald-500/30"></span>
                <span className="text-emerald-300 font-bold text-sm uppercase tracking-wider">Server Active</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-xl">
                <User size={16} className="text-cyan-400" />
                <span className="text-cyan-300 font-semibold text-sm">{orders.length} Orders</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-950/40 via-cyan-950/40 to-indigo-950/40 text-sm font-black text-cyan-300 uppercase tracking-wider border-b-2 border-cyan-500/20">
                  <th className="px-10 py-8">Customer Profile</th>
                  <th className="px-10 py-8">Ordered Items</th>
                  <th className="px-10 py-8 text-center">Unit Qty</th>
                  <th className="px-10 py-8 text-right">Process Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-500/10">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-32 text-center">
                      <div className="flex flex-col items-center opacity-60">
                        <div className="p-6 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-full mb-6 shadow-lg animate-pulse border border-cyan-500/30">
                          <ShoppingBag size={48} className="text-cyan-400" />
                        </div>
                        <p className="font-bold text-xl text-cyan-300">No Orders Floating In</p>
                        <p className="text-cyan-200/50 text-sm mt-2">Orders will appear here when customers place them</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => {
                    const items = parseItems(order.items);
                    const isPreparing = order.status === 'preparing';

                    return (
                      <tr key={order.$id} className={`transition-all duration-500 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-indigo-500/10 hover:shadow-lg animate-fade-in-up`} style={{animationDelay: `${index * 150}ms`}}>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-bold text-xl shadow-2xl transition-all duration-300 hover:scale-110 ${
                              isPreparing 
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/40' 
                                : 'bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 text-cyan-300 hover:shadow-cyan-400/40 border border-cyan-500/30'
                            }`}>
                              {order.name?.charAt(0) || 'G'}
                            </div>
                            <div>
                              <div className="font-black text-cyan-200 text-xl uppercase tracking-tight">{order.name || "Guest"}</div>
                              <div className="flex items-center gap-3 text-cyan-300/70 font-semibold text-base mt-1">
                                <Hash size={16} className="text-cyan-400/60" /> 
                                <span>{order.phone}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-10 py-8">
                          <div className="flex flex-wrap gap-4">
                            {items.map((it: any, i: number) => (
                              <span key={i} className="px-5 py-3 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border-2 border-cyan-500/40 text-cyan-200 rounded-2xl text-base font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 hover:border-cyan-400/60">
                                {it.name}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-10 py-8">
                          <div className="flex flex-col items-center gap-4">
                            {items.map((it: any, i: number) => (
                              <span key={i} className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-lg font-black rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-200 hover:scale-110">
                                {it.quantity}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-10 py-8 text-right">
                          <div className="inline-block relative">
                            <select
                              className={`appearance-none outline-none pl-6 pr-14 py-4 rounded-3xl text-base font-bold uppercase tracking-wider border-2 cursor-pointer transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 ${
                                order.status === 'delivered' ? 'bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 border-emerald-400/60 text-emerald-300 shadow-emerald-500/30' : 
                                order.status === 'preparing' ? 'bg-gradient-to-r from-orange-500/30 to-orange-600/30 border-orange-400/60 text-orange-300 shadow-orange-500/30' : 
                                'bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 border-cyan-400/60 text-cyan-300 shadow-cyan-500/30'
                              }`}
                              value={order.status || "pending"}
                              onChange={async e => {
                                await updateOrderStatus(order.$id, e.target.value as any);
                                fetchOrders();
                              }}
                            >
                              <option value="pending">⏳ Pending</option>
                              <option value="preparing">🔥 Preparing</option>
                              <option value="delivered">✅ Delivered</option>
                            </select>
                          </div>
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
