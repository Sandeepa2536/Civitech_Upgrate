"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLoading } from "./LoadingContext";

export default function Preloader() {
  const [mounted, setMounted] = useState(false);
  const { isLoading, setIsLoading } = useLoading();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Trigger loading on pathname change
  useEffect(() => {
    if (mounted) {
      setIsLoading(true);
      // Fallback timeout to prevent infinite loading if a page fails to signal completion
      const timer = setTimeout(() => setIsLoading(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [pathname, mounted, setIsLoading]);

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-white dark:bg-slate-950 flex flex-col items-center justify-center pointer-events-auto transition-colors duration-500"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <div className="w-16 h-16 border-2 border-emerald-500/20 dark:border-emerald-500/10 rounded-full"></div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-16 h-16 border-t-2 border-emerald-600 rounded-full"
            ></motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-1.5 rounded-full shadow-lg border border-slate-100 dark:border-slate-800">
                <Image src="/logo.png" alt="Civitech Logo" width={32} height={32} className="w-8 h-8 object-contain" priority />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-slate-900 dark:text-white font-bold uppercase tracking-[0.4em] text-[9px] flex items-center gap-2"
          >
            <span className="opacity-50">Civitech</span>
            <span className="text-emerald-600">Constructions</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
