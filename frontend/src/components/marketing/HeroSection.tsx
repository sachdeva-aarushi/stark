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
  const [activeCard, setCoordinatedCard] = useState<string | null>(null);

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
                Source-grounded context
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Human review controls
              </span>
            </div>

          </div>

          {/* Right Column: Layered Opaque Cards around Central 3D Orchestration Core (Reference Image 5) */}
          <div className="lg:col-span-7 relative h-[480px] sm:h-[520px] w-full flex items-center justify-center">
            
            {/* Central editorial panel: the reference's product-story composition, without the bird or decorative floaters */}
            <div className="absolute inset-x-10 top-16 bottom-28 rounded-[2rem] bg-[#dce8f1] border border-slate-200 shadow-sm flex items-center justify-center text-center px-8">
              <div className="max-w-xs">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-700">
                  Orchestration, made tangible
                </span>
                <div className="mt-3 font-serif text-5xl sm:text-6xl tracking-[0.16em] text-slate-800">STARK</div>
                <p className="mt-3 text-sm text-slate-600">A clear path from enterprise context to governed action.</p>
              </div>
            </div>

            {/* Top-Right Badge: Coordinated Swarm Workflows (Matching Image 5) */}
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
                <span className="font-mono text-[11px] font-bold text-slate-900 leading-tight">Agent orchestration</span>
                <span className="font-sans text-[10px] text-slate-500">Coordinated workflows</span>
              </div>
            </motion.div>

            {/* Card 1: Enterprise Trust / Security (Bottom-Left Card from Image 5) */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setCoordinatedCard(activeCard === "sec" ? null : "sec")}
              className="absolute bottom-6 left-2 sm:left-4 w-56 sm:w-64 bg-white border border-slate-200 shadow-lg rounded-3xl p-5 z-20 cursor-pointer text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                    Governance Gate
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-slate-900">
                    Human Oversight
                  </h4>
                </div>
              </div>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                Review checkpoints for consequential actions before they are committed.
              </p>
            </motion.div>

            {/* Card 2: Integrated AI Agent (Center-Bottom notched card from Image 5) */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setCoordinatedCard(activeCard === "agent" ? null : "agent")}
              className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 sm:translate-x-[-20%] w-64 sm:w-72 bg-white border border-slate-200 shadow-xl rounded-3xl p-5 z-30 cursor-pointer text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Agent Workflow
                </span>
              </div>
              <h4 className="font-serif text-base font-semibold text-slate-900 mb-1">
                Integrated AI Agents
              </h4>
              <p className="font-sans text-xs text-slate-600 leading-relaxed mb-3">
                Specialized agents can divide complex goals into coordinated tasks.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-mono text-[11px]">
                <span className="text-slate-400">Flow</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Coordinated
                </span>
              </div>
            </motion.div>

            {/* Card 3: Deterministic Metric Card (Right-Bottom from Image 5) */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setCoordinatedCard(activeCard === "metric" ? null : "metric")}
              className="absolute bottom-16 right-2 sm:right-6 w-48 sm:w-56 bg-white border border-slate-200 shadow-lg rounded-3xl p-5 z-20 cursor-pointer text-left"
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-serif text-3xl sm:text-4xl font-normal text-slate-900">
                  Traceable
                </span>
                <span className="font-mono text-[10px] font-bold text-blue-600 uppercase">
                  Verified
                </span>
              </div>
              <h5 className="font-sans text-xs font-semibold text-slate-800 mb-1">
                Verified Execution
              </h5>
              <p className="font-sans text-[11px] text-slate-500 leading-relaxed">
                Numerical work can run in isolated Python and SQL environments.
              </p>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
