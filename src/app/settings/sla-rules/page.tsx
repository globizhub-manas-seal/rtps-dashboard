"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Save,
  Clock,
  AlertTriangle,
  Gavel,
  BookOpen,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Info,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SlaRuleRow {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceCode: string;
  departmentName: string;
  departmentCode: string;
  slaDays: number;
  warningHours: number;
  criticalHours: number;
  appealWindowDays: number;
  reviewThreshold: number;
  recognitionThreshold: number;
  repeatDelayThreshold: number;
  isActive: boolean;
  // Local editing state
  dirty?: boolean;
}

export default function SLARules() {
  const [rules, setRules] = useState<SlaRuleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/sla-rules?active=true");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRules(data.rules.map((r: SlaRuleRow) => ({ ...r, dirty: false })));
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load SLA rules");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRules(); }, [fetchRules]);

  const updateField = (ruleId: string, field: keyof SlaRuleRow, value: number) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId ? { ...r, [field]: value, dirty: true } : r
      )
    );
  };

  const handleSaveAll = async () => {
    const dirtyRules = rules.filter((r) => r.dirty);
    if (dirtyRules.length === 0) {
      setSavedBanner(true);
      setTimeout(() => setSavedBanner(false), 3000);
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    try {
      for (const rule of dirtyRules) {
        const res = await fetch("/api/sla-rules", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: rule.id,
            slaDays: rule.slaDays,
            warningHours: rule.warningHours,
            criticalHours: rule.criticalHours,
            appealWindowDays: rule.appealWindowDays,
            reviewThreshold: rule.reviewThreshold,
            recognitionThreshold: rule.recognitionThreshold,
            repeatDelayThreshold: rule.repeatDelayThreshold,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Save failed");
      }
      setSavedBanner(true);
      setTimeout(() => setSavedBanner(false), 4000);
      setRules((prev) => prev.map((r) => ({ ...r, dirty: false })));
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save rules");
    } finally {
      setSaving(false);
    }
  };

  const dirtyCount = rules.filter((r) => r.dirty).length;

  // Compute aggregate stats for the info strip
  const avgWarning = rules.length > 0 ? Math.round(rules.reduce((s, r) => s + r.warningHours, 0) / rules.length) : 48;
  const avgCritical = rules.length > 0 ? Math.round(rules.reduce((s, r) => s + r.criticalHours, 0) / rules.length) : 12;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="SLA Rules & Statutory Thresholds Engine"
        subtitle="Database-driven configurable statutory timelines, escalation triggers, and review thresholds under ARTPS Act 2012"
      >
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchRules}
            variant="outline"
            className="text-xs font-semibold flex items-center gap-1.5"
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={handleSaveAll}
            className="bg-[#0f3443] hover:bg-[#1a4d5e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            disabled={saving || dirtyCount === 0}
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {dirtyCount > 0 ? `Save ${dirtyCount} Change${dirtyCount > 1 ? "s" : ""}` : "All Saved"}
          </Button>
        </div>
      </PageHeader>

      {/* Save Success Banner */}
      {savedBanner && (
        <div className="bg-[#e8f5ec] border border-[#b9e4c5] p-3.5 rounded text-xs text-[#16803c] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#16803c]" />
            SLA rules persisted to PostgreSQL. All monitoring engines will use updated thresholds immediately.
          </div>
          <button onClick={() => setSavedBanner(false)} className="text-green-900 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 p-3.5 rounded text-xs text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            {errorMsg}
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-red-900 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Data Source Indicator */}
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded px-3 py-2">
        <Settings2 className="w-3.5 h-3.5 text-[#1464A5]" />
        <span className="text-[11px] font-semibold text-[#1464A5]">
          Live from PostgreSQL &bull; sla_rules table &bull; {rules.length} active rules configured
        </span>
      </div>

      {/* Official Gazette Reference Card */}
      <div className="bg-gradient-to-r from-[#0b252f] to-[#164455] text-white rounded-lg p-4 shadow-sm border border-[#1a4d61] flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/10 rounded-md border border-white/20 mt-0.5">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Official Gazette Notification &bull; Government of Assam
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5">
              Assam Right to Public Services Act (ARTPS) Rules, 2012
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
              Notification No. AR.24/2012/118. Statutory delivery days and escalation thresholds are now database-configurable per service. Changes take effect immediately across all monitoring dashboards.
            </p>
          </div>
        </div>

        <div className="text-right flex-shrink-0 hidden sm:block">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Configured Services</span>
          <span className="text-2xl font-bold font-mono text-amber-400">{rules.length}</span>
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
              Aggregate thresholds derived from service-level SLA rules in PostgreSQL
            </p>
          </div>
          <span className="text-[10px] font-mono bg-green-50 text-[#16803c] border border-green-200 px-2 py-0.5 rounded font-bold">
            DB-DRIVEN
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-4 gap-4 md:gap-0">
          {/* Tier 1 */}
          <div className="md:px-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1464A5] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Tier 1: Warning (At Risk)
              </span>
              <span className="text-xs font-mono font-bold bg-blue-50 text-[#1464A5] px-1.5 py-0.5 rounded">
                ≤ {avgWarning}h avg remaining
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Automated in-app prompt to DPS and SMS notification. Trigger varies by service (24-72h).
            </p>
          </div>

          {/* Tier 2 */}
          <div className="md:px-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Tier 2: Critical
              </span>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded">
                ≤ {avgCritical}h avg remaining
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Priority escalation to Circle Officer, District Nodal Officer, and First Appellate Authority.
            </p>
          </div>

          {/* Tier 3 */}
          <div className="md:px-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#C62828] flex items-center gap-1">
                <Gavel className="w-3.5 h-3.5" /> Tier 3: Statutory Breach
              </span>
              <span className="text-xs font-mono font-bold bg-red-50 text-[#C62828] px-1.5 py-0.5 rounded">
                0h — 100% Breached
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Automated logging into Administrative Review Docket under Section 8(1) of ARTPS Act 2012.
            </p>
          </div>
        </div>
      </div>

      {/* Editable SLA Rules Table */}
      <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-[#F7F9FB] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Per-Service Statutory Thresholds (Editable)
            </h2>
            <p className="text-[11px] text-slate-500">
              Edit thresholds inline and click Save to persist to PostgreSQL. Changes immediately affect SLA calculations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#16803c]" />
            <span className="text-[10px] font-mono bg-green-50 text-[#16803c] border border-green-200 px-2 py-0.5 rounded font-bold">
              {rules.length} ACTIVE RULES
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#1464A5]" />
            <span className="ml-2 text-sm text-slate-500">Loading rules from database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#EEF6FA] hover:bg-[#EEF6FA]">
                  <TableHead className="text-[#123B4A] text-[10px] font-semibold uppercase tracking-wider py-2.5 whitespace-nowrap">Service</TableHead>
                  <TableHead className="text-[#123B4A] text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">Department</TableHead>
                  <TableHead className="text-[#123B4A] text-[10px] font-semibold uppercase tracking-wider text-center whitespace-nowrap">SLA Days</TableHead>
                  <TableHead className="text-[#123B4A] text-[10px] font-semibold uppercase tracking-wider text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <span>Warning</span>
                      <span className="text-[8px] text-slate-400 font-normal">(hours)</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-[#123B4A] text-[10px] font-semibold uppercase tracking-wider text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <span>Critical</span>
                      <span className="text-[8px] text-slate-400 font-normal">(hours)</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-[#123B4A] text-[10px] font-semibold uppercase tracking-wider text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <span>Appeal</span>
                      <span className="text-[8px] text-slate-400 font-normal">(days)</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-[#123B4A] text-[10px] font-semibold uppercase tracking-wider text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <span>Review %</span>
                      <span className="text-[8px] text-slate-400 font-normal">(threshold)</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-[#123B4A] text-[10px] font-semibold uppercase tracking-wider text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <span>Recog %</span>
                      <span className="text-[8px] text-slate-400 font-normal">(commendation)</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-[#123B4A] text-[10px] font-semibold uppercase tracking-wider text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <span>Repeat</span>
                      <span className="text-[8px] text-slate-400 font-normal">(max delays)</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-[#123B4A] text-[10px] font-semibold uppercase tracking-wider text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow
                    key={rule.id}
                    className={`border-b border-slate-100 hover:bg-[#F7F9FB] transition-colors ${
                      rule.dirty ? "bg-amber-50/50" : ""
                    }`}
                  >
                    <TableCell className="text-xs font-bold text-slate-900 min-w-[180px]">
                      <div>
                        {rule.serviceName}
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">{rule.serviceCode}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] text-slate-600 whitespace-nowrap">{rule.departmentName}</TableCell>
                    <TableCell className="text-center p-1">
                      <Input
                        type="number"
                        value={rule.slaDays}
                        onChange={(e) => updateField(rule.id, "slaDays", Number(e.target.value))}
                        className="w-16 mx-auto bg-white border-slate-300 text-xs font-mono text-center h-8"
                      />
                    </TableCell>
                    <TableCell className="text-center p-1">
                      <Input
                        type="number"
                        value={rule.warningHours}
                        onChange={(e) => updateField(rule.id, "warningHours", Number(e.target.value))}
                        className="w-16 mx-auto bg-white border-slate-300 text-xs font-mono text-center h-8"
                      />
                    </TableCell>
                    <TableCell className="text-center p-1">
                      <Input
                        type="number"
                        value={rule.criticalHours}
                        onChange={(e) => updateField(rule.id, "criticalHours", Number(e.target.value))}
                        className="w-16 mx-auto bg-white border-slate-300 text-xs font-mono text-center h-8"
                      />
                    </TableCell>
                    <TableCell className="text-center p-1">
                      <Input
                        type="number"
                        value={rule.appealWindowDays}
                        onChange={(e) => updateField(rule.id, "appealWindowDays", Number(e.target.value))}
                        className="w-16 mx-auto bg-white border-slate-300 text-xs font-mono text-center h-8"
                      />
                    </TableCell>
                    <TableCell className="text-center p-1">
                      <Input
                        type="number"
                        value={rule.reviewThreshold}
                        onChange={(e) => updateField(rule.id, "reviewThreshold", Number(e.target.value))}
                        className="w-16 mx-auto bg-white border-slate-300 text-xs font-mono text-center h-8"
                      />
                    </TableCell>
                    <TableCell className="text-center p-1">
                      <Input
                        type="number"
                        value={rule.recognitionThreshold}
                        onChange={(e) => updateField(rule.id, "recognitionThreshold", Number(e.target.value))}
                        className="w-16 mx-auto bg-white border-slate-300 text-xs font-mono text-center h-8"
                      />
                    </TableCell>
                    <TableCell className="text-center p-1">
                      <Input
                        type="number"
                        value={rule.repeatDelayThreshold}
                        onChange={(e) => updateField(rule.id, "repeatDelayThreshold", Number(e.target.value))}
                        className="w-14 mx-auto bg-white border-slate-300 text-xs font-mono text-center h-8"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      {rule.dirty ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Modified
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-[#16803c] border border-green-200">
                          Active
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="flex justify-between items-center border-t border-slate-200 bg-[#F7F9FB] px-5 py-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Info className="w-3.5 h-3.5" />
            <span>
              Thresholds persist in <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-mono">sla_rules</code> table.
              SLA engine reads these at runtime — no rebuild required.
            </span>
          </div>
          <Button
            onClick={handleSaveAll}
            className="bg-[#0f3443] hover:bg-[#1a4d5e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            disabled={saving || dirtyCount === 0}
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {dirtyCount > 0 ? `Apply & Save ${dirtyCount} Rule${dirtyCount > 1 ? "s" : ""}` : "All Saved"}
          </Button>
        </div>
      </div>
    </div>
  );
}
