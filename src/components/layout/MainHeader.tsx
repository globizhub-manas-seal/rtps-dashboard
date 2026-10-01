"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GovernmentLogo } from "@/components/branding/GovernmentLogo";
import { Bell, ChevronDown } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/sla-monitor", label: "SLA Monitor" },
  { href: "/dps", label: "DPS Performance" },
  { href: "/offices", label: "Office Performance" },
  { href: "/departments", label: "Departments" },
  { href: "/reviews", label: "Reviews" },
  { href: "/recognition", label: "Recognition" },
  { href: "/settings/sla-rules", label: "SLA Rules" },
  { href: "/about", label: "About Platform" },
];

export function MainHeader() {
  const pathname = usePathname();
  const [sewaImgError, setSewaImgError] = useState(false);

  return (
    <header
      role="banner"
      className="bg-[#0f3443] shadow-md relative z-30 border-b border-[#144759]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo + Ecosystem Badge + User Controls Row */}
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Government of Assam authority & RTPS Product Title */}
          <GovernmentLogo variant="header" />

          {/* Right Side: Sewa Setu Ecosystem Reference & User Profile */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* Sewa Setu Ecosystem Reference Badge */}
            <a
              href="https://sewasetu.assam.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/15 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              title="Reference Ecosystem: Sewa Setu Assam"
            >
              <div className="w-7 h-7 relative flex-shrink-0 bg-white p-0.5 rounded shadow-xs flex items-center justify-center">
                {!sewaImgError ? (
                  <Image
                    src="/logo/sewa-setu.png"
                    alt="Sewa Setu Assam"
                    width={26}
                    height={26}
                    className="object-contain"
                    style={{ width: "auto", height: "auto" }}
                    onError={() => setSewaImgError(true)}
                  />
                ) : (
                  <span className="text-[8px] font-bold text-[#0f3443]">SEWA</span>
                )}
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-amber-300">
                  Ecosystem Reference
                </span>
                <span className="text-[11px] font-medium text-slate-200">
                  Sewa Setu • RTPS Service Data
                </span>
                <span className="text-[9px] text-slate-400 italic">
                  Proposed integration
                </span>
              </div>
            </a>

            {/* Notifications */}
            <button
              className="relative p-2 rounded-md text-slate-200 hover:bg-[#1a4d5e] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label="Notifications"
            >
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
            </button>

            {/* User profile */}
            <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-slate-200 hover:bg-[#1a4d5e] transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
              <div className="w-7 h-7 rounded-full bg-[#1a5c73] flex items-center justify-center text-xs font-semibold text-amber-300 border border-[#2b7d9a]">
                AD
              </div>
              <span className="hidden sm:inline font-medium text-xs">Admin Reviewer</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            </button>
          </div>
        </div>

        {/* Navigation Row */}
        <nav
          role="navigation"
          aria-label="Main Navigation"
          className="flex items-center gap-0.5 -mb-px overflow-x-auto scrollbar-none pt-1"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative px-3.5 py-2 text-[13px] font-medium rounded-t-md transition-colors whitespace-nowrap
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0f3443]
                  ${
                    isActive
                      ? "bg-[#f7f9fb] text-[#0f3443] font-bold shadow-sm"
                      : "text-slate-200 hover:bg-[#194758] hover:text-white"
                  }
                `}
              >
                {item.label}
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b bg-amber-400" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
