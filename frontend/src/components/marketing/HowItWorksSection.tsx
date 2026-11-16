"use client";

import React from "react";
import { HorizontalCardTrack, StageData } from "./cards/HorizontalCardTrack";

const workflowStages: StageData[] = [
  {
    id: "stage-1",
    step: "01",
    title: "Understand & Ground",
    subtitle: "Intent Parsing & Enterprise Retrieval",
    description:
      "When a business request or event triggers STARK, the platform begins by parsing the natural intent and immediately queries the Enterprise Knowledge base. Hybrid dense vector and sparse keyword search assemble verified documentation, policies, and schemas.",
    technicalDetails: [
      "Natural language request parsed into structured domain constraints.",
      "Multi-hop semantic search extracts relevant policies and database schemas.",
      "Context lineage is sealed into an immutable execution snapshot.",
    ],
    outputArtifact: "ContextGroundingManifest.json",
    latencyExpectation: "20ms – 45ms",
    policyGate: "Relevance Threshold > 0.88",
  },
  {
    id: "stage-2",
    step: "02",
    title: "Plan & Decompose",
    subtitle: "Deterministic DAG Graph Generation",
    description:
      "Rather than attempting a single chaotic prompt response, STARK generates a Directed Acyclic Graph (DAG) breaking the request into discrete sub-tasks with clear dependency ordering, input/output schemas, and failure recovery pathways.",
    technicalDetails: [
      "Decomposes objective into concurrent and sequential sub-agent tasks.",
      "Assigns required tool permissions and rate limits per node.",
      "Simulates execution graph against policy guardrails prior to dispatch.",
    ],
    outputArtifact: "ExecutionPlanGraph.dag",
    latencyExpectation: "35ms – 80ms",
    policyGate: "Graph Cycles: 0 (Strict DAG)",
  },
  {
    id: "stage-3",
    step: "03",
    title: "Execute via Swarm",
    subtitle: "Specialized Agents & MCP Tool Calls",
    description:
      "Specialized autonomous agents take their assigned DAG nodes. The Research Agent synthesizes knowledge, the Data Agent executes sandbox Python/SQL queries, and the Integration Agent interacts with external systems via Model Context Protocol.",
    technicalDetails: [
      "Parallel worker pool invokes external tools with strict least-privilege tokens.",
      "Structured data computed in isolated sandboxes with zero LLM math estimation.",
      "Transient errors trigger exponential backoff with state preservation.",
    ],
    outputArtifact: "ExecutionTelemetryLogs.ndjson",
    latencyExpectation: "Real-time Streaming",
    policyGate: "Sandbox Isolation: Complete",
  },
  {
    id: "stage-4",
    step: "04",
    title: "Validate & Verify",
    subtitle: "Deterministic Constraint Checking",
    description:
      "Every generated artifact, SQL mutation, or synthesized conclusion passes through deterministic validation gates. The output is checked against strict Pydantic schemas, factual consistency with grounded context, and regulatory rules.",
    technicalDetails: [
      "Zero-hallucination guardrail verifies facts match source citations.",
      "Strict schema validation verifies types, required fields, and constraints.",
      "Failed outputs are automatically routed to targeted correction loops.",
    ],
    outputArtifact: "ValidationProofCertificate.pem",
    latencyExpectation: "15ms – 30ms",
    policyGate: "Zero-Drift Verified",
  },
  {
    id: "stage-5",
    step: "05",
    title: "Approve & Deliver",
    subtitle: "Dual-Key Governance & Transaction Commit",
    description:
      "Low-risk workflows commit automatically. Actions exceeding configured risk thresholds (e.g. database updates, financial transfers, public announcements) pause at the Human-in-the-Loop gate for cryptographic sign-off before final dispatch.",
    technicalDetails: [
      "Role-based notification delivered to authorized personnel with complete audit context.",
      "Cryptographic dual-key approval unlocks final execution step.",
      "Complete end-to-end trace logged to immutable audit ledger.",
    ],
    outputArtifact: "AuditLedgerRecord.cbor",
    latencyExpectation: "Synchronous Sign-off",
    policyGate: "Dual-Signature Certified",
  },
];

export function HowItWorksSection() {
  return (
    <section id="workflow" className="py-24 md:py-32 bg-zinc-50/70 border-b border-zinc-200">
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
            Five deterministic stages ensure every output is grounded, planned, executed, verified, and governed before it touches your production systems.
          </p>
        </div>

        {/* 3D Interactive Horizontal Track Component */}
        <HorizontalCardTrack stages={workflowStages} />

      </div>
    </section>
  );
}
