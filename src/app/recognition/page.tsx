"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Medal,
  ExternalLink,
  Award,
  FileCheck,
  Printer,
  CheckCircle2,
  Building2,
  MapPin,
  Sparkles,
  Users,
  ChevronRight
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Performer {
  id: string;
  name: string;
  department: string;
  office: string;
  district: string;
  compliance: number;
  avgTat: number;
  score: number;
  servicesHandled: number;
  recognitionType: "DPS" | "Office" | "District";
}

const highPerformers: Performer[] = [
  {
    id: "DPS-021",
    name: "Sri Bhaskar Jyoti Sarma",
    department: "Revenue & Disaster Management",
    office: "Guwahati Circle Office",
    district: "Kamrup Metro",
    compliance: 99,
    avgTat: 2.8,
    score: 98,
    servicesHandled: 1420,
    recognitionType: "DPS",
  },
  {
    id: "DPS-087",
    name: "Smti Parbin Sultana",
    department: "Transport Department",
    office: "DTO Kamrup Metro",
    district: "Kamrup Metro",
    compliance: 98,
    avgTat: 3.1,
    score: 96,
    servicesHandled: 980,
    recognitionType: "DPS",
  },
  {
    id: "DPS-112",
    name: "Dr. Hemen Hazarika",
    department: "Health & Family Welfare",
    office: "Jorhat District Hospital",
    district: "Jorhat",
    compliance: 97,
    avgTat: 3.5,
    score: 94,
    servicesHandled: 840,
    recognitionType: "DPS",
  },
  {
    id: "DPS-054",
    name: "Sri Anjan Kumar Das",
    department: "School Education",
    office: "IS Office Dibrugarh",
    district: "Dibrugarh",
    compliance: 96,
    avgTat: 3.9,
    score: 92,
    servicesHandled: 630,
    recognitionType: "DPS",
  },
  {
    id: "DPS-033",
    name: "Sri Pratul Baruah",
    department: "Revenue & Disaster Management",
    office: "Jorhat Sadar Circle",
    district: "Jorhat",
    compliance: 94,
    avgTat: 3.4,
    score: 93,
    servicesHandled: 1120,
    recognitionType: "DPS",
  },
  {
    id: "DPS-045",
    name: "Sri Hiranya Goswami",
    department: "Revenue & Disaster Management",
    office: "Nagaon Sadar Circle",
    district: "Nagaon",
    compliance: 93,
    avgTat: 3.5,
    score: 91,
    servicesHandled: 1350,
    recognitionType: "DPS",
  },
];

const highOffices: Performer[] = [
  {
    id: "OFF-KAM-01",
    name: "Guwahati Revenue Circle",
    department: "Revenue & Disaster Management",
    office: "Guwahati Circle",
    district: "Kamrup Metro",
    compliance: 97,
    avgTat: 2.8,
    score: 98,
    servicesHandled: 3400,
    recognitionType: "Office",
  },
  {
    id: "OFF-DIB-01",
    name: "Dibrugarh West Revenue Circle",
    department: "Revenue & Disaster Management",
    office: "Dibrugarh West",
    district: "Dibrugarh",
    compliance: 95,
    avgTat: 3.2,
    score: 94,
    servicesHandled: 2200,
    recognitionType: "Office",
  },
  {
    id: "OFF-JOR-01",
    name: "Jorhat Sadar Circle Office",
    department: "Revenue & Disaster Management",
    office: "Jorhat Sadar",
    district: "Jorhat",
    compliance: 94,
    avgTat: 3.4,
    score: 93,
    servicesHandled: 1950,
    recognitionType: "Office",
  },
];

const highDistricts: Performer[] = [
  {
    id: "DIST-01",
    name: "Kamrup Metropolitan District",
    department: "Multi-departmental Administration",
    office: "DC Office Kamrup Metro",
    district: "Kamrup Metro",
    compliance: 91,
    avgTat: 3.8,
    score: 95,
    servicesHandled: 14210,
    recognitionType: "District",
  },
  {
    id: "DIST-02",
    name: "Dibrugarh District",
    department: "Multi-departmental Administration",
    office: "DC Office Dibrugarh",
    district: "Dibrugarh",
    compliance: 89,
    avgTat: 4.1,
    score: 92,
    servicesHandled: 8940,
    recognitionType: "District",
  },
];

