import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import styles from "./MainLayout.module.css";

export default function MainLayout({ children }) {
  const location = useLocation();
  const pathname = location.pathname;

  // Detect top-level "group" (home vs watch) for nicer behavior
  const routeGroup = useMemo(
    () => (pathname.startsWith("/watch/") ? "watch" : "default"),
    [pathname]
  );

  const [collapsed, setCollapsed] = useState(routeGroup === "watch");
  const userToggledRef = useRef(false);
  const lastGroupRef = useRef(routeGroup);

  useEffect(() => {
    if (routeGroup !== lastGroupRef.current) {
      lastGroupRef.current = routeGroup;
      userToggledRef.current = false;                   
      setCollapsed(routeGroup === "watch");            
      setCollapsed(routeGroup === "watch");
    }
  }, [routeGroup]);

  const handleToggle = () => {
    userToggledRef.current = true;                      
    setCollapsed(c => !c);
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
