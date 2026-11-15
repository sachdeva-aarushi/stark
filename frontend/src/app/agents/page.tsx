"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  getWorkspaceAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  AgentSummary,
} from "@/lib/api";

const AGENT_TYPES = [
  { value: "planner", label: "Strategic Planner" },
  { value: "retrieval", label: "Document Retriever" },
  { value: "data_analysis", label: "Data Analyst" },
  { value: "researcher", label: "Research Reasoning" },
  { value: "responder", label: "Executive Responder" },
  { value: "validation", label: "Guardrail Validator" },
];

const AVAILABLE_MODELS = [
  { value: "gpt-4o-mini", label: "GPT-4o Mini (Default)" },
  { value: "gpt-4o", label: "GPT-4o (High Precision)" },
  { value: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet (Reasoning)" },
];

const AVAILABLE_TOOLS = [
  { id: "web_search", label: "Web Search" },
  { id: "code_execution", label: "Code Execution" },
  { id: "document_retrieval", label: "Document Retrieval" },
  { id: "data_analysis", label: "Data Analysis" },
  { id: "api_integration", label: "API Integration" },
];

interface AgentFormData {
  id?: string;
  name: string;
  description: string;
  agent_type: string;
  system_instructions: string;
  model: string;
  temperature: number;
  tools: string[];
  knowledge_access: boolean;
}

const INITIAL_FORM: AgentFormData = {
  name: "",
  description: "",
  agent_type: "planner",
  system_instructions: "",
  model: "gpt-4o-mini",
  temperature: 0.2,
  tools: ["document_retrieval"],
  knowledge_access: true,
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<AgentFormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      const data = await getWorkspaceAgents("stark-demo");
      setAgents(data);
    } catch (err: any) {
      console.error("Failed to load agents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData(INITIAL_FORM);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (agent: AgentSummary) => {
    setIsEditing(true);
    const modelCfg = agent.model_config || {};
    setFormData({
      id: agent.id,
      name: agent.name || "",
      description: agent.description || "",
      agent_type: agent.agent_type || "planner",
      system_instructions: agent.system_instructions || "",
      model: modelCfg.model || "gpt-4o-mini",
      temperature: typeof modelCfg.temperature === "number" ? modelCfg.temperature : 0.2,
      tools: Array.isArray(agent.tools) ? agent.tools : [],
      knowledge_access: modelCfg.knowledge_access !== false,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (agentId: string) => {
    if (!window.confirm("Are you sure you want to delete this agent definition?")) {
      return;
    }
    try {
      await deleteAgent(agentId);
      await fetchAgents();
    } catch (err: any) {
      alert("Failed to delete agent: " + (err.message || "Unknown error"));
    }
  };

  const handleToolToggle = (toolId: string) => {
    setFormData((prev) => {
      const exists = prev.tools.includes(toolId);
      return {
        ...prev,
        tools: exists ? prev.tools.filter((t) => t !== toolId) : [...prev.tools, toolId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Agent name is required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      agent_type: formData.agent_type,
      system_instructions: formData.system_instructions.trim(),
      model_config: {
        model: formData.model,
        temperature: formData.temperature,
        knowledge_access: formData.knowledge_access,
      },
      tools: formData.tools,
    };

    try {
      if (isEditing && formData.id) {
        await updateAgent(formData.id, payload);
      } else {
        await createAgent("stark-demo", payload);
      }
      setIsModalOpen(false);
      await fetchAgents();
    } catch (err: any) {
      setError(err.message || "Failed to save agent definition.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6 font-serif">
        {/* Header */}
        <div className="border-b border-[#E5E7EB] pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-normal text-zinc-900 tracking-tight">Agent Registry</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Configure autonomous AI specialists and capability boundaries.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-mono rounded tracking-wider uppercase transition-colors"
          >
            + New Agent
          </button>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 p-12 text-center text-sm text-zinc-500 bg-white border border-[#E5E7EB] rounded-lg">
              Loading agent registry...
            </div>
          ) : agents.length === 0 ? (
            <div className="col-span-2 p-12 text-center text-sm text-zinc-500 bg-white border border-[#E5E7EB] rounded-lg">
              No agents configured. Click &quot;+ New Agent&quot; to define an AI specialist.
            </div>
          ) : (
            agents.map((agent) => {
              const modelCfg = agent.model_config || {};
              const modelName = modelCfg.model || "gpt-4o-mini";
              const temp = typeof modelCfg.temperature === "number" ? modelCfg.temperature : 0.2;
              const hasKnowledge = modelCfg.knowledge_access !== false;

              return (
                <div
                  key={agent.id}
                  className="p-5 bg-white border border-[#E5E7EB] rounded-lg flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-medium text-zinc-900">{agent.name}</h3>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                          {agent.agent_type}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-zinc-600">
                        {modelName} (t={temp})
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed min-h-[32px]">
                      {agent.description || "No description provided."}
                    </p>

                    {/* Metadata & Tools */}
                    <div className="pt-2 border-t border-[#E5E7EB] space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Knowledge Base Access:</span>
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                            hasKnowledge
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-zinc-50 text-zinc-500 border-zinc-200"
                          }`}
                        >
                          {hasKnowledge ? "Enabled" : "Disabled"}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                          Permitted Tools:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {agent.tools && agent.tools.length > 0 ? (
                            agent.tools.map((tool, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-700"
                              >
                                {tool}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-zinc-400 italic">None specified</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#E5E7EB] flex justify-end items-center gap-2">
                    <button
                      onClick={() => openEditModal(agent)}
                      className="px-2.5 py-1 text-xs border border-zinc-200 rounded text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      Configure
                    </button>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="px-2.5 py-1 text-xs border border-zinc-200 rounded text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal: Create / Edit Agent */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white border border-[#E5E7EB] rounded-lg max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto font-serif">
              <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
                <h2 className="text-lg font-medium text-zinc-900">
                  {isEditing ? "Configure Agent" : "Create New Agent"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600 text-sm font-mono"
                >
                  ✕
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Name */}
                <div>
                  <label className="block text-zinc-700 font-medium mb-1">Agent Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Quantitative Risk Auditor"
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
                    placeholder="Summarize the core analytical role and boundary of this agent."
                    className="w-full px-3 py-2 border border-zinc-300 rounded text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                {/* Agent Type */}
                <div>
                  <label className="block text-zinc-700 font-medium mb-1">Agent Type</label>
                  <select
                    value={formData.agent_type}
                    onChange={(e) => setFormData({ ...formData, agent_type: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded text-zinc-900 bg-white focus:outline-none focus:border-zinc-900"
                  >
                    {AGENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label} ({t.value})
                      </option>
                    ))}
                  </select>
                </div>

                {/* System Instructions */}
                <div>
                  <label className="block text-zinc-700 font-medium mb-1">
                    System Instructions (Prompt)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.system_instructions}
                    onChange={(e) =>
                      setFormData({ ...formData, system_instructions: e.target.value })
                    }
                    placeholder="Direct instructions specifying formatting, constraints, and analytical protocols."
                    className="w-full px-3 py-2 border border-zinc-300 rounded text-zinc-900 font-mono text-[11px] focus:outline-none focus:border-zinc-900"
                  />
                </div>

                {/* Model Configuration */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded space-y-3">
                  <span className="font-semibold text-zinc-800 uppercase tracking-wider text-[10px]">
                    Supported Model Configuration
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-600 mb-1">Model Architecture</label>
                      <select
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-zinc-300 rounded text-zinc-900 bg-white"
                      >
                        {AVAILABLE_MODELS.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-zinc-600">Temperature</label>
                        <span className="font-mono text-zinc-700">{formData.temperature}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={formData.temperature}
                        onChange={(e) =>
                          setFormData({ ...formData, temperature: parseFloat(e.target.value) })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Permitted Tools */}
                <div>
                  <label className="block text-zinc-700 font-medium mb-1">Permitted Tools</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {AVAILABLE_TOOLS.map((tool) => (
                      <label
                        key={tool.id}
                        className="flex items-center gap-2 p-2 border border-zinc-200 rounded cursor-pointer hover:bg-zinc-50"
                      >
                        <input
                          type="checkbox"
                          checked={formData.tools.includes(tool.id)}
                          onChange={() => handleToolToggle(tool.id)}
                          className="rounded border-zinc-300"
                        />
                        <span className="text-zinc-700">{tool.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Knowledge Access Toggle */}
                <div className="flex items-center justify-between p-3 border border-zinc-200 rounded">
                  <div>
                    <span className="font-medium text-zinc-800 block">Knowledge Base Access</span>
                    <span className="text-[11px] text-zinc-500">
                      Enable semantic retrieval over indexed workspace documents.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.knowledge_access}
                    onChange={(e) =>
                      setFormData({ ...formData, knowledge_access: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                </div>

                {/* Modal Buttons */}
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
                    {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Agent"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
