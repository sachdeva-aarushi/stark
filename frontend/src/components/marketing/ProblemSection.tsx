"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, ShieldAlert, Workflow, Database, Layers } from "lucide-react";

interface ProblemCardData {
  id: string;
  num: string;
  pillTag: string;
  dotColor: string;
  icon: React.ComponentType<{ className?: string }>;
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
    icon: Workflow,
    title: "Siloed AI Prototypes",
    subtitle: "Disconnected Point Solutions",
    summary:
      "Enterprise teams build isolated conversational chatbots that operate in departmental silos, incapable of accessing shared state or coordinating across business applications.",
    rootCause:
      "Standalone prompts lack role-based permissions, cross-departmental coordination bus, and shared memory, trapping AI initiatives at the prototype stage.",
    impactMetrics: [
      { label: "Operational Reach", value: "Departmental Silos" },
      { label: "State Sharing", value: "Zero Cross-App Memory" },
    ],
    bgClass: "bg-rose-50/70",
    borderClass: "border-rose-200/90 hover:border-rose-400",
  },
  {
    id: "prob-2",
    num: "02",
    pillTag: "Integration Debt",
    dotColor: "bg-amber-500",
    icon: Layers,
    title: "The Fragile Custom Glue Layer",
    subtitle: "Brittle Bespoke Scripting",
    summary:
      "Engineers write ad-hoc Python wrappers connecting models to internal REST APIs, which break unpredictably whenever upstream schemas or parameters change.",
    rootCause:
      "Without a standardized protocol (MCP) and structured state persistence, every single tool integration requires continuous manual re-engineering.",
    impactMetrics: [
      { label: "Integration Architecture", value: "Ad-hoc Custom Wrappers" },
      { label: "Upstream Resilience", value: "Breaks on Schema Drift" },
    ],
    bgClass: "bg-amber-50/70",
    borderClass: "border-amber-200/90 hover:border-amber-400",
  },
  {
    id: "prob-3",
    num: "03",
    pillTag: "Context Failure",
    dotColor: "bg-blue-500",
    icon: Database,
    title: "Context Collapse & Blind RAG",
    subtitle: "Unverified Document Dumps",
    summary:
      "Naive retrieval implementations pass raw document chunks into prompts without preserving parent-child hierarchy, creating hallucinated conclusions and ungrounded facts.",
    rootCause:
      "Simple vector similarity misses document hierarchy, table structures, and freshness, making cryptographic citation lineage impossible for high-stakes audits.",
    impactMetrics: [
      { label: "Retrieval Fidelity", value: "Truncated Chunk Dumps" },
      { label: "Citation Verifiability", value: "No Cryptographic Lineage" },
    ],
    bgClass: "bg-blue-50/70",
    borderClass: "border-blue-200/90 hover:border-blue-400",
  },
  {
    id: "prob-4",
    num: "04",
    pillTag: "Governance Void",
    dotColor: "bg-purple-500",
    icon: ShieldAlert,
    title: "The Governance & Audit Black Box",
    subtitle: "Unaudited Autonomous Risk",
    summary:
      "Autonomous scripts execute without verifiable guardrails or become frozen in manual approval queues without traceable execution logs or cryptographic sign-off.",
    rootCause:
      "Enterprise compliance requires explainable Directed Acyclic Graph paths, schema-validated outputs, and multi-party dual-key controls for consequential mutations.",
    impactMetrics: [
      { label: "Audit Traceability", value: "Opaque Prompt Black Box" },
      { label: "Risk Mitigation", value: "Unenforced Safety Gates" },
    ],
    bgClass: "bg-purple-50/70",
    borderClass: "border-purple-200/90 hover:border-purple-400",
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="py-20 md:py-28 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Section 02 — The Architectural Diagnosis
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight leading-snug mb-4">
            Four systemic breakdowns in enterprise AI adoption.
          </h2>
          <p className="font-serif text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Large models alone do not solve operational problems. Without an orchestration architecture, enterprise AI deployments face recurring structural failure modes.
          </p>
        </div>

        {/* 4 Large Opaque Diagnostic Cards - All Content Fully Displayed, No Click Needed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {problemCards.map((card) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`relative rounded-3xl p-8 sm:p-9 flex flex-col justify-between shadow-sm border-2 ${card.bgClass} ${card.borderClass} transition-all duration-300 min-h-[420px] bg-white`}
              >
                <div>
                  {/* Top Row: Pill Badge and Number */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200/80">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-xs font-semibold uppercase tracking-wider bg-white border border-slate-200 shadow-xs text-slate-800">
                      <span className={`w-2 h-2 rounded-full ${card.dotColor}`} />
                      {card.pillTag}
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-400">
                      [ {card.num} ]
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-xs shrink-0 mt-1">
                      <Icon className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 leading-snug">
                        {card.title}
                      </h3>
                      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 block mt-1">
                        {card.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="font-serif text-sm sm:text-base text-slate-700 leading-relaxed mb-6 font-normal">
                    {card.summary}
                  </p>

                  {/* Root Architectural Cause Callout (Contained directly inside the card) */}
                  <div className="p-4 rounded-2xl mb-6 bg-white/90 border border-slate-200/90 shadow-xs">
                    <span className="font-mono text-[11px] uppercase tracking-wider block font-bold mb-1.5 text-blue-700">
                      Root Architectural Cause:
                    </span>
                    <p className="font-serif text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {card.rootCause}
                    </p>
                  </div>
                </div>

                {/* Bottom Diagnostic Impact Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/80">
                  {card.impactMetrics.map((metric, mIdx) => (
                    <div key={mIdx}>
                      <span className="font-mono text-[11px] block text-slate-400 uppercase tracking-wider font-medium">
                        {metric.label}
                      </span>
                      <span className="font-mono text-xs sm:text-sm font-bold block mt-1 text-slate-900">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
