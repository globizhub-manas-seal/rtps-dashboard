"use client";

import React, { useState } from "react";

interface SLADonutChartProps {
  data: { name: string; value: number; color: string }[];
}

export default function SLADonutChart({ data }: SLADonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative select-none">
      <div className="relative w-[180px] h-[180px]">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90 transform">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {data.map((item, index) => {
            const percent = item.value / total;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += percent;

            const isHovered = hoveredIndex === index;

            return (
              <circle
                key={item.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-150 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          {hoveredIndex !== null ? (
            <>
              <span className="text-[10px] uppercase font-bold text-slate-500 leading-tight">
                {data[hoveredIndex].name}
              </span>
              <span
                className="text-lg font-bold font-mono"
                style={{ color: data[hoveredIndex].color }}
              >
                {((data[hoveredIndex].value / total) * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {data[hoveredIndex].value.toLocaleString()}
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Volume</span>
              <span className="text-base font-extrabold text-[#0F3443] font-mono leading-tight">
                {total.toLocaleString()}
              </span>
              <span className="text-[9px] text-slate-500 font-medium">100% Monitored</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
