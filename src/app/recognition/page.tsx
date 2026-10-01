"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Medal,
  Award,
  CheckCircle2,
  Building2,
  MapPin,
  Sparkles,
  Users,
  ChevronRight,
  RefreshCw,
  Info
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export default function RecognitionPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ruleText, setRuleText] = useState<string>("Illustrative prototype rule (SLA Compliance ≥ 95% & Repeat Delays ≤ 2)");

  const fetchRecognitionCandidates = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/recognition");
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.candidates || []);
        if (data.rule) setRuleText(data.rule);
      }
    } catch (e) {
      console.error("Recognition fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecognitionCandidates();
  }, []);

  return (
    <div className="py-5 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-6">
      <PageHeader
        title="Public Service Excellence & Recognition"
        subtitle="Incentivizing exemplary governance, turnaround velocity, and zero statutory SLA breaches"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRecognitionCandidates}
          disabled={loading}
          className="border-slate-300 text-xs font-semibold text-[#0f3443] flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Recalculate Merit
        </Button>
      </PageHeader>

      {/* Illustrative Rule Callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-md p-3.5 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800">
            Eligibility Threshold Setting
          </span>
          <p>
            <strong>{ruleText}</strong>
          </p>
          <p className="text-[11px] text-amber-700">
            * Note: Labelled as an <em>illustrative prototype rule</em> for administrative demonstration; subject to state civil service notification.
          </p>
        </div>
      </div>

      {/* Recognition Candidates Grid */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#0f3443] uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            Qualifying Recognition Candidates ({candidates.length})
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Directly evaluated from 530+ applications
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs bg-white rounded border border-slate-200">
            <RefreshCw className="w-5 h-5 mx-auto animate-spin text-[#1464A5] mb-2" />
            Computing merit candidates from PostgreSQL...
          </div>
        ) : candidates.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs bg-white rounded border border-slate-200">
            No officers currently satisfy the threshold.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates.map((dps, idx) => (
              <div
                key={dps.dpsId}
                className="bg-white border border-emerald-200 rounded-md p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-3 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl">
                  Rank #{idx + 1}
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-xs font-bold text-emerald-800">{dps.employeeCode}</span>
                  <h4 className="text-sm font-bold text-slate-900">{dps.name}</h4>
                  <p className="text-xs text-slate-600">{dps.designation}</p>
                  <p className="text-[11px] text-slate-500">{dps.office}, {dps.district}</p>
                </div>

                {/* Scorecard */}
                <div className="grid grid-cols-3 gap-2 bg-emerald-50/60 p-2.5 rounded border border-emerald-100 text-center text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">SLA Compliance</span>
                    <span className="font-mono font-bold text-emerald-800 text-sm">{dps.complianceRate}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Avg TAT</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">{dps.avgTat}d</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Repeat Delays</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">{dps.repeatDelays}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Commendation Ready
                  </span>
                  <Link
                    href={`/sla-monitor?dps=${dps.employeeCode}`}
                    className="text-[#1464A5] hover:underline font-semibold flex items-center gap-0.5"
                  >
                    View Dossier <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
