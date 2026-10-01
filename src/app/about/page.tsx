"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { CheckCircle2, ArrowDown, Shield, FileText, Database, Cpu, BarChart2, BellRing, UserCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPlatform() {
  const capabilities = [
    { title: "Monitor SLA compliance", desc: "Continuous real-time calculation of service delivery turnaround times against statutory ARTPS timelines." },
    { title: "Identify applications approaching breach", desc: "Proactive early-warning alerts for applications due within 24–48 hours before statutory penalties occur." },
    { title: "Detect recurring delays", desc: "Algorithmic detection of systemic bottlenecks versus individual workload constraints across circles and sub-divisions." },
    { title: "Support administrative review", desc: "Evidence-backed dossier compilation for appellate authorities to initiate explanations and show-cause proceedings." },
    { title: "Identify consistent high performers", desc: "Objective scoring of Designated Public Servants (DPS) maintaining >95% compliance with zero repeat breaches." },
    { title: "Support recognition processes", desc: "Official commendation workflow and citation issuance aligned with state administrative governance awards." },
  ];

  const dataFlow = [
    { step: "01", title: "RTPS Transaction Data", desc: "Direct transaction feed from Sewa Setu portal: citizen applications, acknowledgment timestamps, and stage transitions.", icon: <Database className="w-5 h-5 text-[#1464A5]" /> },
    { step: "02", title: "SLA Monitoring Engine", desc: "Automated verification against statutory rules (e.g., 15 days for Income Certificate, 30 days for Land Mutation).", icon: <Cpu className="w-5 h-5 text-[#1464A5]" /> },
    { step: "03", title: "Performance Analytics", desc: "Multi-level aggregation across State, Department, District, Circle Office, and individual DPS levels.", icon: <BarChart2 className="w-5 h-5 text-[#1464A5]" /> },
    { step: "04", title: "Alerts & Insights", desc: "Classification into On Track, At Risk (<24h), Critical, and Breached, with workload vs. SLA quadrant analysis.", icon: <BellRing className="w-5 h-5 text-[#1464A5]" /> },
    { step: "05", title: "Administrative Review", desc: "Formal appellate dockets, explanation requisition notices, and state excellence commendations.", icon: <UserCheck className="w-5 h-5 text-[#16803c]" /> },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto space-y-8">
      <PageHeader
        title="About RTPS Performance Intelligence"
        subtitle="Proposed Continuous Service Delivery Monitoring Platform for the Assam RTPS Ecosystem"
      >
        <span className="px-3 py-1 bg-amber-500/10 text-amber-800 border border-amber-300 rounded text-xs font-bold uppercase tracking-wider">
          Concept Proposal
        </span>
      </PageHeader>

      {/* Official Identity & Purpose Hero */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1464A5] bg-[#eef6fa] px-2.5 py-0.5 rounded">
                Executive Overview
              </span>
              <span className="text-xs text-slate-500">• Assam Right to Public Services Act (ARTPS) 2012</span>
            </div>
            <h2 className="text-2xl font-bold text-[#0f3443]">
              Purpose of the Platform
            </h2>
            <p className="text-base text-slate-700 leading-relaxed max-w-3xl">
              To provide <strong>continuous, data-driven visibility</strong> into RTPS service delivery performance across departments, administrative districts, circle offices, and Designated Public Servants (DPS).
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#f7f9fb] p-3 rounded-md border border-slate-200 flex-shrink-0">
            <div className="w-12 h-12 relative flex-shrink-0">
              <Image
                src="/logo/assam-gov-logo.png"
                alt="Gov of Assam"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-px h-8 bg-slate-300" />
            <div className="w-10 h-10 relative flex-shrink-0 bg-white p-0.5 rounded border border-slate-200">
              <Image
                src="/logo/sewa-setu.png"
                alt="Sewa Setu"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* 6 Core Capabilities */}
        <div className="pt-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
            How The Platform Helps Administrative Authorities:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-md border border-slate-200 bg-[#fafbfc] hover:border-[#1464A5]/40 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#16803c] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0f3443] mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Proposed Data Flow */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1464A5] bg-[#eef6fa] px-2.5 py-0.5 rounded">
            Architecture
          </span>
          <h2 className="text-xl font-bold text-[#0f3443] mt-2">
            Proposed End-to-End Data Flow
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            How raw transaction logs transform into timely administrative action and recognition.
          </p>
        </div>

        {/* Flow Visual */}
        <div className="space-y-3">
          {dataFlow.map((flow, i) => (
            <React.Fragment key={flow.step}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-md border border-slate-200 bg-[#fafbfc] hover:bg-white hover:border-[#1464A5]/50 transition-all">
                <div className="flex items-start sm:items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#eef6fa] border border-[#1464A5]/30 text-[#1464A5] font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {flow.step}
                  </span>
                  <div className="p-2 rounded bg-white border border-slate-200 shadow-xs flex-shrink-0 hidden sm:block">
                    {flow.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f3443]">{flow.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{flow.desc}</p>
                  </div>
                </div>
                <span className="mt-2 sm:mt-0 text-[10px] uppercase font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Phase {flow.step}
                </span>
              </div>
              {i < dataFlow.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown className="w-4 h-4 text-[#1464A5] animate-bounce" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Administrative Hierarchy */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-[#0f3443] mb-2">
          Administrative Hierarchy Model
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-6">
          The system reflects the authentic Assam governance hierarchy for granular performance attribution:
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-4 bg-[#fafbfc] rounded border border-slate-200 text-xs font-bold text-[#0f3443]">
          <span className="px-3 py-1.5 bg-white border border-slate-300 rounded shadow-xs">1. State (Assam)</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1.5 bg-white border border-slate-300 rounded shadow-xs">2. Department</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1.5 bg-white border border-slate-300 rounded shadow-xs">3. District</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1.5 bg-white border border-slate-300 rounded shadow-xs">4. Circle Office</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1.5 bg-white border border-slate-300 rounded shadow-xs">5. Designated Public Servant (DPS)</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1.5 bg-[#e8f1f8] border border-[#1464A5]/40 text-[#1464A5] rounded shadow-xs">6. Citizen Application</span>
        </div>
      </div>

      {/* Prototype Notice Banner */}
      <div className="bg-[#fff9ed] border border-amber-300/80 rounded-md p-5 flex items-start gap-3 text-amber-900">
        <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed space-y-1">
          <p className="font-bold uppercase tracking-wider text-amber-800">
            PROTOTYPE DEMONSTRATION DISCLOSURE
          </p>
          <p>
            This software prototype is a conceptual proposal demonstrating continuous monitoring capabilities for the Assam Right to Public Services ecosystem. All metrics, officer names, and transaction IDs displayed are synthetic test data prepared for demonstration purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
