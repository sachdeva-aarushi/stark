"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, ArrowRight } from "lucide-react";
import { TiltCard } from "./TiltCard";

export interface StageData {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  description: string;
  technicalDetails: string[];
  outputArtifact: string;
  latencyExpectation: string;
  policyGate: string;
}

interface HorizontalCardTrackProps {
  stages: StageData[];
}

export function HorizontalCardTrack({ stages }: HorizontalCardTrackProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeStage = stages[activeIdx];

  const nextStage = () => {
    setActiveIdx((prev) => (prev + 1) % stages.length);
  };

  const prevStage = () => {
    setActiveIdx((prev) => (prev - 1 + stages.length) % stages.length);
  };

  return (
    <div className="w-full">
      {/* Stage Stepper Header (Desktop & Tablet) */}
      <div className="relative mb-8 pb-4 border-b border-zinc-200">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 md:gap-4">
          {stages.map((stage, idx) => {
            const isActive = idx === activeIdx;
            const isCompleted = idx < activeIdx;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveIdx(idx)}
                className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-left whitespace-nowrap ${
                  isActive
                    ? "bg-zinc-950 text-white shadow-lg"
                    : isCompleted
                    ? "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <span
                  className={`font-mono text-xs px-1.5 py-0.5 rounded font-medium ${
                    isActive
                      ? "bg-zinc-800 text-blue-400"
                      : isCompleted
                      ? "bg-zinc-200 text-zinc-700"
                      : "text-zinc-400"
                  }`}
                >
                  {stage.step}
                </span>
                <span className="font-serif text-sm font-semibold tracking-tight">
                  {stage.title}
                </span>
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Progress Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-100">
          <motion.div
            className="h-full bg-blue-600"
            animate={{
              width: `${((activeIdx + 1) / stages.length) * 100}%`,
            }}
            transition={{ type: "spring", damping: 24, stiffness: 220 }}
          />
        </div>
      </div>

      {/* Interactive 3D Stage Visualizer Track */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Focused 3D Tilt Card for Active Stage */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage.id}
              initial={{ opacity: 0, y: 16, rotateX: 6 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -16, rotateX: -6 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <TiltCard
                tiltMaxAngle={6}
                borderClass="border border-zinc-200 hover:border-zinc-300"
                className="w-full"
              >
                <div className="p-8 md:p-10 bg-white rounded-2xl">
                  {/* Top Bar with Stage Badge & Latency */}
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
                        STAGE {activeStage.step}
                      </span>
                      <span className="font-mono text-xs text-zinc-500">
                        {activeStage.subtitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                        {activeStage.latencyExpectation}
                      </span>
                    </div>
                  </div>

                  {/* Stage Headline */}
                  <h3 className="font-serif text-2xl md:text-3xl font-normal text-zinc-950 mb-4 tracking-tight">
                    {activeStage.title}
                  </h3>
                  <p className="font-sans text-base text-zinc-600 leading-relaxed mb-8">
                    {activeStage.description}
                  </p>

                  {/* Architectural Verification Points */}
                  <div className="space-y-3 mb-8">
                    <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider block">
                      Deterministic Execution Protocols:
                    </span>
                    {activeStage.technicalDetails.map((detail, dIdx) => (
                      <div
                        key={dIdx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 border border-zinc-100/80"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                        <span className="font-sans text-sm text-zinc-700">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Verification Artifact */}
                  <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider block">
                        Verified Output Artifact
                      </span>
                      <span className="font-mono text-xs text-zinc-800 font-medium">
                        {activeStage.outputArtifact}
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider block">
                        Policy Enforcement Gate
                      </span>
                      <span className="font-mono text-xs text-emerald-700 font-semibold flex items-center sm:justify-end gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {activeStage.policyGate}
                      </span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </AnimatePresence>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between mt-6 px-2">
            <button
              onClick={prevStage}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 text-sm font-sans font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Stage
            </button>
            <span className="font-mono text-xs text-zinc-400">
              {activeIdx + 1} of {stages.length}
            </span>
            <button
              onClick={nextStage}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 text-white text-sm font-sans font-medium hover:bg-zinc-800 transition-colors"
            >
              Next Stage
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Mini Stage Preview Cards Deck */}
        <div className="lg:col-span-5 space-y-3">
          <div className="pb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              Complete Execution Lifecycle
            </span>
          </div>
          {stages.map((stage, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <motion.div
                key={stage.id}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActiveIdx(idx)}
                className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 ${
                  isSelected
                    ? "bg-zinc-950 text-white border-zinc-950 shadow-md translate-x-2"
                    : "bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        isSelected
                          ? "bg-zinc-800 text-blue-400"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {stage.step}
                    </span>
                    <span className="font-serif text-base font-semibold">
                      {stage.title}
                    </span>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? "text-blue-400 translate-x-1" : "text-zinc-400"
                    }`}
                  />
                </div>
                <p
                  className={`mt-2 text-xs font-sans line-clamp-2 ${
                    isSelected ? "text-zinc-300" : "text-zinc-500"
                  }`}
                >
                  {stage.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
