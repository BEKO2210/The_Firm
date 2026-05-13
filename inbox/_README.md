# Raw Inbox — Fallback Drop Zone

> Primary communication channel is the **Email Client** at `workspace/communication/inbox/` (UI: dashboard `/email`).
> This folder is a fallback for files that aren't emails — CSVs, PDFs, sketches, screen recordings, datasets.

## Usage

Drop a file here → on next `/firma` run, the Coordinator picks it up at PRE-FLIGHT P6 (per CLAUDE.md §9),
triages it, and either creates a ticket or pings you with a clarifying email.

## What goes where

| Type                | Drop here? | Better channel |
|---------------------|------------|----------------|
| Email-style message | ❌         | `/email` in dashboard |
| Brief / SOW         | ✅ or email| email preferred |
| Data file / sample  | ✅         | here |
| Sketch / image      | ✅         | here |
| Recording           | ✅         | here |
| Confidential doc    | ❌         | encrypt + email |

## What happens after drop

1. File detected on next `/firma`
2. Logged to `logs/inbox.log` with SHA-256 hash + size + dual timestamp
3. Coordinator triages (becomes ticket-attachment if related to existing ticket)
4. You get an acknowledgement email within 1 sim-day
