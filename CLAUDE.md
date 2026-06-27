# CLAUDE.md — drivenbydesign1-tech

This file is the doctrinal and operational baseline for any Claude Code session run against this repository. It is auto-loaded at session start. Read it fully before taking any action.

Infrastructure IDs, project references, and deployment specifics live in `CLAUDE.local.md` (gitignored). Load both files at session start when working on infrastructure-touching tasks.

Owner: Kevin (M2M~Inc., SDVOSB + VBE)
Repo: drivenbydesign1-tech
Production domain: model2message.net

---

## 1. Identity & Voice

This repository belongs to M2M~Inc. — a Service-Disabled Veteran-Owned Small Business (SDVOSB) and Veteran Business Enterprise (VBE) operating the Human OS™ platform suite (PIVOT OS™, BRIDGE OS™, Human OS™).

**Voice rules (always-on):**
- The founder's name in any user-facing string, copy block, page, alt text, or generated artifact is **"Kevin"** — never "Kev." "Kev" is private/internal only.
- Tone: authoritative, direct, human-centric. No filler, no AI-tells, no marketing fluff.
- Never include personal spiritual frameworks (Jupiter Return, natal chart, tarot) in any external output, deck, CRM field, or business material. Internal only.

---

## 2. Governance Constraints (Hard — Do Not Violate)

These are legal and certification constraints. Treat them as compile-time invariants. If a requested change would violate one, stop and surface the conflict before proceeding.

**Entity certifications:**
- **M2M~Inc.** holds **SDVOSB + VBE.** DOBE pending via VVICINC.
- **CenterMarq LLC** holds **SDVOSB + VBE.**
- **Solutions Afoot LLC (SAF)** holds **VBE + CAGE only.** SAF **NEVER** holds SDVOSB. Never attribute SDVOSB to SAF in any output, page, capability statement, alt text, metadata, or generated copy.

**Document production rule (June 2026 onward):**
- Once NC legal counsel has confirmed a document, all counsel-review language must be stripped from the final version. Finals ship clean. Do not leave "for counsel ratification," "draft for counsel," or routing annotations on the face of executed docs. M2M's own PROMETHEUS / Trust-Liability Gate markers stay. NC governing law/venue references stay.

**NC Legal Counsel status:** Complete as of May 2026. S-Corp governance docs (Bylaws, Shareholder Agreement, ICA, Non-Compete, plus five additional DOCX) are legally cleared.

---

## 3. The Doctrines (Operating Standards)

### 3.1 FL/II Doctrine v1.0 — 80/20 Split

Claude does 80% of the work autonomously. Kevin does 20% — judgment, voice, and final call. When a decision requires human judgment, configuration not in this file, or a value choice that affects positioning, **stop and ask.** Do not guess.

Trigger a stop when:
- A copy block touches positioning, pricing, or partner attribution.
- A change would alter certification claims or governance documents.
- A deploy would affect production data or live publisher events.
- Ambiguity exists between two reasonable paths and the choice has external consequences.

### 3.2 Anti-AI-Tell Doctrine v1.0 — VOICE-GATE

Before any generated copy is committed or shipped, run the **AI-Tell Scan as Step 0**:
- Strip phrases like "delve into," "in today's fast-paced world," "leverage synergies," "robust solution," "navigate the landscape," "in the realm of," "it's important to note," "as an AI."
- Reject em-dash-heavy faux-thoughtful cadence when it doesn't match Kevin's actual voice.
- Reject tricolon scaffolding ("not just X, but Y — it's Z") used as a default rhythm.
- Voice should sound like a Navy veteran founder who has been doing the work, not like a content marketing intern.

If you are about to ship copy that fails VOICE-GATE, treat that as a `needs_input` state and surface the failing lines for Kevin to rewrite.

### 3.3 Trust vs Liability Gate — Pre-Ship Check

Every output that exits the platform (client deliverable, page deploy, email, post, automation result) passes the Trust vs Liability Gate. The gate asks one question: *does this build trust, or does it create liability?* If liability — stop, route to Kevin.

Reference: `/mnt/skills/user/m2m-trust-liability-gate/SKILL.md` (when available in the execution environment).

---

## 4. Infrastructure Posture (General)

Specific project IDs, endpoints, and scenario references are in `CLAUDE.local.md`. The general posture rules below apply regardless.

### 4.1 Database & Auth (Supabase)

- Multi-tenant Row-Level Security is the canonical access-control layer. Do not disable, weaken, or work around RLS. If a query needs elevated access, use service-role credentials in a server-side function — never in client code.
- All v1 payload contracts are versioned. Do not introduce a new contract or modify an existing one without a versioned schema entry and Kevin's sign-off.
- During active parity windows, drift triggers triage before downstream scope proceeds.

### 4.2 MCP Server

- A canonical MCP server with JWT auth, RLS tier isolation, and PROMETHEUS audit trail is the source of truth for tool execution.
- A stale MCP server zip may exist somewhere in this repo's `src/pages/` tree and could be publicly accessible from the production domain — this is flagged as **Blindspot #30**. Do not assume MCP code in this repo is current. If you find an MCP-related artifact in `src/pages/`, surface it as `needs_input` rather than acting on it.

### 4.3 Event Bus & Compliance Gate

- PROMETHEUS (Make.com) is the Legal & Compliance Gate and first publisher on the Event Bus. Verdicts: CLEAR or BLOCK. (Future state may add `needs_input` as a third verdict — coordinate with Kevin before assuming it exists.)
- SUBSCRIBER-001 (FL/II Authentication Queue) is in active staging. Do not trigger live SUBSCRIBER-001 events from this repo without explicit instruction.

---

## 5. Repository Workflow

### 5.1 Git Operations

**Push to GitHub uses GitHub Desktop only.** PowerShell pushes return 403 errors. Never instruct Kevin to push via PowerShell or `git push` from terminal — always route to GitHub Desktop.

### 5.2 Build & Deploy

- Deploys are triggered by push to main. Verify Vercel build status before declaring a feature shipped.
- Vercel project name and recent deployment IDs are in `CLAUDE.local.md`.

### 5.3 Active Deliverables

- **DEL-013** (Focus Mode UX) — shipped.
- **DEL-001** (financials) — IN_PROGRESS.
- **DEL-002** (reference letters) — IN_PROGRESS.

Deadlines and specific HUB references are in `CLAUDE.local.md`.

---

## 6. Open Engine / Ticket Protocol (When Applicable)

If a session is acting on a ticket from an external queue (Linear, Make.com event, Supabase event):

1. **Claim:** Acknowledge the ticket ID and the intended scope before editing files.
2. **Execute:** Make changes. Run tests where they exist. Verify build.
3. **Stop on ambiguity:** If a question arises that this file cannot answer, do not guess — set the work state to `needs_input`, write the precise blocking question, and stop.
4. **Receipt:** On completion, post a summary of files changed, tests run, and any follow-up Kevin needs to make.

---

## 7. Sensitive Topics — Never in Output

- Kevin's birth chart, Jupiter Return, or any astrological/spiritual framework.
- Any attribution of SDVOSB to SAF.
- Any reference to "Kev" in user-facing strings.
- Any reproduction of counsel-review language in shipped finals.
- Any credentials, API keys, service-role tokens, or specific infrastructure IDs in committed files. (Those belong in `CLAUDE.local.md`.)

---

## 8. Closing

Kevin's operating phrase: **"To the work."**

When in doubt, stop and ask. The cost of a pause is always lower than the cost of a wrong ship.
