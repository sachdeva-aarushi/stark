"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { setStoredUser, useAuth } from "@/lib/auth";
import { StarkLogo } from "@/components/common/StarkLogo";

export default function LoginPage() {
  const router = useRouter();
  useAuth(false); // If already logged in, redirects to /dashboard

  const [email, setEmail] = useState("demo@stark.ai");
  const [password, setPassword] = useState("stark-demo-2026");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please provide an email and password.");
      return;
    }

    setIsSubmitting(true);

    // Mock authentication: bypasses Supabase Auth, grants session immediately
    setTimeout(() => {
      setStoredUser({
        email: email.trim(),
        name: "Enterprise Operator",
        role: "Workflow Administrator",
        workspace: "STARK Demo Workspace",
        token: "mock-jwt-token-stark-2026",
      });
      router.replace("/dashboard");
    }, 250);
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-between py-12 px-6 font-serif">
      {/* Top Header */}
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center text-xs tracking-wider uppercase text-zinc-500">
        <div className="flex items-center gap-2.5">
          <StarkLogo size={24} className="w-6 h-6" />
          <span className="font-semibold text-zinc-900 tracking-widest">STARK</span>
        </div>
        <span>Enterprise AI Orchestration</span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-8 shadow-sm">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-normal text-zinc-900 tracking-tight">
              Sign In
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Enter your credentials to access the STARK demo workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-wider text-zinc-600 mb-1"
              >
                Work Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@enterprise.com"
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded bg-white text-zinc-900 focus:outline-none focus:border-zinc-800 transition-colors"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs uppercase tracking-wider text-zinc-600 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded bg-white text-zinc-900 focus:outline-none focus:border-zinc-800 transition-colors"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Authenticating..." : "Enter Demo Dashboard"}
              </button>
            </div>
          </form>

          {/* Demo helper */}
          <div className="mt-6 pt-5 border-t border-[#E5E7EB] text-xs text-zinc-500 space-y-1">
            <div className="text-zinc-700 font-medium">Demo Mode Active</div>
            <p>
              Pre-filled with default operator credentials. Real authentication and Supabase Auth are intentionally omitted in this demonstration build.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center text-xs text-zinc-400">
        <span>STARK AI Workflow Platform &copy; 2026</span>
        <span>Version 0.1.0-mvp</span>
      </div>
    </div>
  );
}
