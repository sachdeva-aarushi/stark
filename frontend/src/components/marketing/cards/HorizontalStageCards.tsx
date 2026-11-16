"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck } from "lucide-react";

export interface StageFlowItem {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  description: string;
  bulletFlow: string[];
  artifact: string;
  gate: string;
  bgGradient: string;
  borderClass: string;
  dotColor: string;
}

interface HorizontalStageCardsProps {
  stages: StageFlowItem[];
}

export function HorizontalStageCards({ stages }: HorizontalStageCardsProps) {
  const [activeStage, setActiveStage] = useState(0);

  const prev = () => {
    setActiveStage((p) => (p - 1 + stages.length) % stages.length);
  };

  const next = () => {
    setActiveStage((p) => (p + 1) % stages.length);
  };

  return (
    <div className="w-full">
      {/* Stepper Tabs Bar */}
      <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 mb-8 pb-4 border-b border-zinc-200">
        {stages.map((stage, idx) => {
          const isActive = idx === activeStage;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(idx)}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-full font-sans text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-zinc-950 text-white shadow-lg"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-950"
              }`}
            >
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? "bg-zinc-800 text-blue-400" : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {stage.step}
              </span>
              <span>{stage.title}</span>
            </button>
          );
        })}
      </div>

      {/* 5 Cards Horizontal Track (Scrollable & Clickable) */}
      <div className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 snap-x snap-mandatory no-scrollbar">
        {stages.map((stage, idx) => {
          const isActive = idx === activeStage;

          return (
            <motion.div
              key={stage.id}
              onClick={() => setActiveStage(idx)}
              whileHover={{ y: -8 }}
              animate={{
                scale: isActive ? 1.02 : 0.98,
                opacity: isActive ? 1 : 0.85,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`shrink-0 w-[300px] sm:w-[340px] md:w-[360px] h-[480px] rounded-[2.5rem] p-8 flex flex-col justify-between snap-center cursor-pointer shadow-xl transition-all duration-300 ${stage.bgGradient} ${stage.borderClass}`}
            >
              {/* Card Header: Step Pill */}
              <div>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-200/50">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-zinc-200/70 font-mono text-[11px] font-bold text-zinc-800 uppercase shadow-sm">
                    <span className={`w-2 h-2 rounded-full ${stage.dotColor}`} />
                    STAGE {stage.step}
                  </span>
                  <span className="font-mono text-xs text-zinc-400">
                    Step {idx + 1} of {stages.length}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-zinc-950 tracking-tight mb-1">
                  {stage.title}
                </h3>
                <span className="font-mono text-xs text-zinc-600 font-medium block mb-4">
                  {stage.subtitle}
                </span>

                <p className="font-sans text-xs sm:text-sm text-zinc-700 leading-relaxed mb-6">
                  {stage.description}
                </p>

                {/* Key Execution Milestones */}
                <div className="space-y-2 font-sans text-xs text-zinc-700">
                  {stage.bulletFlow.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 bg-white/60 p-2.5 rounded-xl border border-zinc-200/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Artifact & Gate */}
              <div className="pt-4 border-t border-zinc-200/50">
                <div className="flex items-center justify-between text-[11px] font-mono mb-3">
                  <span className="text-zinc-500">Output Artifact:</span>
                  <span className="font-bold text-zinc-900">{stage.artifact}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-950 font-sans text-xs font-semibold uppercase tracking-wider border border-zinc-200/80 shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <span>{isActive ? "Proceed to Next Stage" : "Select Stage"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Track Controls */}
      <div className="flex items-center justify-between mt-2 px-2">
        <span className="font-mono text-xs text-zinc-400">
          Showing Stage {activeStage + 1} of {stages.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 flex items-center justify-center shadow-sm"
            aria-label="Previous stage"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="w-9 h-9 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 flex items-center justify-center shadow-sm"
            aria-label="Next stage"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
