"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#030508] border-t border-white/10 pt-16 pb-12 font-serif text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono text-xs font-semibold flex items-center justify-center shadow-md shadow-blue-500/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                STARK
              </span>
            </div>
            <p className="font-serif text-sm text-slate-300 leading-relaxed max-w-sm font-normal">
              Enterprise AI workflow orchestration platform. Coordinating autonomous agents, enterprise knowledge, analytical tooling, and human oversight into reliable execution.
            </p>
            <div className="flex items-center space-x-2 pt-2 text-xs font-mono text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Platform Core Online / v0.1 Enterprise</span>
            </div>
          </div>

          {/* Section Navigation Links */}
          <div className="md:col-span-2 space-y-3 font-serif">
            <div className="font-mono text-xs uppercase tracking-wider text-blue-400 font-semibold">
              SECTIONS
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a href="#problem" className="hover:text-blue-400 transition-colors">
                  The Problem
                </a>
              </li>
              <li>
                <a href="#orchestration" className="hover:text-blue-400 transition-colors">
                  Orchestration Core
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-blue-400 transition-colors">
                  Workflow Lifecycle
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-blue-400 transition-colors">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#why-stark" className="hover:text-blue-400 transition-colors">
                  Why STARK
                </a>
              </li>
            </ul>
          </div>

          {/* Application Navigation Links */}
          <div className="md:col-span-3 space-y-3 font-serif">
            <div className="font-mono text-xs uppercase tracking-wider text-blue-400 font-semibold">
              APPLICATION
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/dashboard" className="hover:text-blue-400 transition-colors flex items-center space-x-1">
                  <span>Dashboard Console</span>
                  <ArrowUpRight className="w-3 h-3 text-blue-400" />
                </Link>
              </li>
              <li>
                <Link href="/workflows" className="hover:text-blue-400 transition-colors flex items-center space-x-1">
                  <span>Workflow Studio</span>
                  <ArrowUpRight className="w-3 h-3 text-blue-400" />
                </Link>
              </li>
              <li>
                <Link href="/agents" className="hover:text-blue-400 transition-colors flex items-center space-x-1">
                  <span>Agent Management</span>
                  <ArrowUpRight className="w-3 h-3 text-blue-400" />
                </Link>
              </li>
              <li>
                <Link href="/knowledge" className="hover:text-blue-400 transition-colors flex items-center space-x-1">
                  <span>Knowledge Base &amp; RAG</span>
                  <ArrowUpRight className="w-3 h-3 text-blue-400" />
                </Link>
              </li>
              <li>
                <Link href="/executions" className="hover:text-blue-400 transition-colors flex items-center space-x-1">
                  <span>Execution Centre</span>
                  <ArrowUpRight className="w-3 h-3 text-blue-400" />
                </Link>
              </li>
              <li>
                <Link href="/approvals" className="hover:text-blue-400 transition-colors flex items-center space-x-1">
                  <span>Human Approvals</span>
                  <ArrowUpRight className="w-3 h-3 text-blue-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Repository & System */}
          <div className="md:col-span-2 space-y-3 font-serif">
            <div className="font-mono text-xs uppercase tracking-wider text-blue-400 font-semibold">
              SYSTEM
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a
                  href="https://github.com/sachdeva-aarushi/stark"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center space-x-1"
                >
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-3 h-3 text-blue-400" />
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-400 transition-colors">
                  Enterprise Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Fine-line Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} STARK AI Platform. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 text-blue-400 font-semibold">
            <span>DETERMINISTIC MULTI-AGENT EXECUTION</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
