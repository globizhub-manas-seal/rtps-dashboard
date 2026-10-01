"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search, Filter, AlertTriangle, ArrowRight, UserCheck, ShieldAlert,
  X, Clock, Calendar, CheckCircle2, AlertCircle, ArrowUpDown, ChevronLeft, ChevronRight,
  Database, RefreshCw, FileText
} from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";

function SLAMonitorContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  // State
  const [activeTab, setActiveTab] = useState<string>(initialStatus);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedOffice, setSelectedOffice] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("all");
  const [selectedDps, setSelectedDps] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("slaConsumed"); // slaConsumed, dueDate, submissionDate
  const [sortOrder, setSortOrder] = useState<string>("desc");

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [timeline, setTimeline] = useState<any[]>([]);

  // Fetch applications from PostgreSQL API
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (selectedDept !== "all") params.append("department", selectedDept);
      if (selectedDistrict !== "all") params.append("district", selectedDistrict);
      if (selectedOffice !== "all") params.append("office", selectedOffice);
      if (selectedService !== "all") params.append("service", selectedService);
      if (selectedDps !== "all") params.append("dps", selectedDps);
      if (activeTab !== "all") params.append("status", activeTab);
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);
      params.append("limit", "150");

      const res = await fetch(`/api/applications?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [activeTab, selectedDept, selectedDistrict, selectedOffice, selectedService, selectedDps, sortBy, sortOrder]);

  // Handle Search on Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  // Status counts from loaded data
  const statusCounts = useMemo(() => {
    const counts = { total: applications.length, onTrack: 0, atRisk: 0, critical: 0, breached: 0 };
    applications.forEach((a) => {
      if (a.slaStatus === "ON_TRACK") counts.onTrack++;
      else if (a.slaStatus === "AT_RISK") counts.atRisk++;
      else if (a.slaStatus === "CRITICAL") counts.critical++;
      else if (a.slaStatus === "BREACHED") counts.breached++;
    });
    return counts;
  }, [applications]);

  // Click on Application to open detail drawer
  const handleAppClick = async (app: any) => {
    setSelectedApp(app);
    setIsDrawerOpen(true);
    try {
      const res = await fetch(`/api/applications/${app.rtpsRefNo}`);
      if (res.ok) {
        const data = await res.json();
        setTimeline(data.timeline || []);
      }
    } catch (e) {
      console.error("Failed to fetch app details:", e);
    }
  };

  // Unique options for filters from loaded list
  const departments = useMemo(() => {
    const list = Array.from(new Set(applications.map((a) => a.departmentCode))).filter(Boolean);
    return ["all", ...list];
  }, [applications]);

  const districts = useMemo(() => {
    const list = Array.from(new Set(applications.map((a) => a.districtName))).filter(Boolean);
    return ["all", ...list];
  }, [applications]);

  const services = useMemo(() => {
    const list = Array.from(new Set(applications.map((a) => a.serviceCode))).filter(Boolean);
    return ["all", ...list];
  }, [applications]);

  const clearAllFilters = () => {
    setActiveTab("all");
    setSelectedDept("all");
    setSelectedDistrict("all");
    setSelectedOffice("all");
    setSelectedService("all");
    setSelectedDps("all");
    setSearchQuery("");
    setSortBy("slaConsumed");
    setSortOrder("desc");
  };

  return (
    <div className="py-5 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-5">
      {/* Header */}
      <PageHeader
        title="Statutory SLA Compliance Monitor"
        subtitle="Real-time pendency tracking & breach risk detection across Assam RTPS public services"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchApplications}
            disabled={loading}
            className="border-slate-300 text-xs font-semibold text-[#0f3443] flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh PostgreSQL Feed
          </Button>
        </div>
      </PageHeader>

      {/* SUMMARY STATUS METRIC STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`p-3 rounded-md border text-left transition-all ${
            activeTab === "all" ? "bg-white border-[#1464A5] ring-2 ring-[#1464A5]/20 shadow-xs" : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">All Monitored</span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-0.5 block">{statusCounts.total}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Live applications in view</span>
        </button>

        <button
          onClick={() => setActiveTab("ON_TRACK")}
          className={`p-3 rounded-md border text-left transition-all ${
            activeTab === "ON_TRACK" ? "bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs" : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16803c]" /> On Track
          </span>
          <span className="text-xl font-bold font-mono text-emerald-950 mt-0.5 block">{statusCounts.onTrack}</span>
          <span className="text-[10px] text-emerald-700 mt-1 block">&gt; 48 hours remaining</span>
        </button>

        <button
          onClick={() => setActiveTab("AT_RISK")}
          className={`p-3 rounded-md border text-left transition-all ${
            activeTab === "AT_RISK" ? "bg-amber-50/60 border-amber-500 ring-2 ring-amber-500/20 shadow-xs" : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> At Risk
          </span>
          <span className="text-xl font-bold font-mono text-amber-950 mt-0.5 block">{statusCounts.atRisk}</span>
          <span className="text-[10px] text-amber-700 mt-1 block">12 – 48 hours remaining</span>
        </button>

        <button
          onClick={() => setActiveTab("CRITICAL")}
          className={`p-3 rounded-md border text-left transition-all ${
            activeTab === "CRITICAL" ? "bg-orange-50/60 border-orange-500 ring-2 ring-orange-500/20 shadow-xs" : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-semibold text-orange-800 uppercase tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-600" /> Critical
          </span>
          <span className="text-xl font-bold font-mono text-orange-950 mt-0.5 block">{statusCounts.critical}</span>
          <span className="text-[10px] text-orange-700 mt-1 block">&lt; 12 hours remaining</span>
        </button>

        <button
          onClick={() => setActiveTab("BREACHED")}
          className={`p-3 rounded-md border text-left transition-all ${
            activeTab === "BREACHED" ? "bg-red-50/60 border-red-500 ring-2 ring-red-500/20 shadow-xs" : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="text-[11px] font-semibold text-red-800 uppercase tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#c62828]" /> Breached
          </span>
          <span className="text-xl font-bold font-mono text-red-950 mt-0.5 block">{statusCounts.breached}</span>
          <span className="text-[10px] text-red-700 mt-1 block">Past statutory deadline</span>
        </button>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <Input
              placeholder="Search by Application ID, Citizen, DPS Officer, Service or Office..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-300 text-xs text-slate-800 h-9"
            />
          </div>
          <Button type="submit" size="sm" className="bg-[#0f3443] hover:bg-[#1a4d5e] text-white text-xs h-9 px-4">
            Search
          </Button>
          {(searchQuery || selectedDept !== "all" || selectedDistrict !== "all" || selectedService !== "all" || activeTab !== "all") && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="border-slate-300 text-xs h-9 text-slate-600 hover:text-red-700 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear All
            </Button>
          )}
        </form>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-xs focus:outline-none"
            >
              <option value="all">All Departments</option>
              <option value="REV">Revenue</option>
              <option value="TRN">Transport</option>
              <option value="HFW">Health</option>
              <option value="UDD">Urban Affairs</option>
              <option value="PRD">P&RD</option>
              <option value="WPT">WPT & BC</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-xs focus:outline-none"
            >
              <option value="all">All Districts</option>
              <option value="Kamrup Metropolitan">Kamrup Metro</option>
              <option value="Dibrugarh">Dibrugarh</option>
              <option value="Jorhat">Jorhat</option>
              <option value="Sonitpur">Sonitpur</option>
              <option value="Karimganj">Karimganj</option>
              <option value="Cachar">Cachar</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Service</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-xs focus:outline-none truncate"
            >
              <option value="all">All Statutory Services</option>
              <option value="INC_CERT">Income Certificate</option>
              <option value="MUTATION">Land Mutation / Partition</option>
              <option value="PRC_CERT">PRC Certificate</option>
              <option value="DL_PERM">Driving License</option>
              <option value="BIRTH_REG">Birth Certificate</option>
              <option value="TRADE_LIC">Trade License</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-xs focus:outline-none"
            >
              <option value="slaConsumed">SLA Consumed %</option>
              <option value="dueDate">Due Date</option>
              <option value="submissionDate">Submitted Date</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-xs focus:outline-none"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div className="flex items-end">
            <span className="text-[11px] text-slate-500 pb-2">
              Showing <strong>{applications.length}</strong> records
            </span>
          </div>
        </div>
      </div>

      {/* APPLICATIONS TABLE */}
      <div className="bg-white border border-slate-200 rounded-md shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/75 border-b border-slate-200">
              <TableRow>
                <TableHead className="w-[170px] text-slate-700 font-bold text-xs py-3">Application Ref</TableHead>
                <TableHead className="text-slate-700 font-bold text-xs">Service & Citizen</TableHead>
                <TableHead className="text-slate-700 font-bold text-xs">Office & District</TableHead>
                <TableHead className="text-slate-700 font-bold text-xs">DPS Officer</TableHead>
                <TableHead className="text-slate-700 font-bold text-xs">Due Cut-off</TableHead>
                <TableHead className="w-[180px] text-slate-700 font-bold text-xs">SLA Consumed</TableHead>
                <TableHead className="text-center text-slate-700 font-bold text-xs">SLA Status</TableHead>
                <TableHead className="text-right text-slate-700 font-bold text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 mx-auto animate-spin text-[#1464A5] mb-2" />
                    Loading applications from PostgreSQL...
                  </TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-slate-500">
                    No applications matching current filters found.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow
                    key={app.id}
                    onClick={() => handleAppClick(app)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    {/* Ref */}
                    <TableCell className="font-mono font-bold text-[#0f3443]">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.rtpsRefNo}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal block pl-5">
                        Sub: {app.submissionDate?.split("T")[0]}
                      </span>
                    </TableCell>

                    {/* Service & Citizen */}
                    <TableCell>
                      <div className="font-semibold text-slate-800">{app.serviceName}</div>
                      <div className="text-[11px] text-slate-500">
                        {app.citizenName} • SLA: {app.statutoryDays}d
                      </div>
                    </TableCell>

                    {/* Office */}
                    <TableCell>
                      <div className="text-slate-800 font-medium">{app.officeName}</div>
                      <div className="text-[10px] text-slate-500">{app.districtName}</div>
                    </TableCell>

                    {/* DPS */}
                    <TableCell>
                      <div className="font-medium text-slate-800">{app.dpsName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{app.dpsCode}</div>
                    </TableCell>

                    {/* Due */}
                    <TableCell>
                      <div className="font-mono text-slate-800 font-medium">{app.targetSlaDate?.split("T")[0]}</div>
                      <div className="text-[10px] text-slate-500">
                        {app.timeRemainingHours > 0 ? `${app.timeRemainingHours}h remaining` : "Deadline passed"}
                      </div>
                    </TableCell>

                    {/* SLA Progress */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-mono font-bold text-slate-800">{app.slaConsumedPercent}%</span>
                          <span className="text-slate-500 text-[10px] font-mono">
                            {app.timeRemainingHours > 0 ? `${app.timeRemainingHours}h left` : "OVERDUE"}
                          </span>
                        </div>
                        <Progress
                          value={Math.min(app.slaConsumedPercent, 100)}
                          className={`h-2 ${
                            app.slaStatus === "BREACHED"
                              ? "[&>div]:bg-[#C62828]"
                              : app.slaStatus === "CRITICAL"
                              ? "[&>div]:bg-[#EA580C]"
                              : app.slaStatus === "AT_RISK"
                              ? "[&>div]:bg-[#D97706]"
                              : "[&>div]:bg-[#16803c]"
                          }`}
                        />
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          app.slaStatus === "ON_TRACK"
                            ? "bg-emerald-100 text-emerald-800"
                            : app.slaStatus === "AT_RISK"
                            ? "bg-amber-100 text-amber-800"
                            : app.slaStatus === "CRITICAL"
                            ? "bg-orange-100 text-orange-800"
                            : app.slaStatus === "BREACHED"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {app.slaStatus === "ON_TRACK" && "🟢 On Track"}
                        {app.slaStatus === "AT_RISK" && "🟡 At Risk"}
                        {app.slaStatus === "CRITICAL" && "🟠 Critical"}
                        {app.slaStatus === "BREACHED" && "🔴 Breached"}
                        {app.slaStatus === "DELIVERED" && "🔵 Delivered"}
                      </span>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-[#1464A5] hover:text-[#0f3443] font-semibold h-7 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAppClick(app);
                        }}
                      >
                        Inspect <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* APPLICATION DETAILS DRAWER */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-w-2xl mx-auto p-6 bg-white max-h-[90vh] overflow-y-auto">
          {selectedApp && (
            <div className="space-y-6">
              <DrawerHeader className="p-0 pb-4 border-b border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Application Dossier • Assam RTPS
                    </span>
                    <DrawerTitle className="text-xl font-bold font-mono text-[#0f3443]">
                      {selectedApp.rtpsRefNo}
                    </DrawerTitle>
                    <DrawerDescription className="text-xs text-slate-600 mt-0.5">
                      {selectedApp.serviceName}
                    </DrawerDescription>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      selectedApp.slaStatus === "BREACHED"
                        ? "bg-red-100 text-red-800"
                        : selectedApp.slaStatus === "CRITICAL"
                        ? "bg-orange-100 text-orange-800"
                        : selectedApp.slaStatus === "AT_RISK"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {selectedApp.slaStatus}
                  </span>
                </div>
              </DrawerHeader>

              {/* Administrative Assignment Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-md border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
                  <span className="font-semibold text-slate-800">{selectedApp.departmentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">District</span>
                  <span className="font-semibold text-slate-800">{selectedApp.districtName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Office</span>
                  <span className="font-semibold text-slate-800">{selectedApp.officeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">DPS Officer</span>
                  <span className="font-semibold text-[#0f3443]">{selectedApp.dpsName}</span>
                  <span className="block text-[10px] text-slate-500 font-mono">({selectedApp.dpsCode})</span>
                </div>
              </div>

              {/* Dates & SLA Consumed Bar */}
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Submission Date</span>
                    <span className="font-semibold text-slate-800">{selectedApp.submissionDate?.split("T")[0]}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Statutory SLA</span>
                    <span className="font-semibold text-slate-800">{selectedApp.statutoryDays} Calendar Days</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Due Cut-off Date</span>
                    <span className="font-bold text-[#0f3443]">{selectedApp.targetSlaDate?.split("T")[0]}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">
                      SLA Consumed: <strong>{selectedApp.slaConsumedPercent}%</strong>
                    </span>
                    <span className="text-[#0f3443] font-bold">
                      {selectedApp.timeRemainingHours > 0
                        ? `${selectedApp.timeRemainingHours} Hours Remaining`
                        : "Statutory Deadline Exceeded"}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(selectedApp.slaConsumedPercent, 100)}
                    className={`h-2.5 ${
                      selectedApp.slaStatus === "BREACHED"
                        ? "[&>div]:bg-[#C62828]"
                        : selectedApp.slaStatus === "CRITICAL"
                        ? "[&>div]:bg-[#EA580C]"
                        : selectedApp.slaStatus === "AT_RISK"
                        ? "[&>div]:bg-[#D97706]"
                        : "[&>div]:bg-[#16803c]"
                    }`}
                  />
                  {selectedApp.delayReason && (
                    <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                      <strong>Noted Pendency Factor:</strong> {selectedApp.delayReason}
                    </p>
                  )}
                </div>
              </div>

              {/* PROCESSING TIMELINE */}
              <div className="bg-white border border-slate-200 rounded-md p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Service Delivery Processing Timeline
                </h4>
                <div className="space-y-3 pl-2 pt-1">
                  {(timeline.length > 0 ? timeline : [
                    { stageName: "Application Submitted", order: 1, status: "completed" },
                    { stageName: "Document Verification", order: 2, status: selectedApp.slaStatus === "BREACHED" ? "breached" : "in_progress" },
                    { stageName: "Field Land Survey / Field Inspection", order: 3, status: "upcoming" },
                    { stageName: "Officer Review & Scrutiny", order: 4, status: "upcoming" },
                    { stageName: "Final Statutory Order Issued", order: 5, status: "upcoming" },
                  ]).map((step: any, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <span
                        className={`w-3 h-3 rounded-full mt-0.5 flex-shrink-0 ${
                          step.status === "completed"
                            ? "bg-[#16803c]"
                            : step.status === "breached"
                            ? "bg-[#c62828] ring-4 ring-red-100"
                            : step.status === "in_progress"
                            ? "bg-amber-500 ring-4 ring-amber-100"
                            : "bg-slate-300"
                        }`}
                      />
                      <div className="space-y-0.5">
                        <p
                          className={`text-xs ${
                            step.status === "in_progress"
                              ? "font-bold text-amber-950"
                              : step.status === "breached"
                              ? "font-bold text-red-950"
                              : "font-semibold text-slate-700"
                          }`}
                        >
                          {step.stageName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {step.status === "completed" && "Completed within statutory timeline"}
                          {step.status === "breached" && "🚨 Current Stage — Statutory SLA Exceeded"}
                          {step.status === "in_progress" && "⚡ Current Stage — Active Scrutiny"}
                          {step.status === "upcoming" && "Pending prior stage clearance"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <Link
                  href={`/reviews?targetDps=${selectedApp.dpsCode}`}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded flex items-center gap-1.5 shadow-2xs"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Initiate Review on {selectedApp.dpsCode}
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-xs text-slate-600"
                >
                  Close Dossier
                </Button>
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
