import React from "react";
import styles from "./Sidebar.module.css";

export interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
  return (
    <nav className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <a href="#">
        <span className={styles.icon}>🏠</span>
        <span className={styles.label}>Home</span>
      </a>
      <a href="#">
        <span className={styles.icon}>🔥</span>
        <span className={styles.label}>Trending</span>
      </a>
      <a href="#">
        <span className={styles.icon}>📺</span>
        <span className={styles.label}>Subscriptions</span>
      </a>
      <a href="#">
        <span className={styles.icon}>📚</span>
        <span className={styles.label}>Library</span>
      </a>
    </nav>
  );
}
