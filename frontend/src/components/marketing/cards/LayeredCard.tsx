"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface LayeredCardProps {
  children: React.ReactNode;
  backplateContent?: React.ReactNode;
  className?: string;
  elevationZ?: number; // translateZ on hover (default 32)
  accentColor?: string; // border or subtle indicator
  badge?: string;
  title?: string;
  onClick?: () => void;
}

export function LayeredCard({
  children,
  backplateContent,
  className = "",
  elevationZ = 28,
  badge,
  title,
  onClick,
}: LayeredCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{ perspective: "1000px" }}
      className={`relative group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* 1. Base Substrate (physical backing plate) */}
      <motion.div
        animate={{
          scale: isHovered ? 0.98 : 1,
          opacity: isHovered ? 0.7 : 0.4,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="absolute inset-0 translate-x-2 translate-y-2 rounded-2xl bg-zinc-100 border border-zinc-300/80 -z-10"
      >
        {backplateContent && (
          <div className="p-4 text-xs font-mono text-zinc-400">
            {backplateContent}
          </div>
        )}
      </motion.div>

      {/* 2. Primary Raised Plate */}
      <motion.div
        animate={{
          z: isHovered ? elevationZ : 0,
          y: isHovered ? -6 : 0,
        }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative rounded-2xl bg-white border border-zinc-200/90 shadow-sm group-hover:border-zinc-400 group-hover:shadow-2xl transition-colors duration-300 p-6 md:p-8"
      >
        {(badge || title) && (
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100">
            {badge && (
              <span className="font-mono text-[11px] font-medium tracking-wider uppercase text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded">
                {badge}
              </span>
            )}
            {title && (
              <span className="font-serif text-sm font-semibold text-zinc-800">
                {title}
              </span>
            )}
          </div>
        )}

        {/* Content with translateZ for depth separation */}
        <div style={{ transform: "translateZ(12px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
