"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, FileQuestion, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-20 h-20 bg-amber-500/10 border border-amber-400/30 rounded-2xl flex items-center justify-center mb-6 text-amber-500 shadow-sm">
        <FileQuestion className="w-10 h-10" />
      </div>

      <span className="text-xs font-mono font-bold tracking-widest text-amber-600 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-3">
        404 — Record Not Found
      </span>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f3443] tracking-tight mb-2">
        Requested Official Page Does Not Exist
      </h1>

      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        The application ref, departmental directory, or administrative route you requested could not be located in the RTPS Performance Intelligence system.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="outline" className="border-slate-300 text-xs font-semibold h-10 px-4 flex items-center gap-2">
            <Home className="w-4 h-4 text-slate-500" />
            Portal Home
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button className="bg-[#0f293e] hover:bg-[#153e5e] text-white text-xs font-semibold h-10 px-4 flex items-center gap-2 shadow-sm">
            <LayoutDashboard className="w-4 h-4 text-amber-400" />
            Executive Dashboard
          </Button>
        </Link>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-200/80 text-xs text-slate-400">
        <span>Need administrative assistance? Contact RTPS Helpdesk at </span>
        <a href="mailto:rtps-support@assam.gov.in" className="text-sky-600 hover:underline font-medium">
          rtps-support@assam.gov.in
        </a>
      </div>
    </div>
  );
}
