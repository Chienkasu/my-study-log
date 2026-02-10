import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brand}>
            <h2 className={styles.logo}>必死勉強の記録😅</h2>
            <p className={styles.description}>
              Learning, Coding, and Archiving.
              <br />
              日々の学びを記録する個人的なアーカイブ。
            </p>
          </div>

          <div className={styles.linksGrid}>
            <div className={styles.linkColumn}>
                <h3>Contents</h3>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/about">About Profile</Link></li>
                  <li><Link href="/categories">All Topics</Link></li>
                </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <p>
            &copy; {new Date().getFullYear()} 必死勉強の記録😅
          </p>
        </div>
      </div>
    </footer>
  );
}
