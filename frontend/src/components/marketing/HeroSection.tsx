"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export function HeroSection() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <section className="relative min-h-[calc(100vh-4.5rem)] flex items-center justify-center overflow-hidden bg-[#eef3f7] border-b border-slate-200">
      
      {/* Subtle ambient light gradient background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_60%_35%,rgba(215,231,245,0.7),transparent_70%)]" />

      {/* Giant Architectural Serif Watermark "S T A R K" (matching image reference) */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none select-none flex justify-center items-center overflow-hidden">
        <span className="font-serif text-[18vw] font-normal tracking-[0.2em] text-slate-300/40 uppercase whitespace-nowrap">
          S T A R K
        </span>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left z-10">
            
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm w-fit mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-mono text-xs font-semibold text-slate-700 tracking-wider uppercase">
                Enterprise AI Orchestration
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-slate-900 tracking-tight leading-[1.08] mb-6">
              Autonomous execution <br />
              <span className="italic font-serif text-blue-700">&amp; security</span>
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              Transform fragile conversational prompts into deterministic multi-agent workflows. Verified semantic grounding, sandbox execution, and auditable human governance.
            </p>

            {/* CTA Pill Buttons (Matching image reference) */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-600 text-white font-sans text-sm font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all duration-200"
              >
                <span>Launch Platform</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#orchestration"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-slate-800 border border-slate-300 font-sans text-sm font-semibold shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
              >
                <span>Explore Core</span>
              </a>
            </div>

            {/* Security Assurance Line */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center gap-6 font-mono text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Zero Hallucinations
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Open MCP Protocol
              </span>
            </div>

          </div>

          {/* Right Column: Layered Opaque Cards around Central 3D Orchestration Core (Reference Image 5) */}
          <div className="lg:col-span-7 relative h-[480px] sm:h-[520px] w-full flex items-center justify-center">
            
            {/* Central Orchestration Core (Nexus replacing the bird with a sophisticated architectural AI core) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                
                {/* Concentric rotating architectural rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-blue-200/60"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-6 rounded-full border border-dashed border-blue-300/50"
                />
                
                {/* Luminous Core Sphere */}
                <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-blue-600 via-sky-400 to-indigo-300 shadow-2xl shadow-blue-400/30 flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full bg-[#eef3f7]/90 flex items-center justify-center shadow-inner">
                    <div className="flex flex-col items-center text-center p-3">
                      <Cpu className="w-8 h-8 text-blue-600 mb-1" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-700">
                        STARK Core
                      </span>
                      <span className="font-mono text-[9px] text-blue-600 font-semibold">
                        v2.4 Active
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Top-Right Badge: Active Swarm Workflows (Matching Image 5) */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute top-4 right-2 sm:right-6 bg-white border border-slate-200 shadow-md rounded-full px-4 py-2 flex items-center gap-3 z-20"
            >
              <div className="flex -space-x-2">
                <span className="inline-block w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">A</span>
                <span className="inline-block w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">R</span>
                <span className="inline-block w-6 h-6 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">M</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-mono text-[11px] font-bold text-slate-900 leading-tight">1,420+ Swarms</span>
                <span className="font-sans text-[10px] text-slate-500">Autonomous Execution</span>
              </div>
            </motion.div>

            {/* Card 1: Enterprise Trust / Security (Bottom-Left Card from Image 5) */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setActiveCard(activeCard === "sec" ? null : "sec")}
              className="absolute bottom-6 left-2 sm:left-4 w-56 sm:w-64 bg-white border border-slate-200 shadow-lg rounded-3xl p-5 z-20 cursor-pointer text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                    Zero-Trust Gate
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-slate-900">
                    Enterprise Protection
                  </h4>
                </div>
              </div>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                Cryptographic policy validation before any database or financial transaction commits.
              </p>
            </motion.div>

            {/* Card 2: Integrated AI Agent (Center-Bottom notched card from Image 5) */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setActiveCard(activeCard === "agent" ? null : "agent")}
              className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 sm:translate-x-[-20%] w-64 sm:w-72 bg-white border border-slate-200 shadow-xl rounded-3xl p-5 z-30 cursor-pointer text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  DAG Swarm
                </span>
              </div>
              <h4 className="font-serif text-base font-semibold text-slate-900 mb-1">
                Integrated AI Agents
              </h4>
              <p className="font-sans text-xs text-slate-600 leading-relaxed mb-3">
                Specialized sub-agents decompose complex goals into parallel execution pipelines.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-mono text-[11px]">
                <span className="text-slate-400">Status</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Active
                </span>
              </div>
            </motion.div>

            {/* Card 3: Deterministic Metric Card (Right-Bottom from Image 5) */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setActiveCard(activeCard === "metric" ? null : "metric")}
              className="absolute bottom-16 right-2 sm:right-6 w-48 sm:w-56 bg-white border border-slate-200 shadow-lg rounded-3xl p-5 z-20 cursor-pointer text-left"
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-serif text-3xl sm:text-4xl font-normal text-slate-900">
                  100%
                </span>
                <span className="font-mono text-[10px] font-bold text-blue-600 uppercase">
                  Verified
                </span>
              </div>
              <h5 className="font-sans text-xs font-semibold text-slate-800 mb-1">
                Deterministic Runtime
              </h5>
              <p className="font-sans text-[11px] text-slate-500 leading-relaxed">
                Python &amp; SQL calculations executed in sandboxed containers with zero drift.
              </p>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
