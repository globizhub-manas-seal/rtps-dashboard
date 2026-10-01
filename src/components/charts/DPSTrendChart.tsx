"use client";

import React, { useState } from "react";

interface DPSTrendChartProps {
  data: { month: string; score: number }[];
  isLowPerformer: boolean;
}

export default function DPSTrendChart({ data, isLowPerformer }: DPSTrendChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const width = 500;
  const height = 240;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minY = 50;
  const maxY = 100;

  const getY = (val: number) => {
    return chartH - ((val - minY) / (maxY - minY)) * chartH + padding.top;
  };

  const getX = (index: number) => {
    return padding.left + (index / (data.length - 1)) * chartW;
  };

  const points = data.map((d, i) => `${getX(i)},${getY(d.score)}`).join(" ");
  const areaPoints = `${getX(0)},${chartH + padding.top} ${points} ${getX(data.length - 1)},${chartH + padding.top}`;

  const strokeColor = isLowPerformer ? "#C62828" : "#16803c";
  const yTicks = [50, 60, 70, 80, 90, 100];

  return (
    <div className="w-full h-full relative select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="dpsTrendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y Grid lines */}
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
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Threshold Line at 80 */}
        <line
          x1={padding.left}
          y1={getY(80)}
          x2={width - padding.right}
          y2={getY(80)}
          stroke="#D97706"
          strokeWidth="1.2"
          strokeDasharray="4 2"
        />
        <text
          x={width - padding.right}
          y={getY(80) - 4}
          textAnchor="end"
          fontSize="9"
          fill="#D97706"
          fontWeight="bold"
        >
          Review Benchmark (80)
        </text>

        {/* Area */}
        <polygon points={areaPoints} fill="url(#dpsTrendGradient)" />

        {/* Line */}
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Points & X-axis labels */}
        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.score);
          const isHovered = hoverIndex === i;

          return (
            <g
              key={d.month}
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
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

              <circle
                cx={x}
                cy={y}
                r={isHovered ? 6.5 : 4}
                fill={isHovered ? "#F5A623" : strokeColor}
                stroke="#FFFFFF"
                strokeWidth={isHovered ? 2.5 : 1.5}
                className="transition-all duration-150"
              />
            </g>
          );
        })}
      </svg>

      {hoverIndex !== null && (
        <div
          className="absolute z-20 pointer-events-none bg-white border border-slate-300 rounded shadow-md px-2.5 py-1 text-xs transform -translate-x-1/2 -translate-y-full transition-all"
          style={{
            left: `${(getX(hoverIndex) / width) * 100}%`,
            top: `${(getY(data[hoverIndex].score) / height) * 100 - 8}%`,
          }}
        >
          <p className="font-bold text-[#0F3443]">{data[hoverIndex].month}</p>
          <p className="text-slate-600">
            Score:{" "}
            <strong className="font-mono" style={{ color: strokeColor }}>
              {data[hoverIndex].score}/100
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}
