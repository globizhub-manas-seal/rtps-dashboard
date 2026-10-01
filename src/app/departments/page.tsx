"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { mockData } from "@/lib/data";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Building2,
  Search,
  LayoutGrid,
  Table as TableIcon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Users,
  FileCheck,
  X
} from "lucide-react";

interface DepartmentDetail {
  id: string;
  name: string;
  shortName: string;
  code: string;
  nodalSecretary: string;
  compliance: number;
  avgTat: number;
  statutoryLimit: number;
  applications: number;
  breaches: number;
  activeDps: number;
  notifiedServicesCount: number;
  bottleneckService: string;
  bottleneckSla: number;
  status: "Exemplary" | "Satisfactory" | "Needs Attention";
  keyServices: { name: string; slaDays: number; compliance: number; volume: number }[];
}

const detailedDepartments: DepartmentDetail[] = [
  {
    id: "d1",
    name: "Revenue & Disaster Management Department",
    shortName: "Revenue & Disaster Mgmt",
    code: "DEPT-REV",
    nodalSecretary: "Principal Secretary (Revenue)",
    compliance: 91,
    avgTat: 4.2,
    statutoryLimit: 7.0,
    applications: 12421,
    breaches: 84,
    activeDps: 184,
    notifiedServicesCount: 42,
    bottleneckService: "Mutation / Partition of Land (76% SLA)",
    bottleneckSla: 76,
    status: "Exemplary",
    keyServices: [
      { name: "Income Certificate", slaDays: 7, compliance: 94, volume: 4800 },
      { name: "Permanent Residence Certificate", slaDays: 14, compliance: 86, volume: 3200 },
      { name: "Mutation / Partition of Land", slaDays: 30, compliance: 76, volume: 2900 },
      { name: "Non-Creamy Layer (NCL) Certificate", slaDays: 15, compliance: 92, volume: 1521 },
    ],
  },
  {
    id: "d2",
    name: "Transport Department",
    shortName: "Transport Department",
    code: "DEPT-TRN",
    nodalSecretary: "Commissioner & Secretary (Transport)",
    compliance: 89,
    avgTat: 5.1,
    statutoryLimit: 5.0,
    applications: 8213,
    breaches: 61,
    activeDps: 96,
    notifiedServicesCount: 28,
    bottleneckService: "Commercial Vehicle Fitness Renewal (81% SLA)",
    bottleneckSla: 81,
    status: "Satisfactory",
    keyServices: [
      { name: "Learner's Driving License", slaDays: 3, compliance: 96, volume: 3400 },
      { name: "Driving License Endorsement", slaDays: 5, compliance: 89, volume: 2200 },
      { name: "Vehicle Registration Transfer", slaDays: 7, compliance: 84, volume: 1600 },
      { name: "Fitness Certificate Renewal", slaDays: 5, compliance: 81, volume: 1013 },
    ],
  },
  {
    id: "d3",
    name: "Health & Family Welfare Department",
    shortName: "Health & Family Welfare",
    code: "DEPT-HFW",
    nodalSecretary: "Commissioner & Secretary (Health)",
    compliance: 85,
    avgTat: 6.8,
    statutoryLimit: 7.0,
    applications: 6921,
    breaches: 92,
    activeDps: 112,
    notifiedServicesCount: 35,
    bottleneckService: "Disability Certificate Verification (79% SLA)",
    bottleneckSla: 79,
    status: "Satisfactory",
    keyServices: [
      { name: "Birth Certificate Issuance", slaDays: 7, compliance: 95, volume: 3100 },
      { name: "Death Certificate Issuance", slaDays: 7, compliance: 93, volume: 1800 },
      { name: "Institutional Health NOC", slaDays: 14, compliance: 82, volume: 1121 },
      { name: "Disability Certificate Assessment", slaDays: 21, compliance: 79, volume: 900 },
    ],
  },
  {
    id: "d4",
    name: "Department of Housing & Urban Affairs",
    shortName: "Urban & Municipal Affairs",
    code: "DEPT-UMA",
    nodalSecretary: "Principal Secretary (Housing & Urban)",
    compliance: 82,
    avgTat: 7.4,
    statutoryLimit: 7.0,
    applications: 5140,
    breaches: 78,
    activeDps: 74,
    notifiedServicesCount: 31,
    bottleneckService: "Trade License Renewal & NOC (74% SLA)",
    bottleneckSla: 74,
    status: "Needs Attention",
    keyServices: [
      { name: "Trade License Issuance", slaDays: 10, compliance: 74, volume: 2100 },
      { name: "Holding Tax Assessment", slaDays: 7, compliance: 86, volume: 1540 },
      { name: "Building Permission NOC", slaDays: 30, compliance: 77, volume: 950 },
      { name: "Water Connection Authorization", slaDays: 14, compliance: 88, volume: 550 },
    ],
  },
  {
    id: "d5",
    name: "Department of School Education",
    shortName: "School Education",
    code: "DEPT-EDU",
    nodalSecretary: "Secretary (School Education)",
    compliance: 94,
    avgTat: 3.5,
    statutoryLimit: 7.0,
    applications: 4110,
    breaches: 19,
    activeDps: 82,
    notifiedServicesCount: 22,
    bottleneckService: "Pension Paper Forwarding (87% SLA)",
    bottleneckSla: 87,
    status: "Exemplary",
    keyServices: [
      { name: "School Transfer Certificate", slaDays: 5, compliance: 97, volume: 1900 },
      { name: "Verification of Marksheets/Pass Cert", slaDays: 7, compliance: 95, volume: 1350 },
      { name: "Teacher Service Book Verification", slaDays: 15, compliance: 89, volume: 560 },
      { name: "Pension Paper Processing", slaDays: 30, compliance: 87, volume: 300 },
    ],
  },
  {
    id: "d6",
    name: "Panchayat & Rural Development Department",
    shortName: "Panchayat & Rural Dev",
    code: "DEPT-PRD",
    nodalSecretary: "Principal Secretary (P&RD)",
    compliance: 88,
    avgTat: 5.8,
    statutoryLimit: 7.0,
    applications: 3837,
    breaches: 42,
    activeDps: 90,
    notifiedServicesCount: 26,
    bottleneckService: "Gaon Panchayat NOC for Construction (82% SLA)",
    bottleneckSla: 82,
    status: "Satisfactory",
    keyServices: [
      { name: "Rural Residence Certificate", slaDays: 7, compliance: 92, volume: 1800 },
      { name: "Gaon Panchayat NOC", slaDays: 10, compliance: 82, volume: 1100 },
      { name: "Job Card Issuance (MGNREGA)", slaDays: 15, compliance: 91, volume: 637 },
      { name: "Rural Water Supply Clearance", slaDays: 14, compliance: 85, volume: 300 },
    ],
  },
];

