"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Direkt",
    items: [
      { href: "/", label: "Home" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/email", label: "Email" },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/team", label: "Team" },
      { href: "/finance", label: "Finance" },
      { href: "/hr", label: "HR" },
      { href: "/okrs", label: "OKRs" },
      { href: "/incidents", label: "Incidents" },
    ],
  },
  {
    label: "Compliance & Customer",
    items: [
      { href: "/compliance", label: "Compliance" },
      { href: "/customer", label: "Customer" },
    ],
  },
  {
    label: "Outward",
    items: [
      { href: "/acquisition", label: "Acquisition" },
      { href: "/knowledge", label: "Knowledge" },
      { href: "/cases", label: "Cases" },
      { href: "/transparency", label: "Transparency" },
    ],
  },
];

const PRIMARY_HREFS = new Set<string>(["/", "/dashboard", "/email", "/team", "/finance"]);

export interface SimStatus {
  firm_day: number;
  current_sprint: number;
  current_quarter: string;
  current_year: number;
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "px-2.5 py-1.5 rounded-md text-sm transition-colors",
        active
          ? "bg-slate-800 text-white"
          : "text-slate-300 hover:text-white hover:bg-slate-800/70",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export function Header({ simStatus }: { simStatus: SimStatus }) {
  const pathname = usePathname() || "/";
  // Match exact path for "/" but prefix-match for other routes.
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const primaryLinks = NAV_GROUPS.flatMap((g) => g.items).filter((i) =>
    PRIMARY_HREFS.has(i.href)
  );

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.7)]" />
          <span className="text-white font-semibold tracking-tight whitespace-nowrap">
            Korynth Labs
          </span>
        </Link>

        {/* Desktop primary nav — visible md+ */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-0.5 ml-2"
        >
          {primaryLinks.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              active={isActive(item.href)}
            />
          ))}

          {/* Desktop "More" dropdown — CSS-only via <details> */}
          <details className="relative group">
            <summary className="cursor-pointer list-none px-2.5 py-1.5 rounded-md text-sm text-slate-300 hover:text-white hover:bg-slate-800/70 select-none flex items-center gap-1">
              Mehr
              <span aria-hidden="true" className="text-slate-500 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div
              role="menu"
              aria-label="More navigation"
              className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl shadow-black/40 p-3 grid gap-3"
            >
              {NAV_GROUPS.filter((g) =>
                g.items.some((i) => !PRIMARY_HREFS.has(i.href))
              ).map((group) => {
                const items = group.items.filter(
                  (i) => !PRIMARY_HREFS.has(i.href)
                );
                if (items.length === 0) return null;
                return (
                  <div key={group.label}>
                    <div className="text-[0.6875rem] uppercase tracking-wider text-slate-500 font-semibold mb-1 px-2">
                      {group.label}
                    </div>
                    <div className="flex flex-col">
                      {items.map((item) => (
                        <NavLink
                          key={item.href}
                          href={item.href}
                          label={item.label}
                          active={isActive(item.href)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </details>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Sim status badge — always visible */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300"
          aria-label={`Simulated day ${simStatus.firm_day}, Sprint ${simStatus.current_sprint}, ${simStatus.current_quarter} ${simStatus.current_year}`}
        >
          <span className="text-slate-500">Day</span>
          <span className="text-white font-semibold tabular-nums">
            {simStatus.firm_day}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">Sprint</span>
          <span className="text-white font-semibold tabular-nums">
            {simStatus.current_sprint}
          </span>
          <span className="text-slate-600 hidden lg:inline">·</span>
          <span className="text-slate-400 hidden lg:inline">
            {simStatus.current_quarter} {simStatus.current_year}
          </span>
        </div>

        {/* Mobile hamburger — visible <md */}
        <details className="md:hidden group relative">
          <summary
            aria-label="Open navigation menu"
            className="cursor-pointer list-none w-11 h-11 rounded-md flex items-center justify-center bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800"
          >
            <span className="sr-only">Menu</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="group-open:hidden"
            >
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="hidden group-open:block"
            >
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </summary>

          {/* Mobile drawer */}
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 left-auto -mr-4 mt-3 w-screen max-w-sm bg-slate-950 border-y border-slate-800 shadow-2xl shadow-black/60 p-4 grid gap-4 max-h-[80vh] overflow-y-auto"
            style={{ right: "-1rem" }}
          >
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="text-[0.6875rem] uppercase tracking-wider text-slate-500 font-semibold mb-2 px-2">
                  {group.label}
                </div>
                <div className="grid gap-0.5">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      active={isActive(item.href)}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="border-t border-slate-800 pt-3 text-xs text-slate-500 px-2 sm:hidden">
              Day {simStatus.firm_day} · Sprint {simStatus.current_sprint} ·{" "}
              {simStatus.current_quarter} {simStatus.current_year}
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
