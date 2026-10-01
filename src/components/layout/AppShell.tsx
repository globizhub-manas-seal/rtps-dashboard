"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TopUtilityBar } from "@/components/layout/TopUtilityBar";
import { MainHeader } from "@/components/layout/MainHeader";
import { Footer } from "@/components/layout/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/" || pathname === "/landing";

  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] text-[#1F2933]">
      {/* Government Utility Bar */}
      <TopUtilityBar />

      {/* Main Government Header + Navigation */}
      <MainHeader />

      {/* Page Content Area */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Government Footer */}
      <Footer />
    </div>
  );
}
