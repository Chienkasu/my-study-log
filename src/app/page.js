import Link from "next/link";
import { client } from "@/libs/client";
import styles from "./page.module.css";

export default async function Home() {
  const { contents } = await client.get({ endpoint: "blogs" });

  return (
    <div className={styles.container}>
      {/* ▼▼▼ 追加：ヘッダーの下に濃い背景エリアを作る ▼▼▼ */}
      <section className={styles.hero}>
        <h1>Welcome to IUMe</h1>
        <p>未来を切り拓く学習プラットフォーム</p>
      </section>
      {/* ▲▲▲ 追加終わり ▲▲▲ */}

      <h2 className={styles.title}>学習記録</h2>
      <ul className={styles.list}>
        {contents.map((blog) => (
          <li key={blog.id} className={styles.listItem}>
            <Link href={`/blog/${blog.id}`} className={styles.link}>
              {blog.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}