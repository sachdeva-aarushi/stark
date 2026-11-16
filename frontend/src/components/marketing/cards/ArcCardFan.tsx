"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, X } from "lucide-react";

export interface FanCardItem {
  id: string;
  num: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  extendedInfo: string[];
  metricLabel: string;
  metricValue: string;
  bgGradient: string; // Tailwind gradient classes
  borderClass: string;
  accentColor: string;
}

interface ArcCardFanProps {
  cards: FanCardItem[];
}

export function ArcCardFan({ cards }: ArcCardFanProps) {
  const [activeIdx, setActiveIdx] = useState(2); // Start with center card (03)
  const [modalCard, setModalCard] = useState<FanCardItem | null>(null);

  const prevCard = () => {
    setActiveIdx((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const nextCard = () => {
    setActiveIdx((prev) => (prev + 1) % cards.length);
  };

  return (
    <div className="w-full relative py-8">
      {/* Desktop Arc Fan Presentation (Hidden on small mobile, visible sm+) */}
      <div className="hidden sm:flex relative h-[520px] items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-5xl h-[460px] flex items-center justify-center">
          {cards.map((card, idx) => {
            // Offset from active index (-2, -1, 0, 1, 2)
            const offset = idx - activeIdx;
            const isActive = idx === activeIdx;

            // Compute arc geometry: rotation angle, translateX, translateY
            const rotation = offset * 9; // -18, -9, 0, 9, 18 deg
            const translateX = offset * 180; // horizontal spacing in px
            // Arc curve: cards further from center drop down along a parabola
            const translateY = Math.abs(offset) * 24 + (isActive ? -16 : 0);
            const scale = isActive ? 1.05 : 0.94 - Math.abs(offset) * 0.04;
            const zIndex = 30 - Math.abs(offset) * 5;
            const opacity = Math.abs(offset) > 2 ? 0.3 : 1 - Math.abs(offset) * 0.15;

            return (
              <motion.div
                key={card.id}
                onClick={() => setActiveIdx(idx)}
                initial={false}
                animate={{
                  x: translateX,
                  y: translateY,
                  rotate: rotation,
                  scale,
                  zIndex,
                  opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 26,
                  mass: 0.6,
                }}
                whileHover={{
                  y: translateY - 12,
                  scale: scale * 1.03,
                  transition: { duration: 0.2 },
                }}
                className={`absolute w-[260px] md:w-[280px] h-[400px] rounded-[2rem] p-6 flex flex-col justify-between cursor-pointer shadow-xl transition-shadow duration-300 ${card.bgGradient} ${card.borderClass}`}
                style={{
                  transformOrigin: "bottom center",
                }}
              >
                {/* Top: Pill Badge & Number */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-200/60 font-mono text-[10px] font-semibold text-zinc-800 uppercase tracking-wider shadow-sm">
                      <span className={`w-1.5 h-1.5 rounded-full ${card.accentColor}`} />
                      {card.badge}
                    </span>
                    <span className="font-mono text-xs font-bold text-zinc-400">
                      {card.num}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-serif text-2xl font-semibold text-zinc-950 tracking-tight leading-snug mb-1">
                    {card.title}
                  </h3>
                  <span className="font-mono text-[11px] text-zinc-600 font-medium block mb-3">
                    {card.subtitle}
                  </span>

                  {/* Description */}
                  <p className="font-sans text-xs text-zinc-600 leading-relaxed line-clamp-4">
                    {card.description}
                  </p>
                </div>

                {/* Bottom: Metric and Action Button */}
                <div className="pt-4 border-t border-zinc-200/50">
                  <div className="flex items-center justify-between mb-3 text-[11px] font-mono">
                    <span className="text-zinc-500">{card.metricLabel}</span>
                    <span className="font-bold text-zinc-900">{card.metricValue}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalCard(card);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/95 hover:bg-white text-zinc-950 font-sans text-xs font-semibold tracking-wider uppercase border border-zinc-200/80 shadow-sm hover:shadow flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-700" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile Horizontal Carousel (Visible only on < sm) */}
      <div className="sm:hidden flex gap-4 overflow-x-auto pb-4 pt-2 px-4 snap-x snap-mandatory no-scrollbar">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            onClick={() => setModalCard(card)}
            className={`shrink-0 w-[270px] h-[390px] rounded-[2rem] p-6 flex flex-col justify-between snap-center shadow-lg ${card.bgGradient} ${card.borderClass}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 border border-zinc-200/60 font-mono text-[10px] font-semibold text-zinc-800 uppercase">
                  <span className={`w-1.5 h-1.5 rounded-full ${card.accentColor}`} />
                  {card.badge}
                </span>
                <span className="font-mono text-xs font-bold text-zinc-400">
                  {card.num}
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-zinc-950 mb-1">
                {card.title}
              </h3>
              <span className="font-mono text-[11px] text-zinc-600 block mb-2">
                {card.subtitle}
              </span>
              <p className="font-sans text-xs text-zinc-600 leading-relaxed">
                {card.description}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-200/50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalCard(card);
                }}
                className="w-full py-2.5 rounded-xl bg-white text-zinc-950 font-sans text-xs font-semibold uppercase tracking-wider border border-zinc-200 shadow-sm flex items-center justify-center gap-1"
              >
                <span>Read More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls under the Arc Fan */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={prevCard}
          aria-label="Previous card"
          className="w-10 h-10 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 flex items-center justify-center shadow-sm transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              aria-label={`Jump to card ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === activeIdx ? "w-8 bg-zinc-950" : "w-2 bg-zinc-200 hover:bg-zinc-300"
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextCard}
          aria-label="Next card"
          className="w-10 h-10 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 flex items-center justify-center shadow-sm transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Modal / Detailed Card Drawer on "Read More" */}
      <AnimatePresence>
        {modalCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-xl bg-white rounded-3xl p-8 shadow-2xl border border-zinc-200 overflow-hidden"
            >
              <button
                onClick={() => setModalCard(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                  STAGE {modalCard.num}
                </span>
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
                  {modalCard.badge}
                </span>
              </div>

              <h3 className="font-serif text-3xl font-semibold text-zinc-950 mb-2">
                {modalCard.title}
              </h3>
              <p className="font-mono text-xs text-zinc-500 mb-6">
                {modalCard.subtitle}
              </p>

              <p className="font-sans text-sm text-zinc-700 leading-relaxed mb-6">
                {modalCard.description}
              </p>

              <div className="space-y-2.5 mb-8">
                <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider block">
                  Deterministic Execution Flow:
                </span>
                {modalCard.extendedInfo.map((info, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs font-sans text-zinc-800 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{info}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block">
                    {modalCard.metricLabel}
                  </span>
                  <span className="font-mono text-sm font-bold text-zinc-950">
                    {modalCard.metricValue}
                  </span>
                </div>
                <button
                  onClick={() => setModalCard(null)}
                  className="px-6 py-2.5 rounded-xl bg-zinc-950 text-white font-sans text-xs font-semibold hover:bg-zinc-800 transition-colors"
                >
                  Close Specification
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
