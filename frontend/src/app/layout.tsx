import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STARK — AI Workflow Orchestration Platform",
  description: "Enterprise-grade multi-agent AI workflow orchestration platform.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
