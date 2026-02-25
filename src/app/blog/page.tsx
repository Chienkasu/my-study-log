import Link from "next/link";
import { client } from "@/libs/client";
import type { Blog } from "@/types/microcms";
import styles from "../page.module.css"; // トップページのCSSを再利用
import FadeIn from "@/components/FadeIn";
import BlogCard from "@/components/BlogCard";
import BlogSort from "@/components/BlogSort";
import Pagination from "@/components/Pagination";

export const metadata = {
  title: "Blog - 大学生の備忘録",
  description: "これまでに書いた記事の一覧です。",
};

// Next.js 15以降は searchParams を await する必要があります
export default async function BlogPage({ searchParams }: { searchParams: Promise<{ order?: string; page?: string }> }) {
  const { order, page } = await searchParams; // pageパラメータを取得

  // ページネーション設定
  const currentPage = page ? parseInt(page) : 1;
  const limit = 10; // 1ページあたりの表示件数

  // ソート順の決定 (デフォルトは降順 新しい順)
  const sortOrder = order || "-publishedAt";

  // 記事データの取得
  const data = await client.getList<Blog>({
    endpoint: "blogs",
    queries: {
      orders: sortOrder,
      limit: limit,
      offset: (currentPage - 1) * limit,
    },
  });

  const contents: Blog[] = data.contents;
  const totalCount = data.totalCount; // 全記事数(ページネーション計算用)

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
            <p style={{ textAlign: "center", color: "#64748b", marginTop: "2rem" }}>
              記事がまだありません。
            </p>
          ) : (
            <>
              <div className={styles.gridList}>
                {contents.map((blog, index) => (
                  <FadeIn tag="div" key={blog.id} delay={index * 0.05}>
                    <BlogCard blog={blog} />
                  </FadeIn>
                ))}
              </div>
              {/* ページネーションコンポーネント */}
              <FadeIn delay={0.2}>
                <Pagination totalCount={totalCount} current={currentPage} />
              </FadeIn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}