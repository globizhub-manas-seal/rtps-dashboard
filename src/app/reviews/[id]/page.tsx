"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  ShieldAlert,
  AlertTriangle,
  Building2,
  User,
  Clock,
  CheckCircle2,
  FileText,
  Calendar,
  Send,
  Loader2,
  Gavel,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status updating state
  const [explanationText, setExplanationText] = useState("");
  const [closingRemarks, setClosingRemarks] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function fetchReview() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/reviews/${id}`);
        if (!res.ok) throw new Error("Review Case not found");
        const json = await res.json();
        setReview(json);
        if (json.explanationText) setExplanationText(json.explanationText);
        if (json.closingRemarks) setClosingRemarks(json.closingRemarks);
      } catch (err: any) {
        console.error("Failed to load review case", err);
        setError(err.message || "Failed to load review case");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchReview();
  }, [id]);

  const handleUpdate = async (newStatus?: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus || review.status,
          explanationText,
          closingRemarks,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReview(updated.review);
      }
    } catch (e) {
      console.error("Failed to update review case:", e);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#1464A5]" />
        <p className="text-xs text-slate-500 font-medium">Loading Administrative Review Dossier...</p>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="py-16 max-w-xl mx-auto text-center space-y-4">
        <div className="p-3 bg-red-50 text-red-600 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Review Case Not Found</h2>
        <p className="text-xs text-slate-500">{error || "The requested administrative case record does not exist."}</p>
        <Link href="/reviews">
          <Button variant="outline" size="sm">Back to Reviews Directory</Button>
        </Link>
      </div>
    );
  }

  const isDps = review.targetType === "DPS";
  const targetEntity = isDps ? review.dpsOfficer : review.office;
  const targetName = isDps ? targetEntity?.name : targetEntity?.name;
  const targetCode = isDps ? targetEntity?.employeeCode : targetEntity?.code;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-6">
      <Link
        href="/reviews"
        className="inline-flex items-center text-xs text-[#1464A5] hover:text-[#123B4A] transition-colors font-medium rounded"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Administrative Reviews
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
              {review.caseRef}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                review.status === "CONCLUDED"
                  ? "bg-emerald-100 text-emerald-800"
                  : review.status === "IN_REVIEW"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {review.status.replace("_", " ")}
            </span>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
              {review.priority} Priority
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            Inquiry Dossier: {targetName} ({targetCode})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Section Cited: <span className="font-semibold text-slate-700">{review.sectionCited || "Assam RTPS Act 2012, Sec 7(1)"}</span> • Case Initiated: {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-2">
          <Link href={`/reviews/${review.id}/notice`} target="_blank">
            <Button
              className="bg-[#0f293e] hover:bg-[#1a4466] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Official Notice (Form 7A)
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reason & Particulars Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#1464A5]" />
              Grounds for Administrative Inquiry
            </h3>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans">
              {review.reason}
            </div>
            {review.primaryIssue && (
              <p className="text-xs text-slate-600">
                <strong>Primary Operational Failure:</strong> {review.primaryIssue}
              </p>
            )}
          </div>

          {/* Attached Evidence Applications */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Gavel className="w-4 h-4 text-red-600" />
              Statutory Evidence Records ({review.evidenceList?.length || 0})
            </h3>
            <p className="text-xs text-slate-500">
              Applications assigned to this officer that breached stipulated turnaround timelines without formal extension.
            </p>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">RTPS Ref</TableHead>
                    <TableHead className="text-xs">Service</TableHead>
                    <TableHead className="text-xs">Citizen Name</TableHead>
                    <TableHead className="text-xs">Target SLA</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {review.evidenceList?.length > 0 ? (
                    review.evidenceList.map((ev: any) => (
                      <TableRow key={ev.id}>
                        <TableCell className="font-mono text-xs font-bold text-[#1464A5]">
                          {ev.application?.rtpsRefNo || "RTPS-APP"}
                        </TableCell>
                        <TableCell className="text-xs font-medium">
                          {ev.application?.service?.name || "Statutory Service"}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">
                          {ev.application?.citizenName || "Citizen"}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {ev.application?.targetSlaDate ? new Date(ev.application.targetSlaDate).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell className="text-xs">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                            {ev.application?.slaStatus || "BREACHED"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-6 text-center text-slate-400 text-xs">
                        No direct evidence application records attached.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Right Column: Workflow Actions & Explanation */}
        <div className="space-y-5">
          {/* Target Profile Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-500" />
              Target Officer Profile
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Officer Name:</span>
                <span className="font-bold text-slate-800">{targetName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Employee Code:</span>
                <span className="font-mono font-bold text-slate-800">{targetCode}</span>
              </div>
              {isDps && (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Designation:</span>
                    <span className="text-slate-700">{targetEntity?.designation}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Office:</span>
                    <span className="text-slate-700">{targetEntity?.office?.name}</span>
                  </div>
                </>
              )}
            </div>

            {isDps && targetEntity?.id && (
              <Link href={`/dps/${targetEntity.id}`}>
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold mt-2">
                  View Full Officer Dossier &rarr;
                </Button>
              </Link>
            )}
          </div>

          {/* Action / Explanation Input */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#1464A5]" />
              Inquiry Stage & Formal Response
            </h3>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-700">Official Officer Explanation</label>
              <Textarea
                placeholder="Enter written explanation submitted by officer..."
                value={explanationText}
                onChange={(e) => setExplanationText(e.target.value)}
                className="text-xs min-h-[90px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-700">Appellate Authority Closing Remarks</label>
              <Textarea
                placeholder="Enter formal inquiry outcome / exoneration / warning remarks..."
                value={closingRemarks}
                onChange={(e) => setClosingRemarks(e.target.value)}
                className="text-xs min-h-[70px]"
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={() => handleUpdate("IN_REVIEW")}
                disabled={isUpdating}
                variant="outline"
                className="w-full text-xs font-semibold text-blue-700 border-blue-200 hover:bg-blue-50"
              >
                Mark In Review / Save Draft
              </Button>
              <Button
                onClick={() => handleUpdate("CONCLUDED")}
                disabled={isUpdating}
                className="w-full text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Conclude Inquiry
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
