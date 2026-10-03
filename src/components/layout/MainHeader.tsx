"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GovernmentLogo } from "@/components/branding/GovernmentLogo";
import { Bell, ChevronDown, Globe, Search, Users } from "lucide-react";

type Role = "ASCRTPS_ADMIN" | "DEPARTMENT_ADMIN" | "OFFICE_HEAD" | "REVIEWER" | "DPS";

const ALL_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", roles: ["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN"], hasDropdown: false },
  { href: "/sla-monitor", label: "SLA Monitor", roles: ["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN", "OFFICE_HEAD"], hasDropdown: true },
  { href: "/departments", label: "Departments", roles: ["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN"], hasDropdown: true },
  { href: "/offices", label: "Offices", roles: ["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN", "OFFICE_HEAD"], hasDropdown: true },
  { href: "/dps", label: "DPS Performance", roles: ["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN", "OFFICE_HEAD", "DPS"], hasDropdown: true },
  { href: "/reviews", label: "Reviews", roles: ["ASCRTPS_ADMIN", "REVIEWER"], hasDropdown: true },
  { href: "/recognition", label: "Recognition", roles: ["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN"], hasDropdown: false },
  { href: "/data-integration", label: "Data Integration", roles: ["ASCRTPS_ADMIN"], hasDropdown: true },
  { href: "/settings/sla-rules", label: "SLA Rules", roles: ["ASCRTPS_ADMIN"], hasDropdown: true },
  { href: "/audit", label: "Audit Logs", roles: ["ASCRTPS_ADMIN"], hasDropdown: false },
  { href: "/public-performance", label: "Public Performance", roles: ["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN", "OFFICE_HEAD", "REVIEWER", "DPS"], hasDropdown: false },
];

