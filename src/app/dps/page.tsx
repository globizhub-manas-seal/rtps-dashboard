"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockData } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Award,
  Filter,
  X,
  Search,
  ArrowUpDown,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  ChevronRight,
  MapPin,
  Building2
} from "lucide-react";

interface DPSRecord {
  id: string;
  name: string;
  designation: string;
  department: string;
  office: string;
  district: string;
  applications: number;
  compliance: number;
  avgTat: number;
  repeatDelays: number;
  score: number;
  status: "Excellent" | "Strong" | "Attention" | "Review Required";
  eligibleForCommendation?: boolean;
}

const comprehensiveDpsList: DPSRecord[] = [
  {
    id: "DPS-021",
    name: "Sri Bhaskar Jyoti Sarma",
    designation: "Circle Officer (CO)",
    department: "Revenue",
    office: "Guwahati Circle",
    district: "Kamrup Metro",
    applications: 1420,
    compliance: 99,
    avgTat: 2.8,
    repeatDelays: 0,
    score: 98,
    status: "Excellent",
    eligibleForCommendation: true,
  },
  {
    id: "DPS-087",
    name: "Smti Parbin Sultana",
    designation: "District Transport Officer (DTO)",
    department: "Transport",
    office: "DTO Kamrup Metro",
    district: "Kamrup Metro",
    applications: 980,
    compliance: 98,
    avgTat: 3.1,
    repeatDelays: 0,
    score: 96,
    status: "Strong",
    eligibleForCommendation: true,
  },
  {
    id: "DPS-112",
    name: "Dr. Hemen Hazarika",
    designation: "Medical Registrar & Superintendent",
    department: "Health",
    office: "Jorhat District Hospital",
    district: "Jorhat",
    applications: 840,
    compliance: 97,
    avgTat: 3.5,
    repeatDelays: 0,
    score: 94,
    status: "Strong",
    eligibleForCommendation: true,
  },
  {
    id: "DPS-054",
    name: "Sri Anjan Kumar Das",
    designation: "Inspector of Schools (IS)",
    department: "Education",
    office: "IS Office Dibrugarh",
    district: "Dibrugarh",
    applications: 630,
    compliance: 96,
    avgTat: 3.9,
    repeatDelays: 0,
    score: 92,
    status: "Strong",
    eligibleForCommendation: true,
  },
  {
    id: "DPS-033",
    name: "Sri Pratul Baruah",
    designation: "Circle Officer (CO)",
    department: "Revenue",
    office: "Jorhat Sadar Circle",
    district: "Jorhat",
    applications: 1120,
    compliance: 94,
    avgTat: 3.4,
    repeatDelays: 1,
    score: 93,
    status: "Strong",
    eligibleForCommendation: true,
  },
  {
    id: "DPS-045",
    name: "Sri Hiranya Goswami",
    designation: "Circle Officer (CO)",
    department: "Revenue",
    office: "Nagaon Sadar Circle",
    district: "Nagaon",
    applications: 1350,
    compliance: 93,
    avgTat: 3.5,
    repeatDelays: 2,
    score: 91,
    status: "Strong",
    eligibleForCommendation: true,
  },
  {
    id: "DPS-231",
    name: "Sri Diganta Bora",
    designation: "Executive Officer",
    department: "Urban Affairs",
    office: "Tezpur Municipal Board",
    district: "Sonitpur",
    applications: 530,
    compliance: 82,
    avgTat: 6.8,
    repeatDelays: 7,
    score: 79,
    status: "Attention",
  },
  {
    id: "DPS-104",
    name: "Sri Ramen Barman",
    designation: "Circle Officer (CO)",
    department: "Revenue",
    office: "Karimganj Circle",
    district: "Karimganj",
    applications: 642,
    compliance: 71,
    avgTat: 8.4,
    repeatDelays: 18,
    score: 72,
    status: "Review Required",
  },
  {
    id: "DPS-109",
    name: "Sri Manabendra Nath",
    designation: "Circle Officer (CO)",
    department: "Revenue",
    office: "Silchar Circle",
    district: "Cachar",
    applications: 890,
    compliance: 78,
    avgTat: 7.1,
    repeatDelays: 14,
    score: 77,
    status: "Review Required",
  },
  {
    id: "DPS-302",
    name: "Sri Rafiqul Islam",
    designation: "Municipal Secretary",
    department: "Urban Affairs",
    office: "Dhubri Municipal Cell",
    district: "Dhubri",
    applications: 410,
    compliance: 74,
    avgTat: 7.6,
    repeatDelays: 11,
    score: 75,
    status: "Review Required",
  },
  {
    id: "DPS-155",
    name: "Sri Bwhwiti Narzary",
    designation: "Circle Officer (CO)",
    department: "Revenue",
    office: "Kokrajhar Sadar Circle",
    district: "Kokrajhar",
    applications: 720,
    compliance: 86,
    avgTat: 5.4,
    repeatDelays: 5,
    score: 84,
    status: "Attention",
  },
];

