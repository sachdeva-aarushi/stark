"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Unplug, ShieldAlert, EyeOff, ArrowRight, ChevronDown, CheckCircle2 } from "lucide-react";

interface ProblemCardData {
  id: string;
  num: string;
  pillTag: string;
  dotColor: string;
  title: string;
  subtitle: string;
  summary: string;
  rootCause: string;
  impactMetrics: { label: string; value: string }[];
  bgClass: string;
  borderClass: string;
  textClass: string;
}

const problemCards: ProblemCardData[] = [
  {
    id: "prob-1",
    num: "01",
    pillTag: "Isolation Trap",
    dotColor: "bg-rose-500",
    title: "Siloed AI Prototypes",
    subtitle: "Disconnected Point Solutions",
    summary:
      "Enterprise teams build isolated chatbots that operate in departmental silos, incapable of accessing backend data or executing end-to-end workflows.",
    rootCause:
      "Standalone prompts lack role-based permissions, shared memory, and cross-departmental coordination bus, trapping AI at the prototype stage.",
    impactMetrics: [
      { label: "Production Drop-off", value: "78% Stall" },
      { label: "Data Accessibility", value: "Zero Cross-App" },
    ],
    bgClass: "bg-gradient-to-b from-rose-50/70 via-white to-white",
    borderClass: "border border-rose-200/80 hover:border-rose-400",
    textClass: "text-zinc-950",
  },
  {
    id: "prob-2",
    num: "02",
    pillTag: "Integration Debt",
    dotColor: "bg-amber-500",
    title: "The Fragile Custom Glue Layer",
    subtitle: "Brittle Bespoke Scripting",
    summary:
      "Engineers waste months writing ad-hoc Python wrappers connecting models to internal APIs, which break on every upstream schema update.",
    rootCause:
      "Without a standardized protocol (like MCP) and structured state persistence, every model update creates compounding technical maintenance debt.",
    impactMetrics: [
      { label: "Engineering Drain", value: "60% on Glue" },
      { label: "Protocol Standard", value: "Proprietary / Brittle" },
    ],
    bgClass: "bg-gradient-to-b from-amber-50/70 via-white to-white",
    borderClass: "border border-amber-200/80 hover:border-amber-400",
    textClass: "text-zinc-950",
  },
  {
    id: "prob-3",
    num: "03",
    pillTag: "Context Failure",
    dotColor: "bg-blue-500",
    title: "Context Collapse & Blind RAG",
    subtitle: "Unverified Document Dumps",
    summary:
      "Naive RAG implementations dump thousands of raw document tokens into prompt windows, causing hallucinations and context truncation.",
    rootCause:
      "Simple vector similarity misses hierarchical document structures, leading models to make mission-critical decisions on out-of-date information.",
    impactMetrics: [
      { label: "Hallucination Risk", value: "High on Multi-hop" },
      { label: "Citation Lineage", value: "Missing / Opaque" },
    ],
    bgClass: "bg-gradient-to-b from-blue-50/70 via-white to-white",
    borderClass: "border border-blue-200/80 hover:border-blue-400",
    textClass: "text-zinc-950",
  },
  {
    id: "prob-4",
    num: "04",
    pillTag: "Governance Void",
    dotColor: "bg-emerald-500",
    title: "The Governance & Audit Black Box",
    subtitle: "Unaudited Autonomous Risk",
    summary:
      "Workflows either run completely unconstrained without guardrails or freeze perpetually waiting for manual approvals without trace logs.",
    rootCause:
      "Enterprise compliance requires end-to-end auditability. Autonomous actions without deterministic validation expose the enterprise to legal liability.",
    impactMetrics: [
      { label: "Audit Traceability", value: "0% in Chatbots" },
      { label: "Risk Mitigation", value: "Manual Only" },
    ],
    bgClass: "bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950",
    borderClass: "border border-zinc-800 hover:border-zinc-700",
    textClass: "text-white",
  },
];

export function ProblemSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-24 md:py-32 bg-zinc-50/60 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Section 02 — The Architectural Diagnosis
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-zinc-950 tracking-tight leading-tight mb-6">
            Four systemic breakdowns in enterprise AI adoption.
          </h2>
          <p className="font-sans text-base sm:text-lg text-zinc-600 leading-relaxed">
            Large models alone do not solve operational problems. Without an orchestration architecture, enterprise AI deployments stall across these four failure modes.
          </p>
        </div>

        {/* 4 Distinct Elegant Diagnostic Cards (2x2 Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {problemCards.map((card) => {
            const isDark = card.textClass === "text-white";
            const isExpanded = expandedId === card.id;

            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`relative rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between shadow-xl transition-all duration-300 ${card.bgClass} ${card.borderClass} ${card.textClass}`}
              >
                {/* Top Row: Pill Badge and Number */}
                <div>
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-200/40">
                    <span
                      className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full font-mono text-xs font-semibold uppercase tracking-wider shadow-sm ${
                        isDark ? "bg-zinc-800 text-zinc-200 border border-zinc-700" : "bg-white text-zinc-800 border border-zinc-200"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${card.dotColor}`} />
                      {card.pillTag}
                    </span>
                    <span className="font-mono text-sm font-bold text-zinc-400">
                      [ {card.num} ]
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mb-1">
                    {card.title}
                  </h3>
                  <span className={`font-mono text-xs font-medium block mb-4 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    {card.subtitle}
                  </span>

                  {/* Summary */}
                  <p className={`font-sans text-sm md:text-base leading-relaxed mb-6 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                    {card.summary}
                  </p>

                  {/* Diagnostic Impact Metrics */}
                  <div className="grid grid-cols-2 gap-4 pt-4 mb-6 border-t border-zinc-200/30">
                    {card.impactMetrics.map((metric, mIdx) => (
                      <div key={mIdx}>
                        <span className={`font-mono text-[11px] block ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                          {metric.label}
                        </span>
                        <span className={`font-mono text-sm font-bold block mt-0.5 ${isDark ? "text-white" : "text-zinc-950"}`}>
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Expandable Root Cause Analysis */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-4 rounded-2xl mb-6 text-xs font-sans leading-relaxed border ${
                          isDark
                            ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                            : "bg-white border-zinc-200 text-zinc-700"
                        }`}
                      >
                        <span className="font-mono text-[10px] uppercase tracking-wider block font-bold mb-1 text-blue-500">
                          Root Architectural Cause:
                        </span>
                        {card.rootCause}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Pill Action Button */}
                <div className="pt-4 border-t border-zinc-200/40">
                  <button
                    onClick={() => toggleExpand(card.id)}
                    className={`w-full py-3 px-6 rounded-2xl font-sans text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-sm ${
                      isDark
                        ? "bg-white text-zinc-950 hover:bg-zinc-100"
                        : "bg-zinc-950 text-white hover:bg-zinc-800"
                    }`}
                  >
                    <span>{isExpanded ? "Collapse Analysis" : "Analyze Failure Mode"}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
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
