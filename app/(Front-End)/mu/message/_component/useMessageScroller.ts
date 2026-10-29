"use client";

import { useCallback, useRef } from "react";

export function useMessageScroller() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const snapshotRef = useRef<{ height: number; top: number } | null>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = containerRef.current;
    if (!el) return;
    if (smooth) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  const captureScrollSnapshot = useCallback((el: HTMLDivElement) => {
    snapshotRef.current = { height: el.scrollHeight, top: el.scrollTop };
  }, []);

  const restoreScrollSnapshot = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = containerRef.current;
        const snapshot = snapshotRef.current;
        if (!el || !snapshot) return;
        el.scrollTop = el.scrollHeight - snapshot.height + snapshot.top;
        snapshotRef.current = null;
      });
    });
  }, []);

  return {
    containerRef,
    scrollToBottom,
    captureScrollSnapshot,
    restoreScrollSnapshot,
  };
}
