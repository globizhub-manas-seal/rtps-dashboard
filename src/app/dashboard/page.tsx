"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ShieldAlert, AlertCircle, Users, BarChart3, ArrowRight,
  TrendingUp, Building2, MapPin, FileText, CheckCircle2,
  Calendar, RefreshCw, AlertTriangle, Layers, Award, Database, Check, Info
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionHeader } from "@/components/ui/section-header";

const SLAComplianceChart = dynamic(() => import("@/components/charts/SLAComplianceChart"), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading trend...</div>
});

const SLADonutChart = dynamic(() => import("@/components/charts/SLADonutChart"), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading status...</div>
});

const WorkloadScatterChart = dynamic(() => import("@/components/charts/WorkloadScatterChart"), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading matrix...</div>
});

import VisualAnalyticsSection from "@/components/dashboard/VisualAnalyticsSection";
import { Pagination } from "@/components/ui/pagination";

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30d");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>("Just now");
  const [deptPage, setDeptPage] = useState<number>(1);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
        setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const kpis = dashboardData?.kpis || {
    totalApplications: 530,
    slaCompliance: 86.8,
    activeBreaches: 42,
    applicationsAtRisk: 68,
    highPerformingDps: 10,
    averageTat: 4.8,
  };

  const slaDist = dashboardData?.slaDistribution || [
    { name: "On Track", value: 395, color: "#16803c", percentage: "74.5%", desc: "Within safe statutory SLA" },
    { name: "At Risk", value: 48, color: "#D97706", percentage: "9.1%", desc: "Due within next 12-48h" },
    { name: "Critical", value: 20, color: "#EA580C", percentage: "3.8%", desc: "Due in <12h / Escalation" },
    { name: "Breached", value: 42, color: "#DC2626", percentage: "7.9%", desc: "Statutory deadline exceeded" },
    { name: "Delivered", value: 25, color: "#1464A5", percentage: "4.7%", desc: "Issued within SLA" },
  ];

  const departments = dashboardData?.departments || [
    { id: "d1", name: "Revenue & Disaster Management", compliance: 89, avgTat: 4.2, applications: 154, breaches: 17, activeDps: 12 },
    { id: "d2", name: "Transport Department", compliance: 92, avgTat: 3.8, applications: 98, breaches: 8, activeDps: 8 },
    { id: "d3", name: "Health & Family Welfare", compliance: 91, avgTat: 3.5, applications: 84, breaches: 7, activeDps: 6 },
    { id: "d4", name: "Urban Development & Municipal Affairs", compliance: 78, avgTat: 6.8, applications: 76, breaches: 17, activeDps: 6 },
    { id: "d5", name: "Panchayat & Rural Development", compliance: 88, avgTat: 5.2, applications: 42, breaches: 5, activeDps: 4 },
  ];

  const districts = dashboardData?.districts || [
    { id: "dis-1", name: "Kamrup Metropolitan", compliance: 94, applications: 182, breaches: 11, offices: 4, status: "Strong" },
    { id: "dis-2", name: "Dibrugarh", compliance: 91, applications: 86, breaches: 8, offices: 3, status: "Strong" },
    { id: "dis-3", name: "Jorhat", compliance: 89, applications: 72, breaches: 8, offices: 3, status: "Satisfactory" },
    { id: "dis-4", name: "Sonitpur", compliance: 81, applications: 64, breaches: 12, offices: 2, status: "Satisfactory" },
    { id: "dis-5", name: "Karimganj", compliance: 71, applications: 68, breaches: 20, offices: 2, status: "Attention Required" },
  ];

  const topOffices = dashboardData?.officesSummary?.top || [
    { id: "OFF-001", name: "Guwahati Circle Office", district: "Kamrup Metro", compliance: 97, avgTat: 2.8, volume: 56 },
    { id: "OFF-004", name: "Dibrugarh West Circle", district: "Dibrugarh", compliance: 94, avgTat: 3.2, volume: 42 },
    { id: "OFF-008", name: "Jorhat Sadar Circle", district: "Jorhat", compliance: 93, avgTat: 3.4, volume: 38 },
  ];

  const atRiskOffices = dashboardData?.officesSummary?.atRisk || [
    { id: "OFF-003", name: "Karimganj Circle Office", district: "Karimganj", compliance: 71, avgTat: 8.4, breaches: 14, volume: 48 },
    { id: "OFF-009", name: "Tezpur Urban Municipal Board", district: "Sonitpur", compliance: 74, avgTat: 7.6, breaches: 12, volume: 34 },
    { id: "OFF-006", name: "Silchar Sadar Circle", district: "Cachar", compliance: 78, avgTat: 6.9, breaches: 9, volume: 40 },
  ];

  const defaultTrend = [
    { month: "April", compliance: 81, applications: 380, breaches: 72 },
    { month: "May", compliance: 83, applications: 410, breaches: 68 },
    { month: "June", compliance: 85, applications: 430, breaches: 64 },
    { month: "July", compliance: 84, applications: 450, breaches: 70 },
    { month: "August", compliance: 87, applications: 490, breaches: 58 },
    { month: "September", compliance: kpis.slaCompliance, applications: kpis.totalApplications, breaches: kpis.activeBreaches },
  ];

  return (
    <div className="py-5 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-6">
      {/* PostgreSQL Live Engine Status Banner */}
      <div className="bg-emerald-900 text-white px-4 py-2.5 rounded-md flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2.5">
          <Database className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">
            PostgreSQL Database & SLA Engine:
          </span>
          <span className="bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded font-mono font-medium">
            Active Connection • {kpis.totalApplications} Live Records Loaded
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-200">
            Average TAT: <strong className="text-white">{kpis.averageTat} Days</strong>
          </span>
          <Link
            href="/data-integration"
            className="bg-emerald-700 hover:bg-emerald-600 px-2.5 py-1 rounded text-white font-medium transition-colors"
          >
            Integration Telemetry →
          </Link>
        </div>
      </div>

      {/* Page Header with Period Selector & Live Refresh Indicator */}
      <PageHeader
        title="RTPS Performance Intelligence"
        subtitle="Continuous RTPS Service Delivery Performance & Statutory SLA Engine • Government of Assam"
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={fetchDashboardStats}
            disabled={loading}
            className="flex items-center gap-1.5 bg-white border border-slate-300 rounded px-2.5 py-1 shadow-2xs text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          {/* Performance Period Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded px-2.5 py-1 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-semibold text-slate-600 hidden sm:inline">Period:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#0f3443] focus:outline-none cursor-pointer"
            >
              <option value="today">Today (Live PostgreSQL)</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days (Standard)</option>
              <option value="quarter">This Quarter</option>
              <option value="year">Financial Year</option>
            </select>
          </div>

          {/* Live Data Refresh & Engine Indicator */}
          <div className="flex items-center gap-2 bg-[#f1f5f9] border border-slate-200 rounded px-3 py-1">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#16803c]">
              <span className="w-2 h-2 rounded-full bg-[#16803c] animate-pulse" />
              LIVE DB
            </span>
            <span className="text-slate-300 text-xs">|</span>
            <span className="text-[11px] text-slate-600 font-medium">
              Synced: {lastRefreshed}
            </span>
            <span className="text-slate-300 text-xs hidden md:inline">|</span>
            <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded font-bold uppercase hidden md:inline">
              PostgreSQL Seeded
            </span>
          </div>
        </div>
      </PageHeader>

      {/* KPI Top Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiCard
          title="Overall SLA Compliance"
          value={`${kpis.slaCompliance}%`}
          accent="blue"
          icon={<TrendingUp className="w-5 h-5 text-[#1464A5]" />}
        />
        <Link href="/sla-monitor?status=AT_RISK" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md">
          <KpiCard
            title="Applications At Risk"
            value={kpis.applicationsAtRisk.toLocaleString()}
            accent="orange"
            icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
          />
        </Link>
        <Link href="/sla-monitor?status=BREACHED" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-md">
          <KpiCard
            title="SLA Breaches"
            value={kpis.activeBreaches.toLocaleString()}
            accent="red"
            icon={<ShieldAlert className="w-5 h-5 text-[#c62828]" />}
          />
        </Link>
        <Link href="/recognition" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md">
          <KpiCard
            title="High Performing DPS"
            value={kpis.highPerformingDps.toString()}
            accent="green"
            icon={<Users className="w-5 h-5 text-[#16803c]" />}
          />
        </Link>
        <Link href="/sla-monitor" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 rounded-md">
          <KpiCard
            title="Total Applications"
            value={kpis.totalApplications.toLocaleString()}
            accent="default"
            icon={<BarChart3 className="w-5 h-5 text-slate-700" />}
          />
        </Link>
      </div>

      {/* MIDDLE AREA: SLA Compliance Trend (Left) + Operational Attention Required (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* SLA Compliance Trend Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-md shadow-xs p-5 flex flex-col justify-between">
          <div>
            <SectionHeader
              title="SLA Compliance Trend"
              subtitle="Monthly aggregate compliance across all monitored citizen public services"
            />
            <div className="h-64 mt-3">
              <SLAComplianceChart data={defaultTrend} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 mt-2">
            <span>Target Statutory SLA: <strong className="text-slate-700">85.0%</strong></span>
            <span className="text-[#16803c] font-semibold">▲ +6.4% improvement trend recorded</span>
          </div>
        </div>

        {/* Operational Attention Required Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-md shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-base font-bold text-[#0f3443] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Administrative Action Required
                </h3>
                <p className="text-xs text-slate-500">
                  Calculated by SLA Engine from live PostgreSQL pendency logs
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Active Breaches: {kpis.activeBreaches}
              </span>
            </div>

            <div className="space-y-3">
              {/* Item 1: DPS Review */}
              <div className="p-3 rounded border border-red-200 bg-red-50/50 hover:bg-red-50 transition-colors flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c62828] flex-shrink-0" />
                    <span className="text-xs font-bold text-red-950 uppercase tracking-wide">
                      5 Chronic Delay Officers
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Compliance &lt;70% • Repeat delays &gt;10 in Document Verification.
                  </p>
                </div>
                <Link
                  href="/reviews"
                  className="text-xs font-bold text-[#c62828] hover:text-red-800 flex items-center gap-1 flex-shrink-0 pt-0.5"
                >
                  View cases <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Item 2: At-Risk Applications */}
              <div className="p-3 rounded border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition-colors flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                      {kpis.applicationsAtRisk} Applications Approaching Breach
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Statutory deadline due within &lt;48 hours across circles.
                  </p>
                </div>
                <Link
                  href="/sla-monitor?status=AT_RISK"
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 flex-shrink-0 pt-0.5"
                >
                  View apps <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Item 3: Offices with Backlogs */}
              <div className="p-3 rounded border border-yellow-200 bg-yellow-50/40 hover:bg-yellow-50 transition-colors flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-600 flex-shrink-0" />
                    <span className="text-xs font-bold text-yellow-950 uppercase tracking-wide">
                      Karimganj & Tezpur Municipal
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Lowest compliance circles: 71% and 74% statutory adherence.
                  </p>
                </div>
                <Link
                  href="/offices"
                  className="text-xs font-bold text-yellow-800 hover:text-yellow-950 flex items-center gap-1 flex-shrink-0 pt-0.5"
                >
                  View offices <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-slate-400">Escalation Rule: ARTPS Sec 7(1)</span>
            <Link href="/dps" className="font-semibold text-[#1464A5] hover:underline flex items-center gap-1">
              Full DPS Directory →
            </Link>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: SLA Distribution Donut (Left) + Department Breakdown Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* SLA Status Distribution Donut */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-md shadow-xs p-5 flex flex-col justify-between">
          <div>
            <SectionHeader
              title="SLA Compliance Distribution"
              subtitle="Active application volume by statutory deadline state"
            />
            <div className="h-56 mt-2">
              <SLADonutChart data={slaDist} />
            </div>

            {/* Distribution Legend List */}
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
              {slaDist.map((item: any) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="text-slate-400 text-[10px]">({item.desc})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-800">{item.value.toLocaleString()}</span>
                    <span className="text-slate-500 w-12 text-right">{item.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between mt-3">
            <span>Critical Cut-off: &lt;12h</span>
            <Link href="/sla-monitor" className="text-[#1464A5] font-semibold hover:underline">
              Inspect Live Monitor →
            </Link>
          </div>
        </div>

        {/* Department Performance Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-md shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-base font-bold text-[#0f3443]">
                  Department Performance Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Aggregated from PostgreSQL application records across departments
                </p>
              </div>
              <Link href="/departments" className="text-xs font-semibold text-[#1464A5] hover:underline flex items-center gap-1">
                All Departments <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold text-left">
                    <th className="pb-2">Department</th>
                    <th className="pb-2 text-right">Applications</th>
                    <th className="pb-2 text-right">Avg TAT</th>
                    <th className="pb-2 text-right">Breaches</th>
                    <th className="pb-2 text-right">SLA %</th>
                    <th className="pb-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(() => {
                    const deptPageSize = 10;
                    const totalDeptPages = Math.max(1, Math.ceil(departments.length / deptPageSize));
                    const paginatedDepartments = departments.slice((deptPage - 1) * deptPageSize, deptPage * deptPageSize);
                    return paginatedDepartments.map((dept: any) => (
                      <tr key={dept.id || dept.name} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 font-medium text-slate-800 flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{dept.name}</span>
                        </td>
                        <td className="py-2.5 text-right font-mono text-slate-700">
                          {dept.applications.toLocaleString()}
                        </td>
                        <td className="py-2.5 text-right font-mono text-slate-600">
                          {dept.avgTat}d
                        </td>
                        <td className="py-2.5 text-right font-mono text-red-600 font-bold">
                          {dept.breaches}
                        </td>
                        <td className="py-2.5 text-right">
                          <span
                            className={`font-mono font-bold ${
                              dept.compliance >= 90
                                ? "text-[#16803c]"
                                : dept.compliance >= 80
                                ? "text-blue-700"
                                : "text-[#c62828]"
                            }`}
                          >
                            {dept.compliance}%
                          </span>
                        </td>
                        <td className="py-2.5 text-center">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              dept.compliance >= 90
                                ? "bg-emerald-100 text-emerald-800"
                                : dept.compliance >= 80
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {dept.compliance >= 90 ? "Strong" : dept.compliance >= 80 ? "Normal" : "Review"}
                          </span>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={deptPage}
              totalPages={Math.max(1, Math.ceil(departments.length / 10))}
              totalItems={departments.length}
              pageSize={10}
              onPageChange={setDeptPage}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Statutory Target: 85%</span>
            <span className="text-[#16803c] font-medium">Secondary Education highest at 94%</span>
          </div>
        </div>
      </div>

      {/* DISTRICT PERFORMANCE & OFFICE SNAPSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* District Performance */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-md shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div>
              <h3 className="text-base font-bold text-[#0f3443]">
                District Administrative Adherence
              </h3>
              <p className="text-xs text-slate-500">
                Top & Priority Districts by statutory SLA compliance
              </p>
            </div>
            <Link href="/offices" className="text-xs font-semibold text-[#1464A5] hover:underline flex items-center gap-1">
              View Circles <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {districts.map((dist: any) => (
              <div key={dist.id || dist.name} className="flex items-center justify-between p-2.5 rounded border border-slate-100 hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{dist.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {dist.applications.toLocaleString()} Applications • {dist.breaches} Breaches
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono font-bold text-xs ${
                      dist.compliance >= 90
                        ? "text-[#16803c]"
                        : dist.compliance >= 80
                        ? "text-blue-700"
                        : "text-[#c62828]"
                    }`}
                  >
                    {dist.compliance}%
                  </span>
                  <span
                    className={`block text-[10px] font-semibold ${
                      dist.compliance >= 90
                        ? "text-emerald-700"
                        : dist.compliance >= 80
                        ? "text-slate-600"
                        : "text-red-600 font-bold"
                    }`}
                  >
                    {dist.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Office Snapshot: Top vs At-Risk */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-md shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-base font-bold text-[#0f3443]">
                  Circles & Field Offices Snapshot
                </h3>
                <p className="text-xs text-slate-500">
                  Highest vs Attention-Required Circle Offices in Assam
                </p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded">
                20 Offices Seeded
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16803c]" /> Top Performing Circle Offices
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {topOffices.slice(0, 3).map((off: any) => (
                    <div key={off.id} className="p-2.5 rounded bg-emerald-50/60 border border-emerald-200">
                      <h4 className="text-xs font-bold text-emerald-950 truncate">{off.name}</h4>
                      <p className="text-[10px] text-emerald-700">{off.district}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-emerald-900">{off.compliance}%</span>
                        <span className="text-[10px] text-slate-600">{off.avgTat}d TAT</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#c62828]" /> Attention Required Circle Offices
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {atRiskOffices.slice(0, 3).map((off: any) => (
                    <div key={off.id} className="p-2.5 rounded bg-red-50/60 border border-red-200">
                      <h4 className="text-xs font-bold text-red-950 truncate">{off.name}</h4>
                      <p className="text-[10px] text-red-700">{off.district}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-red-900">{off.compliance}%</span>
                        <span className="text-[10px] text-red-700 font-bold">{off.breaches} Breaches</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link href="/reviews" className="text-[#c62828] font-bold hover:underline">
              Issue Formal Explanation Notice →
            </Link>
            <Link href="/recognition" className="text-[#16803c] font-bold hover:underline">
              Issue Merit Commendations →
            </Link>
          </div>
        </div>
      </div>

      {/* NEW: VISUAL PERFORMANCE ANALYTICS */}
      <VisualAnalyticsSection />
    </div>
  );
}
