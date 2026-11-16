"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  GitFork,
  Cpu,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";

interface WorkflowStage {
  step: string;
  title: string;
  category: string;
  description: string;
  artifact: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  pillColor: string;
}

const stages: WorkflowStage[] = [
  {
    step: "01",
    title: "Understand & Ground",
    category: "Context Layer",
    description: "Extracts multi-tenant enterprise documentation, computes semantic embeddings, and creates a verified context manifest.",
    artifact: "GroundingManifest.json",
    icon: FileText,
    accentColor: "border-blue-300 hover:border-blue-500",
    pillColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    step: "02",
    title: "Plan & Decompose",
    category: "DAG Generation",
    description: "Deconstructs the target objective into a Directed Acyclic Graph of isolated, concurrent sub-tasks with strict schemas.",
    artifact: "ExecutionPlan.dag",
    icon: GitFork,
    accentColor: "border-indigo-300 hover:border-indigo-500",
    pillColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    step: "03",
    title: "Execute via Swarm",
    category: "Multi-Agent Runtime",
    description: "Dispatches domain-specific agents over the open MCP bus with sandboxed Python and SQL execution runtimes.",
    artifact: "SwarmTelemetry.log",
    icon: Cpu,
    accentColor: "border-emerald-300 hover:border-emerald-500",
    pillColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    step: "04",
    title: "Validate & Verify",
    category: "Guardrail Gate",
    description: "Validates numerical outputs against mathematical schemas and checks semantic citations against parent source documents.",
    artifact: "VerificationCertificate.p7s",
    icon: CheckCircle2,
    accentColor: "border-amber-300 hover:border-amber-500",
    pillColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    step: "05",
    title: "Approve & Deliver",
    category: "Governance Layer",
    description: "Evaluates policy thresholds and either commits the result automatically or halts for cryptographic dual-key authorization.",
    artifact: "AuditRecord.sig",
    icon: Lock,
    accentColor: "border-rose-300 hover:border-rose-500",
    pillColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
];

export function HowItWorksSection() {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  return (
    <section id="workflow" className="py-16 md:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Section 04 — Execution Pipeline
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-slate-900 tracking-tight leading-snug mb-2">
            Five deterministic stages from request to verified delivery.
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
            Every task traverses a verifiable pipeline with strict validation boundaries and immutable state logging.
          </p>
        </div>

        {/* 5 Opaque Stage Cards (Fitting in one screen frame, no clunky tabs or pagination) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isHovered = activeStage === idx;

            return (
              <motion.div
                key={stage.step}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                onMouseEnter={() => setActiveStage(idx)}
                onMouseLeave={() => setActiveStage(null)}
                className={`bg-slate-50 border-2 ${stage.accentColor} rounded-2xl p-5 flex flex-col justify-between shadow-sm transition-all duration-200 min-h-[260px]`}
              >
                <div>
                  {/* Top Step & Category Pill */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      STAGE {stage.step}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold border ${stage.pillColor}`}>
                      {stage.category}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-xs">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-slate-900 leading-tight">
                      {stage.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-xs text-slate-600 leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                {/* Bottom Artifact Tag */}
                <div className="pt-3 mt-3 border-t border-slate-200/70 flex items-center justify-between font-mono text-[10px]">
                  <span className="text-slate-400">Artifact</span>
                  <span className="text-slate-700 font-semibold truncate max-w-[120px]">
                    {stage.artifact}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Flow Indicator Line */}
        <div className="hidden lg:flex items-center justify-between mt-6 px-4">
          <div className="flex-1 h-0.5 bg-slate-200 relative">
            <div className="absolute inset-y-0 left-0 bg-blue-600 w-full" />
          </div>
        </div>

      </div>
    </section>
  );
}
