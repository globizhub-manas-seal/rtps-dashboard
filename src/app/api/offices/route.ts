export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeOfficeMetrics } from "@/lib/sla-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const departmentFilter = searchParams.get("department");
    const districtFilter = searchParams.get("district");
    const performanceFilter = searchParams.get("performance"); // All, On Track, At Risk, Critical

    // Build the query
    const whereClause: any = {};
    if (departmentFilter && departmentFilter !== "all") {
      whereClause.department = { code: departmentFilter };
    }
    if (districtFilter && districtFilter !== "all") {
      whereClause.district = { code: districtFilter };
    }

    // Fetch offices with necessary relations
    const offices = await prisma.office.findMany({
      where: whereClause,
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
    });

    // Compute metrics for all offices
    let evaluatedOffices = offices.map((office) => computeOfficeMetrics(office));

    // Apply performance filter
    if (performanceFilter && performanceFilter !== "all") {
      evaluatedOffices = evaluatedOffices.filter((o) => {
        if (performanceFilter === "critical") return o.status === "Critical";
        if (performanceFilter === "at_risk") return o.status === "Attention Required";
        if (performanceFilter === "on_track") return o.status === "Excellent" || o.status === "Satisfactory";
        return true;
      });
    }

    // Sort by performance score ascending (worst first to highlight issues)
    evaluatedOffices.sort((a, b) => a.performanceScore - b.performanceScore);

    // Compute summary for Attention Required widget
    const criticalOffices = evaluatedOffices.filter((o) => o.slaCompliance < 80).length;
    const recurringDelayOffices = evaluatedOffices.filter((o) => o.recurringDelayPattern?.detected).length;
    const activeBreachOffices = evaluatedOffices.filter((o) => o.breached > 0).length;

    return NextResponse.json({
      offices: evaluatedOffices,
      summary: {
        criticalOffices,
        recurringDelayOffices,
        activeBreachOffices,
      },
    });
  } catch (error: any) {
    console.error("GET /api/offices error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

