import Link from "next/link";
import { client } from "@/libs/client";
import type { Blog } from "@/types/microcms";
import styles from "../page.module.css"; // トップページのCSSを再利用
import BlogCard from "@/components/BlogCard"; // ← これを追加！

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  // URLパラメータ (?q=...)を取得
  const { q } = await searchParams; // Next.js 15/16ではawaitが必要
  const query = q || "";

  // microCMSで検索 (qパラメータを使用)
  const { contents } = await client.getList<Blog>({
    endpoint: "blogs",
    queries: { q: query },
  });

  const contentsTyped: Blog[] = contents;

  return (
    <div className={styles.mainWrapper}>
      <section className={styles.hero} style={{ height: "30vh", minHeight: "250px" }}>
        <div className={styles.heroContent}>
          <p style={{ color: "#cbd5e1" }}>Search Results for</p>
          <h1 className={styles.heroTitle} style={{ fontSize: "2rem" }}>
            &quot;{query}&quot;
          </h1>
        </div>
      </section>
      <div className={styles.container} style={{ padding: "4rem 1rem" }}>
        {contentsTyped.length === 0 ? (
          <p style={{ textAlign: "center" }}>該当する記事は見つかりませんでした。</p>
        ) : (
          <div className={styles.gridList}>
            {contentsTyped.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}