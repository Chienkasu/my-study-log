import styles from "./page.module.css";
import Link from "next/link";

export const metadata = {
  title: "About - 大学生の備忘録",
  description: "Profile and Skills.",
};

export default function AboutPage(): JSX.Element {
  return (
    <div className={styles.mainWrapper}>
      {/* ヒーローエリア --- */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>About Me</h1>
          <p className={styles.subtitle}>
            勉強頑張ります。<br />
            将来見返すための記録です。
          </p>
        </div>
      </section>

      {/* --- プロフィールセクション --- */}
      <section className={styles.sectionWhite}>
        <div className={styles.container}>
          <div className={styles.profileGrid}>
            <div className={styles.profileText}>
              <h2 className={styles.sectionTitle}>Profile</h2>
              <p className={styles.role}>Science Student / Developer</p>
              <p className={styles.bio}>
                都内の大学で生物を専攻している理系大学生です。<br />
                細胞をいじったりピペットマンを握ったりする一方で、
                AIとプログラミング技術 (Python, Next.js) を活用して
                Webサービス開発やデータ解析を行っています。<br />
                新しい技術と科学の知見を組み合わせ、価値あるモノづくりを目指しています。
              </p>
            </div>
            <div className={styles.profileImagePlaceholder}>
              <div className={styles.circle}></div>
            </div>
          </div>
        </div>
      </section>

      {/* スキルセクション */}
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
          </div>
        </div>
      </section>

      {/* 略歴 (Timeline) */}
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
                <p>学習支援Webサービスの開発</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <span className={styles.year}>Present</span>
              <div className={styles.timelineContent}>
                <h3>University Student</h3>
                <p>理学部生物学科 在学中</p>
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
          <Link href="mailto:tintack22@gmail.com" className={styles.button}>
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}