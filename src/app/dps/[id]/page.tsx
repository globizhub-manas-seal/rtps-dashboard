"use client";

import { Button } from "@/components/ui/button";
import { mockData } from "@/lib/data";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";

const DPSTrendChart = dynamic(() => import("@/components/charts/DPSTrendChart"), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading trend...</div>
});

export default function DPSDetail() {
  const params = useParams();
  const id = params.id as string;
  const dps = mockData.dps.find((d) => d.id === id) || mockData.dps[2];

  const isLowPerformer = dps.score < 80;

  const trendData = [
    { month: "Apr", score: isLowPerformer ? 82 : 95 },
    { month: "May", score: isLowPerformer ? 79 : 96 },
    { month: "Jun", score: isLowPerformer ? 75 : 94 },
    { month: "Jul", score: isLowPerformer ? 78 : 98 },
    { month: "Aug", score: isLowPerformer ? 74 : 97 },
    { month: "Sep", score: dps.score },
  ];

  const delayData = [
    { reason: "Document Verification", cases: 26 },
    { reason: "Applicant Response", cases: 13 },
    { reason: "Technical Issue", cases: 5 },
    { reason: "Other", cases: 17 },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-5">
      <Link
        href="/dps"
        className="inline-flex items-center text-sm text-[#1464A5] hover:text-[#123B4A] transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1464A5] rounded px-1"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to DPS Performance
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#1F2933]">
            {dps.id} — {dps.name}
          </h1>
          <p className="text-sm text-[#64748b] mt-1">
            {dps.office} • {dps.department} Department
          </p>
          <div className="mt-2">
            <StatusBadge status={dps.status} />
          </div>
        </div>
        <div className="text-right bg-white border border-slate-200 rounded-md px-5 py-4 shadow-sm">
          <p className="text-xs text-[#64748b] font-semibold uppercase tracking-wider mb-1">
            Performance Score
          </p>
          <div className={`text-4xl font-bold ${isLowPerformer ? "text-[#C62828]" : "text-[#16803c]"}`}>
            {dps.score}
            <span className="text-lg text-[#64748b] font-normal ml-1">/ 100</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard title="SLA Compliance" value={`${dps.compliance}%`} accent={isLowPerformer ? "red" : "blue"} />
        <KpiCard title="Average TAT" value={`${dps.avgTat} days`} accent="default" />
        <KpiCard title="Applications" value={String(dps.applications)} accent="default" />
        <KpiCard title="SLA Breaches" value={String(dps.breaches || 0)} accent={isLowPerformer ? "red" : "default"} />
        <KpiCard title="Repeat Delays" value={String(dps.repeatDelays)} accent={dps.repeatDelays > 5 ? "orange" : "default"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Performance Trend */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-md shadow-sm p-5">
          <SectionHeader title="6-Month Performance Trend" />
          <div className="h-[280px]">
            <DPSTrendChart data={trendData} isLowPerformer={isLowPerformer} />
          </div>
        </div>

        <div className="space-y-5">
          {/* Service Breakdown */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm p-5">
            <SectionHeader title="Service Breakdown" subtitle="SLA compliance by service" />
            <div className="space-y-4">
              <ServiceBar label="Income Certificate" value={71} />
              <ServiceBar label="Caste Certificate" value={84} />
              <ServiceBar label="Residence Certificate" value={79} />
            </div>
          </div>

          {/* High Performer Commendation Panel */}
          {!isLowPerformer && (
            <div className="bg-white border border-[#b9e4c5] border-l-[3px] border-l-[#16803c] rounded-md shadow-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#16803c]" />
                <h3 className="text-sm font-bold text-[#16803c]">Commendation Candidate (ARTPS)</h3>
              </div>
              <p className="text-xs text-[#64748b] mb-4">
                This Designated Public Servant maintains &gt;95% SLA compliance and zero recurring delays across all assigned services.
              </p>
              <div className="bg-green-50/60 p-2.5 rounded border border-green-200/60 mb-4 text-xs space-y-1">
                <p className="font-semibold text-green-950">Statutory Commendation Status: Eligible</p>
                <p className="text-green-800">Assam Right to Public Services Excellence Award nominee.</p>
              </div>
              <Link href="/recognition">
                <Button className="w-full bg-[#16803c] hover:bg-[#136530] text-white text-sm font-semibold">
                  View Official Citation & Recognition →
                </Button>
              </Link>
            </div>
          )}

          {/* Warning Panel */}
          {isLowPerformer && (
            <div className="bg-white border border-[#f5b5b5] border-l-[3px] border-l-[#C62828] rounded-md shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-[#C62828]" />
                <h3 className="text-sm font-bold text-[#C62828]">Recurring delay pattern detected</h3>
              </div>
              <p className="text-xs text-[#64748b] mb-4">
                This DPS has exceeded the prototype repeat-delay threshold across multiple applications.
              </p>
              <div className="space-y-2 mb-4">
                {delayData.map((d, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[#64748b]">{d.reason}</span>
                    <span className="font-semibold text-[#1F2933]">{d.cases} cases</span>
                  </div>
                ))}
              </div>
              <Link href="/reviews">
                <Button className="w-full bg-[#C62828] hover:bg-[#b71c1c] text-white text-sm font-semibold">
                  Open Administrative Review →
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceBar({ label, value }: { label: string; value: number }) {
  const barColor = value >= 85 ? "#1464A5" : value >= 75 ? "#d97706" : "#C62828";
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-[#1F2933] font-medium">{label}</span>
        <span className="font-semibold" style={{ color: barColor }}>{value}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-sm h-2">
        <div className="h-2 rounded-sm transition-all" style={{ width: `${value}%`, backgroundColor: barColor }} />
      </div>
    </div>
  );
}
