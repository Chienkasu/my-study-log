"use client";
import { motion, HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

interface FadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  className?: string;
  tag?: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap; // tagプロパティを追加
}

export default function FadeIn({ children, delay = 0, className = "", tag = "div", ...rest }: FadeInProps): JSX.Element {
  return (
    <motion.div
      as={tag as any}
      {...rest}
      initial={{ opacity: 0, y: 20 }} // 初期状態:透明で少し下にいる
      whileInView={{ opacity: 1, y: 0 }} // 画面に入ったら: 不透明で元の位置に戻る
      viewport={{ once: true, margin: "-50px" }} // 一度だけ実行、少し手前で発火
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }} // アニメーションの時間設定
      className={className}
    >
      {children}
    </motion.div>
  );
}