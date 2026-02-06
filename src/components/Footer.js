
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brand}>
            <h2 className={styles.logo}>IUMe</h2>
            <p className={styles.description}>
              Unlock your potential with personalized learning.
            </p>
          </div>
          
          <div className={styles.linksGrid}>
            <div className={styles.linkColumn}>
              <h3>Service</h3>
              <ul>
                <li><Link href="/tutors">Find Tutors</Link></li>
                <li><Link href="/how-it-works">How it works</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
              </ul>
            </div>
            <div className={styles.linkColumn}>
              <h3>Company</h3>
              <ul>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/news">News</Link></li>
              </ul>
            </div>
            <div className={styles.linkColumn}>
              <h3>Support</h3>
              <ul>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className={styles.bottomSection}>
          <p>&copy; {new Date().getFullYear()} IUMe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}