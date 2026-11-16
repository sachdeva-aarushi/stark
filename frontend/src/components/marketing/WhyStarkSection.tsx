"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Bot,
  Database,
  Layers,
  Lock,
  Zap,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

interface StoryCard {
  id: string;
  num: string;
  badge: string;
  liveStatus: string;
  title: string;
  subtitle: string;
  conventional: string;
  stark: string;
  guarantee: string;
  pillColor: string;
  accentBorder: string;
  bgGradient: string;
}

const storyCards: StoryCard[] = [
  {
    id: "story-1",
    num: "01",
    badge: "Execution Architecture",
    liveStatus: "Live DAG",
    title: "Multi-Agent Swarm",
    subtitle: "Parallel Task Decomposition",
    conventional: "Single-prompt linear chains that fail completely if any intermediate token drifts.",
    stark: "Decomposes goals into concurrent DAG sub-tasks with isolated context and auto self-healing.",
    guarantee: "100% Deterministic DAG Routing",
    pillColor: "bg-blue-100 text-blue-800",
    accentBorder: "border-blue-200 hover:border-blue-400",
    bgGradient: "bg-gradient-to-b from-blue-50/80 via-white to-slate-50",
  },
  {
    id: "story-2",
    num: "02",
    badge: "Semantic Grounding",
    liveStatus: "Verified Lineage",
    title: "Hybrid Enterprise RAG",
    subtitle: "Dense + Sparse Lineage",
    conventional: "Blind vector chunk dumps without parent-child context, producing unverified hallucinations.",
    stark: "Hierarchical chunking with cryptographic citation hashes linking every claim to original sources.",
    guarantee: "Cryptographic Source Lineage",
    pillColor: "bg-emerald-100 text-emerald-800",
    accentBorder: "border-emerald-200 hover:border-emerald-400",
    bgGradient: "bg-gradient-to-b from-emerald-50/80 via-white to-slate-50",
  },
  {
    id: "story-3",
    num: "03",
    badge: "Open Standards",
    liveStatus: "Zero Lock-In",
    title: "Universal MCP Bus",
    subtitle: "Anthropic Open Protocol",
    conventional: "Brittle bespoke REST wrappers that break on every upstream API schema change.",
    stark: "Model Context Protocol bridges connecting databases, APIs, and tools with token isolation.",
    guarantee: "Anthropic Open MCP Standard",
    pillColor: "bg-sky-100 text-sky-800",
    accentBorder: "border-sky-200 hover:border-sky-400",
    bgGradient: "bg-gradient-to-b from-sky-50/80 via-white to-slate-50",
  },
  {
    id: "story-4",
    num: "04",
    badge: "Human Oversight",
    liveStatus: "Dual-Key Gate",
    title: "Dual-Key Governance",
    subtitle: "Cryptographic Sign-off",
    conventional: "Black-box autonomous scripts operating with no verifiable safety gates or audit ledger.",
    stark: "Automates low-risk tasks while halting high-consequence mutations for cryptographic sign-off.",
    guarantee: "Immutable SHA-256 Audit Trail",
    pillColor: "bg-purple-100 text-purple-800",
    accentBorder: "border-purple-200 hover:border-purple-400",
    bgGradient: "bg-gradient-to-b from-purple-50/80 via-white to-slate-50",
  },
];

export function WhyStarkSection() {
  const [activeStory, setActiveStory] = useState(1);

  return (
    <section id="why-stark" className="py-20 md:py-28 bg-[#fdfbf7] border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Section 06 — Architectural Contrast
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight leading-snug mb-3">
            Why STARK wins where conversational chatbots fail.
          </h2>
          <p className="font-serif text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Vertical story-card contrasts comparing conventional single-prompt limits against STARK production guarantees.
          </p>
        </div>

        {/* VERTICAL MOBILE/STORY-STYLE EDITORIAL CARDS (Directly Inspired by Image 6) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {storyCards.map((card, idx) => {
            const isHighlighted = activeStory === idx;

            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setActiveStory(idx)}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className={`relative rounded-[2.5rem] p-6 sm:p-7 flex flex-col justify-between shadow-lg border-2 ${card.accentBorder} ${card.bgGradient} cursor-pointer transition-all duration-300 min-h-[460px] ${
                  isHighlighted ? "ring-2 ring-blue-500 shadow-xl" : ""
                }`}
              >
                {/* Top Phone-Notch / Story Indicator Bar (Inspired by Image 6) */}
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80">
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      9:41
                    </span>
                    <div className="w-12 h-1.5 rounded-full bg-slate-300" />
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      [{card.num}]
                    </span>
                  </div>

                  {/* Badges Bar (Matching Image 6's floating tags) */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${card.pillColor}`}>
                      {card.badge}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {card.liveStatus}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-serif text-2xl font-semibold text-slate-900 leading-tight mb-1">
                    {card.title}
                  </h3>
                  <span className="font-mono text-xs text-slate-500 block mb-5 font-medium">
                    {card.subtitle}
                  </span>

                  {/* Conventional Limitation Block */}
                  <div className="p-3.5 rounded-2xl bg-slate-100/90 border border-slate-200 mb-3 text-left">
                    <div className="flex items-center gap-1.5 mb-1 font-mono text-[10px] font-bold uppercase text-slate-500">
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Conventional AI</span>
                    </div>
                    <p className="font-serif text-xs text-slate-600 leading-relaxed font-normal">
                      {card.conventional}
                    </p>
                  </div>

                  {/* STARK Orchestration Block */}
                  <div className="p-3.5 rounded-2xl bg-white border border-blue-200 shadow-xs text-left">
                    <div className="flex items-center gap-1.5 mb-1 font-mono text-[10px] font-bold uppercase text-blue-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>STARK Guarantee</span>
                    </div>
                    <p className="font-serif text-xs text-slate-800 leading-relaxed font-normal">
                      {card.stark}
                    </p>
                  </div>
                </div>

                {/* Bottom Metadata Guarantee Bar (Matching Image 6's bottom pill tag) */}
                <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-700 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="truncate max-w-[160px]">{card.guarantee}</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
