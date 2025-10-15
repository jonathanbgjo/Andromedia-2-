import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api/client";
import type { AuthResponse, User } from "../types/auth";

type AuthState = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("andromedia_token"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("andromedia_user");
    return raw ? JSON.parse(raw) as User : null;
  });
  const [loading, setLoading] = useState(false);

  function persist(a: AuthResponse) {
    const u: User = { id: a.userId, email: a.email, displayName: a.displayName };
    localStorage.setItem("andromedia_token", a.token);
    localStorage.setItem("andromedia_user", JSON.stringify(u));
    setToken(a.token); setUser(u);
  }

  const login = async (email: string, password: string) => {
    setLoading(true);
    try { persist(await api<AuthResponse>("/auth/login", { method: "POST", body: { email, password } })); }
    finally { setLoading(false); }
  };

  const register = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    try { persist(await api<AuthResponse>("/auth/register", { method: "POST", body: { email, password, displayName } })); }
    finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem("andromedia_token");
    localStorage.removeItem("andromedia_user");
    setToken(null); setUser(null);
  };

  const value = useMemo<AuthState>(() => ({
    user, token, login, register, logout, isAuthenticated: !!token, loading
  }), [user, token, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
