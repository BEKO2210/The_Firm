---
document: "Sicherheits- und Test-Konzept"
ticket: "TCK-20260513-0001"
parent: "MSA"
version: "1.0 — Draft"
status: "DRAFT"
language: "de"
---

# Sicherheits- und Test-Konzept · Premium MVP

Anlage 6 zum MSA · TCK-20260513-0001

---

## 1. Sicherheits-Grundprinzipien

| Prinzip | Umsetzung |
|---------|-----------|
| **Defense in Depth** | Mehrere Sicherheits-Layer: Edge (Vercel/Cloudflare), App (Validierung, Rate Limiting), DB (RLS, Constraints) |
| **Least Privilege** | Rollenbasiert, Need-to-Know, RLS, eindeutige Service-Accounts |
| **Zero-Trust** | Jeder Request authentifiziert + autorisiert, keine impliziten Vertrauensbeziehungen |
| **Secure by Default** | Sichere Default-Konfiguration, opt-in für riskante Features |
| **Audit by Default** | Alle Schreiboperationen geloggt, Hash-Chain wo erforderlich |
| **Fail Closed** | Bei Fehlern Zugriff verweigern, nicht erlauben |

## 2. Authentifizierung & Autorisierung

### 2.1 Auth-Flow

- **Email + Passwort** (Argon2id-Hash, min. 12 Zeichen, kompromittierte Passwörter geblockt via HIBP-API)
- **JWT-basierte Sessions** mit Access-Token (15 min) + Refresh-Token (30 Tage)
- **Magic-Link** für Gastbuchungs-Stornos (signiert, 7 Tage gültig)
- **Optional 2FA** (TOTP) für Salon-Owner und Mitarbeiter (Phase 2: Pflicht für Super-Admin)

### 2.2 Autorisierung (RLS in Postgres)

Jede Tabelle hat RLS-Policies basierend auf JWT-Claims:

```sql
-- Beispiel: Salon-Owner sieht nur eigenen Tenant
CREATE POLICY "tenant_isolation" ON bookings
  FOR ALL
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Super-Admin überschreibt
CREATE POLICY "super_admin_full" ON bookings
  FOR ALL
  USING (current_setting('app.role') = 'super_admin');
```

JWT-Claims setzen `app.tenant_id` und `app.role` beim Request-Start.

## 3. OWASP Top 10 Mitigations

| Risiko | Mitigation |
|--------|-----------|
| A01 Broken Access Control | Postgres RLS + tRPC-Middleware-Checks + integration tests pro Endpoint |
| A02 Cryptographic Failures | TLS 1.3 only, Secrets in Vercel/Supabase Secrets-Vault, niemals in Git |
| A03 Injection | Drizzle ORM mit Parametern, keine String-Konkatenation in SQL |
| A04 Insecure Design | Threat-Modeling pro Major Feature, ADRs mit Sec-Sektion |
| A05 Security Misconfiguration | CIS-Benchmark-orientierte Defaults, Configuration-as-Code |
| A06 Vulnerable Components | Snyk + Renovate, tägliches Scanning, Critical/High SLA: 24 h Fix |
| A07 Authn Failures | Argon2id, Rate Limiting, HIBP-Check, Account-Lockout |
| A08 Software & Data Integrity | Signed JWTs, ID-Tokens, SRI-Hashes für externe Assets |
| A09 Logging & Monitoring | Audit-Log, Sentry, Better Stack, Alerts auf anomale Zugriffsmuster |
| A10 SSRF | Allowlists für externe Calls, keine User-controlled URLs in Server-Code |

## 4. Sicherheits-Tests

### 4.1 Automatisiert (im CI bei jedem PR)

- **Dependency-Scanning**: Snyk (Critical=block, High=warn)
- **SAST**: ESLint Security Plugins, Semgrep
- **Secret-Scanning**: GitHub Secret Scanning + TruffleHog im pre-commit
- **DSGVO-Lint** (custom): blockt PII in Logs, ungesicherte Cookies, fehlende RLS-Policies

