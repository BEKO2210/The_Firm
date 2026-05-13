import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Header } from "@/components/Header";
import { readFirmState } from "@/lib/firmState";

export const metadata: Metadata = {
  title: "Korynth Labs",
  description: "Turning intelligence into systems the world can use.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await readFirmState();
  return (
    <html lang="en">
      <body>
        <Header
          simStatus={{
            firm_day: s.wallclock.firm_day,
            current_sprint: s.wallclock.current_sprint,
            current_quarter: s.wallclock.current_quarter,
            current_year: s.wallclock.current_year,
          }}
        />
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-slate-800 mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 text-sm text-slate-400 flex flex-wrap gap-6 justify-between">
            <div>
              <div>Korynth Labs · Stuttgart / Ludwigsburg · AI-Native SaaS Product Engineering</div>
              <div className="text-xs mt-1 text-slate-500">
                Generated from <code className="text-slate-400">.firm/state.json</code> · audit chain verified
              </div>
            </div>
            <nav aria-label="Footer" className="text-xs flex gap-4">
              <Link href="/transparency">Transparency</Link>
              <Link href="/compliance">Compliance</Link>
              <Link href="/transparency#ai-ethics">AI Ethics</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
