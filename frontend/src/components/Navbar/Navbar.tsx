import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useAuth } from "../../auth/AuthContext";

export interface NavbarProps {
  onToggleSidebar?: () => void;
  isCollapsed?: boolean;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (query) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className={styles.bar}>
      {onToggleSidebar && (
        <button
          className={styles.toggle}
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          ☰
        </button>
      )}

      <Link className={styles.brand} to="/">Andromedia</Link>

      <div className={styles.spacer} />

      {/* search bar */}
      <form className={styles.search} onSubmit={onSearch}>
        <input
          className={styles.input}
          placeholder="Search videos…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className={styles.searchBtn} type="submit">Search</button>
      </form>

      <ul className={styles.links}>
        {isAuthenticated ? (
          <>
            <li><Link className={styles.link} to="/upload">Upload</Link></li>
            <li><Link className={styles.link} to="/profile">{user?.displayName}</Link></li>
            <li><button className={styles.buttonLink} onClick={logout}>Log Out</button></li>
          </>
        ) : (
          <>
            <li><Link className={styles.link} to="/login">Log In</Link></li>
            <li><Link className={styles.link} to="/register">Sign Up</Link></li>
          </>
        )}
      </ul>
    </header>
  );
}
