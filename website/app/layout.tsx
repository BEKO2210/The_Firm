import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Korynth Labs",
  description: "Turning intelligence into systems the world can use.",
};

const NAV = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/email", label: "Email" },
  { href: "/team", label: "Team" },
  { href: "/finance", label: "Finance" },
  { href: "/hr", label: "HR" },
  { href: "/okrs", label: "OKRs" },
  { href: "/incidents", label: "Incidents" },
  { href: "/compliance", label: "Compliance" },
  { href: "/customer", label: "Customer" },
  { href: "/acquisition", label: "Acquisition" },
  { href: "/knowledge", label: "Knowledge" },
  { href: "/cases", label: "Cases" },
  { href: "/transparency", label: "Transparency" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800 bg-slate-950/90 sticky top-0 z-50 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#3B82F6]" />
              <span className="text-white font-semibold tracking-tight">Korynth Labs</span>
            </Link>
            <nav className="flex gap-1 text-sm flex-wrap">
              {NAV.map(n => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-slate-800 mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 text-sm text-slate-400 flex flex-wrap gap-6 justify-between">
            <div>
              <div>Korynth Labs · Stuttgart / Ludwigsburg · AI-Native SaaS Product Engineering</div>
              <div className="text-xs mt-1">
                Audit chain · Generated from <code className="text-slate-300">.firm/state.json</code>
              </div>
            </div>
            <div className="text-xs">
              <Link href="/transparency">Transparency</Link> · <Link href="/compliance">Compliance</Link> · <Link href="/transparency#ai-ethics">AI Ethics</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
