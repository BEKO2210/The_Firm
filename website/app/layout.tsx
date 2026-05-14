import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { readState } from "@/lib/firma";

export const metadata: Metadata = {
  title: "Firma OS · Dashboard",
  description: "Lean operating system for a 1-person AI-native software firm",
};

const NAV = [
  { href: "/", label: "Home" },
  { href: "/inbox", label: "Inbox" },
  { href: "/approvals", label: "Approvals" },
  { href: "/tokens", label: "Tokens" },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const state = await readState();
  const firmName = state?.firm?.name || "(unnamed firm)";

  return (
    <html lang="de">
      <body className="min-h-screen">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="font-bold text-lg tracking-tight">
              <span className="text-[var(--color-accent)]">●</span> Firma OS
              <span className="ml-3 text-sm font-normal text-[var(--color-muted)]">{firmName}</span>
            </Link>
            <nav className="flex gap-1 flex-wrap">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--color-surface-2)]">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 py-6 text-sm text-[var(--color-muted)] border-t border-[var(--color-border)] mt-12 flex items-center justify-between">
          <span>© 2026 Belkis Aslani · proprietär · alle Rechte vorbehalten</span>
          {state?.generated_at_real && (
            <span>state.json @ {new Date(state.generated_at_real).toLocaleString("de-DE")}</span>
          )}
        </footer>
      </body>
    </html>
  );
}
