"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getWorkspaceWorkflows, WorkflowSummary } from "@/lib/api";

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkspaceWorkflows("stark-demo").then((data) => {
      setWorkflows(data);
      setLoading(false);
    });
  }, []);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6 font-serif">
        <div className="border-b border-[#E5E7EB] pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-normal text-zinc-900 tracking-tight">Workflows</h1>
            <p className="text-sm text-zinc-500 mt-1">Multi-agent workflow definitions and execution pipelines.</p>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-sm text-zinc-500">Loading workflows...</div>
          ) : workflows.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500">No workflows defined.</div>
          ) : (
            workflows.map((wf) => (
              <div key={wf.id} className="p-6 bg-white border border-[#E5E7EB] rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-zinc-900">{wf.name}</h3>
                    <p className="text-sm text-zinc-600 mt-1">{wf.description}</p>
                  </div>
                  {wf.approval_required && (
                    <span className="text-xs px-2 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      Human Review Gate
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-500">
                  <span className="font-semibold text-zinc-700">Objective:</span> {wf.objective}
                </div>
                <div>
                  <span className="text-xs font-semibold text-zinc-700">Execution Stages:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {wf.agent_sequence?.map((stage, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-700">
                        {idx + 1}. {stage}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
