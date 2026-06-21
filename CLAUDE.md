# CLAUDE.md
# M2M~Inc. Sovereign MCP Server — Workspace Instructions
# Model 2 Message, Inc. | SDVOSB | VBE | NC S-Corp

## Identity & Governance

This repository is the M2M~Inc. Sovereign MCP Server — the Claude Code
integration layer for the PROMETHEUS governance stack, DART Sovereign Skill
System, and procurement compliance pipeline.

All outputs, code, and deployments from this repository are governed by:
- FL/II Doctrine (Claude executes 80%, Kev authenticates 20%)
- Anti-AI-Tell Doctrine v1.0 (VOICE-GATE fires before distribution)
- Trust/Liability Gate (Seven Must-Haves — pre-distribution checklist)
- PROMETHEUS governance auto-escalation triggers

## Tech Stack

- Runtime: Node.js >=18, TypeScript ESNext
- MCP SDK: @modelcontextprotocol/sdk ^1.12.0
- Database: Supabase Pro (project: jnmywpfdykuybrxkdcmc)
- Automation: n8n + Make.com
- Deploy: Vercel (model2message.net stack)
- Monitoring: Datadog synthetic testing loops

## Operational Commands

- Build: `npm run build`
- Start (HTTP): `npm start`
- Start (CLI/ultracode): `node dist/index.js --stdio`
- Dev watch: `npm run dev`
- Lint: `npm run lint`
- Test: `npm test`
- DB Migration: `supabase migration up`
- MCP Inspector: `npx @modelcontextprotocol/inspector`

## Ultracode Usage Policy

Use `/effort ultracode` for:
- RLS audit sweeps across procurement_pipeline schema
- Cross-platform DoD evaluation (all 7 platforms simultaneously)
- PROMETHEUS risk register analysis + governance review generation
- n8n workflow completion (error branches, output schema, write-back)
- Full DART skill system integrity check (SKL-001 through SKL-012)

Use `/effort high` for:
- Single-file patches
- Individual tool registration additions
- Routine type fixes
- Single-table schema queries

Rule: drop back to `/effort high` after any heavy infrastructure session.
Ultracode is not a quality dial — it is a workflow permission for substantive
multi-system work.

One-time ultracode trigger (no session change):
Include "ultracode" in the prompt for single-task workflow execution.

## Code & Quality Guardrails

- All Supabase writes must carry `trace_id` — zero orphaned records
- Agent role: use `anon` key — service_role bypasses RLS (never use in agent path)
- RLS must be enabled on all tables before first data write
- No hardcoded secrets, keys, or credentials — `.env` is read-only per governance.yaml
- `OWASP_Top_10_Compliant` patterns only
- Never rewrite an entire file — patch or increment when a targeted change suffices
- Error handling must return actionable, structured failure messages
- All async operations: `async/await` — no callback patterns

## Certification Posture — Hard Rules

These are not configuration options. They are governance constants:

- **M2M~Inc.**: holds SDVOSB + VBE ✓
- **SAF (Solutions Afoot LLC)**: holds VBE + CAGE 9QVH2 ONLY — NEVER SDVOSB
- **CenterMarq LLC**: no SDVOSB — ever

Any code, output, or automation that attributes SDVOSB to SAF is a
governance violation. The PROMETHEUS server enforces this with a hard block.

## VOICE-GATE — Step 0

Before any output distributes:
1. VOICE-GATE fires (Anti-AI-Tell Doctrine v1.0)
2. Trust/Liability Gate fires (Seven Must-Haves)
3. FL/II authentication (Architect's 20%)
4. Deploy

No output ships without this sequence. Automated outputs route to
HUMAN_REQUIRED if any gate fails.

## NC HUB Certification Note

NC HUB-4052712 deadline: July 10, 2026.
Folder 03 (financial) and Folder 04 (reference letters) remain outstanding.
QuickBooks reconnection is required for Folder 03 completion.
No code in this repository delays or interferes with that priority.
