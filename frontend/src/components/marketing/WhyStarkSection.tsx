"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";

interface ComparisonCard {
  id: string;
  num: string;
  category: string;
  title: string;
  conventional: {
    headline: string;
    description: string;
  };
  stark: {
    headline: string;
    description: string;
    guarantee: string;
  };
  bgGradient: string;
  borderClass: string;
  dotColor: string;
}

const comparisonCards: ComparisonCard[] = [
  {
    id: "comp-1",
    num: "01",
    category: "Execution Model",
    title: "Linear Prompt vs. Multi-Agent DAG",
    conventional: {
      headline: "Fragile Single-Prompt Inference",
      description: "Attempts complex multi-step reasoning in a single prompt. If any intermediate step drifts, the entire workflow fails silently.",
    },
    stark: {
      headline: "Parallel Multi-Agent DAG",
      description: "Decomposes requests into Directed Acyclic Graphs with isolated state, concurrent execution, and automatic self-healing retries.",
      guarantee: "100% Deterministic Execution Graph",
    },
    bgGradient: "bg-gradient-to-b from-slate-50 via-white to-white",
    borderClass: "border-2 border-slate-300 hover:border-slate-500",
    dotColor: "bg-slate-700",
  },
  {
    id: "comp-2",
    num: "02",
    category: "Semantic Accuracy",
    title: "Blind Vector Dump vs. Verifiable RAG",
    conventional: {
      headline: "Top-k Context Truncation",
      description: "Dumps raw chunks into prompt context without hierarchy, causing frequent hallucinations and unverified assumptions.",
    },
    stark: {
      headline: "Hybrid Dense + Sparse RAG",
      description: "Preserves parent-child chunk lineage with cryptographic citation hashes for every generated claim.",
      guarantee: "Verifiable Citation Lineage",
    },
    bgGradient: "bg-gradient-to-b from-amber-50/80 via-white to-white",
    borderClass: "border-2 border-amber-300 hover:border-amber-500",
    dotColor: "bg-amber-600",
  },
  {
    id: "comp-3",
    num: "03",
    category: "Infrastructure",
    title: "Bespoke Scripts vs. Open MCP Bus",
    conventional: {
      headline: "Brittle Proprietary Glue Code",
      description: "Custom Python wrappers that shatter on every upstream API or schema update, creating compounding technical debt.",
    },
    stark: {
      headline: "Model Context Protocol Standard",
      description: "Unified open-standard MCP tool bridges with token sandboxing, zero vendor lock-in, and sub-50ms latency.",
      guarantee: "Anthropic Open MCP Standard",
    },
    bgGradient: "bg-gradient-to-b from-blue-50/80 via-white to-white",
    borderClass: "border-2 border-blue-300 hover:border-blue-500",
    dotColor: "bg-blue-600",
  },
  {
    id: "comp-4",
    num: "04",
    category: "Enterprise Oversight",
    title: "Black Box vs. Dual-Key Governance",
    conventional: {
      headline: "Unconstrained Autonomous Drift",
      description: "Binary operation: either totally unconstrained without safeguards or completely frozen awaiting manual copy-pasting.",
    },
    stark: {
      headline: "Graduated Dual-Key Signoff",
      description: "Low-risk routines commit automatically, while high-stakes financial and schema actions halt for cryptographic sign-off.",
      guarantee: "Immutable SHA-256 Audit Trail",
    },
    bgGradient: "bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 text-white",
    borderClass: "border-2 border-zinc-700 hover:border-zinc-500",
    dotColor: "bg-blue-400",
  },
];

export function WhyStarkSection() {
  const [activeViews, setActiveViews] = useState<Record<string, "stark" | "conventional">>({
    "comp-1": "stark",
    "comp-2": "stark",
    "comp-3": "stark",
    "comp-4": "stark",
  });

  const toggleView = (id: string) => {
    setActiveViews((prev) => ({
      ...prev,
      [id]: prev[id] === "stark" ? "conventional" : "stark",
    }));
  };

  return (
    <section id="comparison" className="py-24 md:py-32 bg-zinc-50/60 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Section 06 — Architectural Contrast
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-zinc-950 tracking-tight leading-tight mb-6">
            Four fundamental shifts from conversational demos to production reality.
          </h2>
          <p className="font-sans text-base sm:text-lg text-zinc-600 leading-relaxed">
            Compare conventional single-prompt architectures against STARK deterministic multi-agent orchestration.
          </p>
        </div>

        {/* 4 Contrast Cards (2x2 Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {comparisonCards.map((card) => {
            const isDark = card.id === "comp-4";
            const currentView = activeViews[card.id] || "stark";
            const isStark = currentView === "stark";

            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between shadow-xl transition-all duration-300 ${card.bgGradient} ${card.borderClass}`}
              >
                {/* Header: Category Pill & Number */}
                <div>
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-200/40">
                    <span
                      className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full font-mono text-xs font-semibold uppercase tracking-wider shadow-sm ${
                        isDark
                          ? "bg-zinc-800 text-zinc-200 border border-zinc-700"
                          : "bg-white text-zinc-800 border border-zinc-200"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${card.dotColor}`} />
                      {card.category}
                    </span>
                    <span className="font-mono text-xs font-bold text-zinc-400">
                      [ {card.num} ]
                    </span>
                  </div>

                  <h3
                    className={`font-serif text-2xl font-semibold tracking-tight mb-4 ${
                      isDark ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    {card.title}
                  </h3>

                  {/* Active Comparison Body */}
                  <div
                    className={`p-5 rounded-2xl mb-6 border transition-colors ${
                      isStark
                        ? isDark
                          ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                          : "bg-white border-zinc-200/80 text-zinc-800 shadow-sm"
                        : isDark
                        ? "bg-zinc-900/60 border-zinc-800 text-zinc-400"
                        : "bg-zinc-100 border-zinc-200 text-zinc-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-blue-600">
                        {isStark ? "● STARK Orchestration" : "○ Conventional Conversational AI"}
                      </span>
                      {isStark ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>

                    <h4 className="font-serif text-lg font-semibold mb-2">
                      {isStark ? card.stark.headline : card.conventional.headline}
                    </h4>

                    <p className="font-sans text-xs sm:text-sm leading-relaxed">
                      {isStark ? card.stark.description : card.conventional.description}
                    </p>

                    {isStark && (
                      <div className="mt-3 pt-3 border-t border-zinc-200/40 flex items-center gap-1.5 font-mono text-[11px] text-emerald-600 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{card.stark.guarantee}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Toggle Pill Button */}
                <div className="pt-4 border-t border-zinc-200/40">
                  <button
                    onClick={() => toggleView(card.id)}
                    className={`w-full py-3 px-5 rounded-2xl font-sans text-xs font-semibold tracking-wider uppercase border shadow-sm flex items-center justify-center gap-2 transition-all ${
                      isDark
                        ? "bg-white text-zinc-950 hover:bg-zinc-100 border-white"
                        : "bg-zinc-950 text-white hover:bg-zinc-800 border-zinc-950"
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>
                      {isStark ? "View Conventional Limitation" : "Switch to STARK Guarantee"}
                    </span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
