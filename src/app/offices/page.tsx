"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Building2,
  Search,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  MapPin,
  X,
  FileSpreadsheet,
  Award
} from "lucide-react";

interface OfficeRecord {
  id: string;
  name: string;
  district: string;
  department: string;
  headOfficer: string;
  applications: number;
  compliance: number;
  avgTat: number;
  statutoryLimit: number;
  breaches: number;
  repeatDelays: number;
  score: number;
  status: "Exemplary" | "Satisfactory" | "At Risk" | "Critical";
  dpsCount: number;
  topDelayedService?: string;
}

const officesData: OfficeRecord[] = [
  {
    id: "OFF-KAM-01",
    name: "Guwahati Revenue Circle",
    district: "Kamrup Metro",
    department: "Revenue & Disaster Mgmt",
    headOfficer: "Sri Bhaskar Jyoti Sarma",
    applications: 3400,
    compliance: 97,
    avgTat: 2.8,
    statutoryLimit: 7.0,
    breaches: 12,
    repeatDelays: 0,
    score: 98,
    status: "Exemplary",
    dpsCount: 14,
    topDelayedService: "None (Zero Backlog)",
  },
  {
    id: "OFF-KAM-02",
    name: "Dispur District Transport Office",
    district: "Kamrup Metro",
    department: "Transport Department",
    headOfficer: "Smti Parbin Sultana",
    applications: 5200,
    compliance: 92,
    avgTat: 3.4,
    statutoryLimit: 5.0,
    breaches: 68,
    repeatDelays: 4,
    score: 91,
    status: "Exemplary",
    dpsCount: 18,
    topDelayedService: "Commercial Fitness",
  },
  {
    id: "OFF-DIB-01",
    name: "Dibrugarh West Revenue Circle",
    district: "Dibrugarh",
    department: "Revenue & Disaster Mgmt",
    headOfficer: "Sri Anjan Kumar Das",
    applications: 2200,
    compliance: 95,
    avgTat: 3.2,
    statutoryLimit: 7.0,
    breaches: 24,
    repeatDelays: 1,
    score: 94,
    status: "Exemplary",
    dpsCount: 11,
    topDelayedService: "Caste Certificate",
  },
  {
    id: "OFF-JOR-01",
    name: "Jorhat Sadar Circle Office",
    district: "Jorhat",
    department: "Revenue & Disaster Mgmt",
    headOfficer: "Sri Pratul Baruah",
    applications: 1950,
    compliance: 94,
    avgTat: 3.4,
    statutoryLimit: 7.0,
    breaches: 28,
    repeatDelays: 2,
    score: 93,
    status: "Exemplary",
    dpsCount: 9,
    topDelayedService: "Income Certificate",
  },
  {
    id: "OFF-SON-01",
    name: "Tezpur Municipal Board",
    district: "Sonitpur",
    department: "Urban & Municipal Affairs",
    headOfficer: "Sri Diganta Bora",
    applications: 1800,
    compliance: 82,
    avgTat: 6.8,
    statutoryLimit: 7.0,
    breaches: 95,
    repeatDelays: 14,
    score: 81,
    status: "Satisfactory",
    dpsCount: 8,
    topDelayedService: "Trade License Renewal",
  },
  {
    id: "OFF-CAC-01",
    name: "Silchar Revenue Circle",
    district: "Cachar",
    department: "Revenue & Disaster Mgmt",
    headOfficer: "Sri Manabendra Nath",
    applications: 3100,
    compliance: 78,
    avgTat: 7.1,
    statutoryLimit: 7.0,
    breaches: 280,
    repeatDelays: 22,
    score: 79,
    status: "At Risk",
    dpsCount: 15,
    topDelayedService: "Permanent Residence Cert",
  },
  {
    id: "OFF-KAR-01",
    name: "Karimganj Circle Office",
    district: "Karimganj",
    department: "Revenue & Disaster Mgmt",
    headOfficer: "Sri Ramen Barman",
    applications: 2450,
    compliance: 71,
    avgTat: 8.4,
    statutoryLimit: 7.0,
    breaches: 412,
    repeatDelays: 45,
    score: 72,
    status: "Critical",
    dpsCount: 12,
    topDelayedService: "Mutation / Partition of Land",
  },
  {
    id: "OFF-DHU-01",
    name: "Dhubri Town Municipal Cell",
    district: "Dhubri",
    department: "Urban & Municipal Affairs",
    headOfficer: "Sri Rafiqul Islam",
    applications: 850,
    compliance: 74,
    avgTat: 7.6,
    statutoryLimit: 7.0,
    breaches: 110,
    repeatDelays: 19,
    score: 75,
    status: "Critical",
    dpsCount: 5,
    topDelayedService: "Building Permission NOC",
  },
  {
    id: "OFF-NAG-01",
    name: "Nagaon Sadar Circle",
    district: "Nagaon",
    department: "Revenue & Disaster Mgmt",
    headOfficer: "Sri Hiranya Goswami",
    applications: 2800,
    compliance: 93,
    avgTat: 3.5,
    statutoryLimit: 7.0,
    breaches: 44,
    repeatDelays: 3,
    score: 92,
    status: "Exemplary",
    dpsCount: 13,
    topDelayedService: "Non-Creamy Layer Cert",
  },
  {
    id: "OFF-JOR-02",
    name: "Jorhat District Hospital (Vital Statistics)",
    district: "Jorhat",
    department: "Health & Family Welfare",
    headOfficer: "Dr. Hemen Hazarika",
    applications: 1420,
    compliance: 96,
    avgTat: 3.1,
    statutoryLimit: 7.0,
    breaches: 18,
    repeatDelays: 0,
    score: 95,
    status: "Exemplary",
    dpsCount: 7,
    topDelayedService: "Birth Certificate",
  },
  {
    id: "OFF-DIB-02",
    name: "Inspector of Schools Dibrugarh",
    district: "Dibrugarh",
    department: "School Education",
    headOfficer: "Sri Anjan Kumar Das",
    applications: 950,
    compliance: 95,
    avgTat: 3.8,
    statutoryLimit: 7.0,
    breaches: 14,
    repeatDelays: 0,
    score: 94,
    status: "Exemplary",
    dpsCount: 6,
    topDelayedService: "School Transfer Certificate",
  },
  {
    id: "OFF-KOK-01",
    name: "Kokrajhar Sadar Revenue Circle",
    district: "Kokrajhar",
    department: "Revenue & Disaster Mgmt",
    headOfficer: "Sri Bwhwiti Narzary",
    applications: 1650,
    compliance: 86,
    avgTat: 5.6,
    statutoryLimit: 7.0,
    breaches: 88,
    repeatDelays: 9,
    score: 85,
    status: "Satisfactory",
    dpsCount: 10,
    topDelayedService: "Tribal Land Transfer NOC",
  },
];

