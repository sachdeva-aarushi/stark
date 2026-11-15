"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  getWorkspaceWorkflows,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  executeWorkflow,
  WorkflowSummary,
  WorkflowExecutionResult,
} from "@/lib/api";

const AGENT_CATALOG: { [key: string]: string } = {
  planner: "Strategic Planner",
  document_retrieval: "Document Retriever",
  retrieval: "Document Retriever",
  data_analysis: "Data Analyst",
  analysis: "Data Analyst",
  researcher: "Research Reasoning",
  research: "Research Reasoning",
  responder: "Executive Responder",
  response: "Executive Responder",
  validation: "Guardrail Validator",
};

const SELECTABLE_AGENTS = [
  { value: "planner", label: "Strategic Planner" },
  { value: "document_retrieval", label: "Document Retriever" },
  { value: "data_analysis", label: "Data Analyst" },
  { value: "researcher", label: "Research Reasoning" },
  { value: "responder", label: "Executive Responder" },
  { value: "validation", label: "Guardrail Validator" },
];

interface WorkflowFormData {
  id?: string;
  name: string;
  description: string;
  objective: string;
  agent_sequence: string[];
  approval_required: boolean;
}

const INITIAL_FORM: WorkflowFormData = {
  name: "",
  description: "",
  objective: "",
  agent_sequence: ["planner", "document_retrieval", "researcher", "responder"],
  approval_required: true,
};

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Create / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<WorkflowFormData>(INITIAL_FORM);
  const [selectedAgentToAdd, setSelectedAgentToAdd] = useState("planner");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Execution modal state
  const [executingWf, setExecutingWf] = useState<WorkflowSummary | null>(null);
  const [execQuery, setExecQuery] = useState("");
  const [executing, setExecuting] = useState(false);
  const [execResult, setExecResult] = useState<WorkflowExecutionResult | null>(null);
  const [execError, setExecError] = useState<string | null>(null);

  const fetchWorkflows = async () => {
    try {
      const data = await getWorkspaceWorkflows("stark-demo");
      setWorkflows(data);
    } catch (err: any) {
      console.error("Failed to load workflows", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  // Modal actions
  const openCreateModal = () => {
    setIsEditing(false);
    setFormData(INITIAL_FORM);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (wf: WorkflowSummary) => {
    setIsEditing(true);
    setFormData({
      id: wf.id,
      name: wf.name || "",
      description: wf.description || "",
      objective: wf.objective || "",
      agent_sequence: wf.agent_sequence && wf.agent_sequence.length > 0
        ? [...wf.agent_sequence]
        : ["planner", "responder"],
      approval_required: wf.approval_required !== false,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (wfId: string) => {
    if (!window.confirm("Are you sure you want to delete this workflow pipeline?")) {
      return;
    }
    try {
      await deleteWorkflow(wfId);
      await fetchWorkflows();
    } catch (err: any) {
      alert("Failed to delete workflow: " + (err.message || "Unknown error"));
    }
  };

  // Reordering & Agent Sequence Handlers
  const handleAddAgentToSequence = () => {
    setFormData((prev) => ({
      ...prev,
      agent_sequence: [...prev.agent_sequence, selectedAgentToAdd],
    }));
  };

  const handleRemoveAgentFromSequence = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      agent_sequence: prev.agent_sequence.filter((_, idx) => idx !== index),
    }));
  };

  const handleMoveAgent = (index: number, direction: "up" | "down") => {
    setFormData((prev) => {
      const seq = [...prev.agent_sequence];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= seq.length) return prev;
      const temp = seq[index];
      seq[index] = seq[targetIndex];
      seq[targetIndex] = temp;
      return { ...prev, agent_sequence: seq };
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Workflow name is required.");
      return;
    }
    if (formData.agent_sequence.length === 0) {
      setFormError("Agent sequence must contain at least one agent.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      objective: formData.objective.trim(),
      agent_sequence: formData.agent_sequence,
      approval_required: formData.approval_required,
    };

    try {
      if (isEditing && formData.id) {
        await updateWorkflow(formData.id, payload);
      } else {
        await createWorkflow("stark-demo", payload);
      }
      setIsModalOpen(false);
      await fetchWorkflows();
    } catch (err: any) {
      setFormError(err.message || "Failed to save workflow definition.");
    } finally {
      setSubmitting(false);
    }
  };

  // Execution Handlers
  const openExecuteModal = (wf: WorkflowSummary) => {
    setExecutingWf(wf);
    setExecQuery("");
    setExecResult(null);
    setExecError(null);
  };

  const handleExecute = async () => {
    if (!executingWf || !execQuery.trim()) return;
    setExecuting(true);
    setExecError(null);
    setExecResult(null);

    try {
      const res = await executeWorkflow(executingWf.id, execQuery.trim());
      setExecResult(res);
    } catch (err: any) {
      setExecError(err.message || "Execution encountered an error.");
    } finally {
      setExecuting(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6 font-serif">
        {/* Header */}
        <div className="border-b border-[#E5E7EB] pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-normal text-zinc-900 tracking-tight">Workflow Studio</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Design, configure, and orchestrate multi-agent execution pipelines.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-mono rounded tracking-wider uppercase transition-colors"
          >
            + New Workflow
          </button>
        </div>

        {/* Workflow List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-sm text-zinc-500 bg-white border border-[#E5E7EB] rounded-lg">
              Loading workflow pipelines...
            </div>
          ) : workflows.length === 0 ? (
            <div className="p-12 text-center text-sm text-zinc-500 bg-white border border-[#E5E7EB] rounded-lg">
              No workflows defined. Click &quot;+ New Workflow&quot; to design a multi-agent pipeline.
            </div>
          ) : (
            workflows.map((wf) => (
              <div
                key={wf.id}
                className="p-6 bg-white border border-[#E5E7EB] rounded-lg space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-medium text-zinc-900">{wf.name}</h3>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      {wf.description || "No description provided."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {wf.approval_required ? (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        Human Review Gate
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-50 text-zinc-600 border border-zinc-200">
                        Direct Execution
                      </span>
                    )}
                  </div>
                </div>

                {wf.objective && (
                  <div className="text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded border border-zinc-200">
                    <span className="font-semibold text-zinc-800 block mb-0.5">Objective:</span>
                    {wf.objective}
                  </div>
                )}

                {/* Sequence Pills */}
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                    Configured Agent Sequence:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {wf.agent_sequence?.map((stage, idx) => {
                      const agentLabel = AGENT_CATALOG[stage] || stage;
                      return (
                        <React.Fragment key={idx}>
                          <span className="text-[11px] font-mono px-2 py-1 bg-white border border-zinc-300 rounded text-zinc-800 shadow-sm">
                            <span className="text-zinc-400 mr-1">{idx + 1}.</span>
                            {agentLabel}
                          </span>
                          {idx < (wf.agent_sequence?.length || 0) - 1 && (
                            <span className="text-zinc-400 text-xs">→</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-center">
                  <span className="text-[10px] font-mono text-zinc-400">
                    ID: {wf.id.slice(0, 8)}...
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openExecuteModal(wf)}
                      className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-zinc-900 text-white rounded hover:bg-zinc-800 transition-colors"
                    >
                      ▶ Execute
                    </button>
                    <button
                      onClick={() => openEditModal(wf)}
                      className="px-3 py-1.5 text-xs border border-zinc-200 rounded text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(wf.id)}
                      className="px-3 py-1.5 text-xs border border-zinc-200 rounded text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal: Create / Edit Workflow */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white border border-[#E5E7EB] rounded-lg max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto font-serif">
              <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
                <h2 className="text-lg font-medium text-zinc-900">
                  {isEditing ? "Configure Workflow Pipeline" : "Create New Workflow"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600 text-sm font-mono"
                >
                  ✕
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                  {formError}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                {/* Name */}
                <div>
                  <label className="block text-zinc-700 font-medium mb-1">Workflow Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Strategic Risk & Analysis Pipeline"
                    className="w-full px-3 py-2 border border-zinc-300 rounded text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-zinc-700 font-medium mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what business operation this workflow automates."
                    className="w-full px-3 py-2 border border-zinc-300 rounded text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                {/* Objective */}
                <div>
                  <label className="block text-zinc-700 font-medium mb-1">Objective</label>
                  <textarea
                    rows={2}
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    placeholder="High-level goal passed to orchestrating agents."
                    className="w-full px-3 py-2 border border-zinc-300 rounded text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                {/* Sequential Agent Order Picker */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-zinc-800 uppercase tracking-wider text-[10px]">
                      Sequential Agent Order ({formData.agent_sequence.length} stages)
                    </span>
                  </div>

                  {/* Add Agent control */}
                  <div className="flex gap-2">
                    <select
                      value={selectedAgentToAdd}
                      onChange={(e) => setSelectedAgentToAdd(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-zinc-300 rounded text-zinc-900 bg-white"
                    >
                      {SELECTABLE_AGENTS.map((a) => (
                        <option key={a.value} value={a.value}>
                          {a.label} ({a.value})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddAgentToSequence}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded font-mono text-[11px] uppercase tracking-wider"
                    >
                      + Add Stage
                    </button>
                  </div>

                  {/* Selected Stages List */}
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {formData.agent_sequence.map((stage, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-white border border-zinc-200 rounded text-zinc-800"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-zinc-400 text-[11px] w-5">
                            {idx + 1}.
                          </span>
                          <span className="font-medium text-zinc-900">
                            {AGENT_CATALOG[stage] || stage}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">({stage})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveAgent(idx, "up")}
                            className="px-1.5 py-0.5 border border-zinc-200 rounded hover:bg-zinc-100 disabled:opacity-30 text-[11px]"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            disabled={idx === formData.agent_sequence.length - 1}
                            onClick={() => handleMoveAgent(idx, "down")}
                            className="px-1.5 py-0.5 border border-zinc-200 rounded hover:bg-zinc-100 disabled:opacity-30 text-[11px]"
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveAgentFromSequence(idx)}
                            className="px-1.5 py-0.5 border border-zinc-200 rounded text-red-600 hover:bg-red-50 text-[11px]"
                            title="Remove stage"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pipeline Preview */}
                  {formData.agent_sequence.length > 0 && (
                    <div className="pt-2 border-t border-zinc-200 text-[11px] text-zinc-500">
                      <span className="text-zinc-400 font-mono text-[10px] uppercase block mb-1">
                        Execution Pipeline:
                      </span>
                      <div className="font-mono text-zinc-700 bg-white p-2 rounded border border-zinc-200 text-[10px] overflow-x-auto whitespace-nowrap">
                        START → {formData.agent_sequence.join(" → ")}
                        {formData.approval_required ? " → Human Approval" : ""} → END
                      </div>
                    </div>
                  )}
                </div>

                {/* Human Approval Toggle */}
                <div className="flex items-center justify-between p-3 border border-zinc-200 rounded">
                  <div>
                    <span className="font-medium text-zinc-800 block">
                      Human Review Gate Requirement
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Interrupt execution before finalization to await human approval or feedback.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.approval_required}
                    onChange={(e) =>
                      setFormData({ ...formData, approval_required: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-zinc-300 rounded text-zinc-700 hover:bg-zinc-50 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-mono uppercase tracking-wider disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : isEditing ? "Save Pipeline" : "Create Workflow"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Execute Workflow */}
        {executingWf && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white border border-[#E5E7EB] rounded-lg max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto font-serif">
              <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
                <div>
                  <h2 className="text-lg font-medium text-zinc-900">
                    Execute Pipeline: {executingWf.name}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Trigger LangGraph multi-agent execution adhering strictly to configured stages.
                  </p>
                </div>
                <button
                  onClick={() => setExecutingWf(null)}
                  className="text-zinc-400 hover:text-zinc-600 text-sm font-mono"
                >
                  ✕
                </button>
              </div>

              {/* Pipeline summary */}
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded text-xs">
                <span className="font-mono text-[10px] uppercase text-zinc-400 block mb-1">
                  Active Sequence:
                </span>
                <div className="flex flex-wrap items-center gap-1 font-mono text-[11px] text-zinc-800">
                  {executingWf.agent_sequence?.map((stage, idx) => (
                    <React.Fragment key={idx}>
                      <span className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded">
                        {stage}
                      </span>
                      {idx < (executingWf.agent_sequence?.length || 0) - 1 && (
                        <span className="text-zinc-400">→</span>
                      )}
                    </React.Fragment>
                  ))}
                  {executingWf.approval_required && (
                    <>
                      <span className="text-zinc-400">→</span>
                      <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                        approval
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Query Input */}
              <div className="space-y-2">
                <label className="block text-zinc-700 text-xs font-medium">
                  Execution Query / Prompt *
                </label>
                <textarea
                  rows={3}
                  value={execQuery}
                  disabled={executing}
                  onChange={(e) => setExecQuery(e.target.value)}
                  placeholder="e.g. Analyze compliance risks, financial disclosures, and multi-agent governance controls."
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-zinc-900 text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>

              {execError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                  {execError}
                </div>
              )}

              {/* Execution Status / Progress */}
              {executing && (
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-zinc-700 font-mono">
                    Executing multi-agent StateGraph pipeline...
                  </span>
                </div>
              )}

              {/* Execution Results */}
              {execResult && (
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded space-y-3">
                  <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                    <span className="font-semibold text-zinc-900 text-xs">
                      Execution Result:
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Status: {execResult.status}
                    </span>
                  </div>

                  {execResult.run_id && (
                    <div className="text-[11px] font-mono text-zinc-500">
                      Run ID: <span className="text-zinc-800">{execResult.run_id}</span>
                    </div>
                  )}

                  {execResult.answer && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block">
                        Final Answer:
                      </span>
                      <div className="p-3 bg-white border border-zinc-200 rounded text-xs text-zinc-800 whitespace-pre-line leading-relaxed">
                        {execResult.answer}
                      </div>
                    </div>
                  )}

                  {execResult.key_points && execResult.key_points.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block">
                        Key Points:
                      </span>
                      <ul className="list-disc list-inside text-xs text-zinc-700 space-y-0.5">
                        {execResult.key_points.map((kp, idx) => (
                          <li key={idx}>{kp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {typeof execResult.confidence === "number" && (
                    <div className="text-[11px] text-zinc-600">
                      Calibrated Confidence:{" "}
                      <span className="font-mono font-medium text-zinc-900">
                        {(execResult.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setExecutingWf(null)}
                  className="px-4 py-2 border border-zinc-300 rounded text-zinc-700 hover:bg-zinc-50 text-xs"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={executing || !execQuery.trim()}
                  onClick={handleExecute}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-mono uppercase tracking-wider disabled:opacity-50"
                >
                  {executing ? "Running..." : "Run Pipeline"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
