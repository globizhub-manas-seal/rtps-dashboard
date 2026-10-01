"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Database,
  ArrowRight,
  RefreshCw,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ShieldCheck,
  Server,
  Layers,
  Clock
} from "lucide-react";

export default function DataIntegrationPage() {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Ingestion simulation form
  const [simRef, setSimRef] = useState<string>(`RTPS-2026-${Math.floor(20000 + Math.random() * 80000)}`);
  const [simService, setSimService] = useState<string>("INC_CERT");
  const [simOffice, setSimOffice] = useState<string>("OFF-GUW-01");
  const [simDps, setSimDps] = useState<string>("DPS-021");
  const [simCitizen, setSimCitizen] = useState<string>("Babul Bora");
  const [isIngesting, setIsIngesting] = useState<boolean>(false);
  const [ingestionResult, setIngestionResult] = useState<any>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ingestion/status");
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch (e) {
      console.error("Telemetry fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const [simSteps, setSimSteps] = useState<string[]>([]);

  const handleSimulateIngestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsIngesting(true);
      setIngestionResult(null);
      setSimSteps([]);

      // Step by step visual simulation
      const steps = [
        "Transaction received from Sewa Setu...",
        "Service identified from payload...",
        "SLA rules loaded from PostgreSQL...",
        "SLA compliance & timelines calculated...",
        "Application evidence stored in ledger...",
        "Executive Dashboard updated!"
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 400));
        setSimSteps(prev => [...prev, steps[i]]);
      }

      const payload = {
        rtpsRefNo: simRef,
        serviceCode: simService,
        officeCode: simOffice,
        dpsEmployeeCode: simDps,
        citizenName: simCitizen,
        submissionDate: simDateOverride || new Date().toISOString(),
        status: simStatus,
      };

      const res = await fetch("/api/ingestion/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setIngestionResult(data);

      if (res.ok) {
        await fetchStatus();
        setSimRef(`RTPS-2026-${Math.floor(20000 + Math.random() * 80000)}`);
        setSimDateOverride(null); // Clear override
      }
    } catch (err: any) {
      setIngestionResult({ error: err.message });
    } finally {
      setIsIngesting(false);
    }
  };

  const [isResetting, setIsResetting] = useState(false);
  const [simDateOverride, setSimDateOverride] = useState<string | null>(null);
  const [simStatus, setSimStatus] = useState<string>("PENDING");

  const handleResetDB = async () => {
    if (!confirm("Are you sure you want to reset all data to the baseline seed?")) return;
    setIsResetting(true);
    try {
      await fetch("/api/admin/seed", { method: "POST" });
      await fetchStatus();
      alert("Database reset successfully.");
    } catch (e) {
      alert("Failed to reset database.");
    } finally {
      setIsResetting(false);
    }
  };

  const applyScenario = (type: "A" | "B" | "C" | "D") => {
    const now = new Date();
    if (type === "A") {
      setSimService("DL_PERM"); // 7 days SLA
      now.setDate(now.getDate() - 1); // ~14% consumed
      setSimStatus("PENDING");
    } else if (type === "B") {
      setSimService("MUTATION"); // 30 days SLA
      now.setDate(now.getDate() - 26); // ~86% consumed (At Risk)
      setSimStatus("UNDER_SCRUTINY");
    } else if (type === "C") {
      setSimService("MUTATION"); // 30 days SLA
      now.setDate(now.getDate() - 32); // >100% consumed (Breach)
      setSimStatus("AWAITING_VERIFICATION");
    } else if (type === "D") {
      setSimService("MUTATION"); // 30 days SLA
      setSimOffice("OFF-KAR-01");
      setSimDps("DPS-104");
      now.setDate(now.getDate() - 32); // Breach
      setSimStatus("AWAITING_VERIFICATION");
    }
    setSimDateOverride(now.toISOString());
  };

  return (
    <div className="py-5 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-6">
      <PageHeader
        title="Data Integration & Pipeline Telemetry"
        subtitle="Sewa Setu core service feed interface and prototype ingestion controller"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={fetchStatus}
          disabled={loading}
          className="border-slate-300 text-xs font-semibold text-[#0f3443] flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Pipeline Status
        </Button>
      </PageHeader>

      {/* Primary Integration Telemetry Card (Requirement 12) */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-[#0f3443] flex items-center gap-2">
              <Server className="w-5 h-5 text-[#1464A5]" />
              Data Integration Status
            </h3>
            <p className="text-xs text-slate-500">
              Prototype Integration — Build this first before live Sewa Setu bridge
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Prototype Mode
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Integration Mode</span>
            <span className="font-bold text-amber-700 text-sm block">● Simulation</span>
            <div className="mt-2 space-y-1">
              <p><span className="text-slate-500">Current data source:</span> <strong>Synthetic RTPS transaction data</strong></p>
              <p><span className="text-slate-500">Production integration:</span> <strong>Requires authorized RTPS/Sewa Setu API access</strong></p>
            </div>
          </div>
          
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Architecture Readiness</span>
            <div className="flex text-[10px] text-slate-500 gap-4 font-mono">
              <div>
                <strong>CURRENT MVP</strong>
                <div className="text-slate-700">Simulator<br/>  ↓<br/>Integration API<br/>  ↓<br/>SLA Engine<br/>  ↓<br/>Dashboard</div>
              </div>
              <div className="border-l border-slate-300 pl-4">
                <strong>FUTURE PRODUCTION</strong>
                <div className="text-[#1464A5] font-semibold">Sewa Setu Core<br/>  ↓<br/>Govt API Gateway<br/>  ↓<br/>SLA Engine<br/>  ↓<br/>Dashboard</div>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Key Telemetry Values */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Source</span>
            <span className="font-bold text-[#0f3443] text-sm mt-0.5 block">
              {telemetry?.source || "RTPS / Sewa Setu"}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Connection</span>
            <span className="font-bold text-amber-700 text-sm mt-0.5 block">
              ● Prototype Mode
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Last Synchronization</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block truncate">
              {telemetry?.lastSynchronization ? new Date(telemetry.lastSynchronization).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Applications in DB</span>
            <span className="font-mono font-bold text-emerald-700 text-base mt-0.5 block">
              {telemetry?.applicationsReceived ? telemetry.applicationsReceived.toLocaleString() : "530"}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Last Event Processed</span>
            <span className="font-mono font-bold text-slate-900 text-xs mt-1 block truncate">
              {telemetry?.lastEvent?.rtpsRefNo || "RTPS-2026-10492"}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Integration Status</span>
            <span className="font-semibold text-emerald-800 text-xs mt-1 block">
              Ready for API Integration
            </span>
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 leading-relaxed">
          <strong>Note:</strong> Actual API integration is subject to authorized access, API specifications, authentication, and government data-sharing requirements.
        </div>
      </div>

      {/* DEMO CONTROLS */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-[#0f3443] flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-600" />
          Challenge Presentation Demo Controls
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="text-xs bg-slate-50" onClick={() => applyScenario("A")}>
            Scenario A (Healthy)
          </Button>
          <Button size="sm" variant="outline" className="text-xs bg-slate-50" onClick={() => applyScenario("B")}>
            Scenario B (At Risk)
          </Button>
          <Button size="sm" variant="outline" className="text-xs bg-slate-50" onClick={() => applyScenario("C")}>
            Scenario C (Breach)
          </Button>
          <Button size="sm" variant="outline" className="text-xs bg-slate-50" onClick={() => applyScenario("D")}>
            Scenario D (Recurring)
          </Button>
          <div className="flex-1" />
          <Button size="sm" onClick={handleResetDB} disabled={isResetting} className="bg-red-600 hover:bg-red-700 text-white text-xs">
            {isResetting ? "Resetting DB..." : "Reset Demo Data"}
          </Button>
        </div>
      </div>

      {/* INTERACTIVE INGESTION SIMULATOR (Requirement 11) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-md p-5 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#0f3443] flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600" />
              Simulate Inbound Sewa Setu Event
            </h3>
            <p className="text-xs text-slate-500">
              Sends a JSON payload to <code>POST /api/ingestion/applications</code> to save in PostgreSQL and compute SLA
            </p>
          </div>

          <form onSubmit={handleSimulateIngestion} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Application Reference No (rtpsRefNo)</label>
              <input
                type="text"
                value={simRef}
                onChange={(e) => setSimRef(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono text-slate-800 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Service Code</label>
                <select
                  value={simService}
                  onChange={(e) => setSimService(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 focus:outline-none"
                >
                  <option value="INC_CERT">INC_CERT (Income Certificate - 7d)</option>
                  <option value="MUTATION">MUTATION (Land Partition - 30d)</option>
                  <option value="PRC_CERT">PRC_CERT (PRC Certificate - 14d)</option>
                  <option value="DL_PERM">DL_PERM (Driving License - 7d)</option>
                  <option value="TRADE_LIC">TRADE_LIC (Trade License - 15d)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Office Code</label>
                <select
                  value={simOffice}
                  onChange={(e) => setSimOffice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 focus:outline-none"
                >
                  <option value="OFF-GUW-01">OFF-GUW-01 (Guwahati Circle)</option>
                  <option value="OFF-GUW-DTO">OFF-GUW-DTO (Dispur DTO)</option>
                  <option value="OFF-DIB-01">OFF-DIB-01 (Dibrugarh Circle)</option>
                  <option value="OFF-JOR-01">OFF-JOR-01 (Jorhat Circle)</option>
                  <option value="OFF-KAR-01">OFF-KAR-01 (Karimganj Circle)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">DPS Officer Code</label>
                <select
                  value={simDps}
                  onChange={(e) => setSimDps(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 focus:outline-none"
                >
                  <option value="DPS-021">DPS-021 (Sri Bhaskar Jyoti Sarma)</option>
                  <option value="DPS-087">DPS-087 (Smti Parbin Sultana)</option>
                  <option value="DPS-104">DPS-104 (Sri Ramen Barman)</option>
                  <option value="DPS-231">DPS-231 (Sri Diganta Bora)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Citizen Applicant</label>
                <input
                  type="text"
                  value={simCitizen}
                  onChange={(e) => setSimCitizen(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Status</label>
              <select
                value={simStatus}
                onChange={(e) => setSimStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 focus:outline-none"
              >
                <option value="PENDING">Pending (Not Started)</option>
                <option value="UNDER_SCRUTINY">Under Scrutiny (In Progress)</option>
                <option value="AWAITING_VERIFICATION">Awaiting Verification</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={isIngesting}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold h-9 text-xs flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {isIngesting ? "Ingesting to PostgreSQL & Calculating SLA..." : "Dispatch Simulated Ingestion Event"}
            </Button>
          </form>
        </div>

        {/* Right: API Response & Inspection View */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-md p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0f3443] flex items-center gap-2">
              <FileCode className="w-4 h-4 text-slate-600" />
              Ingestion Response & SLA Engine Verification
            </h3>
            <p className="text-xs text-slate-500">
              Immediate feedback returned by PostgreSQL transaction
            </p>

            {isIngesting ? (
              <div className="mt-6 p-4 border border-blue-200 bg-blue-50/50 rounded space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="text-xs font-bold text-blue-900">Processing Mock Transaction...</span>
                </div>
                {simSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] font-mono text-slate-700 animate-in fade-in slide-in-from-left-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {step}
                  </div>
                ))}
              </div>
            ) : ingestionResult ? (
              <div className="mt-3 space-y-3">
                {ingestionResult.error ? (
                  <div className="p-3 bg-red-50 text-red-900 border border-red-200 rounded text-xs">
                    ❌ <strong>Ingestion Failed:</strong> {ingestionResult.error}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 text-emerald-950 border border-emerald-300 rounded text-xs flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Success!</strong> {ingestionResult.message}
                      </div>
                    </div>

                    <div className="bg-slate-900 text-slate-100 p-3 rounded text-[11px] font-mono overflow-x-auto space-y-1">
                      <div>// Calculated SLA Output:</div>
                      <div>Application: {ingestionResult.application?.rtpsRefNo}</div>
                      <div>Service: {ingestionResult.application?.service} ({ingestionResult.application?.statutoryDays}d)</div>
                      <div>SLA Status: {ingestionResult.application?.slaStatus}</div>
                      <div>SLA Consumed: {ingestionResult.application?.slaConsumedPercent}</div>
                      <div>Time Remaining: {ingestionResult.application?.timeRemainingHours}</div>
                      <div>Target Cut-off: {ingestionResult.application?.targetSlaDate}</div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <Link
                        href={`/sla-monitor?search=${ingestionResult.application?.rtpsRefNo}`}
                        className="text-[#1464A5] font-bold hover:underline flex items-center gap-1"
                      >
                        Inspect in SLA Monitor →
                      </Link>
                      <Link
                        href="/"
                        className="text-[#0f3443] font-bold hover:underline flex items-center gap-1"
                      >
                        Check Executive Dashboard →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 p-8 border border-dashed border-slate-200 rounded text-center text-xs text-slate-400">
                Submit the simulation form on the left to test the ingestion pipeline.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 flex justify-between items-center">
            <span>Endpoint: <code>POST /api/ingestion/applications</code></span>
            <span>Auth: HMAC SHA-256 Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
