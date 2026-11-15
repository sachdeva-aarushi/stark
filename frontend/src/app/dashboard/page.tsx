"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  getWorkspaceInfo,
  getWorkflowStats,
  getWorkflowRuns,
  getWorkspaceWorkflows,
  executeWorkflow,
  WorkspaceInfo,
  WorkflowStats,
  WorkflowRunSummary,
  WorkflowSummary,
  WorkflowExecutionResult,
} from "@/lib/api";

function formatLatency(ms?: number | null): string {
  if (ms === null || ms === undefined) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatTimestamp(isoString?: string | null): string {
  if (!isoString) return "—";
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return isoString;
  }
}

function StatusBadge({ status }: { status: string }) {
  const norm = status?.toUpperCase() || "UNKNOWN";
  switch (norm) {
    case "COMPLETED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          Completed
        </span>
      );
    case "WAITING_FOR_APPROVAL":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
          Awaiting Review
        </span>
      );
    case "RUNNING":
    case "ACTIVE":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
          Active
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
          Failed
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
          {status}
        </span>
      );
  }
}

function ApprovalBadge({ approval }: { approval?: string | null }) {
  if (!approval) {
    return <span className="text-zinc-400 text-xs">—</span>;
  }
  const norm = approval.toUpperCase();
  if (norm === "APPROVED") {
    return <span className="text-[11px] text-emerald-700 font-medium">Approved</span>;
  }
  if (norm === "PENDING") {
    return <span className="text-[11px] text-amber-700 font-medium">Pending Gate</span>;
  }
  if (norm === "CHANGES_REQUESTED") {
    return <span className="text-[11px] text-orange-700 font-medium">Revision Requested</span>;
  }
  if (norm === "REJECTED") {
    return <span className="text-[11px] text-rose-700 font-medium">Rejected</span>;
  }
  return <span className="text-[11px] text-zinc-600">{approval}</span>;
}

