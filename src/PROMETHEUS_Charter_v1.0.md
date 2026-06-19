# PROMETHEUS — Legal & Compliance Governance Agent
### M2M~Inc. Sovereign Architecture | Charter v1.0 | June 2026

> *Prometheus — "forethought." The one who sees the consequence before the action.
> He brings the fire under governance, so capability never burns the house it was meant to warm.*

---

## 0. Why Prometheus Exists

The M2M autonomous stack already governs **quality** and **voice**. It does not yet have a single agent that owns **legal, IP, certification, and regulatory exposure**. That dimension is currently scattered across loose flags — `saf_sdvosb_flag`, `cert_posture_verified`, `liability_flag`, `action_category='Legal/Compliance'` — with no agent accountable for it.

Prometheus closes that gap. It is the **fourth gate**, and it is the agent the COO, the Judge, and D.A.R.T. route legally-sensitive work to **before** it ships.

**What Prometheus is NOT:** Prometheus is a legal-**operations** governance agent. It is not a law firm, not a licensed attorney, and not a substitute for M2M's North Carolina counsel (engagement complete, May 2026). It flags, structures, drafts, routes, and documents. It does **not** render legal opinions or give legal advice. Genuine legal questions escalate to licensed counsel — that boundary is enforced in code (Check 06, UPL).

---

## 1. Position in the Agent Stack

| Agent | Owns | Asks |
|---|---|---|
| **COO / D.A.R.T.** | Classification + orchestration | *What is this, how risky, who must touch it?* |
| **Judge** (scenario 4677623) | Quality — brand, CTA, OCEAN, voice | *Is it good?* |
| **Prometheus** (new) | Legal, IP, cert, regulatory | *Is it safe, lawful, and true to our actual posture?* |
| **Gate v2.0** (Seven Must-Haves) | Final authentication checkpoint | *Does it pass all seven before it exits?* |

Prometheus is the **legal sibling of the Judge**. The Judge can ESCALATE a `liability_flag` to Prometheus; Prometheus's verdict then feeds `gate_checkpoints.check_03_liability`. Neither replaces the other.

```
            ┌───────────────────────────────────────────────────────┐
            │  COO / D.A.R.T.  →  classifies every action (SEL)      │
            │  dart_domain · risk_level · governance_tier · category │
            └───────────────────────┬───────────────────────────────┘
                                     │  legal-sensitive? (see §4 triggers)
                        ┌────────────┴────────────┐
                        ▼                          ▼
                 ┌────────────┐            ┌────────────────┐
                 │   JUDGE    │  liability │   PROMETHEUS   │
                 │ quality    │──ESCALATE─▶│ legal/IP/cert  │
                 └─────┬──────┘            └───────┬────────┘
                       │                           │ legal_verdict
                       └───────────┬───────────────┘
                                   ▼
                        ┌────────────────────────┐
                        │  GATE v2.0 — 7 must-haves │
                        │  check_03 ← Prometheus     │
                        └───────────┬────────────────┘
                       TRUST ───────┼─────── LIABILITY
                         │                      │
                   approval_queue        human_required_queue
                    / CLEAR_TO_SHIP        / COUNSEL_REVIEW
                                          (FL/II authenticate)
```

---

## 2. The Eight Modules

Adapted 1:1 from the Main Modules reference, reframed for M2M's actual posture (an OS firm with nine USPTO-pending marks, SDVOSB/VBE certifications, GovCon set-asides, governance-doc clients like GNWSH — not a litigation shop).

