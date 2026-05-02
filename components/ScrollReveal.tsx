"use client";

import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  className?: string;
  id?: string;
}

export default function ScrollReveal({ children, width = "100%", className = "", id }: ScrollRevealProps) {
  return (
    <div id={id} className={className} style={{ position: "relative", width, overflow: "visible" }}>
      {children}
    </div>
  );
}
