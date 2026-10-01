"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1 && (!totalItems || totalItems <= pageSize)) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = totalItems !== undefined ? Math.min(currentPage * pageSize, totalItems) : currentPage * pageSize;

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border-t border-slate-200 text-xs text-slate-600 ${className}`}
      aria-label="Table Pagination"
    >
      {/* Information text */}
      <div className="text-slate-600 select-none">
        {totalItems !== undefined ? (
          <span>
            Showing <strong className="font-semibold text-slate-800">{Math.min(startItem, totalItems)}</strong> to{" "}
            <strong className="font-semibold text-slate-800">{endItem}</strong> of{" "}
            <strong className="font-semibold text-slate-800">{totalItems}</strong> entries
          </span>
        ) : (
          <span>
            Page <strong className="font-semibold text-slate-800">{currentPage}</strong> of{" "}
            <strong className="font-semibold text-slate-800">{totalPages}</strong>
          </span>
        )}
      </div>

      {/* Page navigation controls */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`px-2.5 py-1.5 rounded-md border flex items-center gap-1 font-medium transition-colors cursor-pointer disabled:cursor-not-allowed ${
            currentPage <= 1
              ? "border-slate-200 text-slate-300 bg-slate-50"
              : "border-slate-300 text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100"
          }`}
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Numeric Page Buttons */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-slate-400 select-none"
                >
                  ...
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={`page-${pageNum}`}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? "page" : undefined}
                className={`min-w-[32px] h-8 px-2 rounded-md font-medium text-xs transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#0f293e] text-white shadow-xs font-bold"
                    : "text-slate-700 hover:bg-slate-100 border border-slate-200 bg-white"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-2.5 py-1.5 rounded-md border flex items-center gap-1 font-medium transition-colors cursor-pointer disabled:cursor-not-allowed ${
            currentPage >= totalPages
              ? "border-slate-200 text-slate-300 bg-slate-50"
              : "border-slate-300 text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100"
          }`}
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
