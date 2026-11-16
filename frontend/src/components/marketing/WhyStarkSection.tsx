"use client";

import React from "react";
import { Check, X } from "lucide-react";

interface ComparisonItem {
  dimension: string;
  conventional: string;
  stark: string;
}

const COMPARISONS: ComparisonItem[] = [
  {
    dimension: "Execution Architecture",
    conventional: "Single prompt pasted into isolated conversational web interfaces.",
    stark: "Multi-agent coordinated DAG with explicit roles, isolated context, and typed messages.",
  },
  {
    dimension: "Context Grounding",
    conventional: "Hallucinates or guesses missing details from broad internet pre-training.",
    stark: "Strict vector embeddings retrieval (RAG) grounded in private organizational documents.",
  },
  {
    dimension: "Process Observability",
    conventional: "Opaque black-box token generation with no intermediate step visibility.",
    stark: "Real-time state machine streaming agent deliberations, step states, and tool I/O.",
  },
  {
    dimension: "Governance & Safety",
    conventional: "Binary choice between blind full-autonomy or tedious manual copy-pasting.",
    stark: "Deterministic human-in-the-loop checkpoints with pause, review, and feedback gates.",
  },
  {
    dimension: "Quality Assurance",
    conventional: "Unvalidated natural language outputs pushed directly to production systems.",
    stark: "Pydantic & JSON Schema boundary guardrails with automated validation rejection.",
  },
  {
    dimension: "Enterprise Tooling",
    conventional: "Custom ad-hoc API wrappers that break with every minor schema adjustment.",
    stark: "Universal Model Context Protocol (MCP) standards for robust ecosystem connectivity.",
  },
  {
    dimension: "Auditability & State",
    conventional: "Ephemeral browser chat sessions lost upon browser refresh or tab close.",
    stark: "Persistent database state with immutable historical logs and replay capability.",
  },
];

export function WhyStarkSection() {
  return (
    <section id="why-stark" className="py-24 sm:py-32 bg-surface border-b border-border relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
            <span className="w-2 h-[1px] bg-zinc-400" />
            <span>SECTION 06 / ARCHITECTURAL PRINCIPLES</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 leading-tight">
            Built for intelligence you can <br />
            <span className="italic font-normal text-zinc-700">actually operationalize.</span>
          </h2>
          <p className="font-serif text-base sm:text-lg text-zinc-600 mt-4 leading-relaxed">
            The difference between an experimental AI toy and an enterprise workflow platform lies in deterministic reliability, state persistence, and operational oversight.
          </p>
        </div>

        {/* Editorial Comparison Table */}
        <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
          {/* Header row */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-border bg-surface p-4 sm:p-6 font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold">
            <div className="md:col-span-3">DIMENSION</div>
            <div className="md:col-span-4 hidden md:block text-zinc-500">CONVENTIONAL CHAT AI</div>
            <div className="md:col-span-5 text-blue-700">STARK ORCHESTRATION</div>
          </div>

          {/* Row Items */}
          <div className="divide-y divide-border">
            {COMPARISONS.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 p-5 sm:p-6 hover:bg-surface/50 transition-colors gap-3 md:gap-4 items-start"
              >
                {/* Dimension */}
                <div className="md:col-span-3">
                  <span className="font-serif text-sm sm:text-base font-bold text-zinc-950 block">
                    {row.dimension}
                  </span>
                </div>

                {/* Conventional */}
                <div className="md:col-span-4 flex items-start space-x-2.5 text-xs font-serif text-zinc-500">
                  <X className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{row.conventional}</span>
                </div>

                {/* STARK */}
                <div className="md:col-span-5 flex items-start space-x-2.5 text-xs font-serif text-zinc-900 font-medium bg-blue-50/40 p-3 rounded md:bg-transparent md:p-0">
                  <Check className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-zinc-950 font-semibold">{row.stark}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Architectural Quote Box */}
        <div className="mt-12 p-8 rounded-xl border border-zinc-300 bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-wider text-blue-700 font-semibold">
              ENGINEERING PHILOSOPHY
            </div>
            <div className="font-serif text-lg text-zinc-900 italic leading-snug">
              &quot;Prompting is not programming. Enterprise deployment demands deterministic contracts, observable runtimes, and verifiable ground truth.&quot;
            </div>
          </div>
          <div className="font-mono text-xs text-zinc-500 shrink-0">
            STARK Core Architecture Team
          </div>
        </div>
      </div>
    </section>
  );
}
