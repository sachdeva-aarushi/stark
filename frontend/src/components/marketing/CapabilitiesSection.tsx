"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Database, Workflow, ShieldCheck, UserCheck, Cpu, ArrowRight, X, CheckCircle2 } from "lucide-react";

interface CapabilityCard {
  id: string;
  pillTag: string;
  num: string;
  title: string;
  subtitle: string;
  description: string;
  keySpecs: string[];
  metricLabel: string;
  metricValue: string;
  bgGradient: string;
  borderClass: string;
  dotColor: string;
  isDark?: boolean;
}

const capabilities: CapabilityCard[] = [
  {
    id: "cap-1",
    pillTag: "Agent Orchestration",
    num: "01",
    title: "Multi-Agent Swarm",
    subtitle: "Parallel DAG Coordination",
    description:
      "Coordinate specialized autonomous agents (researcher, analyst, auditor) working in parallel with isolated context and automatic error recovery.",
    keySpecs: [
      "Dynamic task decomposition",
      "Per-agent role & token isolation",
      "Self-healing retry logic",
    ],
    metricLabel: "Execution Concurrency",
    metricValue: "Parallel Multi-Agent",
    bgGradient: "bg-gradient-to-b from-emerald-50/80 via-emerald-100/30 to-white",
    borderClass: "border-2 border-emerald-300/80 hover:border-emerald-500",
    dotColor: "bg-emerald-600",
  },
  {
    id: "cap-2",
    pillTag: "Semantic Grounding",
    num: "02",
    title: "Hybrid Vector RAG",
    subtitle: "Dense & Sparse Retrieval",
    description:
      "Combines vector embeddings with BM25 keyword matching and hierarchical chunking. Cites verifiable enterprise documentation.",
    keySpecs: [
      "Multi-hop cross-document reasoning",
      "Parent-child chunk preservation",
      "Cryptographic citation hash",
    ],
    metricLabel: "Precision Score",
    metricValue: "0.96 Cosine Match",
    bgGradient: "bg-gradient-to-b from-amber-50/80 via-amber-100/30 to-white",
    borderClass: "border-2 border-amber-300/80 hover:border-amber-500",
    dotColor: "bg-amber-600",
  },
  {
    id: "cap-3",
    pillTag: "Visual Studio",
    num: "03",
    title: "Workflow Studio",
    subtitle: "Interactive DAG Builder",
    description:
      "Design, simulate, and deploy multi-stage workflows as clear Directed Acyclic Graphs with full dependency inspection.",
    keySpecs: [
      "Visual graph state inspection",
      "Conditional branching & joins",
      "Pre-flight simulation mode",
    ],
    metricLabel: "Execution Model",
    metricValue: "Strict DAG (0 Cycles)",
    bgGradient: "bg-gradient-to-b from-blue-50/80 via-blue-100/30 to-white",
    borderClass: "border-2 border-blue-300/80 hover:border-blue-500",
    dotColor: "bg-blue-600",
  },
  {
    id: "cap-4",
    pillTag: "Deterministic Engine",
    num: "04",
    title: "Sandboxed Compute",
    subtitle: "Isolated Python & SQL Runtime",
    description:
      "Execute exact calculations and data manipulations inside secure containers rather than relying on probabilistic LLM math.",
    keySpecs: [
      "Isolated container runtimes",
      "Strict Pydantic / Zod schema tests",
      "Zero mathematical drift",
    ],
    metricLabel: "Calculation Error",
    metricValue: "0.00% Drift",
    bgGradient: "bg-gradient-to-b from-purple-50/80 via-purple-100/30 to-white",
    borderClass: "border-2 border-purple-300/80 hover:border-purple-500",
    dotColor: "bg-purple-600",
  },
  {
    id: "cap-5",
    pillTag: "Human Oversight",
    num: "05",
    title: "Dual-Key Governance",
    subtitle: "Cryptographic Sign-Off Gate",
    description:
      "Configurable risk-threshold policies automatically pause mission-critical workflows for dual-signature human authorization.",
    keySpecs: [
      "Policy-based threshold triggers",
      "Dual-signature verification",
      "Immutable audit ledger",
    ],
    metricLabel: "Compliance Audit",
    metricValue: "SHA-256 Validated",
    bgGradient: "bg-gradient-to-b from-rose-50/80 via-rose-100/30 to-white",
    borderClass: "border-2 border-rose-300/80 hover:border-rose-500",
    dotColor: "bg-rose-600",
  },
  {
    id: "cap-6",
    pillTag: "Open Infrastructure",
    num: "06",
    title: "MCP Tool Ecosystem",
    subtitle: "Universal Protocol Bridges",
    description:
      "Native Anthropic Model Context Protocol connectors linking agents to GitHub, Postgres, Slack, and cloud APIs without lock-in.",
    keySpecs: [
      "Standard open MCP protocol",
      "Sub-50ms bridge execution",
      "Zero proprietary vendor lock-in",
    ],
    metricLabel: "Latency Overhead",
    metricValue: "< 50ms Bridge Call",
    bgGradient: "bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 text-white",
    borderClass: "border-2 border-zinc-700 hover:border-zinc-500",
    dotColor: "bg-blue-400",
    isDark: true,
  },
];

