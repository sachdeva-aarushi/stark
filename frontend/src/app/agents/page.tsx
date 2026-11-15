"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getWorkspaceAgents, AgentSummary } from "@/lib/api";

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkspaceAgents("stark-demo").then((data) => {
      setAgents(data);
      setLoading(false);
    });
  }, []);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6 font-serif">
        <div className="border-b border-[#E5E7EB] pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-normal text-zinc-900 tracking-tight">Agent Registry</h1>
            <p className="text-sm text-zinc-500 mt-1">Specialized autonomous agents participating in multi-agent workflows.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 p-8 text-center text-sm text-zinc-500">Loading agents...</div>
          ) : (
            agents.map((agent) => (
              <div key={agent.id} className="p-5 bg-white border border-[#E5E7EB] rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-medium text-zinc-900">{agent.name}</h3>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">{agent.agent_type}</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">{agent.description}</p>
                {agent.tools && agent.tools.length > 0 && (
                  <div className="pt-2 border-t border-[#E5E7EB]">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Permitted Tools:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {agent.tools.map((tool, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-700">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
