"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Database, BarChart3, Cpu, ShieldCheck, UserCheck, ArrowRight, Network, CheckCircle2 } from "lucide-react";
import { TiltCard } from "./cards/TiltCard";

interface CoreComponent {
  id: string;
  number: string;
  name: string;
  role: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  metrics: { label: string; value: string }[];
  connections: string[];
}

const components: CoreComponent[] = [
  {
    id: "agents",
    number: "01",
    name: "Specialized Agents",
    role: "Autonomous Execution Swarm",
    tagline: "Purpose-built intelligence assigned to discrete domain tasks.",
    description:
      "Rather than relying on one monolithic general-purpose model, STARK decomposes complex business objectives into discrete sub-tasks executed by specialized agents (Research, Analysis, Code, Compliance) operating in parallel.",
    icon: Bot,
    metrics: [
      { label: "Execution Model", value: "Multi-Agent DAG" },
      { label: "Concurrency", value: "Parallel" },
      { label: "Error Recovery", value: "Self-Healing Retries" },
    ],
    connections: ["knowledge", "tools", "validation"],
  },
  {
    id: "knowledge",
    number: "02",
    name: "Enterprise Knowledge & RAG",
    role: "Semantic Grounding Layer",
    tagline: "Multi-hop hybrid search grounded in verified internal truth.",
    description:
      "Combines dense vector similarity with sparse BM25 keyword matching and hierarchical document chunking. Guarantees that every generated conclusion cites verified internal documentation with exact source provenance.",
    icon: Database,
    metrics: [
      { label: "Retrieval Method", value: "Hybrid Dense + Sparse" },
      { label: "Chunk Hierarchy", value: "Parent-Child Preservation" },
      { label: "Citation Lineage", value: "Cryptographic Hash" },
    ],
    connections: ["agents", "validation"],
  },
  {
    id: "data",
    number: "03",
    name: "Data Analysis & Compute",
    role: "Deterministic Compute Engine",
    tagline: "Code-driven statistical analysis in secure execution sandboxes.",
    description:
      "When enterprise workflows involve numerical data, financial figures, or statistical forecasting, STARK runs deterministic Python and SQL in an isolated sandbox rather than letting language models estimate math.",
    icon: BarChart3,
    metrics: [
      { label: "Runtime Sandbox", value: "Isolated Container" },
      { label: "Computation Type", value: "Native Python & SQL" },
      { label: "Mathematical Drift", value: "Zero Tolerance" },
    ],
    connections: ["agents", "tools", "validation"],
  },
  {
    id: "tools",
    number: "04",
    name: "MCP Tool Integrations",
    role: "Standard Protocol Bridge",
    tagline: "Unified tool execution via open Model Context Protocol.",
    description:
      "Connects seamlessly to existing enterprise infrastructure—GitHub, PostgreSQL, Slack, Salesforce, internal REST APIs—without proprietary lock-in, through open standard MCP servers and client connectors.",
    icon: Cpu,
    metrics: [
      { label: "Protocol", value: "Anthropic Open MCP" },
      { label: "Auth Management", value: "Role-Based Token Gateway" },
      { label: "Tool Schema", value: "Strict JSON Validation" },
    ],
    connections: ["agents", "data", "approval"],
  },
  {
    id: "validation",
    number: "05",
    name: "Deterministic Validation",
    role: "Zero-Defect Guardrail Gate",
    tagline: "Automated verification enforcing enterprise policies and schemas.",
    description:
      "Every intermediate and final output is validated against strict Pydantic schemas, policy rules, and factual consistency checks. Hallucinations and malformed outputs are intercepted and corrected before reaching external systems.",
    icon: ShieldCheck,
    metrics: [
      { label: "Policy Checks", value: "Pre & Post Execution" },
      { label: "Schema Enforcement", value: "Strict Pydantic / Zod" },
      { label: "Hallucination Trap", value: "Automated Re-prompting" },
    ],
    connections: ["agents", "knowledge", "approval"],
  },
  {
    id: "approval",
    number: "06",
    name: "Human Governance & Approval",
    role: "Dual-Key Authorization Gate",
    tagline: "Auditable human oversight where high-stakes operations require it.",
    description:
      "Automates low-consequence repetitive workflows while automatically halting at critical decision boundaries—financial disbursements, production code merges, external client communications—for human verification.",
    icon: UserCheck,
    metrics: [
      { label: "Threshold Routing", value: "Policy-Based" },
      { label: "Audit Ledger", value: "Immutable Log" },
      { label: "Sign-Off Mode", value: "Dual-Key Support" },
    ],
    connections: ["tools", "validation"],
  },
];

