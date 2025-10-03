import styles from "./Sidebar.module.css";

export default function Sidebar({ collapsed = false }) {
    return(
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
    )
}