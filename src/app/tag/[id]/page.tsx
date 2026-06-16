import Link from "next/link";
import { client } from "@/libs/client";
import type { Blog, Tag } from "@/types/microcms";
import styles from "../../page.module.css";
import BlogCard from "@/components/BlogCard";

// 静的パス生成
export async function generateStaticParams(): Promise<{ id: string }[]> {
  const { contents } = await client.getList<Tag>({ endpoint: "tags" });
  return contents.map((tag) => ({
    id: tag.id,
  }));
}

export default async function TagPage({ params }: { params: { id: string } }){
  const { id } = await params;

  // タグ情報を取得
  const tag = await client.get<Tag>({
    endpoint: "tags",
    contentId: id,
  });

  // そのタグが含まれる記事を取得 (containsを使う)
  const { contents } = await client.getList<Blog>({
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
      <div className={styles.sectionWhite}>
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
    </div>
  );
}