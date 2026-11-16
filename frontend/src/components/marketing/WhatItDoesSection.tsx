"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Database,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  X,
  CheckCircle2,
} from "lucide-react";

interface WaveCard {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  specs: string[];
  rotation: number;
  offsetY: number;
}

const waveCards: WaveCard[] = [
  {
    id: "agents",
    num: "01",
    title: "Autonomous Agent Swarms",
    subtitle: "Parallel Task Execution",
    bgColor: "bg-blue-600",
    textColor: "text-white",
    icon: Bot,
    description: "Decomposes monolithic prompts into coordinated, specialized sub-agents running concurrently with isolated context.",
    specs: ["Sub-agent DAG concurrency", "Self-healing error recovery", "Least-privilege token budgets"],
    rotation: -3,
    offsetY: 8,
  },
  {
    id: "rag",
    num: "02",
    title: "Hybrid Enterprise RAG",
    subtitle: "Semantic Grounding",
    bgColor: "bg-emerald-600",
    textColor: "text-white",
    icon: Database,
    description: "Blends dense embeddings with BM25 keyword retrieval and hierarchical chunking to eliminate hallucinations.",
    specs: ["Preserves parent-child chunk lineage", "Cryptographic citation hashes", "Multi-silo enterprise search"],
    rotation: 2,
    offsetY: -10,
  },
  {
    id: "dag",
    num: "03",
    title: "Deterministic DAG Engine",
    subtitle: "State Machine Routing",
    bgColor: "bg-amber-500",
    textColor: "text-white",
    icon: Cpu,
    description: "Every multi-step workflow executes as an explicit Directed Acyclic Graph with deterministic state transitions.",
    specs: ["100% auditable execution path", "Step-level checkpointing & replay", "Strict Pydantic / Zod schema validation"],
    rotation: -2,
    offsetY: 12,
  },
  {
    id: "mcp",
    num: "04",
    title: "Universal MCP Tool Bus",
    subtitle: "Open Standard Integration",
    bgColor: "bg-sky-500",
    textColor: "text-white",
    icon: Layers,
    description: "Connects agents to databases, APIs, and cloud services using the open Model Context Protocol with zero lock-in.",
    specs: ["Anthropic Open MCP standard", "Sub-50ms tool execution latency", "Role-based authorization per tool"],
    rotation: 3,
    offsetY: -6,
  },
  {
    id: "sandbox",
    num: "05",
    title: "Sandbox Python / SQL",
    subtitle: "Mathematical Truth",
    bgColor: "bg-purple-600",
    textColor: "text-white",
    icon: Zap,
    description: "All numerical calculations and database mutations run inside isolated ephemeral containers with exact verification.",
    specs: ["Zero mathematical estimation or drift", "Secure ephemeral container runtime", "Deterministic execution logs"],
    rotation: -1,
    offsetY: 10,
  },
  {
    id: "governance",
    num: "06",
    title: "Dual-Key Governance",
    subtitle: "Human Oversight Gate",
    bgColor: "bg-rose-500",
    textColor: "text-white",
    icon: ShieldCheck,
    description: "Automates low-risk operations while halting high-consequence transactions for cryptographic human sign-off.",
    specs: ["Policy-based threshold routing", "Immutable SHA-256 audit ledger", "Dual-key cryptographic sign-off"],
    rotation: 2,
    offsetY: -8,
  },
];

export function WhatItDoesSection() {
  const [selectedCard, setSelectedCard] = useState<WaveCard | null>(null);

  return (
    <section id="orchestration" className="py-16 md:py-20 bg-slate-50/70 border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Compact Section Header (Ensuring single-screen framing) */}
        <div className="max-w-3xl mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Section 03 — Orchestration Core
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-slate-900 tracking-tight leading-snug mb-3">
            Six architectural pillars in an overlapping orchestration wave.
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
            STARK replaces fragile prompt engineering with deterministic multi-agent execution. Click any card to inspect its engineering specification.
          </p>
        </div>

        {/* Horizontal Overlapping Staggered Wave of Cards (Layout matching Image 4) */}
        <div className="relative w-full pb-3 pt-2">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:flex lg:items-center lg:justify-center lg:gap-0 lg:px-4">
            {waveCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  style={{
                    rotate: `${card.rotation}deg`,
                    y: card.offsetY,
                  }}
                  whileHover={{
                    scale: 1.06,
                    y: card.offsetY - 14,
                    rotate: 0,
                    zIndex: 40,
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  onClick={() => setSelectedCard(card)}
                  className={`relative ${idx > 0 ? "lg:-ml-6 xl:-ml-8" : ""} w-full lg:w-48 xl:w-52 h-[230px] sm:h-[245px] lg:h-[290px] rounded-2xl lg:rounded-[2rem] p-4 lg:p-5 flex flex-col justify-between shadow-lg cursor-pointer select-none transition-shadow duration-300 hover:shadow-xl ${card.bgColor} ${card.textColor} border-2 border-white`}
                >
                  {/* Top Header: Pill / Circle Number (Matching Image 4) */}
                  <div>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-none flex items-center justify-center font-mono text-xs font-bold mb-3 shadow-inner">
                      {card.num}
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold tracking-tight leading-snug">
                      {card.title}
                    </h3>
                  </div>

                  {/* Bottom Rounded Preview Container (Matching Image 4) */}
                  <div className="rounded-2xl bg-white p-3 flex flex-col justify-between h-24 border border-white">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-white text-slate-900 flex items-center justify-center shadow-sm">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-white">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider block text-white/80 font-medium">
                        {card.subtitle}
                      </span>
                      <span className="font-sans text-[11px] text-white/95 line-clamp-1 font-semibold">
                        Inspect Engine Specs
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Modal for Card Technical Inspection */}
        <AnimatePresence>
          {selectedCard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-left relative"
              >
                <button
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-2xl ${selectedCard.bgColor} text-white flex items-center justify-center shadow-md`}>
                    <selectedCard.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      LAYER {selectedCard.num}
                    </span>
                    <h3 className="font-serif text-2xl font-semibold text-slate-900">
                      {selectedCard.title}
                    </h3>
                  </div>
                </div>

                <p className="font-sans text-sm text-slate-600 leading-relaxed mb-6">
                  {selectedCard.description}
                </p>

                <div className="space-y-2 mb-6">
                  <span className="font-mono text-xs font-semibold text-slate-800 uppercase tracking-wider block">
                    Technical Specifications:
                  </span>
                  {selectedCard.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-sans text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedCard(null)}
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
