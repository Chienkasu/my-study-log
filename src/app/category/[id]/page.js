import Link from "next/link";
import { client } from "@/libs/client";
import styles from "../../page.module.css"; // トップページのCSSを再利用！

// 静的パス生成（存在するカテゴリID分だけページを作る）
export async function generateStaticParams() {
  const { contents } = await client.get({ endpoint: "categories" });
  return contents.map((category) => ({
    id: category.id,
  }));
}

export default async function CategoryPage({ params }) {
  const { id } = await params;

  // カテゴリ情報を取得（名前を表示するため）
  const category = await client.get({
    endpoint: "categories",
    contentId: id,
  });

  // そのカテゴリに紐付く記事だけを取得
  const { contents } = await client.get({
    endpoint: "blogs",
    queries: { filters: `category[equals]${id}` },
  });

  return (
    <div className={styles.mainWrapper}>
      {/* 簡易ヒーローエリア */}
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
            Category
          </span>
          <h1 className={styles.heroTitle} style={{ fontSize: "2.5rem" }}>
            {category.name}
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
                    <span className={styles.categoryBadge}>
                      {category.name}
                    </span>
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
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
