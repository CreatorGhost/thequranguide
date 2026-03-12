"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  display_name: string | null;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string, displayName?: string) => Promise<void>;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (v: boolean) => void;
  showSignupModal: boolean;
  setShowSignupModal: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  showLoginModal: false,
  setShowLoginModal: () => {},
  showSignupModal: false,
  setShowSignupModal: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const fetchUser = useCallback(async (accessToken: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setToken(accessToken);
        return;
      }
    } catch {}
    // Token invalid
    localStorage.removeItem("tqg-token");
    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("tqg-token");
    if (saved) {
      fetchUser(saved).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Login failed");
    }
    const data = await res.json();
    localStorage.setItem("tqg-token", data.access_token);
    setToken(data.access_token);
    await fetchUser(data.access_token);
    setShowLoginModal(false);
  }, [fetchUser]);

  const signup = useCallback(async (email: string, username: string, password: string, displayName?: string) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password, display_name: displayName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Signup failed");
    }
    const data = await res.json();
    localStorage.setItem("tqg-token", data.access_token);
    setToken(data.access_token);
    await fetchUser(data.access_token);
    setShowSignupModal(false);
  }, [fetchUser]);

  const logout = useCallback(() => {
    localStorage.removeItem("tqg-token");
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user, token, isLoading,
        login, signup, logout,
        showLoginModal, setShowLoginModal,
        showSignupModal, setShowSignupModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
