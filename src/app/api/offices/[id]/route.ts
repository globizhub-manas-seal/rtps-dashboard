import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeOfficeMetrics, computeDPSMetrics, getSlaRuleForService } from "@/lib/sla-engine";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const office = await prisma.office.findUnique({
      where: { id },
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
        dpsOfficers: {
          include: {
            office: {
              include: {
                district: { select: { name: true } },
                department: { select: { name: true } },
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
        },
      },
    });

    if (!office) {
      return NextResponse.json({ error: "Office not found" }, { status: 404 });
    }

    // Compute metrics for the office itself
    const officeMetrics = computeOfficeMetrics(office);

    // Compute metrics for each DPS in the office
    // We will just use defaults for the thresholds here, though we could pass custom thresholds if needed
    const dpsMetrics = office.dpsOfficers.map((dps) => computeDPSMetrics(dps));

    dpsMetrics.sort((a, b) => a.performanceScore - b.performanceScore); // Worst performing DPS first

    return NextResponse.json({
      office: officeMetrics,
      dpsOfficers: dpsMetrics,
    });
  } catch (error: any) {
    console.error(`GET /api/offices/[id] error:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
