"use client";

import React, { useState, Suspense } from "react";
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
  Gavel
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
import { StatusBadge } from "@/components/ui/status-badge";

interface ReviewCase {
  id: string;
  caseRef: string;
  targetId: string;
  targetType: "DPS" | "Office";
  name: string;
  designation: string;
  department: string;
  office: string;
  district: string;
  status: "Pending Action" | "Notice Dispatched" | "Explanation Received" | "Review Concluded";
  priority: "High" | "Critical" | "Standard";
  slaCompliance: number;
  breachCount: number;
  repeatDelayCount: number;
  primaryIssue: string;
  sectionCited: string;
  daysRemainingForResponse?: number;
  explanationText?: string;
  evidenceApps: {
    appId: string;
    service: string;
    citizen: string;
    slaDays: number;
    overdueDays: number;
    delayAttribution: string;
    status: string;
  }[];
}

const reviewCases: ReviewCase[] = [
  {
    id: "REV-2026-8842",
    caseRef: "RTPS/REV/2026/8842",
    targetId: "DPS-104",
    targetType: "DPS",
    name: "Sri Ramen Barman",
    designation: "Circle Officer (CO)",
    department: "Revenue & Disaster Mgmt",
    office: "Karimganj Circle",
    district: "Karimganj",
    status: "Pending Action",
    priority: "Critical",
    slaCompliance: 71,
    breachCount: 61,
    repeatDelayCount: 18,
    primaryIssue: "Systemic delays in Land Mutation and persistent breach of statutory 30-day timeline.",
    sectionCited: "Section 8(1) & Rule 14, ARTPS Act 2012",
    daysRemainingForResponse: 7,
    evidenceApps: [
      {
        appId: "RTPS-2026-99214",
        service: "Mutation / Partition of Land",
        citizen: "Hemanta Kalita",
        slaDays: 30,
        overdueDays: 4,
        delayAttribution: "Field report delayed at Lot Mandal level (68%)",
        status: "At Risk",
      },
      {
        appId: "RTPS-2026-99182",
        service: "Caste Certificate",
        citizen: "Subrata Roy",
        slaDays: 15,
        overdueDays: 2,
        delayAttribution: "Community recommendation scrutiny pending (55%)",
        status: "At Risk",
      },
      {
        appId: "RTPS-2026-99105",
        service: "Permanent Residence Cert",
        citizen: "Monojit Das",
        slaDays: 14,
        overdueDays: 3,
        delayAttribution: "Police verification report not expedited (78%)",
        status: "Critical",
      },
    ],
  },
  {
    id: "REV-2026-8839",
    caseRef: "RTPS/UMA/2026/8839",
    targetId: "OFF-SON-01",
    targetType: "Office",
    name: "Tezpur Municipal Board",
    designation: "Executive Board / Municipal Cell",
    department: "Urban & Municipal Affairs",
    office: "Tezpur Municipal",
    district: "Sonitpur",
    status: "Notice Dispatched",
    priority: "High",
    slaCompliance: 82,
    breachCount: 95,
    repeatDelayCount: 14,
    primaryIssue: "Backlog in Trade License issuance and fire safety clearance NOCs exceeding statutory limits.",
    sectionCited: "Section 9(2), ARTPS Act 2012",
    daysRemainingForResponse: 3,
    evidenceApps: [
      {
        appId: "RTPS-2026-98711",
        service: "Trade License Renewal",
        citizen: "Assam Trading Co.",
        slaDays: 10,
        overdueDays: 8,
        delayAttribution: "Divisional inspection pending (62%)",
        status: "Breached",
      },
    ],
  },
  {
    id: "REV-2026-8815",
    caseRef: "RTPS/REV/2026/8815",
    targetId: "DPS-109",
    targetType: "DPS",
    name: "Sri Manabendra Nath",
    designation: "Circle Officer (CO)",
    department: "Revenue & Disaster Mgmt",
    office: "Silchar Circle",
    district: "Cachar",
    status: "Explanation Received",
    priority: "High",
    slaCompliance: 78,
    breachCount: 44,
    repeatDelayCount: 14,
    primaryIssue: "Permanent Residence Certificate counter delays due to Lot Mandal shortage.",
    sectionCited: "Section 8(1), ARTPS Act 2012",
    explanationText:
      "Explanation submitted on 28 Sep 2026: 3 Lot Mandals were deputed for emergency flood assessment. Counter operations have now been restored with additional data entry operators.",
    evidenceApps: [
      {
        appId: "RTPS-2026-98920",
        service: "Permanent Residence Cert",
        citizen: "Debashis Nath",
        slaDays: 14,
        overdueDays: 6,
        delayAttribution: "Counter rush and field staff deputation (72%)",
        status: "Breached",
      },
    ],
  },
];

