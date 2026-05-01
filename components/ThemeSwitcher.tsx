"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const options = [
    { name: "light", icon: Sun, label: "Light" },
    { name: "system", icon: Monitor, label: "System" },
    { name: "dark", icon: Moon, label: "Dark" },
  ];

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-10 w-28 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />;

  return (
    <div className="flex items-center p-1.5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-inner">
      {options.map((option) => {
        const isActive = theme === option.name;
        const Icon = option.icon;
        
        return (
          <button
            key={option.name}
            onClick={() => setTheme(option.name)}
            className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 relative ${
              isActive 
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-500 shadow-lg ring-1 ring-black/5 dark:ring-white/5 scale-105 z-10" 
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
            }`}
            title={option.label}
          >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
          </button>
        );
      })}
    </div>
  );
}
