import { useState, useEffect } from "react";

const MOCK_USER = {
  full_name: "Kevin A. Smith",
  email: "kev@model2message.net",
  current_level: 4,
  total_xp: 1240,
  streak: 7,
};

const LEVEL_THRESHOLDS = [
  { level: 1, xp_required: 0,    title: "Seeker" },
  { level: 2, xp_required: 250,  title: "Awakening" },
  { level: 3, xp_required: 600,  title: "Aligned" },
  { level: 4, xp_required: 1100, title: "Activated" },
  { level: 5, xp_required: 1800, title: "Architect" },
  { level: 6, xp_required: 2700, title: "Sovereign" },
  { level: 7, xp_required: 3800, title: "Sovereign Elite" },
  { level: 8, xp_required: 5200, title: "Sovereign Master" },
  { level: 9, xp_required: 7000, title: "Transcendent" },
  { level: 10, xp_required: 9500, title: "The Architect" },
];

const ALL_BADGES = [
  { slug: "first_login",     name: "The Arrival",       icon: "🚪", earned: true,  xp: 50  },
  { slug: "rpa_complete",    name: "RPA™ Activated",    icon: "🧭", earned: true,  xp: 100 },
  { slug: "pivot_p",         name: "Purpose Unlocked",  icon: "🔥", earned: true,  xp: 150 },
  { slug: "pivot_i",         name: "Identity Claimed",  icon: "⚡", earned: true,  xp: 150 },
  { slug: "pivot_v",         name: "Vision Anchored",   icon: "🔭", earned: false, xp: 150 },
  { slug: "pivot_o",         name: "Orientation Set",   icon: "🧿", earned: false, xp: 150 },
  { slug: "pivot_t",         name: "Traction Ignited",  icon: "🚀", earned: false, xp: 150 },
  { slug: "sovereign_shift", name: "Sovereign Shift",   icon: "👑", earned: false, xp: 500 },
  { slug: "streak_3",        name: "3-Day Sovereign",   icon: "🌱", earned: true,  xp: 75  },
  { slug: "streak_7",        name: "7-Day Sovereign",   icon: "🌿", earned: true,  xp: 200 },
  { slug: "streak_30",       name: "30-Day Sovereign",  icon: "🌳", earned: false, xp: 750 },
];

const PIVOT_STAGES = [
  { letter: "P", label: "Purpose",     complete: true  },
  { letter: "I", label: "Identity",    complete: true  },
  { letter: "V", label: "Vision",      complete: false },
  { letter: "O", label: "Orientation", complete: false },
  { letter: "T", label: "Traction",    complete: false },
];

const XP_LOG = [
  { source: "7-Day Streak Badge",      xp: 200, date: "Today" },
  { source: "Identity Stage Complete", xp: 150, date: "Yesterday" },
  { source: "Purpose Stage Complete",  xp: 150, date: "Apr 1" },
  { source: "RPA™ Completed",          xp: 100, date: "Apr 1" },
  { source: "First Login",             xp: 50,  date: "Mar 31" },
];

function getLevelData(totalXp) {
  const current = [...LEVEL_THRESHOLDS].reverse().find(l => totalXp >= l.xp_required);
  const next = LEVEL_THRESHOLDS.find(l => l.xp_required > totalXp);
  const progress = next
    ? ((totalXp - current.xp_required) / (next.xp_required - current.xp_required)) * 100
    : 100;
  return { current, next, progress };
}

