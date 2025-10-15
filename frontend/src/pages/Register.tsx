import React, { FormEvent, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register, loading } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      if (!email || !password || !displayName) throw new Error("All fields are required.");
      if (password !== confirm) throw new Error("Passwords do not match.");
      await register(email.trim(), password, displayName.trim());
      navigate("/"); // or /welcome
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Registration failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Create account</h1>
      <form onSubmit={onSubmit}>
        <label>Display name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

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

        <label>Confirm password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <button disabled={loading} type="submit">
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <p style={{ marginTop: 8 }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
