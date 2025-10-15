import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export interface NavbarProps {
  onToggleSidebar?: () => void;
  isCollapsed?: boolean;
}

/**
 * Navbar
 * - Accepts optional `onToggleSidebar` and `isCollapsed` so MainLayout can control it.
 * - Auth check uses localStorage token. Prefer "andromedia_token"; falls back to "token".
 */
export default function Navbar({ onToggleSidebar, isCollapsed }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Read either your new key or the old demo key
  const readToken = () =>
    localStorage.getItem("andromedia_token") || localStorage.getItem("token");

  const handleLogin = () => {
    // demo login (replace with real flow using your AuthContext or API)
    localStorage.setItem("andromedia_token", "dummy");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("andromedia_token");
    localStorage.removeItem("token"); // clean up old key too
    setIsLoggedIn(false);
  };

  useEffect(() => {
    setIsLoggedIn(!!readToken());
    // Keep state in sync if token changes in another tab
    const onStorage = () => setIsLoggedIn(!!readToken());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <header>
      <nav className="navbar navbar-light fixed-top bg-light shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand m-0 fw-bold" to="/">
            Andromedia
          </Link>

          {/* Optional sidebar toggle (only shows if prop is passed) */}
          {onToggleSidebar && (
            <button
              className="btn btn-outline-secondary me-3"
              type="button"
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              {isCollapsed ? "☰" : "×"}
            </button>
          )}

          <ul className="navbar-nav d-flex flex-row m-0 align-items-center">
            {isLoggedIn ? (
              <>
                <li className="nav-item mx-3">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item mx-3">
                  <Link className="nav-link" to="/upload">
                    Upload
                  </Link>
                </li>
                <li className="nav-item mx-3">
                  <Link className="nav-link" to="/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item mx-3">
                  <button className="btn btn-outline-danger" onClick={handleLogout}>
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item mx-3">
                  <Link className="nav-link" to="/signup">
                    Sign Up
                  </Link>
                </li>
                <li className="nav-item mx-3">
                  <Link className="nav-link" to="/login">
                    Log In
                  </Link>
                </li>
                {/* demo button to simulate login (remove once real auth is wired) */}
                <li className="nav-item mx-3">
                  <button className="btn btn-outline-primary" onClick={handleLogin}>
                    Demo Login
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
