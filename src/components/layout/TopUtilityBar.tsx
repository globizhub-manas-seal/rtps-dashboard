"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe, HelpCircle, PhoneCall } from "lucide-react";

export function TopUtilityBar() {
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [lang, setLang] = useState<"en" | "as">("en");

  return (
    <div
      role="region"
      aria-label="Government Utility Bar"
      suppressHydrationWarning
      className="bg-[#081B22] text-slate-200 text-[11px] sm:text-xs border-b border-[#143947] py-1 px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2"
    >
      {/* Left: Official Government of Assam Identification */}
      <div className="flex items-center gap-2 tracking-wide font-medium">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
        <span className="text-white font-semibold uppercase tracking-wider">
          GOVERNMENT OF ASSAM
        </span>
        <span className="text-slate-400">|</span>
        <span className="text-amber-300 font-serif">
          অসম চৰকাৰ
        </span>
        <span className="hidden lg:inline text-slate-400">|</span>
        <span className="hidden lg:inline text-slate-400 text-[10px]">
          Administrative Reforms & RTPS Ecosystem
        </span>
      </div>

      {/* Right: Accessibility | Language | Help | DEMO MODE */}
      <div className="flex items-center gap-3 sm:gap-4 text-slate-300">
        {/* Skip link */}
        <a
          href="#main-content"
          className="hover:text-amber-300 underline-offset-4 hover:underline hidden xl:inline focus:outline-none focus:ring-1 focus:ring-amber-400 px-1 py-0.5 text-[11px]"
        >
          Skip to Main Content
        </a>

        {/* Accessibility / Text Size */}
        <div className="hidden sm:flex items-center gap-1 border-x border-[#1a4d61] px-2">
          <span className="text-[10px] text-slate-400 mr-1">Text:</span>
          <button
            onClick={() => setFontSize("sm")}
            className={`px-1 py-0.2 text-[10px] rounded transition-colors ${
              fontSize === "sm" ? "bg-amber-400 text-slate-950 font-bold" : "hover:text-white"
            }`}
            title="Small text"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize("base")}
            className={`px-1 py-0.2 text-[10px] rounded transition-colors ${
              fontSize === "base" ? "bg-amber-400 text-slate-950 font-bold" : "hover:text-white"
            }`}
            title="Standard text"
          >
            A
          </button>
          <button
            onClick={() => setFontSize("lg")}
            className={`px-1 py-0.2 text-[10px] rounded transition-colors ${
              fontSize === "lg" ? "bg-amber-400 text-slate-950 font-bold" : "hover:text-white"
            }`}
            title="Large text"
          >
            A+
          </button>
        </div>

        {/* Language switch */}
        <div className="flex items-center gap-1 text-[11px]">
          <Globe className="w-3 h-3 text-slate-400" />
          <button
            onClick={() => setLang("en")}
            className={`font-semibold ${lang === "en" ? "text-amber-400 underline underline-offset-2" : "hover:text-white"}`}
          >
            English
          </button>
          <span className="text-slate-500">/</span>
          <button
            onClick={() => setLang("as")}
            className={`font-medium ${lang === "as" ? "text-amber-400 underline underline-offset-2" : "hover:text-white"}`}
          >
            অসমীয়া
          </button>
        </div>

        {/* Help */}
        <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-300">
          <PhoneCall className="w-3 h-3 text-amber-400" />
          <span>Help: 1800-345-3574</span>
        </div>

        {/* System Status: DEMO MODE */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/15 border border-amber-400/30 rounded text-[10px] font-bold text-amber-300 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          DEMO MODE
        </div>
      </div>
    </div>
  );
}
