"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockData } from "@/lib/data";
import {
  Search, Filter, AlertTriangle, ArrowRight, UserCheck, ShieldAlert,
  X, Clock, Calendar, CheckCircle2, AlertCircle, ArrowUpDown, ChevronLeft, ChevronRight
} from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";

function SLAMonitorContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");
  const initialTab = filterParam === "at-risk" ? "At Risk" : "All";

  // State
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [selectedOffice, setSelectedOffice] = useState<string>("All");
  const [selectedService, setSelectedService] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>(filterParam === "at-risk" ? "urgency" : "consumed-desc");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Status Counts for Summary Strip
  const statusCounts = useMemo(() => {
    const counts = { total: 0, onTrack: 0, atRisk: 0, critical: 0, breached: 0 };
    mockData.applications.forEach((app) => {
      counts.total++;
      if (app.status === "On Track") counts.onTrack++;
      else if (app.status === "At Risk") counts.atRisk++;
      else if (app.status === "Critical") counts.critical++;
      else if (app.status === "Breached") counts.breached++;
    });
    return counts;
  }, []);

  // Filtered and Sorted Applications
  const filteredApps = useMemo(() => {
    return mockData.applications
      .filter((app) => {
        // Tab Filter
        if (activeTab === "On Track" && app.status !== "On Track") return false;
        if (activeTab === "At Risk" && app.status !== "At Risk") return false;
        if (activeTab === "Critical" && app.status !== "Critical") return false;
        if (activeTab === "Breached" && app.status !== "Breached") return false;

        // Dropdowns
        if (selectedDept !== "All" && app.department !== selectedDept) return false;
        if (selectedDistrict !== "All" && app.district !== selectedDistrict) return false;
        if (selectedOffice !== "All" && app.office !== selectedOffice) return false;
        if (selectedService !== "All" && app.service !== selectedService) return false;

        // Search Query
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchId = app.id.toLowerCase().includes(q);
          const matchService = app.service.toLowerCase().includes(q);
          const matchDps = app.dps.toLowerCase().includes(q);
          const matchOffice = app.office.toLowerCase().includes(q);
          const matchCitizen = app.citizen.toLowerCase().includes(q);
          if (!matchId && !matchService && !matchDps && !matchOffice && !matchCitizen) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "consumed-desc") return b.consumed - a.consumed;
        if (sortBy === "urgency") return a.hoursRemaining - b.hoursRemaining;
        if (sortBy === "dept") return a.department.localeCompare(b.department);
        if (sortBy === "dps") return a.dps.localeCompare(b.dps);
        return 0;
      });
  }, [activeTab, selectedDept, selectedDistrict, selectedOffice, selectedService, searchQuery, sortBy]);

  // Unique Dropdown Options
  const departments = useMemo(() => ["All", ...Array.from(new Set(mockData.applications.map((a) => a.department)))], []);
  const districts = useMemo(() => ["All", ...Array.from(new Set(mockData.applications.map((a) => a.district)))], []);
  const offices = useMemo(() => ["All", ...Array.from(new Set(mockData.applications.map((a) => a.office)))], []);
  const services = useMemo(() => ["All", ...Array.from(new Set(mockData.applications.map((a) => a.service)))], []);

  const clearAllFilters = () => {
    setActiveTab("All");
    setSelectedDept("All");
    setSelectedDistrict("All");
    setSelectedOffice("All");
    setSelectedService("All");
    setSearchQuery("");
    setSortBy("consumed-desc");
  };

  return (
    <div className="py-5 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-4">
      {/* Page Header */}
      <PageHeader
        title="Live SLA Monitor"
        subtitle="Continuous monitoring of RTPS citizen applications against statutory turnaround deadlines"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded font-medium shadow-2xs">
            Last synchronized: <strong className="text-slate-800">10:05 AM</strong> • <strong>{statusCounts.total} active SLA cases</strong>
          </span>
        </div>
      </PageHeader>

      {/* 1. Compact Operational Summary Row Above Search */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        <button
          onClick={() => setActiveTab("All")}
          className={`p-2.5 rounded border text-left transition-all ${
            activeTab === "All"
              ? "bg-[#0f3443] text-white border-[#0f3443] shadow-xs ring-1 ring-[#0f3443]"
              : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">ALL CASES</span>
            <span className="text-base font-bold font-mono">{statusCounts.total}</span>
          </div>
          <span className="text-[10px] opacity-70 block mt-0.5">Active Queue</span>
        </button>

        <button
          onClick={() => setActiveTab("On Track")}
          className={`p-2.5 rounded border text-left transition-all ${
            activeTab === "On Track"
              ? "bg-[#16803c] text-white border-[#16803c] shadow-xs ring-1 ring-[#16803c]"
              : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">ON TRACK</span>
            <span className="text-base font-bold font-mono text-[#16803c]">{statusCounts.onTrack}</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">&lt;75% SLA Consumed</span>
        </button>

        <button
          onClick={() => { setActiveTab("At Risk"); setSortBy("urgency"); }}
          className={`p-2.5 rounded border text-left transition-all ${
            activeTab === "At Risk"
              ? "bg-[#d97706] text-white border-[#d97706] shadow-xs ring-1 ring-[#d97706]"
              : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">AT RISK</span>
            <span className="text-base font-bold font-mono text-amber-600">{statusCounts.atRisk}</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Due in &lt;24h (Priority)</span>
        </button>

        <button
          onClick={() => setActiveTab("Critical")}
          className={`p-2.5 rounded border text-left transition-all ${
            activeTab === "Critical"
              ? "bg-[#ea580c] text-white border-[#ea580c] shadow-xs ring-1 ring-[#ea580c]"
              : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700">CRITICAL</span>
            <span className="text-base font-bold font-mono text-orange-600">{statusCounts.critical}</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Due in &lt;6h / Imminent</span>
        </button>

        <button
          onClick={() => setActiveTab("Breached")}
          className={`p-2.5 rounded border text-left transition-all col-span-2 sm:col-span-1 ${
            activeTab === "Breached"
              ? "bg-[#c62828] text-white border-[#c62828] shadow-xs ring-1 ring-[#c62828]"
              : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">BREACHED</span>
            <span className="text-base font-bold font-mono text-[#c62828]">{statusCounts.breached}</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Statutory Delay Logged</span>
        </button>
      </div>

      {/* Active Filter Notification when coming from Dashboard Drilldown */}
      {activeTab === "At Risk" && (
        <div className="bg-[#fff9ed] border border-amber-300 rounded p-2.5 flex items-center justify-between gap-3 text-xs text-amber-950">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Approaching SLA Early Warning:</strong> Displaying cases due within 24 hours. Cases sorted by <strong>urgency (shortest time remaining first)</strong>.
            </span>
          </div>
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 font-semibold text-amber-800 hover:text-amber-950 bg-amber-200/60 px-2 py-0.5 rounded text-[11px]"
          >
            Clear Filter <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 3. Search and Dropdown Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-md p-3 shadow-2xs space-y-2.5">
        {/* Search Input Row */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Application ID, Service, DPS, Office, or Citizen Name..."
              className="pl-9 bg-slate-50/50 border-slate-200 text-xs h-9"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded px-2.5 py-1 flex-shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#0f3443] focus:outline-none cursor-pointer"
            >
              <option value="consumed-desc">SLA Consumed (Highest first)</option>
              <option value="urgency">Urgency (Shortest time left)</option>
              <option value="dept">Department (A-Z)</option>
              <option value="dps">Assigned DPS</option>
            </select>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filter By:
          </span>

          {/* Department */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:ring-1 focus:ring-amber-400"
          >
            <option value="All">Dept: All</option>
            {departments.filter(d => d !== "All").map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* District */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:ring-1 focus:ring-amber-400"
          >
            <option value="All">District: All</option>
            {districts.filter(d => d !== "All").map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Location / Office */}
          <select
            value={selectedOffice}
            onChange={(e) => setSelectedOffice(e.target.value)}
            className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:ring-1 focus:ring-amber-400"
          >
            <option value="All">Office: All</option>
            {offices.filter(o => o !== "All").map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>

          {/* Service */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:ring-1 focus:ring-amber-400"
          >
            <option value="All">Service: All</option>
            {services.filter(s => s !== "All").map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Clear Filters Reset */}
          {(selectedDept !== "All" || selectedDistrict !== "All" || selectedOffice !== "All" || selectedService !== "All" || searchQuery !== "" || activeTab !== "All") && (
            <button
              onClick={clearAllFilters}
              className="text-[11px] text-red-600 hover:text-red-800 font-semibold ml-auto flex items-center gap-1"
            >
              Reset Filters <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* 4. Status Tabs Row */}
        <div className="flex items-center gap-1 pt-1 overflow-x-auto">
          {["All", "On Track", "At Risk", "Critical", "Breached"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "bg-[#0f3443] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 9 & 10. Data Table with Clear Visual Hierarchy & Location Column */}
      <div className="border border-slate-200 rounded-md bg-white shadow-xs overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#EEF6FA] hover:bg-[#EEF6FA]">
              <TableHead className="text-[#123B4A] text-xs font-bold uppercase tracking-wider">Application ID</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-bold uppercase tracking-wider">Service</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">Department</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">Location</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-bold uppercase tracking-wider">Assigned DPS</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">Submitted</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">SLA Limit</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">Due Date</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-bold uppercase tracking-wider">SLA Consumed & Urgency</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-bold uppercase tracking-wider text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-xs text-slate-500">
                  No active cases match the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredApps.map((app) => (
                <TableRow
                  key={app.id}
                  className="cursor-pointer hover:bg-[#F7F9FB] transition-colors border-b border-slate-100 group"
                  onClick={() => { setSelectedApp(app); setIsDrawerOpen(true); }}
                >
                  {/* Primary: Application ID */}
                  <TableCell className="font-bold text-[#1464A5] group-hover:text-[#0f3443] transition-colors text-xs font-mono">
                    {app.id}
                  </TableCell>

                  {/* Primary: Service Name */}
                  <TableCell className="text-xs font-bold text-[#1F2933]">
                    {app.service}
                  </TableCell>

                  {/* Secondary: Department */}
                  <TableCell className="text-xs text-slate-600">
                    {app.department}
                  </TableCell>

                  {/* 10. Secondary: Location (Office) */}
                  <TableCell className="text-xs text-slate-600">
                    <span className="font-medium text-slate-800">{app.office}</span>
                    <span className="text-[10px] text-slate-400 block">{app.district}</span>
                  </TableCell>

                  {/* Primary: Assigned DPS */}
                  <TableCell className="text-xs font-bold text-slate-900">
                    <span className="font-mono text-[#0f3443] block">{app.dps}</span>
                    <span className="text-[10px] font-normal text-slate-500">{app.officerName}</span>
                  </TableCell>

                  {/* Secondary: Submitted Date */}
                  <TableCell className="text-xs text-slate-500">
                    {app.submitted}
                  </TableCell>

                  {/* Secondary: SLA Limit */}
                  <TableCell className="text-xs text-slate-600 font-medium">
                    {app.sla}
                  </TableCell>

                  {/* Secondary: Due Date */}
                  <TableCell className="text-xs font-medium text-slate-800">
                    {app.due}
                  </TableCell>

                  {/* 5 & 7. SLA Consumed with Semantic Urgency Label & Risk Indicator */}
                  <TableCell>
                    <div className="space-y-1 min-w-[130px]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold font-mono text-slate-900">{app.consumed}%</span>
                        <span
                          className={`font-semibold text-[10px] ${
                            app.status === "Breached"
                              ? "text-red-700"
                              : app.status === "Critical"
                              ? "text-orange-700 font-bold"
                              : app.status === "At Risk"
                              ? "text-amber-700 font-bold"
                              : "text-green-700"
                          }`}
                        >
                          {app.urgencyLabel}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(app.consumed, 100)}
                        className={`h-2 ${
                          app.consumed >= 100
                            ? "[&>div]:bg-[#C62828]"
                            : app.consumed > 90
                            ? "[&>div]:bg-[#d97706]"
                            : app.consumed > 75
                            ? "[&>div]:bg-[#f59e0b]"
                            : "[&>div]:bg-[#16803c]"
                        }`}
                      />
                    </div>
                  </TableCell>

                  {/* Primary: Status Badge */}
                  <TableCell className="text-right">
                    <StatusBadge status={app.status} compact />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 15. Pagination Controls Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-white border border-slate-200 rounded p-2.5">
        <span>
          Showing <strong>1–{filteredApps.length}</strong> of <strong>{filteredApps.length}</strong> active SLA cases
        </span>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500">Rows per page:</span>
            <select className="border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50 text-xs font-semibold">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button disabled className="p-1 rounded border border-slate-200 text-slate-400 cursor-not-allowed">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 py-0.5 rounded bg-[#0f3443] text-white font-bold text-[11px]">1</span>
            <button disabled className="p-1 rounded border border-slate-200 text-slate-400 cursor-not-allowed">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 6 & 8. Application Detail Drawer with Delay Breakdown and DPS Drilldown */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-w-2xl mx-auto bg-white">
          <DrawerHeader className="border-b border-slate-200 pb-3">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1464A5] bg-[#eef6fa] px-2 py-0.5 rounded font-mono">
                    {selectedApp?.id}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                      selectedApp?.delayRisk === "HIGH RISK"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : selectedApp?.delayRisk === "CRITICAL ESCALATION"
                        ? "bg-orange-100 text-orange-900 border border-orange-300"
                        : selectedApp?.delayRisk === "BREACHED"
                        ? "bg-red-100 text-red-900 border border-red-300"
                        : "bg-green-100 text-green-900 border border-green-300"
                    }`}
                  >
                    {selectedApp?.delayRisk}
                  </span>
                </div>
                <DrawerTitle className="text-lg font-bold text-[#1F2933]">
                  {selectedApp?.service}
                </DrawerTitle>
                <DrawerDescription className="text-xs text-slate-500">
                  {selectedApp?.department} • {selectedApp?.office} ({selectedApp?.district} District)
                </DrawerDescription>
              </div>

              {selectedApp && <StatusBadge status={selectedApp.status} />}
            </div>
          </DrawerHeader>

          {selectedApp && (
            <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
              {/* Core Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#fafbfc] p-3 rounded border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Applicant</span>
                  <span className="font-bold text-slate-800">{selectedApp.citizen}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Submitted Date</span>
                  <span className="font-semibold text-slate-800">{selectedApp.submitted}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Statutory SLA</span>
                  <span className="font-semibold text-slate-800">{selectedApp.sla}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Due Cut-off</span>
                  <span className="font-bold text-[#0f3443]">{selectedApp.due}</span>
                </div>
              </div>

              {/* SLA Consumed & Urgency Progress */}
              <div className="bg-[#EEF6FA] p-3.5 rounded border border-[#cfe2ec] space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-[#123B4A]">
                  <span>SLA Consumed: <strong>{selectedApp.consumed}%</strong></span>
                  <span className="font-bold text-[#0f3443]">
                    {selectedApp.hoursRemaining > 0
                      ? `${selectedApp.hoursRemaining} hours remaining`
                      : `${Math.abs(selectedApp.hoursRemaining)} hours overdue`}
                  </span>
                </div>
                <Progress
                  value={Math.min(selectedApp.consumed, 100)}
                  className={`h-2.5 ${
                    selectedApp.consumed >= 100
                      ? "[&>div]:bg-[#C62828]"
                      : selectedApp.consumed > 85
                      ? "[&>div]:bg-[#d97706]"
                      : "[&>div]:bg-[#16803c]"
                  }`}
                />
                <p className="text-[11px] text-slate-600">
                  Delay Factor: <em>{selectedApp.reason}</em>
                </p>
              </div>

              {/* 8. Potential Delay Reason Breakdown */}
              <div className="bg-white border border-slate-200 rounded p-3 space-y-2.5">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Potential Delay Reason Attribution
                  </h4>
                  <span className="text-[10px] text-slate-400">Algorithmic Stage Audit</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-700 font-medium">Document Scrutiny / Field Verification</span>
                      <span className="font-bold font-mono text-slate-900">{selectedApp.delayBreakdown?.verification}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#1464A5] h-full rounded-full" style={{ width: `${selectedApp.delayBreakdown?.verification}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-700 font-medium">Applicant Response / Document Re-submission</span>
                      <span className="font-bold font-mono text-slate-900">{selectedApp.delayBreakdown?.applicant}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#f59e0b] h-full rounded-full" style={{ width: `${selectedApp.delayBreakdown?.applicant}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-700 font-medium">Technical Integration / Digital Token Gateway</span>
                      <span className="font-bold font-mono text-slate-900">{selectedApp.delayBreakdown?.technical}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-400 h-full rounded-full" style={{ width: `${selectedApp.delayBreakdown?.technical}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. ASSIGNED DPS DRILLDOWN ACTION CARD */}
              <div className="p-3.5 rounded-md border border-amber-300 bg-amber-50/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" /> Assigned Designated Public Servant (DPS)
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {selectedApp.dps} — {selectedApp.officerName}
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    {selectedApp.office} ({selectedApp.district}) • Historical SLA: 71%
                  </p>
                </div>

                <Link
                  href={`/dps/${selectedApp.dps}`}
                  className="bg-[#0f3443] hover:bg-[#1a4d5e] text-white text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 px-3 py-2 rounded transition-colors shadow-2xs"
                >
                  View DPS Performance →
                </Link>
              </div>

              {/* Timeline */}
              <div className="pt-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Service Delivery Audit Trail
                </h4>
                <div className="space-y-3 pl-2">
                  {selectedApp.timeline?.map((step: any, index: number) => (
                    <div key={index} className="flex gap-2.5 items-start">
                      <span
                        className={`w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0 ${
                          step.done ? "bg-[#16803c]" : step.current ? "bg-amber-500 ring-4 ring-amber-100" : "bg-slate-300"
                        }`}
                      />
                      <div>
                        <p className={`font-semibold ${step.current ? "text-amber-950 font-bold" : "text-slate-800"}`}>
                          {step.title}
                        </p>
                        <p className="text-[10px] text-slate-500">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default function SLAMonitor() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading SLA Monitor...</div>}>
      <SLAMonitorContent />
    </Suspense>
  );
}
