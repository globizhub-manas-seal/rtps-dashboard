import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-4 gap-4">
      <div>
        <h2 className="text-lg font-bold text-[#1F2933] tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-[#64748b] mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
