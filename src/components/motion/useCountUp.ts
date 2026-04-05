'use client';

import { useEffect, useRef, useState } from 'react';

export function useCountUp(end: number, durationMs = 1200, start = 0, decimals = 0) {
  const [value, setValue] = useState(start);
  const raf = useRef<number>(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;
    const tick = (now: number) => {
      if (startTime.current === null) startTime.current = now;
      const t = Math.min(1, (now - startTime.current) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      setValue(start + (end - start) * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [end, durationMs, start]);

  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
}
