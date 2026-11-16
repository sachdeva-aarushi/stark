"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, CheckCircle2, RotateCw } from "lucide-react";

export interface DeckCardItem {
  id: string;
  pillTag: string;
  title: string;
  subtitle: string;
  description: string;
  bulletPoints: string[];
  ctaLabel: string;
  bgGradient: string;
  borderClass: string;
  accentDot: string;
}

interface CascadingDeckProps {
  cards: DeckCardItem[];
}

export function CascadingDeck({ cards }: CascadingDeckProps) {
  const [deck, setDeck] = useState(cards);

  const cycleCard = () => {
    setDeck((prev) => {
      const copy = [...prev];
      const first = copy.shift();
      if (first) copy.push(first);
      return copy;
    });
  };

  const bringToFront = (id: string) => {
    const idx = deck.findIndex((c) => c.id === id);
    if (idx <= 0) return;
    setDeck((prev) => {
      const target = prev[idx];
      const rest = prev.filter((_, i) => i !== idx);
      return [target, ...rest];
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 3D Overlapping Cascading Deck Container */}
      <div className="relative w-full max-w-lg h-[460px] flex items-center justify-center">
        {deck.slice(0, 4).map((card, idx) => {
          // idx 0 is the front card, 1 is behind it with offset, etc.
          const xOffset = idx * 28; // horizontal offset to the right
          const yOffset = idx * -16; // slight upward shift or downward
          const scale = 1 - idx * 0.05;
          const zIndex = 20 - idx;
          const isFront = idx === 0;

          return (
            <motion.div
              key={card.id}
              layout
              initial={false}
              animate={{
                x: xOffset,
                y: yOffset,
                scale,
                zIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 28,
              }}
              onClick={() => (isFront ? cycleCard() : bringToFront(card.id))}
              whileHover={{
                scale: scale * 1.02,
                cursor: "pointer",
              }}
              className={`absolute w-[320px] sm:w-[360px] h-[400px] rounded-[2.5rem] p-7 flex flex-col justify-between shadow-2xl transition-colors duration-300 ${card.bgGradient} ${card.borderClass}`}
            >
              {/* Card Header: Pill Badge & Cycle Hint */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200/60 font-mono text-xs font-semibold text-zinc-800 uppercase tracking-wider shadow-sm">
                    <span className={`w-2 h-2 rounded-full ${card.accentDot}`} />
                    {card.pillTag}
                  </span>
                  {isFront && (
                    <span className="font-mono text-[11px] text-zinc-500 flex items-center gap-1 bg-white/60 px-2 py-0.5 rounded-full">
                      <RotateCw className="w-3 h-3 text-zinc-400" />
                      Click to cycle
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-zinc-950 tracking-tight mb-1">
                  {card.title}
                </h3>
                <span className="font-mono text-xs text-zinc-600 block mb-3 font-medium">
                  {card.subtitle}
                </span>

                {/* Description */}
                <p className="font-sans text-xs sm:text-sm text-zinc-700 leading-relaxed mb-4">
                  {card.description}
                </p>

                {/* Key Points */}
                <div className="space-y-1.5 font-sans text-xs text-zinc-700">
                  {card.bulletPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Pill Button */}
              <div className="pt-4 border-t border-zinc-200/60 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    cycleCard();
                  }}
                  className="w-full py-3 px-5 rounded-2xl bg-zinc-950 text-white font-sans text-xs font-semibold tracking-wider uppercase shadow-md hover:bg-zinc-800 flex items-center justify-center gap-2 transition-all"
                >
                  <span>{card.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 text-zinc-300" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cycle Controls */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={cycleCard}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-sans text-xs font-semibold shadow-sm transition-all"
        >
          <RotateCw className="w-3.5 h-3.5 text-zinc-500" />
          <span>Next Orchestration Card</span>
        </button>
      </div>
    </div>
  );
}
