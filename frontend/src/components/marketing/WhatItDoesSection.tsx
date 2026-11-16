"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Database, BarChart3, Wrench, ShieldAlert, UserCheck, Play, ArrowRight, CheckCircle2 } from "lucide-react";

interface OrchestrationComponent {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  icon: React.ComponentType<{ className?: string }>;
  metric: string;
}

const COMPONENTS: OrchestrationComponent[] = [
  {
    id: "agents",
    number: "01",
    title: "Specialized Autonomous Agents",
    subtitle: "Role-scoped intelligence with defined capabilities",
    description: "Instead of monolithic generic prompts, STARK orchestrates dedicated, purpose-built agents (Researchers, Coders, Analysts, Verifiers) tailored with specific tools and strict execution boundaries.",
    details: [
      "Custom system prompts & tool access control",
      "Dynamic prompt composition & role assignment",
      "Synchronous or parallel agent delegation",
    ],
    icon: Bot,
    metric: "Multi-Agent Coordination",
  },
  {
    id: "knowledge",
    number: "02",
    title: "Enterprise Knowledge & RAG",
    subtitle: "High-dimensional vector embeddings with hybrid search",
    description: "Ingest PDFs, enterprise documents, structured tables, and databases. STARK generates embeddings, manages semantic vector retrieval, and grounds agent context in verifiable ground truth.",
    details: [
      "Hybrid dense & sparse semantic retrieval",
      "Chunk-level source citation & provenance",
      "Zero model hallucination on private documentation",
    ],
    icon: Database,
    metric: "Sub-50ms Hybrid RAG",
  },
  {
    id: "data",
    number: "03",
    title: "Deep Data & Analytical Research",
    subtitle: "Real-time computation, synthesis, and code execution",
    description: "Equip agents with isolated sandboxes to query live data lakes, evaluate statistical distributions, transform raw JSON streams, and execute algorithmic logic on the fly.",
    details: [
      "Dynamic SQL query construction & sandboxed execution",
      "Real-time analytical aggregation across warehouses",
      "Auditable execution logs with data snapshots",
    ],
    icon: BarChart3,
    metric: "Deterministic Compute",
  },
  {
    id: "mcp",
    number: "04",
    title: "MCP Tools & Standard Integrations",
    subtitle: "Native Model Context Protocol connectivity",
    description: "Connect your existing software stack through the open Model Context Protocol (MCP) or custom webhooks: Jira, GitHub, Slack, Postgres, Salesforce, and internal microservices.",
    details: [
      "Universal MCP server & client communication",
      "Secure credential isolation & token injection",
      "Standardized tool schemas with input validation",
    ],
    icon: Wrench,
    metric: "Open MCP Ecosystem",
  },
  {
    id: "validation",
    number: "05",
    title: "Validation & Schema Guardrails",
    subtitle: "Deterministic boundary enforcement before commit",
    description: "Every agent artifact, generated data structure, and downstream mutation is strictly validated against Pydantic schemas, policy rules, and regulatory safety boundaries.",
    details: [
      "Strict JSON Schema & type conformity checks",
      "Regex, range, and compliance constraint enforcement",
      "Automatic error feedback loops for agent re-try",
    ],
    icon: ShieldAlert,
    metric: "Zero-Defect Enforcement",
  },
  {
    id: "human",
    number: "06",
    title: "Human Approval & Oversight",
    subtitle: "Governed pause-and-resume approval gates",
    description: "Workflows pause automatically at critical checkpoints (such as destructive updates, financial disbursements, or client emails) requiring authenticated operator approval or feedback.",
    details: [
      "Granular role-based authorization controls",
      "In-line diff inspection & parameter modification",
      "Complete historical audit trail for every sign-off",
    ],
    icon: UserCheck,
    metric: "Deterministic HITL",
  },
  {
    id: "execution",
    number: "07",
    title: "Workflow Engine & State Persistence",
    subtitle: "Observable state machine with pause/resume resilience",
    description: "All execution states, agent messages, tool payloads, and memory nodes are persistently stored. If a node fails or waits for human sign-off, the workflow maintains transactional durability.",
    details: [
      "Transactional DAG execution engine",
      "Event-driven state transitions with rollback safety",
      "Real-time SSE event streaming to frontend views",
    ],
    icon: Play,
    metric: "Transactional Engine",
  },
];

