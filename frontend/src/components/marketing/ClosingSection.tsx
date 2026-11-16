"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Terminal, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export function ClosingSection() {
  return (
    <section className="relative py-20 md:py-24 bg-[#eef3f7] text-slate-900 overflow-hidden border-b border-slate-200">
      
      {/* Subtle architectural background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center">
        
        {/* Top Category Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="font-mono text-xs font-semibold text-slate-700 tracking-wider uppercase">
            Production Readiness
          </span>
        </div>

        {/* Monumental Headline */}
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.08] mb-6 max-w-3xl mx-auto text-slate-900">
          Don&apos;t just ask AI. <br />
          <span className="italic font-serif text-blue-700">Put it to work.</span>
        </h2>

        <p className="font-sans text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Replace conversational fragility with deterministic multi-agent orchestration. Connect enterprise knowledge, execute verifiable workflows, and enforce auditable governance.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-blue-600 text-white font-sans text-sm font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all duration-200"
          >
            <span>Launch STARK Platform</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-slate-300 bg-white text-slate-800 font-sans text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-xs"
          >
            <Terminal className="w-4 h-4 text-slate-500" />
            <span>Sign In with SSO</span>
          </Link>
        </div>

        {/* Clean, Opaque Single-Row Light Chips (No black cards, fits in one frame) */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-mono text-xs text-slate-600">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero-Drift Validation</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Dual-Key Governance</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-purple-600" />
            <span>Open MCP Protocol</span>
          </div>
        </div>

      </div>
    </section>
  );
}
