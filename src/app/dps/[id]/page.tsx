"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { AlertTriangle, ArrowLeft, Building2, MapPin, Award, CheckCircle2, FileText, Phone, Mail, Loader2, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DPSTrendChart = dynamic(() => import("@/components/charts/DPSTrendChart"), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading trend...</div>,
});

export default function DPSDetail() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDps() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/dps/${id}`);
        if (!res.ok) {
          throw new Error("Designated Public Servant record not found");
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        console.error("Failed to load DPS details:", err);
        setError(err.message || "Failed to load DPS details");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDps();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#1464A5]" />
        <p className="text-xs text-slate-500 font-medium">Loading DPS Officer Dossier from PostgreSQL...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-16 max-w-xl mx-auto text-center space-y-4">
        <div className="p-3 bg-red-50 text-red-600 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Officer Record Not Found</h2>
        <p className="text-xs text-slate-500">{error || "Unable to retrieve DPS record from the RTPS database."}</p>
        <Link href="/dps">
          <Button variant="outline" size="sm">Back to DPS Performance</Button>
        </Link>
      </div>
    );
  }

  const { dps, trendData, delayData, applications = [] } = data;
  const metrics = dps.metrics || {};
  const isLowPerformer = (metrics.performanceScore || 80) < 80;
  const isCommendationReady = (metrics.slaCompliance || 0) >= 95 && (metrics.repeatDelays || 0) <= 2;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-5">
      <Link
        href="/dps"
        className="inline-flex items-center text-xs text-[#1464A5] hover:text-[#123B4A] transition-colors font-medium rounded"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to DPS Performance
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#1464A5] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              {dps.employeeCode || dps.id}
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#1F2933]">
              {dps.name}
            </h1>
          </div>
          <p className="text-xs text-[#64748b] mt-1.5 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {dps.office} ({dps.department})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {dps.district} District
            </span>
            {dps.phone && dps.phone !== "—" && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {dps.phone}
                </span>
              </>
            )}
          </p>
          <div className="mt-2.5">
            <StatusBadge status={metrics.status || (isLowPerformer ? "Review Required" : "Satisfactory")} />
          </div>
        </div>

        <div className="text-right bg-white border border-slate-200 rounded-lg px-5 py-3 shadow-2xs">
          <p className="text-[10px] text-[#64748b] font-semibold uppercase tracking-wider mb-0.5">
            Performance Score
          </p>
          <div className={`text-3xl font-bold font-mono ${isLowPerformer ? "text-[#C62828]" : "text-[#16803c]"}`}>
            {Math.round(metrics.performanceScore || 85)}
            <span className="text-sm text-[#64748b] font-normal ml-1">/ 100</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard
          title="SLA Compliance"
          value={`${(metrics.slaCompliance || 0).toFixed(1)}%`}
          accent={isLowPerformer ? "red" : "blue"}
        />
        <KpiCard
          title="Average TAT"
          value={`${metrics.averageTat || 4.5}d`}
          accent="default"
        />
        <KpiCard
          title="Total Applications"
          value={String(metrics.totalApplications || 0)}
          accent="default"
        />
        <KpiCard
          title="Active Breaches"
          value={String(metrics.breached || 0)}
          accent={(metrics.breached || 0) > 0 ? "red" : "default"}
        />
        <KpiCard
          title="Repeat Delays"
          value={String(metrics.repeatDelays || 0)}
          accent={(metrics.repeatDelays || 0) > 3 ? "orange" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Performance Trend */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-2xs p-5 space-y-4">
          <SectionHeader
            title="Performance Trend & Trajectory"
            subtitle="Monthly statutory compliance score under RTPS standards"
          />
          <div className="h-[280px]">
            <DPSTrendChart data={trendData} isLowPerformer={isLowPerformer} />
          </div>

          {/* Assigned Applications Table */}
          {applications.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Recent Applications Handled ({applications.length})
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">RTPS Ref</TableHead>
                      <TableHead className="text-xs">Service</TableHead>
                      <TableHead className="text-xs">Citizen</TableHead>
                      <TableHead className="text-xs">Submission</TableHead>
                      <TableHead className="text-xs">SLA Status</TableHead>
                      <TableHead className="text-xs text-right">Days</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.slice(0, 5).map((app: any) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-mono text-xs font-semibold text-[#1464A5]">
                          {app.rtpsRefNo}
                        </TableCell>
                        <TableCell className="text-xs">{app.serviceName}</TableCell>
                        <TableCell className="text-xs text-slate-600">{app.citizenName}</TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {new Date(app.submissionDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-xs">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              app.slaStatus === "BREACHED"
                                ? "bg-red-100 text-red-700"
                                : app.slaStatus === "AT_RISK"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {app.slaStatus}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-mono text-right text-slate-700">
                          {app.daysTaken ? `${app.daysTaken}d` : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {/* Commendation Certificate Action */}
          {isCommendationReady ? (
            <div className="bg-white border border-emerald-300 border-l-4 border-l-emerald-600 rounded-lg shadow-2xs p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-emerald-900">Merit Commendation Ready</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                This Designated Public Servant maintains high compliance (&ge;95%) with zero repeat delays.
              </p>
              <div className="bg-emerald-50 p-2.5 rounded border border-emerald-200 text-xs space-y-1">
                <p className="font-bold text-emerald-950">Statutory Commendation Nominee</p>
                <p className="text-emerald-800 text-[11px]">Eligible for Assam State RTPS Excellence Certificate.</p>
              </div>
              <Link href={`/recognition/${dps.employeeCode || dps.id}/certificate`}>
                <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Generate Commendation Certificate &rarr;
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg shadow-2xs p-5 space-y-3">
              <SectionHeader title="Delay Analysis" subtitle="Root causes of observed turnaround time" />
              <div className="space-y-2">
                {delayData.map((d: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-slate-50">
                    <span className="text-slate-600">{d.reason}</span>
                    <span className="font-semibold font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {d.cases} cases
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning / Administrative Review Action */}
          {isLowPerformer && (
            <div className="bg-white border border-red-200 border-l-4 border-l-red-600 rounded-lg shadow-2xs p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="text-sm font-bold">Administrative Review Recommended</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compliance is below the 80% statutory threshold. Section 7(1) inquiry notice may be generated.
              </p>
              <Link href={`/reviews?targetDps=${dps.employeeCode || dps.id}`}>
                <Button className="w-full bg-red-700 hover:bg-red-800 text-white text-xs font-semibold">
                  Open Administrative Review &rarr;
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
