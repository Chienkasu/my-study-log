"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBox.module.css"; // 後で作る

export default function SearchBox(): JSX.Element {
  const [keyword, setKeyword] = useState<string>("");
  const router = useRouter();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    
    // 検索結果ページへ遷移
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
    setKeyword(""); // 入力欄をクリア
  };

  return (
    <form onSubmit={handleSearch} className={styles.form}>
      <input
        type="text"
        className={styles.input}
        placeholder="Search..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button type="submit" className={styles.button} aria-label="Search">
      </button>
    </form>
  );
}