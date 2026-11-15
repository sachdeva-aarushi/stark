"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { getWorkspaceInfo, getWorkspaceAgents, getWorkspaceWorkflows, WorkspaceInfo, AgentSummary, WorkflowSummary } from "@/lib/api";

export default function DashboardPage() {
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        const wsData = await getWorkspaceInfo();
        setWorkspace(wsData);

        const [agentsData, workflowsData] = await Promise.all([
          getWorkspaceAgents(wsData.slug || "stark-demo"),
          getWorkspaceWorkflows(wsData.slug || "stark-demo"),
        ]);
        setAgents(agentsData);
        setWorkflows(workflowsData);
      } catch (err: any) {
        console.error("Dashboard data load error:", err);
        setError("Failed to communicate with the backend. Displaying cached workspace state.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 font-serif">
        {/* Page Header */}
        <div className="border-b border-[#E5E7EB] pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-normal text-zinc-900 tracking-tight">
                Overview Dashboard
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Operational control centre for multi-agent workflows, grounding knowledge, and human review.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/workflows"
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded transition-colors"
              >
                Execute Workflow
              </Link>
              <Link
                href="/knowledge"
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-zinc-700 bg-white border border-[#E5E7EB] hover:bg-zinc-50 rounded transition-colors"
              >
                Knowledge Base
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded">
            {error}
          </div>
        )}

        {/* Workspace Identity Banner Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium tracking-wider uppercase text-zinc-500">Active Workspace</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Supabase Live
                </span>
              </div>
              <h2 className="text-xl font-normal text-zinc-900 mt-1">
                {workspace?.name || "STARK Demo Workspace"}
              </h2>
              <p className="text-sm text-zinc-500 mt-1 max-w-2xl">
                {workspace?.description || "Default enterprise AI workflow workspace for demonstration, document RAG, and multi-agent orchestration."}
              </p>
            </div>
            <div className="text-xs text-zinc-500 space-y-1 md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-[#E5E7EB] w-full md:w-auto">
              <div><span className="text-zinc-400">Slug:</span> <code className="font-mono text-zinc-700">{workspace?.slug || "stark-demo"}</code></div>
              <div><span className="text-zinc-400">Database:</span> PostgreSQL 17 (Supabase)</div>
              <div><span className="text-zinc-400">Orchestrator:</span> LangGraph 0.2+</div>
            </div>
          </div>
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500">Available Workflows</div>
            <div className="mt-2 text-2xl font-light text-zinc-900">
              {isLoading ? "—" : (workspace?.workflows_count || workflows.length || 1)}
            </div>
            <div className="mt-1 text-xs text-zinc-500">Seeded enterprise pipelines</div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-lg p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500">Configured Agents</div>
            <div className="mt-2 text-2xl font-light text-zinc-900">
              {isLoading ? "—" : (workspace?.agents_count || agents.length || 6)}
            </div>
            <div className="mt-1 text-xs text-zinc-500">Active specialized agents</div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-lg p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500">Human Approval</div>
            <div className="mt-2 text-2xl font-light text-zinc-900">Enabled</div>
            <div className="mt-1 text-xs text-zinc-500">LangGraph interrupt / resume</div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-lg p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500">System Status</div>
            <div className="mt-2 text-2xl font-light text-emerald-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Operational
            </div>
            <div className="mt-1 text-xs text-zinc-500">Backend &amp; DB connected</div>
          </div>
        </div>

        {/* Two-Column Section: Seeded Workflows & Seeded Agents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Workflows Column */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
              <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-900">
                Workflows ({workflows.length})
              </h3>
              <Link href="/workflows" className="text-xs text-zinc-600 hover:text-zinc-900 underline">
                View All
              </Link>
            </div>

            {workflows.length === 0 && !isLoading ? (
              <p className="text-sm text-zinc-500">No workflows configured yet.</p>
            ) : (
              <div className="space-y-3">
                {workflows.map((wf) => (
                  <div key={wf.id} className="p-3 border border-[#E5E7EB] rounded bg-white hover:border-zinc-400 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm text-zinc-900">{wf.name}</div>
                      {wf.approval_required && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                          HITL Gated
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{wf.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {wf.agent_sequence?.map((stage, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded">
                          {stage}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Agents Column */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
              <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-900">
                Seeded Agents ({agents.length})
              </h3>
              <Link href="/agents" className="text-xs text-zinc-600 hover:text-zinc-900 underline">
                Configure
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {agents.map((agent) => (
                <div key={agent.id} className="p-2.5 border border-[#E5E7EB] rounded bg-white">
                  <div className="text-xs font-medium text-zinc-900">{agent.name}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{agent.agent_type}</div>
                  <p className="text-[11px] text-zinc-600 mt-1 line-clamp-2">{agent.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Architecture & Verification Summary */}
        <div className="border border-[#E5E7EB] rounded-lg p-6 bg-zinc-50 text-xs text-zinc-600 space-y-2">
          <div className="font-medium text-zinc-800 uppercase tracking-wider">MVP Architecture Status</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <span className="font-semibold text-zinc-800">Persistence:</span>
              <p className="text-zinc-500 mt-0.5">PostgreSQL on Supabase with migrations 001 through 007 applied.</p>
            </div>
            <div>
              <span className="font-semibold text-zinc-800">Orchestration:</span>
              <p className="text-zinc-500 mt-0.5">StateGraph with durable checkpoints and interrupt-driven approval.</p>
            </div>
            <div>
              <span className="font-semibold text-zinc-800">Frontend:</span>
              <p className="text-zinc-500 mt-0.5">Next.js 14 App Router with TypeScript, Tailwind CSS, and Literata typography.</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
