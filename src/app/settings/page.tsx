"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import {
  Sliders,
  Shield,
  Database,
  Calendar,
  FileText,
  Bell,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "Statutory SLA Rules Engine",
      description:
        "Configure statutory service deadlines, early warning thresholds (12h/48h), appeal windows, and review triggers.",
      href: "/settings/sla-rules",
      icon: Sliders,
      badge: "Active",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      stats: "15 Services Configured",
    },
    {
      title: "Data Ingestion & Sewa Setu Sync",
      description:
        "Manage real-time webhook endpoints, batch reconciliation workers, and ingestion payload simulators.",
      href: "/data-integration",
      icon: Database,
      badge: "Connected",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      stats: "Hourly Sync Interval",
    },
    {
      title: "System Audit & Compliance Ledger",
      description:
        "Immutable administrative action logs, notice issuance timestamps, and configuration modification history.",
      href: "/audit",
      icon: FileText,
      badge: "Audited",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      stats: "Tamper-Evident Logs",
    },
    {
      title: "Role-Based Access Control (RBAC)",
      description:
        "Role permissions across State Admin, Department Secretary, District Commissioner, and Circle Officer tiers.",
      href: "#rbac-matrix",
      icon: Shield,
      badge: "Enforced",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      stats: "5 Tier Permissions",
    },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-6">
      <PageHeader
        title="System Administration & Configuration"
        subtitle="Manage statutory parameters, governance rules, data sync gateways, and access controls"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {settingsSections.map((sec) => {
          const Icon = sec.icon;
          return (
            <Link
              key={sec.title}
              href={sec.href}
              className="bg-white border border-slate-200 hover:border-[#1464A5] rounded-xl p-5 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-slate-50 text-[#1464A5] rounded-lg border border-slate-100 group-hover:bg-blue-50 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${sec.badgeColor}`}
                  >
                    {sec.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1464A5] transition-colors">
                  {sec.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {sec.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{sec.stats}</span>
                <span className="text-[#1464A5] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Configure <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* RBAC Overview Matrix */}
      <div id="rbac-matrix" className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Lock className="w-4 h-4 text-[#1464A5]" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Statutory Role Hierarchy & Permission Scopes
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Role Tier</th>
                <th className="py-2.5 px-3">Administrative Scope</th>
                <th className="py-2.5 px-3">Data Visibility</th>
                <th className="py-2.5 px-3">Review Action Rights</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">ASCRTPS_ADMIN (State Super Admin)</td>
                <td className="py-2.5 px-3">Chief Secretary / ASCRTPS Commission</td>
                <td className="py-2.5 px-3">All 35 Districts, all Departments & Services</td>
                <td className="py-2.5 px-3 text-emerald-700 font-semibold">Full Notice Dispatch & Conclude Rights</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">DEPARTMENT_ADMIN (Nodal Officer)</td>
                <td className="py-2.5 px-3">Principal Secretary / Department Directors</td>
                <td className="py-2.5 px-3">Department services and departmental offices statewide</td>
                <td className="py-2.5 px-3 text-blue-700 font-semibold">Initiate Review & Request Explanation</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">OFFICE_HEAD (DC / ADC)</td>
                <td className="py-2.5 px-3">District Commissioner / Circle Officer Head</td>
                <td className="py-2.5 px-3">District circle offices, blocks, local DPS officers</td>
                <td className="py-2.5 px-3 text-blue-700 font-semibold">Local Inquiry & Monitoring</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">DPS (Designated Public Servant)</td>
                <td className="py-2.5 px-3">Circle Officer / Dealing Assistant / Inspector</td>
                <td className="py-2.5 px-3">Assigned applications and personal performance scorecard</td>
                <td className="py-2.5 px-3 text-slate-500 font-semibold">Submit Review Explanation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
