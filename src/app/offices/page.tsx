"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  MapPin,
  X,
  FileSpreadsheet,
  Award,
  Loader2
} from "lucide-react";
import { OfficeAnalyticsSummary } from "@/lib/sla-engine";
import { Pagination } from "@/components/ui/pagination";

export default function OfficesPage() {
  const [offices, setOffices] = useState<OfficeAnalyticsSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ criticalOffices: 0, recurringDelayOffices: 0, activeBreachOffices: 0 });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Sorting
  const [sortField, setSortField] = useState<keyof OfficeAnalyticsSummary | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function fetchOffices() {
      setLoading(true);
      try {
        const res = await fetch("/api/offices");
        const data = await res.json();
        setOffices(data.offices);
        setSummary(data.summary);
      } catch (err) {
        console.error("Failed to load offices", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffices();
  }, []);

  const handleSort = (field: keyof OfficeAnalyticsSummary) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedOffices = useMemo(() => {
    let result = [...offices];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.officeName.toLowerCase().includes(q) ||
          o.department.toLowerCase().includes(q) ||
          o.district.toLowerCase().includes(q)
      );
    }

    // Status Filter
    if (statusFilter !== "all") {
      if (statusFilter === "critical") result = result.filter((o) => o.status === "Critical");
      if (statusFilter === "at_risk") result = result.filter((o) => o.status === "Attention Required");
      if (statusFilter === "on_track") result = result.filter((o) => o.status === "Excellent" || o.status === "Satisfactory");
    }

    // District Filter
    if (districtFilter !== "all") {
      result = result.filter((o) => o.district === districtFilter);
    }

    // Department Filter
    if (departmentFilter !== "all") {
      result = result.filter((o) => o.department === departmentFilter);
    }

    // Sorting
    if (sortField) {
      result.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        // Handle string comparison safely
        if (typeof valA === "string" && typeof valB === "string") {
          return sortDirection === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        // Numeric or boolean comparison
        valA = valA as number;
        valB = valB as number;
        
        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [offices, searchQuery, statusFilter, districtFilter, departmentFilter, sortField, sortDirection]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, districtFilter, departmentFilter, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedOffices.length / pageSize));
  const paginatedOffices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedOffices.slice(start, start + pageSize);
  }, [filteredAndSortedOffices, currentPage, pageSize]);

  const districts = useMemo(() => Array.from(new Set(offices.map((o) => o.district))).sort(), [offices]);
  const departments = useMemo(() => Array.from(new Set(offices.map((o) => o.department))).sort(), [offices]);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Office Performance Intelligence"
        subtitle="Evaluate administrative unit efficiency, adherence to statutory SLAs, and DPS performance aggregates."
      >
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white text-xs font-semibold shadow-2xs h-8">
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
            Export Report
          </Button>
        </div>
      </PageHeader>

      {/* Attention Required Banner */}
      {!loading && (summary.criticalOffices > 0 || summary.recurringDelayOffices > 0 || summary.activeBreachOffices > 0) && (
        <div className="bg-white border-l-4 border-l-red-600 border border-slate-200 shadow-sm rounded-r-md p-4 flex items-start gap-4">
          <div className="p-2 bg-red-50 rounded-full flex-shrink-0">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-red-900 mb-2 uppercase tracking-wide">Attention Required</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {summary.criticalOffices > 0 && (
                <div className="bg-red-50 rounded p-2 text-sm border border-red-100 flex items-center justify-between cursor-pointer hover:bg-red-100 transition-colors" onClick={() => setStatusFilter("critical")}>
                  <span className="text-red-800 font-medium">{summary.criticalOffices} offices have SLA compliance below 80%</span>
                  <ChevronRight className="w-4 h-4 text-red-500" />
                </div>
              )}
              {summary.recurringDelayOffices > 0 && (
                <div className="bg-amber-50 rounded p-2 text-sm border border-amber-100 flex items-center justify-between cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => {}}>
                  <span className="text-amber-800 font-medium">{summary.recurringDelayOffices} offices have recurring delay patterns</span>
                  <ChevronRight className="w-4 h-4 text-amber-500" />
                </div>
              )}
              {summary.activeBreachOffices > 0 && (
                <div className="bg-orange-50 rounded p-2 text-sm border border-orange-100 flex items-center justify-between cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => {}}>
                  <span className="text-orange-800 font-medium">{summary.activeBreachOffices} offices currently have active breaches</span>
                  <ChevronRight className="w-4 h-4 text-orange-500" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white border border-slate-200 rounded-md shadow-2xs p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search office name, district, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className={`text-xs h-9 ${showFilters ? "bg-slate-100 border-slate-300" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            Filters {(statusFilter !== "all" || districtFilter !== "all" || departmentFilter !== "all") && (
              <span className="ml-1.5 bg-blue-100 text-blue-700 px-1.5 rounded-full text-[10px] font-bold">Active</span>
            )}
          </Button>
          {(statusFilter !== "all" || districtFilter !== "all" || departmentFilter !== "all" || searchQuery !== "") && (
            <Button
              variant="ghost"
              className="text-xs h-9 text-slate-500 hover:text-slate-700"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setDistrictFilter("all");
                setDepartmentFilter("all");
              }}
            >
              <X className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="bg-slate-50 border border-slate-200 rounded-md p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in slide-in-from-top-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Performance</label>
            <select
              className="block w-full border border-slate-300 rounded-md text-sm py-1.5 px-3 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Performance Levels</option>
              <option value="on_track">On Track (&ge; 80%)</option>
              <option value="at_risk">At Risk (&lt; 80%)</option>
              <option value="critical">Critical (&lt; 70%)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">District</label>
            <select
              className="block w-full border border-slate-300 rounded-md text-sm py-1.5 px-3 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              <option value="all">All Districts</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Department</label>
            <select
              className="block w-full border border-slate-300 rounded-md text-sm py-1.5 px-3 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#1464A5]" />
            <p className="text-sm font-medium">Loading Office Intelligence from PostgreSQL...</p>
          </div>
        ) : filteredAndSortedOffices.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-medium">No offices found matching your criteria.</p>
            <Button variant="link" onClick={() => { setSearchQuery(""); setStatusFilter("all"); setDistrictFilter("all"); setDepartmentFilter("all"); }}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#EEF6FA] hover:bg-[#EEF6FA]">
                  <TableHead className="w-[300px] text-[#123B4A] text-xs font-semibold uppercase tracking-wider py-3">
                    <button className="flex items-center gap-1 focus:outline-none hover:text-blue-700 w-full" onClick={() => handleSort("officeName")}>
                      Office & Department
                      <ArrowUpDown className="w-3 h-3 opacity-50" />
                    </button>
                  </TableHead>
                  <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">
                    <button className="flex items-center gap-1 focus:outline-none hover:text-blue-700" onClick={() => handleSort("district")}>
                      District
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
                {paginatedOffices.map((office) => (
                  <TableRow key={office.officeId} className="border-b border-slate-100 hover:bg-[#F7F9FB] group">
                    <TableCell>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <Link href={`/offices/${office.officeId}`} className="hover:text-[#1464A5] hover:underline decoration-blue-300 underline-offset-2">
                            {office.officeName}
                          </Link>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 ml-5">{office.department}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-slate-700">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {office.district}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-slate-700">
                      {office.totalApplications.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className={`text-sm font-bold font-mono ${
                          office.slaCompliance >= 95 ? "text-green-700" :
                          office.slaCompliance >= 80 ? "text-blue-700" :
                          office.slaCompliance >= 70 ? "text-amber-600" : "text-red-600"
                        }`}>
                          {office.slaCompliance.toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {office.totalApplications - office.breached} in SLA
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-slate-700">
                      {office.averageTat}d
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {office.atRisk > 0 && (
                          <div className="bg-amber-50 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200" title="At Risk">
                            {office.atRisk} R
                          </div>
                        )}
                        {office.breached > 0 && (
                          <div className="bg-red-50 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-200" title="Breached">
                            {office.breached} B
                          </div>
                        )}
                        {office.repeatDelays > 0 && (
                          <div className="bg-purple-50 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-purple-200" title="Repeat Delays">
                            {office.repeatDelays} D
                          </div>
                        )}
                        {office.atRisk === 0 && office.breached === 0 && office.repeatDelays === 0 && (
                          <span className="text-slate-300 text-xs">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {office.status === "Excellent" && <Award className="w-4 h-4 text-green-600" />}
                        {office.status === "Satisfactory" && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                        {office.status === "Attention Required" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {office.status === "Critical" && <ShieldAlert className="w-4 h-4 text-red-600" />}
                        <span className="text-sm font-bold font-mono text-slate-800">
                          {office.performanceScore}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-[#1464A5] opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/offices/${office.officeId}`}>
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredAndSortedOffices.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
