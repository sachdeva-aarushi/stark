"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, FileText, Layout, PlayCircle, ShieldCheck, Terminal, CheckCircle2, History, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function CapabilitiesSection() {
  return (
    <section id="capabilities" className="py-24 sm:py-32 bg-white border-b border-border relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
            <span className="w-2 h-[1px] bg-zinc-400" />
            <span>SECTION 05 / ENGINEERING CAPABILITIES</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 leading-tight">
            Everything needed to move AI <br />
            <span className="italic font-normal text-blue-700">beyond conversation.</span>
          </h2>
          <p className="font-serif text-base sm:text-lg text-zinc-600 mt-4 leading-relaxed">
            Engineered capabilities built directly into STARK. Each system solves a concrete infrastructure problem in enterprise multi-agent deployment.
          </p>
        </div>

        {/* Varied Bento Grid Composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* Card 1: Multi-Agent Orchestration (Oversized 8-col) */}
          <div className="md:col-span-12 lg:col-span-8 bg-surface border border-border rounded-xl p-8 hover:border-zinc-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                <span className="font-mono text-xs font-semibold text-blue-700 uppercase tracking-wider">
                  01 / CORE TOPOLOGY
                </span>
                <Bot className="w-5 h-5 text-zinc-500" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950 mb-3">
                Multi-Agent Orchestration
              </h3>
              <p className="font-serif text-base text-zinc-600 leading-relaxed font-normal max-w-2xl">
                Coordinate specialized agents through structured, directed acyclic graphs. Agents maintain private tool bindings, communicate via typed message interfaces, and pass execution context with zero token loss.
              </p>
            </div>
            {/* Visual Mini Mockup */}
            <div className="mt-8 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-white rounded border border-border">
                <div className="text-zinc-400 text-[10px]">AGENT_A</div>
                <div className="font-semibold text-zinc-900 mt-1">Research Lead</div>
                <div className="text-emerald-600 text-[10px] mt-0.5">Vector Search Ready</div>
              </div>
              <div className="p-3 bg-white rounded border border-border">
                <div className="text-zinc-400 text-[10px]">AGENT_B</div>
                <div className="font-semibold text-zinc-900 mt-1">Synthesis Engine</div>
                <div className="text-blue-600 text-[10px] mt-0.5">Analytic Transformer</div>
              </div>
              <div className="p-3 bg-white rounded border border-border">
                <div className="text-zinc-400 text-[10px]">AGENT_C</div>
                <div className="font-semibold text-zinc-900 mt-1">Policy Auditor</div>
                <div className="text-purple-600 text-[10px] mt-0.5">Deterministic Guard</div>
              </div>
            </div>
          </div>

          {/* Card 2: Knowledge Intelligence (Compact 4-col) */}
          <div className="md:col-span-6 lg:col-span-4 bg-white border border-border rounded-xl p-8 hover:border-zinc-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                <span className="font-mono text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  02 / RAG &amp; VECTORS
                </span>
                <FileText className="w-5 h-5 text-zinc-500" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950 mb-3">
                Knowledge Intelligence
              </h3>
              <p className="font-serif text-sm text-zinc-600 leading-relaxed font-normal">
                Upload organizational documents, generate embeddings, and retrieve enterprise knowledge with low-latency semantic search grounded in primary sources.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border font-mono text-[11px] text-zinc-500">
              SUPPORTS: PDF, DOCX, TXT, CSV, SQL
            </div>
          </div>

          {/* Card 3: Workflow Studio (Compact 4-col) */}
          <div className="md:col-span-6 lg:col-span-4 bg-white border border-border rounded-xl p-8 hover:border-zinc-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                <span className="font-mono text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  03 / DESIGN CANVAS
                </span>
                <Layout className="w-5 h-5 text-zinc-500" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950 mb-3">
                Workflow Studio
              </h3>
              <p className="font-serif text-sm text-zinc-600 leading-relaxed font-normal">
                Visually configure agents, wire execution steps, set triggers, and test sub-flows before rolling out to production environments.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border font-mono text-[11px] text-zinc-500">
              STATE: NODE-GRAPH EDITOR
            </div>
          </div>

          {/* Card 4: Intelligent Execution (Oversized 8-col) */}
          <div className="md:col-span-12 lg:col-span-8 bg-zinc-950 text-white rounded-xl p-8 border border-zinc-800 transition-all flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
                <span className="font-mono text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  04 / REAL-TIME RUNTIME
                </span>
                <PlayCircle className="w-5 h-5 text-zinc-400" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
                Intelligent Execution
              </h3>
              <p className="font-serif text-base text-zinc-300 leading-relaxed font-normal max-w-2xl">
                Execute workflows with fully observable execution states, real-time event streaming, and fault-tolerant node restarts. Watch step-by-step agent deliberations live.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-zinc-400">
              <span>STATUS: SSE REAL-TIME ENGINE</span>
              <span className="text-emerald-400">PERSISTENT TRANSACTION LOG</span>
            </div>
          </div>

          {/* Card 5: Human-in-the-Loop (Compact 6-col) */}
          <div className="md:col-span-6 bg-surface border border-border rounded-xl p-8 hover:border-zinc-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                <span className="font-mono text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  05 / GOVERNANCE
                </span>
                <ShieldCheck className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950 mb-3">
                Human-in-the-Loop
              </h3>
              <p className="font-serif text-sm text-zinc-600 leading-relaxed font-normal">
                Deterministic pause points that require authenticated operator approval, feedback, or manual parameter overrides before destructive external mutations occur.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border font-mono text-[11px] text-zinc-500">
              DETERMINISTIC GATEWAYS &amp; ACCESS CONTROL
            </div>
          </div>

          {/* Card 6: MCP Integrations (Compact 6-col) */}
          <div className="md:col-span-6 bg-surface border border-border rounded-xl p-8 hover:border-zinc-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                <span className="font-mono text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  06 / OPEN PROTOCOL
                </span>
                <Terminal className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950 mb-3">
                MCP Integrations
              </h3>
              <p className="font-serif text-sm text-zinc-600 leading-relaxed font-normal">
                Native Model Context Protocol connectivity allows your workflows to interface cleanly with any external tool, database, API, or legacy enterprise software.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border font-mono text-[11px] text-zinc-500">
              OPEN PROTOCOL STANDARD COMPLIANT
            </div>
          </div>

          {/* Card 7: Validation & Guardrails (Compact 6-col) */}
          <div className="md:col-span-6 bg-white border border-border rounded-xl p-8 hover:border-zinc-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                <span className="font-mono text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  07 / QUALITY CONTROL
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950 mb-3">
                Validation &amp; Guardrails
              </h3>
              <p className="font-serif text-sm text-zinc-600 leading-relaxed font-normal">
                Pydantic schema enforcement, regex boundary tests, and compliance rules eliminate downstream hallucinations before records are touched.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border font-mono text-[11px] text-zinc-500">
              BOUNDARY ENFORCEMENT ENGINE
            </div>
          </div>

          {/* Card 8: Execution History (Compact 6-col) */}
          <div className="md:col-span-6 bg-white border border-border rounded-xl p-8 hover:border-zinc-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                <span className="font-mono text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  08 / AUDIT TRAIL
                </span>
                <History className="w-5 h-5 text-zinc-500" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950 mb-3">
                Execution History
              </h3>
              <p className="font-serif text-sm text-zinc-600 leading-relaxed font-normal">
                Inspect every historical workflow execution, agent reasoning trace, input parameters, and approval resolution with complete chronological fidelity.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border font-mono text-[11px] text-zinc-500">
              IMMUTABLE AUDIT LOGS &amp; TRACE REPLAY
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
