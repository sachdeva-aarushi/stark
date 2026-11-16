"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Bot, ShieldCheck, Cpu, Terminal } from "lucide-react";
import { FloatingCard } from "./cards/FloatingCard";

export function ClosingSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 220 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.pointerType === "touch") return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative py-32 md:py-48 bg-zinc-950 text-white overflow-hidden border-b border-zinc-900"
    >
      {/* Background Architectural Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
        
        {/* Dimensional 3D Perspective Floating Group */}
        <motion.div
          style={{
            perspective: 1200,
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative max-w-4xl mx-auto"
        >
          {/* FLOATING SATELLITE CARD 1: Top-Right */}
          <div className="hidden lg:block absolute -top-16 -right-12 w-64 z-20 pointer-events-none">
            <FloatingCard
              depth={40}
              floatRange={8}
              duration={6}
              delay={0}
              rotateZ={3}
              bgClass="bg-zinc-900/90 text-white backdrop-blur-md"
              borderClass="border border-zinc-800"
              shadowClass="shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              className="p-4 text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-blue-400" />
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                  Swarm Execution
                </span>
              </div>
              <span className="font-serif text-xs font-semibold text-zinc-200 block">
                Deterministic DAG Engine
              </span>
              <span className="font-mono text-[10px] text-emerald-400 mt-1 block">
                ● 100% Policy Certified
              </span>
            </FloatingCard>
          </div>

          {/* FLOATING SATELLITE CARD 2: Bottom-Left */}
          <div className="hidden lg:block absolute -bottom-12 -left-12 w-64 z-20 pointer-events-none">
            <FloatingCard
              depth={50}
              floatRange={7}
              duration={5.2}
              delay={1}
              rotateZ={-2}
              bgClass="bg-zinc-900/90 text-white backdrop-blur-md"
              borderClass="border border-zinc-800"
              shadowClass="shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              className="p-4 text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                  Governance Gate
                </span>
              </div>
              <span className="font-serif text-xs font-semibold text-zinc-200 block">
                Dual-Key Signoff Ready
              </span>
              <span className="font-mono text-[10px] text-zinc-400 mt-1 block">
                SHA-256 Ledger Provenance
              </span>
            </FloatingCard>
          </div>

          {/* Category Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-mono text-xs font-medium text-zinc-400 tracking-wider uppercase">
              Production Execution Ready
            </span>
          </div>

          {/* Monumental Headline */}
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.04] mb-10">
            Don&apos;t just ask AI. <br />
            <span className="italic text-zinc-400">Put it to work.</span>
          </h2>

          <p className="font-sans text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Replace conversational fragility with mission-critical multi-agent orchestration. Connect enterprise knowledge, execute deterministic workflows, and enforce auditable governance.
          </p>

          {/* Distinctive Cinematic CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-white text-zinc-950 font-sans text-base font-semibold tracking-tight shadow-[0_20px_50px_rgba(255,255,255,0.15)] hover:bg-zinc-100 transition-all duration-200"
            >
              <span>Launch STARK Platform</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 text-zinc-300 font-sans text-base font-medium hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition-all duration-200"
            >
              <Terminal className="w-4 h-4 text-zinc-400" />
              <span>Sign In with Enterprise SSO</span>
            </Link>
          </div>

          {/* Fine Line Footer Metadata */}
          <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-wrap items-center justify-center gap-8 font-mono text-xs text-zinc-500">
            <span>Next.js 14 App Router</span>
            <span>•</span>
            <span>Model Context Protocol (MCP)</span>
            <span>•</span>
            <span>Zero-Drift Validation</span>
            <span>•</span>
            <span>Immutable Audit Trail</span>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
