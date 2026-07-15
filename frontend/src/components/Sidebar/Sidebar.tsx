import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

export interface SidebarProps {
  collapsed?: boolean;
}

type Icon = (props: { className?: string }) => JSX.Element;

const HomeIcon: Icon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
    <path d="M4 10.5L12 4l8 6.5V20h-6v-6h-4v6H4v-9.5z" />
  </svg>
);
const ShortsIcon: Icon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
    <path d="M17.77 6.6l-1.9-1.1a3.5 3.5 0 0 0-4.6 1.02L5.3 8.9a3.5 3.5 0 0 0 .38 6.42l1.9 1.1a3.5 3.5 0 0 0 4.6-1.02l5.97-2.38a3.5 3.5 0 0 0-.38-6.42zM10 15V9l5 3-5 3z" />
  </svg>
);
const SubsIcon: Icon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
    <path d="M18.7 8H5.3V7h13.4v1zM17 4H7v1h10V4zm4 6H3v10h18V10zm-11 8V12l5 3-5 3z" />
  </svg>
);
const LibraryIcon: Icon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
    <path d="M4 6H2v14a2 2 0 0 0 2 2h14v-2H4V6zm16-4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-8 12V6l6 4-6 4z" />
  </svg>
);
const HistoryIcon: Icon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
    <path d="M13 3a9 9 0 0 0-9 9H1l4 4 4-4H6a7 7 0 1 1 7 7 6.97 6.97 0 0 1-4.95-2.05l-1.42 1.42A9 9 0 1 0 13 3zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
  </svg>
);
const LikedIcon: Icon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
    <path d="M3 11h3v10H3V11zm18 1.3c0-.72-.58-1.3-1.3-1.3h-5.19l.78-3.76.02-.26a1 1 0 0 0-.29-.7L14.17 5 8.6 10.6a1.3 1.3 0 0 0-.38.92V19.7c0 .72.58 1.3 1.3 1.3h7.8c.5 0 .95-.29 1.15-.74l2.62-6.12c.08-.2.11-.4.11-.6v-1.24z" />
  </svg>
);
const TrendingIcon: Icon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
    <path d="M14 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-8z" />
  </svg>
);

interface Item {
  to: string;
  label: string;
  Icon: Icon;
  external?: boolean;
}

const primary: Item[] = [
  { to: "/", label: "Home", Icon: HomeIcon },
  { to: "/shorts", label: "Shorts", Icon: ShortsIcon, external: true },
  { to: "/subscriptions", label: "Subscriptions", Icon: SubsIcon },
];

const you: Item[] = [
  { to: "/library", label: "Library", Icon: LibraryIcon },
  { to: "/history", label: "History", Icon: HistoryIcon, external: true },
  { to: "/liked", label: "Liked videos", Icon: LikedIcon, external: true },
];

const explore: Item[] = [
  { to: "/trending", label: "Trending", Icon: TrendingIcon, external: true },
];

function Row({ item }: { item: Item }) {
  const content = (
    <>
      <span className={styles.icon}>
        <item.Icon />
      </span>
      <span className={styles.label}>{item.label}</span>
    </>
  );

  if (item.external) {
    return (
      <a href="#" className={styles.row} onClick={(e) => e.preventDefault()}>
        {content}
      </a>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      className={({ isActive }) => `${styles.row} ${isActive ? styles.active : ""}`}
    >
      {content}
    </NavLink>
  );
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
  return (
    <nav className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.section}>
        {primary.map((item) => (
          <Row key={item.label} item={item} />
        ))}
      </div>

      {!collapsed && (
        <>
          <hr className={styles.divider} />
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>You</h3>
            {you.map((item) => (
              <Row key={item.label} item={item} />
            ))}
          </div>

          <hr className={styles.divider} />
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Explore</h3>
            {explore.map((item) => (
              <Row key={item.label} item={item} />
            ))}
          </div>
        </>
      )}
    </nav>
  );
}
