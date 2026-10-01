"use client";

import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { demoDepartments, demoDistricts } from "@/lib/demo-dashboard-analytics";

type MetricOption = "compliance" | "totalApplications" | "pendingApplications" | "beyondTime";

interface Props {
  globalDepartmentFilter?: string;
  globalDistrictFilter?: string;
}

export default function DepartmentPerformanceChart({ globalDepartmentFilter = "all", globalDistrictFilter = "all" }: Props) {
  const [metric, setMetric] = useState<MetricOption>("compliance");
  const [sortBy, setSortBy] = useState<"value" | "name">("value");

  const data = useMemo(() => {
    let sorted = [...demoDepartments];
    
    // If a district is selected, deterministically modify the department stats 
    // to simulate "district-wise department data"
    if (globalDistrictFilter !== "all") {
      const district = demoDistricts.find(d => d.id === globalDistrictFilter);
      if (district) {
        // Create a pseudo-random multiplier based on district name length and compliance
        const scaler = district.compliance / 85; 
        const volumeScaler = district.totalApplications / 100000;
        
        sorted = sorted.map((dept, i) => {
          const mod = (i + district.name.length) % 3;
          const shift = mod === 0 ? 1.05 : mod === 1 ? 0.95 : 1.0;
          return {
            ...dept,
            compliance: Math.min(100, Math.round(dept.compliance * scaler * shift)),
            totalApplications: Math.max(10, Math.round(dept.totalApplications * volumeScaler * shift)),
            pendingApplications: Math.max(0, Math.round(dept.pendingApplications * volumeScaler * shift)),
            beyondTime: Math.max(0, Math.round(dept.beyondTime * volumeScaler * shift)),
          };
        });
      }
    }

    if (globalDepartmentFilter !== "all") {
      sorted = sorted.filter(d => d.id === globalDepartmentFilter);
    }
    
    if (sortBy === "value") {
      sorted.sort((a, b) => b[metric] - a[metric]);
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [metric, sortBy, globalDepartmentFilter, globalDistrictFilter]);

  const getColor = (value: number, type: MetricOption) => {
    if (type === "compliance") {
      if (value >= 90) return "#16803c"; // Green
      if (value >= 80) return "#eab308"; // Yellow
      if (value >= 70) return "#f97316"; // Orange
      return "#dc2626"; // Red
    }
    return "#3b82f6"; // Blue for other metrics
  };

  const getMetricLabel = (m: MetricOption) => {
    switch (m) {
      case "compliance": return "SLA Compliance (%)";
      case "totalApplications": return "Total Applications";
      case "pendingApplications": return "Pending Applications";
      case "beyondTime": return "Beyond Time";
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h3 className="font-semibold text-slate-800">Department Performance</h3>
          <p className="text-xs text-slate-500">Comparison across departments</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="text-xs border-slate-200 rounded-md py-1 px-2"
            value={metric}
            onChange={(e) => setMetric(e.target.value as MetricOption)}
          >
            <option value="compliance">SLA Compliance</option>
            <option value="totalApplications">Total Applications</option>
            <option value="pendingApplications">Pending Applications</option>
            <option value="beyondTime">Beyond Time</option>
          </select>
          <select 
            className="text-xs border-slate-200 rounded-md py-1 px-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "value" | "name")}
          >
            <option value="value">Sort by Value</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={metric === 'compliance' ? [0, 100] : ['auto', 'auto']} />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={150} 
              tick={{ fontSize: 11 }} 
              interval={0}
            />
            <Tooltip 
              formatter={(value: any) => [
                metric === 'compliance' ? `${value}%` : Number(value).toLocaleString(), 
                getMetricLabel(metric)
              ]}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey={metric} radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry[metric], metric)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
