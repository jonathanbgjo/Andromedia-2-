// src/components/Navbar/Navbar.jsx
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <a href="#">Home</a>
      <a href="#">Trending</a>
      <input type="search" placeholder="Search" aria-label="Search" />
      <a href="#">Notifications</a>
      <a href="#">Create</a>
      <a href="#">Profile</a>
    </div>
  );
}
