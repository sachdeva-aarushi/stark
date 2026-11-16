"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Compass, Network, Cpu, ShieldCheck, CheckCircle2, ChevronRight, Layers } from "lucide-react";

interface WorkflowStage {
  step: string;
  name: string;
  tagline: string;
  summary: string;
  technicalMechanism: string;
  icon: React.ComponentType<{ className?: string }>;
  telemetry: string;
}

const STAGES: WorkflowStage[] = [
  {
    step: "01",
    name: "Understand",
    tagline: "Natural Language & Intent Decomposition",
    summary: "A user submits a high-level business objective, operational task, or scheduled trigger through the interface or API.",
    technicalMechanism: "Semantic parser decomposes user prompt into structured JSON DAG intent with constraint definitions.",
    icon: Compass,
    telemetry: "INTENT_RESOLVED",
  },
  {
    step: "02",
    name: "Plan",
    tagline: "Capability & Topology Mapping",
    summary: "The STARK orchestration kernel evaluates available agents, tools, vector indices, and determines execution dependencies.",
    technicalMechanism: "Topology solver plans sub-tasks, assigns agent roles, and verifies tool permission boundaries.",
    icon: Network,
    telemetry: "DAG_SYNTHESIZED",
  },
  {
    step: "03",
    name: "Execute",
    tagline: "Coordinated Agent Tool Use & RAG",
    summary: "Specialized agents query private enterprise embeddings, compute analytical transforms, and invoke external MCP services.",
    technicalMechanism: "Multi-threaded agent runtime with state snapshotting, isolated compute, and live telemetry streaming.",
    icon: Cpu,
    telemetry: "EXECUTION_DISPATCHED",
  },
  {
    step: "04",
    name: "Validate",
    tagline: "Schema Checks & Guardrail Audits",
    summary: "Every intermediate synthesis and proposed state mutation is rigorously validated against strict schemas and compliance rules.",
    technicalMechanism: "Pydantic & JSON-Schema boundary checks with automatic re-prompting on policy violation.",
    icon: ShieldCheck,
    telemetry: "POLICIES_VERIFIED",
  },
  {
    step: "05",
    name: "Approve & Deliver",
    tagline: "Human-in-the-Loop Sign-Off",
    summary: "If sensitive actions or financial changes are detected, execution pauses for authenticated human sign-off before committing.",
    technicalMechanism: "Cryptographically verified human approval checkpoint with mutation rollback protection.",
    icon: CheckCircle2,
    telemetry: "MUTATION_COMMITTED",
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-surface border-b border-border relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
            <span className="w-2 h-[1px] bg-zinc-400" />
            <span>SECTION 04 / WORKFLOW LIFECYCLE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 leading-tight">
            From intent to execution.
          </h2>
          <p className="font-serif text-base sm:text-lg text-zinc-600 mt-4 leading-relaxed">
            A deterministic five-stage journey that transforms raw business prompts into verified, auditable operational results.
          </p>
        </div>

        {/* Desktop Horizontal Journey Stepper */}
        <div className="hidden lg:block space-y-8">
          {/* Horizontal Progress Timeline */}
          <div className="grid grid-cols-5 gap-4 relative">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-border -translate-y-1/2 z-0" />
            {STAGES.map((stage, idx) => {
              const isActive = idx === activeStep;
              const isPast = idx < activeStep;
              return (
                <button
                  key={stage.step}
                  onClick={() => setActiveStep(idx)}
                  className="relative z-10 text-left group focus:outline-none"
                >
                  <div
                    className={`h-1.5 w-full rounded-full transition-all mb-4 ${
                      isActive
                        ? "bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                        : isPast
                        ? "bg-zinc-800"
                        : "bg-border group-hover:bg-zinc-300"
                    }`}
                  />
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-mono text-xs font-bold transition-colors ${
                        isActive ? "text-blue-600" : "text-zinc-400 group-hover:text-zinc-700"
                      }`}
                    >
                      {stage.step}
                    </span>
                    <span
                      className={`font-serif text-sm font-semibold transition-colors ${
                        isActive ? "text-zinc-950" : "text-zinc-500 group-hover:text-zinc-800"
                      }`}
                    >
                      {stage.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expanded Active Stage Showcase Card */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-border rounded-xl p-8 shadow-sm grid grid-cols-12 gap-8 items-center"
          >
            <div className="col-span-7 space-y-4">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded font-semibold uppercase">
                  STAGE {STAGES[activeStep].step}
                </span>
                <span className="font-mono text-xs text-zinc-400">
                  {STAGES[activeStep].telemetry}
                </span>
              </div>
              <h3 className="font-serif text-3xl font-bold text-zinc-950">
                {STAGES[activeStep].name}: <span className="font-normal italic text-zinc-700">{STAGES[activeStep].tagline}</span>
              </h3>
              <p className="font-serif text-base text-zinc-600 leading-relaxed font-normal">
                {STAGES[activeStep].summary}
              </p>
              <div className="p-4 bg-surface rounded border border-border text-xs font-mono text-zinc-700 space-y-1">
                <div className="text-zinc-400 uppercase text-[10px] tracking-wider">ENGINEERING MECHANISM</div>
                <div>{STAGES[activeStep].technicalMechanism}</div>
              </div>
            </div>

            <div className="col-span-5 bg-surface rounded-lg border border-border p-6 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border text-zinc-500">
                <span>STAGE PIPELINE TRACE</span>
                <span className="text-emerald-600">DETERMINISTIC</span>
              </div>
              <div className="space-y-1.5 text-zinc-600 text-[11px]">
                <div className="text-zinc-900 font-semibold">&gt; Stage {activeStep + 1} of 5 Initiated</div>
                <div>&gt; Guardrails: STRICT_CONSTRAINTS</div>
                <div>&gt; Telemetry: {STAGES[activeStep].telemetry}</div>
                <div>&gt; Next Node: {activeStep < 4 ? STAGES[activeStep + 1].name : "Workflow Terminal (Complete)"}</div>
              </div>
              <div className="pt-3 flex justify-between items-center text-xs">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 border border-border rounded bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled={activeStep === STAGES.length - 1}
                  onClick={() => setActiveStep((prev) => Math.min(STAGES.length - 1, prev + 1))}
                  className="px-3 py-1.5 bg-zinc-950 text-white rounded hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <span>Next Stage</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile Vertical Clean Journey */}
        <div className="lg:hidden space-y-6">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.step}
                className="bg-white border border-border rounded-lg p-6 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-blue-700 font-semibold mr-2">{stage.step}</span>
                      <span className="font-serif text-lg font-bold text-zinc-950">{stage.name}</span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400">{stage.telemetry}</span>
                </div>
                <p className="font-sans text-xs text-zinc-500 uppercase font-semibold">{stage.tagline}</p>
                <p className="font-serif text-sm text-zinc-600 leading-relaxed font-normal">{stage.summary}</p>
                <div className="p-3 bg-surface rounded border border-border text-[11px] font-mono text-zinc-600">
                  {stage.technicalMechanism}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
