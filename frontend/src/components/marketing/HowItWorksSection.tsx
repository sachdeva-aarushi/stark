"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  GitFork,
  Cpu,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Compass,
} from "lucide-react";

interface WorkflowStage {
  step: string;
  numTitle: string;
  title: string;
  category: string;
  description: string;
  artifact: string;
  bgGradient: string;
  borderColor: string;
  buttonText: string;
  icon: React.ComponentType<{ className?: string }>;
}

const stages: WorkflowStage[] = [
  {
    step: "01",
    numTitle: "Stage 01",
    title: "Understand & Ground",
    category: "Context Layer",
    description: "Extracts multi-tenant enterprise documentation, computes dense and sparse embeddings, and creates a verified context manifest with citation lineage.",
    artifact: "GroundingManifest.json",
    bgGradient: "bg-[#fef9e7]", // Pale warm golden (matching Card 01 in Image 4)
    borderColor: "border-[#fde68a]",
    buttonText: "READ MORE",
    icon: FileText,
  },
  {
    step: "02",
    numTitle: "Stage 02",
    title: "Plan & Decompose",
    category: "DAG Generation",
    description: "Deconstructs the target objective into a Directed Acyclic Graph of isolated, concurrent sub-tasks with strict schemas and token budgets.",
    artifact: "ExecutionPlan.dag",
    bgGradient: "bg-[#e2e8f0]", // Slate mist (matching Card 02 in Image 4)
    borderColor: "border-[#cbd5e1]",
    buttonText: "READ MORE",
    icon: GitFork,
  },
  {
    step: "03",
    numTitle: "Stage 03",
    title: "Execute via Swarm",
    category: "Multi-Agent Runtime",
    description: "Dispatches domain-specific agents over the open MCP bus with sandboxed Python and SQL execution runtimes and live state persistence.",
    artifact: "SwarmTelemetry.log",
    bgGradient: "bg-[#f3e8ff]", // Soft lavender (matching Card 03 in Image 4)
    borderColor: "border-[#e9d5ff]",
    buttonText: "READ MORE",
    icon: Cpu,
  },
  {
    step: "04",
    numTitle: "Stage 04",
    title: "Validate & Verify",
    category: "Guardrail Gate",
    description: "Validates numerical outputs against mathematical schemas and checks semantic citations against parent source documents before committing.",
    artifact: "VerificationCertificate.p7s",
    bgGradient: "bg-[#e6f4ea]", // Soft sage green (matching Card 04 in Image 4)
    borderColor: "border-[#bbf7d0]",
    buttonText: "READ MORE",
    icon: CheckCircle2,
  },
  {
    step: "05",
    numTitle: "Stage 05",
    title: "Approve & Deliver",
    category: "Governance Layer",
    description: "Evaluates policy thresholds and either commits the result automatically or halts for cryptographic dual-key authorization with immutable logs.",
    artifact: "AuditRecord.sig",
    bgGradient: "bg-[#ffe4e6]", // Soft blush rose
    borderColor: "border-[#fecdd3]",
    buttonText: "READ MORE",
    icon: Lock,
  },
];

