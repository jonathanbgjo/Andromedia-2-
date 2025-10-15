import React, { useEffect, useState } from "react";

export default function Navbar() {
  // In a real app, you'll replace this with actual auth check (JWT/localStorage)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // fake login (replace later with API)
    localStorage.setItem("token", "dummy");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
  useEffect(() => {
    // check token on mount
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);
  return (
    <header>
      <nav className="navbar navbar-light fixed-top bg-light shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <a className="navbar-brand m-0 fw-bold" href="/">
            Andromedia
          </a>

          <ul className="navbar-nav d-flex flex-row m-0 align-items-center">
            {isLoggedIn ? (
              <>
                <li className="nav-item mx-3">
                  <a className="nav-link" href="/dashboard">Dashboard</a>
                </li>
                <li className="nav-item mx-3">
                  <a className="nav-link" href="/upload">Upload</a>
                </li>
                <li className="nav-item mx-3">
                  <a className="nav-link" href="/profile">Profile</a>
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
                  <a className="nav-link" href="/signup">Sign Up</a>
                </li>
                <li className="nav-item mx-3">
                  <a className="nav-link" href="/login">Log In</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
