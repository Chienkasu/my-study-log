"use client"; // これはクライアント側で動くので必須

import { useEffect } from "react";
import renderMathInElement from "katex/dist/contrib/auto-render";

// CSSはlayout.jsやpage.jsで読み込まれている前提なのでここではimport不要でも動きますが
// 念のため auto-render のスクリプト自体が動くようにします
export default function KatexScript() {
  useEffect(() => {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
    });
  }, []);
  
  return null; // 画面には何も表示しない（裏方として動く）
}