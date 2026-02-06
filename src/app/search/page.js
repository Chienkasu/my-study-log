import Link from "next/link";
import { client } from "@/libs/client";
import styles from "../page.module.css"; // トップページのCSSを再利用

export default async function SearchPage({ searchParams }) {
  // URLパラメータ (?q=...) を取得
  const { q } = await searchParams; // Next.js 15/16ではawaitが必要
  const query = q || "";

  // microCMSで検索 (qパラメータを使用)
  const { contents } = await client.get({
    endpoint: "blogs",
    queries: { q: query },
  });

  return (
    <div className={styles.mainWrapper}>
      <section className={styles.hero} style={{ height: "30vh", minHeight: "250px" }}>
        <div className={styles.heroContent}>
          <p style={{ color: "#cbd5e1" }}>Search Results for</p>
          <h1 className={styles.heroTitle} style={{ fontSize: "2rem" }}>
            "{query}"
          </h1>
        </div>
      </section>

      <div className={styles.container} style={{ padding: "4rem 1rem" }}>
        {contents.length === 0 ? (
          <p style={{ textAlign: "center" }}>該当する記事は見つかりませんでした。</p>
        ) : (
          <ul className={styles.list}>
            {contents.map((blog) => (
              <li key={blog.id} className={styles.listItem}>
                <Link href={`/blog/${blog.id}`} className={styles.link}>
                  <div className={styles.metaArea}>
                    <span className={styles.postDate}>
                      {new Date(blog.publishedAt).toLocaleDateString()}
                    </span>
                    {blog.category && (
                      <span className={styles.categoryBadge}>
                        {blog.category.name}
                      </span>
                    )}
                  </div>
                  <h3 className={styles.postTitle}>{blog.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}