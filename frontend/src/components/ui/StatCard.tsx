import React, { useEffect, useState } from "react";

interface StatCardProps {
  value: number;
  suffix?: string;
  label: string;
  className?: string;
}

export function StatCard({ value, suffix = "", label, className }: StatCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalDuration = 1200; // ms
    const incrementTime = Math.max(Math.floor(totalDuration / end), 15);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={`flex items-baseline gap-2 ${className || ""}`}>
      <span className="text-5xl font-bold font-sans tracking-tight tabular-nums">
        {count}
        {suffix}
      </span>
      <span className="text-neutral-450 dark:text-neutral-400 text-sm font-light">
        {label}
      </span>
    </div>
  );
}
export default StatCard;
