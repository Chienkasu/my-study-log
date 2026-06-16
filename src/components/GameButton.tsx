"use client";
import { useState, lazy, Suspense } from "react";
import styles from "./GameButton.module.css";

const BreakoutGame = lazy(() => import("./BreakoutGame"));

export default function GameButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={styles.button}
        onClick={() => setIsOpen(true)}
        aria-label="Play Block Breaker"
      >
        🧱 Play Game
      </button>
      {isOpen && (
        <Suspense fallback={null}>
          <BreakoutGame onClose={() => setIsOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
