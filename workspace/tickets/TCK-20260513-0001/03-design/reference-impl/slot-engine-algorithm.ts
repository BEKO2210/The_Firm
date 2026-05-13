// Slot-Engine Reference Implementation (Day 6)
// ============================================
// Author: 005 Eilidh MacKenzie (AI Research Lead)
// Status: REFERENCE — pseudocode-grade, will become production code in Sprint 2
// Purpose: validates ADR-005 architecture is implementable in TypeScript
//
// This file is intentionally framework-agnostic. Database calls are typed
// against a generic Drizzle-style interface (no actual DB binding here).
// Real implementation goes into packages/core/slot-engine/ at Build phase.

/* eslint-disable @typescript-eslint/no-explicit-any */

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface SlotRequest {
  tenantId: string;
  serviceOrPackageId: string;
  staffPreference: { kind: 'any' } | { kind: 'specific'; staffId: string };
  rangeStart: Date;
  rangeEnd: Date;
  timezone: string;
}

export interface AvailableSlot {
  staffId: string;
  staffName: string;
  startsAt: Date;
  endsAt: Date;
  durationMin: number;
  score: number; // 0..100
}

export interface ServiceInfo {
  id: string;
  durationMin: number;
  bufferBeforeMin: number;
  bufferAfterMin: number;
  requiredSkills: string[]; // skill IDs
}

export interface StaffInfo {
  id: string;
  name: string;
  active: boolean;
  skills: string[]; // skill IDs
  workingHours: ReadonlyArray<{ weekday: number; start: string; end: string }>; // 'HH:mm'
  breaks: ReadonlyArray<{ weekday: number; start: string; end: string }>;
  timeOff: ReadonlyArray<{ start: Date; end: Date }>;
  calendarBlocks: ReadonlyArray<{ tsStart: Date; tsEnd: Date }>;
}

export interface SalonHours {
  weekday: number; // 0=Mon..6=Sun
  open: string; // 'HH:mm'
  close: string;
}

// ----------------------------------------------------------------------------
// Algorithm
// ----------------------------------------------------------------------------

const SLOT_GRANULARITY_MIN = 5;
const MAX_SLOTS_RETURNED = 20;

