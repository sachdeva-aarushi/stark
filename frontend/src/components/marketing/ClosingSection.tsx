"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Terminal, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export function ClosingSection() {
  return (
    <section className="relative py-24 md:py-32 bg-[#05070B] text-white overflow-hidden border-b border-white/10">
      
      {/* Subtle deep ambient blue glow & fine dot grid */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(29,78,216,0.22),transparent_70%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center z-10">
        
        {/* Top Category Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 shadow-xs mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-mono text-xs font-semibold text-blue-300 tracking-wider uppercase">
            Production Readiness &amp; Orchestration
          </span>
        </div>

        {/* Monumental Headline in White + Blue Accent */}
        <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight leading-[1.06] mb-8 max-w-4xl mx-auto text-white">
          Don&apos;t just ask AI. <br />
          <span className="italic font-serif text-blue-400">Put it to work.</span>
        </h2>

        {/* Subtitle */}
        <p className="font-serif text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Replace conversational fragility with deterministic multi-agent orchestration. Connect enterprise knowledge, execute verifiable workflows, and enforce auditable governance.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full bg-blue-600 text-white font-serif text-base font-semibold shadow-xl shadow-blue-500/30 hover:bg-blue-500 transition-all duration-200"
          >
            <span>Launch STARK Platform</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-serif text-base font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-200"
          >
            <Terminal className="w-4 h-4 text-blue-400" />
            <span>Sign In with SSO</span>
          </Link>
        </div>

        {/* Clean, Opaque Dark Single-Row Guarantee Chips */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span className="text-white">Zero-Drift Validation</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="text-white">Dual-Key Governance</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-xs">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-white">Open MCP Protocol</span>
          </div>
        </div>

      </div>
    </section>
  );
}
