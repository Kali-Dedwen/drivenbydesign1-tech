// src/components/ModuleContentRenderer.tsx
// M2M~Inc. — Sovereign Platform
// Renders module content and exercise text with structured formatting.
// Replaces raw {e.content} and {e.exercise} string output in the module viewer.

import React from "react";

// ─── Color tokens (match existing I / $ palette) ────────────────────────────
const T = {
  white:      "#FFFFFF",
  whiteHigh:  "rgba(255,255,255,0.92)",
  whiteMid:   "rgba(255,255,255,0.80)",
  whiteLow:   "rgba(255,255,255,0.55)",
  gold:       "#C9A84C",
  goldLight:  "#E2C278",
  goldFaint:  "rgba(201,168,76,0.15)",
  goldBorder: "rgba(201,168,76,0.30)",
  border:     "rgba(255,255,255,0.08)",
  ink:        "#0A1223",
};

// ─── Types ───────────────────────────────────────────────────────────────────
type Block =
  | { kind: "paragraph"; text: string }
  | { kind: "bullet";    items: string[] }
  | { kind: "numbered";  items: string[] }
  | { kind: "heading";   text: string; level: 2 | 3 }
  | { kind: "part";      label: string; body: string };

// ─── Parser ──────────────────────────────────────────────────────────────────
function parseContent(raw: string): Block[] {
  if (!raw) return [];

  const lines = raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd());

  const blocks: Block[] = [];
  let bulletBuffer: string[] = [];
  let numberedBuffer: string[] = [];

  const flushBullets = () => {
    if (bulletBuffer.length) {
      blocks.push({ kind: "bullet", items: [...bulletBuffer] });
      bulletBuffer = [];
    }
  };
  const flushNumbered = () => {
    if (numberedBuffer.length) {
      blocks.push({ kind: "numbered", items: [...numberedBuffer] });
      numberedBuffer = [];
    }
  };
  const flushAll = () => {
    flushBullets();
    flushNumbered();
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Blank line — separator
    if (!line.trim()) {
      flushAll();
      i++;
      continue;
    }

    // Exercise Part headers: "Part 1, The Role Audit (15 min)" or "Part 1:"
    const partMatch = line.match(/^Part\s+(\d+)[,:]?\s*(.*)$/i);
    if (partMatch) {
      flushAll();
      const label = `Part ${partMatch[1]}${partMatch[2] ? " — " + partMatch[2] : ""}`;
      // Collect body lines until next Part or blank line
      const bodyLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].match(/^Part\s+\d+[,:]?/i)) {
        bodyLines.push(lines[i]);
        i++;
      }
      blocks.push({ kind: "part", label, body: bodyLines.join("\n").trim() });
      continue;
    }

    // Heading: "First:" / "Second:" / "Third:" / standalone capitalized label
    const thirdLevel = line.match(/^(First|Second|Third|Fourth|Fifth)[:\s]/i);
    if (thirdLevel) {
      flushAll();
      blocks.push({ kind: "heading", text: line, level: 3 });
      i++;
      continue;
    }

    // Numbered list: lines starting with "1." "2." "(1)" etc
    const numMatch = line.match(/^[\(\[]?(\d+)[\.\)\]]\s+(.+)$/);
    if (numMatch) {
      flushBullets();
      numberedBuffer.push(numMatch[2]);
      i++;
      continue;
    }

    // Bullet list: "- item" or "• item" or "* item"
    const bulletMatch = line.match(/^[-•*]\s+(.+)$/);
    if (bulletMatch) {
      flushNumbered();
      bulletBuffer.push(bulletMatch[1]);
      i++;
      continue;
    }

    // Scale questions: "(1) How much energy..." — treat as numbered
    const scaleMatch = line.match(/^\((\d+)\)\s+(.+)$/);
    if (scaleMatch) {
      flushBullets();
      numberedBuffer.push(line.replace(/^\(\d+\)\s+/, ""));
      i++;
      continue;
    }

    // Default: paragraph
    flushAll();
    // Accumulate consecutive non-list lines into one paragraph
    const paraLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].match(/^[-•*]\s+/) &&
      !lines[i].match(/^[\(\[]?\d+[\.\)\]]\s+/) &&
      !lines[i].match(/^Part\s+\d+[,:]?/i) &&
      !lines[i].match(/^(First|Second|Third|Fourth|Fifth)[:\s]/i)
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ kind: "paragraph", text: paraLines.join(" ") });
  }

  flushAll();
  return blocks;
}

