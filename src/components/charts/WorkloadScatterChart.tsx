"use client";

import React, { useState } from "react";

interface WorkloadScatterChartProps {
  data: {
    name: string;
    workload: number;
    compliance: number;
    department: string;
    type: string;
  }[];
}

export default function WorkloadScatterChart({ data }: WorkloadScatterChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

  const width = 600;
  const height = 260;
  const padding = { top: 25, right: 35, bottom: 40, left: 50 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minX = 500;
  const maxX = 4000;
  const minY = 65;
  const maxY = 100;

  const getX = (val: number) => {
    return padding.left + ((val - minX) / (maxX - minX)) * chartW;
  };

  const getY = (val: number) => {
    return chartH - ((val - minY) / (maxY - minY)) * chartH + padding.top;
  };

  // Quadrant dividing lines: e.g. at workload=2200 and compliance=85%
  const splitX = getX(2200);
  const splitY = getY(85);

  const yTicks = [70, 80, 85, 90, 100];
  const xTicks = [1000, 2000, 3000, 4000];

  return (
    <div className="w-full h-full relative select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        {/* Quadrant Background Shading */}
        {/* Top-Right: High Workload / High SLA (Target) */}
        <rect
          x={splitX}
          y={padding.top}
          width={width - padding.right - splitX}
          height={splitY - padding.top}
          fill="#16803c"
          fillOpacity="0.04"
        />
        {/* Bottom-Right: High Workload / Low SLA (Capacity Constraint) */}
        <rect
          x={splitX}
          y={splitY}
          width={width - padding.right - splitX}
          height={chartH + padding.top - splitY}
          fill="#c62828"
          fillOpacity="0.04"
        />

        {/* Quadrant Dividers */}
        <line
          x1={splitX}
          y1={padding.top}
          x2={splitX}
          y2={chartH + padding.top}
          stroke="#CBD5E1"
          strokeDasharray="4 2"
          strokeWidth="1.2"
        />
        <line
          x1={padding.left}
          y1={splitY}
          x2={width - padding.right}
          y2={splitY}
          stroke="#CBD5E1"
          strokeDasharray="4 2"
          strokeWidth="1.2"
        />

        {/* Quadrant Labels */}
        <text
          x={width - padding.right - 8}
          y={padding.top + 14}
          textAnchor="end"
          fontSize="9"
          fontWeight="bold"
          fill="#16803c"
        >
          High Workload / High SLA (Ideal)
        </text>
        <text
          x={width - padding.right - 8}
          y={chartH + padding.top - 8}
          textAnchor="end"
          fontSize="9"
          fontWeight="bold"
          fill="#C62828"
        >
          High Workload / Low SLA (Capacity Constraint)
        </text>
        <text
          x={padding.left + 8}
          y={chartH + padding.top - 8}
          textAnchor="start"
          fontSize="9"
          fontWeight="bold"
          fill="#d97706"
        >
          Low Workload / Low SLA (Admin Review)
        </text>

        {/* Horizontal Grid lines */}
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
                fontSize="10"
                fill="#64748B"
              >
                {tick}%
              </text>
            </g>
          );
        })}

        {/* Vertical Grid lines */}
        {xTicks.map((tick) => {
          const x = getX(tick);
          return (
            <g key={tick}>
              <line
                x1={x}
                y1={padding.top}
                x2={x}
                y2={chartH + padding.top}
                stroke="#E2E8F0"
                strokeDasharray="3 3"
              />
              <text
                x={x}
                y={height - 15}
                textAnchor="middle"
                fontSize="10"
                fill="#64748B"
              >
                {tick.toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* Axis Labels */}
        <text
          x={padding.left + chartW / 2}
          y={height - 2}
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill="#475569"
        >
          Monthly Application Workload (Volume)
        </text>

        {/* Data Points */}
        {data.map((item, index) => {
          const cx = getX(item.workload);
          const cy = getY(item.compliance);
          const isHovered = hoveredPoint?.name === item.name;

          const dotColor =
            item.compliance >= 90
              ? "#16803c"
              : item.compliance < 80
              ? "#C62828"
              : "#1464A5";

          return (
            <g
              key={index}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint(item)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Point Circle */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 8 : 5.5}
                fill={dotColor}
                stroke="#FFFFFF"
                strokeWidth={isHovered ? 2.5 : 1.5}
                className="transition-all duration-150"
              />

              {/* Mini Label */}
              <text
                x={cx}
                y={cy - 8}
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill={isHovered ? "#0F3443" : "#475569"}
                className="pointer-events-none"
              >
                {item.name.replace(" Circle", "").replace(" Office", "")}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute z-20 pointer-events-none bg-white border border-slate-300 rounded shadow-md px-3 py-2 text-xs transform -translate-x-1/2 -translate-y-full transition-all space-y-1"
          style={{
            left: `${(getX(hoveredPoint.workload) / width) * 100}%`,
            top: `${(getY(hoveredPoint.compliance) / height) * 100 - 10}%`,
          }}
        >
          <p className="font-bold text-[#0F3443]">{hoveredPoint.name}</p>
          <p className="text-slate-600">
            Workload: <strong>{hoveredPoint.workload.toLocaleString()} apps</strong>
          </p>
          <p className="text-slate-600">
            SLA Compliance:{" "}
            <strong className="text-[#1464A5] font-mono">
              {hoveredPoint.compliance}%
            </strong>
          </p>
          <p className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1 py-0.5 rounded">
            {hoveredPoint.type}
          </p>
        </div>
      )}
    </div>
  );
}
