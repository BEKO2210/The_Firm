---
email_id: "EM-2026-05-13T21-30-00Z-payment-received-and-clarification"
thread_id: "TH-TCK-20260513-0001"
direction: "outbound"
from: "Niko Korhonen <niko.korhonen@korynth-labs.internal>"
from_role: "Chief Financial Officer (#049)"
to: "Belkis Aslani <belkis.aslani@gmail.com>"
cc:
  - "Priya Sharma (Account Manager) <priya.sharma@korynth-labs.internal>"
  - "Lina Bergmann (CEO) <lina.bergmann@korynth-labs.internal>"
subject: "✅ Zahlungseingang INV-2026-001 verbucht — Frage zu den 400k (TCK-20260513-0001)"
ticket: "TCK-20260513-0001"
real: "2026-05-13T21:30:00Z"
sim:  "Day 5, 10:00 (Sprint 1 · Q1 2026)"
status: "sent"
priority: "high"
type: "payment-confirmation-and-question"
language: "de"
awaiting_reply: true
---

Hallo Belkis,

vielen Dank für die schnelle Zahlung! Wir haben den **Zahlungseingang zu INV-2026-001 sofort verbucht**:

| | |
|---|---|
| Rechnung | INV-2026-001 |
| Eingegangen | €59.262 brutto (€49.800 netto + €9.462 USt) |
| Buchungs-Sim-Tag | Day 5 (10 Sim-Tage vor Fälligkeit — herzlichen Dank!) |
| Status | ✅ bezahlt |
| Ledger | `seq 3 payment_received +€59.262 cash` · `seq 4 ar_settled -€49.800` |

**Bank-Stand:** €2.290.780 → **€2.350.042**
**AR offen:** €49.800 → **€0**
**USt-Verbindlichkeit (an Finanzamt):** weiterhin €9.462 (wird in nächster USt-Voranmeldung abgeführt)

## ❓ Klarstellung zur Aussage „die 400k bezahl"

Du hast geschrieben: *„und ich hab gerade bezahlt ich gleich die 400k bezahl"*.

Da wir das ernst nehmen und keinen Vorgang ohne Klarheit verbuchen wollen, bitte kurz bestätigen — welche Interpretation stimmt?

### Option A — *Wahrscheinlichste Lesart, wenn du den Plan einhältst*

> „Ich habe gerade M1 bezahlt — die verbleibenden **~€365k** zahle ich nach Plan, Meilenstein-für-Meilenstein."

Restbetrag bis MVP-Release laut SOW-001: **€365.200 netto** verteilt auf M2–M10. Maintenance ab Release: €12.000/Monat. **Das ist der Standardpfad, den wir empfehlen.**

✅ **Vorteile für dich:**
- Sicherheit: kein Geld weg, falls wir liefern, was wir versprochen haben
- Hebel: wir haben kontinuierlich Anreiz, Meilensteine sauber zu liefern
- Cash-Vorteil: dein Geld arbeitet bis zur Fälligkeit
- Entspricht deiner **Bedingung #5** im Email vom 13.05.2026: *„Zahlungen erfolgen nach Meilenstein und sichtbarer Lieferung"*

### Option B — *Du willst tatsächlich vorzeitig die ~€400k anweisen*

> „Ich überweise euch jetzt direkt die ~€400k für den gesamten Premium MVP-Build, statt pro Meilenstein."

⚠️ Bevor wir das verbuchen, müssen wir dich **ausdrücklich darauf hinweisen**, dass das eine Type-1 Critical Decision wäre, die deine eigene Bedingung #5 **bricht**:

- Du verlierst den Meilenstein-basierten Hebel
- Bei Verfehlen eines Meilensteins um > 14 Sim-Tage wäre die im MSA § 8 (4) vereinbarte anteilige Rückerstattung schwerer durchsetzbar (Geld ist schon bei uns)
- Cash-Verlust für dich: dein Geld verzinst nicht mehr
- Steuerlich: USt auf vollen Betrag wird sofort fällig (deutlich höhere USt-Verbindlichkeit)
- Kein Bonus für dich: wir verlangen keinen Skonto auf Vorauszahlung, weil unsere Liquidität bereits ausreicht (Runway 4+ Monate)

**Wir empfehlen Option B nicht.** Selbst wenn du uns 100% vertraust (was wir sehr schätzen), ist das schlechte Treuhandpraxis und untergräbt die Schutzmechanismen, die wir gemeinsam in den Vertrag geschrieben haben.

### Option C — *Du meintest etwas Drittes*

Dann erkläre bitte kurz — wir wollen nichts verbuchen, was unklar ist.

## 📋 Empfohlene Aktion von dir

Antworte einfach kurz mit:

> **„Option A"** = wir machen weiter mit dem Meilenstein-Plan, du zahlst M2 nach Abnahme (Day 27–35).

Oder, falls wirklich Option B:

> **„Option B — ich bestätige Vorauszahlung €365.200 für M2–M10, ich verstehe, dass das meine Bedingung #5 abändert."**

Bei Option B würden wir zusätzlich verlangen:
- Schriftliche Bestätigung (Email reicht)
- Audit-Log-Eintrag als Type-1 Critical Decision mit Human-in-Loop-Approval
- Treuhand-Option prüfen (wir parken das Geld zinslos bei einem Notar, Auszahlung pro Meilenstein — kostet ca. €500/Quartal, wir übernehmen die Kosten)

## 🔒 Was bereits gebucht ist (egal welche Option)

| Eintrag | Status |
|---------|:------:|
| INV-2026-001 €49.800 netto / €59.262 brutto | ✅ bezahlt |
| AR €49.800 | ✅ ausgebucht |
| Cash +€59.262 → Bank €2.350.042 | ✅ verbucht |
| USt €9.462 (an Finanzamt) | wird in nächster Voranmeldung abgeführt |
| Audit-Log seq 37 invoice_paid | ✅ |

## 💚 Persönliche Note

Auch wenn ich dich strenger frage als nötig: deine Zahlungsmoral ist außergewöhnlich. **10 Sim-Tage vor Fälligkeit** ist Top-Spitzenklasse. Wir verzeichnen das in deinem Principal-Profile als „prompt-paying principal" (gut für unsere interne Kunden-Bewertung) und für zukünftige Skonto-Verhandlungen.

Mit besten Grüßen
**Niko Korhonen**
Chief Financial Officer · Korynth Labs (#049)
niko.korhonen@korynth-labs.internal

CC: Priya Sharma (Account Manager), Lina Bergmann (CEO)

---

*Ticket: TCK-20260513-0001 · M1 paid · awaiting clarification on €400k mention*
