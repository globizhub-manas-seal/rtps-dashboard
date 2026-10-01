"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Globe,
  Landmark,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  TrendingUp
} from "lucide-react";
import { GovernmentLogo } from "@/components/branding/GovernmentLogo";
import { Pagination } from "@/components/ui/pagination";

interface DepartmentAgg {
  id: string;
  name: string;
  totalApplications: number;
  slaCompliance: number;
  averageTat: number;
}

export default function PublicPerformanceDashboard() {
  const [departments, setDepartments] = useState<DepartmentAgg[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function fetchPublicData() {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
        setDepartments(data.departments);
      } catch (err) {
        console.error("Failed to load public data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPublicData();
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#1464A5]" />
        <p className="text-sm font-medium text-slate-500">Loading Assam RTPS Public Performance Data...</p>
      </div>
    );
  }

  const totalApps = departments.reduce((sum, d) => sum + d.totalApplications, 0);
  const avgSla = departments.length > 0
    ? departments.reduce((sum, d) => sum + d.slaCompliance, 0) / departments.length
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Public Header (independent of admin header) */}
      <div className="bg-white border-b border-slate-200 py-4 px-6 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <GovernmentLogo variant="standalone" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200">
            <Globe className="w-3.5 h-3.5" />
            Public Transparency Portal
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-3xl font-bold text-[#0f3443] tracking-tight">Assam RTPS Service Performance</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Real-time public tracking of citizen service delivery timelines under the Assam Right to Public Services Act, 2012.
          </p>
        </div>

        {/* Top Aggregates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-slate-900 font-mono">{totalApps.toLocaleString()}</span>
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider mt-1">Total Applications</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="p-3 bg-green-50 text-green-600 rounded-full mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-green-600 font-mono">{avgSla.toFixed(1)}%</span>
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider mt-1">Overall SLA Compliance</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-full mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-900 font-mono">
                {departments.length > 0 ? (departments.reduce((sum, d) => sum + d.averageTat, 0) / departments.length).toFixed(1) : 0}
              </span>
              <span className="text-sm font-semibold text-slate-500">days</span>
            </div>
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider mt-1">Average Processing Time</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-slate-900 font-mono">15</span>
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider mt-1">Services Monitored</span>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#1464A5]" />
              Department-wise Performance
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Aggregated delivery metrics across all subordinate offices. Personal citizen data and internal officer records are kept confidential.
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-600 font-bold uppercase tracking-wider text-xs">Department</TableHead>
                  <TableHead className="text-slate-600 font-bold uppercase tracking-wider text-xs text-right">Total Requests</TableHead>
                  <TableHead className="text-slate-600 font-bold uppercase tracking-wider text-xs text-right">SLA Compliance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  const totalPages = Math.max(1, Math.ceil(departments.length / pageSize));
                  const paginatedDepts = departments.slice((currentPage - 1) * pageSize, currentPage * pageSize);
                  return paginatedDepts.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-semibold text-slate-900">{dept.name}</TableCell>
                      <TableCell className="text-right font-mono text-slate-600">{dept.totalApplications.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className={`h-full ${dept.slaCompliance >= 90 ? 'bg-green-500' : dept.slaCompliance >= 80 ? 'bg-blue-500' : 'bg-red-500'}`}
                              style={{ width: `${dept.slaCompliance}%` }}
                            />
                          </div>
                          <span className={`font-mono font-bold ${
                            dept.slaCompliance >= 90 ? "text-green-700" :
                            dept.slaCompliance >= 80 ? "text-blue-700" : "text-red-600"
                          }`}>
                            {dept.slaCompliance.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ));
                })()}
              </TableBody>
            </Table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(departments.length / pageSize))}
            totalItems={departments.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>

        <div className="text-center pb-12">
          <p className="text-xs text-slate-400 font-mono">
            Data sourced directly from active PostgreSQL RTPS ledger • Refreshed hourly
          </p>
        </div>
      </div>
    </div>
  );
}
