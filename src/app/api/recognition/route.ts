export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeDPSMetrics, getAllActiveSlaRules, DEFAULT_SLA_THRESHOLDS } from "@/lib/sla-engine";

export async function GET() {
  try {
    // Load configurable thresholds from DB
    const slaRulesMap = await getAllActiveSlaRules();

    // Compute aggregate thresholds: use the most common (mode) or average across services
    // For recognition, use the strictest (highest) recognition threshold and lowest repeat delay threshold
    let recognitionThreshold = DEFAULT_SLA_THRESHOLDS.recognitionThreshold;
    let repeatDelayThreshold = DEFAULT_SLA_THRESHOLDS.repeatDelayThreshold;

    if (slaRulesMap.size > 0) {
      const allRules = Array.from(slaRulesMap.values());
      // Use average recognition threshold across all configured services
      recognitionThreshold = Math.round(
        allRules.reduce((sum, r) => sum + r.recognitionThreshold, 0) / allRules.length * 10
      ) / 10;
      // Use average repeat delay threshold
      repeatDelayThreshold = Math.round(
        allRules.reduce((sum, r) => sum + r.repeatDelayThreshold, 0) / allRules.length
      );
    }

    const officers = await prisma.dpsOfficer.findMany({
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

    const evaluated = officers.map((officer) =>
      computeDPSMetrics(officer, {
        recognitionThreshold,
        repeatDelayThreshold,
      })
    );

    // Use the DB-driven thresholds for filtering
    const candidates = evaluated
      .filter((dps) => dps.complianceRate >= recognitionThreshold && dps.repeatDelays <= repeatDelayThreshold)
      .sort((a, b) => b.complianceRate - a.complianceRate);

    return NextResponse.json({
      rule: `Configurable rule (SLA Compliance ≥ ${recognitionThreshold}% & Repeat Delays ≤ ${repeatDelayThreshold})`,
      thresholds: { recognitionThreshold, repeatDelayThreshold },
      totalCandidates: candidates.length,
      candidates,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

