import Link from 'next/link';
import styles from './Breadcrumbs.module.css'; // 必要に応じて作成

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  lists: BreadcrumbItem[];
}

export default function Breadcrumbs({ lists }: BreadcrumbsProps){
  // lists = [{ name: "Home", path: "/"}, { name: "Blog", path: "/blog" }, ...]

  // JSON-LD (Google検索用構造化データ)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": lists.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://your-domain.com${item.path}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className={styles.nav} aria-label="Breadcrumb">
        <ol className={styles.list}>
          {lists.map((item, index) => (
            <li key={index} className={styles.item}>
              {lists.length - 1 === index ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <>
                  <Link href={item.path}>{item.name}</Link>
                  <span className={styles.separator}>/</span>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}