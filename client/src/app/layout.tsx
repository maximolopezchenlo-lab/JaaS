import type { Metadata } from "next";
import { EB_Garamond, Inter, Geist } from "next/font/google";
import "./globals.css";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "JaaS | Jurisprudence as a Service",
  description: "Generative Legal Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", garamond.variable, inter.variable, "font-sans", geist.variable)}>
      <body className="h-full bg-black text-[#F3F4F6] relative overflow-x-hidden font-ui">
        
        {/* Invisible Header (Fades in slightly on scroll in reality, but kept absolute minimal here) */}
        <header className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A227]/20 to-transparent border border-[#C9A227]/30 flex items-center justify-center backdrop-blur-md shadow-[0_0_20px_rgba(201,162,39,0.15)]">
              <Scale className="w-5 h-5 text-[#C9A227]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-content font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8ED] to-[#8B8B96]">JaaS</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-medium">Arc Testnet</span>
          </div>
        </header>

        {/* The Fluid Canvas */}
        <main className="relative z-10 min-h-screen flex flex-col">
          {children}
        </main>

      </body>
    </html>
  );
}
