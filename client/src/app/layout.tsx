import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "JaaS | Jurisprudence as a Service",
  description: "Institutional-grade legal orchestration platform secured by Arc Testnet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {/* Navigation Header */}
        <header className="glass sticky top-0 z-50 px-8 py-4 flex items-center justify-between border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[var(--accent)] flex items-center justify-center font-bold text-black">
              J
            </div>
            <span className="text-xl font-semibold tracking-tight text-[var(--accent)]">
              JaaS <span className="text-white/40 font-light ml-1">Legal</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-[var(--text-secondary)]">
            <a href="#" className="hover:text-[var(--accent)] transition-colors">Orchestrator</a>
            <a href="#" className="hover:text-[var(--accent)] transition-colors">Archive</a>
            <a href="#" className="hover:text-[var(--accent)] transition-colors">Arc Protocol</a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-tighter">Arc Testnet</p>
              <p className="text-xs font-mono text-[var(--accent)]">0x...f83A</p>
            </div>
            <button className="px-4 py-2 rounded border border-[var(--accent)] text-[var(--accent)] text-xs hover:bg-[var(--accent)] hover:text-black transition-all">
              Connect Wallet
            </button>
          </div>
        </header>

        {children}

        {/* Footer */}
        <footer className="p-8 border-t border-[var(--border)] mt-auto bg-black/40">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--text-dim)]">
              © 2026 JaaS Protocol. Built for Advanced Agentic Coding.
            </p>
            <div className="flex gap-6 text-[var(--text-dim)] text-xs uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">API Docs</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Arc Explorer</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
