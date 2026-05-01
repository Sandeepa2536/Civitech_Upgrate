"use client";

import { motion } from "framer-motion";
import { Construction, ArrowRight, ShieldCheck, Globe, Instagram, Facebook, Twitter, Linkedin, Youtube, Home } from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function UnderConstruction() {
  return (
    <main className="min-h-screen w-full bg-white dark:bg-slate-950 flex flex-col items-center justify-start lg:justify-center p-6 md:p-10 font-sans overflow-x-hidden transition-colors duration-500 relative">
      
      {/* 1. Cinematic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-emerald-500/10 dark:bg-emerald-600/20 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 dark:bg-blue-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* 2. Floating Theme Switcher */}
      <div className="absolute top-6 right-6 z-[100]">
        <ThemeSwitcher />
      </div>

      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-20 relative z-10 pt-20 pb-16 lg:py-0">
        
        {/* 3. Left Side: Brand & Visual */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-[0.4em]">Official Project Site</span>
            </div>

            <div className="flex flex-col items-center lg:items-start gap-5 mb-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="p-3 bg-white dark:bg-white rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.15)] dark:shadow-[0_0_50px_rgba(16,185,129,0.2)]"
              >
                <img src="/logo.png" alt="Civitech" className="h-12 md:h-18 w-auto" />
              </motion.div>
              <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-[0.85]">
                Building <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700 dark:from-emerald-400 dark:to-emerald-600">Greatness.</span>
              </h1>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-base md:text-xl font-medium max-w-xl leading-relaxed mb-8">
              Civitech Constructions is currently undergoing a digital structural upgrade. We're refining our foundations to serve you better.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 opacity-60 dark:opacity-40">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-white">ISO Certified</span>
               </div>
               <div className="flex items-center gap-2">
                  <Construction size={16} className="text-emerald-600 dark:text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-white">C4 Graded</span>
               </div>
            </div>
          </motion.div>
        </div>

        {/* 4. Right Side: Interaction Card (Glassmorphism) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-[400px] bg-slate-50/50 dark:bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-6 md:p-9 shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.3)] relative group overflow-hidden"
        >
          {/* Accent Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/20 blur-3xl -z-10 transition-all group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-500/30"></div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tighter mb-5">Site Status</h3>
          
          <div className="space-y-5 mb-8">
            <div>
               <div className="flex justify-between items-end mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Execution Progress</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">94%</span>
               </div>
               <div className="h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden border border-slate-300 dark:border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "94%" }}
                    transition={{ duration: 2, delay: 1 }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                  ></motion.div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="bg-white/80 dark:bg-white/[0.03] p-3 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none text-center">
                  <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Inquiries</p>
                  <p className="text-[9px] font-bold text-slate-900 dark:text-white uppercase">070 3747474</p>
               </div>
               <div className="bg-white/80 dark:bg-white/[0.03] p-3 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none text-center">
                  <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Launch</p>
                  <p className="text-[9px] font-bold text-slate-900 dark:text-white uppercase">Very Soon</p>
               </div>
            </div>
          </div>

          <Link 
            href="/"
            className="w-full bg-emerald-700 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white py-4 rounded-2xl font-bold uppercase text-[9px] tracking-[0.3em] flex items-center justify-center transition-all shadow-xl shadow-emerald-700/20 active:scale-95 group mb-6"
            title="Go to Home"
          >
            <Home size={18} className="transition-transform group-hover:scale-110" />
          </Link>

          <div className="flex items-center justify-center gap-5">
             <a href="https://web.facebook.com/p/Civitech-Constructions-100064152427258" target="_blank" rel="noopener noreferrer" className="text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-white transition-colors" title="Facebook"><Facebook size={18} /></a>
             <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-white transition-colors" title="Instagram"><Instagram size={18} /></a>
             <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-white transition-colors" title="Twitter/X"><Twitter size={18} /></a>
             <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-white transition-colors" title="LinkedIn"><Linkedin size={18} /></a>
             <a href="#" className="text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-white transition-colors" title="YouTube"><Youtube size={18} /></a>
          </div>
        </motion.div>

      </div>

      {/* 5. Bottom Footer (Minimalist) */}
      <div className="w-full text-center py-8 lg:absolute lg:bottom-6 lg:left-1/2 lg:-translate-x-1/2 mt-auto">
         <p className="text-[8px] md:text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] leading-relaxed">
            Civitech Constructions (Pvt) Ltd
         </p>
      </div>

    </main>
  );
}
