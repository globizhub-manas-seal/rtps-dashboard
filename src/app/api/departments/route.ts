export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const departments = await prisma.department.findMany({
      include: {
        offices: {
          include: {
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
      orderBy: { name: "asc" }
    });

    const evaluatedDepartments = departments.map((dept) => {
      let deptApps = 0;
      let deptBreaches = 0;
      let deptAtRisk = 0;
      let deptRepeatDelays = 0;
      let deptTatSum = 0;
      let completedCount = 0;

      dept.offices.forEach((office) => {
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

      return {
        id: dept.id,
        code: dept.code,
        name: dept.name,
        nodalOfficer: dept.nodalOfficer,
        totalOffices: dept.offices.length,
        totalApplications: deptApps,
        slaCompliance: compliance,
        averageTat: avgTat,
        breached: deptBreaches,
        atRisk: deptAtRisk,
        repeatDelays: deptRepeatDelays,
        performanceScore: score,
        status
      };
    });

    // Sort by volume descending for primary view
    evaluatedDepartments.sort((a, b) => b.totalApplications - a.totalApplications);

    return NextResponse.json({ departments: evaluatedDepartments });
  } catch (error: any) {
    console.error("GET /api/departments error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

