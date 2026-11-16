"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";

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
  bgColor: string;
  borderColor: string;
  dotColor: string;
  pillColor: string;
}

const comparisonCards: ComparisonCard[] = [
  {
    id: "comp-1",
    num: "01",
    category: "Execution Model",
    title: "Linear Prompt vs. Multi-Agent DAG",
    conventional: {
      headline: "Fragile Single-Prompt Inference",
      description: "Attempts complex reasoning in a single prompt. If any intermediate step drifts, the entire workflow fails silently.",
    },
    stark: {
      headline: "Parallel Multi-Agent DAG",
      description: "Decomposes requests into Directed Acyclic Graphs with isolated state and automatic self-healing retries.",
      guarantee: "100% Deterministic Execution Graph",
    },
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200 hover:border-blue-400",
    dotColor: "bg-blue-600",
    pillColor: "bg-blue-100 text-blue-800",
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
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200 hover:border-emerald-400",
    dotColor: "bg-emerald-600",
    pillColor: "bg-emerald-100 text-emerald-800",
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
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200 hover:border-amber-400",
    dotColor: "bg-amber-600",
    pillColor: "bg-amber-100 text-amber-800",
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
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200 hover:border-purple-400",
    dotColor: "bg-purple-600",
    pillColor: "bg-purple-100 text-purple-800",
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
    <section id="comparison" className="py-12 md:py-14 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-7">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Section 06 — Architectural Contrast
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-slate-900 tracking-tight leading-snug mb-2">
            Four shifts from conversational demos to production reality.
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
            Compare conventional single-prompt limitations against STARK deterministic guarantees.
          </p>
        </div>

        {/* 4 Contrast Cards (2x2 Grid fitting comfortably in one screen frame) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {comparisonCards.map((card) => {
            const currentView = activeViews[card.id] || "stark";
            const isStark = currentView === "stark";

            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`rounded-2xl p-5 flex flex-col justify-between shadow-xs border-2 ${card.borderColor} ${card.bgColor} transition-all duration-200`}
              >
                <div>
                  {/* Category Pill & Number */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold uppercase ${card.pillColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${card.dotColor}`} />
                      {card.category}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      [ {card.num} ]
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-slate-900 tracking-tight mb-3">
                    {card.title}
                  </h3>

                  {/* Active Comparison Body */}
                  <div className="p-4 rounded-xl mb-4 bg-white border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-600">
                        {isStark ? "● STARK Orchestration" : "○ Conventional Conversational AI"}
                      </span>
                      {isStark ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>

                    <h4 className="font-serif text-sm font-semibold text-slate-900 mb-1">
                      {isStark ? card.stark.headline : card.conventional.headline}
                    </h4>

                    <p className="font-sans text-xs text-slate-600 leading-relaxed">
                      {isStark ? card.stark.description : card.conventional.description}
                    </p>

                    {isStark && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 font-mono text-[10px] text-emerald-700 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{card.stark.guarantee}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Toggle Button */}
                <div className="pt-2">
                  <button
                    onClick={() => toggleView(card.id)}
                    className="w-full py-2 px-4 rounded-xl font-sans text-xs font-semibold tracking-wider uppercase border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-3 h-3 text-slate-500" />
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
