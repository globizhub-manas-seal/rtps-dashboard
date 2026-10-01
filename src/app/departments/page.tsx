"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Landmark,
  Search,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  FileSpreadsheet,
  Award,
  Loader2
} from "lucide-react";

interface DepartmentRecord {
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
  status: "Excellent" | "Satisfactory" | "Attention Required" | "Critical";
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof DepartmentRecord>("totalApplications");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function fetchDepartments() {
      setLoading(true);
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
        setDepartments(data.departments);
      } catch (err) {
        console.error("Failed to load departments", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDepartments();
  }, []);

  const handleSort = (field: keyof DepartmentRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedDepartments = useMemo(() => {
    let result = [...departments];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q)
      );
    }

    if (sortField) {
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
    }

    return result;
  }, [departments, searchQuery, sortField, sortDirection]);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Department Performance Intelligence"
        subtitle="Evaluate administrative efficiency, SLA adherence, and systemic bottlenecks across Government of Assam Line Departments."
      >
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white text-xs font-semibold shadow-2xs h-8">
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
            Export Report
          </Button>
        </div>
      </PageHeader>

      <div className="bg-white border border-slate-200 rounded-md shadow-2xs p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search department name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#1464A5]" />
            <p className="text-sm font-medium">Loading Department Intelligence from PostgreSQL...</p>
          </div>
        ) : filteredAndSortedDepartments.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Landmark className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-medium">No departments found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#EEF6FA] hover:bg-[#EEF6FA]">
                  <TableHead className="w-[300px] text-[#123B4A] text-xs font-semibold uppercase tracking-wider py-3">
                    <button className="flex items-center gap-1 focus:outline-none hover:text-blue-700 w-full" onClick={() => handleSort("name")}>
                      Department
                      <ArrowUpDown className="w-3 h-3 opacity-50" />
                    </button>
                  </TableHead>
                  <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">
                    <button className="flex items-center justify-end gap-1 focus:outline-none hover:text-blue-700 w-full" onClick={() => handleSort("totalOffices")}>
                      Offices
                      <ArrowUpDown className="w-3 h-3 opacity-50" />
                    </button>
                  </TableHead>
                  <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">
                    <button className="flex items-center justify-end gap-1 focus:outline-none hover:text-blue-700 w-full" onClick={() => handleSort("totalApplications")}>
                      Volume
                      <ArrowUpDown className="w-3 h-3 opacity-50" />
                    </button>
                  </TableHead>
                  <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">
                    <button className="flex items-center justify-end gap-1 focus:outline-none hover:text-blue-700 w-full" onClick={() => handleSort("slaCompliance")}>
                      SLA %
                      <ArrowUpDown className="w-3 h-3 opacity-50" />
                    </button>
                  </TableHead>
                  <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">
                    <button className="flex items-center justify-end gap-1 focus:outline-none hover:text-blue-700 w-full" onClick={() => handleSort("averageTat")}>
                      Avg TAT
                      <ArrowUpDown className="w-3 h-3 opacity-50" />
                    </button>
                  </TableHead>
                  <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">
                    <div className="flex flex-col items-end">
                      <span>Pendency</span>
                      <span className="text-[9px] text-slate-500 font-normal normal-case">(Risk / Breach / Repeat)</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">
                    <button className="flex items-center justify-end gap-1 focus:outline-none hover:text-blue-700 w-full" onClick={() => handleSort("performanceScore")}>
                      Score
                      <ArrowUpDown className="w-3 h-3 opacity-50" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedDepartments.map((dept) => (
                  <TableRow key={dept.id} className="border-b border-slate-100 hover:bg-[#F7F9FB] group">
                    <TableCell>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Landmark className="w-3.5 h-3.5 text-slate-400" />
                          <Link href={`/departments/${dept.id}`} className="hover:text-[#1464A5] hover:underline decoration-blue-300 underline-offset-2">
                            {dept.name}
                          </Link>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 ml-5 font-mono">{dept.code}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-slate-700">
                      {dept.totalOffices}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-slate-700">
                      {dept.totalApplications.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`text-sm font-bold font-mono ${
                        dept.slaCompliance >= 95 ? "text-green-700" :
                        dept.slaCompliance >= 80 ? "text-blue-700" :
                        dept.slaCompliance >= 70 ? "text-amber-600" : "text-red-600"
                      }`}>
                        {dept.slaCompliance.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-slate-700">
                      {dept.averageTat}d
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {dept.atRisk > 0 && (
                          <div className="bg-amber-50 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200" title="At Risk">
                            {dept.atRisk} R
                          </div>
                        )}
                        {dept.breached > 0 && (
                          <div className="bg-red-50 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-200" title="Breached">
                            {dept.breached} B
                          </div>
                        )}
                        {dept.repeatDelays > 0 && (
                          <div className="bg-purple-50 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-purple-200" title="Repeat Delays">
                            {dept.repeatDelays} D
                          </div>
                        )}
                        {dept.atRisk === 0 && dept.breached === 0 && dept.repeatDelays === 0 && (
                          <span className="text-slate-300 text-xs">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {dept.status === "Excellent" && <Award className="w-4 h-4 text-green-600" />}
                        {dept.status === "Satisfactory" && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                        {dept.status === "Attention Required" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {dept.status === "Critical" && <ShieldAlert className="w-4 h-4 text-red-600" />}
                        <span className="text-sm font-bold font-mono text-slate-800">
                          {dept.performanceScore}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-[#1464A5] opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/departments/${dept.id}`}>
                          Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
