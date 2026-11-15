"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function ExecutionsPage() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6 font-serif">
        <div className="border-b border-[#E5E7EB] pb-4">
          <h1 className="text-2xl font-normal text-zinc-900 tracking-tight">Execution Centre</h1>
          <p className="text-sm text-zinc-500 mt-1">Live tracking and historical audit trail for multi-agent workflow executions.</p>
        </div>

        <div className="p-8 bg-white border border-[#E5E7EB] rounded-lg text-center space-y-2">
          <h3 className="text-base font-medium text-zinc-800">Workflow Runs &amp; Audit Trail</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            View wall-clock latency, per-agent step breakdowns, and durable PostgreSQL checkpoint states.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