export function MainHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<Role>("ASCRTPS_ADMIN");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const bellDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("demo_rbac_role") as Role;
    if (savedRole) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveRole(savedRole);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(target)) {
        setIsRoleDropdownOpen(false);
      }
      if (bellDropdownRef.current && !bellDropdownRef.current.contains(target)) {
        setIsBellOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRoleChange = (newRole: Role) => {
    setActiveRole(newRole);
    localStorage.setItem("demo_rbac_role", newRole);
    document.cookie = `demo_rbac_role=${newRole}; path=/; max-age=86400`; // 1 day
    setIsRoleDropdownOpen(false);
    router.push("/dashboard");
  };

  const allowedNavItems = ALL_NAV_ITEMS.filter((item) => item.roles.includes(activeRole));

  return (
    <header role="banner" className="bg-[#0f293e] relative z-40 flex flex-col">
      {/* Decorative Background Image matching the footer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute right-0 bottom-0 w-full md:w-[65%] h-full opacity-30 bg-no-repeat bg-right-bottom transition-all mix-blend-screen"
          style={{ 
            backgroundImage: "url('/images/assam-skyline.png')",
            backgroundSize: "cover",
            backgroundPosition: "bottom right"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f293e] via-[#0f293e]/90 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f293e] via-transparent to-[#0f293e]/50"></div>
      </div>

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        
        {/* TOP SECTION: Identity, Search, Avatar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between py-5 gap-6">
          
          {/* LEFT: Government Emblem & Titles */}
          <div className="flex items-center gap-4">
            <GovernmentLogo variant="header" />
          </div>

          {/* RIGHT: Tools & Profile */}
          <div className="flex items-center gap-4 flex-shrink-0">
            
            {/* Role Switcher */}
            <div className="relative" ref={roleDropdownRef}>
              <button
                onClick={() => {
                  setIsRoleDropdownOpen((prev) => !prev);
                  setIsBellOpen(false);
                  setIsProfileOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-md border border-amber-500/50 hover:bg-amber-500/10 transition-colors"
              >
                <div className="flex items-center justify-center text-amber-400">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-[9px] text-slate-300">Simulate Access Level</span>
                  <span className="text-xs font-bold text-amber-400 leading-tight">{activeRole.replace("_", " ")}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-amber-400 ml-1" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-2xl border border-slate-200 z-50 overflow-hidden">
                  <div className="p-1">
                    {(["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN", "OFFICE_HEAD", "REVIEWER", "DPS"] as Role[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleChange(role)}
                        className={`w-full text-left px-3 py-2 text-xs rounded-sm transition-colors ${
                          activeRole === role
                            ? "bg-blue-50 text-blue-700 font-bold"
                            : "text-slate-700 hover:bg-slate-100 font-medium"
                        }`}
                      >
                        {role.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Global Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/sla-monitor?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              className="hidden lg:flex items-center relative"
            >
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search applications, offices, services..."
                className="bg-[#0b1e2d]/80 border border-[#1f4a66] text-xs text-white placeholder-slate-400 rounded-md py-1.5 pl-9 pr-14 w-72 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="absolute right-2 flex items-center gap-1 text-[10px] text-slate-400 bg-[#0f293e] px-1.5 py-0.5 rounded border border-[#1f4a66] hover:text-white"
              >
                ↵
              </button>
            </form>

            <div className="w-px h-8 bg-[#1f4a66] mx-1"></div>

            {/* Notifications */}
            <div className="relative" ref={bellDropdownRef}>
              <button
                onClick={() => {
                  setIsBellOpen((prev) => !prev);
                  setIsRoleDropdownOpen(false);
                  setIsProfileOpen(false);
                }}
                className="relative p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#0f293e]">
                  <span className="text-[8px] font-bold text-white leading-none">3</span>
                </div>
              </button>

              {isBellOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden text-slate-900 animate-in fade-in duration-150">
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">Critical SLA Alerts (3)</span>
                    <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">Action Required</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    <Link
                      href="/sla-monitor?filter=critical"
                      onClick={() => setIsBellOpen(false)}
                      className="p-3 hover:bg-slate-50 flex items-start gap-2.5 transition-colors block"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">Land Partition Mutation delay</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Karimganj Circle Office &bull; &lt;12h remaining</p>
                      </div>
                    </Link>
                    <Link
                      href="/sla-monitor?filter=at_risk"
                      onClick={() => setIsBellOpen(false)}
                      className="p-3 hover:bg-slate-50 flex items-start gap-2.5 transition-colors block"
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">14 Trade License renewals due</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Kamrup Metro &bull; Warning threshold</p>
                      </div>
                    </Link>
                    <Link
                      href="/audit"
                      onClick={() => setIsBellOpen(false)}
                      className="p-3 hover:bg-slate-50 flex items-start gap-2.5 transition-colors block"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">Statutory threshold audit flag</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">2 repeat delay limits recorded</p>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                    <Link
                      href="/sla-monitor"
                      onClick={() => setIsBellOpen(false)}
                      className="text-[11px] font-semibold text-[#1464A5] hover:underline"
                    >
                      View All SLA Monitor Items &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => {
                  setIsProfileOpen((prev) => !prev);
                  setIsBellOpen(false);
                  setIsRoleDropdownOpen(false);
                }}
                className="flex items-center gap-2 pl-2 cursor-pointer focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#0f293e] font-bold text-xs shadow-sm">
                  MS
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 overflow-hidden text-slate-900 animate-in fade-in duration-150">
                  <div className="p-3 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">Manas Sharma</p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">admin@rtps.assam.gov.in</p>
                    <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                      {activeRole.replace("_", " ")}
                    </span>
                  </div>
                  <div className="py-1 text-xs">
                    <Link
                      href="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      System Settings
                    </Link>
                    <Link
                      href="/settings/sla-rules"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      SLA Rules
                    </Link>
                    <Link
                      href="/public-performance"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Public Transparency View
                    </Link>
                  </div>
                  <div className="p-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        localStorage.removeItem("demo_rbac_role");
                        document.cookie = "demo_rbac_role=; path=/; max-age=0";
                        router.push("/");
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold rounded cursor-pointer transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* NAVIGATION BAR (Bottom row of header) */}
      <div className="w-full bg-[#081b28]/80 border-t border-[#1f4a66] relative z-10 backdrop-blur-sm">
        <div className="max-w-[1440px] w-full mx-auto px-2 sm:px-4 lg:px-6">
          <nav role="navigation" className="flex items-center gap-0.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            {allowedNavItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-1.5 px-3 py-3 text-[13px] font-medium transition-all relative
                    ${isActive 
                      ? "bg-[#0b1e2d] text-white" 
                      : "text-slate-300 hover:bg-[#0b1e2d]/50 hover:text-white"
                    }
                  `}
                >
                  {/* Top Highlight Border for Active Item */}
                  {isActive && (
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-500 rounded-b-sm" />
                  )}

                  {/* Icon for Dashboard (special case based on screenshot) */}
                  {item.label === "Dashboard" && (
                    <svg className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  )}

                  {/* Special icon for Public Performance */}
                  {item.label === "Public Performance" && (
                    <Globe className="w-4 h-4 text-slate-400" />
                  )}

                  {item.label === "SLA Monitor" && <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                  {item.label === "Departments" && <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                  {item.label === "Offices" && <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                  {item.label === "DPS Performance" && <Users className="w-4 h-4 text-slate-400" />}
                  {item.label === "Reviews" && <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                  {item.label === "Recognition" && <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
                  {item.label === "SLA Rules" && <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                  {item.label === "Data Integration" && <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>}
                  {item.label === "Audit Logs" && <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}

                  <span>{item.label}</span>
                  
                  {item.hasDropdown && (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
