import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STARK — AI Workflow Orchestration Platform",
  description: "Enterprise-grade multi-agent AI workflow orchestration platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-zinc-900 font-serif antialiased selection:bg-zinc-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
