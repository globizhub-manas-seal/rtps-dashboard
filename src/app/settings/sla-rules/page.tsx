"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Info,
  Save,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Gavel,
  BookOpen,
  CheckCircle2,
  Plus,
  Trash2
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface StatutoryRule {
  id: string;
  service: string;
  department: string;
  statutoryDays: number;
  appealWindowDays: number;
  escalationTier: "Level 1 (70%)" | "Level 2 (90%)" | "Level 3 (100%)";
  status: "Gazetted" | "Active";
}

const initialRules: StatutoryRule[] = [
  { id: "SR-01", service: "Income Certificate", department: "Revenue & Disaster Mgmt", statutoryDays: 7, appealWindowDays: 30, escalationTier: "Level 1 (70%)", status: "Gazetted" },
  { id: "SR-02", service: "Permanent Residence Certificate", department: "Revenue & Disaster Mgmt", statutoryDays: 14, appealWindowDays: 30, escalationTier: "Level 2 (90%)", status: "Gazetted" },
  { id: "SR-03", service: "Mutation / Partition of Land", department: "Revenue & Disaster Mgmt", statutoryDays: 30, appealWindowDays: 60, escalationTier: "Level 3 (100%)", status: "Gazetted" },
  { id: "SR-04", service: "Caste Certificate (SC/ST/OBC)", department: "Revenue & Disaster Mgmt", statutoryDays: 15, appealWindowDays: 30, escalationTier: "Level 1 (70%)", status: "Gazetted" },
  { id: "SR-05", service: "Birth Certificate Registration", department: "Health & Family Welfare", statutoryDays: 7, appealWindowDays: 30, escalationTier: "Level 1 (70%)", status: "Gazetted" },
  { id: "SR-06", service: "Learner Driving License", department: "Transport Department", statutoryDays: 3, appealWindowDays: 15, escalationTier: "Level 1 (70%)", status: "Gazetted" },
  { id: "SR-07", service: "Trade License Issuance", department: "Urban & Municipal Affairs", statutoryDays: 10, appealWindowDays: 30, escalationTier: "Level 2 (90%)", status: "Gazetted" },
];

