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

const TOKEN_KEY = "andromedia_token";
const USER_KEY = "andromedia_user";

/** True if the JWT is missing, malformed, or past its `exp`. */
function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    if (!payload) return true;
    const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof claims.exp !== "number") return false; // no exp claim -> non-expiring
    return claims.exp * 1000 <= Date.now();
  } catch {
    return true; // unparseable -> treat as invalid
  }
}

/** Read the stored token, clearing auth if it's missing or expired. */
function readValidToken(): string | null {
  const t = localStorage.getItem(TOKEN_KEY);
  if (!t || isTokenExpired(t)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }
  return t;
}

/** Parse the stored user without letting corrupt JSON crash app startup. */
function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => readValidToken());
  const [user, setUser] = useState<User | null>(() =>
    localStorage.getItem(TOKEN_KEY) ? readStoredUser() : null
  );
  const [loading, setLoading] = useState(false);

  function persist(a: AuthResponse) {
    const u: User = { id: a.userId, email: a.email, displayName: a.displayName };
    localStorage.setItem(TOKEN_KEY, a.token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
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
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null); setUser(null);
  };

  const value = useMemo<AuthState>(() => ({
    user, token, login, register, logout,
    isAuthenticated: !!token && !isTokenExpired(token),
    loading
  }), [user, token, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
