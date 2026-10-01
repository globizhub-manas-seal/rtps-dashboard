"use client";

import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { demoMonthlyTrends } from "@/lib/demo-dashboard-analytics";

type TrendMetric = "compliance" | "avgTat" | "breaches";

interface Props {
  periodFilter?: string;
}

export default function SlaComplianceTrendChart({ periodFilter = "6m" }: Props) {
  const [metric, setMetric] = useState<TrendMetric>("compliance");

  const getMetricDetails = (m: TrendMetric) => {
    switch (m) {
      case "compliance": 
        return { name: "SLA Compliance", unit: "%", domain: [0, 100], color: "#16803c" };
      case "avgTat": 
        return { name: "Avg Turnaround Time", unit: " days", domain: ['auto', 'auto'], color: "#3b82f6" };
      case "breaches": 
        return { name: "Breached Applications", unit: "", domain: ['auto', 'auto'], color: "#dc2626" };
    }
  };

  const details = getMetricDetails(metric);

  // Filter trends based on period
  const trendData = [...demoMonthlyTrends].slice(
    periodFilter === "1m" ? -1 : periodFilter === "3m" ? -3 : 0
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h3 className="font-semibold text-slate-800">Six-Month Trend</h3>
          <p className="text-xs text-slate-500">Historical performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="text-xs border-slate-200 rounded-md py-1 px-2"
            value={metric}
            onChange={(e) => setMetric(e.target.value as TrendMetric)}
          >
            <option value="compliance">SLA Compliance (%)</option>
            <option value="avgTat">Average Turnaround Time (Days)</option>
            <option value="breaches">Breached Applications</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis 
              domain={details.domain as any} 
              tick={{ fontSize: 11 }}
            />
            <Tooltip 
              formatter={(value: any) => [`${value}${details.unit}`, details.name]}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Line 
              type="monotone" 
              dataKey={metric} 
              name={details.name}
              stroke={details.color} 
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-slate-400 text-center mt-2 italic">
        * Note: Trend is illustrative and not calculated from historical live RTPS data.
      </p>
    </div>
  );
}
