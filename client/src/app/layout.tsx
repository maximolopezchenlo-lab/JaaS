import type { Metadata } from "next";
import { EB_Garamond, Lato } from "next/font/google";
import "./globals.css";
import { 
  Shield, 
  Search, 
  Briefcase, 
  Lock, 
  Settings, 
  Layers,
  ExternalLink,
  ChevronRight
} from "lucide-react";

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-body",
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
    <html lang="en" className={`${garamond.variable} ${lato.variable} h-full antialiased`}>
      <body className="h-full flex overflow-hidden bg-[var(--bg)] font-body text-[var(--text-primary)] relative">
        
        {/* Enterprise Sidebar */}
        <aside className="w-20 md:w-64 flex-shrink-0 border-r border-[var(--border)] bg-black/40 backdrop-blur-xl flex flex-col z-50">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[#C5A059] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold tracking-tighter text-white">JaaS</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-bold">Protocol</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <SidebarItem icon={<Search className="w-5 h-5" />} label="Analysis" active />
            <SidebarItem icon={<Briefcase className="w-5 h-5" />} label="Case Vault" />
            <SidebarItem icon={<Layers className="w-5 h-5" />} label="Orchestration" />
            <SidebarItem icon={<Lock className="w-5 h-5" />} label="Protocol" />
          </nav>

          <div className="p-4 mt-auto border-t border-[var(--border)]">
            <SidebarItem icon={<Settings className="w-5 h-5" />} label="Settings" />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          
          {/* Topbar */}
          <header className="h-20 border-b border-[var(--border)] flex items-center justify-between px-8 bg-black/20 backdrop-blur-md z-40">
            <div className="flex items-center gap-2 text-xs text-[var(--text-dim)] uppercase tracking-widest">
              <span>Network</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[var(--accent)] font-bold">Arc Testnet v2.4</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:block text-right">
                <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-tighter">Treasury Wallet</p>
                <p className="text-xs font-mono text-[var(--accent)]">0x9F...f83A</p>
              </div>
              <button className="neo-button px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 group">
                <Lock className="w-4 h-4 text-[var(--accent)] group-hover:text-black transition-colors" />
                Secure Connect
              </button>
            </div>
          </header>

          {/* Dynamic Content */}
          <main className="flex-1 overflow-y-auto custom-scrollbar relative p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>

          {/* Minimal Footer */}
          <footer className="h-10 border-t border-[var(--border)] px-8 flex items-center justify-between text-[10px] text-[var(--text-dim)] uppercase tracking-widest bg-black/40">
            <p>© 2026 Jurisprudence-as-a-Service</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white flex items-center gap-1">Docs <ExternalLink className="w-2 h-2" /></a>
              <a href="#" className="hover:text-white">Status</a>
            </div>
          </footer>
        </div>

      </body>
    </html>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`
      flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group
      ${active ? 'bg-[var(--accent)] text-black shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-white'}
    `}>
      <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="hidden md:block text-sm font-medium tracking-tight whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
