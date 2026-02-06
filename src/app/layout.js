import { Noto_Sans_JP } from "next/font/google"; // Google Fontsからインポート

// フォントの設定
const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"], // 通常の太さと太字を読み込む
});

// globals.cssは不要なので削除またはコメントアウト
// import "./globals.css"; 

export const metadata = {
  title: "My Study Log",
  description: "A blog for my study notes.",
};

export default function RootLayout({ children }) {
  return (
    // <html>タグにフォントを適用
    <html lang="ja" className={notoSansJp.className}>
      <body>{children}</body>
    </html>
  );
}
