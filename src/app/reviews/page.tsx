"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ShieldAlert,
  MessageSquare,
  AlertTriangle,
  Clock,
  FileText,
  Send,
  UserCheck,
  CheckCircle2,
  Calendar,
  Building2,
  MapPin,
  ExternalLink,
  ChevronRight,
  Gavel,
  RefreshCw,
  Plus,
  Printer
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";

function ReviewsContent() {
  const searchParams = useSearchParams();
  const preselectedDps = searchParams.get("targetDps");

  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // New Case Dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTargetDps, setNewTargetDps] = useState(preselectedDps || "DPS-104");
  const [newReason, setNewReason] = useState("SLA compliance below configured threshold with multiple statutory delays.");
  const [newPriority, setNewPriority] = useState("HIGH");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status update
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        if (data.reviews?.length > 0 && !selectedCase) {
          setSelectedCase(data.reviews[0]);
        }
      }
    } catch (e) {
      console.error("Failed to fetch reviews:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetDpsCode: newTargetDps,
          reason: newReason,
          priority: newPriority,
          sectionCited: "Assam RTPS Act 2012, Sec 7(1) & Rule 14",
          primaryIssue: `Statutory compliance below configured threshold.`,
        }),
      });

      if (res.ok) {
        setIsCreateOpen(false);
        fetchReviews();
      }
    } catch (e) {
      console.error("Failed to create review:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (caseId: string, nextStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      const res = await fetch(`/api/reviews/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          explanationText: nextStatus === "IN_REVIEW"
            ? "Official notice served to officer. Explanation awaited within 7 calendar days."
            : "Explanation reviewed and recorded. Corrective staffing action mandated by District Commissioner.",
        }),
      });

      if (res.ok) {
        await fetchReviews();
        if (selectedCase?.id === caseId) {
          setSelectedCase((prev: any) => ({ ...prev, status: nextStatus }));
        }
      }
    } catch (e) {
      console.error("Status update error:", e);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="py-5 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        title="Administrative Reviews & Compliance Enforcement"
        subtitle="Formal statutory show-cause notice life-cycle & disciplinary hearings under Assam RTPS Act 2012"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchReviews}
            disabled={loading}
            className="border-slate-300 text-xs font-semibold text-[#0f3443] flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Cases
          </Button>

          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="bg-red-700 hover:bg-red-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            Create Review Case
          </Button>
        </div>
      </PageHeader>

      {/* WORKFLOW PIPELINE EXPLANATION BANNER */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
          Statutory Administrative Review Life-Cycle Workflow
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded border border-red-200 bg-red-50/50">
            <span className="font-bold text-red-950 flex items-center gap-1.5">
              1. Performance Trigger
            </span>
            <p className="text-[11px] text-red-800 mt-1">
              SLA Engine identifies DPS with &lt;75% compliance or &gt;10 repeat delays.
            </p>
          </div>

          <div className="p-3 rounded border border-amber-200 bg-amber-50/50">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              2. Pending Action
            </span>
            <p className="text-[11px] text-amber-800 mt-1">
              Case opened in PostgreSQL; evidence applications linked for notice dispatch.
            </p>
          </div>

          <div className="p-3 rounded border border-blue-200 bg-blue-50/50">
            <span className="font-bold text-blue-950 flex items-center gap-1.5">
              3. In Review / Notice Served
            </span>
            <p className="text-[11px] text-blue-800 mt-1">
              Formal explanation requested; officer response tracked with statutory deadline.
            </p>
          </div>

          <div className="p-3 rounded border border-emerald-200 bg-emerald-50/50">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
              4. Review Concluded
            </span>
            <p className="text-[11px] text-emerald-800 mt-1">
              Final order passed with corrective workload reallocation or warning.
            </p>
          </div>
        </div>
      </div>

      {/* CASES LIST & ACTIVE DOSSIER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Review Cases Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-md shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xs font-bold text-[#0f3443] uppercase tracking-wider">
              Active PostgreSQL Review Cases ({reviews.length})
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Live DB Records</span>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 border-b border-slate-200">
                <TableRow>
                  <TableHead className="text-slate-700 font-bold text-xs py-2.5">Case Ref</TableHead>
                  <TableHead className="text-slate-700 font-bold text-xs">Target DPS / Office</TableHead>
                  <TableHead className="text-right text-slate-700 font-bold text-xs">Breaches</TableHead>
                  <TableHead className="text-center text-slate-700 font-bold text-xs">Priority</TableHead>
                  <TableHead className="text-center text-slate-700 font-bold text-xs">Status</TableHead>
                  <TableHead className="text-right text-slate-700 font-bold text-xs">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-slate-500">
                      Loading cases from PostgreSQL...
                    </TableCell>
                  </TableRow>
                ) : reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-slate-500">
                      No review cases recorded yet. Click &quot;Create Review Case&quot; to open one.
                    </TableCell>
                  </TableRow>
                ) : (
                  (() => {
                    const totalPages = Math.max(1, Math.ceil(reviews.length / pageSize));
                    const paginatedReviews = reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);
                    return paginatedReviews.map((c) => (
                      <TableRow
                        key={c.id}
                        onClick={() => setSelectedCase(c)}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                          selectedCase?.id === c.id ? "bg-amber-50/50 font-medium" : ""
                        }`}
                      >
                        <TableCell className="font-mono font-bold text-[#0f3443]">
                          {c.caseRef}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {c.createdAt?.split("T")[0]}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-800">{c.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {c.targetId} • {c.office}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-red-600">
                          {c.breachCount}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              c.priority === "CRITICAL"
                                ? "bg-red-100 text-red-800"
                                : c.priority === "HIGH"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {c.priority}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.status === "PENDING_ACTION"
                                ? "bg-red-100 text-red-800"
                                : c.status === "IN_REVIEW"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {c.status.replace("_", " ")}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-[#1464A5] h-6 px-1.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCase(c);
                            }}
                          >
                            Select →
                          </Button>
                        </TableCell>
                      </TableRow>
                    ));
                  })()
                )}
              </TableBody>
            </Table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(reviews.length / pageSize))}
            totalItems={reviews.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Right: Selected Case Action Dossier (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-md shadow-xs p-5 space-y-4">
          {selectedCase ? (
            <>
              <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Active Administrative Case
                  </span>
                  <h3 className="text-lg font-bold font-mono text-[#0f3443]">{selectedCase.caseRef}</h3>
                  <p className="text-xs text-slate-600">{selectedCase.sectionCited}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded text-xs font-bold ${
                    selectedCase.status === "PENDING_ACTION"
                      ? "bg-red-100 text-red-800"
                      : selectedCase.status === "IN_REVIEW"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {selectedCase.status.replace("_", " ")}
                </span>
              </div>

              {/* Target Details */}
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Officer:</span>
                  <span className="font-bold text-slate-900">{selectedCase.name} ({selectedCase.targetId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Office & District:</span>
                  <span className="font-medium text-slate-800">{selectedCase.office}, {selectedCase.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SLA Compliance:</span>
                  <span className="font-mono font-bold text-red-700">{selectedCase.slaCompliance}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Breaches Evidenced:</span>
                  <span className="font-mono font-bold text-red-700">{selectedCase.breachCount} applications</span>
                </div>
              </div>

              {/* Primary Issue */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-600 uppercase mb-1">Allegation / Primary Issue</h4>
                <p className="text-xs text-slate-800 bg-red-50/50 p-2.5 rounded border border-red-200 leading-relaxed">
                  {selectedCase.primaryIssue}
                </p>
              </div>

              {/* Linked Evidence Applications */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                  Linked Evidence Applications ({selectedCase.evidenceApps?.length || 0})
                </h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedCase.evidenceApps?.map((app: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-slate-50 border border-slate-200 text-xs flex justify-between items-center"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#0f3443]">{app.appId}</span>
                        <p className="text-[10px] text-slate-500">{app.service} • {app.citizen}</p>
                      </div>
                      <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                        {app.status || "Breached"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow State Transition Controls */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Workflow State Transition (PostgreSQL)
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs border-slate-300 text-[#0f3443] gap-1.5"
                    onClick={() => window.open(`/reviews/${selectedCase.id}/notice`, "_blank")}
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print PDF Notice
                  </Button>
                </div>

                {selectedCase.status === "PENDING_ACTION" && (
                  <Button
                    onClick={() => handleUpdateStatus(selectedCase.id, "IN_REVIEW")}
                    disabled={isUpdatingStatus}
                    className="w-full bg-[#1464A5] hover:bg-[#0f3443] text-white text-xs font-semibold h-8"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Issue Notice → Move to &quot;In Review&quot;
                  </Button>
                )}

                {selectedCase.status === "IN_REVIEW" && (
                  <Button
                    onClick={() => handleUpdateStatus(selectedCase.id, "CONCLUDED")}
                    disabled={isUpdatingStatus}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold h-8"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    Record Explanation → Conclude Review
                  </Button>
                )}

                {selectedCase.status === "CONCLUDED" && (
                  <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 p-2.5 rounded text-xs text-center font-medium">
                    ✓ Administrative Review Concluded in PostgreSQL.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs text-slate-400">
              Select a review case from the table to inspect evidence and progress workflow.
            </div>
          )}
        </div>
      </div>

      {/* CREATE REVIEW DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl bg-white p-6">
          <form onSubmit={handleCreateCase} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-[#0f3443] flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                Administrative Review
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Initiate a formal administrative review based on detected evidence.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs mt-2">
              <div className="border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[10px]">Trigger</span>
                <span className="text-red-700 font-medium flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Recurring SLA Delays</span>
              </div>
              
              <div className="border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[10px]">Office</span>
                <span className="text-slate-900 font-medium">Karimganj Circle Office</span>
              </div>
              
              <div className="border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[10px]">DPS</span>
                <span className="text-slate-900 font-mono font-medium">{newTargetDps}</span>
              </div>
              
              <div className="border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[10px]">Performance</span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 w-32">SLA Compliance:</span>
                    <span className="font-mono text-red-600 font-bold">74%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 w-32">Average TAT:</span>
                    <span className="font-mono text-slate-800 font-bold">5.1 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 w-32">Repeat Delays:</span>
                    <span className="font-mono text-slate-800 font-bold">12</span>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[10px]">Affected Service</span>
                <span className="text-slate-900 font-medium">Mutation / Partition of Land</span>
              </div>
              
              <div className="border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[10px]">Delay Stage</span>
                <span className="text-slate-900 font-medium">Document Verification</span>
              </div>
              
              <div className="border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[10px]">Evidence</span>
                <div className="flex items-center gap-3">
                  <span className="text-red-700 font-medium">12 delayed applications</span>
                  <Link href="/sla-monitor" className="text-[#1464A5] hover:underline flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> View Applications
                  </Link>
                </div>
              </div>
              
              <div className="border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[10px]">Reviewer Notes</span>
                <Textarea
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs"
                  placeholder="Enter notes for this review..."
                  required
                />
              </div>
              
              <div>
                <span className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[10px]">Status</span>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase text-[10px]">Pending Action</span>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="bg-red-700 hover:bg-red-800 text-white text-xs font-semibold shadow-2xs"
              >
                {isSubmitting ? "Initiating..." : "Initiate Administrative Review"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Reviews...</div>}>
      <ReviewsContent />
    </Suspense>
  );
}
