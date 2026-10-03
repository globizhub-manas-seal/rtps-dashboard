"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TopUtilityBar } from "@/components/layout/TopUtilityBar";
import { MainHeader } from "@/components/layout/MainHeader";
import { Footer } from "@/components/layout/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/" || pathname === "/landing";
  const isDocumentPage = pathname.includes("/certificate") || pathname.includes("/notice");

  if (isLandingPage || isDocumentPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] text-[#1F2933] print:bg-white print:p-0">
      {/* Government Utility Bar */}
      <div className="print:hidden">
        <TopUtilityBar />
      </div>

      {/* Main Government Header + Navigation */}
      <div className="print:hidden">
        <MainHeader />
      </div>

      {/* Page Content Area */}
      <main id="main-content" className="flex-1 print:p-0 print:m-0">
        {children}
      </main>

      {/* Government Footer */}
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
