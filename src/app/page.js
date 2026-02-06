import Link from "next/link";
import { client } from "@/libs/client";
import styles from "./page.module.css"; // CSS Modulesのインポートはそのまま

export default async function Home() {
  const { contents } = await client.get({ endpoint: "blogs" });

  return (
    // シンプルなコンテナクラスのみ適用
    <div className={styles.container}>
      <h1 className={styles.title}>学習記録</h1>
      <ul className={styles.list}>
        {contents.map((blog) => (
          // liにクラスを適用
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
