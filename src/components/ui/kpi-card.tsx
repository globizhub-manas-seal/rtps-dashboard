import React from "react";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  accent?: "blue" | "orange" | "red" | "green" | "default";
  icon?: React.ReactNode;
}

const accentMap = {
  blue: "border-l-[#1464A5]",
  orange: "border-l-[#F5A623]",
  red: "border-l-[#C62828]",
  green: "border-l-[#16803C]",
  default: "border-l-[#1464A5]",
};

const valueColorMap = {
  blue: "text-[#1464A5]",
  orange: "text-[#d97706]",
  red: "text-[#C62828]",
  green: "text-[#16803C]",
  default: "text-[#1F2933]",
};

export function KpiCard({ title, value, subtitle, accent = "default", icon }: KpiCardProps) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-md shadow-sm border-l-[3px] ${accentMap[accent]} p-4 sm:p-5 transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">
            {title}
          </p>
          <p className={`text-2xl sm:text-[28px] font-bold leading-tight ${valueColorMap[accent]}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-slate-300 flex-shrink-0 mt-0.5">{icon}</div>
        )}
      </div>
    </div>
  );
}
