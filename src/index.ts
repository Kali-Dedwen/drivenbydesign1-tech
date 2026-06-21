// ============================================================
// M2M~Inc. Sovereign MCP Server — Main Entry Point
// Model 2 Message, Inc. | SDVOSB | VBE
// FL/II Doctrine | PROMETHEUS Governed | DART Enabled
// Ultracode compatible — dynamic workflow orchestration ready
// ============================================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express, { Request, Response } from "express";

import { registerProcurementTools } from "./tools/procurement.js";
import { registerPrometheusTools } from "./tools/prometheus.js";
import { registerDartTools } from "./tools/dart.js";

// -----------------------------------------------------------
// Server Initialization
// -----------------------------------------------------------

const server = new McpServer({
  name: "m2m-sovereign-mcp-server",
  version: "1.0.0",
});

// -----------------------------------------------------------
// Register All Tool Domains
// -----------------------------------------------------------

registerProcurementTools(server);
registerPrometheusTools(server);
registerDartTools(server);

// -----------------------------------------------------------
// Transport Selection
// CLI flag: --stdio for local Claude Code use
// Default: HTTP for remote/production deployment
// -----------------------------------------------------------

const useStdio = process.argv.includes("--stdio");

if (useStdio) {
  // Local mode — Claude Code CLI / ultracode sessions
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("M2M Sovereign MCP Server running (stdio) — ultracode ready");
} else {
  // Remote mode — production deployment on model2message.net
  const app = express();
  app.use(express.json());

  // Health check — Datadog synthetic testing target
  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "operational",
      server: "m2m-sovereign-mcp-server",
      version: "1.0.0",
      governance: "PROMETHEUS-active",
      dart: "SKL-001-to-SKL-012",
      timestamp: new Date().toISOString(),
    });
  });

  // MCP endpoint — streamable HTTP
  app.post("/mcp", async (req: Request, res: Response) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // Stateless — simpler to scale
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  // Procurement webhook — n8n integration
  // Maps to: POST /v1/workflows/procurement-engine in CLAUDE.md
  app.post("/v1/workflows/procurement-engine", async (req: Request, res: Response) => {
    res.json({
      received: true,
      trace_id: `M2M-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      message: "Procurement workflow ingestion acknowledged — n8n pipeline active",
      timestamp: new Date().toISOString(),
    });
  });

  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    console.log(`M2M Sovereign MCP Server running on port ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`MCP: http://localhost:${PORT}/mcp`);
    console.log(`Procurement webhook: http://localhost:${PORT}/v1/workflows/procurement-engine`);
  });
}
