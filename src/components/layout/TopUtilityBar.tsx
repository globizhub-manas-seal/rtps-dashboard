"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";

export function TopUtilityBar() {
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleFontSize = (size: "sm" | "base" | "lg") => {
    setFontSize(size);
    if (typeof document !== "undefined") {
      if (size === "sm") document.documentElement.style.fontSize = "14px";
      else if (size === "base") document.documentElement.style.fontSize = "16px";
      else if (size === "lg") document.documentElement.style.fontSize = "18px";
    }
  };

  return (
    <div
      id="top-utility-bar"
      role="region"
      aria-label="Government Utility Bar"
      suppressHydrationWarning
      className="bg-[#020d14] text-slate-300 text-[11px] border-b border-[#143947]/50 py-1.5 px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2 print:!hidden"
    >
      {/* Left: Official Government of Assam Identification */}
      <div className="flex items-center gap-3 tracking-wide font-medium text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px]">🇮🇳</span>
          <span className="text-white font-medium">Government of Assam</span>
        </div>
        <span className="text-slate-500">|</span>
        <span className="text-white font-serif">অসম চৰকাৰ</span>
        <span className="hidden sm:inline text-slate-500">|</span>
        <span className="hidden sm:inline text-slate-300">
          RTPS Performance Intelligence
        </span>
      </div>

      {/* Right: Tools & Links */}
      <div className="flex items-center gap-4">
        {/* Text Size */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => handleFontSize("sm")}
            className={`transition-colors cursor-pointer ${fontSize === "sm" ? "text-white font-bold" : "hover:text-white"}`}
            title="Small text"
          >
            A-
          </button>
          <button
            onClick={() => handleFontSize("base")}
            className={`transition-colors cursor-pointer ${fontSize === "base" ? "text-white font-bold" : "hover:text-white"}`}
            title="Standard text"
          >
            A
          </button>
          <button
            onClick={() => handleFontSize("lg")}
            className={`transition-colors cursor-pointer ${fontSize === "lg" ? "text-white font-bold" : "hover:text-white"}`}
            title="Large text"
          >
            A+
          </button>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={() => {
            const nextMode = !isDarkMode;
            setIsDarkMode(nextMode);
            if (typeof document !== "undefined") {
              if (nextMode) document.documentElement.classList.add("dark");
              else document.documentElement.classList.remove("dark");
            }
          }}
          className="flex items-center rounded-full bg-[#0a1e2b] border border-[#143947] p-0.5 w-12 h-6 relative transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
          title="Toggle Theme"
        >
          <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform duration-300 flex items-center justify-center ${isDarkMode ? 'left-0.5 bg-amber-400' : 'left-7 bg-slate-400'}`}>
            {isDarkMode ? <Sun className="w-3 h-3 text-slate-900" /> : <Moon className="w-3 h-3 text-white" />}
          </div>
          <div className="w-full flex justify-between px-1.5 opacity-50">
            <Sun className="w-3 h-3 text-white" />
            <Moon className="w-3 h-3 text-white" />
          </div>
        </button>

        <span className="hidden md:inline text-slate-500">|</span>

        {/* Links */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/about" className="hover:text-white transition-colors">About Platform</Link>
          <span className="text-slate-500">|</span>
          <Link href="/public-performance" className="hover:text-white transition-colors">Public Portal</Link>
          <span className="text-slate-500">|</span>
          <a href="mailto:support-rtps@assam.gov.in" className="hover:text-white transition-colors">Helpdesk</a>
          <span className="text-slate-500">|</span>
        </div>

        {/* PROTOTYPE Badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 border border-amber-500/80 rounded font-bold text-amber-400 tracking-wider text-[9px]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          PROTOTYPE
        </div>
      </div>
    </div>
  );
}
