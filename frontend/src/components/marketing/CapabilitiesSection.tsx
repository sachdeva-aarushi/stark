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
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  X,
} from "lucide-react";

interface CapabilityCard {
  id: string;
  num: string;
  title: string;
  category: string;
  headline: string;
  description: string;
  metric: string;
  metricLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  bgStyle: string;
  borderColor: string;
}

const capabilities: CapabilityCard[] = [
  {
    id: "cap-1",
    num: "01",
    title: "Multi-Agent Swarm",
    category: "Autonomous DAG",
    headline: "Parallel Orchestration",
    description: "Orchestrate heterogeneous agent teams with dynamic task routing, isolated context memory, and automated error-recovery.",
    metric: "Sub-50ms",
    metricLabel: "State Transition Latency",
    icon: Network,
    features: ["Sub-agent DAG concurrency", "Self-healing execution loops", "Token usage sandboxing", "Isolated memory stores"],
    bgStyle: "from-blue-50 to-indigo-50/60",
    borderColor: "border-blue-200",
  },
  {
    id: "cap-2",
    num: "02",
    title: "Verifiable RAG",
    category: "Semantic Grounding",
    headline: "Cryptographic Lineage",
    description: "Hybrid vector search and BM25 keyword matching with cryptographic citation hashes linking every generated claim to original sources.",
    metric: "0.96",
    metricLabel: "Mean Reciprocal Rank",
    icon: Database,
    features: ["Parent-child chunk preservation", "Cryptographic citation hashes", "Multi-tenant vector isolation", "Zero hallucinated claims"],
    bgStyle: "from-emerald-50 to-teal-50/60",
    borderColor: "border-emerald-200",
  },
  {
    id: "cap-3",
    num: "03",
    title: "Deterministic Sandbox",
    category: "Exact Compute",
    headline: "Mathematical Truth",
    description: "Execute Python and SQL transformations in isolated micro-containers to guarantee mathematical and schema accuracy.",
    metric: "0.00%",
    metricLabel: "Mathematical Drift",
    icon: Cpu,
    features: ["Isolated ephemeral container runtime", "Strict Pydantic / Zod validation", "Deterministic execution hashes", "Safe database query gates"],
    bgStyle: "from-amber-50 to-orange-50/60",
    borderColor: "border-amber-200",
  },
  {
    id: "cap-4",
    num: "04",
    title: "Universal MCP Tool Bus",
    category: "Open Integration",
    headline: "Open Protocol Standard",
    description: "Connect to databases, GitHub, Slack, and cloud APIs via Anthropic's Model Context Protocol without proprietary lock-in.",
    metric: "12+",
    metricLabel: "Pre-Built MCP Bridges",
    icon: Layers,
    features: ["Anthropic Open MCP standard", "Per-tool token budget limits", "Zero proprietary SDK locks", "Bi-directional streaming"],
    bgStyle: "from-sky-50 to-cyan-50/60",
    borderColor: "border-sky-200",
  },
  {
    id: "cap-5",
    num: "05",
    title: "Dual-Key Governance",
    category: "Human Oversight",
    headline: "Cryptographic Safety Gate",
    description: "Enforce policy-based thresholds where sensitive transactions pause automatically for multi-stakeholder cryptographic sign-off.",
    metric: "100%",
    metricLabel: "Audit Trail Traceability",
    icon: ShieldCheck,
    features: ["Multi-party sign-off gates", "Immutable SHA-256 ledger", "Real-time policy evaluation", "Cryptographic signature logs"],
    bgStyle: "from-purple-50 to-violet-50/60",
    borderColor: "border-purple-200",
  },
  {
    id: "cap-6",
    num: "06",
    title: "Visual DAG Studio",
    category: "Visual Architecture",
    headline: "Live Workflow Observer",
    description: "Design, simulate, and observe agent dependencies with live step-level replays, latency traces, and rollback controls.",
    metric: "Realtime",
    metricLabel: "Live Trace Replay",
    icon: Zap,
    features: ["Drag-and-drop node graph canvas", "Interactive live execution replay", "Branching error recovery rules", "Step-level state inspection"],
    bgStyle: "from-rose-50 to-pink-50/60",
    borderColor: "border-rose-200",
  },
];

