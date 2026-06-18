import Link from "next/link";
import { client } from "@/libs/client";
import type { Blog, Category } from "@/types/microcms";
import styles from "./page.module.css";
import FadeIn from "@/components/FadeIn";
import BlogCard from "@/components/BlogCard";
import GameButton from "@/components/GameButton";
import DragonsResults from "@/components/DragonsResults";

export const revalidate = 60;

export default async function Home(){
  // 記事とカテゴリを同時に取得
  const [blogsData, categoriesData] = await Promise.all([
    client.getList<Blog>({ endpoint: "blogs", queries: { limit: 5 } }), // 最新5件
    client.getList<Category>({ endpoint: "categories", queries: { limit: 100 } }),
  ]);

  const contents: Blog[] = blogsData.contents;
  const categories: Category[] = categoriesData.contents;

  // カテゴリ表示ロジック (トップページは3つまで)
  const visibleCategories = categories.slice(0, 3);
  const hasMoreCategories = categories.length > 3;

  return (
    <div className={styles.mainWrapper}>
      {/* --- ヒーローエリア --- */}
      <section className={styles.hero}>
        <FadeIn className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Keep Learning</h1>
          <p className={styles.heroSubtitle}>
            エレファント象パオーン
          </p>
          <div className={styles.heroButtons}>
            <Link href="/about" className={styles.primaryButton}>
              About Me
            </Link>
            <Link href="#latest-posts" className={styles.secondaryButton}>
              Read Blog
            </Link>
            <GameButton />
            <DragonsResults />
          </div>
        </FadeIn>
      </section>

      {/* --- カテゴリ一覧セクション --- */}
      <section className={styles.sectionGray}>
        <div className={styles.container}>
          <FadeIn>
            <h2 className={styles.sectionTitle}>Explore Topics</h2>
            <p className={styles.sectionDesc}>興味のある分野から記事を探す</p>
          </FadeIn>
          <div className={styles.grid}>
            {visibleCategories.map((cat, index) => (
              // index * 0.1 で順番にふわっと表示させる
              <FadeIn key={cat.id} delay={index * 0.1}>
                <Link href={`/category/${cat.id}`} className={styles.card}>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{cat.name}</h3>
                    <span className={styles.cardArrow}>→</span>
                  </div>
                </Link>
              </FadeIn>
            ))}
            {/* 3つ以上ある場合のみ 「More」 カードを表示 */}
            {hasMoreCategories && (
              <FadeIn delay={0.3}>
                <Link href="/categories" className={`${styles.card} ${styles.moreCard}`}>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>More Topics...</h3>
                    <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                      View all {categories.length} categories
                    </p>
                    <span className={styles.cardArrow}>→</span>
                  </div>
                </Link>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      {/*--- Aboutセクション ---*/}
      <section id="about" className={styles.sectionWhite}>
        <div className={styles.container}>
          <div className={styles.aboutWrapper}>
            <FadeIn className={styles.aboutText}>
              <h2 className={styles.sectionTitleLeft}>About This Log</h2>
              <p>
                生物を勉強している大学生の備忘録です。<br />
                日々の講義で学んだ知識から、趣味まで、
                幅広く記録しています。
              </p>
              <Link href="/about" className={styles.textLink}>
                プロフィール詳細を見る &rarr;
              </Link>
            </FadeIn>
            <FadeIn className={styles.aboutDecoration} delay={0.2}>
              <div className={styles.circle}></div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- 最新記事一覧エリア --- */}
      <div id="latest-posts" className={styles.sectionGray}>
        <div className={styles.container}>
          <FadeIn>
            <h2 className={styles.sectionTitle}>Latest Updates</h2>
          </FadeIn>
          <div className={styles.gridList}>
            {contents.map((blog, index) => (
              <FadeIn tag="div" key={blog.id} delay={index * 0.1}>
                <BlogCard blog={blog} />
              </FadeIn>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <FadeIn delay={0.2}>
              <Link href="/blog" className={styles.viewAllButton}>View All Posts</Link>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}