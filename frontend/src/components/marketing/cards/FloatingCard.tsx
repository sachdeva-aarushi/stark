"use client";

import React from "react";
import { motion } from "framer-motion";

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number; // translateZ in pixels (e.g. 20, 40, 60)
  floatRange?: number; // ambient float range in pixels (default 6)
  duration?: number; // oscillation duration in seconds (default 5)
  delay?: number; // oscillation delay in seconds
  rotateZ?: number; // static rotation offset in degrees
  bgClass?: string;
  borderClass?: string;
  shadowClass?: string;
}

export function FloatingCard({
  children,
  className = "",
  depth = 20,
  floatRange = 6,
  duration = 5,
  delay = 0,
  rotateZ = 0,
  bgClass = "bg-white",
  borderClass = "border border-zinc-200/90",
  shadowClass = "shadow-[0_16px_36px_-12px_rgba(0,0,0,0.12)]",
}: FloatingCardProps) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{
        y: [-floatRange / 2, floatRange / 2, -floatRange / 2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        delay,
      }}
      style={{
        transform: `translateZ(${depth}px) rotate(${rotateZ}deg)`,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-2xl ${bgClass} ${borderClass} ${shadowClass} ${className}`}
    >
      {children}
    </motion.div>
  );
}
