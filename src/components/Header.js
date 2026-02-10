"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import SearchBox from "./SearchBox"; 

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // 現在のURLパスを取得
  const isHome = pathname === "/"; // トップページかどうか判定

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const headerClass = (isHome && !isScrolled && !isMenuOpen) 
    ? styles.transparent 
    : styles.solid;
  
    return (
      <header
            className={`${styles.header} ${headerClass} ${
              isMenuOpen ? styles.menuOpen : ""
            }`}
          >
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          必死勉強の記録😅
        </Link>

        {/* デスクトップ用ナビ */}
        <nav className={styles.desktopNav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/about" className={styles.navLink}>About</Link>
          <Link href="/categories" className={styles.navLink}>Topics</Link>
          {/* ▼▼▼ ここで使っています ▼▼▼ */}
          <SearchBox />
        </nav>

        {/* スマホ用ハンバーガーボタン */}
        <button
          className={styles.hamburger}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
      </div>

      {/* モバイル用メニュー */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ""}`}>
        <nav className={styles.mobileNav}>
          <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link href="/categories" onClick={() => setIsMenuOpen(false)}>Topics</Link>
          {/* スマホメニュー内にも検索を置きたい場合はここにも <SearchBox /> を追加できますが、
              スタイルの調整が必要になるので一旦なしで進めます */}
        </nav>
      </div>
    </header>
  );
}