export default function DashboardPage() {
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [stats, setStats] = useState<WorkflowStats | null>(null);
  const [recentRuns, setRecentRuns] = useState<WorkflowRunSummary[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick Execute Modal
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowSummary | null>(null);
  const [queryInput, setQueryInput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [execResult, setExecResult] = useState<WorkflowExecutionResult | null>(null);
  const [execError, setExecError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [ws, st, runsRes, wfs] = await Promise.all([
        getWorkspaceInfo(),
        getWorkflowStats(),
        getWorkflowRuns(1, 5),
        getWorkspaceWorkflows("stark-demo"),
      ]);

      setWorkspace(ws);
      setStats(st);
      setRecentRuns(runsRes.items);
      setWorkflows(wfs);
    } catch (err: any) {
      console.error("Dashboard data load error:", err);
      setError("Failed to communicate with the orchestrator. Showing cached states.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenExecute = (wf: WorkflowSummary) => {
    setSelectedWorkflow(wf);
    setQueryInput(
      wf.objective ||
      "Evaluate Q3 enterprise compute expenditures and compare against budget projections."
    );
    setExecResult(null);
    setExecError(null);
  };

  const handleRunExecution = async () => {
    if (!selectedWorkflow || !queryInput.trim()) return;
    try {
      setIsExecuting(true);
      setExecError(null);
      const res = await executeWorkflow(selectedWorkflow.id, queryInput.trim());
      setExecResult(res);
      // Reload stats and recent runs in background
      loadData();
    } catch (err: any) {
      setExecError(err.message || "Execution encountered an error.");
    } finally {
      setIsExecuting(false);
    }
  };

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
              <p className="mt-1 text-sm text-zinc-500 font-serif">
                Operational control centre for multi-agent workflows, grounding knowledge, and human review.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/executions"
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded transition-colors"
              >
                Execution Centre
              </Link>
              <Link
                href="/approvals"
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-zinc-700 bg-white border border-[#E5E7EB] hover:bg-zinc-50 rounded transition-colors"
              >
                Approvals Queue
                {stats && stats.awaiting_approval > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full text-[10px] font-mono">
                    {stats.awaiting_approval}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded">
            {error}
          </div>
        )}

        {/* Workspace Information Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium tracking-wider uppercase text-zinc-500">
                  Workspace Information
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Supabase Live
                </span>
              </div>
              <h2 className="text-xl font-normal text-zinc-900 mt-1">
                {workspace?.name || "STARK Demo Workspace"}
              </h2>
              <p className="text-sm text-zinc-500 mt-1 max-w-2xl font-serif">
                {workspace?.description ||
                  "Default enterprise AI workflow workspace for demonstration, document RAG, and multi-agent orchestration."}
              </p>
            </div>
            <div className="text-xs text-zinc-500 space-y-1 md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-[#E5E7EB] w-full md:w-auto font-mono">
              <div>
                <span className="text-zinc-400 font-serif">Slug:</span>{" "}
                <span className="text-zinc-800 font-medium">{workspace?.slug || "stark-demo"}</span>
              </div>
              <div>
                <span className="text-zinc-400 font-serif">Database:</span> PostgreSQL 17 (Supabase)
              </div>
              <div>
                <span className="text-zinc-400 font-serif">Orchestrator:</span> LangGraph v0.2
              </div>
            </div>
          </div>
        </div>

        {/* Database-Backed Metrics KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              Total Executions
            </div>
            <div className="mt-2 text-2xl font-light text-zinc-900 font-mono">
              {isLoading ? "—" : (stats?.total_runs ?? 0)}
            </div>
            <div className="mt-1 text-xs text-zinc-400 font-serif">Persisted workflow runs</div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-lg p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              Successful
            </div>
            <div className="mt-2 text-2xl font-light text-emerald-700 font-mono">
              {isLoading ? "—" : (stats?.completed_runs ?? 0)}
            </div>
            <div className="mt-1 text-xs text-zinc-400 font-serif">Completed with PASS</div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-lg p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              Failed Executions
            </div>
            <div className="mt-2 text-2xl font-light text-rose-700 font-mono">
              {isLoading ? "—" : (stats?.failed_runs ?? 0)}
            </div>
            <div className="mt-1 text-xs text-zinc-400 font-serif">Error or interrupted</div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-lg p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              Active Executions
            </div>
            <div className="mt-2 text-2xl font-light text-blue-700 font-mono">
              {isLoading ? "—" : (stats?.active_runs ?? 0)}
            </div>
            <div className="mt-1 text-xs text-zinc-400 font-serif">In-flight agent steps</div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-lg p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              Pending Approvals
            </div>
            <div className="mt-2 text-2xl font-light text-amber-700 font-mono">
              {isLoading ? "—" : (stats?.awaiting_approval ?? 0)}
            </div>
            <div className="mt-1 text-xs text-zinc-400 font-serif">LangGraph HITL gates</div>
          </div>
        </div>

        {/* Recent Execution Activity Table */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-900">
                Recent Execution Activity
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Audit log of recent orchestrations from PostgreSQL.
              </p>
            </div>
            <Link
              href="/executions"
              className="text-xs text-zinc-600 hover:text-zinc-900 font-medium underline"
            >
              View Full History →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-serif divide-y divide-[#E5E7EB]">
              <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3 font-medium">Run ID</th>
                  <th className="px-6 py-3 font-medium">Query</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Approval</th>
                  <th className="px-6 py-3 font-medium">Latency</th>
                  <th className="px-6 py-3 font-medium">Timestamp</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] bg-white text-zinc-700">
                {recentRuns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-zinc-400">
                      {isLoading ? "Loading activity records..." : "No recent execution activity recorded."}
                    </td>
                  </tr>
                ) : (
                  recentRuns.map((run) => (
                    <tr key={run.run_id} className="hover:bg-zinc-50/75 transition-colors">
                      <td className="px-6 py-3 font-mono text-[11px] text-zinc-800">
                        <Link
                          href={`/executions/${run.run_id}`}
                          className="hover:underline text-zinc-900"
                        >
                          {run.run_id.slice(0, 14)}...
                        </Link>
                      </td>
                      <td className="px-6 py-3 max-w-xs truncate text-zinc-800" title={run.query}>
                        {run.query}
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={run.status} />
                      </td>
                      <td className="px-6 py-3">
                        <ApprovalBadge approval={run.approval_status} />
                      </td>
                      <td className="px-6 py-3 font-mono text-[11px] text-zinc-600">
                        {formatLatency(run.duration_ms)}
                      </td>
                      <td className="px-6 py-3 text-zinc-500">
                        {formatTimestamp(run.started_at || run.created_at)}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Link
                          href={`/executions/${run.run_id}`}
                          className="text-xs text-zinc-700 hover:text-zinc-950 font-medium underline"
                        >
                          Inspect Detail
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available Workflows List with Quick Execute Action */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-900">
                Available Workflows ({workflows.length})
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Pre-configured multi-agent pipelines ready for execution.
              </p>
            </div>
            <Link href="/workflows" className="text-xs text-zinc-600 hover:text-zinc-900 underline">
              Manage Pipelines →
            </Link>
          </div>

          <div className="space-y-3">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                className="p-4 border border-[#E5E7EB] rounded-md bg-white hover:border-zinc-400 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-zinc-900">{wf.name}</span>
                    {wf.approval_required && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        Human Review Gated
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 max-w-2xl">{wf.description}</p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Agents:</span>
                    {wf.agent_sequence?.map((stage, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.5 bg-zinc-50 border border-[#E5E7EB] text-zinc-600 rounded font-mono"
                      >
                        {stage}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenExecute(wf)}
                    className="px-3.5 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded transition-colors"
                  >
                    Quick Execute
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Execute Modal */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E7EB] rounded-lg max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-start border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-base font-normal text-zinc-900">
                  Execute: {selectedWorkflow.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Initiate multi-agent analysis with grounded retrieval.
                </p>
              </div>
              <button
                onClick={() => setSelectedWorkflow(null)}
                className="text-zinc-400 hover:text-zinc-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-700">
                Operational Query
              </label>
              <textarea
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                rows={4}
                className="w-full text-xs p-3 border border-[#E5E7EB] rounded font-serif focus:outline-none focus:border-zinc-800"
                placeholder="Enter prompt or strategic business query..."
                disabled={isExecuting}
              />

              {execError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded">
                  {execError}
                </div>
              )}

              {execResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded space-y-1">
                  <div className="font-medium">Execution Initiated: {execResult.run_id}</div>
                  <div className="text-[11px] text-emerald-800">Status: {execResult.status}</div>
                  <div className="pt-2">
                    <Link
                      href={`/executions/${execResult.run_id}`}
                      className="text-xs text-zinc-900 underline font-medium"
                    >
                      View Live Execution Detail →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end items-center gap-2 pt-3 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setSelectedWorkflow(null)}
                className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 border border-[#E5E7EB] rounded"
                disabled={isExecuting}
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleRunExecution}
                disabled={isExecuting || !queryInput.trim()}
                className="px-4 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded disabled:opacity-50"
              >
                {isExecuting ? "Executing Workflow..." : "Start Execution"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
