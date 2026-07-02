import { useEffect, useState, createContext, useContext, useRef } from "react";
import { supabase } from "../lib/supabase";

const T = {
  navy:      "#0f2545",
  navyMid:   "#1a3a6b",
  gold:      "#c9a84c",
  goldLight: "#e8c96a",
  goldDim:   "#8a6e2e",
  ink:       "#1a1a2e",
  muted:     "#6b7a99",
  border:    "rgba(201,168,76,0.2)",
  white:     "#ffffff",
};

const AuthContext = createContext({ user: null, session: null, signOut: () => {} });

export function useAuthUser() {
  return useContext(AuthContext);
}

export default function AuthGate({ children }) {
  const [session, setSession]   = useState(null);
  const [checking, setChecking] = useState(true);

  // PKCE flow: Supabase delivers ?code= as a query param (not #access_token= hash).
  // detectSessionInUrl: true on the client handles the code exchange AND cleans the
  // ?code= from the URL bar automatically. Do not strip it here — doing so races the
  // async exchange and can delete the code before it is consumed, breaking sign-in.

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      if (newSession) setChecking(false);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); };

  if (checking)       return <PortalLoader label="Authenticating..." />;
  if (!session?.user) return <LoginScreen />;

  return (
    <AuthContext.Provider value={{ user: session.user, session, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function PortalLoader({ label }) {
  return (
    <div style={{ minHeight:"100vh", background:T.ink, display:"flex",
      flexDirection:"column", gap:14, alignItems:"center", justifyContent:"center",
      fontFamily:"'Inter','Segoe UI',sans-serif" }}>
      <div style={{ color:T.gold, fontFamily:"'Cormorant Garamond',serif",
        fontSize:"1.5rem", fontWeight:600, letterSpacing:"0.05em" }}>M2M~Inc.</div>
      <div style={{ color:T.muted, fontSize:13 }}>{label}</div>
    </div>
  );
}

function LoginScreen() {
  const [stage,   setStage]   = useState("email");
  const [email,   setEmail]   = useState("");
  const [sending, setSending] = useState(false);
  const [error,   setError]   = useState("");

  const redirectTo =
    typeof window !== "undefined"
      ? (() => {
          const path = window.location.pathname;
          const returnPath = path === "/dashboard" || path.startsWith("/dashboard/")
            ? "/dashboard" : "/portal";
          return `${window.location.origin}${returnPath}${window.location.search || ""}`;
        })()
      : undefined;

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setSending(true);
    setError("");
    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
      });
      if (signInError) throw signInError;
      setStage("sent");
    } catch (err) {
      setError(err?.message || "We couldn't send your link. Check the address and try again.");
    } finally {
      setSending(false);
    }
  };

  const reset = () => { setStage("email"); setEmail(""); setError(""); };

  return (
    <div style={{ minHeight:"100vh", background:T.ink, color:T.white,
      fontFamily:"'Inter','Segoe UI',sans-serif", display:"flex",
      alignItems:"center", justifyContent:"center", padding:"32px 20px" }}>
      <div style={{ width:"100%", maxWidth:440, background:T.navy,
        border:`1px solid ${T.border}`, borderRadius:16, padding:"32px 28px",
        boxShadow:"0 24px 60px rgba(0,0,0,0.35)" }}>

        <div style={{ color:T.gold, fontFamily:"'Cormorant Garamond',serif",
          fontSize:"1.6rem", fontWeight:600, letterSpacing:"0.05em", marginBottom:4 }}>
          M2M~Inc.
        </div>
        <div style={{ color:T.gold, fontSize:11, fontWeight:700, letterSpacing:2,
          textTransform:"uppercase", marginBottom:20 }}>Client Portal</div>

        {stage === "email" && (
          <form onSubmit={handleSend}>
            <h1 style={{ color:T.white, fontSize:22, fontWeight:700,
              margin:"0 0 8px", lineHeight:1.3 }}>Enter the portal</h1>
            <p style={{ color:"rgba(255,255,255,0.65)", fontSize:14,
              lineHeight:1.65, margin:"0 0 22px" }}>
              We'll email a one-time magic link to the address you used at intake.
              Your progress, checkpoints, and feedback follow your account across devices.
            </p>
            <label htmlFor="m2m-auth-email" style={{ display:"block", color:T.gold,
              fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase",
              marginBottom:6 }}>Email</label>
            <input id="m2m-auth-email" type="email" autoComplete="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" disabled={sending}
              style={{ width:"100%", boxSizing:"border-box",
                background:"rgba(255,255,255,0.05)", border:`1px solid ${T.border}`,
                borderRadius:8, padding:"11px 14px", color:T.white, fontSize:14,
                outline:"none", fontFamily:"inherit", marginBottom:14 }} />
            {error && <div style={{ color:"#ff8888", fontSize:12,
              marginBottom:12, lineHeight:1.5 }}>{error}</div>}
            <button type="submit" disabled={sending || !email.trim()}
              style={{ width:"100%",
                background: sending || !email.trim() ? "rgba(201,168,76,0.25)" : T.gold,
                border:"none", borderRadius:8, padding:"12px 18px",
                color: sending || !email.trim() ? T.goldDim : T.navy,
                fontSize:14, fontWeight:800,
                cursor: sending || !email.trim() ? "not-allowed" : "pointer",
                letterSpacing:0.5, transition:"all 0.15s" }}>
              {sending ? "Sending..." : "Send Magic Link →"}
            </button>
            <div style={{ marginTop:18, color:"rgba(255,255,255,0.4)", fontSize:11,
              lineHeight:1.55, textAlign:"center" }}>
              FL/II Doctrine - Trust/Liability Gate active
            </div>
          </form>
        )}

        {stage === "sent" && (
          <SentScreen email={email} onReset={reset} onUseCode={() => setStage("otp")} />
        )}

        {stage === "otp" && (
          <OtpScreen email={email} onReset={reset} />
        )}

      </div>
    </div>
  );
}