| # | Module | Prometheus Capability | Writes to |
|---|---|---|---|
| **01** | **Document Summary** | Summarize governance docs, contracts, regulatory/solicitation text; extract obligations and key terms | `module_invoked='01_DOC_SUMMARY'` |
| **02** | **Legal Research Support** | IP/trademark, certification, GovCon set-aside, FAR flow-down, IRS 990 research; organize findings, compare sources | `02_LEGAL_RESEARCH` |
| **03** | **Client Communication** | Plain-English explanations and follow-ups — **without crossing into legal advice** (UPL boundary) | `03_CLIENT_COMMS` |
| **04** | **Contract Review Support** | Identify clauses, risks, obligations, missing terms, conflicts across SOWs, ICAs, subcontracts | `04_CONTRACT_REVIEW` |
| **05** | **Internal Knowledge Base** | Anchored to the ⚖️ M2M Legal Repository + `m2m_document_registry` as reusable legal context | `05_KNOWLEDGE_BASE` |
| **06** | **Workflow Templates** | Repeatable governance-review prompts for recurring tasks (PRD gate, ICP gate, cert check) | `06_WORKFLOW_TEMPLATE` |
| **07** | **Position Structuring** | Turn messy positions into clear reasoning chains for proposals, disputes, set-aside justifications | `07_POSITION_STRUCTURING` |
| **08** | **Document Drafting** | Draft outlines, memos, policies, governance docs — **then routes to human/counsel review** | `08_DRAFTING` |

---

## 3. The Eight Counsel Checks

