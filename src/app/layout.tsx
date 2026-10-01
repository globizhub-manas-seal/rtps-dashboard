import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopUtilityBar } from "@/components/layout/TopUtilityBar";
import { MainHeader } from "@/components/layout/MainHeader";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RTPS Performance Intelligence — Government of Assam (Prototype)",
  description:
    "Continuous RTPS Service Delivery Performance & SLA Monitoring — Prototype for the Assam RTPS Ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.className} bg-[#F7F9FB] text-[#1F2933] min-h-screen flex flex-col`}
      >
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
      </body>
    </html>
  );
}