### 4.2 Manuell (pro Sprint)

- **Code-Review** durch zweiten Senior (alle PRs)
- **Threat-Modeling-Review** für Features mit neuen Daten-Flows
- **Architecture-Review** durch Critic (#027) für Type-1-Entscheidungen

### 4.3 Externe Audits

- **Pen-Test extern** in Harden-Phase (vor Release v1.0)
- **Pen-Test jährlich** danach (im Maintenance-Vertrag)
- **DSGVO-Audit jährlich** (extern unterstützt durch DPO)

### 4.4 Tests gegen Doppelbuchung (Slot-Engine)

- **Property-Based Tests** mit `fast-check`: 1000 zufällige Konfigurationen pro CI-Run
- **Concurrency-Tests** mit `pgbench`: 100 parallele Buchungsversuche, 0 Doppelbuchungen erwartet
- **Pre-Production Lasttest**: 10.000 simulierte Concurrent Bookings über 60 Min
- **Continuous Concurrency Test**: in Production läuft 1× / Woche ein Live-Test mit dediziertem Test-Salon

## 5. Test-Strategie (in jeder Phase)

### 5.1 Test-Pyramide

| Ebene | Coverage-Ziel | Werkzeug | Beispiele |
|-------|:-------------:|----------|-----------|
| **Unit** | ≥ 60 % des Test-Counts | Vitest | Service-Funktionen, Helpers, Slot-Engine-Algorithmus |
| **Integration** | ≥ 30 % | Vitest + Real Postgres | tRPC-Endpoints gegen echte DB |
| **E2E** | ≥ 10 % | Playwright | Kunden-Buchungsflow, Admin-Kalender |
| **Property-based** | für kritische Module | fast-check | Slot-Engine (1000 zufällige Configs) |
| **Concurrency** | für DB-Interaktion | pgbench + Custom | Buchungs-Commit unter Last |
| **Last** | Pre-Production | k6 oder Artillery | 10k Concurrent Bookings |

### 5.2 Coverage-Ziele

- Neuer Code: **≥ 80 %**
- Projekt gesamt: **≥ 70 %**
- **Slot-Engine: 100 %** (statement + branch)
- **DSGVO-relevanter Code**: 100 %

### 5.3 Testdaten

- **Synthetische Testdaten** in Tests (keine echten Personendaten)
- Faker.js für realistische Namen / Adressen
- Test-Salon `__test_salon__` mit 5 Mitarbeitern + 20 Services für E2E-Tests

## 6. Incident Response

### 6.1 Incident-Klassifikation (siehe Maintenance-Vertrag § 4)

- P0 / P1 / P2 / P3

### 6.2 Response-Prozess

1. **Detection** (Monitoring-Alert, Customer-Report)
2. **Triage** (P-Klasse zuweisen, Owner bestimmen)
3. **Contain** (Symptom abstellen, z. B. Rate Limit hochfahren, Feature-Flag ziehen)
4. **Eradicate** (Root Cause beheben)
5. **Recover** (Service zurückfahren, Verifikation)
6. **Postmortem** (binnen 5 Werktagen, blameless gemäß CLAUDE.md §20)

### 6.3 DSGVO-Incident (Datenpanne)

Bei Verdacht auf Datenpanne (z. B. Cross-Tenant-Leak, Datenleck, unautorisierter Zugriff):

1. Sofort Incident-Channel öffnen (P0)
2. DPO Yasmin El-Sayed (#017) eskalieren binnen 1 h
3. Dich informieren binnen 24 h gemäß DPA § 8
4. Gemeinsame Meldung an LfDI BW binnen 72 h gemäß Art. 33 DSGVO
5. Falls hohes Risiko: Benachrichtigung betroffener Personen gemäß Art. 34 DSGVO

## 7. Disaster Recovery

- **RPO (Recovery Point Objective)**: max. 1 Stunde Datenverlust
- **RTO (Recovery Time Objective)**: max. 4 Stunden bis Wiederherstellung
- **Backup-Strategie**:
  - Supabase PITR (Point-in-Time-Recovery) für die letzten 7 Tage
  - Täglicher pg_dump in Cloudflare R2 (verschlüsselt, AES-256)
  - Wöchentliche kalte Kopie in separater EU-Region
  - Retention: 30 Tage täglich, 12 Monate wöchentlich, 7 Jahre jährlich (für Buchhaltungs-Aufbewahrungspflichten)
- **DR-Drills**: monatlich (in Maintenance-Phase)
- **Runbook**: `continuity/disaster-recovery-runbook.md`

## 8. DSGVO-Maßnahmen (Übersicht)

| Recht / Pflicht | Umsetzung |
|-----------------|-----------|
| Recht auf Auskunft (Art. 15) | Admin-Tool: 1-Klick-Export pro Kunde als JSON |
| Recht auf Berichtigung (Art. 16) | Direkt im Admin-Dashboard |
| Recht auf Löschung (Art. 17) | DSGVO-Lösch-Tool, kaskadierte Löschung mit Audit-Trail |
| Datenübertragbarkeit (Art. 20) | JSON-Export im offenen Format |
| Widerspruchsrecht (Art. 21) | Consent-Manager pro Kunde |
| Datenminimierung (Art. 5 Abs. 1 lit. c) | Pflichtfelder nur Name + Email + Tel; Allergien opt-in |
| Speicherbegrenzung (Art. 5 Abs. 1 lit. e) | Auto-Anonymisierung nach 7 Jahren (Steuerpflicht), Lösch-Skripte |
| Integrität / Vertraulichkeit (Art. 5 Abs. 1 lit. f) | TOMs gemäß DPA § 6 |
| Rechenschaftspflicht (Art. 5 Abs. 2) | Audit-Log, DSGVO-Dokumentation in `compliance/dsgvo/` |
| DPIA (Art. 35) | Wird in Design-Phase erstellt |

## 9. EU AI Act (Auto-Mitarbeiter-Zuordnung)

- **Klassifikation**: niedriges bis mittleres Risiko, keine "high-risk AI" iSd Art. 6 EU AI Act
- **Transparenz**: Kunde sieht, dass Auto-Zuordnung verwendet wurde, kann manuell überschreiben
- **Mitarbeiter-Information**: Kriterien der Zuordnung sind dokumentiert und für Mitarbeiter einsehbar
- **Keine personenbezogene Bewertung**: nur Skill + Verfügbarkeit + Lastausgleich, keine Performance- oder Persönlichkeits-Daten

## 10. Tooling

| Bereich | Tool |
|---------|------|
| SAST | Semgrep, ESLint Security |
| SCA (Dependencies) | Snyk + Renovate |
| Secret Detection | TruffleHog (pre-commit), GitHub Secret Scanning |
| Container Scanning | nicht relevant (serverless) |
| Runtime Monitoring | Sentry (Errors), Better Stack (Uptime) |
| WAF | Cloudflare WAF (Phase 2 — Custom-Domain-Optional) |
| Audit | eigenes Audit-Log in DB, Hash-chained für kritische Ops |

## 11. Akzeptanz-Gates für Sicherheit (vor Release)

| Gate | Kriterium |
|------|-----------|
| A2 Security | OWASP Top 10 verifiziert; 0 Critical, 0 High in Snyk; Secrets-Check grün |
| B2 Privacy | DPIA vorhanden, AVVs unterzeichnet, DSGVO-Tools getestet |
| B3 Compliance | Lizenz-Audit clean, Dokumentation vollständig |
| Pen-Test extern | 0 Critical, 0 High; Medium dokumentiert |
| Lasttest | 10k Concurrent Bookings, 0 Doppelbuchungen |
| RLS-Test | Cross-Tenant-Zugriff in Tests verifiziert blocked |
