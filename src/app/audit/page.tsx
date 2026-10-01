"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ShieldCheck,
  Search,
  Filter,
  FileText,
  Clock,
  User,
  Activity,
  Loader2,
  RefreshCw,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

interface AuditLog {
  id: string;
  action: string;
  actorRole: string;
  targetEntity: string;
  targetId: string | null;
  details: string;
  createdAt: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/audit");
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.targetEntity.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="System Audit & Action Logs"
        subtitle="Immutable ledger of administrative actions, configuration changes, and compliance reviews."
      >
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchLogs}
            variant="outline"
            size="sm"
            className="text-xs font-semibold text-[#0f3443] shadow-2xs h-8"
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Logs
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-xs font-semibold shadow-2xs h-8"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </PageHeader>

      <div className="bg-white border border-slate-200 rounded-md shadow-2xs p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search actions or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <span className="text-xs font-semibold text-slate-600">Tamper-Evident Ledger Active</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#1464A5]" />
            <p className="text-sm font-medium">Fetching secure audit logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-medium">No audit logs found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#EEF6FA] hover:bg-[#EEF6FA]">
                  <TableHead className="text-[#123B4A] text-[11px] font-semibold uppercase tracking-wider w-[180px]">Timestamp</TableHead>
                  <TableHead className="text-[#123B4A] text-[11px] font-semibold uppercase tracking-wider">Action</TableHead>
                  <TableHead className="text-[#123B4A] text-[11px] font-semibold uppercase tracking-wider">Actor</TableHead>
                  <TableHead className="text-[#123B4A] text-[11px] font-semibold uppercase tracking-wider">Target Entity</TableHead>
                  <TableHead className="text-[#123B4A] text-[11px] font-semibold uppercase tracking-wider">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => {
                  const d = new Date(log.createdAt);
                  return (
                    <TableRow key={log.id} className="border-b border-slate-100 hover:bg-[#F7F9FB]">
                      <TableCell className="text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{d.toLocaleDateString('en-IN')} {d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Activity className="w-3 h-3" />
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-xs font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                          <User className="w-3 h-3" />
                          {log.actorRole}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold text-slate-700">{log.targetEntity}</span>
                        {log.targetId && <div className="text-[10px] text-slate-400 font-mono mt-0.5">{log.targetId.substring(0, 8)}...</div>}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 leading-relaxed max-w-md">
                        {log.details}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredLogs.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
