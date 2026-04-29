"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** ms delay before the reveal animation starts (used for stagger). */
  delay?: number;
  /** Tailwind / utility classes to merge with .reveal. */
  className?: string;
  /** Stop observing after first reveal (default true). */
  once?: boolean;
  /** rootMargin passed to IntersectionObserver (default "0px 0px -10% 0px"). */
  rootMargin?: string;
};

/**
 * Wrap any block to fade-up when it enters the viewport. Falls back gracefully
 * if IntersectionObserver isn't available (SSR / older browsers / reduced motion)
 * by rendering with the visible class on first paint client-side.
 *
 * The animation itself is defined in globals.css and is automatically suppressed
 * by the prefers-reduced-motion media query.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  once = true,
  rootMargin = "0px 0px -10% 0px",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const noObserver = typeof IntersectionObserver === "undefined";

    if (reduced || noObserver) {
      // Defer to the next microtask so setState doesn't fire synchronously
      // inside the effect body.
      const t = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(t);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { rootMargin, threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin]);

  const style: CSSProperties = delay
    ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
    : {};

  return (
    <div
      ref={ref}
      style={style}
      className={[
        "reveal",
        visible ? "is-visible" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
