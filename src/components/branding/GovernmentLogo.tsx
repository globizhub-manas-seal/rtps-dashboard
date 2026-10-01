"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface GovernmentLogoProps {
  variant?: "header" | "footer" | "standalone";
  className?: string;
}

export function GovernmentLogo({
  variant = "header",
  className = "",
}: GovernmentLogoProps) {
  const isFooter = variant === "footer";
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 sm:gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm ${className}`}
      aria-label="RTPS Performance Intelligence Portal — Government of Assam Prototype"
    >
      {/* Government of Assam Emblem (State Authority Identity) */}
      <div className="relative flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center">
        {!imgError ? (
          <img
            src={`/logo/assam-gov-logo.png?v=3`}
            alt="Government of Assam Emblem"
            width={48}
            height={48}
            className="object-contain drop-shadow-sm"
            style={{ width: "auto", height: "auto", maxHeight: "48px" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-10 h-10 border border-amber-400/50 rounded flex flex-col items-center justify-center text-center p-0.5 bg-[#081B22]">
            <span className="text-[7px] font-bold text-amber-300 uppercase leading-none">GOVT OF</span>
            <span className="text-[8px] font-extrabold text-white uppercase leading-tight">ASSAM</span>
          </div>
        )}
      </div>

      {/* Conceptual Product Identity with PROTOTYPE Badge */}
      <div className="flex flex-col text-left">
        {/* State Attribution Line */}
        <div className="flex items-center gap-2 leading-none mb-1">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-300/90 font-sans">
            GOVERNMENT OF ASSAM • অসম চৰকাৰ
          </span>
        </div>

        {/* Product Title + PROTOTYPE Tag */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold tracking-tight text-base sm:text-lg leading-tight text-white">
            RTPS{" "}
            <span className="text-amber-400 font-extrabold">
              Performance Intelligence
            </span>
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded">
            PROTOTYPE
          </span>
        </div>

        {/* Subtitle */}
        <span
          className={`text-[11px] tracking-tight ${
            isFooter ? "text-slate-300" : "text-slate-300"
          }`}
        >
          Administrative SLA Monitoring • Continuous Service Delivery Monitoring
        </span>
      </div>
    </Link>
  );
}
