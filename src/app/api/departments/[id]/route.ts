export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeOfficeMetrics } from "@/lib/sla-engine";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        offices: {
          include: {
            district: { select: { name: true } },
            department: { select: { name: true } },
            applications: {
              select: {
                id: true,
                slaStatus: true,
                daysTaken: true,
                delayReason: true,
              },
            },
          },
        },
      },
    });

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    let deptApps = 0;
    let deptBreaches = 0;
    let deptAtRisk = 0;
    let deptRepeatDelays = 0;
    let deptTatSum = 0;
    let completedCount = 0;

    department.offices.forEach((office) => {
      deptApps += office.applications.length;
      office.applications.forEach((a) => {
        if (a.slaStatus === "BREACHED") deptBreaches++;
        if (a.slaStatus === "AT_RISK" || a.slaStatus === "CRITICAL") deptAtRisk++;
        if (a.delayReason !== null || a.slaStatus === "BREACHED") deptRepeatDelays++;
        
        if (a.daysTaken !== null) {
          deptTatSum += a.daysTaken;
          completedCount++;
        }
      });
    });

    const compliance = deptApps > 0 ? Math.round(((deptApps - deptBreaches) / deptApps) * 1000) / 10 : 100;
    const avgTat = completedCount > 0 ? Math.round((deptTatSum / completedCount) * 10) / 10 : 0;

    let score = Math.round(compliance * 0.7 + Math.max(0, 10 - avgTat) * 2 - Math.min(20, deptRepeatDelays * 0.1));
    score = Math.max(20, Math.min(100, score));

    let status = "Satisfactory";
    if (score >= 90) status = "Excellent";
    else if (score < 70) status = "Critical";
    else if (score < 80) status = "Attention Required";

    const departmentMetrics = {
      id: department.id,
      code: department.code,
      name: department.name,
      nodalOfficer: department.nodalOfficer,
      totalOffices: department.offices.length,
      totalApplications: deptApps,
      slaCompliance: compliance,
      averageTat: avgTat,
      breached: deptBreaches,
      atRisk: deptAtRisk,
      repeatDelays: deptRepeatDelays,
      performanceScore: score,
      status
    };

    // Calculate metrics for all offices in this department
    const officeMetrics = department.offices.map((office) => computeOfficeMetrics(office));
    officeMetrics.sort((a, b) => a.performanceScore - b.performanceScore); // Worst offices first

    return NextResponse.json({
      department: departmentMetrics,
      offices: officeMetrics,
    });
  } catch (error: any) {
    console.error(`GET /api/departments/[id] error:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
