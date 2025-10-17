import React, { Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
// const Upload = React.lazy(() => import("./pages/Upload"));

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <nav style={{ display: "flex", gap: 12, padding: 10, borderBottom: "1px solid #eee" }}>
      <Link to="/">Home</Link>
      {isAuthenticated && <Link to="/upload">Upload</Link>}
      <div style={{ marginLeft: "auto" }}>
        {isAuthenticated ? (
          <>
            <span style={{ marginRight: 10 }}>Hi, {user?.displayName}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <span> · </span>
            <Link to="/register">Create account</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route
            path="/upload"
            element={
              <RequireAuth>
                <Upload />
              </RequireAuth>
            }
          /> */}
        </Routes>
      </Suspense>
    </>
  );
}
