import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "../lib/supabase";

// Mirrors the portal's design tokens so the login screen reads as part of the portal.
const T = {
  navy:     "#0f2545",
  navyMid:  "#1a3a6b",
  gold:     "#c9a84c",
  goldLight:"#e8c96a",
  goldDim:  "#8a6e2e",
  ink:      "#1a1a2e",
  muted:    "#6b7a99",
  border:   "rgba(201,168,76,0.2)",
  white:    "#ffffff",
};

const AuthContext = createContext({ user: null, session: null, signOut: () => {} });

export function useAuthUser() {
  return useContext(AuthContext);
}

export default function AuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  // PKCE flow: Supabase delivers ?code= as a query param (not #access_token= hash).
  // detectSessionInUrl: true on the client handles the code exchange automatically.
  // This effect just cleans up the ?code= from the URL bar after exchange completes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("code")) {
      // Remove ?code= from the URL bar once Supabase has consumed it.
      // The onAuthStateChange listener below will fire with the new session.
      const cleanUrl =
        window.location.pathname +
        window.location.search.replace(/[?&]code=[^&]+/, "").replace(/^&/, "?") +
        window.location.hash;
      window.history.replaceState({}, "", cleanUrl || window.location.pathname);
    }
  }, []);

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

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (checking) {
    return <PortalLoader label="Authenticating…" />;
  }

  if (!session?.user) {
    return <LoginScreen />;
  }

  const value = {
    user: session.user,
    session,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function PortalLoader({ label }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.ink,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          color: T.gold,
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.5rem",
          fontWeight: 600,
          letterSpacing: "0.05em",
        }}
      >
        M2M~Inc.
      </div>
      <div style={{ color: T.muted, fontSize: 13 }}>{label}</div>
    </div>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // PKCE: emailRedirectTo still points at the correct route.
  // Supabase will append ?code= to this URL when the user clicks the link.
  const redirectTo =
    typeof window !== "undefined"
      ? (() => {
          const path = window.location.pathname;
          const returnPath =
            path === "/dashboard" || path.startsWith("/dashboard/")
              ? "/dashboard"
              : "/portal";
          return `${window.location.origin}${returnPath}${window.location.search || ""}`;
        })()
      : undefined;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setSending(true);
    setError("");
    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: redirectTo,
        },
      });
      if (signInError) throw signInError;
      setSent(true);
    } catch (err) {
      setError(
        err?.message ||
          "We couldn't send your link. Check the email address and try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.ink,
        color: T.white,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: T.navy,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          padding: "32px 28px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            color: T.gold,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.6rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            marginBottom: 4,
          }}
        >
          M2M~Inc.
        </div>
        <div
          style={{
            color: T.gold,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          Client Portal
        </div>

        {sent ? (
          <div>
            <h1
              style={{
                color: T.white,
                fontSize: 22,
                fontWeight: 700,
                margin: "0 0 12px",
                lineHeight: 1.3,
              }}
            >
              Check your email
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: 14,
                lineHeight: 1.65,
                margin: "0 0 22px",
              }}
            >
              We sent a magic link to{" "}
              <span style={{ color: T.goldLight, fontWeight: 600 }}>{email.trim()}</span>.
              Open it on this device to enter your portal. The link expires after a single
              use.
            </p>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setEmail("");
                setError("");
              }}
              style={{
                background: "transparent",
                border: `1px solid ${T.border}`,
                color: T.gold,
                padding: "10px 16px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: 0.5,
              }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1
              style={{
                color: T.white,
                fontSize: 22,
                fontWeight: 700,
                margin: "0 0 8px",
                lineHeight: 1.3,
              }}
            >
              Enter the portal
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 14,
                lineHeight: 1.65,
                margin: "0 0 22px",
              }}
            >
              We'll email a one-time magic link to the address you used at intake. Your
              progress, checkpoints, and feedback follow your account across devices.
            </p>

            <label
              htmlFor="m2m-auth-email"
              style={{
                display: "block",
                color: T.gold,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              id="m2m-auth-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={sending}
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: "11px 14px",
                color: T.white,
                fontSize: 14,
                outline: "none",
                fontFamily: "inherit",
                marginBottom: 14,
              }}
            />

            {error && (
              <div
                style={{
                  color: "#ff8888",
                  fontSize: 12,
                  marginBottom: 12,
                  lineHeight: 1.5,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={sending || !email.trim()}
              style={{
                width: "100%",
                background:
                  sending || !email.trim() ? "rgba(201,168,76,0.25)" : T.gold,
                border: "none",
                borderRadius: 8,
                padding: "12px 18px",
                color: sending || !email.trim() ? T.goldDim : T.navy,
                fontSize: 14,
                fontWeight: 800,
                cursor: sending || !email.trim() ? "not-allowed" : "pointer",
                letterSpacing: 0.5,
                transition: "all 0.15s",
              }}
            >
              {sending ? "Sending…" : "Send Magic Link →"}
            </button>

            <div
              style={{
                marginTop: 18,
                color: "rgba(255,255,255,0.4)",
                fontSize: 11,
                lineHeight: 1.55,
                textAlign: "center",
              }}
            >
              FL/II Doctrine · Trust/Liability Gate active
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
