"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Landmark,
  Building2,
  MapPin,
  ArrowLeft,
  Award,
  AlertTriangle,
  ShieldAlert,
  ChevronRight,
  Loader2,
  FileSpreadsheet,
  CheckCircle2
} from "lucide-react";
import { OfficeAnalyticsSummary } from "@/lib/sla-engine";

interface DepartmentDetailData {
  department: {
    id: string;
    code: string;
    name: string;
    nodalOfficer: string;
    totalOffices: number;
    totalApplications: number;
    slaCompliance: number;
    averageTat: number;
    breached: number;
    atRisk: number;
    repeatDelays: number;
    performanceScore: number;
    status: string;
  };
  offices: OfficeAnalyticsSummary[];
}

export default function DepartmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const deptId = params.id as string;

  const [data, setData] = useState<DepartmentDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<keyof OfficeAnalyticsSummary>("performanceScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    async function fetchDeptDetails() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/departments/${deptId}`);
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setData(json);
      } catch (err: any) {
        console.error("Failed to load department details", err);
        setError(err.message || "Failed to load department details");
      } finally {
        setLoading(false);
      }
    }
    if (deptId) fetchDeptDetails();
  }, [deptId]);

  const handleSort = (field: keyof OfficeAnalyticsSummary) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedOffices = useMemo(() => {
    if (!data?.offices) return [];
    const result = [...data.offices];

    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      valA = valA as number;
      valB = valB as number;

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [data?.offices, sortField, sortDirection]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#1464A5]" />
        <p className="text-sm font-medium text-slate-500">Loading department intelligence...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-400" />
        <h2 className="text-lg font-bold text-slate-800">Department Not Found</h2>
        <p className="text-sm text-slate-500">{error}</p>
        <Button onClick={() => router.push("/departments")} variant="outline" className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Departments
        </Button>
      </div>
    );
  }

  const { department } = data;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
        <Link href="/departments" className="hover:text-blue-600 transition-colors">Departments</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold">{department.name}</span>
      </div>

      <PageHeader
        title={department.name}
        subtitle={`Department Code: ${department.code} | Nodal Officer: ${department.nodalOfficer || "N/A"}`}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white text-xs font-semibold shadow-2xs h-8">
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
            Export Dept Report
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-md border border-slate-200 shadow-2xs flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Volume</span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900">{department.totalApplications.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-md border border-slate-200 shadow-2xs flex flex-col justify-center relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              department.slaCompliance >= 90 ? "bg-green-500" :
              department.slaCompliance >= 80 ? "bg-blue-500" :
              department.slaCompliance >= 70 ? "bg-amber-500" : "bg-red-500"
            }`} />
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider pl-2">SLA Compliance</span>
            <div className="flex items-end gap-2 mt-1 pl-2">
              <span className={`text-2xl font-bold font-mono ${
                department.slaCompliance >= 90 ? "text-green-700" :
                department.slaCompliance >= 80 ? "text-blue-700" :
                department.slaCompliance >= 70 ? "text-amber-700" : "text-red-700"
              }`}>{department.slaCompliance.toFixed(1)}%</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-slate-200 shadow-2xs flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Average TAT</span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900">{department.averageTat}</span>
              <span className="text-xs font-semibold text-slate-500 pb-1">days</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-slate-200 shadow-2xs flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Breaches</span>
            <div className="flex items-end gap-2 mt-1">
              <span className={`text-2xl font-bold font-mono ${department.breached > 0 ? "text-red-600" : "text-green-600"}`}>
                {department.breached}
              </span>
              <span className="text-[10px] font-medium text-slate-400 pb-1.5 uppercase tracking-wider">Tickets</span>
            </div>
          </div>
        </div>

        <div className="col-span-1 bg-gradient-to-br from-[#0B252F] to-[#164455] rounded-md border border-[#1a4d61] shadow-2xs p-5 flex flex-col justify-between text-white relative overflow-hidden">
          <div>
            <div className="flex items-center gap-1.5 text-blue-200 text-xs font-medium mb-1">
              <Building2 className="w-4 h-4" />
              {department.totalOffices} Connected Offices
            </div>
          </div>
          
          <div className="mt-4">
            <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">Illustrative Score</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-4xl font-bold font-mono text-white">{department.performanceScore}</span>
              <span className="text-sm font-semibold text-blue-200">/ 100</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white/10 border border-white/20 text-xs font-semibold">
              {department.status === "Excellent" && <Award className="w-3.5 h-3.5 text-green-400" />}
              {department.status === "Satisfactory" && <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" />}
              {department.status === "Attention Required" && <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />}
              {department.status === "Critical" && <ShieldAlert className="w-3.5 h-3.5 text-red-400" />}
              {department.status}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden mt-6">
        <div className="px-5 py-4 border-b border-slate-200 bg-[#F7F9FB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#1464A5]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Subordinate Office Performance
            </h2>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
            {data.offices.length} Offices
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#EEF6FA] hover:bg-[#EEF6FA]">
                <TableHead className="w-[280px] text-[#123B4A] text-[11px] font-semibold uppercase tracking-wider py-3">
                  Office Details
                </TableHead>
                <TableHead className="text-[#123B4A] text-[11px] font-semibold uppercase tracking-wider text-right">
                  Applications
                </TableHead>
                <TableHead className="text-[#123B4A] text-[11px] font-semibold uppercase tracking-wider text-right">
                  SLA %
                </TableHead>
                <TableHead className="text-[#123B4A] text-[11px] font-semibold uppercase tracking-wider text-right">
                  Avg TAT
                </TableHead>
                <TableHead className="text-[#123B4A] text-[11px] font-semibold uppercase tracking-wider text-right">
                  Breaches
                </TableHead>
                <TableHead className="text-[#123B4A] text-[11px] font-semibold uppercase tracking-wider text-right">
                  Repeat Delays
                </TableHead>
                <TableHead className="text-[#123B4A] text-[11px] font-semibold uppercase tracking-wider text-right">
                  <button className="flex items-center justify-end gap-1 focus:outline-none hover:text-blue-700 w-full" onClick={() => handleSort("performanceScore")}>
                    Score
                  </button>
                </TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOffices.map((office) => (
                <TableRow key={office.officeId} className="border-b border-slate-100 hover:bg-[#F7F9FB] group">
                  <TableCell>
                    <div>
                      <div className="font-bold text-slate-900">
                        <Link href={`/offices/${office.officeId}`} className="hover:text-[#1464A5] hover:underline decoration-blue-300 underline-offset-2">
                          {office.officeName}
                        </Link>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{office.district}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-slate-700">
                    {office.totalApplications.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`text-sm font-bold font-mono ${
                      office.slaCompliance >= 95 ? "text-green-700" :
                      office.slaCompliance >= 80 ? "text-blue-700" :
                      office.slaCompliance >= 70 ? "text-amber-600" : "text-red-600"
                    }`}>
                      {office.slaCompliance.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-slate-700">
                    {office.averageTat}d
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-mono text-sm font-bold ${office.breached > 0 ? "text-red-600" : "text-slate-600"}`}>
                      {office.breached}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-mono text-sm font-bold ${office.repeatDelays > 0 ? "text-purple-600" : "text-slate-600"}`}>
                      {office.repeatDelays}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {office.status === "Excellent" && <Award className="w-3.5 h-3.5 text-green-600" />}
                      {office.status === "Satisfactory" && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                      {office.status === "Attention Required" && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                      {office.status === "Critical" && <ShieldAlert className="w-3.5 h-3.5 text-red-600" />}
                      <span className="text-sm font-bold font-mono text-slate-800">
                        {office.performanceScore}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-[#1464A5] opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/offices/${office.officeId}`}>
                        Office View <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {sortedOffices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-slate-500 text-sm">
                    No offices mapped to this department.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
