"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import {
  Award,
  Filter,
  X,
  Search,
  ArrowUpDown,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  ChevronRight,
  MapPin,
  Building2,
  RefreshCw,
  TrendingUp,
  Clock,
  Layers,
  CheckCircle2,
  Download
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";

function DPSContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  const [dpsList, setDpsList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>(filterParam === "chronic" ? "Review Required" : "all");
  const [sortBy, setSortBy] = useState<string>("score"); // score, compliance, volume, breaches
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Review Dialog State
  const [reviewDialogOpen, setReviewDialogOpen] = useState<boolean>(false);
  const [targetOfficer, setTargetOfficer] = useState<any>(null);
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState<string>("");

  const fetchDpsOfficers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dps");
      if (res.ok) {
        const data = await res.json();
        setDpsList(data.dpsOfficers || []);
      }
    } catch (err) {
      console.error("Failed to load DPS officers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDpsOfficers();
  }, []);

  const handleCreateReview = async () => {
    if (!targetOfficer) return;
    try {
      setSubmittingReview(true);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetDpsCode: targetOfficer.employeeCode,
          priority: targetOfficer.status === "Review Required" ? "CRITICAL" : "HIGH",
          reason: `Statutory SLA compliance (${targetOfficer.complianceRate}%) below administrative threshold with ${targetOfficer.repeatDelays} repeat delays.`,
          sectionCited: "Assam RTPS Act 2012, Sec 7(1) & Rule 14",
          primaryIssue: targetOfficer.recurringDelayPattern?.description || `Recurring delays in service delivery.`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviewSuccessMessage(`Review Case ${data.caseRef} successfully created in PostgreSQL!`);
        setTimeout(() => {
          setReviewDialogOpen(false);
          setReviewSuccessMessage("");
        }, 2000);
      }
    } catch (e) {
      console.error("Error creating review:", e);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Filtered DPS list
  const filteredList = useMemo(() => {
    return dpsList.filter((dps) => {
      if (selectedDept !== "all" && dps.department !== selectedDept) return false;
      if (selectedDistrict !== "all" && dps.district !== selectedDistrict) return false;
      if (selectedStatus !== "all" && dps.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          dps.name.toLowerCase().includes(q) ||
          dps.employeeCode.toLowerCase().includes(q) ||
          dps.office.toLowerCase().includes(q) ||
          dps.designation.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "score") return b.performanceScore - a.performanceScore;
      if (sortBy === "compliance") return b.complianceRate - a.complianceRate;
      if (sortBy === "volume") return b.volume - a.volume;
      if (sortBy === "breaches") return b.breaches - a.breaches;
      return 0;
    });
  }, [dpsList, selectedDept, selectedDistrict, selectedStatus, searchQuery, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDept, selectedDistrict, selectedStatus, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));
  const paginatedDps = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage, pageSize]);

  // Chronic officers with recurring delay patterns
  const chronicOfficers = useMemo(() => {
    return dpsList.filter((d) => d.recurringDelayPattern?.detected);
  }, [dpsList]);

  const departments = useMemo(() => ["all", ...Array.from(new Set(dpsList.map((d) => d.department)))], [dpsList]);
  const districts = useMemo(() => ["all", ...Array.from(new Set(dpsList.map((d) => d.district)))], [dpsList]);

  const exportDpsCsv = () => {
    if (!filteredList.length) return;
    const headers = ["Employee Code", "Name", "Designation", "Office", "District", "Department", "Applications", "SLA Compliance %", "Avg TAT (days)", "Breaches", "Repeat Delays", "Performance Score", "Status"];
    const rows = filteredList.map((d) => [
      `"${d.employeeCode || d.dpsId}"`,
      `"${d.name}"`,
      `"${d.designation || ''}"`,
      `"${d.office}"`,
      `"${d.district}"`,
      `"${d.department}"`,
      d.volume,
      d.complianceRate,
      d.avgTat,
      d.breaches,
      d.repeatDelays,
      d.performanceScore,
      `"${d.status}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `assam_rtps_dps_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-5 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-6">
      <PageHeader
        title="Designated Public Servants (DPS) Directory & Accountability"
        subtitle="Individual officer performance index, statutory breach tracking & recurring delay detection"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportDpsCsv}
            disabled={loading || !filteredList.length}
            className="border-slate-300 text-xs font-semibold text-[#0f3443] flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDpsOfficers}
            disabled={loading}
            className="border-slate-300 text-xs font-semibold text-[#0f3443] flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh DPS Metrics
          </Button>
        </div>
      </PageHeader>

      {/* RECURRING DELAY DETECTION SPOTLIGHT (Requirement 8) */}
      {chronicOfficers.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-md p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
              <h3 className="text-sm font-bold text-red-950 uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Algorithmic Recurring Delay Pattern Detected
              </h3>
            </div>
            <span className="text-xs font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded border border-red-200">
              {chronicOfficers.length} Officers Flagged by SLA Engine
            </span>
          </div>
          <p className="text-xs text-red-900 leading-relaxed">
            The SLA Engine has analyzed application stage transitions across 530+ records and isolated systemic, repetitive stage stalls rather than one-off delays:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {chronicOfficers.slice(0, 3).map((dps) => (
              <div key={dps.dpsId} className="bg-white border border-red-200 rounded p-3 text-xs space-y-2 shadow-2xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-red-700">{dps.employeeCode}</span>
                    <h4 className="font-bold text-slate-900">{dps.name}</h4>
                    <p className="text-[11px] text-slate-500">{dps.office} ({dps.district})</p>
                  </div>
                  <span className="bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded text-[10px]">
                    {dps.complianceRate}% SLA
                  </span>
                </div>

                <div className="bg-slate-50 p-2 rounded border border-slate-200 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Breaches / Repeat Delays:</span>
                    <span className="font-bold text-red-700">{dps.breaches} / {dps.repeatDelays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Most Common Delay Stage:</span>
                    <span className="font-bold text-slate-800">{dps.recurringDelayPattern?.mostCommonDelayStage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Affected Service:</span>
                    <span className="font-bold text-slate-800">{dps.recurringDelayPattern?.affectedService}</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full bg-red-700 hover:bg-red-800 text-white text-xs h-7 font-semibold"
                  onClick={() => {
                    setTargetOfficer(dps);
                    setReviewDialogOpen(true);
                  }}
                >
                  <ShieldAlert className="w-3 h-3 mr-1" />
                  Initiate Administrative Review
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTERS & SEARCH */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <Input
              placeholder="Search DPS Officer by Name, Code, Office, Designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-300 text-xs text-slate-800 h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-xs focus:outline-none"
            >
              {departments.map((d) => (
                <option key={d} value={d}>{d === "all" ? "All Departments" : d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-xs focus:outline-none"
            >
              {districts.map((d) => (
                <option key={d} value={d}>{d === "all" ? "All Districts" : d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Status Tier</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-xs focus:outline-none"
            >
              <option value="all">All Status Tiers</option>
              <option value="Excellent">Excellent (≥95%)</option>
              <option value="Strong">Strong (85-94%)</option>
              <option value="Attention">Attention (75-84%)</option>
              <option value="Review Required">Review Required (&lt;75%)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Sort Metric</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-700 text-xs focus:outline-none"
            >
              <option value="score">Performance Score (0-100)</option>
              <option value="compliance">SLA Compliance Rate</option>
              <option value="volume">Applications Volume</option>
              <option value="breaches">Total Breaches</option>
            </select>
          </div>
        </div>
      </div>

      {/* DPS TABLE (Requirement 7) */}
      <div className="bg-white border border-slate-200 rounded-md shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-200">
              <TableRow>
                <TableHead className="text-slate-700 font-bold text-xs py-3">DPS Code & Officer</TableHead>
                <TableHead className="text-slate-700 font-bold text-xs">Office & Department</TableHead>
                <TableHead className="text-right text-slate-700 font-bold text-xs">Volume</TableHead>
                <TableHead className="text-right text-slate-700 font-bold text-xs">SLA Compliance</TableHead>
                <TableHead className="text-right text-slate-700 font-bold text-xs">Avg TAT</TableHead>
                <TableHead className="text-right text-slate-700 font-bold text-xs">Breaches / Delays</TableHead>
                <TableHead className="text-center text-slate-700 font-bold text-xs">Performance Score</TableHead>
                <TableHead className="text-center text-slate-700 font-bold text-xs">Status</TableHead>
                <TableHead className="text-right text-slate-700 font-bold text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 mx-auto animate-spin text-[#1464A5] mb-2" />
                    Calculating DPS metrics from PostgreSQL...
                  </TableCell>
                </TableRow>
              ) : filteredList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-12 text-center text-slate-500">
                    No DPS officers match your search/filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDps.map((dps) => (
                  <TableRow key={dps.dpsId} className="hover:bg-slate-50 transition-colors">
                    {/* DPS Officer */}
                    <TableCell>
                      <Link href={`/dps/${dps.dpsId}`} className="group/link block">
                        <div className="font-mono font-bold text-slate-900 group-hover/link:text-[#1464A5]">{dps.employeeCode}</div>
                        <div className="font-semibold text-[#0f3443] group-hover/link:underline">{dps.name}</div>
                      </Link>
                      <div className="text-[10px] text-slate-500">{dps.designation}</div>
                    </TableCell>

                    {/* Office */}
                    <TableCell>
                      <div className="font-medium text-slate-800">{dps.office}</div>
                      <div className="text-[10px] text-slate-500">{dps.district} • {dps.department}</div>
                    </TableCell>

                    {/* Volume */}
                    <TableCell className="text-right font-mono font-medium text-slate-800">
                      {dps.volume}
                    </TableCell>

                    {/* Compliance */}
                    <TableCell className="text-right">
                      <span
                        className={`font-mono font-bold text-xs ${
                          dps.complianceRate >= 95
                            ? "text-[#16803c]"
                            : dps.complianceRate >= 80
                            ? "text-blue-700"
                            : "text-[#c62828]"
                        }`}
                      >
                        {dps.complianceRate}%
                      </span>
                    </TableCell>

                    {/* TAT */}
                    <TableCell className="text-right font-mono text-slate-600">
                      {dps.avgTat}d
                    </TableCell>

                    {/* Breaches & Delays */}
                    <TableCell className="text-right font-mono">
                      <span className={dps.breaches > 0 ? "text-red-600 font-bold" : "text-slate-400"}>
                        {dps.breaches}
                      </span>
                      <span className="text-slate-400 text-[10px]"> / {dps.repeatDelays}</span>
                    </TableCell>

                    {/* Score (0-100) */}
                    <TableCell className="text-center font-mono">
                      <span className="inline-block bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-xs">
                        {dps.performanceScore} / 100
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          dps.status === "Excellent"
                            ? "bg-emerald-100 text-emerald-800"
                            : dps.status === "Strong"
                            ? "bg-blue-100 text-blue-800"
                            : dps.status === "Attention"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {dps.status}
                      </span>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      {dps.urgentAction || dps.status === "Review Required" ? (
                        <Button
                          size="sm"
                          className="bg-red-700 hover:bg-red-800 text-white text-[11px] h-7 px-2.5 font-semibold"
                          onClick={() => {
                            setTargetOfficer(dps);
                            setReviewDialogOpen(true);
                          }}
                        >
                          Review Case
                        </Button>
                      ) : dps.eligibleForCommendation ? (
                        <Link
                          href="/recognition"
                          className="inline-flex items-center text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-1 rounded border border-emerald-200"
                        >
                          <Award className="w-3 h-3 mr-1" /> Commend
                        </Link>
                      ) : (
                        <Link
                          href={`/sla-monitor?dps=${dps.employeeCode}`}
                          className="text-xs text-[#1464A5] hover:underline font-medium"
                        >
                          View Apps
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredList.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* CREATE REVIEW DIALOG */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-md bg-white p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-red-950 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              Initiate Administrative Review
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              This will create a formal review record in PostgreSQL under Assam RTPS Act 2012.
            </DialogDescription>
          </DialogHeader>

          {targetOfficer && (
            <div className="space-y-4 py-2 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">{targetOfficer.name} ({targetOfficer.employeeCode})</div>
                <div className="text-slate-600">{targetOfficer.designation} • {targetOfficer.office}</div>
                <div className="text-red-700 font-mono font-semibold">
                  Compliance: {targetOfficer.complianceRate}% • Breaches: {targetOfficer.breaches} • Repeat Delays: {targetOfficer.repeatDelays}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Section Cited</label>
                <input
                  type="text"
                  readOnly
                  value="Assam RTPS Act 2012, Sec 7(1) & Rule 14"
                  className="w-full bg-slate-100 border border-slate-200 rounded p-2 text-slate-700 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Primary Issue Identified</label>
                <p className="bg-red-50 text-red-900 border border-red-200 rounded p-2 text-xs">
                  {targetOfficer.recurringDelayPattern?.description ||
                    `Systemic pendency below 75% threshold with ${targetOfficer.repeatDelays} repeat delays.`}
                </p>
              </div>

              {reviewSuccessMessage && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-semibold text-center">
                  {reviewSuccessMessage}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReviewDialogOpen(false)}
              disabled={submittingReview}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateReview}
              disabled={submittingReview || !!reviewSuccessMessage}
              className="bg-red-700 hover:bg-red-800 text-white text-xs font-semibold"
            >
              {submittingReview ? "Saving to PostgreSQL..." : "Confirm & Save Case"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function DPSPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading DPS Directory...</div>}>
      <DPSContent />
    </Suspense>
  );
}