export function WhatItDoesSection() {
  const [selectedId, setSelectedId] = useState<string>("agents");
  const selectedComponent = components.find((c) => c.id === selectedId) || components[0];

  return (
    <section id="orchestration" className="py-24 md:py-32 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Section 03 — The Orchestration Architecture
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-zinc-950 tracking-tight leading-tight mb-6">
            The six pillars of deterministic AI execution.
          </h2>
          <p className="font-sans text-base sm:text-lg text-zinc-600 leading-relaxed">
            STARK replaces the chaotic prompt-and-pray paradigm with a unified orchestration mesh. Click any component below to inspect how it connects with the central execution engine.
          </p>
        </div>

        {/* Interactive 3D Orchestration Nexus */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Satellite Selector Cards (6 cards) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {components.map((comp) => {
              const Icon = comp.icon;
              const isSelected = comp.id === selectedId;

              return (
                <div key={comp.id} className="relative">
                  <TiltCard
                    tiltMaxAngle={isSelected ? 4 : 8}
                    bgClass={isSelected ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"}
                    borderClass={
                      isSelected
                        ? "border-2 border-zinc-950 shadow-xl"
                        : "border border-zinc-200 hover:border-zinc-300"
                    }
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setSelectedId(comp.id)}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100/10">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            isSelected ? "bg-zinc-800 text-blue-400" : "bg-zinc-100 text-zinc-800"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`font-mono text-xs font-bold ${
                            isSelected ? "text-blue-400" : "text-zinc-400"
                          }`}
                        >
                          {comp.number}
                        </span>
                      </div>

                      <h4
                        className={`font-serif text-lg font-semibold mb-1 ${
                          isSelected ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {comp.name}
                      </h4>
                      <p
                        className={`font-sans text-xs line-clamp-2 ${
                          isSelected ? "text-zinc-300" : "text-zinc-500"
                        }`}
                      >
                        {comp.tagline}
                      </p>
                    </div>
                  </TiltCard>
                </div>
              );
            })}
          </div>

          {/* Right Column: Prominent Focused Architectural Detail Card */}
          <div className="lg:col-span-6 sticky top-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedComponent.id}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className="rounded-2xl border-2 border-zinc-950 bg-white p-8 md:p-10 shadow-2xl relative overflow-hidden">
                  
                  {/* Architectural Accent Grid in Background */}
                  <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Header with Role & Number */}
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-md">
                        {React.createElement(selectedComponent.icon, { className: "w-6 h-6 text-blue-400" })}
                      </div>
                      <div>
                        <span className="font-mono text-xs text-blue-700 font-semibold tracking-wider uppercase block">
                          CORE PILLAR {selectedComponent.number}
                        </span>
                        <h3 className="font-serif text-2xl md:text-3xl font-semibold text-zinc-950 tracking-tight">
                          {selectedComponent.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Tagline & Deep Operational Description */}
                  <div className="mb-8">
                    <p className="font-serif text-lg text-zinc-900 font-medium italic mb-3">
                      &ldquo;{selectedComponent.tagline}&rdquo;
                    </p>
                    <p className="font-sans text-base text-zinc-600 leading-relaxed">
                      {selectedComponent.description}
                    </p>
                  </div>

                  {/* Architectural Verification Telemetry */}
                  <div className="mb-8 p-5 bg-zinc-50 rounded-xl border border-zinc-200/80">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block mb-3">
                      Architectural Guarantees
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {selectedComponent.metrics.map((metric, mIdx) => (
                        <div key={mIdx}>
                          <span className="font-mono text-[11px] text-zinc-500 block">
                            {metric.label}
                          </span>
                          <span className="font-mono text-xs font-semibold text-zinc-900 mt-0.5 block">
                            {metric.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connected Mesh Paths */}
                  <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-blue-600" />
                      <span className="font-mono text-xs text-zinc-600">
                        Active Bus Connections:
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-800 font-medium">
                        {selectedComponent.connections.map((conn, cIdx) => (
                          <span key={cIdx} className="bg-zinc-100 px-2 py-0.5 rounded uppercase text-[11px]">
                            {conn}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified Bus Ready</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
