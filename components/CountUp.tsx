"use client";

import { useEffect, useState } from "react";

interface CountUpProps {
  value: number;
  durationMs?: number;
}

export function CountUp({ value, durationMs = 1200 }: CountUpProps) {
  const [display, setDisplay] = useState(0);
  const [resetSeed, setResetSeed] = useState(0);

  // Restart the animation every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setResetSeed((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const start = 0;
    const end = value;
    if (start === end) {
      setDisplay(end);
      return;
    }

    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const current = Math.round(start + (end - start) * progress);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(step);
    };

    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [value, durationMs, resetSeed]);

  return (
    <span className="bg-brand-gradient bg-clip-text text-transparent font-semibold">
      {display.toLocaleString("en-US")}
    </span>
  );
}