export function getAvailableSlots(
  req: SlotRequest,
  service: ServiceInfo,
  eligibleStaff: ReadonlyArray<StaffInfo>,
  salonOpening: ReadonlyArray<SalonHours>,
  holidayDates: ReadonlyArray<Date>,
): AvailableSlot[] {
  // Step 1 — pre-filter staff by skill match
  const skilledStaff = eligibleStaff.filter((s) =>
    s.active && service.requiredSkills.every((sk) => s.skills.includes(sk)),
  );

  // Step 2 — narrow by preference
  const candidates = req.staffPreference.kind === 'specific'
    ? skilledStaff.filter((s) => s.id === req.staffPreference.staffId)
    : skilledStaff;

  if (candidates.length === 0) return [];

  // Step 3 — generate candidate slots
  const slots: AvailableSlot[] = [];
  const totalDuration = service.durationMin + service.bufferBeforeMin + service.bufferAfterMin;

  for (const s of candidates) {
    const windows = computeAvailableWindows(s, salonOpening, holidayDates, req.rangeStart, req.rangeEnd);
    for (const w of windows) {
      let ts = new Date(w.start);
      while (addMinutes(ts, totalDuration).getTime() <= w.end.getTime()) {
        if (!hasConflict(s, ts, totalDuration)) {
          slots.push({
            staffId: s.id,
            staffName: s.name,
            startsAt: new Date(ts),
            endsAt: addMinutes(ts, service.durationMin),
            durationMin: service.durationMin,
            score: scoreSlot(s, ts, candidates.length),
          });
        }
        ts = addMinutes(ts, SLOT_GRANULARITY_MIN);
      }
    }
  }

  // Step 4 — sort by score desc, then earliest first
  return slots
    .sort((a, b) =>
      b.score - a.score || a.startsAt.getTime() - b.startsAt.getTime(),
    )
    .slice(0, MAX_SLOTS_RETURNED);
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function computeAvailableWindows(
  s: StaffInfo,
  salonOpening: ReadonlyArray<SalonHours>,
  holidayDates: ReadonlyArray<Date>,
  rangeStart: Date,
  rangeEnd: Date,
): Array<{ start: Date; end: Date }> {
  const windows: Array<{ start: Date; end: Date }> = [];
  const holidaySet = new Set(holidayDates.map((d) => d.toISOString().slice(0, 10)));

  for (let d = new Date(rangeStart); d.getTime() <= rangeEnd.getTime(); d = addDays(d, 1)) {
    const weekday = (d.getDay() + 6) % 7; // Mon=0..Sun=6
    const dayKey = d.toISOString().slice(0, 10);

    if (holidaySet.has(dayKey)) continue;

    // Salon opening
    const open = salonOpening.find((o) => o.weekday === weekday);
    if (!open) continue;

    // Staff working
    const working = s.workingHours.find((w) => w.weekday === weekday);
    if (!working) continue;

    // Intersect salon ∩ staff working
    const dayStart = combine(d, maxTime(open.open, working.start));
    const dayEnd   = combine(d, minTime(open.close, working.end));
    if (dayStart >= dayEnd) continue;

    // Subtract breaks
    let segments: Array<{ start: Date; end: Date }> = [{ start: dayStart, end: dayEnd }];
    for (const br of s.breaks.filter((b) => b.weekday === weekday)) {
      const brStart = combine(d, br.start);
      const brEnd   = combine(d, br.end);
      segments = segments.flatMap((seg) => subtractRange(seg, brStart, brEnd));
    }

    // Subtract time-off
    for (const off of s.timeOff) {
      segments = segments.flatMap((seg) => subtractRange(seg, off.start, off.end));
    }

    // Subtract existing calendar blocks (bookings/blocks)
    for (const blk of s.calendarBlocks) {
      segments = segments.flatMap((seg) => subtractRange(seg, blk.tsStart, blk.tsEnd));
    }

    windows.push(...segments);
  }

  return windows;
}

function hasConflict(s: StaffInfo, ts: Date, durationMin: number): boolean {
  const endTs = addMinutes(ts, durationMin);
  return s.calendarBlocks.some((b) => b.tsStart < endTs && b.tsEnd > ts);
}

function scoreSlot(staff: StaffInfo, ts: Date, totalEligible: number): number {
  // Load balance: fewer-booked staff scores higher
  const bookingsToday = staff.calendarBlocks.filter(
    (b) => b.tsStart.toDateString() === ts.toDateString(),
  ).length;
  const loadScore = Math.max(0, 100 - bookingsToday * 10);

  // Earliest-first: nearer slots score slightly higher
  const hoursFromNow = (ts.getTime() - Date.now()) / 36e5;
  const recencyScore = Math.max(0, 50 - hoursFromNow / 2);

  // Gap-minimization could be added later
  return loadScore * 0.5 + recencyScore;
}

// ----------------------------------------------------------------------------
// Date utilities (kept inline; in production we'll use date-fns-tz)
// ----------------------------------------------------------------------------

function addMinutes(d: Date, min: number): Date {
  return new Date(d.getTime() + min * 60_000);
}

function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * 86_400_000);
}

function combine(date: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(':').map(Number);
  const result = new Date(date);
  result.setHours(h, m, 0, 0);
  return result;
}

function maxTime(a: string, b: string): string {
  return a > b ? a : b;
}

function minTime(a: string, b: string): string {
  return a < b ? a : b;
}

function subtractRange(
  seg: { start: Date; end: Date },
  cutStart: Date,
  cutEnd: Date,
): Array<{ start: Date; end: Date }> {
  if (cutEnd <= seg.start || cutStart >= seg.end) return [seg];
  if (cutStart <= seg.start && cutEnd >= seg.end) return [];
  if (cutStart > seg.start && cutEnd < seg.end) {
    return [
      { start: seg.start, end: cutStart },
      { start: cutEnd, end: seg.end },
    ];
  }
  if (cutStart <= seg.start) return [{ start: cutEnd, end: seg.end }];
  return [{ start: seg.start, end: cutStart }];
}

// ----------------------------------------------------------------------------
// Tests are in __tests__/algorithm.test.ts (50+ cases) and property.test.ts
// (1000 fast-check runs). This file is the reference implementation
// validating that ADR-005 is buildable.
// ----------------------------------------------------------------------------
