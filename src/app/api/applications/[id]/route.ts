import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const application = await prisma.application.findFirst({
      where: {
        OR: [{ id }, { rtpsRefNo: id }],
      },
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

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Determine processing timeline stages
    const allStages = [
      { name: "Application Submitted", order: 1 },
      { name: "Document Verification", order: 2 },
      { name: "Field Land Survey / Field Inspection", order: 3 },
      { name: "Officer Review & Scrutiny", order: 4 },
      { name: "Final Statutory Order Issued", order: 5 },
    ];

    let currentOrder = 2;
    if (application.currentStage.includes("Submitted")) currentOrder = 1;
    else if (application.currentStage.includes("Verification")) currentOrder = 2;
    else if (application.currentStage.includes("Field") || application.currentStage.includes("Survey")) currentOrder = 3;
    else if (application.currentStage.includes("Review") || application.currentStage.includes("Scrutiny")) currentOrder = 4;
    else if (application.completionDate || application.currentStatus === "DELIVERED") currentOrder = 5;

    const timeline = allStages.map((stage) => {
      let stageStatus = "upcoming";
      if (stage.order < currentOrder) stageStatus = "completed";
      else if (stage.order === currentOrder) stageStatus = application.slaStatus === "BREACHED" ? "breached" : "in_progress";

      return {
        stageName: stage.name,
        order: stage.order,
        status: stageStatus,
      };
    });

    return NextResponse.json({
      application: {
        id: application.id,
        rtpsRefNo: application.rtpsRefNo,
        service: application.service.name,
        serviceCode: application.service.serviceCode,
        statutoryDays: application.service.statutorySlaDays,
        department: application.office.department.name,
        district: application.office.district.name,
        office: application.office.name,
        dpsId: application.dpsOfficer.employeeCode,
        dpsName: application.dpsOfficer.name,
        dpsDesignation: application.dpsOfficer.designation,
        citizenName: application.citizenName,
        citizenPhone: application.citizenPhone,
        submissionDate: application.submissionDate.toISOString(),
        targetSlaDate: application.targetSlaDate.toISOString(),
        completionDate: application.completionDate?.toISOString() || null,
        currentStatus: application.currentStatus,
        slaStatus: application.slaStatus,
        slaConsumedPercent: application.slaConsumedPercent,
        timeRemainingHours: application.timeRemainingHours,
        daysTaken: application.daysTaken,
        currentStage: application.currentStage,
        delayReason: application.delayReason,
      },
      timeline,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
