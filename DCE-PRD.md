# DCE-PRD.md — Dark Code Elimination Product Requirements Document
## M2M~Inc. | `.claude/` Architecture Layer | Sovereign Execution Standard
### Doctrine: Spec Driven Development | Context Engineering | FL/II Authenticated

---

## Constitutional Role

**Dark Code** is any artifact — code, prompt, workflow, automation, email, deliverable — that ships without a declared owner, a known failure mode, a dependency map, or a verification standard.

Dark Code is the technical equivalent of **liability output**.

This document is the pre-build specification layer that forces every artifact through the same sovereign discipline as the Trust/Liability Gate — *before construction begins*, not after.

**Rule:** Nothing enters the M2M build pipeline without a completed DCE-PRD block.
**Rule:** Nothing exits the M2M platform without passing all five verification contracts.
**Rule:** If it cannot be spec'd, it cannot be built. If it cannot be verified, it cannot ship.

---

## DCE-PRD Template — Standard Form

> Copy this block for every new artifact, module, workflow, or deliverable.
> Complete all fields before Claude executes. Partial specs produce dark outputs.

---

### SECTION 1 — High-Level Intent

```
Project Name:       [Full artifact name — no abbreviations]
OS Lane:            [PIVOT OS™ / BRIDGE OS™ / Human OS™]
Engagement Context: [M2M / CenterMarq / Solutions Afoot / KGM / Client Name]
Goal:               [One sentence — what does this artifact accomplish when it works?]
Sovereign Objective:[What decision, relationship, or outcome does this serve?]
Ownership:          [Who is accountable in production? Name + role]
Distribution:       [Where does this ship? Make.com / Claude / Gmail / Supabase / Client / Public]
FL/II Split:        [What does Claude execute (80%)? What does Kev authenticate (20%)?]
```

**M2M Integration:** This section maps directly to the Intent declaration required by Must-Have 05.
The Sovereign Objective must be declared before any build begins — not inferred from context.

---

### SECTION 2 — Context Engineering (Legibility)

```
Dependency Map:
  - Upstream inputs:  [What feeds this artifact? Jotform / Make / Supabase / Prior module]
  - Downstream outputs: [What does this artifact produce or trigger?]
  - External services:  [APIs, MCP servers, ntfy.sh, Gmail, HubSpot, Stripe, etc.]
  - Claude modules:     [Which skill files, personas, or system prompts govern this?]
  - Data contracts:     [What schema, format, or variable names must be honored?]

Side Effects:
  - If this artifact fails, what else breaks?
  - Are there any cascading triggers in Make.com scenarios?
  - Are there any client-facing exposures if this produces wrong output?
  - Are there any Supabase writes that would need to be rolled back?
```

**M2M Integration:** The Dependency Map IS the Claude operating condition.
Every upstream input is a context variable. Every downstream output is a trust contract.
A module with no dependency map is dark by definition — Claude cannot execute FL/II without it.

---

### SECTION 3 — Behavioral Contracts (Semantic Context)

```
Expected Behavior:
  - Describe what correct output looks, reads, or functions like
  - Include format, register, length, and routing outcome if applicable

Failure Modes:
  - How does this artifact fail gracefully?
  - What is the fallback if Claude returns an error, null, or malformed output?
  - What is the human escalation path if automation cannot resolve?
  - Map to Judge routing: APPROVED / REVISE / ESCALATE / HUMAN_REQUIRED

Performance Contracts:
  - Expected latency (Make.com scenario execution time)
  - Token budget (Claude API call — input/output estimate)
  - Supabase write volume (rows per trigger)
  - Rate limit exposure (Gmail send limits, API quotas)

Trust/Liability Contracts:
  - What claims does this artifact make? Are they verifiable?
  - What does this artifact promise? Is that promise contractually authorized?
  - Does any automated output require human review before delivery?
  - Liability exposure level: [LOW / MEDIUM / HIGH / ZERO-TOLERANCE]
```

**M2M Integration:** Failure Modes map directly to Judge Model routing logic in Scenario 4677623.
ESCALATE and HUMAN_REQUIRED are not edge cases — they are designed outcomes.
Any artifact with HIGH or ZERO-TOLERANCE liability exposure requires Kev's 20% authentication
before it exits the platform, regardless of automation confidence score.

**CenterMarq Rule:** All CenterMarq artifacts inherit ZERO-TOLERANCE liability classification
by default. Regulated-industry exposure overrides standard gate settings.

---

### SECTION 4 — Verification (The Flywheel)

```
Evals — Functional Tests:
  1. [Specific input → expected output test]
  2. [Edge case test — what happens with null, empty, or malformed input?]
  3. [Routing test — does the correct branch fire for each outcome?]
  4. [End-to-end test — does the full pipeline produce the intended deliverable?]
  5. [Regression test — does this break any existing M2M workflow?]

Judge Model Criteria (Scenario 4677623 alignment):
  - Brand Score threshold:  [Minimum passing score / 10]
  - CTA Score threshold:    [Minimum passing score / 10]
  - Routing decision logic: [What score combination triggers APPROVED vs REVISE vs ESCALATE?]
  - Quality log entry:      [What fields write to Supabase on this artifact's verdict?]

Trust/Liability Gate — Seven Must-Haves Confirmation:
  01 Trust:     [ ] Output earns the room before it asks anything
  02 Context:   [ ] Calibrated to specific reader, channel, and OS lane
  03 Liability: [ ] Binary gate passes — no unverified claims, no overpromises
  04 Taste:     [ ] Navy/Gold sovereign aesthetic — C-suite craft standard met
  05 Intent:    [ ] Sovereign objective declared within first 30% of content
  06 Intentional Intent: [ ] Architect's 20% is present — output is distinctly M2M
  07 Fractional Legitimacy: [ ] FL/II split honored — execution sourced, close owned

Senior Engineer Review Filter (3 Questions):
  1. [What is the one assumption in this build that, if wrong, collapses the entire artifact?]
  2. [If this artifact ran at 10x volume tomorrow, what breaks first?]
  3. [What would a hostile reviewer — a client's attorney, a procurement officer,
      or a competing firm — find to challenge in this output?]
```

