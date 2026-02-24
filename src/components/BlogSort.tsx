"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent } from "react";
import styles from "./BlogSort.module.css";

export default function BlogSort(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  // URLパラメータから現在のソート順を取得 (デフォルトは新しい順)
  const currentOrder = searchParams.get("order") || "-publishedAt";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrder = e.target.value;
    // URLクエリパラメータを更新してページ遷移(再取得)
    router.push(`/blog?order=${newOrder}`);
  };

  return (
    <div className={styles.container}>
      <label htmlFor="sort" className={styles.label}>Sort by: </label>
      <div className={styles.selectWrapper}>
        <select
          id="sort"
          value={currentOrder}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="-publishedAt">Newest</option>
          <option value="publishedAt">Oldest</option>
        </select>
      </div>
    </div>
  );
}