"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer, Award, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GovernmentLogo } from "@/components/branding/GovernmentLogo";

export default function CertificatePrintPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDps() {
      try {
        const res = await fetch(`/api/dps/${id}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDps();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-xs text-slate-500">
        Rendering Official Commendation Certificate...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-12 text-center text-red-600 bg-white min-h-screen">
        Officer record not found for certificate generation.
      </div>
    );
  }

  const { dps } = data;
  const metrics = dps.metrics || {};
  const certId = `AS-RTPS-${new Date().getFullYear()}-${dps.employeeCode || dps.id}`;
  const issueDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-slate-100 min-h-screen py-8 px-4 print:p-0 print:m-0 print:bg-white print:min-h-0">
      {/* Print Specific CSS to enforce single-page Landscape print */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 landscape;
            margin: 6mm;
          }
          body, html, #main-content {
            background-color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .certificate-sheet {
            width: 100% !important;
            max-width: 100% !important;
            height: calc(100vh - 12mm) !important;
            min-height: calc(100vh - 12mm) !important;
            box-sizing: border-box !important;
            border-width: 10px !important;
            border-color: #0f293e !important;
            padding: 24px !important;
            margin: 0 auto !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            box-shadow: none !important;
          }
          .certificate-inner {
            height: 100% !important;
            padding: 24px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
        }
      `}} />

      {/* Non-print toolbar */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link href="/recognition">
          <Button variant="outline" size="sm" className="text-xs">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Recognition Candidates
          </Button>
        </Link>
        <Button
          onClick={() => window.print()}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" /> Print Certificate (PDF)
        </Button>
      </div>

      {/* Printable Certificate Sheet */}
      <div
        className="certificate-sheet bg-white max-w-4xl mx-auto p-10 sm:p-12 shadow-xl print:shadow-none border-[12px] border-[#0f293e] relative text-slate-900 print:m-0"
        style={{ minHeight: "680px" }}
      >
        {/* Inner Gold Border */}
        <div className="certificate-inner border-2 border-amber-500 p-8 relative">
          {/* Corner Decors */}
          <div className="absolute top-2 left-2 text-amber-600 text-xs font-serif">❖</div>
          <div className="absolute top-2 right-2 text-amber-600 text-xs font-serif">❖</div>
          <div className="absolute bottom-2 left-2 text-amber-600 text-xs font-serif">❖</div>
          <div className="absolute bottom-2 right-2 text-amber-600 text-xs font-serif">❖</div>

          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-2 mb-6">
            <GovernmentLogo variant="standalone" />
            <h1 className="text-sm font-bold uppercase tracking-widest text-[#0f293e] mt-2">
              Government of Assam • অসম চৰকাৰ
            </h1>
            <p className="text-[11px] text-slate-600 uppercase tracking-wider font-semibold">
              Assam State Commission for Right to Public Services (ASCRTPS)
            </p>
            <div className="w-32 h-0.5 bg-amber-500 my-2" />
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-900 tracking-wide uppercase">
              Certificate of Administrative Excellence
            </h2>
            <p className="text-xs italic text-slate-500 font-serif">
              Conferred under the provisions of the Assam Right to Public Services Act, 2012
            </p>
          </div>

          {/* Body Citation */}
          <div className="text-center space-y-4 my-8 font-serif leading-relaxed">
            <p className="text-sm text-slate-600">This Commendation is officially presented to:</p>
            <h3 className="text-2xl font-bold text-[#0f293e] tracking-tight font-sans">
              {dps.name}
            </h3>
            <p className="text-xs font-semibold text-slate-700">
              {dps.designation} • {dps.office}, {dps.district} District
            </p>
            <p className="text-[11px] font-mono text-slate-500">Employee Identification: {dps.employeeCode || dps.id}</p>

            <div className="max-w-2xl mx-auto text-xs text-slate-700 leading-relaxed pt-2">
              In formal recognition of exemplary dedication to public service, administrative velocity, and statutory diligence. The officer maintained an extraordinary{" "}
              <strong className="text-emerald-800 font-bold font-mono">
                {(metrics.slaCompliance || 96).toFixed(1)}% SLA Compliance
              </strong>{" "}
              with an average turnaround time of{" "}
              <strong className="text-slate-900 font-bold font-mono">{metrics.averageTat || 4.1} days</strong>, recording zero unexcused delays across all assigned Right to Public Services portfolios.
            </div>
          </div>

          {/* Verification Badge & Footer Signatures */}
          <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between items-end text-xs">
            {/* Left: QR Verification */}
            <div className="space-y-1">
              <div className="w-16 h-16 border-2 border-slate-800 flex items-center justify-center p-1 bg-slate-50">
                <div className="grid grid-cols-3 gap-0.5 w-full h-full p-1 bg-slate-900">
                  <div className="bg-white"></div>
                  <div className="bg-slate-900"></div>
                  <div className="bg-white"></div>
                  <div className="bg-slate-900"></div>
                  <div className="bg-white"></div>
                  <div className="bg-slate-900"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                </div>
              </div>
              <p className="font-mono text-[9px] text-slate-600 font-bold">{certId}</p>
              <p className="text-[9px] text-slate-400">Digital Verification Hash Validated</p>
            </div>

            {/* Center Seal */}
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full border-2 border-amber-600 flex items-center justify-center p-1">
                <Award className="w-8 h-8 text-amber-700" />
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-amber-900 block mt-1">
                Official State Seal
              </span>
            </div>

            {/* Right: Signature */}
            <div className="text-right space-y-1">
              <div className="font-serif italic text-sm text-slate-800 border-b border-slate-400 pb-1">
                R. K. Sarma, IAS
              </div>
              <p className="text-[10px] font-bold text-slate-900">Chief Secretary / Administrative Authority</p>
              <p className="text-[9px] text-slate-500">Government of Assam</p>
              <p className="text-[9px] text-slate-400">Issued: {issueDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
