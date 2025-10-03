// src/components/Navbar/Navbar.jsx
import styles from "./Navbar.module.css";

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className={styles.navbar}>
      {/* LEFT: toggle + Home */}
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuBtn}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          ☰
        </button>
        <a href="#" className={styles.brand}>Home</a>
      </div>

      {/* CENTER: search */}
      <div className={styles.center}>
        <form
          className={styles.searchForm}
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button className={styles.searchBtn} type="submit" aria-label="Search">
            🔍
          </button>
        </form>
      </div>

      {/* RIGHT: actions */}
      <nav className={styles.right} aria-label="User actions">
        <a className={styles.action} href="#">Create</a>
        <a className={styles.action} href="#" aria-label="Notifications">🔔</a>
        <a className={styles.action} href="#" aria-label="Profile">👤</a>
      </nav>
    </header>
  );
}
