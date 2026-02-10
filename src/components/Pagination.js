// src/components/Pagination.js
import Link from 'next/link';
import styles from './Pagination.module.css'; // CSSは後で定義

export default function Pagination({ totalCount, current = 1, basePath = '/blog' }) {
  const PER_PAGE = 10;
  const range = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i);
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  if (totalPages <= 1) return null;

  return (
    <div className={styles.wrapper}>
      {range(1, totalPages).map((number) => (
        <Link
          key={number}
          href={`${basePath}?page=${number}`}
          className={`${styles.item} ${current === number ? styles.active : ''}`}
        >
          {number}
        </Link>
      ))}
    </div>
  );
}