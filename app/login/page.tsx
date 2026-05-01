"use client";

import { useState } from "react";
import { login } from "./actions";
import { Lock, ArrowRight, Mail, Construction, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] p-10 md:p-14 border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-600/20 ring-4 ring-emerald-500/10">
              <Construction className="text-white" size={32} />
            </div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-[2px] bg-emerald-600"></div>
                <h4 className="text-emerald-600 font-bold uppercase tracking-[0.3em] text-[10px]">Secure Gateway</h4>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Admin <span className="text-emerald-600">Access.</span></h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">Authorized personnel only</p>
          </div>

          <form action={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.15em] ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-[1.5rem] outline-none transition-all text-sm font-bold shadow-sm placeholder:text-slate-300 text-slate-900 dark:text-white"
                  placeholder="admin@civitech.lk"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.15em] ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-[1.5rem] outline-none transition-all text-sm font-bold shadow-sm placeholder:text-slate-300 text-slate-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-1 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  {error}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-[1.5rem] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-emerald-600/25 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] uppercase text-[12px] tracking-[0.2em]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Synchronizing...
                </>
              ) : (
                <>
                  Establish Connection
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">
          Civitech Terminal OS v2.0
        </p>
      </motion.div>
    </div>
  );
}
