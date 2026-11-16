"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Bot,
  Activity,
  Layers,
  Sparkles,
  Lock,
  CheckCircle2,
  Terminal,
  Database,
  ArrowDown,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#f4f7fa] border-b border-slate-200 pt-20 pb-10">
      
      {/* Subtle ambient architectural lighting & grid */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(219,234,254,0.65),transparent_70%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Giant Architectural Serif Watermark "S T A R K" in background */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none select-none flex justify-center items-center overflow-hidden">
        <span className="font-serif text-[18vw] font-normal tracking-[0.22em] text-slate-300/30 uppercase whitespace-nowrap">
          S T A R K
        </span>
      </div>

      {/* Main Full-Screen Hero Content */}
      <div className="relative w-full max-w-6xl mx-auto px-6 md:px-12 my-auto flex flex-col items-center text-center z-10">
        
        {/* Top Enterprise Pill Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="font-mono text-xs font-semibold text-slate-800 tracking-wider uppercase">
            Deterministic Enterprise AI Orchestration
          </span>
        </motion.div>

        {/* Monumental Editorial Headline in Georgia & Literata */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-slate-900 tracking-tight leading-[1.04] mb-8 max-w-5xl"
        >
          Autonomous execution <br />
          <span className="italic font-serif text-blue-700">&amp; governed security</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-serif text-lg sm:text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mb-10 font-normal"
        >
          Transform fragile conversational prompts into deterministic multi-agent workflows. Verified semantic grounding, isolated sandbox execution, and auditable human governance.
        </motion.p>

        {/* Primary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-blue-600 text-white font-serif text-base font-semibold shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-xl transition-all duration-200"
          >
            <span>Launch STARK Platform</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#problem"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-slate-800 border border-slate-300 font-serif text-base font-semibold shadow-xs hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
          >
            <span>Explore Architecture</span>
            <ArrowDown className="w-4 h-4 text-slate-500" />
          </a>
        </motion.div>

        {/* Architectural Guarantees Pill Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl w-full"
        >
          <div className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-4 text-left shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">Engine</span>
              <span className="font-serif text-xs font-semibold text-slate-900 block">Multi-Agent Swarm</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-4 text-left shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">Grounding</span>
              <span className="font-serif text-xs font-semibold text-slate-900 block">Hybrid Vector RAG</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-4 text-left shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">Execution</span>
              <span className="font-serif text-xs font-semibold text-slate-900 block">Python/SQL Sandbox</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-4 text-left shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">Oversight</span>
              <span className="font-serif text-xs font-semibold text-slate-900 block">Dual-Key Governance</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Bottom Status Bar */}
      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between text-xs font-mono text-slate-500 pt-6 border-t border-slate-200/80">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>PRODUCTION KERNEL ONLINE</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <span>LATENCY: &lt;50MS DAG DISPATCH</span>
          <span>COMPLIANCE: SOC2 TYPE II READY</span>
        </div>
      </div>

    </section>
  );
}
