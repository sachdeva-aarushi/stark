"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  Cpu,
  Database,
  Layers,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  X,
  CheckCircle2,
} from "lucide-react";

interface CapabilityCard {
  id: string;
  num: string;
  title: string;
  category: string;
  description: string;
  metric: string;
  metricLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  borderColor: string;
  pillColor: string;
  specs: string[];
}

const capabilities: CapabilityCard[] = [
  {
    id: "cap-1",
    num: "01",
    title: "Multi-Agent Swarm Runtime",
    category: "Autonomous DAG",
    description: "Orchestrate heterogeneous agent teams with dynamic task routing, isolated context memory, and automated error-recovery.",
    metric: "Sub-50ms",
    metricLabel: "State Transition Latency",
    icon: Network,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200 hover:border-blue-400",
    pillColor: "bg-blue-100 text-blue-800",
    specs: ["Sub-agent DAG concurrency", "Self-healing execution loops", "Token usage sandboxing"],
  },
  {
    id: "cap-2",
    num: "02",
    title: "Verifiable Enterprise RAG",
    category: "Semantic Grounding",
    description: "Hybrid vector search and BM25 keyword matching with cryptographic citation hashes linking every claim to original sources.",
    metric: "0.96",
    metricLabel: "Mean Reciprocal Rank",
    icon: Database,
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200 hover:border-emerald-400",
    pillColor: "bg-emerald-100 text-emerald-800",
    specs: ["Parent-child chunk preservation", "Cryptographic citation lineage", "Multi-tenant vector isolation"],
  },
  {
    id: "cap-3",
    num: "03",
    title: "Deterministic Code Sandbox",
    category: "Exact Compute",
    description: "Execute Python and SQL transformations in isolated micro-containers to guarantee mathematical and schema accuracy.",
    metric: "0.00%",
    metricLabel: "Mathematical Drift",
    icon: Cpu,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200 hover:border-amber-400",
    pillColor: "bg-amber-100 text-amber-800",
    specs: ["Isolated ephemeral container runtime", "Strict Pydantic / Zod validation", "Deterministic execution hashes"],
  },
  {
    id: "cap-4",
    num: "04",
    title: "Universal MCP Tool Bus",
    category: "Open Integration",
    description: "Connect to databases, GitHub, Slack, and cloud APIs via Anthropic's Model Context Protocol without vendor lock-in.",
    metric: "12+",
    metricLabel: "Pre-Built MCP Bridges",
    icon: Layers,
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200 hover:border-sky-400",
    pillColor: "bg-sky-100 text-sky-800",
    specs: ["Anthropic Open MCP standard", "Per-tool token budget limits", "Zero proprietary SDK locks"],
  },
  {
    id: "cap-5",
    num: "05",
    title: "Dual-Key Cryptographic Gate",
    category: "Human Oversight",
    description: "Enforce policy-based thresholds where sensitive transactions pause automatically for multi-stakeholder cryptographic sign-off.",
    metric: "100%",
    metricLabel: "Audit Trail Traceability",
    icon: ShieldCheck,
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200 hover:border-purple-400",
    pillColor: "bg-purple-100 text-purple-800",
    specs: ["Multi-party sign-off gates", "Immutable SHA-256 ledger", "Real-time policy evaluation"],
  },
  {
    id: "cap-6",
    num: "06",
    title: "Visual DAG Workflow Studio",
    category: "Visual Architecture",
    description: "Design, simulate, and observe agent dependencies with live step-level replays, latency traces, and rollback controls.",
    metric: "Realtime",
    metricLabel: "Live Trace Replay",
    icon: Zap,
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200 hover:border-rose-400",
    pillColor: "bg-rose-100 text-rose-800",
    specs: ["Drag-and-drop node graph canvas", "Interactive live execution replay", "Branching error recovery rules"],
  },
];

export function CapabilitiesSection() {
  const [selectedCap, setSelectedCap] = useState<CapabilityCard | null>(null);

  return (
    <section id="capabilities" className="py-16 md:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Section 05 — Core Capabilities
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-slate-900 tracking-tight leading-snug mb-2">
            Six enterprise-grade modules engineered for production.
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
            Every module operates as an independent, testable service with deterministic contracts.
          </p>
        </div>

        {/* 6 Opaque Light Cards (3x2 Grid fitting comfortably in one screen frame) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.id}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                onClick={() => setSelectedCap(cap)}
                className={`rounded-2xl p-6 flex flex-col justify-between shadow-xs border-2 ${cap.borderColor} ${cap.bgColor} cursor-pointer transition-all duration-200 min-h-[250px]`}
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold uppercase ${cap.pillColor}`}>
                      {cap.category}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {cap.num}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-slate-900 leading-snug">
                      {cap.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-xs text-slate-600 leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                {/* Bottom Metric & Inspect Action */}
                <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900 block leading-tight">
                      {cap.metric}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {cap.metricLabel}
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal for Capability Details */}
        <AnimatePresence>
          {selectedCap && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-left"
              >
                <button
                  onClick={() => setSelectedCap(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-xs">
                    <selectedCap.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      CAPABILITY {selectedCap.num}
                    </span>
                    <h3 className="font-serif text-xl font-semibold text-slate-900">
                      {selectedCap.title}
                    </h3>
                  </div>
                </div>

                <p className="font-sans text-sm text-slate-600 leading-relaxed mb-6">
                  {selectedCap.description}
                </p>

                <div className="space-y-2 mb-6">
                  <span className="font-mono text-xs font-semibold text-slate-800 uppercase tracking-wider block">
                    Engineering Specs:
                  </span>
                  {selectedCap.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-sans text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedCap(null)}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white font-sans text-xs font-semibold uppercase tracking-wider hover:bg-slate-800"
                >
                  Close Inspection
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
