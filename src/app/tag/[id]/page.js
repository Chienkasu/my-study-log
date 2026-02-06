import Link from "next/link";
import { client } from "@/libs/client";
import styles from "../../page.module.css";

// 静的パス生成
export async function generateStaticParams() {
  const { contents } = await client.get({ endpoint: "tags" });
  return contents.map((tag) => ({
    id: tag.id,
  }));
}

export default async function TagPage({ params }) {
  const { id } = await params;

  // タグ情報を取得
  const tag = await client.get({
    endpoint: "tags",
    contentId: id,
  });

  // そのタグが含まれる記事を取得（containsを使う）
  const { contents } = await client.get({
    endpoint: "blogs",
    queries: { filters: `tags[contains]${id}` },
  });

  return (
    <div className={styles.mainWrapper}>
      <section
        className={styles.hero}
        style={{ height: "40vh", minHeight: "300px" }}
      >
        <div className={styles.heroContent}>
          <span
            style={{
              color: "#cbd5e1",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            Tag
          </span>
          <h1 className={styles.heroTitle} style={{ fontSize: "2.5rem" }}>
            #{tag.name}
          </h1>
        </div>
      </section>

      <div className={styles.container}>
        <ul className={styles.list}>
          {contents.length === 0 ? (
            <p style={{ textAlign: "center" }}>記事がまだありません。</p>
          ) : (
            contents.map((blog) => (
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
                  {/* タグ表示 */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className={styles.tagList}>
                      {blog.tags.map((t) => (
                        <span key={t.id} className={styles.tagBadge}>
                          #{t.name}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
