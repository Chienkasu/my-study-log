import Link from "next/link";
import { client } from "@/libs/client";
import styles from "../page.module.css"; // トップページのCSSを使い回し！

export const metadata = {
  title: "Categories - 大学生の備忘録",
  description: "All topics and categories.",
};

export default async function CategoriesPage() {
  // ここでは全件取得
  const { contents: categories } = await client.get({ 
    endpoint: "categories",
    queries: { limit: 100 } 
  });

  return (
    <div className={styles.mainWrapper}>
      {/* シンプルなヘッダーエリア */}
      <section className={styles.hero} style={{ height: "40vh", minHeight: "300px" }}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle} style={{ fontSize: "2.5rem" }}>All Topics</h1>
          <p className={styles.heroSubtitle}>興味のある分野を探す</p>
        </div>
      </section>

      <div className={styles.sectionWhite}>
        <div className={styles.container}>
          {/* グリッドですべて表示 */}
          <div className={styles.grid}>
            {categories.map((cat) => (
              <Link href={`/category/${cat.id}`} key={cat.id} className={styles.card}>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{cat.name}</h3>
                  <span className={styles.cardArrow}>→</span>
                </div>
              </Link>
            ))}
          </div>
          
          <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <Link href="/" className={styles.viewAllButton}>
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}