export default function SLARules() {
  const [rules, setRules] = useState<StatutoryRule[]>(initialRules);
  const [warningThreshold, setWarningThreshold] = useState(70);
  const [criticalThreshold, setCriticalThreshold] = useState(90);
  const [repeatDelayLimit, setRepeatDelayLimit] = useState(3);
  const [reviewScoreThreshold, setReviewScoreThreshold] = useState(80);
  const [recognitionScoreThreshold, setRecognitionScoreThreshold] = useState(95);

  const [savedBanner, setSavedBanner] = useState(false);

  const handleSave = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 4000);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="SLA Rules & Statutory Thresholds Engine"
        subtitle="Configurable statutory timelines, multi-tier escalation triggers, and review thresholds under ARTPS Act 2012"
      >
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            className="bg-[#0f3443] hover:bg-[#1a4d5e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            Save Statutory Rulebook
          </Button>
        </div>
      </PageHeader>

      {/* Save Success Banner */}
      {savedBanner && (
        <div className="bg-[#e8f5ec] border border-[#b9e4c5] p-3.5 rounded text-xs text-[#16803c] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#16803c]" />
            Configuration saved successfully! Prototype monitoring engine updated with new statutory parameters.
          </div>
          <button onClick={() => setSavedBanner(false)} className="text-green-900 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Official Gazette Reference Card */}
      <div className="bg-gradient-to-r from-[#0b252f] to-[#164455] text-white rounded-lg p-4 shadow-sm border border-[#1a4d61] flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/10 rounded-md border border-white/20 mt-0.5">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Official Gazette Notification • Government of Assam
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5">
              Assam Right to Public Services Act (ARTPS) Rules, 2012
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
              Notification No. AR.24/2012/118 issued by the Department of Administrative Reforms, Dispur. Statutory delivery days represent the maximum legally permitted time before Section 8 penalty procedures may be initiated.
            </p>
          </div>
        </div>

        <div className="text-right flex-shrink-0 hidden sm:block">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Notified Services</span>
          <span className="text-2xl font-bold font-mono text-amber-400">450+</span>
        </div>
      </div>

      {/* Multi-Tier Escalation Protocol Strip */}
      <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-[#F7F9FB] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3-Tier Statutory Escalation Matrix
            </h2>
            <p className="text-[11px] text-slate-500">
              Automated trigger protocol executed by the Sewa Setu RTPS Performance Intelligence engine
            </p>
          </div>
          <span className="text-[10px] font-mono bg-blue-50 text-[#1464A5] border border-blue-200 px-2 py-0.5 rounded font-bold">
            ACTIVE PROTOCOL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-4 gap-4 md:gap-0">
          {/* Tier 1 */}
          <div className="md:px-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1464A5] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Tier 1: Warning
              </span>
              <span className="text-xs font-mono font-bold bg-blue-50 text-[#1464A5] px-1.5 py-0.5 rounded">
                &ge; {warningThreshold}% SLA
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Automated in-app desktop prompt to Designated Public Servant (DPS) and SMS notification to processing desk.
            </p>
          </div>

          {/* Tier 2 */}
          <div className="md:px-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Tier 2: Critical
              </span>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded">
                &ge; {criticalThreshold}% SLA
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Priority escalation alert delivered to Circle Officer, District Nodal Officer, and First Appellate Authority.
            </p>
          </div>

          {/* Tier 3 */}
          <div className="md:px-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#C62828] flex items-center gap-1">
                <Gavel className="w-3.5 h-3.5" /> Tier 3: Statutory Breach
              </span>
              <span className="text-xs font-mono font-bold bg-red-50 text-[#C62828] px-1.5 py-0.5 rounded">
                100% Breached
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Automated logging into Administrative Review Docket under Section 8(1) of ARTPS Act 2012 for explanation requisition.
            </p>
          </div>
        </div>
      </div>

      {/* Global Monitoring Engine Thresholds */}
      <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-[#F7F9FB]">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Threshold Calibration (Prototype Parameters)
          </h2>
          <p className="text-[11px] text-slate-500">
            Tune algorithmic alert sensitivity for SLA consumption and performance categorization
          </p>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SLA Consumption Thresholds */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#0f3443] border-b border-slate-100 pb-2 uppercase tracking-wider">
              SLA Consumption Thresholds
            </h3>
            <div className="flex items-center justify-between gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-800 block">
                  Warning Threshold (%)
                </label>
                <span className="text-[10px] text-slate-500">Triggers Tier 1 alert to officer</span>
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  value={warningThreshold}
                  onChange={(e) => setWarningThreshold(Number(e.target.value))}
                  className="bg-white border-slate-300 text-xs font-mono text-right"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-800 block">
                  Critical Threshold (%)
                </label>
                <span className="text-[10px] text-slate-500">Triggers supervisory escalation</span>
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  value={criticalThreshold}
                  onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                  className="bg-white border-slate-300 text-xs font-mono text-right"
                />
              </div>
            </div>
          </div>

          {/* Administrative Action Thresholds */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#0f3443] border-b border-slate-100 pb-2 uppercase tracking-wider">
              Administrative Action Thresholds
            </h3>
            <div className="flex items-center justify-between gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-800 block">
                  Repeat Delay Sensitivity Limit
                </label>
                <span className="text-[10px] text-slate-500">Number of breaches before flagging repeat pattern</span>
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  value={repeatDelayLimit}
                  onChange={(e) => setRepeatDelayLimit(Number(e.target.value))}
                  className="bg-white border-slate-300 text-xs font-mono text-right"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-800 block">
                  Administrative Review Threshold (%)
                </label>
                <span className="text-[10px] text-slate-500">SLA rate below which review is initiated</span>
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  value={reviewScoreThreshold}
                  onChange={(e) => setReviewScoreThreshold(Number(e.target.value))}
                  className="bg-white border-slate-300 text-xs font-mono text-right"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-800 block">
                  State Commendation Threshold (%)
                </label>
                <span className="text-[10px] text-slate-500">Compliance required for citation nomination</span>
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  value={recognitionScoreThreshold}
                  onChange={(e) => setRecognitionScoreThreshold(Number(e.target.value))}
                  className="bg-white border-slate-300 text-xs font-mono text-right"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Notified Services Table */}
      <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-[#F7F9FB] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Statutory Services Rulebook (Notified Services)
            </h2>
            <p className="text-[11px] text-slate-500">
              Prescribed statutory limits notified under ARTPS Act 2012 by administrative departments
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#EEF6FA] hover:bg-[#EEF6FA]">
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider py-2.5">Rule ID</TableHead>
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">Notified Service</TableHead>
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">Line Department</TableHead>
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Statutory SLA</TableHead>
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Appeal Window</TableHead>
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">Escalation Tier</TableHead>
                <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id} className="border-b border-slate-100 hover:bg-[#F7F9FB]">
                  <TableCell className="text-xs font-mono font-bold text-[#1464A5]">{rule.id}</TableCell>
                  <TableCell className="text-xs font-bold text-slate-900">{rule.service}</TableCell>
                  <TableCell className="text-xs text-slate-600">{rule.department}</TableCell>
                  <TableCell className="text-xs text-right font-mono font-bold text-slate-900">
                    {rule.statutoryDays} working days
                  </TableCell>
                  <TableCell className="text-xs text-right font-mono text-slate-600">
                    {rule.appealWindowDays} days
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-700">{rule.escalationTier}</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-[#16803c] border border-green-200">
                      {rule.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Card Footer Actions */}
        <div className="flex justify-end gap-3 border-t border-slate-200 bg-[#F7F9FB] px-5 py-3">
          <Button
            onClick={handleSave}
            className="bg-[#0f3443] hover:bg-[#1a4d5e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            Apply & Save Rules
          </Button>
        </div>
      </div>
    </div>
  );
}
