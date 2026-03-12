"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";

export function SignupModal() {
  const { showSignupModal, setShowSignupModal, setShowLoginModal, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showSignupModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(email, username, password, displayName || undefined);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    background: "var(--surface, rgba(212,180,74,0.04))",
    border: "1px solid var(--border-medium, rgba(212,180,74,0.15))",
    borderRadius: "8px", color: "var(--text)", fontSize: "14px",
    outline: "none", fontFamily: "'EB Garamond', serif",
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        onClick={() => setShowSignupModal(false)}
      />
      <div
        className="fixed z-50"
        style={{
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "380px", maxWidth: "90vw",
          background: "var(--page-bg, #1E1A13)",
          border: "1px solid var(--border-medium)",
          borderRadius: "16px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          padding: "32px",
        }}
      >
        <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: "24px", color: "var(--accent, #D4B44A)", marginBottom: "4px" }}>
          Create Account
        </h2>
        <p style={{ fontSize: "13px", color: "var(--text-muted, #8A7D5E)", marginBottom: "24px" }}>
          Join The Quran Guide to track your reading journey
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required style={inputStyle} />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <input type="text" placeholder="Display Name (optional)" value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} style={inputStyle} />
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "12px", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <button
            onClick={() => { setShowSignupModal(false); setShowLoginModal(true); }}
            style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "'EB Garamond', serif" }}
          >
            Sign in
          </button>
        </p>
      </div>
    </>
  );
}
