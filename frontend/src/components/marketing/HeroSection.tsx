"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown, ShieldCheck, Cpu, Database, Network, GitBranch, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  // 3D perspective mouse tracking for the interactive orchestration artifact
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative min-h-[92vh] pt-32 pb-20 flex flex-col justify-between overflow-hidden bg-white border-b border-border bg-grid-architectural">
      {/* Subtle architectural vertical rule */}
      <div className="absolute inset-y-0 left-1/2 w-[1px] bg-border-subtle/70 pointer-events-none hidden xl:block" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full relative z-10 flex-1 flex flex-col justify-center">
        {/* System identification pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center space-x-3 mb-8"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-border bg-surface text-zinc-700 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[11px] uppercase tracking-wider font-semibold">STARK ARCHITECTURE v0.1</span>
          </div>
          <span className="text-xs font-sans text-zinc-400 hidden sm:inline">—</span>
          <span className="text-xs font-sans text-zinc-500 uppercase tracking-widest hidden sm:inline">
            Autonomous Workflows &amp; Human Oversight
          </span>
        </motion.div>

        {/* Hero Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Monumental Editorial Typography */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-zinc-950 leading-[1.04]">
                Intelligence, <br />
                <span className="italic font-normal text-blue-700">orchestrated.</span>
              </h1>
              <p className="font-serif text-lg sm:text-xl text-zinc-600 leading-relaxed max-w-xl font-normal pt-2">
                Turn complex business processes into intelligent workflows powered by autonomous AI agents, connected enterprise knowledge, and deterministic human oversight.
              </p>
            </motion.div>

            {/* Supporting architectural statement */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 border-l-2 border-blue-600 bg-surface rounded-r max-w-lg"
            >
              <p className="font-sans text-xs text-zinc-700 uppercase tracking-widest font-semibold">
                From information to execution.
              </p>
              <p className="font-serif text-sm text-zinc-600 mt-1">
                A structured engineering foundation designed for operational clarity, auditability, and multi-agent coordination.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                href="/dashboard"
                className="group flex items-center space-x-2.5 px-6 py-3.5 bg-zinc-950 text-white rounded text-sm font-sans tracking-wide uppercase font-semibold hover:bg-zinc-800 transition-all shadow-sm"
              >
                <span>Explore the Platform</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center space-x-2 px-5 py-3.5 border border-border bg-white text-zinc-800 rounded text-sm font-sans tracking-wide uppercase font-medium hover:bg-surface hover:border-zinc-400 transition-colors"
              >
                <span>Discover How It Works</span>
                <ArrowDown className="w-3.5 h-3.5 text-zinc-500" />
              </a>
            </motion.div>
          </div>

          {/* Right Column: Abstract Spatial Orchestration Composition */}
          <div className="lg:col-span-5 xl:col-span-6 relative flex justify-center items-center">
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md sm:max-w-lg relative py-8 px-4 cursor-pointer select-none"
            >
              {/* Backing Ambient Depth Panel */}
              <div
                style={{ transform: "translateZ(-30px)" }}
                className="absolute inset-4 rounded-xl border border-dashed border-border-strong/70 bg-gradient-to-br from-surface to-surface-muted opacity-80"
              />

              {/* Central Primary Orchestration Hub Card */}
              <div
                style={{ transform: "translateZ(20px)" }}
                className="relative bg-white border border-zinc-300 rounded-lg p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] space-y-5"
              >
                {/* Header with status */}
                <div className="flex items-center justify-between border-b border-border pb-3.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                      <Network className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-serif text-sm font-bold text-zinc-950">STARK Orchestration Kernel</div>
                      <div className="font-mono text-[10px] text-zinc-500">SESSION: #STARK-80492-RUN</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>ACTIVE</span>
                  </span>
                </div>

                {/* Coordinated Execution Pipeline Nodes */}
                <div className="space-y-2.5 font-sans">
                  {/* Node 1: Autonomous Agent */}
                  <div className="flex items-center justify-between p-2.5 rounded border border-border bg-surface text-xs">
                    <div className="flex items-center space-x-2.5">
                      <Cpu className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-medium text-zinc-900">Agent: Financial Analyst</span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-500">DISPATCHED</span>
                  </div>

                  {/* Node 2: Knowledge Ingestion */}
                  <div className="flex items-center justify-between p-2.5 rounded border border-border bg-surface text-xs">
                    <div className="flex items-center space-x-2.5">
                      <Database className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-medium text-zinc-900">Vector Retrieval (RAG)</span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-500">98.4% RELEVANCE</span>
                  </div>

                  {/* Node 3: External Tool / MCP */}
                  <div className="flex items-center justify-between p-2.5 rounded border border-border bg-surface text-xs">
                    <div className="flex items-center space-x-2.5">
                      <GitBranch className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-medium text-zinc-900">MCP Tool Protocol</span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-500">ERP &amp; SQL SYNCED</span>
                  </div>
                </div>

                {/* Deterministic Human Oversight Gate */}
                <div className="p-3 rounded border border-blue-200 bg-blue-50/50 flex items-start space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <div className="font-semibold text-blue-950">Deterministic Human-in-the-Loop</div>
                    <div className="font-serif text-blue-800 text-[11px] mt-0.5">
                      Executive review required before mutation commit. Policy boundaries enforced.
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Spatial Sub-Card 1: Telemetry (Top Right) */}
              <motion.div
                style={{ transform: "translateZ(45px)" }}
                className="absolute -top-3 -right-2 sm:-right-6 bg-zinc-950 text-white rounded-lg p-3.5 border border-zinc-800 shadow-xl w-48 hidden sm:block"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                  <span>STATE VERIFIER</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="font-serif text-xs font-semibold">Zero Unvalidated Outputs</div>
                <div className="font-mono text-[10px] text-zinc-500 mt-1">LATENCY: 42ms</div>
              </motion.div>

              {/* Floating Spatial Sub-Card 2: Multi-Model Sync (Bottom Left) */}
              <motion.div
                style={{ transform: "translateZ(55px)" }}
                className="absolute -bottom-4 -left-2 sm:-left-6 bg-white border border-zinc-300 rounded-lg p-3.5 shadow-xl w-52 hidden sm:block"
              >
                <div className="flex items-center space-x-2 text-[10px] font-mono text-blue-700 font-semibold mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>AGENT HANDOFF</span>
                </div>
                <div className="font-serif text-xs text-zinc-900 font-medium">Research → Synthesis → Validation</div>
                <div className="font-mono text-[9px] text-zinc-400 mt-1">STATUS: OBSERVABLE</div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Architectural Bar */}
        <div className="pt-16 border-t border-border mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
          <div>
            <div className="font-serif text-2xl font-bold text-zinc-950">100%</div>
            <div className="font-sans text-xs text-zinc-500 uppercase tracking-wider mt-1">Observable Execution</div>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-zinc-950">RAG + MCP</div>
            <div className="font-sans text-xs text-zinc-500 uppercase tracking-wider mt-1">Native Protocol Integration</div>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-zinc-950">Deterministic</div>
            <div className="font-sans text-xs text-zinc-500 uppercase tracking-wider mt-1">Human-in-the-Loop Gates</div>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-zinc-950">Persistent</div>
            <div className="font-sans text-xs text-zinc-500 uppercase tracking-wider mt-1">Stateful Audit Trail</div>
          </div>
        </div>
      </div>
    </section>
  );
}
