"use client";

import React, { useState } from "react";

interface SLAComplianceChartProps {
  data: { month: string; compliance: number }[];
}

export default function SLAComplianceChart({ data }: SLAComplianceChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // SVG dimensions
  const width = 500;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minY = 75;
  const maxY = 100;

  const getY = (val: number) => {
    return chartH - ((val - minY) / (maxY - minY)) * chartH + padding.top;
  };

  const getX = (index: number) => {
    return padding.left + (index / (data.length - 1)) * chartW;
  };

  // Generate SVG path for line
  const points = data.map((d, i) => `${getX(i)},${getY(d.compliance)}`).join(" ");
  const areaPoints = `${getX(0)},${chartH + padding.top} ${points} ${getX(data.length - 1)},${chartH + padding.top}`;

  const yTicks = [75, 80, 85, 90, 95, 100];

  return (
    <div className="w-full h-full relative select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="slaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1464A5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1464A5" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines & Y-axis labels */}
        {yTicks.map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="3 3"
              />
              <text
                x={padding.left - 8}
                y={y + 3.5}
                textAnchor="end"
                fontSize="11"
                fill="#64748B"
                fontFamily="inherit"
              >
                {tick}%
              </text>
            </g>
          );
        })}

        {/* Statutory 85% Benchmark Line */}
        <line
          x1={padding.left}
          y1={getY(85)}
          x2={width - padding.right}
          y2={getY(85)}
          stroke="#D97706"
          strokeWidth="1.2"
          strokeDasharray="4 2"
        />
        <text
          x={width - padding.right}
          y={getY(85) - 4}
          textAnchor="end"
          fontSize="9"
          fill="#D97706"
          fontWeight="bold"
        >
          Statutory Threshold (85%)
        </text>

        {/* Gradient Area under line */}
        <polygon points={areaPoints} fill="url(#slaGradient)" />

        {/* Line Path */}
        <polyline
          fill="none"
          stroke="#1464A5"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* X-axis Month labels & interactive dots */}
        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.compliance);
          const isHovered = hoverIndex === i;

          return (
            <g
              key={d.month}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              className="cursor-pointer"
            >
              {/* Vertical guideline on hover */}
              {isHovered && (
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={chartH + padding.top}
                  stroke="#94A3B8"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              )}

              {/* X Month Label */}
              <text
                x={x}
                y={height - 10}
                textAnchor="middle"
                fontSize="11"
                fontWeight={isHovered ? "bold" : "normal"}
                fill={isHovered ? "#0F3443" : "#64748B"}
              >
                {d.month}
              </text>

              {/* Outer halo */}
              <circle
                cx={x}
                y={y}
                r={isHovered ? 7 : 4}
                fill={isHovered ? "#F5A623" : "#1464A5"}
                stroke="#FFFFFF"
                strokeWidth={isHovered ? "2.5" : "1.5"}
                className="transition-all duration-150"
              />
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip Popup */}
      {hoverIndex !== null && (
        <div
          className="absolute z-20 pointer-events-none bg-white border border-slate-300 rounded shadow-md px-2.5 py-1.5 text-xs transform -translate-x-1/2 -translate-y-full transition-all"
          style={{
            left: `${(getX(hoverIndex) / width) * 100}%`,
            top: `${(getY(data[hoverIndex].compliance) / height) * 100 - 8}%`,
          }}
        >
          <p className="font-bold text-[#0F3443]">{data[hoverIndex].month} 2026</p>
          <p className="text-slate-600">
            SLA Compliance:{" "}
            <strong className="text-[#1464A5] font-mono">
              {data[hoverIndex].compliance}%
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}
