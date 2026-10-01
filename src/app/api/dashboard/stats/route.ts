export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const departmentFilter = searchParams.get("department");
    const districtFilter = searchParams.get("district");

    // Base application query condition
    const whereClause: any = {};
    if (departmentFilter && departmentFilter !== "all") {
      whereClause.office = {
        department: { code: departmentFilter },
      };
    }
    if (districtFilter && districtFilter !== "all") {
      whereClause.office = {
        ...whereClause.office,
        district: { code: districtFilter },
      };
    }

    const [totalApps, breachedApps, atRiskApps, criticalApps, onTrackApps, deliveredApps] = await Promise.all([
      prisma.application.count({ where: whereClause }),
      prisma.application.count({ where: { ...whereClause, slaStatus: "BREACHED" } }),
      prisma.application.count({ where: { ...whereClause, slaStatus: "AT_RISK" } }),
      prisma.application.count({ where: { ...whereClause, slaStatus: "CRITICAL" } }),
      prisma.application.count({ where: { ...whereClause, slaStatus: "ON_TRACK" } }),
      prisma.application.count({ where: { ...whereClause, slaStatus: "DELIVERED" } }),
    ]);

    // Average TAT
    const completedApps = await prisma.application.findMany({
      where: { ...whereClause, daysTaken: { not: null } },
      select: { daysTaken: true },
    });
    const avgTat =
      completedApps.length > 0
        ? Math.round(
            (completedApps.reduce((acc, a) => acc + (a.daysTaken || 0), 0) / completedApps.length) * 10
          ) / 10
        : 4.8;

    // SLA Compliance %
    const complianceRate =
      totalApps > 0 ? Math.round(((totalApps - breachedApps) / totalApps) * 1000) / 10 : 87.4;

    // SLA Distribution Breakdown
    const slaDistribution = [
      {
        name: "On Track",
        value: onTrackApps,
        color: "#16803c",
        percentage: totalApps > 0 ? `${((onTrackApps / totalApps) * 100).toFixed(1)}%` : "0%",
        desc: "Within safe SLA timeline (>48h remaining)",
      },
      {
        name: "At Risk",
        value: atRiskApps,
        color: "#D97706",
        percentage: totalApps > 0 ? `${((atRiskApps / totalApps) * 100).toFixed(1)}%` : "0%",
        desc: "Due within next 12-48h",
      },
      {
        name: "Critical",
        value: criticalApps,
        color: "#EA580C",
        percentage: totalApps > 0 ? `${((criticalApps / totalApps) * 100).toFixed(1)}%` : "0%",
        desc: "Due in <12h / Escalation threshold",
      },
      {
        name: "Breached",
        value: breachedApps,
        color: "#DC2626",
        percentage: totalApps > 0 ? `${((breachedApps / totalApps) * 100).toFixed(1)}%` : "0%",
        desc: "Statutory deadline exceeded",
      },
      {
        name: "Delivered",
        value: deliveredApps,
        color: "#1464A5",
        percentage: totalApps > 0 ? `${((deliveredApps / totalApps) * 100).toFixed(1)}%` : "0%",
        desc: "Successfully issued within statutory timeline",
      },
    ];

    // Department Performance
    const departments = await prisma.department.findMany({
      include: {
        offices: {
          include: {
            applications: {
              select: { slaStatus: true, daysTaken: true },
            },
            dpsOfficers: { select: { id: true } },
          },
        },
      },
    });

    const deptPerformance = departments.map((d) => {
      let deptApps = 0;
      let deptBreaches = 0;
      let deptTatSum = 0;
      let completedCount = 0;
      let dpsCount = 0;

      d.offices.forEach((o) => {
        dpsCount += o.dpsOfficers.length;
        deptApps += o.applications.length;
        o.applications.forEach((a) => {
          if (a.slaStatus === "BREACHED") deptBreaches++;
          if (a.daysTaken) {
            deptTatSum += a.daysTaken;
            completedCount++;
          }
        });
      });

      const compliance = deptApps > 0 ? Math.round(((deptApps - deptBreaches) / deptApps) * 100) : 88;
      const avgDeptTat = completedCount > 0 ? Math.round((deptTatSum / completedCount) * 10) / 10 : 5.0;

      return {
        id: d.id,
        code: d.code,
        name: d.name,
        compliance,
        avgTat: avgDeptTat,
        applications: deptApps,
        breaches: deptBreaches,
        activeDps: dpsCount,
      };
    });

    // District Performance
    const districts = await prisma.district.findMany({
      include: {
        offices: {
          include: {
            applications: { select: { slaStatus: true } },
          },
        },
      },
    });

    const districtPerformance = districts.map((dist) => {
      let distApps = 0;
      let distBreaches = 0;
      dist.offices.forEach((o) => {
        distApps += o.applications.length;
        o.applications.forEach((a) => {
          if (a.slaStatus === "BREACHED") distBreaches++;
        });
      });

      const comp = distApps > 0 ? Math.round(((distApps - distBreaches) / distApps) * 100) : 85;
      let status = "Satisfactory";
      if (comp >= 90) status = "Strong";
      else if (comp < 80) status = "Attention Required";

      return {
        id: dist.id,
        name: dist.name,
        code: dist.code,
        compliance: comp,
        applications: distApps,
        breaches: distBreaches,
        offices: dist.offices.length,
        status,
      };
    });

    // Services breakdown & bottlenecks
    const services = await prisma.service.findMany({
      include: {
        department: true,
        applications: { select: { slaStatus: true, daysTaken: true } },
      },
    });

    const servicesPerformance = services.map((s) => {
      const vol = s.applications.length;
      const breaches = s.applications.filter((a) => a.slaStatus === "BREACHED").length;
      const completed = s.applications.filter((a) => a.daysTaken !== null);
      const tat =
        completed.length > 0
          ? Math.round(
              (completed.reduce((sum, a) => sum + (a.daysTaken || 0), 0) / completed.length) * 10
            ) / 10
          : s.statutorySlaDays * 0.7;
      const comp = vol > 0 ? Math.round(((vol - breaches) / vol) * 100) : 90;
      const isBottleneck = tat > s.statutorySlaDays || comp < 75;

      return {
        id: s.id,
        name: s.name,
        serviceCode: s.serviceCode,
        department: s.department.name,
        statutoryDays: s.statutorySlaDays,
        avgTat: tat,
        compliance: comp,
        volume: vol,
        bottleneck: isBottleneck,
      };
    });

    // Top and At-Risk Offices
    const allOffices = await prisma.office.findMany({
      include: {
        district: true,
        department: true,
        applications: { select: { slaStatus: true, daysTaken: true } },
      },
    });

    const evaluatedOffices = allOffices.map((o) => {
      const vol = o.applications.length;
      const breaches = o.applications.filter((a) => a.slaStatus === "BREACHED").length;
      const comp = vol > 0 ? Math.round(((vol - breaches) / vol) * 100) : 90;
      const completed = o.applications.filter((a) => a.daysTaken !== null);
      const tat =
        completed.length > 0
          ? Math.round((completed.reduce((acc, a) => acc + (a.daysTaken || 0), 0) / completed.length) * 10) / 10
          : 4.2;

      return {
        id: o.id,
        code: o.code,
        name: o.name,
        district: o.district.name,
        compliance: comp,
        avgTat: tat,
        volume: vol,
        breaches,
      };
    });

    evaluatedOffices.sort((a, b) => b.compliance - a.compliance);
    const topOffices = evaluatedOffices.slice(0, 4);
    const atRiskOffices = evaluatedOffices
      .filter((o) => o.breaches > 0 || o.compliance < 80)
      .sort((a, b) => a.compliance - b.compliance)
      .slice(0, 4);

    // High performing DPS officers count
    const dpsList = await prisma.dpsOfficer.findMany({
      include: {
        applications: { select: { slaStatus: true } },
      },
    });
    const highPerformingDpsCount = dpsList.filter((d) => {
      const vol = d.applications.length;
      if (vol === 0) return false;
      const breaches = d.applications.filter((a) => a.slaStatus === "BREACHED").length;
      const comp = ((vol - breaches) / vol) * 100;
      return comp >= 95;
    }).length;

    return NextResponse.json({
      kpis: {
        totalApplications: totalApps,
        slaCompliance: complianceRate,
        activeBreaches: breachedApps,
        applicationsAtRisk: atRiskApps + criticalApps,
        highPerformingDps: highPerformingDpsCount,
        totalDps: dpsList.length,
        averageTat: avgTat,
      },
      slaDistribution,
      departments: deptPerformance,
      districts: districtPerformance,
      services: servicesPerformance,
      officesSummary: {
        top: topOffices,
        atRisk: atRiskOffices,
      },
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

