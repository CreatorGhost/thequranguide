"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";

export function LoginModal() {
  const { showLoginModal, setShowLoginModal, setShowSignupModal, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showLoginModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
    setLoading(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        onClick={() => setShowLoginModal(false)}
      />
      <div
        className="fixed z-50"
        style={{
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "380px", maxWidth: "90vw",
          background: "var(--page-bg, #1E1A13)",
          border: "1px solid var(--border-medium, rgba(212,180,74,0.15))",
          borderRadius: "16px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          padding: "32px",
        }}
      >
        <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: "24px", color: "var(--accent, #D4B44A)", marginBottom: "4px" }}>
          Welcome Back
        </h2>
        <p style={{ fontSize: "13px", color: "var(--text-muted, #8A7D5E)", marginBottom: "24px" }}>
          Sign in to sync your reading progress
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <input
              type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              style={{
                width: "100%", padding: "10px 14px",
                background: "var(--surface, rgba(212,180,74,0.04))",
                border: "1px solid var(--border-medium)", borderRadius: "8px",
                color: "var(--text)", fontSize: "14px", outline: "none",
                fontFamily: "'EB Garamond', serif",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              style={{
                width: "100%", padding: "10px 14px",
                background: "var(--surface)", border: "1px solid var(--border-medium)",
                borderRadius: "8px", color: "var(--text)", fontSize: "14px",
                outline: "none", fontFamily: "'EB Garamond', serif",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#e55", fontSize: "12px", marginBottom: "12px" }}>{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "10px",
              background: "linear-gradient(135deg, #D4B44A, #B89830)",
              color: "#1A1610", fontWeight: 600, borderRadius: "8px",
              border: "none", cursor: "pointer", fontSize: "14px",
              fontFamily: "'EB Garamond', serif",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "12px", color: "var(--text-muted)" }}>
          Don&apos;t have an account?{" "}
          <button
            onClick={() => { setShowLoginModal(false); setShowSignupModal(true); }}
            style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "'EB Garamond', serif" }}
          >
            Sign up
          </button>
        </p>
      </div>
    </>
  );
}
