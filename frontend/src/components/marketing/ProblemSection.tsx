"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

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
      { label: "Operational Reach", value: "Departmental Silos" },
      { label: "Data Accessibility", value: "Disconnected Apps" },
    ],
    bgClass: "bg-rose-50",
    borderClass: "border-rose-200 hover:border-rose-400",
  },
  {
    id: "prob-2",
    num: "02",
    pillTag: "Integration Debt",
    dotColor: "bg-amber-500",
    title: "The Fragile Custom Glue Layer",
    subtitle: "Brittle Bespoke Scripting",
    summary:
      "Engineers write ad-hoc wrappers connecting models to internal APIs, which can break when upstream schemas change.",
    rootCause:
      "Without a standardized protocol and structured state persistence, each integration requires maintenance as models and APIs change.",
    impactMetrics: [
      { label: "Integration Style", value: "Custom Wrappers" },
      { label: "Maintenance", value: "Schema Changes" },
    ],
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200 hover:border-amber-400",
  },
  {
    id: "prob-3",
    num: "03",
    pillTag: "Context Failure",
    dotColor: "bg-blue-500",
    title: "Context Collapse & Blind RAG",
    subtitle: "Unverified Document Dumps",
    summary:
      "Naive retrieval implementations may pass unstructured document chunks into prompts, risking missing context or unsupported answers.",
    rootCause:
      "Simple vector similarity can miss document hierarchy and freshness, making source verification difficult for high-stakes decisions.",
    impactMetrics: [
      { label: "Retrieval Context", value: "Often Unstructured" },
      { label: "Citation Lineage", value: "Hard to Verify" },
    ],
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200 hover:border-blue-400",
  },
  {
    id: "prob-4",
    num: "04",
    pillTag: "Governance Void",
    dotColor: "bg-emerald-500",
    title: "The Governance & Audit Black Box",
    subtitle: "Unaudited Autonomous Risk",
    summary:
      "Workflows may run without clear guardrails or become dependent on manual approval without traceable execution records.",
    rootCause:
      "Enterprise oversight needs explainable execution paths, consistent validation, and review points for consequential actions.",
    impactMetrics: [
      { label: "Audit Traceability", value: "Limited Visibility" },
      { label: "Risk Mitigation", value: "Manual Controls" },
    ],
    bgClass: "bg-violet-50",
    borderClass: "border-violet-200 hover:border-violet-400",
  },
];

export function ProblemSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-12 md:py-14 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-7">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Section 02 — The Architectural Diagnosis
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-slate-900 tracking-tight leading-snug mb-2">
            Four systemic breakdowns in enterprise AI adoption.
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
            Large models alone do not solve operational problems. Without an orchestration architecture, enterprise AI deployments face recurring failure modes.
          </p>
        </div>

        {/* 4 Opaque Light Diagnostic Cards (2x2 Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {problemCards.map((card) => {
            const isExpanded = expandedId === card.id;

            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`relative rounded-2xl p-5 flex flex-col justify-between shadow-xs border-2 ${card.bgClass} ${card.borderClass} transition-all duration-200 min-h-[225px]`}
              >
                <div>
                  {/* Top Row: Pill Badge and Number */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/70">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[10px] font-semibold uppercase tracking-wider bg-white border border-slate-200 text-slate-800">
                      <span className={`w-2 h-2 rounded-full ${card.dotColor}`} />
                      {card.pillTag}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      [ {card.num} ]
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-serif text-xl font-semibold tracking-tight mb-0.5 text-slate-900">
                    {card.title}
                  </h3>
                  <span className="font-mono text-[10px] font-medium block mb-2 text-slate-500">
                    {card.subtitle}
                  </span>

                  {/* Summary */}
                  <p className="font-sans text-[11px] text-slate-600 leading-relaxed mb-2">
                    {card.summary}
                  </p>

                  {/* Diagnostic Impact Metrics */}
                  <div className="grid grid-cols-2 gap-3 pt-2 mb-2 border-t border-slate-200/60">
                    {card.impactMetrics.map((metric, mIdx) => (
                      <div key={mIdx}>
                        <span className="font-mono text-[10px] block text-slate-500">
                          {metric.label}
                        </span>
                        <span className="font-mono text-xs font-bold block mt-0.5 text-slate-900">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Expandable Root Cause */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="p-3 rounded-xl mb-2 text-xs font-sans leading-relaxed border bg-white border-slate-200 text-slate-700"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-wider block font-bold mb-1 text-blue-600">
                          Root Architectural Cause:
                        </span>
                        {card.rootCause}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-2 mt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => toggleExpand(card.id)}
                    className="w-full py-2 px-5 rounded-xl bg-white border border-slate-200 text-slate-700 font-sans text-[10px] font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all hover:bg-slate-50 hover:border-slate-300 shadow-xs"
                  >
                    <span>{isExpanded ? "Collapse Analysis" : "Analyze Failure Mode"}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
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
