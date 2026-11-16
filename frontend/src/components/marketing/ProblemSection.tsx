"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Layers, FileWarning, Shuffle, Lock, HelpCircle } from "lucide-react";

interface ProblemItem {
  number: string;
  category: string;
  title: string;
  description: string;
  impact: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PROBLEMS: ProblemItem[] = [
  {
    number: "01",
    category: "DATA FRAGMENTATION",
    title: "Siloed Knowledge & Inaccessible Context",
    description: "Enterprise data remains locked across disconnected document repositories, legacy databases, and disparate operational SaaS tools. AI cannot act without verified, unified context.",
    impact: "Result: Repetitive prompt pasting, lost context, and manual data copy-pasting.",
    icon: Layers,
  },
  {
    number: "02",
    category: "SYSTEM ISOLATION",
    title: "Disconnected, Single-Prompt AI Islands",
    description: "Point-solution AI tools and standalone chatbots operate in isolation. They generate text on demand but cannot coordinate across multi-step processes or invoke downstream APIs.",
    impact: "Result: Zero workflow continuity and fragmented technological debt.",
    icon: Shuffle,
  },
  {
    number: "03",
    category: "COORDINATION OVERHEAD",
    title: "Manual Glue Between Siloed Teams",
    description: "Human operators spend hundreds of hours acting as manual coordinators: copying agent outputs, emailing colleagues for approvals, and manually updating disparate backends.",
    impact: "Result: Sluggish turnaround times and operational vulnerability.",
    icon: HelpCircle,
  },
  {
    number: "04",
    category: "ACCURACY RISK",
    title: "Unvalidated Outputs & Hallucinations",
    description: "Unconstrained Large Language Models lack schema guardrails, business logic boundaries, and empirical fact verification before writing to core enterprise databases.",
    impact: "Result: Critical errors, compliance exposure, and stakeholder distrust.",
    icon: FileWarning,
  },
  {
    number: "05",
    category: "GOVERNANCE VOID",
    title: "Absence of Deterministic Oversight",
    description: "Full autonomy is too reckless for regulated domains, while pure manual work is too slow. Traditional automation tools lack dynamic, governed pause-for-approval checkpoints.",
    impact: "Result: AI projects stall before achieving production enterprise rollout.",
    icon: Lock,
  },
  {
    number: "06",
    category: "EXECUTION GAP",
    title: "Insight That Fails to Operationalize",
    description: "Generating summaries, reports, and conversational advice produces zero organizational value unless it directly mutates records, invokes systems, and completes workflows.",
    impact: "Result: AI remains a novelty demo rather than an operational utility.",
    icon: AlertCircle,
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="py-24 sm:py-32 bg-surface border-b border-border relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
            <span className="w-2 h-[1px] bg-zinc-400" />
            <span>SECTION 02 / THE CHALLENGE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 leading-tight">
            Intelligence is fragmented. <br />
            <span className="italic font-normal text-zinc-600">Work shouldn't be.</span>
          </h2>
          <p className="font-serif text-base sm:text-lg text-zinc-600 mt-4 leading-relaxed">
            Organizations attempt to bridge complex operations with isolated AI chats and fragile scripts. The breakdown happens at the boundaries.
          </p>
        </div>

        {/* Asymmetrical Editorial Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PROBLEMS.map((problem, idx) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={problem.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-white border border-border rounded-lg p-7 hover:border-zinc-400 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Top Meta */}
                  <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-5">
                    <span className="font-mono text-xs font-semibold text-zinc-400 group-hover:text-blue-600 transition-colors">
                      {problem.number}
                    </span>
                    <span className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                      {problem.category}
                    </span>
                    <Icon className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                  </div>

                  {/* Heading & Body */}
                  <h3 className="font-serif text-lg font-bold text-zinc-950 mb-3 group-hover:text-blue-900 transition-colors leading-snug">
                    {problem.title}
                  </h3>
                  <p className="font-serif text-sm text-zinc-600 leading-relaxed font-normal">
                    {problem.description}
                  </p>
                </div>

                {/* Bottom Impact Tag */}
                <div className="mt-6 pt-4 border-t border-border-subtle">
                  <p className="font-sans text-xs text-zinc-500 font-medium">
                    {problem.impact}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