function DPSPerformanceContent() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter") === "high" ? "high" : "all";

  const [filterMode, setFilterMode] = useState<string>(initialFilter);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [sortBy, setSortBy] = useState<"compliance" | "score" | "applications" | "repeat">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getScoreStyle = (score: number) => {
    if (score >= 90) return "text-[#16803c] bg-[#e8f5ec] border-[#b9e4c5]";
    if (score >= 80) return "text-[#d97706] bg-[#fef7e6] border-[#fde6a0]";
    return "text-[#C62828] bg-[#fde8e8] border-[#f5b5b5]";
  };

  // Departments list
  const departments = useMemo(() => {
    const set = new Set(comprehensiveDpsList.map((d) => d.department));
    return Array.from(set);
  }, []);

  // Districts list
  const districts = useMemo(() => {
    const set = new Set(comprehensiveDpsList.map((d) => d.district));
    return Array.from(set);
  }, []);

  // Filter & sort
  const filteredDps = useMemo(() => {
    return comprehensiveDpsList
      .filter((dps) => {
        // Mode filter
        if (filterMode === "high" && dps.score < 90) return false;
        if (filterMode === "review" && dps.score >= 80) return false;

        // Search
        const matchesSearch =
          dps.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dps.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dps.office.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dps.district.toLowerCase().includes(searchTerm.toLowerCase());

        // Dropdowns
        const matchesDept = selectedDept === "all" || dps.department === selectedDept;
        const matchesDistrict = selectedDistrict === "all" || dps.district === selectedDistrict;

        return matchesSearch && matchesDept && matchesDistrict;
      })
      .sort((a, b) => {
        let valA: number = a.score;
        let valB: number = b.score;
        if (sortBy === "compliance") {
          valA = a.compliance;
          valB = b.compliance;
        } else if (sortBy === "applications") {
          valA = a.applications;
          valB = b.applications;
        } else if (sortBy === "repeat") {
          valA = a.repeatDelays;
          valB = b.repeatDelays;
        } else if (sortBy === "score") {
          valA = a.score;
          valB = b.score;
        }
        if (sortOrder === "asc") return valA - valB;
        return valB - valA;
      });
  }, [filterMode, searchTerm, selectedDept, selectedDistrict, sortBy, sortOrder]);

  const totalDpsCount = comprehensiveDpsList.length;
  const highPerformerCount = comprehensiveDpsList.filter((d) => d.score >= 90).length;
  const reviewCount = comprehensiveDpsList.filter((d) => d.score < 80).length;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-5">
      <PageHeader
        title="DPS Performance Intelligence"
        subtitle="Continuous monitoring of Designated Public Servants (DPS) under the Assam Right to Public Services Act, 2012"
      >
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={filterMode === "all" ? "default" : "outline"}
            className={filterMode === "all" ? "bg-[#0f3443] text-white text-xs" : "text-xs bg-white text-slate-700 border-slate-300"}
            onClick={() => setFilterMode("all")}
          >
            All Officers ({totalDpsCount})
          </Button>
          <Button
            size="sm"
            variant={filterMode === "high" ? "default" : "outline"}
            className={filterMode === "high" ? "bg-[#16803c] text-white text-xs" : "text-xs bg-white text-[#16803c] border-green-300 hover:bg-green-50"}
            onClick={() => setFilterMode("high")}
          >
            <Award className="w-3.5 h-3.5 mr-1" />
            High Performers ({highPerformerCount})
          </Button>
          <Button
            size="sm"
            variant={filterMode === "review" ? "default" : "outline"}
            className={filterMode === "review" ? "bg-[#c62828] text-white text-xs" : "text-xs bg-white text-red-700 border-red-300 hover:bg-red-50"}
            onClick={() => setFilterMode("review")}
          >
            <ShieldAlert className="w-3.5 h-3.5 mr-1" />
            Review Required ({reviewCount})
          </Button>
        </div>
      </PageHeader>

      {/* Operational Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Monitored Officers</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">{totalDpsCount}</span>
            <span className="text-[11px] text-slate-500">Designated DPS</span>
          </div>
        </div>

        <div className="bg-white border border-green-200 bg-green-50/20 rounded-md p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold text-green-800 uppercase tracking-wider">Commendation Candidates</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#16803c]">{highPerformerCount}</span>
            <span className="text-[11px] text-green-700 font-medium">&gt;90% SLA Adherence</span>
          </div>
        </div>

        <div className="bg-white border border-red-200 bg-red-50/25 rounded-md p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold text-red-800 uppercase tracking-wider">Review Cases Active</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#C62828]">{reviewCount}</span>
            <span className="text-[11px] text-red-700 font-medium">&lt;80% SLA Threshold</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Zero-Delay Officers</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#1464A5]">
              {comprehensiveDpsList.filter((d) => d.repeatDelays === 0).length}
            </span>
            <span className="text-[11px] text-slate-500">Clean delivery record</span>
          </div>
        </div>
      </div>

      {/* Drilldown Banner if active */}
      {filterMode === "high" && (
        <div className="bg-[#e8f5ec] border border-[#b9e4c5] p-3 rounded flex items-center justify-between gap-3 text-xs text-[#16803c]">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#16803c] flex-shrink-0" />
            <span>
              <strong>Drilldown Mode:</strong> Displaying consistently high-performing Designated Public Servants eligible for annual ARTPS commendation citations.
            </span>
          </div>
          <button
            onClick={() => setFilterMode("all")}
            className="flex items-center gap-1 font-semibold text-green-900 bg-green-200/60 px-2 py-0.5 rounded hover:bg-green-300"
          >
            Reset <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {filterMode === "review" && (
        <div className="bg-[#fde8e8] border border-[#f5b5b5] p-3 rounded flex items-center justify-between gap-3 text-xs text-[#C62828]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#C62828] flex-shrink-0" />
            <span>
              <strong>Administrative Attention Mode:</strong> Displaying officers falling below statutory SLA thresholds (&lt;80%) or recording repeated procedural delays.
            </span>
          </div>
          <button
            onClick={() => setFilterMode("all")}
            className="flex items-center gap-1 font-semibold text-red-900 bg-red-200/60 px-2 py-0.5 rounded hover:bg-red-300"
          >
            Reset <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-md p-3 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Officer Name, DPS ID (e.g. DPS-021), Circle, or District..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50/50 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1464A5] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Department */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1464A5]"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* District */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1464A5]"
          >
            <option value="all">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1464A5]"
          >
            <option value="score">Sort: Index Score</option>
            <option value="compliance">Sort: SLA Compliance %</option>
            <option value="applications">Sort: Caseload Volume</option>
            <option value="repeat">Sort: Repeat Delays</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-1.5 text-xs bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-600"
            title={`Switch to ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main DPS Table */}
      <div className="border border-slate-200 rounded-md bg-white shadow-2xs overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#EEF6FA] hover:bg-[#EEF6FA]">
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider py-3">DPS ID & Officer Name</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">Department</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">Circle Office & District</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Applications</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">SLA Compliance</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Avg TAT</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Repeat Delays</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-center">Score</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[#123B4A] text-xs font-semibold uppercase tracking-wider text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDps.map((dps) => (
              <TableRow key={dps.id} className="hover:bg-[#F7F9FB] transition-colors border-b border-slate-100">
                <TableCell className="py-2.5">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#1464A5] font-mono leading-tight">{dps.id}</span>
                    <span className="text-xs font-bold text-slate-900">{dps.name}</span>
                    <span className="text-[10px] text-slate-500">{dps.designation}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-slate-700 font-medium">{dps.department}</TableCell>
                <TableCell className="text-xs text-slate-600">
                  <div className="flex flex-col">
                    <span>{dps.office}</span>
                    <span className="text-[10px] text-slate-400">{dps.district} District</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-right text-slate-900 font-mono font-medium">
                  {dps.applications.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs text-right font-mono font-bold">
                  <div className="flex flex-col items-end">
                    <span
                      className={
                        dps.compliance >= 90
                          ? "text-[#16803c]"
                          : dps.compliance < 75
                          ? "text-[#C62828]"
                          : "text-[#d97706]"
                      }
                    >
                      {dps.compliance}%
                    </span>
                    <div className="w-14 bg-slate-100 rounded-full h-1 mt-0.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          dps.compliance >= 90
                            ? "bg-[#16803c]"
                            : dps.compliance < 75
                            ? "bg-[#C62828]"
                            : "bg-[#d97706]"
                        }`}
                        style={{ width: `${dps.compliance}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-right text-slate-600 font-mono">{dps.avgTat} days</TableCell>
                <TableCell className="text-xs text-right">
                  {dps.repeatDelays > 0 ? (
                    <span
                      className={`inline-flex items-center gap-1 font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        dps.repeatDelays > 10
                          ? "text-[#C62828] bg-red-50 border border-red-200"
                          : "text-[#d97706] bg-amber-50 border border-amber-200"
                      }`}
                    >
                      <AlertTriangle className="w-2.5 h-2.5" />
                      {dps.repeatDelays} cases
                    </span>
                  ) : (
                    <span className="text-[#16803c] font-semibold text-xs font-mono">0 (Zero)</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`inline-flex items-center justify-center w-9 h-6 text-xs font-bold border rounded font-mono ${getScoreStyle(
                      dps.score
                    )}`}
                  >
                    {dps.score}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={dps.status} compact />
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/dps/${dps.id}`}
                    className="inline-flex items-center px-2 py-1 text-xs bg-white text-[#1464A5] border border-[#1464A5]/30 hover:bg-[#EEF6FA] font-semibold rounded transition-colors"
                  >
                    Dossier <ChevronRight className="w-3 h-3 ml-0.5" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function DPSPerformance() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading DPS Performance...</div>}>
      <DPSPerformanceContent />
    </Suspense>
  );
}
