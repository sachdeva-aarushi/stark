"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-12 font-serif text-zinc-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border">
          {/* Brand & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded bg-zinc-950 text-white font-mono text-xs font-semibold flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-zinc-950">
                STARK
              </span>
            </div>
            <p className="font-serif text-sm text-zinc-600 leading-relaxed max-w-sm font-normal">
              Enterprise AI workflow orchestration platform. Coordinating autonomous agents, enterprise knowledge, analytical tooling, and human oversight into reliable execution.
            </p>
            <div className="flex items-center space-x-2 pt-2 text-xs font-mono text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Platform Core Online / v0.1 Enterprise</span>
            </div>
          </div>

          {/* Section Navigation Links */}
          <div className="md:col-span-2 space-y-3 font-sans">
            <div className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              SECTIONS
            </div>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li>
                <a href="#problem" className="hover:text-zinc-950 transition-colors">
                  The Problem
                </a>
              </li>
              <li>
                <a href="#orchestration" className="hover:text-zinc-950 transition-colors">
                  Orchestration Core
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-zinc-950 transition-colors">
                  Workflow Lifecycle
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-zinc-950 transition-colors">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#why-stark" className="hover:text-zinc-950 transition-colors">
                  Why STARK
                </a>
              </li>
            </ul>
          </div>

          {/* Application Navigation Links */}
          <div className="md:col-span-3 space-y-3 font-sans">
            <div className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              APPLICATION
            </div>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li>
                <Link href="/dashboard" className="hover:text-zinc-950 transition-colors flex items-center space-x-1">
                  <span>Dashboard Console</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </Link>
              </li>
              <li>
                <Link href="/workflows" className="hover:text-zinc-950 transition-colors flex items-center space-x-1">
                  <span>Workflow Studio</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </Link>
              </li>
              <li>
                <Link href="/agents" className="hover:text-zinc-950 transition-colors flex items-center space-x-1">
                  <span>Agent Management</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </Link>
              </li>
              <li>
                <Link href="/knowledge" className="hover:text-zinc-950 transition-colors flex items-center space-x-1">
                  <span>Knowledge Base &amp; RAG</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </Link>
              </li>
              <li>
                <Link href="/executions" className="hover:text-zinc-950 transition-colors flex items-center space-x-1">
                  <span>Execution Centre</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </Link>
              </li>
              <li>
                <Link href="/approvals" className="hover:text-zinc-950 transition-colors flex items-center space-x-1">
                  <span>Human Approvals</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Repository & System */}
          <div className="md:col-span-2 space-y-3 font-sans">
            <div className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              SYSTEM
            </div>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li>
                <a
                  href="https://github.com/sachdeva-aarushi/stark"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-950 transition-colors flex items-center space-x-1"
                >
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-zinc-950 transition-colors">
                  Enterprise Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Fine-line Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} STARK AI Platform. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span>DETERMINISTIC MULTI-AGENT EXECUTION</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
