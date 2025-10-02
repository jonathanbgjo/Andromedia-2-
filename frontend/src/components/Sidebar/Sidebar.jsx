import styles from "./Sidebar.module.css";

export default function SideBar(){

    return(
        <nav className={styles.sidebar}>
            <a href="#">Home</a>
            <a href="#">Trending</a>
            <a href="#">Subscriptions</a>
            <a href="#">Library</a>
        </nav>
    )
}