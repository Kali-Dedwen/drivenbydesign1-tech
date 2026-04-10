---
name: m2m-trust-liability-gate
description: Execute the Trust vs. Liability Gate protocol on any M2M output before it proceeds past Must-Have 03 in the Seven Must-Haves quality standard. Use this skill whenever an output has passed the Liability check and needs binary clearance before proceeding to Taste, Intent, and the Doctrine Layer. Also triggers independently when reviewing any output that touches compliance-adjacent territory, references third parties, contains commitments, or operates in a regulated domain. This gate is the hard stop between quality review and distribution clearance. If it fails, the output rewrites. No exceptions.
---

# M2M Trust vs. Liability Gate — Full Protocol

## Position in the Seven Must-Haves

This gate fires between Must-Have 03 (Liability) and Must-Have 04 (Taste).
It is the structural checkpoint that separates quality review from distribution clearance.

Sequence:
1. Must-Have 01 — Trust
2. Must-Have 02 — Context
3. Must-Have 03 — Liability
4. **Trust vs. Liability Gate — binary decision point**
5. Must-Have 04 — Taste
6. Must-Have 05 — Intent
7. Must-Have 06 — Intentional Intent
8. Must-Have 07 — Fractional Legitimacy

## The Binary Question

**Does this output build trust or create liability?**

There is no middle ground. There is no partial pass. There is no conditional clearance.

- **Trust** — the output strengthens M2M's credibility, the client's confidence,
  or a third party's willingness to engage. Proceed to Must-Have 04.
- **Liability** — the output creates legal, financial, reputational, or relational
  exposure for M2M, the client, or any referenced third party. Rewrite before distribution.

## Gate Evaluation Protocol

### Step 1 — Commitment Audit
Scan the output for every commitment, promise, timeline, deliverable, or guarantee.

For each one:
- Can M2M deliver this as stated?
- Is the timeline realistic given current capacity?
- Does this commit resources that have not been allocated?
- Does this promise outcomes that depend on variables M2M does not control?

If any commitment fails — the gate fails.

### Step 2 — Third-Party Reference Audit
Scan the output for every mention of a partner, client, vendor, or external entity.

For each one:
- Is this reference authorized by the named party?
- Does this accurately represent the relationship?
- Could this create an implied endorsement, partnership, or obligation?
- Does this expose the third party's confidential information?

If any reference fails — the gate fails.

### Step 3 — Compliance Perimeter Check
Determine whether this output touches any regulated territory.

Regulated domains:
- Federal grants (OJJDP, Grants.gov, JustGrants)
- Healthcare data (HIPAA through CenterMarq)
- Education records (FERPA through Project CHECK)
- Cybersecurity frameworks (CMMC, NIST 800-171)
- Financial instruments (equity arrangements, cap tables)
- Real estate trust documents (KGM SSM)

If the output touches any regulated domain:
- Has `m2m-governance` been consulted?
- Is the output within the compliance perimeter?
- Does Kev need to review before distribution?

If compliance is unconfirmed — the gate fails.

### Step 4 — Reputational Impact Assessment
Read the output as if it were published on the front page of a trade journal,
forwarded by a competitor, or read aloud in a board meeting.

- Does this represent M2M at the standard the brand demands?
- Could any sentence be taken out of context to M2M's disadvantage?
- Does this create expectations that would be embarrassing to walk back?

If reputational risk is present — the gate fails.

### Step 5 — Data Exposure Check
Scan the output for any personally identifiable information (PII),
protected health information (PHI), or confidential business data.

- Are there names, emails, phone numbers, or addresses that should not be included?
- Are there financial figures, cap table details, or equity terms that are not public?
- Are there internal M2M operational details that should remain internal?

If data exposure is present — the gate fails.

## Gate Outcomes

### Pass — Proceed to Must-Have 04
The output builds trust. No commitments exceed capacity. No references are unauthorized.
No compliance boundaries are crossed. No reputational risk is present. No data is exposed.

The output moves forward through Taste, Intent, Intentional Intent, and Fractional Legitimacy.

### Fail — Rewrite Before Distribution
The output creates liability. One or more checks have failed.

Rewrite protocol:
1. Identify every failing element
2. Rewrite each element to eliminate the liability
3. Re-run the gate from Step 1
4. Do not proceed to Must-Have 04 until the gate passes clean

### Escalate — Sovereign Architect Review Required
The output touches Red Zone territory (0% automation per FL doctrine)
or the gate evaluator cannot make a confident binary determination.

Escalation protocol:
1. Flag the output with the specific concern
2. Route to Kev for Sovereign Architect review
3. Do not distribute until Kev clears the gate manually

## FL Zone Alignment

The gate sensitivity scales with the Fractional Legitimacy zone:

- **Green Zone** (90% automation) — gate runs as automated checklist.
  Intake acknowledgments, research briefs, internal summaries.
- **Yellow Zone** (70% automation) — gate runs with elevated scrutiny on
  commitment and reference audits. Employer outreach, deal updates.
- **Orange Zone** (40% automation) — gate requires manual review of
  Steps 1-4. Partner proposals, grant narratives.
- **Red Zone** (0% automation) — gate requires full Sovereign Architect
  review. Equity agreements, federal submissions, legal instruments.

## Integration

- Gate failure on Step 3 triggers `m2m-governance` for compliance review
- Gate failure on Step 4 triggers `m2m-brand-design` for reputational alignment
- Gate failure on Step 5 triggers `m2m-governance` for data handling protocol
- Gate pass feeds into `m2m-quality-standards` Must-Have 04 (Taste)
- FL zone assignment references `m2m-intentional-intent` Fractional Legitimacy doctrine
