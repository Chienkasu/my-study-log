import Link from "next/link";
import { client } from "@/libs/client";
import type { Blog, Category } from "@/types/microcms";
import styles from "../../page.module.css"; // トップページのCSSを再利用!
import BlogCard from "@/components/BlogCard";

// 静的パス生成 (存在するカテゴリID分だけページを作る)
export async function generateStaticParams(): Promise<{ id: string }[]> {
  const { contents } = await client.getList<Category>({ endpoint: "categories" });
  return contents.map((category) => ({
    id: category.id,
  }));
}

export default async function CategoryPage({ params }: { params: { id: string } }): Promise<JSX.Element> {
  const { id } = await params;

  // カテゴリ情報を取得(名前を表示するため)
  const category = await client.get<Category>({
    endpoint: "categories",
    contentId: id,
  });

  // そのカテゴリに紐付く記事だけを取得
  const { contents } = await client.getList<Blog>({
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
        <div className={styles.gridList}>
          {contents.length === 0 ? (
            <p style={{ textAlign: "center" }}>記事がまだありません。</p>
          ) : (
            contents.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}