export function CapabilitiesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedModalCap, setSelectedModalCap] = useState<CapabilityCard | null>(null);

  const nextCap = () => {
    setActiveIndex((prev) => (prev < capabilities.length - 1 ? prev + 1 : 0));
  };

  const prevCap = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : capabilities.length - 1));
  };

  return (
    <section id="capabilities" className="py-20 md:py-28 bg-[#f8fafc] border-b border-slate-200 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
                Section 05 — Core Capabilities
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight leading-snug mb-3">
              Six enterprise-grade modules in 3D perspective rotation.
            </h2>
            <p className="font-serif text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Click any card or use the navigation arrows to rotate through the architectural modules.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevCap}
              aria-label="Previous Module"
              className="w-11 h-11 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-700 shadow-xs hover:bg-slate-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="font-mono text-xs font-semibold px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-700">
              {capabilities[activeIndex].num} / 06
            </div>
            <button
              onClick={nextCap}
              aria-label="Next Module"
              className="w-11 h-11 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-700 shadow-xs hover:bg-slate-50 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D CYLINDRICAL PERSPECTIVE CAROUSEL (Directly Inspired by Image 5) */}
        <div className="relative h-[500px] sm:h-[540px] w-full flex items-center justify-center select-none perspective-1200 preserve-3d">
          
          {capabilities.map((cap, idx) => {
            const offset = idx - activeIndex;
            const isCenter = offset === 0;
            const distance = Math.abs(offset);

            // Compute 3D perspective cylindrical transforms matching Image 5
            // Center is front-facing (rotateY: 0deg, translateZ: 0), sides rotated in Y-space (-26deg, +26deg)
            const rotateY = offset * 24;
            const xOffset = offset * 210;
            const zOffset = -distance * 90;
            const scale = isCenter ? 1.05 : Math.max(0.85, 1 - distance * 0.08);
            const opacity = distance > 2 ? 0.2 : distance === 2 ? 0.55 : 1;
            const zIndex = 30 - distance * 5;

            const Icon = cap.icon;

            return (
              <motion.div
                key={cap.id}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                  zIndex: zIndex,
                }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                onClick={() => {
                  if (isCenter) {
                    setSelectedModalCap(cap);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                className={`absolute w-72 sm:w-80 h-[420px] sm:h-[450px] rounded-[2.5rem] p-7 flex flex-col justify-between shadow-2xl cursor-pointer border-2 bg-gradient-to-b bg-white ${cap.borderColor} ${cap.bgStyle} transition-shadow duration-300 hover:shadow-2xl`}
              >
                {/* Top Header: Badge and Pillar Number */}
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/80">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-800 shadow-xs">
                      {cap.category}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      [ {cap.num} ]
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-xs shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-slate-900 leading-tight">
                        {cap.title}
                      </h3>
                      <span className="font-mono text-[11px] font-medium text-slate-500 block">
                        {cap.headline}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-serif text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-4">
                    {cap.description}
                  </p>

                  {/* Key Features List (Styled like Image 5's editorial item list) */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                    {cap.features.slice(0, 3).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs font-serif text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Metric & Action */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900 block leading-tight">
                      {cap.metric}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                      {cap.metricLabel}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedModalCap(cap);
                    }}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs hover:bg-slate-900 hover:text-white transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal for Capability Deep Dive */}
        <AnimatePresence>
          {selectedModalCap && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-left"
              >
                <button
                  onClick={() => setSelectedModalCap(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-xs">
                    <selectedModalCap.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      CAPABILITY MODULE {selectedModalCap.num}
                    </span>
                    <h3 className="font-serif text-2xl font-semibold text-slate-900">
                      {selectedModalCap.title}
                    </h3>
                  </div>
                </div>

                <p className="font-serif text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                  {selectedModalCap.description}
                </p>

                <div className="space-y-2 mb-6">
                  <span className="font-mono text-xs font-semibold text-slate-800 uppercase tracking-wider block">
                    Engineering Specifications:
                  </span>
                  {selectedModalCap.features.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-serif text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedModalCap(null)}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white font-serif text-xs font-semibold uppercase tracking-wider hover:bg-slate-800"
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
