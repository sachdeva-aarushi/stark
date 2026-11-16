"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Database, ShieldCheck, Cpu, Terminal, Sparkles } from "lucide-react";
import { ArcCardFan, FanCardItem } from "./cards/ArcCardFan";

const heroFanCards: FanCardItem[] = [
  {
    id: "card-swarm",
    num: "01",
    badge: "Multi-Agent Swarm",
    title: "Autonomous Agents",
    subtitle: "Domain-Specialized Execution",
    description:
      "Decomposes complex requests across dedicated researcher, analyst, and audit agents working concurrently with isolated state.",
    extendedInfo: [
      "Parallel DAG execution with dynamic task delegation.",
      "Self-healing error recovery with automatic retries.",
      "Strict least-privilege token sandboxing per agent.",
    ],
    metricLabel: "Execution Concurrency",
    metricValue: "Parallel Multi-Agent",
    bgGradient: "bg-gradient-to-b from-amber-50/90 via-amber-100/50 to-white",
    borderClass: "border border-amber-200/80 hover:border-amber-400",
    accentColor: "bg-amber-500",
  },
  {
    id: "card-rag",
    num: "02",
    badge: "Vector Grounding",
    title: "Enterprise RAG",
    subtitle: "Hybrid Semantic Retrieval",
    description:
      "Dense vector embeddings combined with BM25 sparse keyword search and hierarchical chunking. Cites verifiable internal documents.",
    extendedInfo: [
      "Multi-hop reasoning across enterprise knowledge silos.",
      "Parent-child chunk preservation prevents context collapse.",
      "Cryptographic citation hashing for every generated fact.",
    ],
    metricLabel: "Retrieval Precision",
    metricValue: "0.96 Cosine Match",
    bgGradient: "bg-gradient-to-b from-slate-100/90 via-slate-50 to-white",
    borderClass: "border border-slate-300/80 hover:border-slate-500",
    accentColor: "bg-slate-700",
  },
  {
    id: "card-dag",
    num: "03",
    badge: "Deterministic Core",
    title: "Execution DAG",
    subtitle: "Directed Acyclic Graph Planning",
    description:
      "Replaces unpredictable prompt chains with deterministic execution graphs. Simulates validation gates before invoking external systems.",
    extendedInfo: [
      "Deterministic graph planning verified prior to tool execution.",
      "Strict Pydantic / Zod schema enforcement across node edges.",
      "Complete state persistence across hours-long workflows.",
    ],
    metricLabel: "Graph Reliability",
    metricValue: "100% Deterministic",
    bgGradient: "bg-gradient-to-b from-purple-50/90 via-purple-100/40 to-white",
    borderClass: "border border-purple-200/80 hover:border-purple-400",
    accentColor: "bg-purple-600",
  },
  {
    id: "card-mcp",
    num: "04",
    badge: "Open Protocol",
    title: "MCP Tool Bus",
    subtitle: "Universal Infrastructure Bridge",
    description:
      "Native Model Context Protocol connectors linking agents directly into GitHub, PostgreSQL, internal APIs, and enterprise cloud data.",
    extendedInfo: [
      "Open Anthropic Model Context Protocol standard.",
      "Zero vendor lock-in with portable tool definitions.",
      "Sub-50ms secure bridge execution in isolated sandboxes.",
    ],
    metricLabel: "Protocol Standard",
    metricValue: "Model Context Protocol",
    bgGradient: "bg-gradient-to-b from-emerald-50/90 via-emerald-100/40 to-white",
    borderClass: "border border-emerald-200/80 hover:border-emerald-400",
    accentColor: "bg-emerald-600",
  },
  {
    id: "card-gov",
    num: "05",
    badge: "Human Governance",
    title: "Dual-Key Gate",
    subtitle: "Auditable Approval Checkpoints",
    description:
      "Autonomous execution pauses automatically at high-risk boundaries (financial transfers, schema migrations) for cryptographic sign-off.",
    extendedInfo: [
      "Configurable risk-threshold policy evaluation.",
      "Immutable audit ledger with end-to-end trace replay.",
      "Dual-signature verification for enterprise transactions.",
    ],
    metricLabel: "Compliance Audit",
    metricValue: "Immutable SHA-256",
    bgGradient: "bg-gradient-to-b from-blue-50/90 via-blue-100/40 to-white",
    borderClass: "border border-blue-200/80 hover:border-blue-400",
    accentColor: "bg-blue-600",
  },
];

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white border-b border-zinc-200">
      {/* Subtle Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
        
        {/* Top Category Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="font-mono text-xs font-medium text-zinc-700 tracking-wider uppercase">
            Enterprise AI Workflow Orchestration Platform
          </span>
        </motion.div>

        {/* Monumental Serif Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-zinc-950 tracking-tight leading-[1.04] mb-8 max-w-4xl mx-auto"
        >
          Intelligence, <br />
          <span className="italic font-normal text-zinc-800">orchestrated.</span>
        </motion.h1>

        {/* Subtitle Positioning */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-sans text-lg sm:text-xl text-zinc-600 leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Move beyond fragile prompt chains and conversational demos. STARK coordinates autonomous agents, enterprise knowledge, and live tool bridges into auditable, production-grade workflows.
        </motion.p>

        {/* Primary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-zinc-950 text-white font-sans text-sm font-semibold tracking-tight shadow-xl hover:bg-zinc-800 transition-all duration-200"
          >
            <span>Open Platform</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="#orchestration"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-zinc-200/90 bg-white text-zinc-800 font-sans text-sm font-semibold hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200 shadow-sm"
          >
            Explore 5-Stage Arc
          </Link>
        </motion.div>

        {/* Arc Fan of 5 Interactive Cards (Inspired by the uploaded references!) */}
        <div className="w-full">
          <div className="mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Interactive Orchestration Mesh — Select a Card to Rotate into Focus
            </span>
          </div>

          <ArcCardFan cards={heroFanCards} />
        </div>

      </div>
    </section>
  );
}
