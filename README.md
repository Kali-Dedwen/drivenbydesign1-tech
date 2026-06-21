# M2M~Inc. Sovereign MCP Server

**Model 2 Message, Inc. | SDVOSB | VBE | NC S-Corp**

The Claude Code MCP integration layer for the M2M sovereign platform stack —
PROMETHEUS governance, DART Sovereign Skill System, and procurement compliance
pipeline. Ultracode-ready. FL/II Doctrine enforced.

---

## Architecture

```
Claude Code (ultracode session)
       │
       ▼
m2m-sovereign-mcp-server
       │
       ├── Procurement Tools ──► Supabase (procurement_pipeline, RLS enforced)
       ├── PROMETHEUS Tools  ──► Supabase (prometheus_reviews, risk_register, audit_log)
       └── DART Tools        ──► Supabase (dart_skill_executions, dart_definition_of_done)
                                       │
                               n8n workflow ──► M365 Outlook/Teams
                               Make.com     ──► Judge Model → VOICE-GATE
```

---

## Tool Domains

### Procurement Compliance (3 tools)
| Tool | Description |
|---|---|
| `procurement_get_pending` | Pulls `pending_compliance_review` records — RLS scoped to `agent_orchestrated` tier |
| `procurement_update_status` | Transitions record status — hard-blocks `approved_production` without human signature |
| `procurement_log_assessment` | Persists AI compliance assessment with full reasoning chain |

### PROMETHEUS Governance (3 tools)
| Tool | Description |
|---|---|
| `prometheus_create_review` | Triggers governance review — validates certifications, blocks SAF/SDVOSB |
| `prometheus_get_risk_register` | Returns active risk register sorted by severity |
| `prometheus_log_audit` | Manual audit event with trace_id — required for regulatory inspection |

### DART Skill System + Definition of Done (4 tools)
| Tool | Description |
|---|---|
| `dart_log_skill_execution` | Records DART skill run with gate results — blocks COMPLETE if gates failed |
| `dart_build_dod` | Generates full DoD criteria for any skill/platform/OS lane combination |
| `dart_submit_dod` | Persists DoD gate evaluation — upserts on skill_id + platform |
| `dart_get_dod_status` | Returns DoD status report across all platforms for a skill |

---

## Definition of Done — Six Gate Layers

Every DART skill across every platform must pass all six gates:

| Gate | Enforces |
|---|---|
| **Functional** | Skill executes correctly, idempotently, with structured errors |
| **Compliance** | No secrets, no blocked status transitions, no SAF/SDVOSB violation |
| **VOICE-GATE** | Anti-AI-Tell Doctrine v1.0 — zero banned vocabulary, sovereign register |
| **Trust Gate** | Seven Must-Haves — Trust, Context, Liability, Taste, Intent, Intentional Intent, Fractional Legitimacy |
| **Integration** | Platform-specific wire checks (Supabase RLS, n8n wiring, GitHub presence, etc.) |
| **Audit Trail** | trace_id on every write, PROMETHEUS log entry, workflow_run_id stamped |

A skill is **done** only when all six gates pass on all target platforms.

---

## Platforms Covered by DoD

`SUPABASE` | `NOTION` | `MAKE` | `N8N` | `VERCEL` | `GITHUB` | `OBSIDIAN`

---

## Ultracode Usage

This server is built for ultracode sessions. Use it correctly:

```bash
# Session-level — Claude decides when to fan out
/effort ultracode

# Single-task workflow — no session change
ultracode: audit all procurement_pipeline RLS paths for service_role bypass risk

# Drop back after heavy sessions
/effort high
```

**Use ultracode for:**
- Cross-platform DoD evaluation (all 7 platforms)
- PROMETHEUS risk register + governance sweep
- Full DART skill system integrity check (SKL-001–SKL-012)
- n8n workflow architecture completion

**Use `/effort high` for:** routine patches, single-tool additions, type fixes.

---

## Setup

### Prerequisites
- Node.js >=18
- Claude Code v2.1.154+ (`claude --version`)
- Supabase project: `jnmywpfdykuybrxkdcmc`

### Install

```bash
git clone https://github.com/Kali-Dedwen/drivenbydesign1-tech
cd m2m-mcp-server
npm install
cp .env.example .env
# Fill in SUPABASE_URL and SUPABASE_ANON_KEY (anon key — not service key)
```

### Run Migration

```bash
supabase migration up
```

### Build & Start

```bash
npm run build

# HTTP mode (production)
npm start

# stdio mode (Claude Code / ultracode)
node dist/index.js --stdio
```

### Connect to Claude Code

Add to your Claude Code MCP config:

```json
{
  "mcpServers": {
    "m2m-sovereign": {
      "command": "node",
      "args": ["/path/to/m2m-mcp-server/dist/index.js", "--stdio"],
      "env": {
        "SUPABASE_URL": "https://jnmywpfdykuybrxkdcmc.supabase.co",
        "SUPABASE_ANON_KEY": "your_anon_key"
      }
    }
  }
}
```

---

## Certification Posture — Non-Negotiable

| Entity | SDVOSB | VBE | Notes |
|---|---|---|---|
| M2M~Inc. | ✅ YES | ✅ YES | Sole SDVOSB holder |
| SAF (Solutions Afoot LLC) | 🚫 NEVER | ✅ YES | CAGE 9QVH2 |
| CenterMarq LLC | 🚫 NEVER | — | D-U-N-S 079427127 |

The PROMETHEUS server enforces this with a hard block on every governance review.
Any attribution of SDVOSB to SAF is a governance violation — not a warning.

---

## NC HUB Priority Note

**NC HUB-4052712 — Deadline: July 10, 2026**

Folder 03 (financial) and Folder 04 (reference letters) remain outstanding.
QuickBooks reconnection required for Folder 03.

This MCP server does not block that priority. HUB deadline outranks all
infrastructure work until July 10.

---

*M2M~Inc. Sovereign MCP Server v1.0 | June 2026*
*FL/II authenticated — To the work.*
*— Dr. Kevin A. Smith, Hon. D.H.L. | Chief Opportunity Officer | M2M~Inc.*
