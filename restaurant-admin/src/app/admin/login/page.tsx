"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    account.get()
      .then(() => router.push("/admin/dashboard"))
      .catch(() => setLoading(false));
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await account.createEmailPasswordSession(email, password);
      router.push("/admin/dashboard");
    } catch (error: any) {
      alert("Login failed: " + (error.message || "Invalid credentials"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-xl shadow-slate-200/50">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-orange-50 rounded-2xl mb-4">
              <ShieldCheck className="text-orange-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Login</h2>
            <p className="text-slate-500 text-sm">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 mb-2 block">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@restaurant.com"
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 mb-2 block">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <><span>Sign In</span> <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}