export default function Recognition() {
  const [activeTab, setActiveTab] = useState<"dps" | "offices" | "districts">("dps");
  const [selectedCitation, setSelectedCitation] = useState<Performer | null>(null);

  const currentList =
    activeTab === "dps" ? highPerformers : activeTab === "offices" ? highOffices : highDistricts;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-6">
      <PageHeader
        title="Excellence & Recognition Candidates"
        subtitle="Annual Roll of Honor under the Assam Right to Public Services Act (ARTPS 2012)"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs bg-green-500/15 text-green-900 border border-green-400/30 px-2.5 py-1 rounded font-bold">
            ● 24 ELIGIBLE CANDIDATES
          </span>
        </div>
      </PageHeader>

      {/* Official Government Commendation Framework Banner */}
      <div className="bg-gradient-to-r from-[#0b252f] via-[#0f3443] to-[#164455] rounded-lg p-5 text-white shadow-sm border border-[#1a4d61] flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-white/10 p-1 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
              <Image
                src="/logo/assam-gov-logo.png"
                alt="Government of Assam"
                width={40}
                height={40}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <div className="w-10 h-10 bg-white p-1 rounded shadow-xs flex items-center justify-center flex-shrink-0">
              <Image
                src="/logo/sewa-setu.png"
                alt="Sewa Setu Assam"
                width={32}
                height={32}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Government of Assam • Sewa Setu Service Delivery Citations
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Public Service Delivery Excellence Framework (ARTPS Act 2012)
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
              Conferred upon Designated Public Servants (DPS), Circle Offices, and District Administrations maintaining &gt;90% SLA compliance, zero repeat escalations, and turnaround times well within statutory limits.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/10 text-right">
          <div>
            <span className="text-[10px] text-slate-300 block uppercase font-bold">Eligible DPS</span>
            <span className="text-2xl font-bold text-amber-400 font-mono">24</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-300 block uppercase font-bold">Top Circles</span>
            <span className="text-2xl font-bold text-white font-mono">6</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex rounded-md border border-slate-300 bg-white p-1 shadow-2xs max-w-md">
        <button
          onClick={() => setActiveTab("dps")}
          className={`flex-1 py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "dps" ? "bg-[#0f3443] text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          Designated Officers ({highPerformers.length})
        </button>
        <button
          onClick={() => setActiveTab("offices")}
          className={`flex-1 py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "offices" ? "bg-[#0f3443] text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Circle Offices ({highOffices.length})
        </button>
        <button
          onClick={() => setActiveTab("districts")}
          className={`flex-1 py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "districts" ? "bg-[#0f3443] text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          Districts ({highDistricts.length})
        </button>
      </div>

      {/* Performer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentList.map((dps) => (
          <div
            key={dps.id}
            className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden hover:border-[#16803c]/40 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              {/* Top Accent Stripe */}
              <div className="h-1.5 bg-gradient-to-r from-[#1464A5] via-[#218838] to-amber-500" />

              <div className="p-5">
                {/* Badge Row */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#e8f5ec] text-[#16803c] border border-[#b9e4c5] rounded text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Commendation Eligible
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-bold">{dps.id}</span>
                </div>

                {/* Name & Unit */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1464A5] transition-colors leading-tight mb-1">
                  {dps.name}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  {dps.department} • {dps.office} ({dps.district})
                </p>

                {/* Score + Compliance */}
                <div className="flex justify-between items-end border-b border-slate-100 pb-3 mb-3 bg-[#F7F9FB] p-3 rounded">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">
                      Index Score
                    </p>
                    <p className="text-2xl font-bold text-[#16803c] font-mono">{dps.score}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">
                      SLA Compliance
                    </p>
                    <p className="text-xl font-bold text-slate-900 font-mono">{dps.compliance}%</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      Avg Turnaround
                    </span>
                    <span className="font-semibold text-slate-900 font-mono">{dps.avgTat} days</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center">
                      <Medal className="w-3.5 h-3.5 mr-1.5 text-[#16803c]" />
                      Services Delivered
                    </span>
                    <span className="font-semibold text-slate-900 font-mono">{dps.servicesHandled.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center">
                      <Award className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                      Repeat SLA Breaches
                    </span>
                    <span className="font-bold text-[#16803c]">0 (Zero Backlog)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="bg-[#F7F9FB] border-t border-slate-200 p-3 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-white text-[#0f3443] border-slate-300 hover:bg-[#EEF6FA] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
                onClick={() => setSelectedCitation(dps)}
              >
                <FileCheck className="w-3.5 h-3.5 text-[#1464A5]" />
                View Official Citation
              </Button>
              {dps.recognitionType === "DPS" ? (
                <Link
                  href={`/dps/${dps.id}`}
                  className="w-full text-[#1464A5] hover:bg-[#EEF6FA] text-xs font-semibold flex items-center justify-center gap-1 h-7 rounded transition-colors"
                >
                  View Officer Dossier <ChevronRight className="w-3 h-3" />
                </Link>
              ) : (
                <Link
                  href={`/offices`}
                  className="w-full text-[#1464A5] hover:bg-[#EEF6FA] text-xs font-semibold flex items-center justify-center gap-1 h-7 rounded transition-colors"
                >
                  View Office Dossier <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Official Citation Preview Modal */}
      {selectedCitation && (
        <Dialog open={!!selectedCitation} onOpenChange={() => setSelectedCitation(null)}>
          <DialogContent className="max-w-2xl bg-white border border-slate-300 p-0 overflow-hidden shadow-2xl">
            {/* Government Certificate Header */}
            <div className="p-8 border-8 border-double border-[#0f3443] m-3 bg-[#fafbfc] relative">
              {/* Watermark in background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <Image
                  src="/logo/assam-gov-logo.png"
                  alt="Watermark"
                  width={300}
                  height={300}
                  style={{ width: "auto", height: "auto" }}
                />
              </div>

              {/* Certificate Top Dual Logo Header */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-[#0f3443] mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 relative flex-shrink-0">
                    <Image
                      src="/logo/assam-gov-logo.png"
                      alt="Government of Assam"
                      width={56}
                      height={56}
                      className="object-contain"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-[#0f3443] uppercase">
                      GOVERNMENT OF ASSAM • অসম চৰকাৰ
                    </h4>
                    <p className="text-[10px] text-slate-600">
                      Department of Administrative Reforms & RTPS Directorate
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-white p-1 rounded border border-slate-200 shadow-2xs">
                    <Image
                      src="/logo/sewa-setu.png"
                      alt="Sewa Setu Assam"
                      width={44}
                      height={44}
                      className="object-contain"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                </div>
              </div>

              {/* Certificate Body */}
              <div className="text-center space-y-4 my-6">
                <span className="text-[11px] font-bold tracking-widest text-[#1464A5] uppercase bg-[#e8f1f8] px-3 py-1 rounded">
                  ASSAM RIGHT TO PUBLIC SERVICES ACT, 2012
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#0f3443] tracking-wide">
                  CERTIFICATE OF COMMENDATION
                </h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest">
                  FOR EXEMPLARY PUBLIC SERVICE DELIVERY
                </p>

                <div className="pt-2">
                  <p className="text-xs text-slate-600 italic">This official citation is awarded to</p>
                  <p className="text-xl font-bold text-[#0f3443] font-serif mt-1">
                    {selectedCitation.name}
                  </p>
                  <p className="text-xs font-semibold text-slate-700">
                    {selectedCitation.recognitionType === "DPS"
                      ? `Designated Public Servant (${selectedCitation.id})`
                      : `Administrative Office (${selectedCitation.id})`}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedCitation.department} • {selectedCitation.office}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto pt-2">
                  In recognition of maintaining an outstanding SLA compliance rate of{" "}
                  <strong className="text-[#16803c]">{selectedCitation.compliance}%</strong> with an average turnaround time of{" "}
                  <strong>{selectedCitation.avgTat} days</strong> across {selectedCitation.servicesHandled.toLocaleString()} citizen service applications on the Sewa Setu portal without a single recurring delay.
                </p>
              </div>

              {/* Signatures & Seal */}
              <div className="flex justify-between items-end pt-8 mt-6 border-t border-slate-300 text-center">
                <div className="space-y-1">
                  <div className="h-0.5 w-28 bg-slate-400 mx-auto" />
                  <p className="text-[10px] font-bold text-slate-700">Nodal Officer (RTPS)</p>
                  <p className="text-[9px] text-slate-500">Sewa Setu Portal</p>
                </div>

                {/* State Seal Emblem */}
                <div className="w-12 h-12 relative opacity-80">
                  <Image
                    src="/logo/assam-gov-logo.png"
                    alt="Official Seal"
                    width={48}
                    height={48}
                    className="object-contain"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>

                <div className="space-y-1">
                  <div className="h-0.5 w-28 bg-slate-400 mx-auto" />
                  <p className="text-[10px] font-bold text-slate-700">Principal Secretary</p>
                  <p className="text-[9px] text-slate-500">Administrative Reforms, Assam</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-[#f7f9fb] px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCitation(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                className="bg-[#0f3443] hover:bg-[#1a4d5e] text-white flex items-center gap-1.5"
                onClick={() => window.print()}
              >
                <Printer className="w-3.5 h-3.5" />
                Print Official Citation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