function SentScreen({ email, onReset, onUseCode }) {
  return (
    <div>
      <h1 style={{ color:"#fff", fontSize:22, fontWeight:700,
        margin:"0 0 12px", lineHeight:1.3 }}>Check your email</h1>
      <p style={{ color:"rgba(255,255,255,0.75)", fontSize:14,
        lineHeight:1.65, margin:"0 0 8px" }}>
        We sent a magic link to{" "}
        <span style={{ color:T.goldLight, fontWeight:600 }}>{email.trim()}</span>.
        Open it on this device to enter your portal.
      </p>
      <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13,
        lineHeight:1.6, margin:"0 0 22px" }}>
        Using a corporate email (Microsoft / Outlook / Exchange)? Your mail server
        may scan links before delivery. Use the 6-digit code instead.
      </p>
      <button onClick={onUseCode}
        style={{ width:"100%", background:T.gold, border:"none", borderRadius:8,
          padding:"12px 18px", color:T.navy, fontSize:14, fontWeight:800,
          cursor:"pointer", letterSpacing:0.5, marginBottom:10 }}>
        Enter 6-Digit Code Instead →
      </button>
      <button onClick={onReset}
        style={{ width:"100%", background:"transparent",
          border:`1px solid ${T.border}`, color:T.gold, padding:"10px 16px",
          borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer",
          letterSpacing:0.5 }}>
        Use a different email
      </button>
    </div>
  );
}

function OtpScreen({ email, onReset }) {
  const [digits,    setDigits]    = useState(["","","","","",""]);
  const [verifying, setVerifying] = useState(false);
  const [error,     setError]     = useState("");
  const inputRefs = useRef([]);

  const handleDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0)
      inputRefs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const token = digits.join("");
    if (token.length !== 6) return;
    setVerifying(true);
    setError("");
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token,
        type: "email",
      });
      if (verifyError) throw verifyError;
    } catch (err) {
      setError(err?.message || "Invalid or expired code. Request a new link.");
      setDigits(["","","","","",""]);
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const complete = digits.join("").length === 6;

  return (
    <div>
      <h1 style={{ color:"#fff", fontSize:22, fontWeight:700,
        margin:"0 0 8px", lineHeight:1.3 }}>Enter your code</h1>
      <p style={{ color:"rgba(255,255,255,0.65)", fontSize:14,
        lineHeight:1.65, margin:"0 0 24px" }}>
        Enter the 6-digit code from the email sent to{" "}
        <span style={{ color:T.goldLight, fontWeight:600 }}>{email.trim()}</span>.
      </p>

      <div style={{ display:"flex", gap:8, justifyContent:"center",
        marginBottom:20 }} onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input key={i}
            ref={el => inputRefs.current[i] = el}
            type="text" inputMode="numeric" maxLength={1}
            value={d}
            onChange={e => handleDigit(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            style={{ width:44, height:52, textAlign:"center",
              fontSize:22, fontWeight:700, color:T.white,
              background:"rgba(255,255,255,0.07)",
              border:`1.5px solid ${d ? T.gold : T.border}`,
              borderRadius:8, outline:"none", fontFamily:"inherit",
              transition:"border-color 0.15s" }}
          />
        ))}
      </div>

      {error && <div style={{ color:"#ff8888", fontSize:12,
        marginBottom:12, lineHeight:1.5, textAlign:"center" }}>{error}</div>}

      <button onClick={handleVerify} disabled={!complete || verifying}
        style={{ width:"100%",
          background: !complete || verifying ? "rgba(201,168,76,0.25)" : T.gold,
          border:"none", borderRadius:8, padding:"12px 18px",
          color: !complete || verifying ? T.goldDim : T.navy,
          fontSize:14, fontWeight:800,
          cursor: !complete || verifying ? "not-allowed" : "pointer",
          letterSpacing:0.5, transition:"all 0.15s", marginBottom:10 }}>
        {verifying ? "Verifying..." : "Enter Portal →"}
      </button>

      <button onClick={onReset}
        style={{ width:"100%", background:"transparent",
          border:`1px solid ${T.border}`, color:T.muted, padding:"10px 16px",
          borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer" }}>
        Start over
      </button>

      <div style={{ marginTop:16, color:"rgba(255,255,255,0.35)", fontSize:11,
        textAlign:"center", lineHeight:1.5 }}>
        Code expires in 10 minutes - FL/II Doctrine - Trust/Liability Gate active
      </div>
    </div>
  );
}
