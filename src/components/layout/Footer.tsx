import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="bg-[#081B22] border-t border-[#143947] mt-auto text-slate-300 py-4 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Left: Identity & Prototype Note */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 relative flex-shrink-0">
              <Image
                src="/logo/assam-gov-logo.png"
                alt="Gov of Assam"
                width={20}
                height={20}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <span className="font-semibold text-white">
              RTPS Performance Intelligence
            </span>
          </div>
          <span className="text-amber-400 font-bold uppercase text-[9px] px-1.5 py-0.2 rounded border border-amber-400/30 bg-amber-400/10">
            Prototype
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-400 text-[11px] hidden md:inline">
            Government of Assam ecosystem reference • For demonstration purposes only
          </span>
        </div>

        {/* Right: Compact Links & Reference */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <Link href="/about" className="text-amber-300 hover:underline font-semibold">
            About Platform
          </Link>
          <span className="text-slate-600">|</span>
          <a
            href="https://sewasetu.assam.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-200"
          >
            Sewa Setu Portal
          </a>
          <span className="text-slate-600">|</span>
          <a
            href="https://sewasetu.assam.gov.in/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-200"
          >
            Privacy
          </a>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Accessibility</span>
        </div>
      </div>
    </footer>
  );
}
