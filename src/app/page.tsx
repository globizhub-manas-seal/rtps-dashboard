"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { mockData } from "@/lib/data";
import {
  ShieldAlert, AlertCircle, Users, BarChart3, ArrowRight,
  TrendingUp, Building2, MapPin, FileText, CheckCircle2,
  Calendar, RefreshCw, AlertTriangle, Layers, Award
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

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30d");

  const currentPeriod = mockData.periods.find((p) => p.id === selectedPeriod) || mockData.periods[2];

  return (
    <div className="py-5 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-6">
      {/* Page Header with Period Selector & Live Refresh Indicator */}
      <PageHeader
        title="RTPS Performance Intelligence"
        subtitle="Continuous RTPS Service Delivery Performance & SLA Monitoring • Government of Assam"
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Performance Period Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded px-2.5 py-1 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-semibold text-slate-600 hidden sm:inline">Period:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#0f3443] focus:outline-none cursor-pointer"
            >
              <option value="today">Today (Live)</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="quarter">This Quarter (Q2 FY26)</option>
              <option value="year">This Year (FY 2026-27)</option>
            </select>
          </div>

          {/* Live Data Refresh & DEMO MODE Indicator */}
          <div className="flex items-center gap-2 bg-[#f1f5f9] border border-slate-200 rounded px-3 py-1">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#16803c]">
              <span className="w-2 h-2 rounded-full bg-[#16803c] animate-pulse" />
              LIVE
            </span>
            <span className="text-slate-300 text-xs">|</span>
            <span className="text-[11px] text-slate-600 font-medium">
              Synced: 30 Sep, 10:05 AM
            </span>
            <span className="text-slate-300 text-xs hidden md:inline">|</span>
            <span className="text-[10px] text-amber-700 bg-amber-100/70 border border-amber-300 px-1.5 py-0.2 rounded font-bold uppercase hidden md:inline">
              Demo Feed
            </span>
          </div>
        </div>
      </PageHeader>

      {/* KPI Top Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiCard
          title={`SLA Compliance (${currentPeriod.label})`}
          value={`${currentPeriod.compliance}%`}
          accent="blue"
          icon={<TrendingUp className="w-5 h-5 text-[#1464A5]" />}
        />
        <Link href="/sla-monitor?filter=at-risk" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md">
          <KpiCard
            title="Applications At Risk"
            value={currentPeriod.atRisk.toLocaleString()}
            accent="orange"
            icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
          />
        </Link>
        <KpiCard
          title="SLA Breaches Recorded"
          value={currentPeriod.breaches.toLocaleString()}
          accent="red"
          icon={<ShieldAlert className="w-5 h-5 text-[#c62828]" />}
        />
        <Link href="/recognition" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md">
          <KpiCard
            title="High Performing DPS"
            value="24"
            accent="green"
            icon={<Users className="w-5 h-5 text-[#16803c]" />}
          />
        </Link>
        <KpiCard
          title="Applications Monitored"
          value={currentPeriod.totalApps.toLocaleString()}
          accent="default"
          icon={<BarChart3 className="w-5 h-5 text-slate-700" />}
        />
      </div>

      {/* MIDDLE AREA ABOVE THE FOLD: SLA Compliance Trend (Left) + Operational Attention Required (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* SLA Compliance Trend Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-md shadow-xs p-5 flex flex-col justify-between">
          <div>
            <SectionHeader
              title="SLA Compliance Trend"
              subtitle="Monthly aggregate compliance across all 55+ citizen public services"
            />
            <div className="h-64 mt-3">
              <SLAComplianceChart data={mockData.trend} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 mt-2">
            <span>Target Statutory SLA: <strong className="text-slate-700">85.0%</strong></span>
            <span className="text-[#16803c] font-semibold">▲ +6.4% improvement since April FY26</span>
          </div>
        </div>

        {/* Operational Attention Required Panel (Action-Oriented Control Room) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-md shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-base font-bold text-[#0f3443] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Attention Required
                </h3>
                <p className="text-xs text-slate-500">
                  Operational priorities requiring immediate administrative oversight
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Active Queue
              </span>
            </div>

            <div className="space-y-3">
              {/* Item 1: DPS Review */}
              <div className="p-3 rounded border border-red-200 bg-red-50/50 hover:bg-red-50 transition-colors flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c62828] flex-shrink-0" />
                    <span className="text-xs font-bold text-red-950 uppercase tracking-wide">
                      17 DPS Below Threshold
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    SLA compliance under 75% • Formal administrative explanation required.
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
                      213 Applications Approaching Breach
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Statutory deadline due within the next 24 hours across circles.
                  </p>
                </div>
                <Link
                  href="/sla-monitor?filter=at-risk"
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 flex-shrink-0 pt-0.5"
                >
                  View apps <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Item 3: Offices with Structural Delays */}
              <div className="p-3 rounded border border-yellow-200 bg-yellow-50/40 hover:bg-yellow-50 transition-colors flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 flex-shrink-0" />
                    <span className="text-xs font-bold text-yellow-950 uppercase tracking-wide">
                      8 Offices with Repeat Delays
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Systemic delay patterns detected in land mutation & partition counters.
                  </p>
                </div>
                <Link
                  href="/offices"
                  className="text-xs font-bold text-yellow-900 hover:text-yellow-950 flex items-center gap-1 flex-shrink-0 pt-0.5"
                >
                  View offices <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Item 4: High Performer Recognition */}
              <div className="p-3 rounded border border-green-200 bg-green-50/50 hover:bg-green-50 transition-colors flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16803c] flex-shrink-0" />
                    <span className="text-xs font-bold text-green-950 uppercase tracking-wide">
                      24 DPS High Performers
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    &gt;95% SLA compliance maintained with 0 repeat breaches.
                  </p>
                </div>
                <Link
                  href="/recognition"
                  className="text-xs font-bold text-[#16803c] hover:text-green-800 flex items-center gap-1 flex-shrink-0 pt-0.5"
                >
                  View candidates <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 mt-2">
            <span>Escalation Protocol: <strong className="text-slate-700">Automatic T-24h</strong></span>
            <Link href="/reviews" className="text-[#1464A5] font-semibold hover:underline">
              Administrative Review Console →
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION: Application SLA Status (Donut / Horizontal) + Top & At-Risk Offices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Application SLA Status Visualization */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-md shadow-xs p-5">
          <SectionHeader
            title="Application SLA Status"
            subtitle="Current active queue health across statutory thresholds"
          />

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mt-3">
            {/* Donut Chart */}
            <div className="sm:col-span-5 h-48 relative flex items-center justify-center">
              <SLADonutChart data={mockData.slaDistribution} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-[#0f3443]">48,642</span>
                <span className="text-[10px] text-slate-500 font-medium">Applications</span>
              </div>
            </div>

            {/* Status Breakdown Legend & Counts */}
            <div className="sm:col-span-7 space-y-2">
              {mockData.slaDistribution.map((status) => (
                <div
                  key={status.name}
                  className="flex items-center justify-between p-2 rounded bg-[#fafbfc] border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: status.color }} />
                    <span className="font-semibold text-slate-800">{status.name}</span>
                    <span className="text-[10px] text-slate-500 hidden sm:inline">({status.percentage})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-slate-900">{status.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top & At-Risk Administrative Offices */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-md shadow-xs p-5">
          <SectionHeader
            title="Office Performance Snapshot"
            subtitle="Benchmark of best performing versus at-risk administrative circles"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            {/* Top Performing Offices */}
            <div className="border border-green-200/80 rounded bg-green-50/20 p-3 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-green-200">
                <span className="text-xs font-bold text-[#16803c] uppercase tracking-wide flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High Performing
                </span>
                <span className="text-[10px] text-slate-500">Avg TAT</span>
              </div>
              {mockData.officesSummary.top.map((off) => (
                <div key={off.id} className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">{off.name}</p>
                    <p className="text-[10px] text-slate-500">{off.district}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#16803c]">{off.compliance}%</span>
                    <p className="text-[10px] text-slate-500">{off.avgTat}d</p>
                  </div>
                </div>
              ))}
            </div>

            {/* At-Risk Offices */}
            <div className="border border-red-200/80 rounded bg-red-50/20 p-3 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-red-200">
                <span className="text-xs font-bold text-[#c62828] uppercase tracking-wide flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Needs Attention
                </span>
                <span className="text-[10px] text-slate-500">Breaches</span>
              </div>
              {mockData.officesSummary.atRisk.map((off) => (
                <div key={off.id} className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">{off.name}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[130px]">{off.reason}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#c62828]">{off.compliance}%</span>
                    <p className="text-[10px] text-red-600 font-semibold">{off.breaches} breaches</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end text-xs mt-3">
            <Link href="/offices" className="text-[#1464A5] font-semibold hover:underline flex items-center gap-1">
              View all 48 circle offices across Assam →
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION: Department Performance (Volume + Performance + Breaches) */}
      <div className="bg-white border border-slate-200 rounded-md shadow-xs p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <SectionHeader
            title="Department Performance & Workload Breakdown"
            subtitle="Evaluating service delivery compliance against actual application volumes"
          />
          <Link href="/departments" className="text-xs text-[#1464A5] font-semibold hover:underline">
            View Department Dossier →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#EEF6FA] text-[#123B4A] border-b border-slate-200">
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Department</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Applications Handled</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Avg. Turnaround</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">SLA Breaches</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Active DPS</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-center">Compliance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockData.departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#1464A5]" />
                    {dept.name}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                    {dept.applications.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700">
                    {dept.avgTat} days
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`font-mono font-semibold ${dept.breaches > 70 ? 'text-red-700' : 'text-slate-700'}`}>
                      {dept.breaches}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {dept.activeDps}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-end gap-2 max-w-[140px] ml-auto">
                      <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            dept.compliance >= 90 ? 'bg-[#16803c]' : dept.compliance >= 85 ? 'bg-[#1464A5]' : 'bg-[#D97706]'
                          }`}
                          style={{ width: `${dept.compliance}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800 font-mono w-8">{dept.compliance}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION: District Performance (Item 7) & Service Bottleneck Analysis (Item 8) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* District Performance Dimension (Hierarchy: State -> Dept -> District) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-md shadow-xs p-5">
          <SectionHeader
            title="District Performance Benchmark"
            subtitle="Geographical distribution across Assam administrative districts"
          />

          <div className="space-y-2.5 mt-4">
            {mockData.districts.map((district) => (
              <div
                key={district.id}
                className="flex items-center justify-between p-2.5 rounded border border-slate-100 bg-[#fafbfc] hover:border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[#1464A5] flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">{district.name}</span>
                    <p className="text-[10px] text-slate-500">
                      {district.offices} Circle Offices • {district.applications.toLocaleString()} Applications
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Breaches: {district.breaches}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        district.compliance >= 90
                          ? 'bg-green-100 text-green-800'
                          : district.compliance >= 85
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {district.compliance}% SLA
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Performance (Identifying Service Bottlenecks vs Individual Officers) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-md shadow-xs p-5">
          <SectionHeader
            title="Service Performance & Bottleneck Analysis"
            subtitle="Distinguishing systemic service bottlenecks from officer-level issues"
          />

          <div className="space-y-2.5 mt-4">
            {mockData.services.map((service, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded border text-xs ${
                  service.bottleneck
                    ? 'border-amber-300 bg-amber-50/40'
                    : 'border-slate-100 bg-[#fafbfc]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{service.name}</span>
                      {service.bottleneck && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-500 text-white">
                          Systemic Bottleneck
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {service.department} • Statutory SLA: {service.statutoryDays}d • Avg TAT: {service.avgTat}d • Vol: {service.volume.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span
                      className={`text-xs font-bold font-mono ${
                        service.compliance >= 90 ? 'text-[#16803c]' : service.compliance >= 85 ? 'text-[#1464A5]' : 'text-amber-700'
                      }`}
                    >
                      {service.compliance}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">Compliance</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION: Workload vs SLA Performance (Item 10) */}
      <div className="bg-white border border-slate-200 rounded-md shadow-xs p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <SectionHeader
              title="Workload vs SLA Performance"
              subtitle="Analytical quadrant: Differentiating capacity constraints from administrative inefficiency"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
            Circle Offices Matrix
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="p-3 rounded border border-green-200 bg-green-50/30">
            <h4 className="text-xs font-bold text-green-900 uppercase">Top-Right: Exemplary</h4>
            <p className="text-[11px] text-slate-600 mt-1">
              High Workload (&gt;2,000) + High SLA (&gt;90%). Model circles to study for replication.
            </p>
          </div>
          <div className="p-3 rounded border border-amber-200 bg-amber-50/30">
            <h4 className="text-xs font-bold text-amber-900 uppercase">Bottom-Right: Capacity Constraint</h4>
            <p className="text-[11px] text-slate-600 mt-1">
              High Workload (&gt;2,000) + Low SLA (&lt;80%). Overburdened circles requiring more counters/staff.
            </p>
          </div>
          <div className="p-3 rounded border border-red-200 bg-red-50/30">
            <h4 className="text-xs font-bold text-red-900 uppercase">Bottom-Left: Admin Inefficiency</h4>
            <p className="text-[11px] text-slate-600 mt-1">
              Low Workload (&lt;1,500) + Low SLA (&lt;80%). Priority candidates for administrative review.
            </p>
          </div>
          <div className="p-3 rounded border border-blue-200 bg-blue-50/30">
            <h4 className="text-xs font-bold text-blue-900 uppercase">Top-Left: Steady State</h4>
            <p className="text-[11px] text-slate-600 mt-1">
              Moderate Workload + Strong SLA. Operating smoothly within capacity.
            </p>
          </div>
        </div>

        <div className="h-64">
          <WorkloadScatterChart data={mockData.workloadVsPerformance} />
        </div>
      </div>
    </div>
  );
}
