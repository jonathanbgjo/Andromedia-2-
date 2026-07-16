import { Link } from "react-router-dom";
import styles from "./ComingSoon.module.css";

interface ComingSoonProps {
  feature: string;
  emoji?: string;
  blurb?: string;
}

/** Friendly placeholder for sidebar sections that aren't built yet. */
export default function ComingSoon({ feature, emoji = "🚧", blurb }: ComingSoonProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon} aria-hidden>{emoji}</div>
      <h1 className={styles.title}>{feature}</h1>
      <p className={styles.badge}>Development in progress</p>
      <p className={styles.blurb}>
        {blurb ?? `${feature} isn't ready yet — we're still building it. Check back soon.`}
      </p>
      <Link to="/" className={styles.homeBtn}>Back to Home</Link>
    </div>
  );
}
