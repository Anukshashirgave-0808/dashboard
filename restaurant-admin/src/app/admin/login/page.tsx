"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400", variable: "--font-pacifico" });

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
    } catch {
      alert("Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-black via-gray-900 to-black">
        <Loader2 className="w-12 h-12 animate-spin text-[#F5B041]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-red-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-orange-400/5 to-red-500/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-bounce delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-yellow-400 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-orange-400 rounded-full opacity-40 animate-ping delay-300"></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-red-400 rounded-full opacity-50 animate-ping delay-700"></div>
        <div className="absolute top-60 right-20 w-1 h-1 bg-pink-400 rounded-full opacity-70 animate-ping delay-1000"></div>
        <div className="absolute bottom-20 right-40 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-80 animate-ping delay-1500"></div>
      </div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-lg rounded-3xl bg-black/90 backdrop-blur-2xl border border-[#F5B041]/20 shadow-2xl p-12 flex flex-col items-center animate-fade-in-up relative">
        {/* Glowing Border Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-red-400/10 blur-2xl opacity-60"></div>
        
        {/* LOGO AND NAME */}
        <div className="flex flex-col items-center mb-10 relative z-10">
          <div className="relative mb-6 group">
            <div className="absolute inset-0 w-28 h-28 bg-gradient-to-r from-yellow-400/20 to-red-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-28 h-28 bg-gradient-to-br from-yellow-400/10 to-red-400/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
              <img
                src="/aathidyam-logo.png"
                alt="Aathidyam Logo"
                className="w-20 h-20 animate-float drop-shadow-2xl"
              />
            </div>
          </div>
          <h1
            className={`${pacifico.className} text-5xl md:text-6xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-gradient-x font-bold tracking-wide`}
          >
            Aathidyam
          </h1>
          <p className="text-xl text-orange-300/90 font-semibold mt-3 animate-fade-in delay-300 tracking-wide">
            Restaurant Admin Portal
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400 font-medium">Secure Access</span>
          </div>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="w-full space-y-8 relative z-10">
          {/* EMAIL */}
          <div className="group">
            <label className="block text-sm font-bold tracking-wider text-orange-300 mb-3 transition-colors group-focus-within:text-yellow-300 flex items-center gap-2">
              <Mail size={16} className="text-orange-400" />
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-orange-400/30">
                <Mail className="text-orange-400 transition-all duration-300 group-focus-within:text-yellow-400 group-focus-within:scale-110" size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your admin email"
                className="w-full bg-black/70 border-2 border-orange-500/30 rounded-2xl py-5 pl-16 pr-6 text-[#F5B041] placeholder:text-orange-400/70 text-lg
                  focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:bg-black/90 transition-all duration-300 hover:border-orange-400/50 hover:bg-black/80"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="group">
            <label className="block text-sm font-bold tracking-wider text-orange-300 mb-3 transition-colors group-focus-within:text-yellow-300 flex items-center gap-2">
              <Lock size={16} className="text-orange-400" />
              PASSWORD
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-orange-400/30">
                <Lock className="text-orange-400 transition-all duration-300 group-focus-within:text-yellow-400 group-focus-within:scale-110" size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your secure password"
                className="w-full bg-black/70 border-2 border-orange-500/30 rounded-2xl py-5 pl-16 pr-6 text-[#F5B041] placeholder:text-orange-400/70 text-lg
                  focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:bg-black/90 transition-all duration-300 hover:border-orange-400/50 hover:bg-black/80"
              />
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-4 py-5 rounded-2xl font-bold tracking-widest text-xl
              bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500
              hover:from-yellow-300 hover:via-orange-400 hover:to-red-400
              text-black hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-500 disabled:opacity-60 mt-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="relative flex items-center justify-center gap-4">
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>AUTHENTICATING</span>
                </>
              ) : (
                <>
                  <span>ACCESS DASHBOARD</span>
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-500" />
                </>
              )}
            </div>
          </button>
        </form>

        {/* Enhanced Decorative Elements */}
        <div className="mt-10 flex flex-col items-center gap-4 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full"></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full"></div>
          </div>
          <p className="text-orange-300/70 text-sm font-medium tracking-wide">
            Welcome to Aathidyam Restaurant Management
          </p>
        </div>
      </div>
    </div>
  );
}
