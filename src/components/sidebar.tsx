import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Activity,
  Users,
  Building,
  Building2,
  FileWarning,
  Medal,
  Settings,
  FileText,
  Globe,
  Info,
  LucideIcon,
} from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-64 border-r bg-white h-screen flex flex-col hidden md:flex">
      <div className="p-6 border-b">
        <h1 className="font-bold text-lg text-slate-900 tracking-tight">RTPS Intelligence</h1>
        <p className="text-xs text-slate-500 mt-1">Assam RTPS Performance Monitoring</p>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/sla-monitor" icon={Activity} label="SLA Monitor" />
          <NavItem href="/dps" icon={Users} label="DPS Performance" />
          <NavItem href="/offices" icon={Building} label="Office Performance" />
          <NavItem href="/departments" icon={Building2} label="Department Performance" />
          <NavItem href="/reviews" icon={FileWarning} label="Administrative Review" />
          <NavItem href="/recognition" icon={Medal} label="Recognition" />
          <NavItem href="/data-integration" icon={Activity} label="Data Integration" />
          <NavItem href="/audit" icon={FileText} label="Audit Logs" />
          <NavItem href="/public-performance" icon={Globe} label="Public Portal" />
          <NavItem href="/settings" icon={Settings} label="System Settings" />
          <NavItem href="/about" icon={Info} label="About Platform" />
        </nav>
      </div>
      <div className="p-4 border-t text-xs text-slate-600 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-[#0f293e] text-white flex items-center justify-center font-bold text-xs">
          AS
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">State Nodal Officer</span>
          <span className="text-[10px] text-slate-400">Government of Assam</span>
        </div>
      </div>
    </div>
  );
}

function NavItem({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
    >
      <Icon className="w-4 h-4 text-slate-500" />
      <span>{label}</span>
    </Link>
  );
}
