import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="mb-6 pb-5 border-b border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-[#1F2933] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[#64748b] mt-1.5 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
