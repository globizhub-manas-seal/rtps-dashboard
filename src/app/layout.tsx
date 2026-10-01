import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RTPS Performance Intelligence — Government of Assam",
  description:
    "Welcome to Data-Driven RTPS Governance for a More Responsive Assam — Continuous RTPS Service Delivery Performance & SLA Monitoring Prototype",
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
        className={`${inter.className} min-h-screen bg-[#07131F] text-[#1F2933] antialiased`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}


