"use client";

import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { demoDepartments, demoDistricts } from "@/lib/demo-dashboard-analytics";

interface Props {
  globalDepartmentFilter?: string;
  globalDistrictFilter?: string;
}

export default function PendingBreakdownChart({ globalDepartmentFilter = "all", globalDistrictFilter = "all" }: Props) {
  const [sortBy, setSortBy] = useState<"total" | "beyondTime">("total");

  const data = useMemo(() => {
    let filtered = demoDepartments;

    if (globalDistrictFilter !== "all") {
      const district = demoDistricts.find(d => d.id === globalDistrictFilter);
      if (district) {
        const scaler = district.compliance / 85; 
        const volumeScaler = district.totalApplications / 100000;
        
        filtered = filtered.map((dept, i) => {
          const mod = (i + district.name.length) % 3;
          const shift = mod === 0 ? 1.05 : mod === 1 ? 0.95 : 1.0;
          return {
            ...dept,
            compliance: Math.min(100, Math.round(dept.compliance * scaler * shift)),
            totalApplications: Math.max(10, Math.round(dept.totalApplications * volumeScaler * shift)),
            pendingApplications: Math.max(0, Math.round(dept.pendingApplications * volumeScaler * shift)),
            beyondTime: Math.max(0, Math.round(dept.beyondTime * volumeScaler * shift)),
            pendingAtApplicant: Math.max(0, Math.round(dept.pendingAtApplicant * volumeScaler * shift))
          };
        });
      }
    }

    if (globalDepartmentFilter !== "all") {
      filtered = filtered.filter(d => d.id === globalDepartmentFilter);
    }
    
    return filtered.map(dept => {
      // Calculate pending at office (within time)
      const pendingAtOfficeWithinTime = Math.max(0, dept.pendingApplications - dept.beyondTime);
      return {
        name: dept.name,
        shortName: dept.name.length > 15 ? dept.name.substring(0, 15) + "..." : dept.name,
        totalPending: dept.pendingApplications + dept.pendingAtApplicant, // Assuming total is sum of all pending
        pendingAtOffice: pendingAtOfficeWithinTime,
        beyondTime: dept.beyondTime,
        pendingAtApplicant: dept.pendingAtApplicant
      };
    }).sort((a, b) => {
      if (sortBy === "total") return b.totalPending - a.totalPending;
      return b.beyondTime - a.beyondTime;
    });
  }, [sortBy, globalDepartmentFilter, globalDistrictFilter]);

  const totalPending = data.reduce((sum, item) => sum + item.totalPending, 0);
  const totalBeyondTime = data.reduce((sum, item) => sum + item.beyondTime, 0);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
        <div>
          <h3 className="font-semibold text-slate-800">Pending Breakdown</h3>
          <p className="text-xs text-slate-500">Status by department</p>
          <div className="flex items-center gap-4 mt-2">
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-400">Total Pending</p>
              <p className="text-lg font-bold text-slate-800">{totalPending.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-400">Beyond Time</p>
              <p className="text-lg font-bold text-red-600">{totalBeyondTime.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="text-xs border-slate-200 rounded-md py-1 px-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "total" | "beyondTime")}
          >
            <option value="total">Sort by Total Pending</option>
            <option value="beyondTime">Sort by Beyond Time</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="shortName" 
              tick={{ fontSize: 10 }} 
              angle={-45} 
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Bar dataKey="pendingAtOffice" name="Pending at Office" stackId="a" fill="#3b82f6" />
            <Bar dataKey="pendingAtApplicant" name="Pending at Applicant" stackId="a" fill="#eab308" />
            <Bar dataKey="beyondTime" name="Pending Beyond Time" stackId="a" fill="#dc2626" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
