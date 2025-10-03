import styles from "./Navbar.module.css";

export default function Navbar({ onToggleSidebar, sidebarToggleDisabled }) {
  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuBtn}
          onClick={sidebarToggleDisabled ? undefined : onToggleSidebar}
          aria-label="Toggle sidebar"
          aria-disabled={sidebarToggleDisabled ? "true" : "false"}
          disabled={!!sidebarToggleDisabled}
          title={sidebarToggleDisabled ? "Sidebar disabled on this page" : "Toggle sidebar"}
        >
          ☰
        </button>
        <a href="/" className={styles.brand}>Home</a>
      </div>

      <div className={styles.center}>
        <form className={styles.searchForm} onSubmit={(e)=>e.preventDefault()}>
          <input className={styles.searchInput} type="search" placeholder="Search" />
          <button className={styles.searchBtn} type="submit">🔍</button>
        </form>
      </div>

      <nav className={styles.right}>
        <a className={styles.action} href="#">Create</a>
        <a className={styles.action} href="#" aria-label="Notifications">🔔</a>
        <a className={styles.action} href="#" aria-label="Profile">👤</a>
      </nav>
    </header>
  );
}
