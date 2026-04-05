'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_BARS = [42, 68, 55, 82, 64, 90, 74];
const DEFAULT_TREND = [38, 45, 52, 61, 55, 70, 74];

export function StatsChart({ bars = DEFAULT_BARS, trend = DEFAULT_TREND }: { bars?: number[]; trend?: number[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const max = Math.max(...bars, 1);

  return (
    <div ref={ref} className="w-full">
      {/* Line chart area */}
      <div className="relative h-48 w-full overflow-hidden">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((pct) => (
          <div
            key={pct}
            className="absolute w-full border-t border-[var(--card-border)]"
            style={{ bottom: `${pct}%`, opacity: 0.6 }}
          />
        ))}

        {/* Bar chart */}
        <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-2 sm:gap-3 px-1">
          {bars.map((h, i) => (
            <div
              key={i}
              className="relative flex h-full flex-1 cursor-pointer flex-col items-center justify-end"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              {hoveredIndex === i && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-[var(--text-primary)] px-2.5 py-1 text-[10px] font-bold text-[var(--bg-page)] whitespace-nowrap shadow-lg"
                >
                  {h} orders
                </motion.div>
              )}

              <motion.div
                className="w-full rounded-t-lg transition-colors"
                style={{
                  background:
                    hoveredIndex === i
                      ? 'var(--primary)'
                      : 'linear-gradient(to top, color-mix(in srgb, var(--primary) 60%, transparent), color-mix(in srgb, var(--primary) 22%, transparent))',
                  minHeight: 6,
                  boxShadow: hoveredIndex === i ? '0 0 16px -4px rgba(255,122,0,0.6)' : 'none',
                }}
                initial={{ height: 0 }}
                animate={inView ? { height: `${(h / max) * 100}%` } : { height: 0 }}
                transition={{ duration: 0.7, delay: i * 0.07, ease: 'easeOut' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Labels */}
      <div className="mt-3 flex justify-around px-1">
        {LABELS.map((label, i) => (
          <span
            key={label}
            className={`flex-1 text-center text-[10px] font-semibold uppercase tracking-widest transition-colors ${
              hoveredIndex === i ? 'text-[var(--primary)]' : 'text-[var(--text-light)]'
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff9a3c]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--text-light)]">Orders</span>
        </div>
        <div className="h-3 w-px bg-[var(--card-border)]" />
        <span className="text-[10px] text-[var(--text-light)]">Last 7 days</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">+18.4% WoW</span>
        </div>
      </div>
    </div>
  );
}
