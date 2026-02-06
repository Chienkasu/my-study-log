import styles from "./page.module.css";
import Link from "next/link";

export const metadata = {
  title: "About - 大学生の備忘録",
  description: "Profile and Skills.",
};

export default function AboutPage() {
  return (
    <div className={styles.mainWrapper}>
      {/* --- ヒーローエリア --- */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>About Me</h1>
          <p className={styles.subtitle}>
            理学と工学の狭間で、<br />
            生命の仕組みとデジタルの可能性を探求する。
          </p>
        </div>
      </section>

      {/* --- プロフィールセクション --- */}
      <section className={styles.sectionWhite}>
        <div className={styles.container}>
          <div className={styles.profileGrid}>
            <div className={styles.profileText}>
              {/* 名前を出さずに "Profile" とするか、ニックネームにする */}
              <h2 className={styles.sectionTitle}>Profile</h2>
              <p className={styles.role}>Science Student / Developer</p>
              <p className={styles.bio}>
                都内の大学で生物化学を専攻している理系大学生。<br />
                生命現象を分子レベルで解明することに情熱を注ぐ一方、
                独学で習得したプログラミング技術（Python, Next.js）を活用して
                Webサービス開発やデータ解析を行っています。<br />
                新しい技術と科学の知見を組み合わせ、価値あるモノづくりを目指しています。
              </p>
            </div>
            {/* 抽象的なグラフィック（個人特定を防ぐため顔写真は避ける） */}
            <div className={styles.profileImagePlaceholder}>
              <div className={styles.circle}></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- スキルセクション（ここは技術的な興味なのでそのままでOK） --- */}
      <section className={styles.sectionGray}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleCenter}>Skills & Interests</h2>
          
          <div className={styles.skillsGrid}>
            {/* Tech Skills */}
            <div className={styles.skillCard}>
              <h3>Engineering</h3>
              <ul className={styles.skillList}>
                <li>Python (Data Analysis, Bot)</li>
                <li>Next.js / React</li>
                <li>Firebase</li>
                <li>TypeScript</li>
              </ul>
            </div>

            {/* Academic Skills */}
            <div className={styles.skillCard}>
              <h3>Academic</h3>
              <ul className={styles.skillList}>
                <li>Biological Chemistry</li>
                <li>Structural Biology</li>
                <li>Bayesian Statistics</li>
                <li>Machine Learning</li>
              </ul>
            </div>
            
             {/* Other Skills (個人情報になりそうな具体的な部活名などは伏せる) */}
             <div className={styles.skillCard}>
              <h3>Others</h3>
              <ul className={styles.skillList}>
                <li>Stock Investment</li>
                <li>Gymnastics</li>
                <li>English</li>
                <li>Chinese (Basics)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- 略歴 (Timeline) 具体名を伏せてぼかす --- */}
      <section className={styles.sectionWhite}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleCenter}>Background</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <span className={styles.year}>2026 (Planned)</span>
              <div className={styles.timelineContent}>
                <h3>Research Laboratory</h3>
                <p>研究室に配属予定</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <span className={styles.year}>2025 - Present</span>
              <div className={styles.timelineContent}>
                <h3>Personal Development</h3>
                <p>学習支援Webサービスの開発・運営</p>
              </div>
            </div>
             <div className={styles.timelineItem}>
              <span className={styles.year}>Present</span>
              <div className={styles.timelineContent}>
                <h3>University Student</h3>
                <p>理学部 生物学科 在学中</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- コンタクト --- */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>Get in Touch</h2>
          <p>お問い合わせはこちらから</p>
          {/* メールアドレスも公開用(info@など)があればそれにする、なければフォームへのリンク等 */}
          <Link href="mailto:your-email@example.com" className={styles.button}>
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}