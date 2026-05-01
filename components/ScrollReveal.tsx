"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  className?: string;
  id?: string;
}

export default function ScrollReveal({ children, width = "100%", delay = 0, className = "", id }: ScrollRevealProps) {
  return (
    <div id={id} className={className} style={{ position: "relative", width, overflow: "visible" }}>
      <motion.div
        className={className.includes('h-full') ? 'h-full' : ''}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ 
          duration: 0.8, 
          delay: delay,
          ease: [0.21, 0.47, 0.32, 0.98] 
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
