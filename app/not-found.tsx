"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Construction, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-white dark:bg-slate-950 flex items-center justify-center px-6 pt-32 pb-24 font-sans transition-colors duration-300">
      <div className="max-w-3xl w-full text-center relative">
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 blur-[120px] rounded-full -z-10"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-900/10 mb-8 border-2 border-emerald-600/20">
            <SearchX size={64} className="text-emerald-700 dark:text-emerald-500" strokeWidth={1.5} />
          </div>

          <h1 className="text-7xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
            4<span className="text-emerald-700">0</span>4
          </h1>
          
          <h2 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tighter mb-6">
            Blueprint <span className="text-emerald-700">Missing.</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            The page you are looking for might have been moved, removed, or had its name changed. It's not in our current construction scope.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl shadow-emerald-700/20 active:scale-95 group"
            >
              <Home size={16} className="transition-transform group-hover:-translate-y-0.5" />
              Return Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all hover:border-emerald-700/50 active:scale-95 group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