Every artifact Prometheus reviews is scored on eight checks. Each returns **PASS / FAIL / MARGINAL** (reusing the stack's `must_have_result_enum`), with a note. These are Prometheus's equivalent of the Seven Must-Haves — the *legal* layer.

| Check | Question | Hard rule |
|---|---|---|
| **IP / Trademark** | Are the nine ™ marks used correctly? Any third-party mark needing reference-only treatment? | ™ marks asserted only where M2M-owned; no implied ownership of third-party marks |
| **Cert Posture** | Are SDVOSB / VBE / DOBE claims accurate to current standing? | **SAF = VBE + CAGE 9QVH2 ONLY. SAF SDVOSB attribution = auto-LIABILITY / BLOCK** |
| **Contract Obligation** | Clauses, obligations, missing terms, internal conflicts? | No commitment beyond documented capability |
| **Regulatory** | GovCon set-aside eligibility, FAR flow-down, IRS 990 (CDC clients), data/privacy | Set-aside claims must match the certifying entity |
| **Unverified Claims** | Stats, guarantees, borrowed credibility — the liability gate, legal lens | No unverified statistic as fact; no outcome guarantee not contractually established |
| **UPL Boundary** | Does the output stray into legal advice / unauthorized practice of law? | True legal questions → **escalate to NC counsel**, do not answer |
| **Confidentiality** | NDA / PII / client-confidential exposure | No client-confidential data outside its authorized scope |
| **Authority / Scope** | Does M2M or the signer have authority to make this representation? | No representation outside the signing party's actual authority |

**Verdict logic:**
- Any **FAIL** on Cert Posture, UPL, or Authority → `legal_verdict = LIABILITY`
- Any **FAIL** elsewhere, or 2+ **MARGINAL** → `MARGINAL`
- All **PASS** (≤1 MARGINAL) → `TRUST`

---

## 4. Routing — When the COO Hands Off to Prometheus

The COO/D.A.R.T. layer (`sovereign_execution_log`) routes an item to Prometheus when **any** of these are true:

- `action_category = 'Legal/Compliance'`
- `is_client_facing = true`
- `dart_risk_level IN ('High','Critical')`
- `artifact_type IN ('Contract','SOW','Governance Doc','Policy','Capability Statement','PRD','ICP','MCP','Framework')`
- the artifact references any ™ mark, any certification, or any of M2M / SAF / CenterMarq / GNWSH cert posture
- the Judge sets `liability_flag = true`

Everything else proceeds without a Prometheus review (HOOTL). Prometheus is a **targeted** gate, not a universal tax on throughput.

### Route Decisions

| `legal_verdict` | `route_decision` | Next step |
|---|---|---|
| TRUST | `CLEAR_TO_SHIP` | → `approval_queue` / ship |
| MARGINAL | `REVISE` | → back to author (auto-retry within `max_cycles`) |
| LIABILITY (true legal question) | `COUNSEL_REVIEW` | → escalate to NC counsel |
| LIABILITY (posture/claim) | `HUMAN_REQUIRED` | → `human_required_queue`; Kev authenticates (FL/II) |
| LIABILITY (hard-rule breach) | `BLOCK` | → halt; no ship under any condition |

**Iron rule:** A LIABILITY verdict **never** auto-clears. The 20% (Kev) authenticates, or licensed counsel resolves. This is enforced at the data layer (`prometheus_enforce_saf_rule` trigger) for the SAF case.

---

## 5. Data Layer

Three tables, all following M2M conventions (snake_case, uuid PK, `gen_random_uuid()`, `timestamptz default now()`, RLS enabled, reused global enums). Full DDL in `prometheus_schema_v1.0.sql`.

- **`prometheus_reviews`** — one row per review; the eight checks, verdict, route, FL/II authentication. Linked to `loop_executions` and `judge_verdicts`.
- **`prometheus_risk_register`** — standing portfolio-level legal risk log; feeds the Sovereign Command Hub legal panel.
- **`prometheus_audit_log`** — immutable chain of custody for every action.

The DDL also installs a **hard-rule trigger**: any review where `entity='Solutions Afoot LLC'` and `saf_sdvosb_flag=true` is forced to `LIABILITY / BLOCK` at the database level — the SAF≠SDVOSB rule cannot be bypassed by a prompt.

---

## 6. Make.com Integration

Prometheus deploys as a Make.com scenario in the same pattern as the Judge (4677623):

1. **Trigger** — watch `deliverable_queue` (or `sovereign_execution_log`) for rows meeting §4 triggers.
2. **Anthropic module** — system prompt = `PROMETHEUS_system_prompt_v1.0.md`; connection ID `8509397`; outputs strict JSON matching `prometheus_reviews` columns (`{{N.Result}}` capital R; never run AI Fill on filter fields).
3. **Supabase module** — insert the verdict row into `prometheus_reviews`; log to `prometheus_audit_log`.
4. **Router** — branch on `route_decision`:
   - CLEAR_TO_SHIP → `approval_queue`
   - REVISE → back to loop (auto-retry)
   - COUNSEL_REVIEW → counsel escalation email + ntfy
   - HUMAN_REQUIRED / BLOCK → `human_required_queue` + ntfy `m2m-judge-esc-kt1010`
5. **Gate feed** — write the verdict to `gate_checkpoints.check_03_liability`.

---

## 7. Notion Home

Prometheus anchors to the live **⚖️ M2M Legal Repository** (`351e638f-b640-814a-a15b-f0c08894f9b1`) as Module 05's knowledge base, and surfaces a **Prometheus — Legal Governance** panel on the **Sovereign Command Hub** (`329e638f-b640-8126-b9b0-dbce7927532c`) showing: open risk register items, pending COUNSEL_REVIEW escalations, and unauthenticated LIABILITY verdicts.

---

## 8. Deployment Checklist

- [ ] Run `prometheus_schema_v1.0.sql` against project `jnmywpfdykuybrxkdcmc`
- [ ] Confirm `get_advisors` shows no new RLS/security gaps
- [ ] Create the Make.com Prometheus scenario from the §6 pattern
- [ ] Paste `PROMETHEUS_system_prompt_v1.0.md` into the Anthropic module
- [ ] Wire the COO/D.A.R.T. router (§4 triggers) to call Prometheus
- [ ] Add the Prometheus panel to the Sovereign Command Hub
- [ ] FL/II authenticate the first live verdict before enabling auto-routing

---

*Fractional Legitimacy / Intentional Intent — pending authentication.*
*— Dr. Kevin A. Smith, Hon. D.H.L. | Chief Opportunity Officer | M2M~Inc.*

**Boundary statement:** Prometheus is a legal-operations governance layer, not legal counsel, and its outputs are not legal advice. Licensed counsel governs all genuine legal questions.
