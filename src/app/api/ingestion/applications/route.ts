export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateSLA } from "@/lib/sla-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rtpsRefNo, serviceCode, officeCode, dpsEmployeeCode, submissionDate, status, citizenName } = body;

    if (!rtpsRefNo || !serviceCode || !officeCode || !dpsEmployeeCode) {
      return NextResponse.json(
        {
          error: "Missing required fields: rtpsRefNo, serviceCode, officeCode, dpsEmployeeCode are mandatory.",
        },
        { status: 400 }
      );
    }

    // Lookup service
    const service = await prisma.service.findUnique({
      where: { serviceCode },
    });
    if (!service) {
      return NextResponse.json(
        { error: `Service with code '${serviceCode}' not found.` },
        { status: 404 }
      );
    }

    // Lookup office
    const office = await prisma.office.findUnique({
      where: { code: officeCode },
    });
    if (!office) {
      return NextResponse.json(
        { error: `Office with code '${officeCode}' not found.` },
        { status: 404 }
      );
    }

    // Lookup DPS Officer
    const dps = await prisma.dpsOfficer.findUnique({
      where: { employeeCode: dpsEmployeeCode },
    });
    if (!dps) {
      return NextResponse.json(
        { error: `DPS Officer with code '${dpsEmployeeCode}' not found.` },
        { status: 404 }
      );
    }

    // Lookup active SLA rule for this service (configurable thresholds)
    const slaRule = await prisma.slaRule.findFirst({
      where: { serviceId: service.id, isActive: true },
    });

    const subDate = submissionDate ? new Date(submissionDate) : new Date();

    // Calculate SLA using the core SLA Engine with configurable thresholds
    const sla = calculateSLA({
      submissionDate: subDate,
      statutorySlaDays: slaRule?.slaDays ?? service.statutorySlaDays,
      referenceDate: new Date(),
      warningHours: slaRule?.warningHours,
      criticalHours: slaRule?.criticalHours,
    });

    // Upsert application
    const application = await prisma.application.upsert({
      where: { rtpsRefNo },
      update: {
        currentStatus: status || "UNDER_SCRUTINY",
        targetSlaDate: sla.dueDate,
        slaStatus: sla.slaStatus,
        slaConsumedPercent: sla.slaConsumedPercent,
        timeRemainingHours: sla.timeRemainingHours,
        updatedAt: new Date(),
      },
      create: {
        rtpsRefNo,
        serviceId: service.id,
        officeId: office.id,
        dpsId: dps.id,
        citizenName: citizenName || "Citizen Applicant",
        citizenPhone: "+91 9800000000",
        submissionDate: subDate,
        targetSlaDate: sla.dueDate,
        currentStatus: status || "UNDER_SCRUTINY",
        slaStatus: sla.slaStatus,
        slaConsumedPercent: sla.slaConsumedPercent,
        timeRemainingHours: sla.timeRemainingHours,
        currentStage: "Document Verification",
      },
      include: {
        service: true,
        office: { include: { district: true, department: true } },
        dpsOfficer: true,
      },
    });

    return NextResponse.json(
      {
        message: "Application successfully ingested and SLA calculated in PostgreSQL.",
        integrationMode: "Prototype Ingestion (Simulated Sewa Setu Pipeline)",
        application: {
          rtpsRefNo: application.rtpsRefNo,
          service: application.service.name,
          office: application.office.name,
          district: application.office.district.name,
          dps: application.dpsOfficer.name,
          statutoryDays: application.service.statutorySlaDays,
          targetSlaDate: application.targetSlaDate,
          slaStatus: application.slaStatus,
          slaConsumedPercent: `${application.slaConsumedPercent}%`,
          timeRemainingHours: `${application.timeRemainingHours} hrs`,
          status: application.currentStatus,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Ingestion error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during ingestion", details: error.message },
      { status: 500 }
    );
  }
}

