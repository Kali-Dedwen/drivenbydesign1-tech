import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

const T = {
  navy:      "#0f2545",
  navyMid:   "#1a3a6b",
  navyLight: "#2a4f8f",
  gold:      "#c9a84c",
  goldLight: "#e8c96a",
  goldDim:   "#8a6e2e",
  cream:     "#faf8f4",
  muted:     "#6b7a99",
  border:    "rgba(201,168,76,0.2)",
  white:     "#ffffff",
};

const SYSTEM_PROMPT = `You are the M2M~Inc. site guide — the intelligence layer on the model2message.net website.
M2M~Inc. has three operating system lanes: PIVOT OS™ (individual reinvention for veterans, career transitioners, executives at threshold), BRIDGE OS™ (employer/SMB workforce transformation), and Human OS™ (enterprise/GovCon/C-suite).
Your role: Help visitors understand which lane fits them, answer questions about M2M, and route ready visitors to the triage form at https://form.jotform.com/261444279220050 or the portal at /portal.
When someone describes their situation, name which lane they belong in and why. Be direct. One question at a time.
Register: direct, grounded, peer-level. No corporate speak. No AI tells.
When urgency is clear (they need help now), drop the Jotform link directly: https://form.jotform.com/261444279220050
FL/II Doctrine active. No outcome guarantees.`;

const GREETING = "What brought you to M2M today?";

export default function SiteChat() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: GREETING, id: 0 },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");

    const userMsg = { role: "user", content: text, id: Date.now() };
    const assistantId = Date.now() + 1;

    setMessages(prev => [
      ...prev,
      userMsg,
      { role: "assistant", content: "", id: assistantId, streaming: true },
    ]);
    setStreaming(true);

    const history = [...messages, userMsg]
      .filter(m => m.content)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      abortRef.current = new AbortController();
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: SYSTEM_PROMPT,
          messages: history,
          stream: true,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok || !response.body) throw new Error(`API ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      let buffer = "";

      const processLine = (line) => {
        if (!line.startsWith("data:")) return;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") return;
        try {
          const data = JSON.parse(payload);
          if (data.type === "content_block_delta" && data.delta?.text) {
            full += data.delta.text;
            setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: full } : m));
          }
        } catch {}
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          buffer += decoder.decode();
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        let nlIdx;
        while ((nlIdx = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, nlIdx);
          buffer = buffer.slice(nlIdx + 1);
          processLine(line);
        }
      }
      if (buffer.length > 0) processLine(buffer);

      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: full, streaming: false } : m));
    } catch (err) {
      if (err.name !== "AbortError") {
        setMessages(prev => prev.map(m =>
          m.id === assistantId
            ? { ...m, content: "Connection hiccup. Try again, or jump straight to the triage form: https://form.jotform.com/261444279220050", streaming: false }
            : m
        ));
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [input, streaming, messages]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (pathname.startsWith("/portal")) return null;

  const panelWidth = isMobile ? "calc(100vw - 24px)" : 360;
  const panelHeight = isMobile ? "70vh" : 520;
  const panelBottom = isMobile ? 84 : 92;
  const panelRight = isMobile ? 12 : 24;

  return (
    <>
      <style>{`
        @keyframes m2mDot { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; } 40% { transform: scale(1); opacity: 1; } }
        .m2m-chat-link { color: ${T.goldLight}; text-decoration: underline; }
      `}</style>

      <button
        type="button"
        aria-label={isOpen ? "Close chat" : "Open chat with the M2M site guide"}
        onClick={() => setIsOpen(o => !o)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: T.navy,
          border: `2px solid ${T.gold}`,
          color: T.gold,
          fontSize: 24,
          fontWeight: 800,
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(15,37,69,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          fontFamily: "DM Sans, system-ui, sans-serif",
          transition: "transform 0.18s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {isOpen ? "×" : "M"}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="M2M site guide chat"
          style={{
            position: "fixed",
            bottom: panelBottom,
            right: panelRight,
            width: panelWidth,
            maxWidth: 420,
            height: panelHeight,
            maxHeight: "calc(100vh - 120px)",
            background: T.navy,
            borderRadius: 16,
            border: `1px solid ${T.border}`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9998,
            fontFamily: "DM Sans, system-ui, sans-serif",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 18px",
              borderBottom: `1px solid ${T.border}`,
              background: T.navyMid,
            }}
          >
            <div style={{ color: T.gold, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              M2M~Inc.
            </div>
            <div style={{ color: T.white, fontSize: 14, fontWeight: 600, marginTop: 2 }}>
              Site Guide
            </div>
            <div style={{ color: T.muted, fontSize: 11, marginTop: 3 }}>
              Three lanes. One question at a time.
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {messages.map(m => (
              <MessageBubble key={m.id} role={m.role} content={m.content} streaming={m.streaming} />
            ))}
            <div ref={bottomRef} />
          </div>

          <div
            style={{
              padding: "12px 14px",
              borderTop: `1px solid ${T.border}`,
              background: T.navy,
              display: "flex",
              gap: 8,
              alignItems: "flex-end",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Tell me where you're at…"
              rows={1}
              style={{
                flex: 1,
                resize: "none",
                background: "rgba(250,248,244,0.08)",
                color: T.white,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 13,
                fontFamily: "inherit",
                outline: "none",
                maxHeight: 100,
              }}
            />
            <button
              type="button"
              onClick={send}
              disabled={streaming || !input.trim()}
              style={{
                background: (streaming || !input.trim()) ? "rgba(201,168,76,0.2)" : T.gold,
                color: (streaming || !input.trim()) ? T.goldDim : T.navy,
                border: "none",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: 700,
                cursor: (streaming || !input.trim()) ? "default" : "pointer",
                fontFamily: "inherit",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function MessageBubble({ role, content, streaming }) {
  const isUser = role === "user";
  return (
    <div
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "85%",
        background: isUser ? T.gold : "rgba(250,248,244,0.08)",
        color: isUser ? T.navy : T.cream,
        padding: "9px 12px",
        borderRadius: 12,
        fontSize: 13,
        lineHeight: 1.5,
        border: isUser ? "none" : `1px solid ${T.border}`,
        wordBreak: "break-word",
      }}
    >
      {renderContent(content)}
      {streaming && !content && (
        <span style={{ display: "inline-flex", gap: 4 }}>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: T.gold,
                animation: `m2mDot 1.2s ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </span>
      )}
    </div>
  );
}

