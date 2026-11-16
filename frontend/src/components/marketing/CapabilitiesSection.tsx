"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, Database, Workflow, ShieldCheck, UserCheck, Cpu, ArrowUpRight, CheckCircle2, Lock } from "lucide-react";
import { TiltCard } from "./cards/TiltCard";

export function CapabilitiesSection() {
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
            Engineered for enterprise scale, precision, and auditability.
          </h2>
          <p className="font-sans text-base sm:text-lg text-zinc-600 leading-relaxed">
            Every capability in STARK is built to eliminate probabilistic failure modes in production. Explore our native orchestration primitives.
          </p>
        </div>

        {/* Editorial Bento-Style 3D Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* CARD 1: OVERSIZED FEATURE CARD — Multi-Agent Orchestration (8 cols) */}
          <div className="lg:col-span-8">
            <TiltCard
              tiltMaxAngle={6}
              borderClass="border border-zinc-200 hover:border-zinc-400"
              bgClass="bg-white"
              className="h-full"
            >
              <div className="p-8 md:p-12 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-blue-700 font-semibold block">
                          Capability 01
                        </span>
                        <h3 className="font-serif text-2xl font-semibold text-zinc-950">
                          Multi-Agent Orchestration Swarm
                        </h3>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded">
                      Parallel DAG
                    </span>
                  </div>

                  <p className="font-sans text-base text-zinc-600 leading-relaxed mb-8 max-w-2xl">
                    Deploy networks of specialized autonomous agents that coordinate, pass structured artifacts, and self-heal on edge-case failures. Each agent has strict role bounds, dedicated tools, and state retention.
                  </p>
                </div>

                {/* Abstract Visual Schematic: Interconnected Agent Nodes */}
                <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>Live Agent Coordination Topology</span>
                    <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Synchronized
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Agent Node 1 */}
                    <div className="p-3 bg-white rounded-xl border border-zinc-200 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] text-blue-600 font-semibold">
                          AGENT 01
                        </span>
                        <span className="font-mono text-[10px] text-zinc-400">12ms</span>
                      </div>
                      <span className="font-serif text-sm font-semibold text-zinc-900 block">
                        Research & Retrieval
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500">
                        Vector query & parsing
                      </span>
                    </div>

                    {/* Agent Node 2 */}
                    <div className="p-3 bg-white rounded-xl border border-blue-300 shadow-sm relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] text-blue-700 font-bold">
                          COORDINATOR
                        </span>
                        <span className="font-mono text-[10px] text-blue-600 font-bold">ACTIVE</span>
                      </div>
                      <span className="font-serif text-sm font-semibold text-zinc-900 block">
                        Synthesis Engine
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500">
                        Cross-agent aggregation
                      </span>
                    </div>

                    {/* Agent Node 3 */}
                    <div className="p-3 bg-white rounded-xl border border-zinc-200 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] text-zinc-600 font-semibold">
                          AGENT 03
                        </span>
                        <span className="font-mono text-[10px] text-zinc-400">34ms</span>
                      </div>
                      <span className="font-serif text-sm font-semibold text-zinc-900 block">
                        Policy & Audit Gate
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500">
                        Constraint validation
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </TiltCard>
          </div>

          {/* CARD 2: MEDIUM CARD — Enterprise Knowledge & Semantic RAG (4 cols) */}
          <div className="lg:col-span-4">
            <TiltCard
              tiltMaxAngle={7}
              borderClass="border border-zinc-200 hover:border-zinc-400"
              bgClass="bg-zinc-50/80"
              className="h-full"
            >
              <div className="p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 pb-6 mb-6 border-b border-zinc-200">
                    <div className="w-10 h-10 rounded-xl bg-white text-zinc-800 flex items-center justify-center border border-zinc-200 shadow-sm">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold block">
                        Capability 02
                      </span>
                      <h3 className="font-serif text-xl font-semibold text-zinc-950">
                        Hybrid Semantic RAG
                      </h3>
                    </div>
                  </div>

                  <p className="font-sans text-sm text-zinc-600 leading-relaxed mb-6">
                    Multi-hop hybrid retrieval with dense vector similarity, sparse BM25 keyword matching, and hierarchical document chunking.
                  </p>
                </div>

                {/* Abstract Visual: Floating Document Layers */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 bg-white rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
                    <span className="text-zinc-800 font-medium">SecOps_Policy_2026.pdf</span>
                    <span className="text-emerald-600 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                      0.96 Score
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
                    <span className="text-zinc-800 font-medium">Customer_DB_Schema.sql</span>
                    <span className="text-blue-600 font-semibold text-[10px] bg-blue-50 px-2 py-0.5 rounded">
                      Exact Match
                    </span>
                  </div>
                </div>

              </div>
            </TiltCard>
          </div>

          {/* CARD 3: MEDIUM CARD — Workflow Studio & Visual DAG Builder (4 cols) */}
          <div className="lg:col-span-4">
            <TiltCard
              tiltMaxAngle={7}
              borderClass="border border-zinc-200 hover:border-zinc-400"
              bgClass="bg-white"
              className="h-full"
            >
              <div className="p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 pb-6 mb-6 border-b border-zinc-100">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center border border-zinc-200">
                      <Workflow className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold block">
                        Capability 03
                      </span>
                      <h3 className="font-serif text-xl font-semibold text-zinc-950">
                        Visual Workflow Studio
                      </h3>
                    </div>
                  </div>

                  <p className="font-sans text-sm text-zinc-600 leading-relaxed mb-6">
                    Design, simulate, and deploy multi-stage workflows as clear Directed Acyclic Graphs. Inspect inputs, outputs, and dependencies at every step.
                  </p>
                </div>

                {/* Abstract Visual: Connected DAG Nodes */}
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 font-mono text-[11px] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-zinc-800 font-medium">Node: IngestPayload</span>
                  </div>
                  <div className="pl-4 text-zinc-400 text-[10px]">↓ conditional branch</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span className="text-zinc-800 font-medium">Node: ExecuteAudit</span>
                  </div>
                </div>

              </div>
            </TiltCard>
          </div>

          {/* CARD 4: MEDIUM CARD — Intelligent Deterministic Execution (4 cols) */}
          <div className="lg:col-span-4">
            <TiltCard
              tiltMaxAngle={7}
              borderClass="border border-zinc-200 hover:border-zinc-400"
              bgClass="bg-zinc-50/70"
              className="h-full"
            >
              <div className="p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 pb-6 mb-6 border-b border-zinc-200">
                    <div className="w-10 h-10 rounded-xl bg-white text-zinc-900 flex items-center justify-center border border-zinc-200 shadow-sm">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold block">
                        Capability 04
                      </span>
                      <h3 className="font-serif text-xl font-semibold text-zinc-950">
                        Zero-Drift Validation
                      </h3>
                    </div>
                  </div>

                  <p className="font-sans text-sm text-zinc-600 leading-relaxed mb-6">
                    Deterministic validation engines verify schema conformance, policy compliance, and mathematical accuracy before committing actions.
                  </p>
                </div>

                {/* Visual Checkmark Proof */}
                <div className="p-4 bg-white rounded-xl border border-zinc-200 font-mono text-xs space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600">Schema Conformance:</span>
                    <span className="text-emerald-700 font-semibold">Strict 100%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600">Context Faithfulness:</span>
                    <span className="text-emerald-700 font-semibold">Verified</span>
                  </div>
                </div>

              </div>
            </TiltCard>
          </div>

          {/* CARD 5: MEDIUM CARD — Human-in-the-Loop Governance (4 cols) */}
          <div className="lg:col-span-4">
            <TiltCard
              tiltMaxAngle={7}
              borderClass="border border-zinc-200 hover:border-zinc-400"
              bgClass="bg-white"
              className="h-full"
            >
              <div className="p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 pb-6 mb-6 border-b border-zinc-100">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center border border-zinc-200">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold block">
                        Capability 05
                      </span>
                      <h3 className="font-serif text-xl font-semibold text-zinc-950">
                        Dual-Key Governance
                      </h3>
                    </div>
                  </div>

                  <p className="font-sans text-sm text-zinc-600 leading-relaxed mb-6">
                    Graduated autonomy rules allow safe operations to flow continuously while halting high-risk financial or operational actions for cryptographic human review.
                  </p>
                </div>

                {/* Visual Checkpoint Gate */}
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 font-mono text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span className="text-zinc-800 font-medium">Policy Threshold</span>
                  </div>
                  <span className="bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                    Requires Sign-Off
                  </span>
                </div>

              </div>
            </TiltCard>
          </div>

          {/* CARD 6: FULL-WIDTH DARK FEATURE CARD — MCP Ecosystem & Protocol Bridges (12 cols) */}
          <div className="lg:col-span-12">
            <TiltCard
              tiltMaxAngle={4}
              bgClass="bg-zinc-950 text-white"
              borderClass="border border-zinc-800 hover:border-zinc-700 shadow-2xl"
              className="w-full"
            >
              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Column: Description & Metadata */}
                  <div className="lg:col-span-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 text-blue-400 flex items-center justify-center border border-zinc-700">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs uppercase tracking-wider text-blue-400 font-semibold">
                        Capability 06 — Universal Protocol
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-4">
                      Model Context Protocol Ecosystem
                    </h3>
                    <p className="font-sans text-base text-zinc-300 leading-relaxed mb-6">
                      Connect your agents directly to enterprise infrastructure with zero proprietary lock-in. STARK serves as a native MCP host and client, seamlessly orchestrating tools across your cloud, on-premise databases, and third-party SaaS.
                    </p>

                    <div className="flex items-center gap-6 font-mono text-xs text-zinc-400">
                      <div>
                        <span className="text-white font-semibold text-base block">100%</span>
                        <span>Open Standard</span>
                      </div>
                      <div className="w-px h-8 bg-zinc-800" />
                      <div>
                        <span className="text-white font-semibold text-base block">Least Privilege</span>
                        <span>Token Sandboxing</span>
                      </div>
                      <div className="w-px h-8 bg-zinc-800" />
                      <div>
                        <span className="text-white font-semibold text-base block">&lt;50ms</span>
                        <span>Bridge Latency</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Interactive Connected Tool Node Grid */}
                  <div className="lg:col-span-6">
                    <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-3">
                      <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block mb-3">
                        Active MCP Tool Bridges
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                        <div className="p-3 bg-zinc-800/80 rounded-xl border border-zinc-700/80 text-zinc-200 flex flex-col justify-between">
                          <span className="text-white font-semibold">GitHub REST</span>
                          <span className="text-emerald-400 text-[10px] mt-2">Connected</span>
                        </div>
                        <div className="p-3 bg-zinc-800/80 rounded-xl border border-zinc-700/80 text-zinc-200 flex flex-col justify-between">
                          <span className="text-white font-semibold">PostgreSQL</span>
                          <span className="text-emerald-400 text-[10px] mt-2">Connected</span>
                        </div>
                        <div className="p-3 bg-zinc-800/80 rounded-xl border border-zinc-700/80 text-zinc-200 flex flex-col justify-between">
                          <span className="text-white font-semibold">Notion Core</span>
                          <span className="text-emerald-400 text-[10px] mt-2">Connected</span>
                        </div>
                        <div className="p-3 bg-zinc-800/80 rounded-xl border border-zinc-700/80 text-zinc-200 flex flex-col justify-between">
                          <span className="text-white font-semibold">Salesforce API</span>
                          <span className="text-zinc-400 text-[10px] mt-2">Standby</span>
                        </div>
                        <div className="p-3 bg-zinc-800/80 rounded-xl border border-zinc-700/80 text-zinc-200 flex flex-col justify-between">
                          <span className="text-white font-semibold">Slack Bot</span>
                          <span className="text-emerald-400 text-[10px] mt-2">Connected</span>
                        </div>
                        <div className="p-3 bg-zinc-800/80 rounded-xl border border-zinc-700/80 text-zinc-200 flex flex-col justify-between">
                          <span className="text-white font-semibold">Custom OpenAPI</span>
                          <span className="text-emerald-400 text-[10px] mt-2">Connected</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </TiltCard>
          </div>

        </div>

      </div>
    </section>
  );
}
