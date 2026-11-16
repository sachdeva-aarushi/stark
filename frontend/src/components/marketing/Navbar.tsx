"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Problem", href: "#problem" },
    { label: "Orchestration", href: "#orchestration" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Why STARK", href: "#why-stark" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-border shadow-[0_2px_12px_rgba(0,0,0,0.03)] py-3.5"
          : "bg-transparent border-b border-border-subtle py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand identity */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 rounded border border-zinc-900 flex items-center justify-center bg-zinc-950 text-white font-mono text-xs font-semibold tracking-wider shadow-sm transition-transform group-hover:scale-105">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-tight text-zinc-950 leading-none">
              STARK
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 font-medium">
              Enterprise Orchestration
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-sans tracking-wide uppercase text-zinc-600 hover:text-zinc-950 transition-colors font-medium relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-zinc-950 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center space-x-3">
          <Link
            href="/login"
            className="text-xs font-sans tracking-wide uppercase px-3.5 py-2 text-zinc-600 hover:text-zinc-950 transition-colors font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="group flex items-center space-x-2 text-xs font-sans tracking-wide uppercase px-4 py-2.5 bg-zinc-950 text-white rounded hover:bg-zinc-800 transition-all shadow-sm font-medium"
          >
            <span>Launch Platform</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-zinc-700 hover:text-zinc-950"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-border bg-white px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-sans tracking-wide uppercase text-zinc-700 hover:text-zinc-950 py-1"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-border flex flex-col space-y-3">
            <Link
              href="/login"
              className="text-xs font-sans tracking-wide uppercase text-zinc-700 text-center py-2"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-center space-x-2 text-xs font-sans tracking-wide uppercase px-4 py-3 bg-zinc-950 text-white rounded text-center"
            >
              <span>Launch Platform</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
