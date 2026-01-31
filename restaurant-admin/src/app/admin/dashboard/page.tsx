"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import { getOrders, updateOrderStatus, Order } from "@/lib/orders";
import { ShoppingBag } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [dateStr, setDateStr] = useState("");
  const [dayStr, setDayStr] = useState("");

  const fetchOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get();
        setAuthLoading(false);
        fetchOrders();
      } catch {
        router.replace("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const updateDate = () => {
      const today = new Date();
      setDateStr(
        today.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
      setDayStr(today.toLocaleDateString("en-IN", { weekday: "long" }));
    };

    updateDate();
    const interval = setInterval(updateDate, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  const parseItems = (itemsStr: string) => {
    try {
      return JSON.parse(itemsStr || "[]");
    } catch {
      return [];
    }
  };

  if (authLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <ShoppingBag className="text-orange-500 animate-bounce" size={40} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />

      <main className="flex-1 ml-28 px-8 lg:px-16 py-8 flex flex-col">

        {/* ===== TITLE ===== */}
        <div className="flex flex-col items-center w-full mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-widest text-center
            bg-linear-to-r from-amber-400 via-orange-400 to-yellow-500
            bg-clip-text text-transparent drop-shadow-lg">
            AATHIDYAM ORDER ROOM
          </h1>
          <div className="mt-4 h-1 w-56 rounded-full bg-linear-to-r from-amber-400 to-orange-500 shadow-md" />
        </div>

        {/* ===== STATS + DATE ===== */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mb-20">

          {/* STATS */}
          <div className="flex gap-8 justify-center flex-wrap">
            <StatsCard title="Incoming" value={orders.length.toString()} icon="orders" />
            <StatsCard
              title="In Progress"
              value={orders.filter(o => o.status === "preparing").length.toString()}
              icon="pending"
            />
            <StatsCard
              title="Ready / Done"
              value={orders.filter(o => o.status === "delivered").length.toString()}
              icon="delivered"
            />
          </div>

          {/* DATE */}
          <div className="flex flex-col items-center lg:items-end gap-4 mb-6">
            <div className="h-10 w-40" />
            <span className="text-amber-400 font-semibold text-sm">
              {dayStr}, {dateStr}
            </span>
          </div>
        </div>

        {/* EXTRA SPACE AFTER STATS + DATE */}
        <div className="mb-16" />

        {/* ===== TABLE ===== */}
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]
          rounded-3xl border border-cyan-500/20 shadow-2xl bg-[#111111]/90 p-6">

          <table className="min-w-max w-full text-center border border-cyan-500/30 border-collapse">
            <thead className="bg-[#1a1a1a]/90 sticky top-0 z-10">
              <tr className="text-cyan-300 uppercase font-bold text-sm">
                <th className="px-6 py-4 border border-cyan-500/30">Customer</th>
                <th className="px-6 py-4 border border-cyan-500/30">Phone</th>
                <th className="px-6 py-4 border border-cyan-500/30">Item</th>
                <th className="px-6 py-4 border border-cyan-500/30">Qty</th>
                <th className="px-6 py-4 border border-cyan-500/30">Status</th>
                <th className="px-6 py-4 border border-cyan-500/30">Address</th>
                <th className="px-6 py-4 border border-cyan-500/30">Time</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => {
                const items = parseItems(order.items);
                const time = new Date(order.$createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return items.map((it: any, i: number) => (
                  <tr
                    key={`${order.$id}-${i}`}
                    className={`${i % 2 === 0 ? "bg-gray-800/10" : "bg-gray-800/20"} hover:bg-cyan-500/20`}
                  >
                    {i === 0 && (
                      <>
                        <td rowSpan={items.length} className="px-6 py-4 font-bold text-cyan-200 border border-cyan-500/30">
                          {order.name || "Guest"}
                        </td>
                        <td rowSpan={items.length} className="px-6 py-4 text-cyan-300 border border-cyan-500/30">
                          {order.phone || "-"}
                        </td>
                      </>
                    )}

                    <td className="px-6 py-4 text-cyan-200 font-semibold border border-cyan-500/30">
                      {it.name}
                    </td>
                    <td className="px-6 py-4 font-bold border border-cyan-500/30">
                      {it.quantity}
                    </td>

                    {i === 0 && (
                      <>
                        <td rowSpan={items.length} className="px-6 py-4 border border-cyan-500/30">
                          <select
                            className={`pl-3 pr-4 py-1 rounded-xl font-bold w-full ${
                              order.status === "delivered"
                                ? "bg-emerald-500/30 text-emerald-200"
                                : order.status === "preparing"
                                ? "bg-orange-500/30 text-orange-200"
                                : "bg-cyan-500/30 text-cyan-200"
                            }`}
                            value={order.status}
                            onChange={async e => {
                              await updateOrderStatus(order.$id, e.target.value as any);
                              fetchOrders();
                            }}
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="preparing">🔥 Preparing</option>
                            <option value="delivered">✅ Delivered</option>
                          </select>
                        </td>

                        <td rowSpan={items.length} className="px-6 py-4 text-cyan-300 border border-cyan-500/30">
                          {order.address || "-"}
                        </td>

                        <td rowSpan={items.length} className="px-6 py-4 text-cyan-300 border border-cyan-500/30">
                          {time}
                        </td>
                      </>
                    )}
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