export default function DepartmentPerformance() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDept, setSelectedDept] = useState<DepartmentDetail | null>(null);

  const filteredDepts = useMemo(() => {
    return detailedDepartments.filter((dept) => {
      const matchesSearch =
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.nodalSecretary.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "exemplary" && dept.compliance >= 90) ||
        (statusFilter === "satisfactory" && dept.compliance >= 85 && dept.compliance < 90) ||
        (statusFilter === "attention" && dept.compliance < 85);

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalApplications = detailedDepartments.reduce((acc, d) => acc + d.applications, 0);
  const totalBreaches = detailedDepartments.reduce((acc, d) => acc + d.breaches, 0);
  const totalDps = detailedDepartments.reduce((acc, d) => acc + d.activeDps, 0);
  const totalServices = detailedDepartments.reduce((acc, d) => acc + d.notifiedServicesCount, 0);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-5">
      <PageHeader
        title="Departmental Service Delivery Intelligence"
        subtitle="Cross-departmental monitoring of notified RTPS services, statutory SLA adherence, and systemic bottlenecks"
      >
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-md border border-slate-300 bg-white p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded ${
                viewMode === "grid"
                  ? "bg-[#0f3443] text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded ${
                viewMode === "table"
                  ? "bg-[#0f3443] text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Matrix Table
            </button>
          </div>
        </div>
      </PageHeader>

      {/* Operational Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Key Line Depts</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">6</span>
            <span className="text-[11px] text-slate-500">Government depts</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notified Services</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#1464A5]">{totalServices}+</span>
            <span className="text-[11px] text-slate-500">Under ARTPS Act</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aggregate Compliance</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#16803c]">88.4%</span>
            <span className="text-[11px] text-green-700 font-medium">State average</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active DPS Officers</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono">{totalDps}</span>
            <span className="text-[11px] text-slate-500">Designated servants</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs col-span-2 sm:col-span-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Active Caseload</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono">{totalApplications.toLocaleString()}</span>
            <span className="text-[11px] text-slate-500">Applications</span>
          </div>
        </div>
      </div>

      {/* Control Room Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-md p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Department name, code (DEPT-REV), or Secretary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50/50 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1464A5] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1464A5]"
          >
            <option value="all">All Compliance Tiers</option>
            <option value="exemplary">High Compliance (&ge; 90%)</option>
            <option value="satisfactory">Standard (85–89%)</option>
            <option value="attention">Attention Required (&lt; 85%)</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: Grid Cards */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDepts.map((dept) => (
            <div
              key={dept.id}
              className="bg-white border border-slate-200 rounded-md shadow-2xs hover:border-[#1464A5]/40 hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden"
            >
              <div>
                {/* Header Strip with Accent */}
                <div
                  className={`h-1.5 ${
                    dept.compliance >= 90
                      ? "bg-[#16803c]"
                      : dept.compliance < 85
                      ? "bg-[#C62828]"
                      : "bg-[#1464A5]"
                  }`}
                />

                <div className="p-5">
                  {/* Top Dept Label */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-[#EEF6FA] rounded text-[#1464A5] group-hover:bg-[#0f3443] group-hover:text-white transition-colors">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                          {dept.code}
                        </span>
                        <h3 className="text-base font-bold text-[#1F2933] group-hover:text-[#1464A5] transition-colors leading-tight">
                          {dept.shortName}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider border ${
                        dept.compliance >= 90
                          ? "bg-[#e8f5ec] text-[#16803c] border-[#b9e4c5]"
                          : dept.compliance < 85
                          ? "bg-[#fde8e8] text-[#C62828] border-[#f5b5b5]"
                          : "bg-[#EEF6FA] text-[#1464A5] border-[#cfe2ec]"
                      }`}
                    >
                      {dept.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mb-4 line-clamp-1">
                    {dept.nodalSecretary}
                  </p>

                  {/* Compliance & Speed Gauges */}
                  <div className="bg-[#F7F9FB] border border-slate-200 rounded p-3.5 mb-4">
                    <div className="flex justify-between items-end mb-1.5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          SLA Compliance
                        </p>
                        <span
                          className={`text-2xl font-bold font-mono ${
                            dept.compliance >= 90
                              ? "text-[#16803c]"
                              : dept.compliance < 85
                              ? "text-[#C62828]"
                              : "text-[#1464A5]"
                          }`}
                        >
                          {dept.compliance}%
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Avg Turnaround
                        </p>
                        <span className="text-sm font-bold font-mono text-slate-800">
                          {dept.avgTat} days{" "}
                          <span className="text-[10px] font-normal text-slate-500">
                            (max {dept.statutoryLimit}d)
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          dept.compliance >= 90
                            ? "bg-[#16803c]"
                            : dept.compliance < 85
                            ? "bg-[#C62828]"
                            : "bg-[#1464A5]"
                        }`}
                        style={{ width: `${dept.compliance}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-100 pt-3 mb-4">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Volume</span>
                      <span className="text-xs font-bold font-mono text-slate-900">
                        {dept.applications.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Breaches</span>
                      <span className="text-xs font-bold font-mono text-[#C62828]">
                        {dept.breaches}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">DPS Roster</span>
                      <span className="text-xs font-bold font-mono text-slate-900">
                        {dept.activeDps}
                      </span>
                    </div>
                  </div>

                  {/* Systemic Bottleneck Alert */}
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded p-2.5 text-xs text-amber-950 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-semibold block text-[10px] uppercase tracking-wider text-amber-900">
                        Primary Bottleneck Service:
                      </span>
                      <span className="text-[11px] leading-tight block text-amber-950 font-medium">
                        {dept.bottleneckService}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="bg-[#F7F9FB] border-t border-slate-200 p-3 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDept(dept)}
                  className="w-full text-xs bg-white text-[#1464A5] border-[#1464A5]/30 hover:bg-[#EEF6FA] font-semibold"
                >
                  Inspect Services ({dept.notifiedServicesCount})
                </Button>
                <Link
                  href={`/sla-monitor?dept=${encodeURIComponent(dept.shortName)}`}
                  className="px-2.5 py-1.5 text-xs bg-white hover:bg-slate-100 border border-slate-300 rounded font-medium text-slate-700 flex items-center gap-1 flex-shrink-0"
                  title="View live SLA cases"
                >
                  Cases <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: Comparative Department Matrix Table */}
      {viewMode === "table" && (
        <div className="border border-slate-200 rounded-md bg-white shadow-2xs overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#EEF6FA] hover:bg-[#EEF6FA]">
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider py-3">Code & Department</TableHead>
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">Secretariat Wing</TableHead>
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Notified Services</TableHead>
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Applications</TableHead>
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">SLA Compliance</TableHead>
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Avg TAT</TableHead>
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Breaches</TableHead>
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Active DPS</TableHead>
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">Identified Bottleneck</TableHead>
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepts.map((dept) => (
                <TableRow key={dept.id} className="hover:bg-[#F7F9FB] transition-colors border-b border-slate-100">
                  <TableCell className="py-2.5">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-[#1464A5] font-mono">{dept.code}</span>
                      <span className="text-xs font-bold text-slate-900">{dept.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">{dept.nodalSecretary}</TableCell>
                  <TableCell className="text-xs text-right font-mono font-medium text-slate-700">
                    {dept.notifiedServicesCount} services
                  </TableCell>
                  <TableCell className="text-xs text-right font-mono font-medium text-slate-900">
                    {dept.applications.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-right font-mono font-bold">
                    <span
                      className={
                        dept.compliance >= 90
                          ? "text-[#16803c]"
                          : dept.compliance < 85
                          ? "text-[#C62828]"
                          : "text-[#1464A5]"
                      }
                    >
                      {dept.compliance}%
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-right font-mono text-slate-700">
                    {dept.avgTat}d <span className="text-[10px] text-slate-400">/ {dept.statutoryLimit}d</span>
                  </TableCell>
                  <TableCell className="text-xs text-right font-mono">
                    <span className={dept.breaches > 50 ? "text-[#C62828] font-bold" : "text-slate-700"}>
                      {dept.breaches}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-right font-mono font-medium text-slate-700">
                    {dept.activeDps}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="inline-block px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded text-[11px] font-medium">
                      {dept.bottleneckService}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => setSelectedDept(dept)}
                      className="inline-flex items-center px-2 py-1 text-xs bg-white text-[#1464A5] border border-[#1464A5]/30 hover:bg-[#EEF6FA] font-semibold rounded"
                    >
                      Inspect →
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Slide-over Inspection Drawer for Selected Department */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-2xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-200 animate-in slide-in-from-right duration-200">
            <div>
              {/* Header */}
              <div className="p-5 bg-[#0f3443] text-white flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold font-mono uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded">
                      {selectedDept.code}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      {selectedDept.notifiedServicesCount} Notified ARTPS Services
                    </span>
                  </div>
                  <h2 className="text-lg font-bold">{selectedDept.name}</h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedDept.nodalSecretary} • {selectedDept.activeDps} Designated Public Servants
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDept(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Department Overview Banner */}
              <div className="grid grid-cols-4 gap-2 p-5 bg-[#F7F9FB] border-b border-slate-200 text-center">
                <div className="bg-white p-3 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Compliance</span>
                  <span className={`text-xl font-bold font-mono ${selectedDept.compliance >= 90 ? "text-[#16803c]" : "text-[#1464A5]"}`}>
                    {selectedDept.compliance}%
                  </span>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Applications</span>
                  <span className="text-xl font-bold font-mono text-slate-900">
                    {selectedDept.applications.toLocaleString()}
                  </span>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Breaches</span>
                  <span className="text-xl font-bold font-mono text-[#C62828]">
                    {selectedDept.breaches}
                  </span>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Avg TAT</span>
                  <span className="text-xl font-bold font-mono text-slate-900">
                    {selectedDept.avgTat}d
                  </span>
                </div>
              </div>

              {/* Key Notified Services Breakdown */}
              <div className="p-5 space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-3">
                    Notified Services & Statutory SLA Breakdown
                  </h4>
                  <div className="space-y-2">
                    {selectedDept.keyServices.map((svc, i) => (
                      <div key={i} className="bg-white border border-slate-200 rounded p-3 text-xs space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{svc.name}</p>
                            <p className="text-[10px] text-slate-500">
                              Statutory SLA: {svc.slaDays} working days • Volume: {svc.volume.toLocaleString()}
                            </p>
                          </div>
                          <span
                            className={`font-mono font-bold text-xs ${
                              svc.compliance >= 90
                                ? "text-[#16803c]"
                                : svc.compliance < 80
                                ? "text-[#C62828]"
                                : "text-[#d97706]"
                            }`}
                          >
                            {svc.compliance}% SLA
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              svc.compliance >= 90
                                ? "bg-[#16803c]"
                                : svc.compliance < 80
                                ? "bg-[#C62828]"
                                : "bg-[#d97706]"
                            }`}
                            style={{ width: `${svc.compliance}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Systemic Delay Advisory */}
                <div className="bg-[#EEF6FA] border border-[#cfe2ec] p-3.5 rounded text-xs text-[#123B4A] space-y-1">
                  <p className="font-bold uppercase tracking-wider text-[11px]">
                    Administrative Bottleneck Advisory
                  </p>
                  <p className="leading-relaxed">
                    Under the Assam Right to Public Services Act 2012, services falling below statutory timelines trigger automated alert dockets for the Nodal Officer and First Appellate Authority.
                  </p>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDept(null)}
                className="text-xs border-slate-300"
              >
                Close
              </Button>
              <div className="flex items-center gap-2">
                <Link href={`/dps`}>
                  <Button
                    size="sm"
                    className="bg-[#0f3443] hover:bg-[#1a4d5e] text-white text-xs font-semibold"
                  >
                    View Assigned DPS Roster →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
