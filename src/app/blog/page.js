import Link from "next/link";
import { client } from "@/libs/client";
import styles from "../page.module.css"; // トップページのCSSを再利用
import FadeIn from "@/components/FadeIn";
import BlogSort from "@/components/BlogSort";

export const metadata = {
  title: "Blog - 大学生の備忘録",
  description: "これまでに書いた記事の一覧です。",
};

// Next.js 15以降は searchParams を await する必要があります
export default async function BlogPage({ searchParams }) {
  const { order } = await searchParams;
  
  // ソート順の決定（デフォルトは降順：新しい順）
  const sortOrder = order || "-publishedAt";

  // 記事データの取得
  const { contents } = await client.get({
    endpoint: "blogs",
    queries: {
      orders: sortOrder,
      limit: 100, // とりあえず100件取得（ページネーションが必要なら別途追加）
    },
  });

  return (
    <div className={styles.mainWrapper}>
      {/* ヒーローエリア */}
      <section
        className={styles.hero}
        style={{ height: "40vh", minHeight: "300px" }}
      >
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle} style={{ fontSize: "2.5rem" }}>
            All Posts
          </h1>
          <p className={styles.heroSubtitle}>日々の学びのアーカイブ</p>
        </div>
      </section>

      {/* 記事一覧エリア */}
      <div className={styles.sectionWhite}>
        <div className={styles.container}>
          
          {/* ソートボタンを配置 */}
          <FadeIn>
            <BlogSort />
          </FadeIn>

          {contents.length === 0 ? (
            <p style={{ textAlign: "center", color: "#64748b" }}>
              記事がまだありません。
            </p>
          ) : (
            <ul className={styles.list}>
              {contents.map((blog, index) => (
                <FadeIn
                  tag="li"
                  key={blog.id}
                  delay={index * 0.05}
                  className={styles.listItem}
                >
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
                    {blog.tags && blog.tags.length > 0 && (
                      <div className={styles.tagList}>
                        {blog.tags.map((tag) => (
                          <span key={tag.id} className={styles.tagBadge}>
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </FadeIn>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}