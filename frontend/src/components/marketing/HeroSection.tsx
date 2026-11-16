"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Bot, Database, ShieldCheck, Cpu, Network, CheckCircle2 } from "lucide-react";
import { FloatingCard } from "./cards/FloatingCard";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Global Hero pointer parallax coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax transformations for spatial depth
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const translateX = useTransform(smoothX, [-0.5, 0.5], [-16, 16]);
  const translateY = useTransform(smoothY, [-0.5, 0.5], [-16, 16]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.pointerType === "touch") return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-white border-b border-zinc-200"
    >
      {/* Subtle Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Monumental Editorial Typography */}
          <div className="lg:col-span-6 z-10">
            {/* Architectural Category Tag */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200/90 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-mono text-xs font-medium text-zinc-700 tracking-wider uppercase">
                Enterprise AI Orchestration Platform
              </span>
            </motion.div>

            {/* Monumental Serif Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-zinc-950 tracking-tight leading-[1.06] mb-8"
            >
              Intelligence, <br />
              <span className="italic font-normal text-zinc-800">orchestrated.</span>
            </motion.h1>

            {/* Subheading / Product Manifesto */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-sans text-lg sm:text-xl text-zinc-600 font-normal leading-relaxed max-w-xl mb-10"
            >
              Move beyond fragile prompt chains and conversational demos. STARK coordinates autonomous agents, enterprise knowledge retrieval, and deterministic tool execution into auditable, production-grade workflows.
            </motion.p>

            {/* Interactive CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-14"
            >
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-zinc-950 text-white font-sans text-sm font-medium tracking-tight shadow-lg hover:bg-zinc-800 transition-all duration-200"
              >
                <span>Open Platform</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="#orchestration"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-zinc-200/90 bg-white text-zinc-800 font-sans text-sm font-medium hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200"
              >
                Explore Architecture
              </Link>
            </motion.div>

            {/* Fine Metric Dividers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-200/80"
            >
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-medium text-zinc-950 tracking-tight">
                  100%
                </span>
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider mt-1 block">
                  Deterministic Logic
                </span>
              </div>
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-medium text-zinc-950 tracking-tight">
                  Dual-Key
                </span>
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider mt-1 block">
                  Human Oversight
                </span>
              </div>
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-medium text-zinc-950 tracking-tight">
                  Open MCP
                </span>
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider mt-1 block">
                  Protocol Standard
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Layered Spatial Composition */}
          <div className="lg:col-span-6 relative h-[520px] md:h-[580px] w-full flex items-center justify-center">
            
            {/* Perspective Wrapper with cursor tracking */}
            <motion.div
              style={{
                perspective: 1200,
                rotateX,
                rotateY,
                x: translateX,
                y: translateY,
                transformStyle: "preserve-3d",
              }}
              className="relative w-full max-w-[480px] h-[440px]"
            >
              {/* Backing Ambient Depth Rings */}
              <div className="absolute inset-0 rounded-full border border-zinc-200/60 scale-125 pointer-events-none -z-20" />
              <div className="absolute inset-0 rounded-full border border-dashed border-zinc-200/40 scale-150 pointer-events-none -z-20" />

              {/* OBJECT 1: Autonomous Agents Card (Center-Left, translateZ: 30px) */}
              <div className="absolute top-0 left-0 w-72 z-20">
                <FloatingCard
                  depth={30}
                  floatRange={6}
                  duration={5}
                  delay={0}
                  borderClass="border border-zinc-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-zinc-400"
                  className="p-5"
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-zinc-700">
                        Agent Cluster
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-semibold text-zinc-950 mb-1">
                    Specialized Multi-Agent Swarm
                  </h4>
                  <p className="font-sans text-xs text-zinc-500 mb-3">
                    Coordinated sub-agents executing decomposed tasks in parallel.
                  </p>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-600 bg-zinc-50 p-2 rounded">
                    <span>Researcher</span>
                    <span>•</span>
                    <span>Analyst</span>
                    <span>•</span>
                    <span>Auditor</span>
                  </div>
                </FloatingCard>
              </div>

              {/* OBJECT 2: Enterprise Knowledge & Vector Retrieval (Top-Right, translateZ: 15px) */}
              <div className="absolute -top-4 right-0 w-64 z-10">
                <FloatingCard
                  depth={15}
                  floatRange={5}
                  duration={6}
                  delay={0.8}
                  rotateZ={2}
                  borderClass="border border-zinc-200/90 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.08)] hover:border-zinc-400"
                  className="p-5"
                >
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-100">
                    <Database className="w-4 h-4 text-zinc-800" />
                    <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-zinc-600">
                      RAG Vector Grounding
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-zinc-900 mb-1">
                    Enterprise Knowledge Fabric
                  </h4>
                  <div className="space-y-1.5 font-mono text-[10px] text-zinc-500">
                    <div className="flex justify-between py-1 px-2 bg-zinc-50 rounded">
                      <span>SEC 10-K Chunk</span>
                      <span className="text-blue-600 font-medium">0.94 Cosine</span>
                    </div>
                    <div className="flex justify-between py-1 px-2 bg-zinc-50 rounded">
                      <span>Internal Policy v4</span>
                      <span className="text-emerald-600 font-medium">Verified</span>
                    </div>
                  </div>
                </FloatingCard>
              </div>

              {/* OBJECT 3: Tool Execution & MCP Protocol (Center-Right, translateZ: 45px) */}
              <div className="absolute top-44 right-2 w-72 z-30">
                <FloatingCard
                  depth={45}
                  floatRange={7}
                  duration={5.5}
                  delay={1.5}
                  rotateZ={-1}
                  borderClass="border border-zinc-200 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.14)] hover:border-zinc-400"
                  className="p-5 bg-white"
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-zinc-700">
                        Model Context Protocol
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">
                      MCP v1.2
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-semibold text-zinc-950 mb-1">
                    Tool Execution Matrix
                  </h4>
                  <p className="font-sans text-xs text-zinc-500 mb-3">
                    Deterministic sandbox calling GitHub, PostgreSQL & REST APIs.
                  </p>
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                      GitHub API
                    </span>
                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded border border-zinc-200">
                      Postgres
                    </span>
                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded border border-zinc-200">
                      Notion
                    </span>
                  </div>
                </FloatingCard>
              </div>

              {/* OBJECT 4: Human-in-the-Loop Governance Gate (Bottom-Left, translateZ: 65px) */}
              <div className="absolute bottom-2 left-4 w-72 z-40">
                <FloatingCard
                  depth={65}
                  floatRange={8}
                  duration={4.8}
                  delay={0.4}
                  borderClass="border border-zinc-950 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.18)]"
                  bgClass="bg-zinc-950 text-white"
                  className="p-5"
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-zinc-300">
                        Governance Checkpoint
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded-full">
                      Approval Required
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-semibold text-white mb-1">
                    Human Authorization Gate
                  </h4>
                  <p className="font-sans text-xs text-zinc-400 mb-3">
                    Automated workflows halt for dual-signature confirmation on high-consequence mutations.
                  </p>
                  <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 bg-zinc-900 p-2 rounded border border-zinc-800">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      Audited Trail
                    </span>
                    <span className="text-zinc-500">Immutable SHA-256</span>
                  </div>
                </FloatingCard>
              </div>

              {/* OBJECT 5: Central Orchestration Nexus (Background node connector) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-zinc-300/60 bg-white/40 backdrop-blur-sm flex items-center justify-center -z-10 shadow-inner">
                <div className="text-center">
                  <Network className="w-6 h-6 text-zinc-400 mx-auto mb-1 animate-spin" style={{ animationDuration: "20s" }} />
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">
                    STARK Core
                  </span>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
