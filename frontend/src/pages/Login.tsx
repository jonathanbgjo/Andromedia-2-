import React, { FormEvent, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      if (!email || !password) throw new Error("Email and password are required.");
      await login(email.trim(), password);
      navigate("/"); // or /dashboard
    } catch (err) {
      // `err` is unknown by default in TS, so narrow it safely
      if (err instanceof Error) setError(err.message);
      else setError("Login failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Sign in</h1>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <button disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p style={{ marginTop: 8 }}>
        No account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}
