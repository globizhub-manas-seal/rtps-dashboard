import Link from "next/link";
import { LayoutDashboard, Activity, Users, Building, Building2, FileWarning, Medal, Settings } from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-64 border-r bg-white h-screen flex flex-col hidden md:flex">
      <div className="p-6 border-b">
        <h1 className="font-bold text-lg text-slate-900 tracking-tight">RTPS Intelligence</h1>
        <p className="text-xs text-slate-500 mt-1">Assam RTPS Performance Monitoring</p>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          <NavItem href="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/sla-monitor" icon={Activity} label="SLA Monitor" />
          <NavItem href="/dps" icon={Users} label="DPS Performance" />
          <NavItem href="/offices" icon={Building} label="Office Performance" />
          <NavItem href="/departments" icon={Building2} label="Department Performance" />
          <NavItem href="/reviews" icon={FileWarning} label="Administrative Review" />
          <NavItem href="/recognition" icon={Medal} label="Recognition" />
          <NavItem href="/settings/sla-rules" icon={Settings} label="SLA Rules" />
        </nav>
      </div>
      <div className="p-4 border-t text-sm text-slate-500">
        <div>User Profile</div>
      </div>
    </div>
  );
}

function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link href={href} className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100 transition-colors">
      <Icon className="w-4 h-4 text-slate-500" />
      <span>{label}</span>
    </Link>
  );
}
