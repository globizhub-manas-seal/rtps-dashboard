"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Info } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { demoDistricts, demoDepartments } from "@/lib/demo-dashboard-analytics";

const DistrictPerformanceMap = dynamic(() => import("@/components/charts/DistrictPerformanceMap"), { ssr: false, loading: () => <div className="h-[300px] bg-slate-50 animate-pulse rounded-lg border border-slate-200"></div> });
const DepartmentPerformanceChart = dynamic(() => import("@/components/charts/DepartmentPerformanceChart"), { ssr: false, loading: () => <div className="h-[300px] bg-slate-50 animate-pulse rounded-lg border border-slate-200"></div> });
const PendingBreakdownChart = dynamic(() => import("@/components/charts/PendingBreakdownChart"), { ssr: false, loading: () => <div className="h-[300px] bg-slate-50 animate-pulse rounded-lg border border-slate-200"></div> });
const SlaComplianceTrendChart = dynamic(() => import("@/components/charts/SlaComplianceTrendChart"), { ssr: false, loading: () => <div className="h-[300px] bg-slate-50 animate-pulse rounded-lg border border-slate-200"></div> });

export default function VisualAnalyticsSection() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("6m");

  const resetFilters = () => {
    setSelectedDistrict("all");
    setSelectedDepartment("all");
    setSelectedPeriod("6m");
  };

  return (
    <div className="mt-8 space-y-5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <SectionHeader
          title="Visual Analytics (Synthetic Data)"
          subtitle="Interactive visualizations using illustrative demonstration data"
        />
        
        {/* Global Filters for the Analytics Section */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 border border-slate-200 rounded-md shadow-sm">
          <select 
            className="text-xs border border-slate-200 rounded-md py-1.5 px-2 bg-slate-50 text-slate-700 font-medium"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="all">All Districts</option>
            {demoDistricts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          
          <select 
            className="text-xs border border-slate-200 rounded-md py-1.5 px-2 bg-slate-50 text-slate-700 font-medium max-w-[150px] truncate"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            {demoDepartments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select 
            className="text-xs border border-slate-200 rounded-md py-1.5 px-2 bg-slate-50 text-slate-700 font-medium"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="6m">Last 6 Months</option>
            <option value="3m">Last 3 Months</option>
            <option value="1m">Last Month</option>
          </select>

          <button 
            onClick={resetFilters}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="bg-blue-50/50 border border-blue-200 rounded-md p-3.5 flex gap-2 items-start text-xs text-blue-900 shadow-sm">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#1464A5]" />
        <p className="leading-relaxed">
          <strong className="text-[#0f3443] mr-1">DEMO ANALYTICS · SYNTHETIC DATA:</strong> 
          Visual analytics shown here use synthetic demonstration data to illustrate the proposed RTPS performance monitoring workflow. Actual reporting will depend on authorized and validated RTPS/Sewa Setu data access.
        </p>
      </div>

      {/* Grid Layout for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DistrictPerformanceMap globalDistrictFilter={selectedDistrict} onDistrictSelect={setSelectedDistrict} />
        <DepartmentPerformanceChart globalDepartmentFilter={selectedDepartment} globalDistrictFilter={selectedDistrict} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PendingBreakdownChart globalDepartmentFilter={selectedDepartment} globalDistrictFilter={selectedDistrict} />
        <SlaComplianceTrendChart periodFilter={selectedPeriod} />
      </div>
    </div>
  );
}
