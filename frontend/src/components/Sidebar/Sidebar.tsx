import React from "react";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";

export interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
  return (
    <nav className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <Link to="/">
        <span className={styles.icon}>🏠</span>
        <span className={styles.label}>Home</span>
      </Link>
      <a href="#">
        <span className={styles.icon}>🔥</span>
        <span className={styles.label}>Trending</span>
      </a>
      <Link to="/subscriptions">
        <span className={styles.icon}>📺</span>
        <span className={styles.label}>Subscriptions</span>
      </Link>
      <Link to="/library">
        <span className={styles.icon}>📚</span>
        <span className={styles.label}>Library</span>
      </Link>
    </nav>
  );
}
