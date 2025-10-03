import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import Home from "../pages/Home";
import styles from "./MainLayout.module.css";
import {useState} from 'react'

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.app}>
      <Navbar onToggleSidebar={() => setCollapsed(c => !c)} />

      <div className={styles.appBody}>
        <Sidebar collapsed={collapsed} />
        <main className={styles.appContent}>
          <Home />
        </main>
      </div>
    </div>
  );
}
