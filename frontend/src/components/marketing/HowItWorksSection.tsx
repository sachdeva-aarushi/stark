"use client";

import React from "react";
import { HorizontalStageCards, StageFlowItem } from "./cards/HorizontalStageCards";

const stagesData: StageFlowItem[] = [
  {
    id: "stage-1",
    step: "01",
    title: "Understand & Ground",
    subtitle: "Intent Parsing & Enterprise Retrieval",
    description:
      "Parses natural request intent and executes hybrid vector and BM25 sparse keyword queries across enterprise documentation.",
    bulletFlow: [
      "Natural language request parsed into structured domain constraints.",
      "Multi-hop semantic search extracts relevant policies and schemas.",
      "Context lineage sealed into an immutable execution snapshot.",
    ],
    artifact: "GroundingManifest.json",
    gate: "Relevance Score > 0.88",
    bgGradient: "bg-gradient-to-b from-emerald-50/80 via-emerald-100/30 to-white",
    borderClass: "border-2 border-emerald-300/80 hover:border-emerald-500",
    dotColor: "bg-emerald-600",
  },
  {
    id: "stage-2",
    step: "02",
    title: "Plan & Decompose",
    subtitle: "Deterministic DAG Graph Generation",
    description:
      "Generates a Directed Acyclic Graph breaking the request into discrete sub-tasks with clear dependency ordering and error pathways.",
    bulletFlow: [
      "Decomposes objective into concurrent and sequential agent nodes.",
      "Assigns required tool permissions and rate limits per node.",
      "Pre-execution simulation against policy guardrails.",
    ],
    artifact: "ExecutionPlan.dag",
    gate: "Zero Graph Cycles (Strict DAG)",
    bgGradient: "bg-gradient-to-b from-amber-50/80 via-amber-100/30 to-white",
    borderClass: "border-2 border-amber-300/80 hover:border-amber-500",
    dotColor: "bg-amber-600",
  },
  {
    id: "stage-3",
    step: "03",
    title: "Execute via Swarm",
    subtitle: "Specialized Agents & MCP Tool Calls",
    description:
      "Specialized autonomous agents execute their assigned DAG nodes in parallel, invoking external tools through Model Context Protocol.",
    bulletFlow: [
      "Parallel workers invoke external tools with least-privilege tokens.",
      "Isolated sandboxes execute deterministic Python and SQL.",
      "Exponential backoff with automated state preservation.",
    ],
    artifact: "ExecutionTrace.ndjson",
    gate: "Sandbox Isolation Certified",
    bgGradient: "bg-gradient-to-b from-blue-50/80 via-blue-100/30 to-white",
    borderClass: "border-2 border-blue-300/80 hover:border-blue-500",
    dotColor: "bg-blue-600",
  },
  {
    id: "stage-4",
    step: "04",
    title: "Validate & Verify",
    subtitle: "Deterministic Constraint Checking",
    description:
      "Every generated artifact and database mutation passes through strict schema validation and factual consistency checks.",
    bulletFlow: [
      "Zero-hallucination guardrail verifies facts match source citations.",
      "Strict Pydantic / Zod schema enforcement across outputs.",
      "Failed outputs routed to targeted correction loops.",
    ],
    artifact: "ValidationProof.pem",
    gate: "Zero-Drift Certified",
    bgGradient: "bg-gradient-to-b from-purple-50/80 via-purple-100/30 to-white",
    borderClass: "border-2 border-purple-300/80 hover:border-purple-500",
    dotColor: "bg-purple-600",
  },
  {
    id: "stage-5",
    step: "05",
    title: "Approve & Deliver",
    subtitle: "Dual-Key Governance & Transaction Commit",
    description:
      "Low-risk workflows commit automatically; high-consequence thresholds pause for cryptographic dual-key human authorization.",
    bulletFlow: [
      "Role-based notification delivered to authorized personnel.",
      "Cryptographic dual-key approval unlocks final execution step.",
      "Complete end-to-end trace logged to immutable audit ledger.",
    ],
    artifact: "AuditLedgerRecord.cbor",
    gate: "Dual-Signature Certified",
    bgGradient: "bg-gradient-to-b from-zinc-100 via-zinc-50 to-white",
    borderClass: "border-2 border-zinc-300 hover:border-zinc-500",
    dotColor: "bg-zinc-800",
  },
];

export function HowItWorksSection() {
  return (
    <section id="workflow" className="py-24 md:py-32 bg-zinc-50/60 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Section 04 — The Execution Lifecycle
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-zinc-950 tracking-tight leading-tight mb-6">
            From natural intent to audited enterprise delivery.
          </h2>
          <p className="font-sans text-base sm:text-lg text-zinc-600 leading-relaxed">
            Five sequential stages ensure every output is grounded, planned, executed, verified, and governed before touching production systems.
          </p>
        </div>

        {/* 5-Card Horizontal Motion Flow Track */}
        <HorizontalStageCards stages={stagesData} />

      </div>
    </section>
  );
}
