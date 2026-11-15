"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  getWorkflowRunDetail,
  submitApprovalDecision,
  WorkflowRunDetail,
  WorkflowStepDetail,
} from "@/lib/api";

function formatLatency(ms?: number | null): string {
  if (ms === null || ms === undefined) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatTimestamp(isoString?: string | null): string {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    return `${d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}, ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
  } catch {
    return isoString;
  }
}

function StatusBadge({ status }: { status: string }) {
  const norm = status?.toUpperCase() || "UNKNOWN";
  switch (norm) {
    case "COMPLETED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          Completed
        </span>
      );
    case "WAITING_FOR_APPROVAL":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
          Waiting for Approval
        </span>
      );
    case "RUNNING":
    case "ACTIVE":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
          Running
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200">
          Failed
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
          {status}
        </span>
      );
  }
}

function ValidationBadge({ status, score }: { status?: string | null; score?: number | null }) {
  const norm = status?.toUpperCase() || "UNVERIFIED";
  const scoreDisplay = score !== null && score !== undefined ? `(${(score * 100).toFixed(0)}%)` : "";

  if (norm === "PASS") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
        PASS {scoreDisplay}
      </span>
    );
  }
  if (norm === "RECOVERABLE") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
        RECOVERABLE {scoreDisplay}
      </span>
    );
  }
  if (norm === "FAIL" || norm === "BLOCKED") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200">
        FAIL {scoreDisplay}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
      {status || "NONE"} {scoreDisplay}
    </span>
  );
}

type TabType = "overview" | "steps" | "sources" | "validation" | "approvals";

export default function ExecutionDetailPage({ params }: { params: { id: string } }) {
  const runId = params.id;
  const [run, setRun] = useState<WorkflowRunDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Approval review panel state
  const [feedbackInput, setFeedbackInput] = useState("");
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState<string | null>(null);

  // Step JSON viewer expansion state
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const detail = await getWorkflowRunDetail(runId);
      setRun(detail);
    } catch (err: any) {
      console.error("Error fetching run details:", err);
      setError("Unable to retrieve details for run ID " + runId);
    } finally {
      setLoading(false);
    }
  }, [runId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleDecision = async (decision: "APPROVE" | "REJECT" | "CHANGES_REQUESTED") => {
    try {
      setIsSubmittingApproval(true);
      setApprovalMessage(null);
      const updated = await submitApprovalDecision(runId, decision, feedbackInput, "executive_reviewer");
      setRun(updated);
      setApprovalMessage(`Decision '${decision}' recorded successfully.`);
      setFeedbackInput("");
    } catch (err: any) {
      console.error("Approval submission failed:", err);
      setApprovalMessage("Failed to submit approval: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  if (loading && !run) {
    return (
      <AppShell>
        <div className="max-w-6xl mx-auto py-12 text-center font-serif text-zinc-500">
          Loading workflow execution record from PostgreSQL...
        </div>
      </AppShell>
    );
  }

  if (error || !run) {
    return (
      <AppShell>
        <div className="max-w-6xl mx-auto py-8 space-y-4 font-serif">
          <Link href="/executions" className="text-xs text-zinc-600 hover:text-zinc-900 underline">
            ← Back to Execution Centre
          </Link>
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded">
            {error || "Workflow run not found."}
          </div>
        </div>
      </AppShell>
    );
  }

  const isAwaitingApproval = run.status === "WAITING_FOR_APPROVAL";

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6 font-serif">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/executions" className="hover:text-zinc-900 underline">
              Execution Centre
            </Link>
            <span>/</span>
            <span className="font-mono text-zinc-800">{run.run_id}</span>
          </div>
          <button
            onClick={fetchDetail}
            className="text-xs px-2.5 py-1 text-zinc-600 hover:text-zinc-900 border border-[#E5E7EB] rounded bg-white hover:bg-zinc-50"
          >
            Refresh Data
          </button>
        </div>

        {/* Execution Header Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-mono">
                  Run: {run.run_id}
                </span>
                <StatusBadge status={run.status} />
                <ValidationBadge status={run.validation_status} score={run.validation_score} />
              </div>
              <h1 className="text-xl font-normal text-zinc-900 mt-2 leading-relaxed">
                {run.query}
              </h1>
            </div>

            {run.confidence !== null && run.confidence !== undefined && (
              <div className="text-left md:text-right shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#E5E7EB]">
                <div className="text-[11px] uppercase tracking-wider text-zinc-400">
                  Calibrated Confidence
                </div>
                <div className="text-2xl font-light font-mono text-zinc-900 mt-0.5">
                  {(run.confidence * 100).toFixed(0)}%
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E5E7EB] text-xs">
            <div>
              <div className="text-zinc-400">Total Latency</div>
              <div className="font-mono text-zinc-800 mt-0.5">{formatLatency(run.duration_ms)}</div>
            </div>
            <div>
              <div className="text-zinc-400">Started At</div>
              <div className="text-zinc-800 mt-0.5">{formatTimestamp(run.started_at)}</div>
            </div>
            <div>
              <div className="text-zinc-400">Completed At</div>
              <div className="text-zinc-800 mt-0.5">{formatTimestamp(run.completed_at)}</div>
            </div>
            <div>
              <div className="text-zinc-400">Human Approval</div>
              <div className="text-zinc-800 mt-0.5 font-medium">{run.approval_status || "None Required"}</div>
            </div>
          </div>
        </div>

        {/* Human-in-the-Loop Review Panel (Prominently displayed when WAITING_FOR_APPROVAL) */}
        {isAwaitingApproval && (
          <div className="bg-amber-50/50 border border-amber-300 rounded-lg p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-900">
                  Human-In-The-Loop Approval Gate
                </span>
                <p className="text-xs text-amber-800 mt-1 max-w-2xl">
                  This execution is suspended at a LangGraph checkpoint awaiting executive review. Inspect the draft answer, citations, and validation metrics below before confirming.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-100 text-amber-900 border border-amber-300">
                Action Required
              </span>
            </div>

            {approvalMessage && (
              <div className="p-3 bg-white border border-amber-300 text-xs rounded text-amber-950 font-medium">
                {approvalMessage}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-medium text-amber-950 uppercase tracking-wider">
                Reviewer Instructions / Revision Feedback
              </label>
              <textarea
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                rows={3}
                placeholder="Optional comments for approval or specific refinement instructions if requesting changes..."
                className="w-full text-xs p-3 bg-white border border-amber-300 rounded font-serif text-zinc-900 focus:outline-none focus:border-amber-600"
                disabled={isSubmittingApproval}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleDecision("APPROVE")}
                disabled={isSubmittingApproval}
                className="px-4 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors disabled:opacity-50"
              >
                {isSubmittingApproval ? "Submitting..." : "Approve Execution"}
              </button>

              <button
                type="button"
                onClick={() => handleDecision("CHANGES_REQUESTED")}
                disabled={isSubmittingApproval}
                className="px-4 py-2 text-xs font-medium text-amber-900 bg-amber-100 border border-amber-400 hover:bg-amber-200 rounded transition-colors disabled:opacity-50"
              >
                Request Changes
              </button>

              <button
                type="button"
                onClick={() => handleDecision("REJECT")}
                disabled={isSubmittingApproval}
                className="px-4 py-2 text-xs font-medium text-rose-800 bg-rose-50 border border-rose-300 hover:bg-rose-100 rounded transition-colors disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-[#E5E7EB] flex items-center gap-6 text-xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 font-medium transition-colors ${
              activeTab === "overview"
                ? "border-b-2 border-zinc-900 text-zinc-900"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Executive Answer &amp; Takeaways
          </button>
          <button
            onClick={() => setActiveTab("steps")}
            className={`pb-3 font-medium transition-colors ${
              activeTab === "steps"
                ? "border-b-2 border-zinc-900 text-zinc-900"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Agent Steps Timeline ({run.steps?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("sources")}
            className={`pb-3 font-medium transition-colors ${
              activeTab === "sources"
                ? "border-b-2 border-zinc-900 text-zinc-900"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Retrieved Sources &amp; Citations ({run.sources?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("validation")}
            className={`pb-3 font-medium transition-colors ${
              activeTab === "validation"
                ? "border-b-2 border-zinc-900 text-zinc-900"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Guardrail Validation
          </button>
          <button
            onClick={() => setActiveTab("approvals")}
            className={`pb-3 font-medium transition-colors ${
              activeTab === "approvals"
                ? "border-b-2 border-zinc-900 text-zinc-900"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Approval History ({run.approvals?.length || 0})
          </button>
        </div>

        {/* Tab 1: Executive Answer & Key Takeaways */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 space-y-4">
              <div className="border-b border-[#E5E7EB] pb-3 flex justify-between items-center">
                <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-900">
                  Synthesized Executive Answer
                </h2>
                {run.confidence && (
                  <span className="text-xs font-mono text-zinc-500">
                    Confidence: {(run.confidence * 100).toFixed(0)}%
                  </span>
                )}
              </div>

              {run.answer ? (
                <div className="text-sm text-zinc-800 leading-relaxed font-serif whitespace-pre-wrap">
                  {run.answer}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 italic">
                  {run.status === "RUNNING"
                    ? "Orchestration currently underway; answer pending completion of responder agent."
                    : "No finalized synthesis text recorded."}
                </p>
              )}
            </div>

            {/* Key Takeaways */}
            {run.key_points && run.key_points.length > 0 && (
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 space-y-4">
                <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-900 border-b border-[#E5E7EB] pb-3">
                  Key Executive Takeaways
                </h3>
                <ul className="space-y-2 text-xs text-zinc-700">
                  {run.key_points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="font-mono text-zinc-400 text-[11px] mt-0.5">•</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantitative Data Analysis (if present) */}
            {run.analysis_results && (
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 space-y-3">
                <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-900 border-b border-[#E5E7EB] pb-3">
                  Quantitative Analysis &amp; Data Metrics
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                  {Object.entries(run.analysis_results).map(([key, val]) => (
                    <div key={key} className="p-3 border border-[#E5E7EB] rounded bg-zinc-50/50">
                      <div className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">
                        {key.replace(/_/g, " ")}
                      </div>
                      <div className="text-base font-medium font-mono text-zinc-900 mt-1">
                        {typeof val === "number" ? val.toLocaleString() : String(val)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error alerts if failed */}
            {run.errors && run.errors.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-5 space-y-2">
                <div className="text-xs uppercase font-medium tracking-wider text-rose-800">
                  Recorded Workflow Errors
                </div>
                <ul className="text-xs text-rose-900 space-y-1">
                  {run.errors.map((err, idx) => (
                    <li key={idx} className="font-mono">• {err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Sequential Agent Steps Timeline */}
        {activeTab === "steps" && (
          <div className="space-y-4">
            <div className="text-xs text-zinc-500">
              Deterministic sequence of agents executed under the LangGraph workflow graph.
            </div>

            {(!run.steps || run.steps.length === 0) ? (
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-8 text-center text-xs text-zinc-400">
                No step details recorded for this run.
              </div>
            ) : (
              <div className="space-y-3">
                {run.steps.map((step) => {
                  const isExpanded = !!expandedSteps[step.id];
                  return (
                    <div
                      key={step.id}
                      className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-3 hover:border-zinc-400 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-zinc-100 border border-zinc-300 text-zinc-800 flex items-center justify-center font-mono text-[11px] font-medium">
                            {step.step_order}
                          </span>
                          <div>
                            <span className="font-medium text-sm text-zinc-900">
                              {step.agent_name}
                            </span>
                            <span className="ml-2 font-mono text-[11px] text-zinc-400">
                              {formatLatency(step.duration_ms)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium font-mono uppercase ${
                              step.status === "completed"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : step.status === "running"
                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                : step.status === "failed"
                                ? "bg-rose-50 text-rose-800 border border-rose-200"
                                : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                            }`}
                          >
                            {step.status}
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleStepExpansion(step.id)}
                            className="text-xs font-mono px-2 py-1 text-zinc-600 hover:text-zinc-900 border border-[#E5E7EB] rounded bg-white hover:bg-zinc-50"
                          >
                            {isExpanded ? "Collapse Data" : "Inspect Payload"}
                          </button>
                        </div>
                      </div>

                      {step.error && (
                        <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded font-mono">
                          Error: {step.error}
                        </div>
                      )}

                      {/* Expandable Input / Output JSON Data */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-[#E5E7EB] grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">
                              Agent Input Data
                            </span>
                            <pre className="p-3 bg-zinc-50 border border-[#E5E7EB] rounded text-[11px] font-mono text-zinc-800 overflow-x-auto max-h-60">
                              {step.input_data
                                ? JSON.stringify(step.input_data, null, 2)
                                : "No structured input recorded"}
                            </pre>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">
                              Agent Output Data
                            </span>
                            <pre className="p-3 bg-zinc-50 border border-[#E5E7EB] rounded text-[11px] font-mono text-zinc-800 overflow-x-auto max-h-60">
                              {step.output_data
                                ? JSON.stringify(step.output_data, null, 2)
                                : "No structured output recorded"}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Retrieved Sources & Grounding Citations */}
        {activeTab === "sources" && (
          <div className="space-y-4">
            <div className="text-xs text-zinc-500">
              Verified document snippets retrieved via FAISS/pgvector semantic similarity grounding.
            </div>

            {(!run.sources || run.sources.length === 0) ? (
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-8 text-center text-xs text-zinc-400">
                No citations or grounding documents were referenced for this workflow run.
              </div>
            ) : (
              <div className="space-y-3">
                {run.sources.map((src, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-2 hover:border-zinc-400 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-zinc-500 font-medium">
                          [{idx + 1}]
                        </span>
                        <span className="text-xs font-medium text-zinc-900">
                          {src.filename || "corporate_knowledge_chunk.pdf"}
                        </span>
                        {src.page_number && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 font-mono">
                            Page {src.page_number}
                          </span>
                        )}
                      </div>

                      {src.similarity_score !== undefined && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Similarity: {(src.similarity_score * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-700 leading-relaxed font-serif pt-1">
                      {src.content || src.text || JSON.stringify(src)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Guardrail Validation Results */}
        {activeTab === "validation" && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-900">
                    Guardrail Assessment Summary
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Deterministic checks for schema validity, factual consistency, and hallucination bounds.
                  </p>
                </div>
                <ValidationBadge status={run.validation_status} score={run.validation_score} />
              </div>

              {run.validation ? (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 border border-[#E5E7EB] rounded bg-zinc-50/50 space-y-1">
                      <div className="text-[10px] uppercase font-mono text-zinc-500">Validation Status</div>
                      <div className="text-sm font-medium text-zinc-900 font-mono">
                        {run.validation.status || run.validation_status || "UNKNOWN"}
                      </div>
                    </div>
                    <div className="p-4 border border-[#E5E7EB] rounded bg-zinc-50/50 space-y-1">
                      <div className="text-[10px] uppercase font-mono text-zinc-500">Validation Score</div>
                      <div className="text-sm font-medium text-zinc-900 font-mono">
                        {run.validation.score !== undefined
                          ? `${(run.validation.score * 100).toFixed(1)}%`
                          : "—"}
                      </div>
                    </div>
                  </div>

                  {run.validation.rule_checks && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium uppercase tracking-wider text-zinc-800">
                        Evaluated Rule Checks
                      </div>
                      <div className="border border-[#E5E7EB] rounded divide-y divide-[#E5E7EB]">
                        {Object.entries(run.validation.rule_checks).map(([rule, passed]) => (
                          <div key={rule} className="px-4 py-2.5 flex items-center justify-between text-xs">
                            <span className="font-mono text-zinc-700">{rule}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                                passed
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-rose-50 text-rose-800 border border-rose-200"
                              }`}
                            >
                              {passed ? "PASS" : "FAIL"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {run.validation.details && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium uppercase tracking-wider text-zinc-800">
                        Raw Diagnostics
                      </div>
                      <pre className="p-3 bg-zinc-50 border border-[#E5E7EB] rounded text-[11px] font-mono text-zinc-800 overflow-x-auto">
                        {JSON.stringify(run.validation.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-zinc-400">
                  No guardrail validation output recorded for this run.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Human Approval History & Decisions */}
        {activeTab === "approvals" && (
          <div className="space-y-4">
            <div className="text-xs text-zinc-500">
              Audit log of supervisor decisions, revisions, and human-in-the-loop interventions.
            </div>

            {(!run.approvals || run.approvals.length === 0) ? (
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-8 text-center text-xs text-zinc-400">
                No human review decisions have been logged for this execution.
              </div>
            ) : (
              <div className="space-y-3">
                {run.approvals.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-3 hover:border-zinc-400 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-zinc-500">ID: {app.id.slice(0, 12)}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase ${
                            app.decision === "APPROVE" || app.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : app.decision === "REJECT" || app.status === "REJECTED"
                              ? "bg-rose-50 text-rose-800 border border-rose-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {app.decision || app.status}
                        </span>
                      </div>

                      <div className="text-xs text-zinc-500 font-mono">
                        Cycle #{app.revision_count}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-zinc-400">Requested:</span>
                        <p className="text-zinc-800 mt-0.5">{formatTimestamp(app.requested_at)}</p>
                      </div>
                      <div>
                        <span className="text-zinc-400">Decided:</span>
                        <p className="text-zinc-800 mt-0.5">{formatTimestamp(app.decided_at)}</p>
                      </div>
                      <div>
                        <span className="text-zinc-400">Decided By:</span>
                        <p className="text-zinc-800 mt-0.5 font-mono">{app.decided_by || "—"}</p>
                      </div>
                    </div>

                    {app.feedback && (
                      <div className="p-3 bg-zinc-50 border border-[#E5E7EB] rounded text-xs text-zinc-800 space-y-0.5">
                        <span className="text-[10px] uppercase font-mono text-zinc-500">Reviewer Feedback</span>
                        <p className="italic">{app.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
