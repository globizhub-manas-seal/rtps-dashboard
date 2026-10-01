import React from "react";

type StatusType = "on-track" | "at-risk" | "critical" | "breached" | "excellent" | "strong" | "attention" | "review" | "pending" | "default";

interface StatusBadgeProps {
  status: string;
  compact?: boolean;
  className?: string;
}

const statusMap: Record<string, StatusType> = {
  "On Track": "on-track",
  "At Risk": "at-risk",
  "Critical": "critical",
  "Breached": "breached",
  "Excellent": "excellent",
  "Strong": "strong",
  "Attention": "attention",
  "Review Required": "review",
  "Pending Review": "pending",
  "Under Explanation": "pending",
};

const styleMap: Record<StatusType, string> = {
  "on-track": "bg-[#e8f5ec] text-[#16803c] border-[#b9e4c5]",
  "at-risk": "bg-[#fef7e6] text-[#d97706] border-[#fde6a0]",
  "critical": "bg-[#fff3e8] text-[#ea580c] border-[#fdd5b5]",
  "breached": "bg-[#fde8e8] text-[#c62828] border-[#f5b5b5]",
  "excellent": "bg-[#e8f5ec] text-[#16803c] border-[#b9e4c5]",
  "strong": "bg-[#e8f5ec] text-[#16803c] border-[#b9e4c5]",
  "attention": "bg-[#fef7e6] text-[#d97706] border-[#fde6a0]",
  "review": "bg-[#fde8e8] text-[#c62828] border-[#f5b5b5]",
  "pending": "bg-[#fef7e6] text-[#d97706] border-[#fde6a0]",
  "default": "bg-slate-100 text-slate-700 border-slate-200",
};

const dotMap: Record<StatusType, string> = {
  "on-track": "bg-[#16803c]",
  "at-risk": "bg-[#d97706]",
  "critical": "bg-[#ea580c]",
  "breached": "bg-[#c62828]",
  "excellent": "bg-[#16803c]",
  "strong": "bg-[#16803c]",
  "attention": "bg-[#d97706]",
  "review": "bg-[#c62828]",
  "pending": "bg-[#d97706]",
  "default": "bg-slate-500",
};

export function StatusBadge({ status, compact = false, className = "" }: StatusBadgeProps) {
  const type = statusMap[status] || "default";
  const style = styleMap[type];
  const dot = dotMap[type];

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded font-semibold whitespace-nowrap ${
        compact ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-xs"
      } ${style} ${className}`}
      role="status"
      aria-label={`Status: ${status}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0`} aria-hidden="true" />
      {status}
    </span>
  );
}
