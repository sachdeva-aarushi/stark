"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Database, BarChart3, Cpu, ShieldCheck, ArrowRight, RotateCw, CheckCircle2 } from "lucide-react";
import { CascadingDeck, DeckCardItem } from "./cards/CascadingDeck";

const deckPillars: DeckCardItem[] = [
  {
    id: "swarm",
    pillTag: "Parallel Swarm",
    title: "Specialized Agents",
    subtitle: "Autonomous Domain Execution",
    description:
      "STARK replaces single monolithic models with specialized agent swarms. Discrete tasks are assigned to dedicated research, data analysis, and compliance agents operating concurrently.",
    bulletPoints: [
      "Dynamic DAG routing with sub-agent concurrency",
      "Self-healing retries with automatic error recovery",
      "Strict least-privilege token sandboxing per agent",
    ],
    ctaLabel: "Cycle to Next Architecture Layer",
    bgGradient: "bg-gradient-to-b from-emerald-50 via-emerald-100/40 to-white",
    borderClass: "border-2 border-emerald-300/80 hover:border-emerald-500",
    accentDot: "bg-emerald-600",
  },
  {
    id: "rag",
    pillTag: "Semantic Truth",
    title: "Enterprise RAG",
    subtitle: "Hybrid Vector & Keyword Grounding",
    description:
      "Combines dense vector embeddings with BM25 keyword matching and hierarchical chunking. Guarantees that every generated output is anchored in verified internal enterprise documentation.",
    bulletPoints: [
      "Multi-hop reasoning across enterprise knowledge silos",
      "Parent-child chunk preservation prevents context collapse",
      "Verifiable citation hashes for compliance audits",
    ],
    ctaLabel: "Cycle to Next Architecture Layer",
    bgGradient: "bg-gradient-to-b from-amber-50 via-amber-100/40 to-white",
    borderClass: "border-2 border-amber-300/80 hover:border-amber-500",
    accentDot: "bg-amber-600",
  },
  {
    id: "compute",
    pillTag: "Exact Math",
    title: "Deterministic Compute",
    subtitle: "Sandboxed Python & SQL Runtime",
    description:
      "Enterprise workflows cannot tolerate probabilistic arithmetic. STARK executes numerical calculations and queries inside isolated containers with deterministic verification.",
    bulletPoints: [
      "Isolated container runtimes for Python and SQL",
      "Zero LLM mathematical drift or estimation",
      "Strict Pydantic / Zod schema output validation",
    ],
    ctaLabel: "Cycle to Next Architecture Layer",
    bgGradient: "bg-gradient-to-b from-blue-50 via-blue-100/40 to-white",
    borderClass: "border-2 border-blue-300/80 hover:border-blue-500",
    accentDot: "bg-blue-600",
  },
  {
    id: "mcp",
    pillTag: "Open Standard",
    title: "MCP Tool Bus",
    subtitle: "Model Context Protocol Integration",
    description:
      "Connects agents directly to internal databases, GitHub, Slack, and cloud APIs through open-standard MCP servers without proprietary vendor lock-in.",
    bulletPoints: [
      "Native Anthropic Model Context Protocol standard",
      "Portable tool definitions across enterprise services",
      "Sub-50ms secure invocation with role-based auth",
    ],
    ctaLabel: "Cycle to Next Architecture Layer",
    bgGradient: "bg-gradient-to-b from-purple-50 via-purple-100/40 to-white",
    borderClass: "border-2 border-purple-300/80 hover:border-purple-500",
    accentDot: "bg-purple-600",
  },
  {
    id: "gov",
    pillTag: "Governance Gate",
    title: "Human Governance",
    subtitle: "Dual-Key Checkpoint Authorization",
    description:
      "Automates low-consequence tasks while automatically halting at critical financial or system mutation thresholds for cryptographic human sign-off.",
    bulletPoints: [
      "Policy-based threshold routing for high-stakes actions",
      "Dual-signature cryptographic authorization",
      "Immutable audit ledger with end-to-end trace replay",
    ],
    ctaLabel: "Cycle to First Architecture Layer",
    bgGradient: "bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 text-white",
    borderClass: "border-2 border-zinc-700 hover:border-zinc-500",
    accentDot: "bg-blue-400",
  },
];

export function WhatItDoesSection() {
  return (
    <section id="orchestration" className="py-24 md:py-32 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Section 03 — The Orchestration Core
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-zinc-950 tracking-tight leading-tight mb-6">
            Five layered pillars powering deterministic execution.
          </h2>
          <p className="font-sans text-base sm:text-lg text-zinc-600 leading-relaxed">
            STARK replaces the chaotic prompt-and-pray paradigm with an integrated multi-agent stack. Click any card in the deck below to cycle through the architecture.
          </p>
        </div>

        {/* 5-Card Cascading Interactive Stack Deck (Inspired by image-3.png & image-6.png) */}
        <div className="w-full flex justify-center py-6">
          <CascadingDeck cards={deckPillars} />
        </div>

      </div>
    </section>
  );
}
