"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Bot, ShieldCheck, Cpu, CheckCircle2 } from "lucide-react";

interface ClosingCardItem {
  id: string;
  pillTag: string;
  num: string;
  title: string;
  subtitle: string;
  description: string;
  metric: string;
  dotColor: string;
}

const closingCards: ClosingCardItem[] = [
  {
    id: "close-1",
    pillTag: "Sandbox Execution",
    num: "01",
    title: "Deterministic Runtime",
    subtitle: "Isolated Python & SQL Containers",
    description: "Every numerical computation is verified in secure execution sandboxes with zero mathematical drift.",
    metric: "100% Deterministic",
    dotColor: "bg-blue-400",
  },
  {
    id: "close-2",
    pillTag: "Cryptographic Gate",
    num: "02",
    title: "Dual-Key Governance",
    subtitle: "Audited Threshold Routing",
    description: "High-consequence financial and database actions halt automatically for cryptographic human sign-off.",
    metric: "SHA-256 Provenance",
    dotColor: "bg-emerald-400",
  },
  {
    id: "close-3",
    pillTag: "Open Infrastructure",
    num: "03",
    title: "Universal MCP Bus",
    subtitle: "Model Context Protocol",
    description: "Connect to GitHub, Postgres, Slack, and cloud APIs with zero proprietary vendor lock-in.",
    metric: "< 50ms Bridge Latency",
    dotColor: "bg-purple-400",
  },
];

export function ClosingSection() {
  return (
    <section className="relative py-28 md:py-40 bg-zinc-950 text-white overflow-hidden border-b border-zinc-900">
      {/* Background Architectural Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
        
        {/* Top Category Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-mono text-xs font-medium text-zinc-400 tracking-wider uppercase">
            Production Execution Ready
          </span>
        </div>

        {/* Monumental Headline */}
        <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.04] mb-8 max-w-4xl mx-auto">
          Don&apos;t just ask AI. <br />
          <span className="italic text-zinc-400">Put it to work.</span>
        </h2>

        <p className="font-sans text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-16">
          Replace conversational fragility with mission-critical multi-agent orchestration. Connect enterprise knowledge, execute deterministic workflows, and enforce auditable governance.
        </p>

        {/* 3 Distinct Elegant Closing Cards (Inspired by image-2.png and image-4.png) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16 text-left">
          {closingCards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="rounded-[2rem] p-7 bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between shadow-2xl hover:border-zinc-700 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 font-mono text-[11px] font-bold uppercase text-zinc-200">
                    <span className={`w-2 h-2 rounded-full ${card.dotColor}`} />
                    {card.pillTag}
                  </span>
                  <span className="font-mono text-xs font-bold text-zinc-500">
                    {card.num}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-semibold text-white tracking-tight mb-1">
                  {card.title}
                </h3>
                <span className="font-mono text-xs text-zinc-400 block mb-3 font-medium">
                  {card.subtitle}
                </span>

                <p className="font-sans text-xs text-zinc-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">
                  Execution Guarantee
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {card.metric}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Primary CTA Buttons */}
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
            className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 text-zinc-300 font-sans text-base font-semibold hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition-all duration-200"
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

      </div>
    </section>
  );
}
