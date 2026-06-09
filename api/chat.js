// api/chat.js — M2M~Inc. Sovereign AI Proxy
// Vercel Edge Function: keeps ANTHROPIC_API_KEY server-side, never exposed to browser.
// Handles both streaming (chatbot) and non-streaming (opening message) calls.

export const config = { runtime: "edge" };

export default async function handler(req) {
  // CORS — allow requests from model2message.net and localhost dev
  const origin = req.headers.get("origin") || "";
  const allowed = ["https://model2message.net", "https://www.model2message.net", "http://localhost:3000"];
  const corsOrigin = allowed.includes(origin) ? origin : "https://model2message.net";

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const isStreaming = body.stream === true;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(errText, {
        status: anthropicRes.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": corsOrigin,
        },
      });
    }

    // Streaming: pipe the response directly back to the client
    if (isStreaming) {
      return new Response(anthropicRes.body, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Access-Control-Allow-Origin": corsOrigin,
          "X-Accel-Buffering": "no",
        },
      });
    }

    // Non-streaming: return JSON response
    const data = await anthropicRes.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": corsOrigin,
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Proxy error", detail: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": corsOrigin,
      },
    });
  }
}
