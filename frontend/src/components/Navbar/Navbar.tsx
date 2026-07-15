import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useAuth } from "../../auth/AuthContext";
import Avatar from "../Avatar/Avatar";

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
      {/* Left: menu + logo */}
      <div className={styles.left}>
        {onToggleSidebar && (
          <button
            className={styles.iconBtn}
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
              <path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z" />
            </svg>
          </button>
        )}

        <Link className={styles.brand} to="/" aria-label="Andromedia home">
          <span className={styles.logoMark} aria-hidden>
            <svg viewBox="0 0 28 20" width="28" height="20" aria-hidden>
              <path
                d="M27.4 3.1c-.32-1.2-1.26-2.14-2.46-2.46C22.77 0 14 0 14 0S5.23 0 3.06.64C1.86.96.92 1.9.6 3.1.02 5.28 0 10 0 10s.02 4.72.6 6.9c.32 1.2 1.26 2.14 2.46 2.46C5.23 20 14 20 14 20s8.77 0 10.94-.64c1.2-.32 2.14-1.26 2.46-2.46.58-2.18.6-6.9.6-6.9s-.02-4.72-.6-6.9z"
                fill="#FF0000"
              />
              <path d="M11.2 14.3l7.27-4.3-7.27-4.3z" fill="#fff" />
            </svg>
          </span>
          <span className={styles.brandText}>Andromedia</span>
        </Link>
      </div>

      {/* Center: search */}
      <div className={styles.center}>
        <form className={styles.search} onSubmit={onSearch}>
          <input
            className={styles.input}
            placeholder="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search"
          />
          <button className={styles.searchBtn} type="submit" aria-label="Search">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
              <path d="M20.87 20.17l-5.59-5.59A6.92 6.92 0 0 0 16.5 10a7 7 0 1 0-7 7 6.92 6.92 0 0 0 4.58-1.22l5.59 5.59.7-.7zM3.5 10a6 6 0 1 1 6 6 6 6 0 0 1-6-6z" />
            </svg>
          </button>
        </form>
        <button className={styles.micBtn} type="button" aria-label="Search with your voice" title="Search with your voice">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
          </svg>
        </button>
      </div>

      {/* Right: actions */}
      <div className={styles.right}>
        {isAuthenticated ? (
          <>
            <Link className={styles.createBtn} to="/upload" title="Create">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
                <path d="M12 4v7H5v2h7v7h2v-7h7v-2h-7V4z" />
              </svg>
              <span className={styles.createLabel}>Create</span>
            </Link>
            <Link className={styles.profileLink} to="/profile" title={user?.displayName}>
              <Avatar name={user?.displayName} size={32} />
            </Link>
            <button className={styles.textBtn} onClick={logout}>Sign out</button>
          </>
        ) : (
          <Link className={styles.signInBtn} to="/login">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
              <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.31 0-8 1.67-8 5v1h16v-1c0-3.33-4.69-5-8-5z" />
            </svg>
            <span>Sign in</span>
          </Link>
        )}
      </div>
    </header>
  );
}
