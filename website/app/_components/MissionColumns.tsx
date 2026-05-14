// Firma OS · Mission Control · Zone 2 — JETZT / NÄCHSTES / LETZTES
//
// Drei Spalten, das Herz des Dashboards:
//   JETZT     — jüngste Audit-Events (was passiert / passierte gerade)
//   NÄCHSTES  — was Aufmerksamkeit braucht (Approvals, untriagierte Post, Plan)
//   LETZTES   — abgeschlossene Vorgänge
//
// B.2 ist statisch server-side gerendert. B.3 macht JETZT live (SSE).
// Leere Zustände sind bewusst informativ — sie sagen, welche Aktion Inhalt
// erzeugt (ehrlich: eine frisch initialisierte Firma ist eben leer).

import Link from "next/link";
import type { AuditEvent, NextItem, DoneItem } from "@/lib/firma";

// ── Zeitformat: "HH:MM" wenn heute, sonst "DD.MM. HH:MM" ──────────
function shortTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  if (sameDay) return `${hh}:${mm}`;
  const dd = String(d.getDate()).padStart(2, "0");
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mo}. ${hh}:${mm}`;
}

function Column({
  title,
  hint,
  count,
  children,
}: {
  title: string;
  hint: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="card flex flex-col" aria-label={title}>
      <header className="flex items-baseline justify-between gap-2 mb-3">
        <h2 className="font-semibold text-lg">{title}</h2>
        <span className="text-xs text-[var(--color-muted)]">{count}</span>
      </header>
      <p className="text-xs text-[var(--color-muted)] mb-3">{hint}</p>
      <div className="flex-1">{children}</div>
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-[var(--color-muted)] italic">{text}</p>;
}

// ── JETZT ─────────────────────────────────────────────────────────
export function JetztColumn({ events }: { events: AuditEvent[] }) {
  return (
    <Column
      title="JETZT"
      hint="Jüngste Ereignisse aus dem Audit-Log."
      count={events.length}
    >
      {events.length === 0 ? (
        <EmptyState text="Noch keine Events. Sie entstehen bei realen Aktionen — firma init, ein gerendertes Angebot, eine Triage." />
      ) : (
        <ul className="space-y-2.5">
          {events.map((e) => (
            <li key={e.seq} className="text-sm">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium">{e.event}</span>
                <span className="text-xs text-[var(--color-muted)] shrink-0">
                  {shortTime(e.ts)}
                </span>
              </div>
              <div className="text-[var(--color-muted)] text-xs mt-0.5">
                {e.summary} · {e.actor}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Column>
  );
}

// ── NÄCHSTES ──────────────────────────────────────────────────────
export function NaechstesColumn({ items }: { items: NextItem[] }) {
  const urgent = items.filter((i) => i.urgent).length;
  return (
    <Column
      title="NÄCHSTES"
      hint={
        urgent > 0
          ? `${urgent} Vorgang/Vorgänge brauchen eine Entscheidung.`
          : "Was Aufmerksamkeit braucht: Approvals, untriagierte Post, geplante Aufgaben."
      }
      count={items.length}
    >
      {items.length === 0 ? (
        <EmptyState text="Nichts offen — keine wartenden Approvals, keine untriagierte Post, kein geplanter Task." />
      ) : (
        <ul className="space-y-2">
          {items.map((it, i) => {
            const row = (
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium truncate">
                  {it.urgent && (
                    <span className="text-[var(--color-danger)]" aria-hidden>
                      ●{" "}
                    </span>
                  )}
                  {it.label}
                </span>
                <span className="text-xs text-[var(--color-muted)] shrink-0">
                  {it.detail}
                </span>
              </div>
            );
            return (
              <li key={`${it.kind}-${i}`}>
                {it.link ? (
                  <Link
                    href={it.link}
                    className="block hover:bg-[var(--color-surface-2)] rounded px-1.5 py-1 -mx-1.5 transition-colors"
                  >
                    {row}
                  </Link>
                ) : (
                  <div className="px-1.5 py-1">{row}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Column>
  );
}

// ── LETZTES ───────────────────────────────────────────────────────
export function LetztesColumn({ items }: { items: DoneItem[] }) {
  return (
    <Column
      title="LETZTES"
      hint="Abgeschlossene Vorgänge."
      count={items.length}
    >
      {items.length === 0 ? (
        <EmptyState text="Noch nichts abgeschlossen." />
      ) : (
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={`${it.label}-${i}`} className="text-sm">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium truncate">
                  <span className="text-[var(--color-real)]" aria-hidden>
                    ✓{" "}
                  </span>
                  {it.label}
                </span>
                {it.ts && (
                  <span className="text-xs text-[var(--color-muted)] shrink-0">
                    {shortTime(it.ts)}
                  </span>
                )}
              </div>
              {it.detail && (
                <div className="text-[var(--color-muted)] text-xs mt-0.5">
                  {it.detail}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Column>
  );
}
