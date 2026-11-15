"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  getWorkflowRuns,
  WorkflowRunSummary,
  WorkflowRunListResponse,
} from "@/lib/api";

type FilterTab = "ALL" | "COMPLETED" | "ACTIVE" | "WAITING_FOR_APPROVAL" | "FAILED";

function formatLatency(ms?: number | null): string {
  if (ms === null || ms === undefined) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatTimestamp(isoString?: string | null): string {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    return `${d.toLocaleDateString([], { month: "short", day: "numeric" })}, ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
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
          Waiting for Approval
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
    return <span className="text-[11px] text-amber-700 font-medium">Pending Review</span>;
  }
  if (norm === "CHANGES_REQUESTED") {
    return <span className="text-[11px] text-orange-700 font-medium">Revision Requested</span>;
  }
  if (norm === "REJECTED") {
    return <span className="text-[11px] text-rose-700 font-medium">Rejected</span>;
  }
  return <span className="text-[11px] text-zinc-600">{approval}</span>;
}

export default function ExecutionsPage() {
  const [runs, setRuns] = useState<WorkflowRunSummary[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRuns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res: WorkflowRunListResponse = await getWorkflowRuns(
        page,
        pageSize,
        activeTab === "ALL" ? undefined : activeTab,
        searchQuery
      );
      setRuns(res.items);
      setTotal(res.total);
    } catch (err: any) {
      console.error("Error fetching execution runs:", err);
      setError("Failed to retrieve executions from PostgreSQL. Displaying cached records.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, activeTab, searchQuery]);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6 font-serif">
        {/* Header */}
        <div className="border-b border-[#E5E7EB] pb-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-normal text-zinc-900 tracking-tight">
                Execution Centre &amp; History
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                Comprehensive audit trail, latency tracking, and execution history across multi-agent workflows.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/approvals"
                className="px-3.5 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-[#E5E7EB] hover:bg-zinc-50 rounded transition-colors"
              >
                Approvals Queue
              </Link>
              <Link
                href="/dashboard"
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded transition-colors"
              >
                Execute New
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded">
            {error}
          </div>
        )}

        {/* Filters and Search Bar Bar */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {(
                [
                  { key: "ALL", label: "All Executions" },
                  { key: "COMPLETED", label: "Completed" },
                  { key: "ACTIVE", label: "Active" },
                  { key: "WAITING_FOR_APPROVAL", label: "Waiting for Approval" },
                  { key: "FAILED", label: "Failed" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-zinc-900 text-white"
                      : "bg-white text-zinc-600 hover:text-zinc-900 border border-[#E5E7EB] hover:bg-zinc-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search queries or run IDs..."
                className="w-full text-xs px-3 py-1.5 border border-[#E5E7EB] rounded font-serif focus:outline-none focus:border-zinc-800"
              />
            </div>
          </div>
        </div>

        {/* Execution Table */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-serif divide-y divide-[#E5E7EB]">
              <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Run ID</th>
                  <th className="px-5 py-3 font-medium">Query Excerpt</th>
                  <th className="px-5 py-3 font-medium">Current Stage</th>
                  <th className="px-5 py-3 font-medium">Human Review</th>
                  <th className="px-5 py-3 font-medium">Latency</th>
                  <th className="px-5 py-3 font-medium">Started At</th>
                  <th className="px-5 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] bg-white text-zinc-700">
                {runs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-zinc-400">
                      {loading
                        ? "Loading execution records from PostgreSQL..."
                        : "No executions match the selected criteria."}
                    </td>
                  </tr>
                ) : (
                  runs.map((run) => (
                    <tr key={run.run_id} className="hover:bg-zinc-50/75 transition-colors">
                      <td className="px-5 py-3.5">
                        <StatusBadge status={run.status} />
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-zinc-800">
                        <Link
                          href={`/executions/${run.run_id}`}
                          className="hover:underline font-medium text-zinc-900"
                        >
                          {run.run_id.slice(0, 14)}...
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 max-w-sm truncate text-zinc-800" title={run.query}>
                        {run.query}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-block px-2 py-0.5 text-[10px] bg-zinc-100 border border-zinc-200 text-zinc-700 rounded font-mono">
                          {run.current_stage || "completed"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <ApprovalBadge approval={run.approval_status} />
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-zinc-600">
                        {formatLatency(run.duration_ms)}
                      </td>
                      <td className="px-5 py-3.5 text-zinc-500">
                        {formatTimestamp(run.started_at || run.created_at)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/executions/${run.run_id}`}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-zinc-800 bg-white border border-[#E5E7EB] hover:bg-zinc-50 rounded transition-colors"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-5 py-3.5 bg-zinc-50 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-zinc-500">
            <div>
              Showing <span className="font-medium text-zinc-800">{runs.length}</span> of{" "}
              <span className="font-medium text-zinc-800">{total}</span> total runs
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-2.5 py-1 border border-[#E5E7EB] rounded bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-white"
              >
                Previous
              </button>
              <span className="font-mono text-zinc-600">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-2.5 py-1 border border-[#E5E7EB] rounded bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