function AdministrativeReviewContent() {
  const searchParams = useSearchParams();
  const dpsParam = searchParams.get("dps");

  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    dpsParam ? reviewCases.find((c) => c.targetId === dpsParam)?.id || reviewCases[0].id : reviewCases[0].id
  );
  const [filterTab, setFilterTab] = useState<"all" | "action" | "dispatched" | "received">("all");
  const [isNoticeDialogOpen, setIsNoticeDialogOpen] = useState(false);
  const [noticeSentSuccess, setNoticeSentSuccess] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  const selectedCase = reviewCases.find((c) => c.id === selectedCaseId) || reviewCases[0];

  const filteredCases = reviewCases.filter((c) => {
    if (filterTab === "action") return c.status === "Pending Action";
    if (filterTab === "dispatched") return c.status === "Notice Dispatched";
    if (filterTab === "received") return c.status === "Explanation Received";
    return true;
  });

  const handleDispatchNotice = () => {
    setIsNoticeDialogOpen(false);
    setNoticeSentSuccess(true);
    setTimeout(() => setNoticeSentSuccess(false), 5000);
  };

  const handleSaveNotes = () => {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 3000);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-5">
      <PageHeader
        title="Administrative Review & Decision Support"
        subtitle="Supervisory review, explanation requisitions, and statutory penalty decision support under ARTPS Act 2012"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-400/15 text-amber-900 border border-amber-400/30 px-2.5 py-1 rounded font-bold">
            ● 3 ACTIVE INQUIRIES
          </span>
        </div>
      </PageHeader>

      {/* Notice Success Banner */}
      {noticeSentSuccess && (
        <div className="bg-[#e8f5ec] border border-[#b9e4c5] p-3.5 rounded text-xs text-[#16803c] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#16803c]" />
            Official Explanation Requisition dispatched successfully via Sewa Setu e-Office workflow! Notice Ref: {selectedCase.caseRef}
          </div>
          <button onClick={() => setNoticeSentSuccess(false)} className="text-green-900 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Review Layout */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[640px]">
        {/* Left Column: Case Queue */}
        <div className="w-full lg:w-[380px] flex-shrink-0 space-y-3">
          {/* Queue Filter Tabs */}
          <div className="flex rounded-md border border-slate-200 bg-white p-1 text-xs">
            <button
              onClick={() => setFilterTab("all")}
              className={`flex-1 py-1 text-center font-semibold rounded ${
                filterTab === "all" ? "bg-[#0f3443] text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({reviewCases.length})
            </button>
            <button
              onClick={() => setFilterTab("action")}
              className={`flex-1 py-1 text-center font-semibold rounded ${
                filterTab === "action" ? "bg-[#0f3443] text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Action (1)
            </button>
            <button
              onClick={() => setFilterTab("dispatched")}
              className={`flex-1 py-1 text-center font-semibold rounded ${
                filterTab === "dispatched" ? "bg-[#0f3443] text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Dispatched (1)
            </button>
            <button
              onClick={() => setFilterTab("received")}
              className={`flex-1 py-1 text-center font-semibold rounded ${
                filterTab === "received" ? "bg-[#0f3443] text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Replied (1)
            </button>
          </div>

          {/* Case List Cards */}
          <div className="space-y-2.5">
            {filteredCases.map((c) => {
              const isSelected = selectedCaseId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`cursor-pointer bg-white border rounded-md p-4 transition-all ${
                    isSelected
                      ? "border-[#1464A5] ring-2 ring-[#1464A5]/20 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-[#1464A5]">{c.targetId}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">• {c.targetType}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">{c.name}</h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        c.status === "Pending Action"
                          ? "bg-red-50 text-[#C62828] border-red-200"
                          : c.status === "Notice Dispatched"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-green-50 text-[#16803c] border-green-200"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mb-3">
                    {c.department} • {c.office}
                  </p>

                  <div className="space-y-1 text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">SLA Compliance:</span>
                      <span className="font-bold text-[#C62828] font-mono">{c.slaCompliance}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Recorded Breaches:</span>
                      <span className="font-bold text-slate-900 font-mono">{c.breachCount} cases</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Repeat Delays:</span>
                      <span className="font-bold text-[#C62828] font-mono">{c.repeatDelayCount} identified</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Statutory Policy Disclaimer */}
          <div className="bg-[#EEF6FA] border border-[#cfe2ec] p-3 rounded text-[11px] text-[#123B4A] space-y-1">
            <p className="font-bold uppercase tracking-wider">Statutory Authority Notice</p>
            <p className="leading-relaxed">
              The platform provides evidence and decision support. Final administrative action or penalties under Section 8 of ARTPS Act remain solely with the authorised appellate authority.
            </p>
          </div>
        </div>

        {/* Right Column: Case Detail & Evidence Docket */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-slate-200 rounded-md shadow-2xs p-6 space-y-5">
            {/* Case Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                    {selectedCase.caseRef}
                  </span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase">
                    Priority: {selectedCase.priority}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Administrative Review: {selectedCase.name} ({selectedCase.targetId})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedCase.designation} • {selectedCase.department} • {selectedCase.office}, {selectedCase.district}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {selectedCase.targetType === "DPS" && (
                  <Link href={`/dps/${selectedCase.targetId}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white text-[#1464A5] border-slate-300 hover:bg-slate-50 text-xs font-semibold"
                    >
                      DPS Dossier <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                )}

                {/* Dialog to Dispatch Requisition Notice */}
                <Dialog open={isNoticeDialogOpen} onOpenChange={setIsNoticeDialogOpen}>
                  <DialogTrigger className="bg-[#1464A5] hover:bg-[#123B4A] text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs">
                    <Send className="w-3.5 h-3.5" />
                    Request Formal Explanation
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    {/* Official Letterhead */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 relative flex-shrink-0">
                          <Image
                            src="/logo/assam-gov-logo.png"
                            alt="Govt of Assam"
                            width={36}
                            height={36}
                            className="object-contain"
                            style={{ width: "auto", height: "auto" }}
                          />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#0f3443] uppercase tracking-wider">
                            GOVERNMENT OF ASSAM • অসম চৰকাৰ
                          </p>
                          <p className="text-[10px] text-slate-500">
                            RTPS Administrative Directorate • Sewa Setu Governance
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 relative flex-shrink-0 bg-white p-0.5 rounded border border-slate-200">
                        <Image
                          src="/logo/sewa-setu.png"
                          alt="Sewa Setu"
                          width={28}
                          height={28}
                          className="object-contain"
                          style={{ width: "auto", height: "auto" }}
                        />
                      </div>
                    </div>

                    <DialogHeader>
                      <DialogTitle className="text-[#1F2933] text-base">
                        Requisition for Explanation Notice (ARTPS Act 2012)
                      </DialogTitle>
                      <DialogDescription className="text-[#64748b] text-xs">
                        Issue a statutory show-cause notice under Section 8(1) of the ARTPS Act 2012 regarding {selectedCase.breachCount} recorded SLA breaches.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 mt-2 text-xs">
                      <div className="bg-[#F7F9FB] p-2.5 rounded border border-slate-200 space-y-1">
                        <p className="font-semibold text-slate-700">
                          Notice Docket: <span className="font-mono text-[#0f3443] font-bold">{selectedCase.caseRef}</span>
                        </p>
                        <p className="text-slate-600">
                          Recipient: <strong>{selectedCase.name}</strong>, {selectedCase.designation} ({selectedCase.office})
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          Statutory Timeline: 7 working days from date of receipt
                        </p>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase text-slate-700 block mb-1">
                          Notice Body / Terms of Explanation:
                        </label>
                        <Textarea
                          defaultValue={`WHEREAS, the Sewa Setu RTPS Performance Intelligence system has recorded ${selectedCase.breachCount} SLA breaches and ${selectedCase.repeatDelayCount} recurring procedural delays under your jurisdiction at ${selectedCase.office}.\n\nNOW THEREFORE, under Section 8(1) and Rule 14 of the Assam Right to Public Services Act 2012, you are hereby called upon to submit reasons in writing within 7 working days, failing which formal administrative inquiry shall be recommended to the First Appellate Authority.`}
                          className="min-h-[120px] border-slate-300 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <DialogFooter className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsNoticeDialogOpen(false)}
                        className="border-slate-300 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleDispatchNotice}
                        className="bg-[#1464A5] hover:bg-[#123B4A] text-white text-xs font-semibold"
                      >
                        Dispatch Official Notice
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Statutory Violation Summary Strip */}
            <div className="bg-red-50/50 border border-red-200 rounded p-3.5 text-xs text-red-950 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#C62828] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold uppercase tracking-wider text-red-900 block text-[11px]">
                  Statutory Rule Violated: {selectedCase.sectionCited}
                </span>
                <p className="leading-relaxed text-slate-800">{selectedCase.primaryIssue}</p>
                {selectedCase.explanationText && (
                  <div className="mt-2 p-2 bg-white rounded border border-green-200 text-slate-800">
                    <span className="font-bold text-[#16803c] block text-[11px]">Explanation on Record:</span>
                    <p className="text-[11px] mt-0.5">{selectedCase.explanationText}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Performance KPIs for this review case */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-[#F7F9FB] border border-slate-200 rounded p-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">SLA Compliance</span>
                <span className="text-2xl font-bold font-mono text-[#C62828]">{selectedCase.slaCompliance}%</span>
              </div>
              <div className="bg-[#F7F9FB] border border-slate-200 rounded p-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Recorded Breaches</span>
                <span className="text-2xl font-bold font-mono text-slate-900">{selectedCase.breachCount}</span>
              </div>
              <div className="bg-[#F7F9FB] border border-slate-200 rounded p-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Repeat Delays</span>
                <span className="text-2xl font-bold font-mono text-amber-600">{selectedCase.repeatDelayCount}</span>
              </div>
              <div className="bg-[#F7F9FB] border border-slate-200 rounded p-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Response Window</span>
                <span className="text-2xl font-bold font-mono text-[#1464A5]">
                  {selectedCase.daysRemainingForResponse} days
                </span>
              </div>
            </div>

            {/* Breached Applications Evidence Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Evidence Docket: Breached Applications Under Review
                </h3>
                <span className="text-[11px] text-slate-500">
                  Showing {selectedCase.evidenceApps.length} sample applications
                </span>
              </div>
              <div className="border border-slate-200 rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#EEF6FA] hover:bg-[#EEF6FA]">
                      <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider py-2.5">Application ID</TableHead>
                      <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">Service</TableHead>
                      <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">Citizen</TableHead>
                      <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Statutory SLA</TableHead>
                      <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Overdue By</TableHead>
                      <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">Attribution & Cause</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCase.evidenceApps.map((app, idx) => (
                      <TableRow key={idx} className="border-b border-slate-100 hover:bg-[#F7F9FB]">
                        <TableCell className="text-xs font-bold font-mono text-[#1464A5]">{app.appId}</TableCell>
                        <TableCell className="text-xs font-medium text-slate-900">{app.service}</TableCell>
                        <TableCell className="text-xs text-slate-600">{app.citizen}</TableCell>
                        <TableCell className="text-xs text-right font-mono text-slate-600">{app.slaDays} days</TableCell>
                        <TableCell className="text-xs text-right font-mono font-bold text-[#C62828]">
                          +{app.overdueDays} days
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">{app.delayAttribution}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Administrative Notes Box */}
            <div className="bg-[#F7F9FB] border border-slate-200 rounded p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Supervisory Inquiry Notes & Action Log
                </h3>
                {notesSaved && (
                  <span className="text-[11px] font-bold text-[#16803c] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Notes recorded to case file
                  </span>
                )}
              </div>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Record observation, telephonic review remarks, or inquiry minutes for this case docket..."
                className="min-h-[80px] bg-white border-slate-300 text-xs"
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={handleSaveNotes}
                  className="bg-[#0f3443] hover:bg-[#1a4d5e] text-white text-xs font-semibold"
                >
                  Save Notes to Docket
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdministrativeReview() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Review Dockets...</div>}>
      <AdministrativeReviewContent />
    </Suspense>
  );
}
