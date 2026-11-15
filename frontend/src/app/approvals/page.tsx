"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  getPendingApprovals,
  submitApprovalDecision,
  PendingApprovalSummary,
} from "@/lib/api";

function formatTimestamp(isoString?: string | null): string {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    return `${d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}, ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  } catch {
    return isoString;
  }
}

export default function ApprovalsPage() {
  const [items, setItems] = useState<PendingApprovalSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Review & Feedback Modal
  const [activeItem, setActiveItem] = useState<PendingApprovalSummary | null>(null);
  const [modalDecision, setModalDecision] = useState<"APPROVE" | "REJECT" | "CHANGES_REQUESTED">("CHANGES_REQUESTED");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      setActionError(null);
      const res = await getPendingApprovals(page, pageSize);
      setItems(res.items);
      setTotal(res.total);
    } catch (err: any) {
      console.error("Error loading pending approvals:", err);
      setActionError("Failed to fetch pending approvals from PostgreSQL.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleQuickDecision = async (
    runId: string,
    decision: "APPROVE" | "REJECT"
  ) => {
    try {
      setIsSubmitting(true);
      setActionError(null);
      await submitApprovalDecision(runId, decision, undefined, "supervisor_reviewer");
      setToastMessage(`Run ${runId} was successfully marked as ${decision}.`);
      await fetchPending();
    } catch (err: any) {
      console.error("Failed to submit quick decision:", err);
      setActionError(`Failed to process ${decision}: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenReviewModal = (item: PendingApprovalSummary, defaultDecision: "APPROVE" | "REJECT" | "CHANGES_REQUESTED" = "CHANGES_REQUESTED") => {
    setActiveItem(item);
    setModalDecision(defaultDecision);
    setFeedbackInput("");
    setActionError(null);
  };

  const handleModalSubmit = async () => {
    if (!activeItem) return;
    try {
      setIsSubmitting(true);
      setActionError(null);
      await submitApprovalDecision(activeItem.run_id, modalDecision, feedbackInput, "supervisor_reviewer");
      setToastMessage(`Decision '${modalDecision}' submitted for run ${activeItem.run_id}.`);
      setActiveItem(null);
      await fetchPending();
    } catch (err: any) {
      console.error("Failed to submit review feedback:", err);
      setActionError(`Failed to submit decision: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6 font-serif">
        {/* Header */}
        <div className="border-b border-[#E5E7EB] pb-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-normal text-zinc-900 tracking-tight">
                  Human Approvals Queue
                </h1>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200">
                  {total} Pending
                </span>
              </div>
              <p className="text-sm text-zinc-500 mt-1">
                Supervisory review queue for LangGraph multi-agent workflows suspended at human checkpoints.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchPending}
                className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 border border-[#E5E7EB] rounded bg-white hover:bg-zinc-50"
              >
                Refresh Queue
              </button>
              <Link
                href="/executions"
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded transition-colors"
              >
                All Executions
              </Link>
            </div>
          </div>
        </div>

        {toastMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded flex items-center justify-between">
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-700 hover:text-emerald-950 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {actionError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded flex items-center justify-between">
            <span>{actionError}</span>
            <button
              onClick={() => setActionError(null)}
              className="text-rose-700 hover:text-rose-950 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Approvals List */}
        {loading ? (
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center text-xs text-zinc-400">
            Scanning PostgreSQL for suspended workflow checkpoints...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center space-y-2">
            <h3 className="text-base font-normal text-zinc-800">No Pending Approvals</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              All workflow runs are either completed or running unimpeded. Any run triggering a human-in-the-loop checkpoint will appear here.
            </p>
            <div className="pt-3">
              <Link
                href="/executions"
                className="text-xs text-zinc-700 hover:text-zinc-900 underline font-medium"
              >
                Browse All Execution History →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.approval_id}
                className="bg-white border border-[#E5E7EB] rounded-lg p-6 space-y-4 hover:border-zinc-400 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-zinc-500">
                        Run ID: {item.run_id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        WAITING_FOR_APPROVAL
                      </span>
                      {item.validation_status && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Validation: {item.validation_status}
                          {item.validation_score !== null && item.validation_score !== undefined
                            ? ` (${(item.validation_score * 100).toFixed(0)}%)`
                            : ""}
                        </span>
                      )}
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-zinc-100 text-zinc-600">
                        Cycle #{item.revision_count}
                      </span>
                    </div>

                    <h2 className="text-base font-normal text-zinc-900 pt-1">
                      {item.query}
                    </h2>

                    <div className="text-xs text-zinc-400 font-serif pt-1">
                      Requested on: {formatTimestamp(item.requested_at)}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#E5E7EB]">
                    <button
                      type="button"
                      onClick={() => handleQuickDecision(item.run_id, "APPROVE")}
                      disabled={isSubmitting}
                      className="px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors disabled:opacity-50"
                    >
                      Quick Approve
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenReviewModal(item, "CHANGES_REQUESTED")}
                      disabled={isSubmitting}
                      className="px-3.5 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-[#E5E7EB] hover:bg-zinc-50 rounded transition-colors disabled:opacity-50"
                    >
                      Review / Feedback
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDecision(item.run_id, "REJECT")}
                      disabled={isSubmitting}
                      className="px-3.5 py-1.5 text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>

                    <Link
                      href={`/executions/${item.run_id}`}
                      className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 underline font-medium"
                    >
                      Inspect Run →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review & Feedback Modal */}
      {activeItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E7EB] rounded-lg max-w-lg w-full p-6 shadow-xl space-y-4 font-serif">
            <div className="flex justify-between items-start border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-base font-normal text-zinc-900">
                  Human Decision &amp; Feedback
                </h3>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  Run ID: {activeItem.run_id}
                </p>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="text-zinc-400 hover:text-zinc-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
                  User Query
                </div>
                <p className="text-xs text-zinc-800 mt-1 italic">
                  &ldquo;{activeItem.query}&rdquo;
                </p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-700 font-medium mb-1.5">
                  Select Decision
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setModalDecision("APPROVE")}
                    className={`px-3 py-2 text-xs rounded font-medium border text-center transition-colors ${
                      modalDecision === "APPROVE"
                        ? "bg-emerald-700 text-white border-emerald-700"
                        : "bg-white text-zinc-700 border-[#E5E7EB] hover:bg-zinc-50"
                    }`}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalDecision("CHANGES_REQUESTED")}
                    className={`px-3 py-2 text-xs rounded font-medium border text-center transition-colors ${
                      modalDecision === "CHANGES_REQUESTED"
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-white text-zinc-700 border-[#E5E7EB] hover:bg-zinc-50"
                    }`}
                  >
                    Request Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalDecision("REJECT")}
                    className={`px-3 py-2 text-xs rounded font-medium border text-center transition-colors ${
                      modalDecision === "REJECT"
                        ? "bg-rose-700 text-white border-rose-700"
                        : "bg-white text-zinc-700 border-[#E5E7EB] hover:bg-zinc-50"
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider text-zinc-700 font-medium">
                  Reviewer Feedback / Revision Notes
                </label>
                <textarea
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  rows={4}
                  placeholder={
                    modalDecision === "CHANGES_REQUESTED"
                      ? "Specify what changes or corrections the agents should make on the next iteration..."
                      : "Optional supervisory remarks..."
                  }
                  className="w-full text-xs p-3 border border-[#E5E7EB] rounded font-serif focus:outline-none focus:border-zinc-800"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#E5E7EB]">
              <Link
                href={`/executions/${activeItem.run_id}`}
                className="text-xs text-zinc-600 hover:text-zinc-900 underline"
              >
                Inspect Run Details →
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 border border-[#E5E7EB] rounded"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleModalSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : `Submit ${modalDecision}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
