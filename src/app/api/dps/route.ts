export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeDPSMetrics } from "@/lib/sla-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const district = searchParams.get("district");
    const status = searchParams.get("status");

    const where: any = {};
    if (department && department !== "all") {
      where.office = {
        ...(where.office || {}),
        department: { code: department },
      };
    }
    if (district && district !== "all") {
      where.office = {
        ...(where.office || {}),
        district: { code: district },
      };
    }

    const officers = await prisma.dpsOfficer.findMany({
      where,
      include: {
        office: {
          include: {
            department: true,
            district: true,
          },
        },
        applications: {
          select: {
            id: true,
            submissionDate: true,
            completionDate: true,
            slaStatus: true,
            daysTaken: true,
            currentStage: true,
            delayReason: true,
            service: { select: { name: true } },
          },
        },
      },
    });

    let computed = officers.map((officer) => computeDPSMetrics(officer));

    if (status && status !== "all") {
      computed = computed.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }

    // Sort by performance score descending
    computed.sort((a, b) => b.performanceScore - a.performanceScore);

    return NextResponse.json({
      total: computed.length,
      dpsOfficers: computed,
    });
  } catch (error: any) {
    console.error("DPS API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

