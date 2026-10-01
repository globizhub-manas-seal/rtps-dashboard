export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const department = searchParams.get("department");
    const district = searchParams.get("district");
    const office = searchParams.get("office");
    const service = searchParams.get("service");
    const dps = searchParams.get("dps");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") || "slaConsumed"; // slaConsumed, dueDate, submissionDate
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const where: any = {};

    // Search query on application ID, DPS name, Service name, Office name
    if (search.trim()) {
      where.OR = [
        { rtpsRefNo: { contains: search.trim(), mode: "insensitive" } },
        { citizenName: { contains: search.trim(), mode: "insensitive" } },
        { dpsOfficer: { name: { contains: search.trim(), mode: "insensitive" } } },
        { service: { name: { contains: search.trim(), mode: "insensitive" } } },
        { office: { name: { contains: search.trim(), mode: "insensitive" } } },
      ];
    }

    // Filter by department
    if (department && department !== "all") {
      where.office = {
        ...(where.office || {}),
        department: { code: department },
      };
    }

    // Filter by district
    if (district && district !== "all") {
      where.office = {
        ...(where.office || {}),
        district: { code: district },
      };
    }

    // Filter by office
    if (office && office !== "all") {
      where.officeId = office;
    }

    // Filter by service
    if (service && service !== "all") {
      where.service = { serviceCode: service };
    }

    // Filter by DPS
    if (dps && dps !== "all") {
      where.dpsOfficer = { employeeCode: dps };
    }

    // Filter by status (ON_TRACK, AT_RISK, CRITICAL, BREACHED)
    if (status && status !== "all") {
      where.slaStatus = status.toUpperCase();
    }

    // Sorting
    let orderBy: any = {};
    if (sortBy === "slaConsumed") {
      orderBy = { slaConsumedPercent: sortOrder === "asc" ? "asc" : "desc" };
    } else if (sortBy === "dueDate") {
      orderBy = { targetSlaDate: sortOrder === "asc" ? "asc" : "desc" };
    } else if (sortBy === "submissionDate") {
      orderBy = { submissionDate: sortOrder === "asc" ? "asc" : "desc" };
    } else {
      orderBy = { submissionDate: "desc" };
    }

    const applications = await prisma.application.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        service: true,
        office: {
          include: {
            district: true,
            department: true,
          },
        },
        dpsOfficer: true,
      },
    });

    const formatted = applications.map((app) => ({
      id: app.id,
      rtpsRefNo: app.rtpsRefNo,
      serviceName: app.service.name,
      serviceCode: app.service.serviceCode,
      statutoryDays: app.service.statutorySlaDays,
      departmentName: app.office.department.name,
      departmentCode: app.office.department.code,
      districtName: app.office.district.name,
      officeName: app.office.name,
      dpsName: app.dpsOfficer.name,
      dpsCode: app.dpsOfficer.employeeCode,
      dpsDesignation: app.dpsOfficer.designation,
      citizenName: app.citizenName,
      citizenPhone: app.citizenPhone,
      submissionDate: app.submissionDate.toISOString(),
      targetSlaDate: app.targetSlaDate.toISOString(),
      completionDate: app.completionDate ? app.completionDate.toISOString() : null,
      currentStatus: app.currentStatus,
      slaStatus: app.slaStatus,
      slaConsumedPercent: app.slaConsumedPercent,
      timeRemainingHours: app.timeRemainingHours,
      daysTaken: app.daysTaken,
      currentStage: app.currentStage,
      delayReason: app.delayReason,
    }));

    return NextResponse.json({
      total: formatted.length,
      applications: formatted,
    });
  } catch (error: any) {
    console.error("Applications query error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

