import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useAuth } from "../../auth/AuthContext";

export interface NavbarProps {
  onToggleSidebar?: () => void;
  isCollapsed?: boolean; // we won’t change icon based on this anymore
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className={styles.bar}>
      {/* always show hamburger */}
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

      <ul className={styles.links}>
        {isAuthenticated ? (
          <>
            <li><Link className={styles.link} to="/dashboard">Dashboard</Link></li>
            <li><Link className={styles.link} to="/upload">Upload</Link></li>
            <li><Link className={styles.link} to="/profile">Profile</Link></li>
            <li>
              <button className={styles.buttonLink} onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <li><Link className={styles.link} to="/signup">Sign Up</Link></li>
            <li><Link className={styles.link} to="/login">Log In</Link></li>
          </>
        )}
      </ul>
    </header>
  );
}
