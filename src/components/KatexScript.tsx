"use client"; // これはクライアント側で動くので必須
import { useEffect } from "react";
// @ts-expect-error: katex/dist/contrib/auto-renderの型定義が存在しないためエラーを抑制
import renderMathInElement from "katex/dist/contrib/auto-render";

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
  
  return null; // 画面には何も表示しない (裏方として動く)
}