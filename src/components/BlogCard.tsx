import Link from "next/link";
import type { Blog } from "@/types/microcms";
import styles from "./BlogCard.module.css";

type Props = {
  blog: Blog;
};

export default function BlogCard({ blog }: Props){
  return (
    <Link href={`/blog/${blog.id}`} className={styles.card}>
      <div className={styles.cardContent}>
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
      </div>
    </Link>
  );
}