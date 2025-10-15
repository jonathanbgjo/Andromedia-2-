import { useState, useEffect, useRef, useMemo, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import styles from "./MainLayout.module.css";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const pathname = location.pathname;

  // Detect top-level "group" (home vs watch) for nicer behavior
  const routeGroup = useMemo<"watch" | "default">(
    () => (pathname.startsWith("/watch/") ? "watch" : "default"),
    [pathname]
  );

  const [collapsed, setCollapsed] = useState<boolean>(routeGroup === "watch");
  const userToggledRef = useRef<boolean>(false);
  const lastGroupRef = useRef<"watch" | "default">(routeGroup);

  useEffect(() => {
    if (routeGroup !== lastGroupRef.current) {
      lastGroupRef.current = routeGroup;
      userToggledRef.current = false;
      setCollapsed(routeGroup === "watch");
    }
  }, [routeGroup]);

  const handleToggle = () => {
    userToggledRef.current = true;
    setCollapsed((c) => !c);
  };

  return (
    <div className={styles.app}>
      <Navbar onToggleSidebar={handleToggle} isCollapsed={collapsed} />
      <div className={styles.appBody}>
        <Sidebar collapsed={collapsed} />
        <main className={styles.appContent}>{children}</main>
      </div>
    </div>
  );
}