function renderContent(text) {
  if (!text) return null;
  const paragraphs = text.split(/\n{2,}/);
  return paragraphs.map((para, pIdx) => {
    const lines = para.split("\n");
    return (
      <p key={pIdx} style={{ margin: pIdx === 0 ? 0 : "8px 0 0 0" }}>
        {lines.map((line, lIdx) => (
          <span key={lIdx}>
            {renderInline(line, `${pIdx}-${lIdx}`)}
            {lIdx < lines.length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  });
}

function renderInline(text, keyPrefix) {
  if (!text) return null;
  const linkParts = text.split(/(https?:\/\/[^\s]+|\/portal\b)/g);
  const out = [];
  linkParts.forEach((part, i) => {
    const isExternal = /^https?:\/\//.test(part);
    const isInternal = part === "/portal" || part.startsWith("/portal");
    if (isExternal || isInternal) {
      out.push(
        <a
          key={`${keyPrefix}-l-${i}`}
          href={part}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="m2m-chat-link"
        >
          {part}
        </a>
      );
    } else {
      // Parse **bold** in plain text segments
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      boldParts.forEach((bp, j) => {
        if (/^\*\*[^*]+\*\*$/.test(bp)) {
          out.push(<strong key={`${keyPrefix}-b-${i}-${j}`}>{bp.slice(2, -2)}</strong>);
        } else if (bp) {
          out.push(<span key={`${keyPrefix}-t-${i}-${j}`}>{bp}</span>);
        }
      });
    }
  });
  return out;
}