export function CapabilitiesSection() {
  const [selectedCap, setSelectedCap] = useState<CapabilityCard | null>(null);

  return (
    <section id="capabilities" className="py-24 md:py-32 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Section 05 — Platform Capabilities
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-zinc-950 tracking-tight leading-tight mb-6">
            Six architectural capabilities built for mission-critical operations.
          </h2>
          <p className="font-sans text-base sm:text-lg text-zinc-600 leading-relaxed">
            Every capability in STARK is built to eliminate probabilistic failure modes in production. Explore our native orchestration primitives below.
          </p>
        </div>

        {/* 6 Elegant Motion Cards (3x2 Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {capabilities.map((cap) => {
            return (
              <motion.div
                key={cap.id}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`rounded-[2.5rem] p-8 flex flex-col justify-between shadow-xl transition-all duration-300 ${cap.bgGradient} ${cap.borderClass}`}
              >
                {/* Header: Pill Badge & Number */}
                <div>
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-200/40">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[11px] font-bold uppercase shadow-sm ${
                        cap.isDark
                          ? "bg-zinc-800 text-zinc-200 border border-zinc-700"
                          : "bg-white/90 text-zinc-800 border border-zinc-200/80"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${cap.dotColor}`} />
                      {cap.pillTag}
                    </span>
                    <span className="font-mono text-xs font-bold text-zinc-400">
                      {cap.num}
                    </span>
                  </div>

                  <h3
                    className={`font-serif text-2xl font-semibold tracking-tight mb-1 ${
                      cap.isDark ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    {cap.title}
                  </h3>
                  <span
                    className={`font-mono text-xs font-medium block mb-4 ${
                      cap.isDark ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    {cap.subtitle}
                  </span>

                  <p
                    className={`font-sans text-xs sm:text-sm leading-relaxed mb-6 ${
                      cap.isDark ? "text-zinc-300" : "text-zinc-700"
                    }`}
                  >
                    {cap.description}
                  </p>

                  {/* Bullet Specs */}
                  <div className="space-y-1.5 font-sans text-xs mb-6">
                    {cap.keySpecs.map((spec, sIdx) => (
                      <div
                        key={sIdx}
                        className={`flex items-center gap-2 p-2 rounded-lg ${
                          cap.isDark ? "bg-zinc-900/60 text-zinc-300" : "bg-white/70 text-zinc-800"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer: Metric & Action Button */}
                <div className="pt-4 border-t border-zinc-200/40">
                  <div className="flex items-center justify-between text-[11px] font-mono mb-3">
                    <span className={cap.isDark ? "text-zinc-400" : "text-zinc-500"}>
                      {cap.metricLabel}
                    </span>
                    <span
                      className={`font-bold ${
                        cap.isDark ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      {cap.metricValue}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedCap(cap)}
                    className={`w-full py-2.5 px-4 rounded-xl font-sans text-xs font-semibold tracking-wider uppercase border shadow-sm flex items-center justify-center gap-1.5 transition-all ${
                      cap.isDark
                        ? "bg-white text-zinc-950 hover:bg-zinc-100 border-white"
                        : "bg-white hover:bg-zinc-50 text-zinc-950 border-zinc-200"
                    }`}
                  >
                    <span>Inspect Capability</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Modal on "Inspect Capability" */}
        <AnimatePresence>
          {selectedCap && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.25 }}
                className="relative w-full max-w-xl bg-white rounded-3xl p-8 shadow-2xl border border-zinc-200 overflow-hidden"
              >
                <button
                  onClick={() => setSelectedCap(null)}
                  className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                    CAPABILITY {selectedCap.num}
                  </span>
                  <span className="font-mono text-xs text-zinc-500 uppercase">
                    {selectedCap.pillTag}
                  </span>
                </div>

                <h3 className="font-serif text-3xl font-semibold text-zinc-950 mb-1">
                  {selectedCap.title}
                </h3>
                <p className="font-mono text-xs text-zinc-500 mb-6">
                  {selectedCap.subtitle}
                </p>

                <p className="font-sans text-sm text-zinc-700 leading-relaxed mb-6">
                  {selectedCap.description}
                </p>

                <div className="space-y-2 mb-8">
                  <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider block">
                    Enterprise Engineering Standards:
                  </span>
                  {selectedCap.keySpecs.map((spec, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-xs font-sans text-zinc-800 bg-zinc-50 p-3 rounded-xl border border-zinc-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block">
                      {selectedCap.metricLabel}
                    </span>
                    <span className="font-mono text-sm font-bold text-zinc-950">
                      {selectedCap.metricValue}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedCap(null)}
                    className="px-6 py-2.5 rounded-xl bg-zinc-950 text-white font-sans text-xs font-semibold hover:bg-zinc-800 transition-colors"
                  >
                    Close Specification
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
