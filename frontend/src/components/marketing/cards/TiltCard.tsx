"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMaxAngle?: number; // max rotation angle in deg (default 10)
  perspective?: number; // perspective in px (default 1200)
  scaleOnHover?: number; // scale on hover (default 1.02)
  glareOpacity?: number; // maximum subtle glare opacity (default 0.08)
  onClick?: () => void;
  borderClass?: string;
  bgClass?: string;
}

export function TiltCard({
  children,
  className = "",
  tiltMaxAngle = 9,
  perspective = 1200,
  scaleOnHover = 1.015,
  glareOpacity = 0.06,
  onClick,
  borderClass = "border border-zinc-200/80 hover:border-zinc-400",
  bgClass = "bg-white",
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized cursor coordinates (-0.5 to +0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for fluid, premium response
  const springConfig = { damping: 26, stiffness: 280, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Compute 3D rotations:
  // Mouse moving UP should tilt backward (rotateX > 0), DOWN tilts forward (rotateX < 0)
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [tiltMaxAngle, -tiltMaxAngle]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-tiltMaxAngle, tiltMaxAngle]);
  const scale = useSpring(isHovered ? scaleOnHover : 1, springConfig);

  // Glare position calculation
  const glareX = useTransform(smoothMouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(smoothMouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Ignore touch devices to prevent jittery scrolling
      if (e.pointerType === "touch" || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "touch") return;
      setIsHovered(true);
    },
    []
  );

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <div
      style={{ perspective: `${perspective}px` }}
      className={`relative group ${className}`}
      onClick={onClick}
    >
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
        className={`relative w-full h-full rounded-2xl ${bgClass} ${borderClass} transition-colors duration-300 shadow-sm hover:shadow-xl`}
      >
        {/* Subtle dynamic specular sheen (no color gradients, pure architectural light) */}
        {glareOpacity > 0 && (
          <motion.div
            style={{
              x: glareX,
              y: glareY,
              opacity: isHovered ? glareOpacity : 0,
            }}
            className="pointer-events-none absolute -inset-10 rounded-3xl bg-zinc-400 blur-2xl transition-opacity duration-300"
          />
        )}

        {/* Content container maintaining 3D children preservation */}
        <div style={{ transformStyle: "preserve-3d" }} className="relative z-10 w-full h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
