"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ClosingSection() {
  return (
    <section className="py-32 sm:py-40 bg-zinc-950 text-white relative overflow-hidden border-b border-zinc-800">
      {/* Background Architectural Grid Accent */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-grid-architectural invert" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 text-center flex flex-col items-center">
        {/* Monogram tag */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 text-xs font-mono mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="uppercase tracking-widest text-[11px] font-semibold">ORCHESTRATE YOUR WORKFLOWS</span>
        </div>

        {/* Monumental Headline */}
        <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.04] max-w-5xl">
          Don&apos;t just ask AI. <br />
          <span className="italic font-normal text-blue-400">Put it to work.</span>
        </h2>

        {/* Supporting statement */}
        <p className="font-serif text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl mt-6 sm:mt-8 font-normal">
          Bring enterprise knowledge, autonomous agents, external tools, and human oversight together in workflows engineered to execute.
        </p>

        {/* Action CTAs */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="group flex items-center space-x-3 px-8 py-4 bg-white text-zinc-950 rounded text-sm font-sans tracking-wide uppercase font-semibold hover:bg-zinc-100 transition-all shadow-xl"
          >
            <span>Explore STARK</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-blue-700" />
          </Link>

          <Link
            href="/login"
            className="px-6 py-4 border border-zinc-800 rounded text-sm font-sans tracking-wide uppercase font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
          >
            Platform Login
          </Link>
        </div>

        {/* Fine-line coordinate bar */}
        <div className="mt-20 pt-8 border-t border-zinc-900 w-full max-w-4xl flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <span>KERNEL: RUNTIME v0.1</span>
          <span>ENTERPRISE GRADE MULTI-AGENT DAG</span>
          <span>HUMAN-IN-THE-LOOP ACTIVE</span>
        </div>
      </div>
    </section>
  );
}