export default function OfficePerformance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"compliance" | "volume" | "breaches" | "repeat" | "score">("compliance");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedOffice, setSelectedOffice] = useState<OfficeRecord | null>(null);

  // Departments list
  const departments = useMemo(() => {
    const set = new Set(officesData.map((o) => o.department));
    return Array.from(set);
  }, []);

  // Districts list
  const districts = useMemo(() => {
    const set = new Set(officesData.map((o) => o.district));
    return Array.from(set);
  }, []);

  // Filtered and sorted data
  const filteredOffices = useMemo(() => {
    return officesData
      .filter((office) => {
        const matchesSearch =
          office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          office.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          office.headOfficer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          office.district.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = selectedDept === "all" || office.department === selectedDept;
        const matchesDistrict = selectedDistrict === "all" || office.district === selectedDistrict;
        const matchesStatus =
          selectedStatus === "all" ||
          (selectedStatus === "exemplary" && office.compliance >= 90) ||
          (selectedStatus === "satisfactory" && office.compliance >= 80 && office.compliance < 90) ||
          (selectedStatus === "risk" && office.compliance < 80);

        return matchesSearch && matchesDept && matchesDistrict && matchesStatus;
      })
      .sort((a, b) => {
        let valA: number = a.compliance;
        let valB: number = b.compliance;
        if (sortBy === "compliance") {
          valA = a.compliance;
          valB = b.compliance;
        } else if (sortBy === "volume") {
          valA = a.applications;
          valB = b.applications;
        } else if (sortBy === "breaches") {
          valA = a.breaches;
          valB = b.breaches;
        } else if (sortBy === "repeat") {
          valA = a.repeatDelays;
          valB = b.repeatDelays;
        } else if (sortBy === "score") {
          valA = a.score;
          valB = b.score;
        }
        if (sortOrder === "asc") return valA - valB;
        return valB - valA;
      });
  }, [searchTerm, selectedDept, selectedDistrict, selectedStatus, sortBy, sortOrder]);

  // Operational metrics
  const totalOffices = officesData.length;
  const exemplaryCount = officesData.filter((o) => o.compliance >= 90).length;
  const atRiskCount = officesData.filter((o) => o.compliance < 80).length;
  const totalApps = officesData.reduce((acc, o) => acc + o.applications, 0);
  const avgStateCompliance = Math.round(
    officesData.reduce((acc, o) => acc + o.compliance, 0) / officesData.length
  );

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "text-[#16803c] bg-[#e8f5ec] border-[#b9e4c5]";
    if (score >= 80) return "text-[#d97706] bg-[#fef7e6] border-[#fde6a0]";
    return "text-[#C62828] bg-[#fde8e8] border-[#f5b5b5]";
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-5">
      <PageHeader
        title="Office & Circle Performance Intelligence"
        subtitle="Continuous administrative monitoring of Circle Offices, Municipal Boards, and Regional Cells under ARTPS Act"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#1464A5]" />
            Export Circle Audit
          </Button>
        </div>
      </PageHeader>

      {/* Operational Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Monitored Circles</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">{totalOffices}</span>
            <span className="text-[11px] text-slate-500">Divisional units</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Avg State Compliance</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#1464A5]">{avgStateCompliance}%</span>
            <span className="text-[11px] text-green-700 font-medium">↑ +1.2% this mo</span>
          </div>
        </div>
        <div className="bg-white border border-green-200 bg-green-50/20 rounded-md p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold text-green-800 uppercase tracking-wider">Exemplary (&gt;90%)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#16803c]">{exemplaryCount}</span>
            <span className="text-[11px] text-green-700">Eligible for citations</span>
          </div>
        </div>
        <div className="bg-white border border-red-200 bg-red-50/25 rounded-md p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold text-red-800 uppercase tracking-wider">Critical / At Risk (&lt;80%)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#C62828]">{atRiskCount}</span>
            <span className="text-[11px] text-red-700 font-medium">Reviews active</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs col-span-2 sm:col-span-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Active Caseload</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono">{totalApps.toLocaleString()}</span>
            <span className="text-[11px] text-slate-500">Citizen apps</span>
          </div>
        </div>
      </div>

      {/* Control Room Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-md p-3 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Circle / Office name, Code, District, or Circle Officer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50/50 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1464A5] focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Department */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1464A5]"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* District */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1464A5]"
            >
              <option value="all">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Performance Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1464A5]"
            >
              <option value="all">All Performance Levels</option>
              <option value="exemplary">Exemplary (&ge; 90%)</option>
              <option value="satisfactory">Satisfactory (80–89%)</option>
              <option value="risk">Critical / At Risk (&lt; 80%)</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1464A5]"
            >
              <option value="compliance">Sort: SLA Compliance %</option>
              <option value="score">Sort: Index Score</option>
              <option value="volume">Sort: Application Volume</option>
              <option value="breaches">Sort: SLA Breaches</option>
              <option value="repeat">Sort: Repeat Delays</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-1.5 text-xs bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-600"
              title={`Switch to ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
          <span>
            Displaying <strong>{filteredOffices.length}</strong> of {totalOffices} regional administrative offices
          </span>
          {(searchTerm || selectedDept !== "all" || selectedDistrict !== "all" || selectedStatus !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDept("all");
                setSelectedDistrict("all");
                setSelectedStatus("all");
              }}
              className="text-[#1464A5] hover:underline font-semibold flex items-center gap-1"
            >
              Reset Filters <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Main Office Benchmark Table */}
      <div className="border border-slate-200 rounded-md bg-white shadow-2xs overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#EEF6FA] hover:bg-[#EEF6FA] border-b border-slate-200">
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider py-3">Office Code & Name</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">Department</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">District</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Volume</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">SLA Compliance</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Avg TAT</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Breaches</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Repeat Delays</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-center">Score</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOffices.map((office) => (
              <TableRow
                key={office.id}
                onClick={() => setSelectedOffice(office)}
                className={`hover:bg-[#F7F9FB] transition-colors border-b border-slate-100 cursor-pointer ${
                  selectedOffice?.id === office.id ? "bg-[#EEF6FA]/50" : ""
                }`}
              >
                {/* Office Name & Code */}
                <TableCell className="py-2.5">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#1464A5] font-mono leading-tight">{office.id}</span>
                    <span className="text-xs font-bold text-slate-900">{office.name}</span>
                    <span className="text-[10px] text-slate-500">Head: {office.headOfficer} ({office.dpsCount} DPS)</span>
                  </div>
                </TableCell>

                {/* Department */}
                <TableCell className="text-xs text-slate-700">
                  <span className="inline-block px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-800 font-medium">
                    {office.department}
                  </span>
                </TableCell>

                {/* District */}
                <TableCell className="text-xs text-slate-700">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span>{office.district}</span>
                  </div>
                </TableCell>

                {/* Application Volume */}
                <TableCell className="text-xs text-right font-mono font-medium text-slate-900">
                  {office.applications.toLocaleString()}
                </TableCell>

                {/* SLA Compliance */}
                <TableCell className="text-xs text-right">
                  <div className="flex flex-col items-end">
                    <span
                      className={`font-mono font-bold ${
                        office.compliance >= 90
                          ? "text-[#16803c]"
                          : office.compliance < 80
                          ? "text-[#C62828]"
                          : "text-[#d97706]"
                      }`}
                    >
                      {office.compliance}%
                    </span>
                    <div className="w-16 bg-slate-100 rounded-full h-1.5 mt-0.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          office.compliance >= 90
                            ? "bg-[#16803c]"
                            : office.compliance < 80
                            ? "bg-[#C62828]"
                            : "bg-[#d97706]"
                        }`}
                        style={{ width: `${office.compliance}%` }}
                      />
                    </div>
                  </div>
                </TableCell>

                {/* Avg TAT */}
                <TableCell className="text-xs text-right text-slate-600 font-mono">
                  {office.avgTat}d <span className="text-[10px] text-slate-400">/ {office.statutoryLimit}d</span>
                </TableCell>

                {/* Breaches */}
                <TableCell className="text-xs text-right font-mono">
                  <span className={office.breaches > 100 ? "text-[#C62828] font-bold" : "text-slate-700"}>
                    {office.breaches}
                  </span>
                </TableCell>

                {/* Repeat Delays */}
                <TableCell className="text-xs text-right">
                  {office.repeatDelays > 0 ? (
                    <span
                      className={`inline-flex items-center gap-1 font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        office.repeatDelays >= 15
                          ? "bg-red-50 text-[#C62828] border border-red-200"
                          : "bg-amber-50 text-[#d97706] border border-amber-200"
                      }`}
                    >
                      <AlertTriangle className="w-2.5 h-2.5" />
                      {office.repeatDelays}
                    </span>
                  ) : (
                    <span className="text-[#16803c] font-semibold text-xs font-mono">0</span>
                  )}
                </TableCell>

                {/* Index Score */}
                <TableCell className="text-center">
                  <span
                    className={`inline-flex items-center justify-center w-9 h-6 text-xs font-bold border rounded font-mono ${getScoreBadge(
                      office.score
                    )}`}
                  >
                    {office.score}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOffice(office);
                    }}
                    className="inline-flex items-center px-2 py-1 text-xs bg-white text-[#1464A5] border border-[#1464A5]/30 hover:bg-[#EEF6FA] font-semibold rounded transition-colors"
                  >
                    Inspect <ChevronRight className="w-3 h-3 ml-0.5" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Slide-over Inspection Drawer for Selected Office */}
      {selectedOffice && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-2xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-200 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div>
              <div className="p-5 bg-[#0f3443] text-white flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold font-mono uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded">
                      {selectedOffice.id}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      {selectedOffice.department}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold">{selectedOffice.name}</h2>
                  <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    District: {selectedOffice.district} • Head: {selectedOffice.headOfficer}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOffice(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Alert */}
              <div
                className={`p-3.5 border-b text-xs flex items-center justify-between ${
                  selectedOffice.compliance >= 90
                    ? "bg-[#e8f5ec] text-[#16803c] border-[#b9e4c5]"
                    : selectedOffice.compliance < 80
                    ? "bg-[#fde8e8] text-[#C62828] border-[#f5b5b5]"
                    : "bg-[#fef7e6] text-[#d97706] border-[#fde6a0]"
                }`}
              >
                <div className="flex items-center gap-2 font-medium">
                  {selectedOffice.compliance >= 90 ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>
                    Status: <strong>{selectedOffice.status.toUpperCase()}</strong> • Performance Index:{" "}
                    <strong>{selectedOffice.score}/100</strong>
                  </span>
                </div>
                {selectedOffice.compliance >= 90 ? (
                  <Link
                    href="/recognition"
                    className="underline font-bold text-xs hover:text-green-950"
                  >
                    Nominate Office →
                  </Link>
                ) : (
                  <Link
                    href="/reviews"
                    className="underline font-bold text-xs hover:text-red-950"
                  >
                    Review Case →
                  </Link>
                )}
              </div>

              {/* Core KPIs */}
              <div className="grid grid-cols-4 gap-2 p-5 bg-[#F7F9FB] border-b border-slate-200">
                <div className="bg-white p-3 rounded border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">SLA Compliance</span>
                  <span className={`text-xl font-bold font-mono ${selectedOffice.compliance >= 90 ? "text-[#16803c]" : selectedOffice.compliance < 80 ? "text-[#C62828]" : "text-[#d97706]"}`}>
                    {selectedOffice.compliance}%
                  </span>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Applications</span>
                  <span className="text-xl font-bold font-mono text-slate-900">
                    {selectedOffice.applications.toLocaleString()}
                  </span>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Breaches</span>
                  <span className="text-xl font-bold font-mono text-[#C62828]">
                    {selectedOffice.breaches}
                  </span>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Repeat Delays</span>
                  <span className="text-xl font-bold font-mono text-amber-600">
                    {selectedOffice.repeatDelays}
                  </span>
                </div>
              </div>

              {/* In-depth Circle Breakdown */}
              <div className="p-5 space-y-4 text-xs">
                {/* Service Bottleneck */}
                <div className="bg-white border border-slate-200 rounded p-3.5 space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Identified Service Bottleneck
                  </h4>
                  <div className="flex items-center justify-between text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="font-semibold">{selectedOffice.topDelayedService}</span>
                    <span className="text-slate-500 font-mono">Avg TAT: {selectedOffice.avgTat} days</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    This service accounts for the majority of counter delays and field-verification wait times in this circle.
                  </p>
                </div>

                {/* Attached Officers Roster */}
                <div className="bg-white border border-slate-200 rounded p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      Designated Public Servants ({selectedOffice.dpsCount} Attached)
                    </h4>
                    <Link
                      href={`/dps`}
                      className="text-[#1464A5] hover:underline font-semibold text-[11px]"
                    >
                      View All DPS →
                    </Link>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                      <div>
                        <p className="font-bold text-slate-900">{selectedOffice.headOfficer}</p>
                        <p className="text-[10px] text-slate-500">Circle Officer / First Appellate Authority</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#1464A5]">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                      <div>
                        <p className="font-bold text-slate-900">Lot Mandal Desk (Field Verification)</p>
                        <p className="text-[10px] text-slate-500">5 Mandal units assigned to active applications</p>
                      </div>
                      <span className="text-xs font-mono font-medium text-slate-600">5 Officers</span>
                    </div>
                  </div>
                </div>

                {/* Statutory SLA Compliance Note */}
                <div className="bg-[#EEF6FA] border border-[#cfe2ec] p-3 rounded text-[#123B4A] space-y-1">
                  <p className="font-bold text-[11px] uppercase tracking-wider">
                    Statutory Governance Notice (ARTPS Act 2012)
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Circle offices falling below the 80% SLA compliance threshold are subject to monthly review by the Deputy Commissioner (DC) and Administrative Reforms Department.
                  </p>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOffice(null)}
                className="text-xs border-slate-300"
              >
                Close Inspector
              </Button>
              <div className="flex items-center gap-2">
                <Link href={`/sla-monitor?search=${encodeURIComponent(selectedOffice.name)}`}>
                  <Button
                    size="sm"
                    className="bg-[#0f3443] hover:bg-[#1a4d5e] text-white text-xs font-semibold"
                  >
                    Inspect Active SLA Cases →
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
