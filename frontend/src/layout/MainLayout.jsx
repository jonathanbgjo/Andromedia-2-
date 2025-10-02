import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import Home from "../pages/Home";
import styles from "./MainLayout.module.css";

export default function MainLayout() {
  return (
    <div>
      <Navbar />
      <div className={styles.app}>
        <Sidebar />
        <main className={styles.appContent}>
          <Home />
        </main>
      </div>
    </div>
  );
}
