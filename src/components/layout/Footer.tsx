import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="bg-[#031525] border-t border-[#143947] mt-auto text-slate-300 relative overflow-hidden"
    >
      {/* Decorative Background Artwork */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute right-0 bottom-0 w-full md:w-[65%] h-full opacity-60 bg-no-repeat bg-right-bottom transition-all"
          style={{ 
            backgroundImage: "url('/images/assam-skyline.png')",
            backgroundSize: "cover",
            backgroundPosition: "bottom right"
          }}
        />
        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#031525] via-[#031525]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#031525] via-transparent to-transparent"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* TOP ROW: Identity & Assam Startup */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10 pb-10 border-b border-[#143947]/60">
          
          {/* Identity */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center flex-shrink-0">
              <Image
                src="/logo/assam-gov-logo.png"
                alt="Government of Assam Seal"
                width={48}
                height={48}
                className="w-12 h-auto object-contain drop-shadow-md"
                unoptimized
              />
              <span className="text-[10px] font-bold text-white mt-1 uppercase tracking-wide">অসম চৰকাৰ</span>
              <span className="text-[8px] text-slate-400 uppercase tracking-widest text-center leading-tight">Government<br/>of Assam</span>
            </div>
            
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white leading-tight tracking-wide">
                  RTPS Performance <br /> Intelligence
                </h2>
                <span className="text-amber-400 font-bold uppercase text-[9px] px-1.5 py-0.5 rounded border border-amber-400/30 bg-amber-400/10 self-start mt-1">
                  Prototype
                </span>
              </div>
              <p className="text-[13px] text-slate-400 leading-relaxed mt-1 max-w-md">
                A prototype platform for continuous RTPS service delivery performance and SLA monitoring under the Assam RTPS Act, 2012.
              </p>
            </div>
          </div>

          {/* Assam Startup (Top Right) */}
          <div className="flex flex-col md:items-end gap-1">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Initiative</h3>
            <div className="mt-1">
              <Image
                src="/logo/assam-startup.png"
                alt="Assam Startup - The Nest"
                width={160}
                height={72}
                className="h-[64px] w-auto object-contain rounded-sm drop-shadow-sm"
                unoptimized
              />
            </div>
          </div>

        </div>

        {/* MIDDLE ROW: Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Column 1: Platform Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">Platform Modules</h3>
            <ul className="flex flex-col gap-2.5 text-[13px] text-slate-400">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Executive Dashboard</Link></li>
              <li><Link href="/sla-monitor" className="hover:text-white transition-colors">SLA Early-Warning Monitor</Link></li>
              <li><Link href="/departments" className="hover:text-white transition-colors">Departments</Link></li>
              <li><Link href="/offices" className="hover:text-white transition-colors">Circle Offices</Link></li>
              <li><Link href="/dps" className="hover:text-white transition-colors">DPS Directory & Scorecards</Link></li>
              <li><Link href="/reviews" className="hover:text-white transition-colors">Administrative Reviews</Link></li>
            </ul>
          </div>

          {/* Column 2: Information Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">Information & Standards</h3>
            <ul className="flex flex-col gap-2.5 text-[13px] text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Platform</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Statutory Methodology</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">DPDP Act & Citizen Privacy</Link></li>
              <li><Link href="/public-performance" className="hover:text-white transition-colors">Public Transparency Portal</Link></li>
              <li><Link href="/settings/sla-rules" className="hover:text-white transition-colors">Statutory SLA Parameters</Link></li>
            </ul>
          </div>

          {/* Column 3: Prototype Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">Governance Integration</h3>
            <ul className="flex flex-col gap-2.5 text-[13px] text-slate-400">
              <li><Link href="/data-integration" className="hover:text-white transition-colors">Sewa Setu Sync Simulator</Link></li>
              <li><Link href="/recognition" className="hover:text-white transition-colors">Merit Recognition Candidacy</Link></li>
              <li><Link href="/audit" className="hover:text-white transition-colors">Compliance Audit Ledger</Link></li>
              <li><Link href="/settings" className="hover:text-white transition-colors">System Configuration</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: National Initiatives & Copyright */}
      <div className="border-t border-[#143947] bg-[#020D18]/50 relative z-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Bottom Footer Info */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            <div className="flex flex-col xl:flex-row items-center gap-6 xl:gap-8">
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-white px-2 py-1 rounded shadow-xs flex items-center justify-center h-8">
                  <Image src="/logo/nic-logo.png" alt="National Informatics Centre" width={60} height={20} className="h-5 w-auto object-contain" unoptimized />
                </div>
                <div className="bg-white px-2 py-1 rounded shadow-xs flex items-center justify-center h-8">
                  <Image src="/logo/meiyt.png" alt="Ministry of Electronics and Information Technology" width={60} height={20} className="h-5 w-auto object-contain" unoptimized />
                </div>
                <div className="bg-white px-2 py-1 rounded shadow-xs flex items-center justify-center h-8">
                  <Image src="/logo/dpiit-logo.png" alt="DPIIT" width={60} height={20} className="h-5 w-auto object-contain" unoptimized />
                </div>
                <div className="bg-white px-2 py-1 rounded shadow-xs flex items-center justify-center h-8">
                  <Image src="/logo/digital-india.png" alt="Digital India" width={60} height={20} className="h-5 w-auto object-contain" unoptimized />
                </div>
                <div className="bg-white px-2 py-1 rounded shadow-xs flex items-center justify-center h-8">
                  <Image src="/logo/make-in-india.png" alt="Make in India" width={60} height={20} className="h-5 w-auto object-contain" unoptimized />
                </div>
              </div>

              <div className="hidden xl:block w-px h-8 bg-[#143947]/50"></div>

              <div className="text-center lg:text-left text-[11px] text-slate-400">
                <span className="block text-slate-300 font-medium">Government of Assam ecosystem reference</span>
                <span className="block mt-1 text-amber-500/80 font-bold tracking-wide">
                  • Prototype • Simulated RTPS Data • For demonstration purposes only
                </span>
              </div>
            </div>

            {/* Right Links & Copyright */}
            <div className="flex flex-col items-center lg:items-end gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <Link href="/about" className="hover:text-white transition-colors">Privacy</Link>
                <span className="text-slate-600">|</span>
                <Link href="/about" className="hover:text-white transition-colors">Accessibility</Link>
                <span className="text-slate-600">|</span>
                <Link href="/about" className="hover:text-white transition-colors">Terms</Link>
                <span className="text-slate-600">|</span>
                <a href="mailto:support-rtps@assam.gov.in" className="hover:text-white transition-colors">Contact</a>
              </div>
              <div className="mt-1">
                © {new Date().getFullYear()} RTPS Performance Intelligence. All rights reserved.
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
}
