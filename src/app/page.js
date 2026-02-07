import Link from "next/link";
import { client } from "@/libs/client";
import styles from "./page.module.css";
import FadeIn from "@/components/FadeIn"; 
export const revalidate = 60;

export default async function Home() {
  // 記事とカテゴリを同時に取得
  const [blogsData, categoriesData] = await Promise.all([
    client.get({ endpoint: "blogs", queries: { limit: 5 } }), // 最新5件
    client.get({ endpoint: "categories", queries: { limit: 100 } }), 
  ]);

  const contents = blogsData.contents;
  const categories = categoriesData.contents;

  // カテゴリ表示ロジック（トップページは3つまで）
  const visibleCategories = categories.slice(0, 3);
  const hasMoreCategories = categories.length > 3;

  return (
    <div className={styles.mainWrapper}>
      {/* --- ヒーローエリア --- */}
      <section className={styles.hero}>
        <FadeIn className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Keep Learning</h1>
          <p className={styles.heroSubtitle}>
            大学での学び・技術・思考のアーカイブ
          </p>
          <div className={styles.heroButtons}>
            <Link href="/about" className={styles.primaryButton}>
              About Me
            </Link>
            <Link href="#latest-posts" className={styles.secondaryButton}>
              Read Blog
            </Link>
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

            {/* 3つ以上ある場合のみ「More」カードを表示 */}
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

      {/* --- Aboutセクション --- */}
      <section id="about" className={styles.sectionWhite}>
        <div className={styles.container}>
          <div className={styles.aboutWrapper}>
            <FadeIn className={styles.aboutText}>
              <h2 className={styles.sectionTitleLeft}>About This Log</h2>
              <p>
                生物化学を専攻している大学生の備忘録です。<br />
                日々の講義で学んだベイズ推定やフーリエ変換などの数学的知識から、
                趣味で開発しているWebアプリ（Next.js/Python）の技術ログまで、
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
          
          <ul className={styles.list}>
            {contents.map((blog, index) => (
              <FadeIn tag="li" key={blog.id} delay={index * 0.1} className={styles.listItem}>
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
          
          <div style={{textAlign: 'center', marginTop: '2rem'}}>
             <FadeIn delay={0.2}>
               <Link href="/blog" className={styles.viewAllButton}>View All Posts</Link>
             </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}