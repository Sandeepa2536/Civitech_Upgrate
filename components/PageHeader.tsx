"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PageHeaderProps {
  subtitle: string;
  title: string;
  highlightedTitle?: string;
  description?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
}

const PageHeader = ({ subtitle, title, highlightedTitle, description, backgroundImage, children }: PageHeaderProps) => {
  return (
    <div className="relative w-full overflow-hidden transition-colors duration-300 min-h-[300px] sm:min-h-[340px] lg:min-h-[400px] flex items-center mb-6 md:mb-10 pt-20">
      {/* Background Image with improved opacity for better legibility */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image 
            src={backgroundImage} 
            alt={title}
            fill
            className="w-full h-full object-cover opacity-80 md:opacity-65 dark:opacity-40"
            priority
          />
          {/* Multi-stage gradient that covers more area on medium screens (1024-1300px) */}
          <div className="absolute inset-0 bg-white/95 md:bg-transparent md:bg-gradient-to-r md:from-white md:via-white/95 md:to-transparent dark:bg-slate-950/95 md:dark:bg-transparent md:dark:bg-gradient-to-r md:dark:from-slate-950 md:dark:via-slate-950/95 md:dark:to-transparent"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 xl:px-16 py-12 md:py-20 relative z-10 w-full text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto md:mx-0"
        >
          <span className="text-emerald-700 dark:text-emerald-500 font-bold tracking-[0.2em] md:tracking-[0.4em] uppercase text-[9px] md:text-[11px] mb-2 block">
            {subtitle}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 tracking-tighter uppercase leading-[1.1] mb-3 md:mb-4 break-words text-balance">
            {title} {highlightedTitle && <span className="text-emerald-700 dark:text-emerald-500">{highlightedTitle}</span>}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto md:mx-0 leading-relaxed font-medium">
              {description}
            </p>
          )}
          {children && (
            <div className="mt-6 md:mt-8">
              {children}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PageHeader;