export function HowItWorksSection() {
  const [activeIndex, setActiveIndex] = useState(2); // Start with Stage 03 in center
  const [selectedModalStage, setSelectedModalStage] = useState<WorkflowStage | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll triggers: allow wheel scroll inside the container to cycle stages
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 40) {
      if (e.deltaY > 0) {
        setActiveIndex((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
      } else {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }
  };

  const nextStage = () => {
    setActiveIndex((prev) => (prev < stages.length - 1 ? prev + 1 : 0));
  };

  const prevStage = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : stages.length - 1));
  };

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      onWheel={handleWheel}
      className="py-20 md:py-28 bg-[#fdfbf7] border-b border-slate-200 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-semibold text-blue-700 tracking-wider uppercase">
                Section 04 — Execution Pipeline
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight leading-snug mb-3">
              Five deterministic stages from request to verified delivery.
            </h2>
            <p className="font-serif text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Scroll or select any card to advance through STARK&apos;s verifiable lifecycle.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevStage}
              aria-label="Previous Stage"
              className="w-11 h-11 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-700 shadow-xs hover:bg-slate-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="font-mono text-xs font-semibold px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-700">
              {stages[activeIndex].step} / 05
            </div>
            <button
              onClick={nextStage}
              aria-label="Next Stage"
              className="w-11 h-11 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-700 shadow-xs hover:bg-slate-50 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stage Indicator Pills */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {stages.map((stage, idx) => (
            <button
              key={stage.step}
              onClick={() => setActiveIndex(idx)}
              className={`px-4 py-2 rounded-full font-serif text-xs font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                activeIndex === idx
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
              }`}
            >
              <span className="font-mono text-[10px] opacity-70">{stage.step}</span>
              <span>{stage.title}</span>
            </button>
          ))}
        </div>

        {/* THE ARC CAROUSEL FAN (Directly Inspired by Image 4) */}
        <div className="relative h-[480px] sm:h-[520px] w-full flex items-center justify-center select-none perspective-1200">
          
          {/* Subtle curved arc baseline guide */}
          <div className="absolute inset-x-8 bottom-4 h-48 border-b-2 border-dashed border-slate-200/80 rounded-[50%] pointer-events-none" />

          {stages.map((stage, idx) => {
            const offset = idx - activeIndex;
            const isCenter = offset === 0;
            const distance = Math.abs(offset);

            // Compute arc geometry matching Image 4
            // Center is upright (0 deg), left is tilted counter-clockwise (-12deg, -24deg), right is tilted clockwise (+12deg, +24deg)
            const rotation = offset * 11;
            const xOffset = offset * 185; // Distance apart
            const yOffset = distance * 24; // Arc dip
            const scale = isCenter ? 1.06 : Math.max(0.88, 1 - distance * 0.06);
            const zIndex = 30 - distance * 5;
            const opacity = distance > 2 ? 0.4 : 1;

            return (
              <motion.div
                key={stage.step}
                animate={{
                  x: xOffset,
                  y: yOffset,
                  rotate: rotation,
                  scale: scale,
                  zIndex: zIndex,
                  opacity: opacity,
                }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                onClick={() => {
                  if (isCenter) {
                    setSelectedModalStage(stage);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                className={`absolute w-64 sm:w-72 h-[370px] sm:h-[400px] rounded-[2rem] p-6 flex flex-col justify-between shadow-xl cursor-pointer border-2 ${stage.borderColor} ${stage.bgGradient} transition-shadow duration-300 hover:shadow-2xl`}
              >
                {/* Top Badge: Star Emblem from Image 4 */}
                <div className="text-center pt-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-slate-900/10 flex items-center justify-center text-slate-800 mb-4">
                    <Compass className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500 block mb-1">
                    {stage.category}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight">
                    {stage.numTitle}
                  </h3>
                </div>

                {/* Middle Content */}
                <div className="text-center px-1">
                  <h4 className="font-serif text-base font-semibold text-slate-800 mb-2">
                    {stage.title}
                  </h4>
                  <p className="font-serif text-xs text-slate-600 leading-relaxed font-normal line-clamp-4">
                    {stage.description}
                  </p>
                </div>

                {/* Bottom READ MORE Pill Button (Matching Image 4) */}
                <div className="pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedModalStage(stage);
                    }}
                    className="w-full py-3 px-6 rounded-2xl bg-white border border-slate-200/90 text-slate-900 font-mono text-xs font-bold tracking-widest uppercase shadow-sm hover:bg-slate-900 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span>{stage.buttonText}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal for Deep Stage Inspection */}
        <AnimatePresence>
          {selectedModalStage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-left relative"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <selectedModalStage.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      LIFECYCLE STAGE {selectedModalStage.step}
                    </span>
                    <h3 className="font-serif text-2xl font-semibold text-slate-900">
                      {selectedModalStage.title}
                    </h3>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4 font-mono text-xs text-slate-700 flex items-center justify-between">
                  <span className="text-slate-500">Pipeline Artifact:</span>
                  <span className="font-bold text-blue-700">{selectedModalStage.artifact}</span>
                </div>

                <p className="font-serif text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                  {selectedModalStage.description}
                </p>

                <button
                  onClick={() => setSelectedModalStage(null)}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white font-serif text-xs font-semibold uppercase tracking-wider hover:bg-slate-800"
                >
                  Close Stage Overview
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
