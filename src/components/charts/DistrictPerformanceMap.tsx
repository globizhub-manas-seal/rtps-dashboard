"use client";

import React, { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { demoDistricts } from "@/lib/demo-dashboard-analytics";
import { Info, MapPin } from "lucide-react";

interface Props {
  globalDistrictFilter?: string;
  onDistrictSelect?: (id: string) => void;
}

export default function DistrictPerformanceMap({ globalDistrictFilter = "all", onDistrictSelect }: Props) {
  const [localDistrictId, setLocalDistrictId] = useState<string>("all");
  const selectedDistrictId = globalDistrictFilter !== "all" ? globalDistrictFilter : localDistrictId;
  const [hoveredDistrict, setHoveredDistrict] = useState<any>(null);

  const handleSelect = (id: string) => {
    setLocalDistrictId(id);
    if (onDistrictSelect) onDistrictSelect(id);
  };

  const getDistrictFill = (districtName: string) => {
    // Attempt to match with our demoDistricts
    const match = demoDistricts.find(d => d.name.toLowerCase() === districtName.toLowerCase());
    
    // If we have selected a specific district, grey out others
    if (selectedDistrictId !== "all" && match?.id !== selectedDistrictId) {
      return "#e2e8f0"; // slate-200
    }

    if (!match) return "#f1f5f9"; // Default grey for missing data
    
    const c = match.compliance;
    if (c >= 95) return "#16803c";
    if (c >= 85) return "#eab308";
    if (c >= 70) return "#f97316";
    return "#dc2626";
  };

  // Build a lookup for clicks
  const districtLookup = useMemo(() => {
    const map = new Map();
    // Also add aliases for known mismatches if any
    demoDistricts.forEach(d => {
      map.set(d.name.toLowerCase(), d);
      if (d.name === "Kamrup Metropolitan") map.set("kamrup metropolitan", d);
    });
    return map;
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full relative">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
        <div>
          <h3 className="font-semibold text-slate-800">District Heatmap</h3>
          <p className="text-xs text-slate-500">SLA compliance by geography</p>
        </div>
      </div>
      
      <div className="flex-1 relative flex items-center justify-center bg-white border border-slate-100 rounded-lg overflow-hidden min-h-[350px]">
        
        {/* Legend */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-md shadow-xs border border-slate-200">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600"><div className="w-3 h-3 rounded-sm bg-[#16803c]"></div> ≥ 95%</div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600"><div className="w-3 h-3 rounded-sm bg-[#eab308]"></div> 85–94%</div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600"><div className="w-3 h-3 rounded-sm bg-[#f97316]"></div> 70–84%</div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600"><div className="w-3 h-3 rounded-sm bg-[#dc2626]"></div> &lt; 70%</div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400"><div className="w-3 h-3 rounded-sm bg-[#f1f5f9] border border-slate-200"></div> No Data</div>
        </div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 7500,
            center: [92.9, 26.2] // Center of Assam
          }}
          className="w-full h-full object-contain"
        >
          <Geographies geography="/assam_districts.geojson">
            {({ geographies }) =>
              geographies.map((geo) => {
                const districtName = geo.properties?.NAME_2 || "";
                const match = districtLookup.get(districtName.toLowerCase());
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getDistrictFill(districtName)}
                    stroke="#ffffff"
                    strokeWidth={0.8}
                    style={{
                      default: { outline: "none", transition: "all 250ms" },
                      hover: { outline: "none", opacity: 0.8, cursor: match ? "pointer" : "default" },
                      pressed: { outline: "none" },
                    } as any}
                    onMouseEnter={() => {
                      if (match) {
                        setHoveredDistrict(match);
                      } else {
                        setHoveredDistrict({ name: districtName, noData: true });
                      }
                    }}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    onClick={() => {
                      if (match) {
                        handleSelect(match.id === selectedDistrictId ? "all" : match.id);
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {hoveredDistrict && (
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border border-slate-200 min-w-[150px] z-10 pointer-events-none transition-opacity">
            <h4 className="font-bold text-sm flex items-center gap-1.5 text-slate-800">
              <MapPin className="w-4 h-4 text-blue-600" />
              {hoveredDistrict.name}
            </h4>
            
            {hoveredDistrict.noData ? (
              <p className="text-xs text-slate-500 mt-1 italic">No demo data available</p>
            ) : (
              <div className="mt-2 space-y-1 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Compliance:</span>
                  <span className="font-bold text-slate-800">{hoveredDistrict.compliance}%</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Apps:</span>
                  <span className="font-medium text-slate-700">{hoveredDistrict.totalApplications.toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Breaches:</span>
                  <span className="font-medium text-red-600">{hoveredDistrict.beyondTime.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
