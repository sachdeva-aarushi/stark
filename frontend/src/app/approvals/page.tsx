"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function ApprovalsPage() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6 font-serif">
        <div className="border-b border-[#E5E7EB] pb-4">
          <h1 className="text-2xl font-normal text-zinc-900 tracking-tight">Pending Approvals</h1>
          <p className="text-sm text-zinc-500 mt-1">Human-in-the-loop review queue for gated workflow decisions.</p>
        </div>

        <div className="p-8 bg-white border border-[#E5E7EB] rounded-lg text-center space-y-2">
          <h3 className="text-base font-medium text-zinc-800">Human Approval Gate</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Workflows suspended via LangGraph interrupt() await review, revision feedback, or approval here.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
