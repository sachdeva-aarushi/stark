"use client";

import React from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { TiltCard } from "./cards/TiltCard";

interface ComparisonRow {
  dimension: string;
  conventional: string;
  stark: string;
}

const comparisons: ComparisonRow[] = [
  {
    dimension: "Execution Architecture",
    conventional:
      "Monolithic single-prompt inference and linear chains that fail if any intermediate step drifts.",
    stark:
      "Specialized multi-agent swarms coordinated via Directed Acyclic Graphs with isolated state and automated retries.",
  },
  {
    dimension: "Context Grounding",
    conventional:
      "Naive top-k vector similarity dumping raw tokens into context, causing frequent hallucinations.",
    stark:
      "Hybrid dense vector and sparse keyword retrieval with hierarchical chunking and cryptographic citation lineage.",
  },
  {
    dimension: "Process Observability",
    conventional:
      "Opaque black-box text responses with untraceable intermediate reasoning and no step-by-step telemetry.",
    stark:
      "Full execution observability: every agent message, tool invocation, and decision is logged with replay capability.",
  },
  {
    dimension: "Governance & Human Oversight",
    conventional:
      "Binary all-or-nothing execution: either totally unconstrained or requiring constant manual human prompting.",
    stark:
      "Graduated risk-based governance: low-risk actions proceed autonomously while critical actions halt for dual-key authorization.",
  },
  {
    dimension: "Operational Execution",
    conventional:
      "Unvalidated text generation without type safety, capable of hallucinating data structures and math.",
    stark:
      "Deterministic sandbox execution with strict Pydantic/Zod schema enforcement and zero-drift mathematical compute.",
  },
];

export function WhyStarkSection() {
  return (
    <section id="comparison" className="py-24 md:py-32 bg-zinc-50/70 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Section 06 — Architectural Contrast
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-zinc-950 tracking-tight leading-tight mb-6">
            The fundamental shift from conversational demos to deterministic execution.
          </h2>
          <p className="font-sans text-base sm:text-lg text-zinc-600 leading-relaxed">
            Enterprise software cannot rely on probabilistic guesswork. See how STARK contrasts with conventional conversational AI architectures.
          </p>
        </div>

        {/* Two Large Contrasting 3D Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* PANEL 1: Conventional Conversational AI (Muted, Diagnostic) */}
          <TiltCard
            tiltMaxAngle={5}
            borderClass="border border-zinc-300/80 hover:border-zinc-400"
            bgClass="bg-white/80"
            className="h-full"
          >
            <div className="p-8 md:p-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-200">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                      Paradigm 01
                    </span>
                    <h3 className="font-serif text-2xl font-semibold text-zinc-800">
                      Conventional Conversational AI
                    </h3>
                  </div>
                  <XCircle className="w-6 h-6 text-zinc-400 shrink-0" />
                </div>

                <div className="space-y-6">
                  {comparisons.map((item, idx) => (
                    <div key={idx} className="pb-6 border-b border-zinc-100 last:border-none last:pb-0">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 block mb-1.5">
                        {item.dimension}
                      </span>
                      <p className="font-sans text-sm text-zinc-600 leading-relaxed">
                        {item.conventional}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-200 text-xs font-mono text-zinc-400">
                Fragile across multi-step enterprise workflows.
              </div>
            </div>
          </TiltCard>

          {/* PANEL 2: STARK Orchestration (Elevated Dark Panel with Cobalt Accents) */}
          <TiltCard
            tiltMaxAngle={5}
            borderClass="border-2 border-zinc-950 shadow-2xl hover:border-blue-700/60"
            bgClass="bg-zinc-950 text-white"
            className="h-full"
          >
            <div className="p-8 md:p-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-800">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-blue-400 font-semibold block mb-1">
                      Paradigm 02 — Production Grade
                    </span>
                    <h3 className="font-serif text-2xl font-semibold text-white">
                      STARK Multi-Agent Orchestration
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-600/60 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  </div>
                </div>

                <div className="space-y-6">
                  {comparisons.map((item, idx) => (
                    <div key={idx} className="pb-6 border-b border-zinc-800/80 last:border-none last:pb-0">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-blue-400 block mb-1.5 font-semibold">
                        {item.dimension}
                      </span>
                      <p className="font-sans text-sm text-zinc-300 leading-relaxed">
                        {item.stark}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <ShieldCheck className="w-4 h-4" />
                  Deterministic & Production Verified
                </span>
                <span className="text-zinc-500">Zero Hallucination Tolerance</span>
              </div>
            </div>
          </TiltCard>

        </div>

      </div>
    </section>
  );
}