**M2M Integration:** The Senior Engineer questions are the Judge Model's ESCALATE trigger.
If any of the three questions cannot be answered with documented evidence,
the artifact does not route to APPROVED. It routes to HUMAN_REQUIRED and
sits in the Kev authentication queue until the spec gap is closed.

---

## DCE-PRD Completion Standard

An artifact's DCE-PRD block is **COMPLETE** when:

| Checkpoint | Condition |
|---|---|
| Intent declared | One sentence, one sovereign objective, one owner — no ambiguity |
| Dependency map closed | All upstream inputs and downstream outputs named |
| Side effects documented | Cascade failures and rollback paths identified |
| Behavioral contract written | Success and failure both defined — not just the happy path |
| Evals specified | Minimum 4 functional tests written before build begins |
| Judge criteria set | Score thresholds and routing logic documented |
| Seven Must-Haves checked | All 7 pass — no partial credit |
| Senior Qs answered | All 3 answered with evidence — not assertion |
| FL/II split declared | 80% execution scope and 20% authentication gate named |

**Incomplete DCE-PRD = Build does not start.**
This is not a guideline. It is a pipeline gate.

---

## DCE-PRD by Artifact Type

### Make.com Scenario / Automation Module
- Dependency Map must include every module in the scenario by number and function
- Side effects must address both Gmail send failure and Supabase write failure independently
- Behavioral contract must specify the Judge routing outcome for every score combination
- Evals must include a live test run with a known input before scenario goes active

### Claude Skill File (`.claude/skills/`)
- Intent must declare which OS lane the skill serves and which output type it governs
- Dependency Map must reference the CLAUDE.md doctrine layer it inherits from
- Behavioral contract must define what "PASS" looks like in plain language
- Evals must include at least one failure-mode test — not just a success scenario

### Client Deliverable (SOW, Proposal, Report, Deck)
- Liability contract elevated: every quantitative claim requires a named source
- Behavioral contract must specify distribution format AND recipient register
- Seven Must-Haves gate runs twice: once at draft, once at final before ship
- Senior Engineer questions must be answered by Kev — not delegated to Claude

### Automated Email / BRIDGE OS™ Output
- Trust contract is the primary gate — recipient must feel served before the email asks
- Behavioral contract must include the 30:12 structure check (subject / body)
- Judge Model scores must meet minimum threshold before Gmail module fires
- Side effects must address Gmail send limit exposure at scale

### Supabase Schema / Data Contract
- Dependency Map must list every Make.com module that writes to or reads from this schema
- Behavioral contract must define NULL handling, type enforcement, and constraint logic
- Evals must include a schema migration test — no silent breaking changes
- Senior Engineer Q2 (10x volume) is mandatory — schema breaks under load are ZERO-TOLERANCE

---

## Integration with M2M Stack

| Tool / Layer | DCE-PRD Integration |
|---|---|
| **CLAUDE.md** | DCE-PRD is the pre-build spec standard — referenced at session open |
| **Make.com Judge (Scenario 4677623)** | Behavioral Contracts feed Judge scoring rubric directly |
| **Skills Suite v2.0** | Every SKILL.md opens with its DCE-PRD block |
| **Trust/Liability Gate** | Section 4 Seven Must-Haves IS the gate — DCE-PRD runs it pre-build |
| **Supabase Quality Log** | Section 4 Evals define the quality log schema fields per artifact type |
| **Master Prompt Library** | Every framework prompt carries its DCE-PRD intent block in the header |
| **CenterMarq Deliverables** | ZERO-TOLERANCE liability override applied to all Section 3 contracts |
| **Solutions Afoot Modules (SA-11–SA-20)** | DCE-PRD governs each module's spec before Caspio/Notion build |
| **ntfy.sh Escalation** | HUMAN_REQUIRED routing from Section 3 failure modes triggers ntfy alert |

---

## Doctrine Alignment

**Spec Driven Development** means the specification IS the first artifact.
Before Claude writes a line of code, a sentence of copy, or a module of automation —
the PRD exists. The PRD is sovereign. The build serves the PRD.

**Context Engineering** means the operating conditions are designed, not assumed.
Every dependency, every side effect, every failure mode is declared in advance.
Claude executes within a fully legible context — not a vague prompt.

**FL/II (Fractional Legitimacy / Intentional Intent)** means:
- Claude executes the 80%: builds, drafts, routes, scores, logs
- Kev authenticates the 20%: sets objectives, names owners, answers Senior Engineer questions,
  signs the gate, and ships the artifact with sovereign authority

**Dark Code is eliminated not by better AI — but by better specification.**
The DCE-PRD is that specification. It is the foundation.

---

## Sign-Off Standard

Every authenticated DCE-PRD closes with:

> *Spec declared. Context engineered. Gate passed.*
> *Fractional Legitimacy / Intentional Intent — authenticated.*
> *To the work.*
> *— Dr. Kevin A. Smith, Hon. D.H.L. | Chief Opportunity Officer | M2M~Inc.*

---

*M2M~Inc. | DCE-PRD.md v1.0 | April 2026*
*`.claude/` Architecture Layer — Sovereign Architect Eyes Only*
*Applies to all artifacts, all lanes, all engagements, all platforms.*
*Nine USPTO-pending marks. FL/II doctrine. C-suite standard. No exceptions.*
