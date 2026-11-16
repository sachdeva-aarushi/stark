"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Unplug, ShieldAlert, Cpu, EyeOff, Users, ChevronDown } from "lucide-react";
import { TiltCard } from "./cards/TiltCard";

interface ProblemItem {
  id: string;
  num: string;
  title: string;
  tag: string;
  summary: string;
  expandedDetail: string;
  icon: React.ElementType;
  colSpan: string;
  isDark?: boolean;
}

const problems: ProblemItem[] = [
  {
    id: "p1",
    num: "01",
    tag: "FRAGMENTATION",
    title: "Siloed, Disconnected AI Experiments",
    summary:
      "Enterprise teams deploy isolated chatbots that operate in data silos, unable to communicate across departments or execute end-to-end business workflows.",
    expandedDetail:
      "Ad-hoc prototypes create fragmented operational islands. When an AI agent cannot invoke enterprise permissions, access live customer databases, or coordinate with sibling systems, it remains an expensive demo rather than an operational asset.",
    icon: Unplug,
    colSpan: "lg:col-span-7",
  },
  {
    id: "p2",
    num: "02",
    tag: "INTEGRATION DEBT",
    title: "The Fragile Custom Glue Layer",
    summary:
      "Engineering teams waste months writing bespoke Python scripts and brittle wrappers connecting models to internal databases and APIs.",
    expandedDetail:
      "Every upstream schema change or model deprecation shatters bespoke glue code. Without a standardized protocol layer, maintenance costs compound faster than business value.",
    icon: AlertTriangle,
    colSpan: "lg:col-span-5",
  },
  {
    id: "p3",
    num: "03",
    tag: "RETRIEVAL FAILURE",
    title: "Context Collapse & Blind Retrieval",
    summary:
      "Naive RAG implementations dump thousands of irrelevant document chunks into prompt windows, causing hallucinations and lost business context.",
    expandedDetail:
      "Simple vector similarity misses structural document hierarchies, temporal relevance, and semantic nuances. Critical decisions are made on out-of-date or misattributed information.",
    icon: EyeOff,
    colSpan: "lg:col-span-5",
  },
  {
    id: "p4",
    num: "04",
    tag: "RELIABILITY CRISIS",
    title: "Hallucinations in Mission-Critical Pipelines",
    summary:
      "Enterprise operations cannot tolerate probabilistic guesswork in financial calculations, contract analysis, or database mutations.",
    expandedDetail:
      "A 95% model accuracy rate means 1 out of 20 automated transactions fails silently. Mission-critical operations require deterministic validation layers that reject malformed outputs before execution.",
    icon: ShieldAlert,
    colSpan: "lg:col-span-7",
    isDark: true,
  },
  {
    id: "p5",
    num: "05",
    tag: "AUDIT VOID",
    title: "The Governance & Audit Black Box",
    summary:
      "Compliance and legal teams cannot verify why an autonomous system took a specific action or trace the data provenance behind an output.",
    expandedDetail:
      "Regulatory frameworks require complete accountability. When an AI model takes an action without an immutable audit trail, the enterprise assumes severe operational and legal liability.",
    icon: Cpu,
    colSpan: "lg:col-span-6",
  },
  {
    id: "p6",
    num: "06",
    tag: "COORDINATION BOTTLENECK",
    title: "The Human-in-the-Loop Stalemate",
    summary:
      "Workflows either run completely unconstrained without guardrails or freeze perpetually waiting for manual approvals.",
    expandedDetail:
      "Effective autonomy requires graduated governance: routine low-risk actions proceed autonomously, while high-consequence thresholds automatically pause for dual-key human authorization.",
    icon: Users,
    colSpan: "lg:col-span-6",
  },
];

export function ProblemSection() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const toggleCard = (id: string) => {
    setActiveCard((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-24 md:py-32 bg-zinc-50/70 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Section 02 — The Architectural Diagnosis
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-zinc-950 tracking-tight leading-tight mb-6">
            Why enterprise AI stalls between prototype and production.
          </h2>
          <p className="font-sans text-base sm:text-lg text-zinc-600 leading-relaxed">
            Large language models are remarkable reasoning engines, but standalone prompts cannot run an enterprise. Without architectural orchestration, AI deployments remain fragile, ungrounded, and impossible to audit.
          </p>
        </div>

        {/* Asymmetrical 3D Card Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {problems.map((problem, idx) => {
            const Icon = problem.icon;
            const isExpanded = activeCard === problem.id;

            return (
              <div
                key={problem.id}
                className={`col-span-12 ${problem.colSpan}`}
              >
                <TiltCard
                  tiltMaxAngle={7}
                  bgClass={problem.isDark ? "bg-zinc-950 text-white" : "bg-white text-zinc-950"}
                  borderClass={
                    problem.isDark
                      ? "border border-zinc-800 hover:border-zinc-700"
                      : "border border-zinc-200 hover:border-zinc-300"
                  }
                  className="h-full cursor-pointer"
                  onClick={() => toggleCard(problem.id)}
                >
                  <div className="p-8 md:p-10 flex flex-col justify-between h-full">
                    
                    {/* Top Row: Number Marker & Category Tag */}
                    <div>
                      <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-100/10">
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-mono text-xs font-bold px-2.5 py-1 rounded ${
                              problem.isDark
                                ? "bg-zinc-800 text-blue-400"
                                : "bg-zinc-100 text-blue-700"
                            }`}
                          >
                            [ {problem.num} ]
                          </span>
                          <span
                            className={`font-mono text-[11px] font-medium tracking-wider uppercase ${
                              problem.isDark ? "text-zinc-400" : "text-zinc-500"
                            }`}
                          >
                            {problem.tag}
                          </span>
                        </div>
                        <Icon
                          className={`w-5 h-5 ${
                            problem.isDark ? "text-blue-400" : "text-zinc-400"
                          }`}
                        />
                      </div>

                      {/* Title */}
                      <h3
                        className={`font-serif text-xl sm:text-2xl font-semibold tracking-tight mb-4 ${
                          problem.isDark ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {problem.title}
                      </h3>

                      {/* Primary Diagnostic Summary */}
                      <p
                        className={`font-sans text-sm sm:text-base leading-relaxed ${
                          problem.isDark ? "text-zinc-300" : "text-zinc-600"
                        }`}
                      >
                        {problem.summary}
                      </p>
                    </div>

                    {/* Expandable Technical Detail */}
                    <div className="pt-6 mt-6 border-t border-zinc-100/10">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span
                          className={problem.isDark ? "text-zinc-400" : "text-zinc-500"}
                        >
                          {isExpanded ? "Collapse Analysis" : "Expand Architectural Impact"}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          } ${problem.isDark ? "text-zinc-400" : "text-zinc-500"}`}
                        />
                      </div>

                      {/* Detail Text */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`mt-4 pt-3 font-sans text-xs sm:text-sm leading-relaxed border-t ${
                            problem.isDark
                              ? "border-zinc-800 text-zinc-300 bg-zinc-900/50 p-4 rounded-xl"
                              : "border-zinc-100 text-zinc-700 bg-zinc-50 p-4 rounded-xl"
                          }`}
                        >
                          {problem.expandedDetail}
                        </motion.div>
                      )}
                    </div>

                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
