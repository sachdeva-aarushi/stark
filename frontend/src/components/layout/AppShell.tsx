"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { StarkLogo } from "@/components/common/StarkLogo";

interface NavItem {
  name: string;
  href: string;
  icon: (props: { className?: string }) => JSX.Element;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: ({ className }) => (
      <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
  {
    name: "Workflows",
    href: "/workflows",
    icon: ({ className }) => (
      <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <path d="M6 9v3a3 3 0 0 0 3 3h6" />
        <path d="M18 15v-3a3 3 0 0 0-3-3" />
      </svg>
    ),
  },
  {
    name: "Agents",
    href: "/agents",
    icon: ({ className }) => (
      <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="14" x2="4" y2="14" />
      </svg>
    ),
  },
  {
    name: "Knowledge Base",
    href: "/knowledge",
    icon: ({ className }) => (
      <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    name: "Executions",
    href: "/executions",
    icon: ({ className }) => (
      <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    name: "Approvals",
    href: "/approvals",
    icon: ({ className }) => (
      <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth(true);

  return (
    <div className="flex h-screen w-full bg-white font-serif antialiased text-zinc-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#E5E7EB] bg-white flex flex-col justify-between select-none">
        <div>
          {/* Platform Identity */}
          <div className="h-16 px-6 flex items-center space-x-3 border-b border-[#E5E7EB]">
            <StarkLogo size={32} className="w-8 h-8" />
            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-2">
                <span className="font-serif tracking-tight text-xl font-bold text-zinc-950 leading-none">
                  STARK
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 border border-[#E5E7EB] rounded text-zinc-500 uppercase">
                  v0.1
                </span>
              </div>
              <span className="font-sans text-[11px] text-zinc-500 tracking-wider uppercase mt-0.5">
                AI Orchestration
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm rounded transition-colors ${
                    isActive
                      ? "bg-zinc-100 text-zinc-950 font-semibold border border-[#E5E7EB]"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 font-normal"
                  }`}
                >
                  <Icon className={`mr-3 ${isActive ? "text-zinc-950" : "text-zinc-400"}`} />
                  <span className="font-serif tracking-normal">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-white">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-xs font-medium text-zinc-900 truncate">
                {user?.email || "demo@stark.ai"}
              </p>
              <p className="font-sans text-[11px] text-zinc-500">
                Enterprise Admin
              </p>
            </div>
            <button
              onClick={signOut}
              title="Sign Out"
              className="text-xs font-sans text-zinc-500 hover:text-zinc-900 p-1.5 rounded hover:bg-zinc-100 border border-transparent hover:border-[#E5E7EB] transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Execution Surface */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#E5E7EB] bg-white px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <div>
              <span className="font-sans text-[10px] tracking-widest text-zinc-400 uppercase block font-semibold">
                CURRENT WORKSPACE
              </span>
              <h1 className="font-serif text-base font-semibold text-zinc-950">
                STARK Demo Workspace
              </h1>
            </div>
            <span className="font-sans text-[11px] px-2 py-0.5 rounded border border-[#E5E7EB] text-zinc-600 bg-zinc-50 font-medium">
              Enterprise Sandbox
            </span>
          </div>

          <div className="flex items-center space-x-6">
            {/* Supabase / Online Status Indicator */}
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="font-sans text-xs text-zinc-600 font-medium">
                Online / Supabase Connected
              </span>
            </div>

            <div className="h-4 w-[1px] bg-[#E5E7EB]" />

            <div className="font-sans text-xs text-zinc-500">
              Region: <span className="text-zinc-800 font-medium">us-east-1</span>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto bg-white p-8 md:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
