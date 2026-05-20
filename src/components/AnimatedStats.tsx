"use client";

import { useEffect, useRef, useState } from "react";

type Stat = { value: number; suffix: string; label: string };

function useCountUp(target: number, duration = 1000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatItem({ stat }: { stat: Stat }) {
  const { count, ref } = useCountUp(stat.value);
  return (
    <div ref={ref} className="stat-item">
      <span className="stat-item__number">
        {count}
        {stat.suffix}
      </span>
      <span className="stat-item__label">{stat.label}</span>
    </div>
  );
}

type Props = {
  items: Stat[];
};

export function AnimatedStats({ items }: Props) {
  return (
    <div className="stats-section">
      <div className="container">
        <div className="stats-row">
          {items.map((stat) => (
            <StatItem key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </div>
  );
}