export function WhatItDoesSection() {
  const [activeId, setActiveId] = useState<string>("agents");
  const activeComp = COMPONENTS.find((c) => c.id === activeId) || COMPONENTS[0];
  const ActiveIcon = activeComp.icon;

  return (
    <section id="orchestration" className="py-24 sm:py-32 bg-white border-b border-border relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
            <span className="w-2 h-[1px] bg-zinc-400" />
            <span>SECTION 03 / THE PLATFORM CORE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 leading-tight">
            One orchestration layer. <br />
            <span className="italic font-normal text-blue-700">Multiple forms of intelligence.</span>
          </h2>
          <p className="font-serif text-base sm:text-lg text-zinc-600 mt-4 leading-relaxed">
            STARK binds specialized autonomous agents, enterprise knowledge, external tooling, and human consensus into a single observable workflow pipeline.
          </p>
        </div>

        {/* Interactive Orchestration Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Selector List */}
          <div className="lg:col-span-5 space-y-2">
            <div className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-3 px-3">
              SELECT PLATFORM COMPONENT
            </div>
            {COMPONENTS.map((item) => {
              const isSelected = item.id === activeId;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-zinc-950 text-white border-zinc-950 shadow-md translate-x-1"
                      : "bg-surface text-zinc-800 border-border hover:border-zinc-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-border text-zinc-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] opacity-60">{item.number}</span>
                        <span className="font-serif text-sm font-semibold">{item.title}</span>
                      </div>
                      <div
                        className={`text-xs truncate max-w-[240px] font-sans ${
                          isSelected ? "text-zinc-300" : "text-zinc-500"
                        }`}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? "text-blue-400 translate-x-1" : "text-zinc-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Layered Architectural Visualizer */}
          <div className="lg:col-span-7 sticky top-28">
            <div className="bg-surface border border-zinc-300 rounded-xl p-8 shadow-[0_16px_40px_rgba(0,0,0,0.03)] relative overflow-hidden">
              {/* Subtle top indicator */}
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs text-blue-700 font-semibold uppercase">
                    ORCHESTRATION COMPONENT #{activeComp.number}
                  </span>
                  <span className="text-zinc-300">/</span>
                  <span className="font-mono text-xs text-zinc-500 uppercase">{activeComp.metric}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ONLINE &amp; GROUNDED</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeComp.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-white border border-border flex items-center justify-center text-blue-700 shadow-sm shrink-0">
                      <ActiveIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-zinc-950">
                        {activeComp.title}
                      </h3>
                      <p className="font-sans text-xs text-zinc-500 tracking-wider uppercase mt-1">
                        {activeComp.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="font-serif text-base text-zinc-700 leading-relaxed font-normal">
                    {activeComp.description}
                  </p>

                  <div className="p-5 bg-white border border-border rounded-lg space-y-3">
                    <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                      ARCHITECTURAL SPECIFICATIONS
                    </div>
                    <ul className="space-y-2">
                      {activeComp.details.map((detail, i) => (
                        <li key={i} className="flex items-center space-x-2.5 text-xs font-sans text-zinc-800">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Architectural telemetry diagram */}
                  <div className="p-4 bg-zinc-950 text-white rounded-lg font-mono text-xs space-y-2 border border-zinc-800">
                    <div className="flex items-center justify-between text-zinc-400 text-[11px] pb-2 border-b border-zinc-800">
                      <span>STARK RUNTIME PIPELINE</span>
                      <span className="text-emerald-400">STATE: VERIFIED</span>
                    </div>
                    <div className="text-zinc-300">
                      &gt; kernel.dispatch(&quot;{activeComp.id}&quot;) <br />
                      &gt; telemetry: state=HEALTHY, latency=34ms, guardrails=ACTIVE <br />
                      &gt; consensus: deterministic verification pass
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