function XPBar({ progress, currentXp, nextXp }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(progress), 300);
    return () => clearTimeout(t);
  }, [progress]);
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#7a8096", marginBottom: "8px", fontFamily: "'Space Mono', monospace" }}>
        <span>{currentXp.toLocaleString()} XP</span>
        <span>{nextXp ? `${nextXp.toLocaleString()} to next level` : "MAX LEVEL"}</span>
      </div>
      <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${animated}%`, background: "linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)", backgroundSize: "200% 100%", borderRadius: "3px", transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: "0 0 12px rgba(201,168,76,0.6)" }} />
      </div>
    </div>
  );
}

function PivotTrack({ stages }) {
  return (
    <div style={{ display: "flex", gap: "8px", width: "100%" }}>
      {stages.map((s, i) => (
        <div key={s.letter} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", width: "100%", position: "relative" }}>
            {i > 0 && <div style={{ position: "absolute", left: 0, right: "50%", top: "50%", height: "2px", background: stages[i-1].complete ? "#c9a84c" : "rgba(255,255,255,0.08)", transform: "translateY(-50%)" }} />}
            {i < stages.length - 1 && <div style={{ position: "absolute", left: "50%", right: 0, top: "50%", height: "2px", background: s.complete ? "#c9a84c" : "rgba(255,255,255,0.08)", transform: "translateY(-50%)" }} />}
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", background: s.complete ? "linear-gradient(135deg, #c9a84c, #f0d080)" : "rgba(255,255,255,0.04)", border: s.complete ? "none" : "2px solid rgba(255,255,255,0.1)", fontFamily: "'Playfair Display', serif", fontWeight: "700", fontSize: "20px", color: s.complete ? "#0a0b14" : "#3a3f54", position: "relative", zIndex: 1, boxShadow: s.complete ? "0 0 20px rgba(201,168,76,0.4)" : "none" }}>
              {s.complete ? "✓" : s.letter}
            </div>
          </div>
          <span style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: s.complete ? "#c9a84c" : "#3a3f54", fontFamily: "'Space Mono', monospace" }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function BadgeCard({ badge }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "16px 8px", borderRadius: "12px", background: badge.earned ? (hovered ? "rgba(201,168,76,0.15)" : "rgba(201,168,76,0.07)") : "rgba(255,255,255,0.02)", border: badge.earned ? "1px solid rgba(201,168,76,0.25)" : "1px solid rgba(255,255,255,0.05)", cursor: badge.earned ? "pointer" : "default", transition: "all 0.2s ease", filter: badge.earned ? "none" : "grayscale(1) opacity(0.3)", transform: hovered && badge.earned ? "translateY(-2px)" : "none" }}>
      <span style={{ fontSize: "28px" }}>{badge.icon}</span>
      <span style={{ fontSize: "9px", textAlign: "center", letterSpacing: "0.08em", textTransform: "uppercase", color: badge.earned ? "#c9a84c" : "#3a3f54", fontFamily: "'Space Mono', monospace", lineHeight: 1.3 }}>{badge.name}</span>
      {badge.earned && <span style={{ fontSize: "9px", color: "rgba(201,168,76,0.6)", fontFamily: "'Space Mono', monospace" }}>+{badge.xp} XP</span>}
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div style={{ flex: 1, padding: "20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
      <span style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#4a5068", fontFamily: "'Space Mono', monospace" }}>{label}</span>
      <span style={{ fontSize: "32px", fontWeight: "800", fontFamily: "'Playfair Display', serif", color: "#e8dfc0", lineHeight: 1 }}>{value}</span>
      {sub && <span style={{ fontSize: "11px", color: "#c9a84c", fontFamily: "'Space Mono', monospace" }}>{sub}</span>}
    </div>
  );
}

export default function PivotDashboard() {
  const user = MOCK_USER;
  const { current, next, progress } = getLevelData(user.total_xp);
  const [activeTab, setActiveTab] = useState("overview");
  const earned = ALL_BADGES.filter(b => b.earned).length;

  return (
    <div style={{ minHeight: "100vh", background: "#080910", backgroundImage: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,168,76,0.08) 0%, transparent 60%)", fontFamily: "'Space Mono', monospace", color: "#e8dfc0" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap'); @keyframes pulse-gold { 0%,100%{box-shadow:0 0 20px rgba(201,168,76,0.3)} 50%{box-shadow:0 0 35px rgba(201,168,76,0.6)} } * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100, background: "rgba(8,9,16,0.85)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #c9a84c, #f0d080)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "800", color: "#080910", fontFamily: "'Playfair Display', serif" }}>M</div>
          <span style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4a5068" }}>PIVOT OS™ · Model 2 Message</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "20px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
            <span style={{ fontSize: "14px" }}>🔥</span>
            <span style={{ fontSize: "12px", color: "#c9a84c" }}>{user.streak} day streak</span>
          </div>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #1e2440, #2a3060)", border: "2px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#c9a84c", fontWeight: "700" }}>{user.full_name.charAt(0)}</div>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>

        <div style={{ padding: "32px", borderRadius: "20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", marginBottom: "24px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#4a5068", marginBottom: "4px" }}>Welcome back</div>
              <div style={{ fontSize: "28px", fontWeight: "800", fontFamily: "'Playfair Display', serif", color: "#f0e8cc", lineHeight: 1.1 }}>{user.full_name}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ padding: "8px 20px", borderRadius: "30px", background: "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(240,208,128,0.1))", border: "1px solid rgba(201,168,76,0.4)", animation: "pulse-gold 3s infinite", marginBottom: "4px" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "13px", fontWeight: "700", color: "#f0d080", letterSpacing: "0.08em" }}>Level {current.level} · {current.title}</span>
              </div>
              {next && <span style={{ fontSize: "10px", color: "#4a5068" }}>Next: {next.title}</span>}
            </div>
          </div>
          <XPBar progress={progress} currentXp={user.total_xp} nextXp={next?.xp_required} />
        </div>

        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <StatCard label="Total XP" value={user.total_xp.toLocaleString()} sub="experience points" />
          <StatCard label="Badges" value={`${earned}/${ALL_BADGES.length}`} sub="earned" />
          <StatCard label="Streak" value={`${user.streak}d`} sub="days active" />
          <StatCard label="Level" value={current.level} sub={current.title} />
        </div>

        <div style={{ padding: "28px", borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "24px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#4a5068", marginBottom: "24px" }}>PIVOT OS™ Progress</div>
          <PivotTrack stages={PIVOT_STAGES} />
          <div style={{ marginTop: "20px", padding: "12px 16px", borderRadius: "8px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.12)", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>🔭</span>
            <div>
              <div style={{ fontSize: "11px", color: "#c9a84c", marginBottom: "2px" }}>Next Stage: Vision</div>
              <div style={{ fontSize: "10px", color: "#4a5068" }}>Complete the Vision session to earn 150 XP + Vision Anchored badge</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
          {["overview", "badges", "activity"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 20px", borderRadius: "8px", border: activeTab === tab ? "1px solid rgba(201,168,76,0.3)" : "1px solid transparent", background: activeTab === tab ? "rgba(201,168,76,0.1)" : "transparent", color: activeTab === tab ? "#c9a84c" : "#4a5068", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Space Mono', monospace", transition: "all 0.2s" }}>{tab}</button>
          ))}
        </div>

        {(activeTab === "overview" || activeTab === "badges") && (
          <div style={{ padding: "24px", borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "24px" }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#4a5068", marginBottom: "20px" }}>Achievement Badges</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "10px" }}>
              {ALL_BADGES.map(badge => <BadgeCard key={badge.slug} badge={badge} />)}
            </div>
          </div>
        )}

        {(activeTab === "overview" || activeTab === "activity") && (
          <div style={{ padding: "24px", borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#4a5068", marginBottom: "20px" }}>XP Activity</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {XP_LOG.map((event, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "8px", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#c9a84c", flexShrink: 0 }} />
                    <span style={{ fontSize: "12px", color: "#9aa0b8" }}>{event.source}</span>
                  </div>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#c9a84c", fontWeight: "700" }}>+{event.xp} XP</span>
                    <span style={{ fontSize: "10px", color: "#3a3f54", minWidth: "50px", textAlign: "right" }}>{event.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: "32px", textAlign: "center", fontSize: "10px", letterSpacing: "0.12em", color: "#2a2f42", textTransform: "uppercase" }}>
          PIVOT OS™ · Model 2 Message, Inc. · Human OS™ Ecosystem
        </div>

      </div>
    </div>
  );
}