// ─── Inline bold renderer (e.g. **text**) ────────────────────────────────────
function InlineText({ text, color }: { text: string; color: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, idx) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={idx} style={{ color: T.white, fontWeight: 700 }}>
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={idx} style={{ color }}>
            {p}
          </span>
        )
      )}
    </>
  );
}

// ─── Block renderers ─────────────────────────────────────────────────────────
function ParagraphBlock({ text }: { text: string }) {
  return (
    <p
      style={{
        margin: "0 0 16px",
        fontSize: 14,
        lineHeight: 1.85,
        color: T.whiteMid,
      }}
    >
      <InlineText text={text} color={T.whiteMid} />
    </p>
  );
}

function HeadingBlock({ text, level }: { text: string; level: 2 | 3 }) {
  const styles: React.CSSProperties =
    level === 2
      ? { fontSize: 15, fontWeight: 700, color: T.white, margin: "24px 0 10px", letterSpacing: 0.2 }
      : { fontSize: 13, fontWeight: 700, color: T.goldLight, margin: "20px 0 8px", textTransform: "uppercase", letterSpacing: 1.2 };
  return <div style={styles}>{text}</div>;
}

function BulletBlock({ items }: { items: string[] }) {
  return (
    <ul
      style={{
        margin: "0 0 18px",
        paddingLeft: 0,
        listStyle: "none",
      }}
    >
      {items.map((item, idx) => (
        <li
          key={idx}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            marginBottom: 10,
            fontSize: 14,
            lineHeight: 1.7,
            color: T.whiteMid,
          }}
        >
          <span
            style={{
              color: T.gold,
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 1.4,
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            ◆
          </span>
          <span>
            <InlineText text={item} color={T.whiteMid} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function NumberedBlock({ items }: { items: string[] }) {
  return (
    <ol
      style={{
        margin: "0 0 18px",
        paddingLeft: 0,
        listStyle: "none",
        counterReset: "m2m-counter",
      }}
    >
      {items.map((item, idx) => (
        <li
          key={idx}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 12,
            fontSize: 14,
            lineHeight: 1.7,
            color: T.whiteMid,
          }}
        >
          <span
            style={{
              minWidth: 24,
              height: 24,
              borderRadius: "50%",
              background: T.goldFaint,
              border: `1px solid ${T.goldBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: T.gold,
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            {idx + 1}
          </span>
          <span>
            <InlineText text={item} color={T.whiteMid} />
          </span>
        </li>
      ))}
    </ol>
  );
}

function PartBlock({ label, body }: { label: string; body: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${T.gold}`,
        borderRadius: "0 8px 8px 0",
        padding: "14px 18px",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          color: T.gold,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      {body && (
        <div style={{ fontSize: 13, lineHeight: 1.75, color: T.whiteMid }}>
          <InlineText text={body} color={T.whiteMid} />
        </div>
      )}
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
interface ModuleContentRendererProps {
  text: string;
  variant?: "content" | "exercise";
}

export function ModuleContentRenderer({
  text,
  variant = "content",
}: ModuleContentRendererProps) {
  const blocks = parseContent(text);

  return (
    <div style={{ width: "100%" }}>
      {blocks.map((block, idx) => {
        switch (block.kind) {
          case "paragraph":
            return <ParagraphBlock key={idx} text={block.text} />;
          case "heading":
            return <HeadingBlock key={idx} text={block.text} level={block.level} />;
          case "bullet":
            return <BulletBlock key={idx} items={block.items} />;
          case "numbered":
            return <NumberedBlock key={idx} items={block.items} />;
          case "part":
            return <PartBlock key={idx} label={block.label} body={block.body} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

export default ModuleContentRenderer;
