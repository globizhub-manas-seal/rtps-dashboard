export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit-logger";

/**
 * GET /api/sla-rules
 * Returns all SLA rules with their associated service and department info.
 * Query params: ?active=true (filter active only)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";

    const rules = await prisma.slaRule.findMany({
      where: activeOnly ? { isActive: true } : {},
      include: {
        service: {
          include: {
            department: { select: { id: true, name: true, code: true } },
          },
        },
      },
      orderBy: { service: { name: "asc" } },
    });

    // Also return services that DON'T have rules yet (for the "Add Rule" dropdown)
    const servicesWithoutRules = await prisma.service.findMany({
      where: {
        slaRules: { none: {} },
      },
      include: {
        department: { select: { id: true, name: true, code: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      rules: rules.map((r) => ({
        id: r.id,
        serviceId: r.serviceId,
        serviceName: r.service.name,
        serviceCode: r.service.serviceCode,
        departmentName: r.service.department.name,
        departmentCode: r.service.department.code,
        slaDays: r.slaDays,
        warningHours: r.warningHours,
        criticalHours: r.criticalHours,
        appealWindowDays: r.appealWindowDays,
        reviewThreshold: r.reviewThreshold,
        recognitionThreshold: r.recognitionThreshold,
        repeatDelayThreshold: r.repeatDelayThreshold,
        isActive: r.isActive,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
      unconfiguredServices: servicesWithoutRules.map((s) => ({
        id: s.id,
        name: s.name,
        serviceCode: s.serviceCode,
        statutorySlaDays: s.statutorySlaDays,
        departmentName: s.department.name,
      })),
    });
  } catch (error: any) {
    console.error("GET /api/sla-rules error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/sla-rules
 * Create a new SLA rule for a service.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      serviceId,
      slaDays,
      warningHours = 48,
      criticalHours = 12,
      appealWindowDays = 30,
      reviewThreshold = 80,
      recognitionThreshold = 95,
      repeatDelayThreshold = 3,
    } = body;

    if (!serviceId || !slaDays) {
      return NextResponse.json(
        { error: "serviceId and slaDays are required" },
        { status: 400 }
      );
    }

    // Validate the service exists
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Deactivate any existing active rule for this service
    await prisma.slaRule.updateMany({
      where: { serviceId, isActive: true },
      data: { isActive: false },
    });

    const rule = await prisma.slaRule.create({
      data: {
        serviceId,
        slaDays: Number(slaDays),
        warningHours: Number(warningHours),
        criticalHours: Number(criticalHours),
        appealWindowDays: Number(appealWindowDays),
        reviewThreshold: Number(reviewThreshold),
        recognitionThreshold: Number(recognitionThreshold),
        repeatDelayThreshold: Number(repeatDelayThreshold),
        isActive: true,
      },
      include: {
        service: {
          include: { department: { select: { name: true } } },
        },
      },
    });

    return NextResponse.json({ success: true, rule }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/sla-rules error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/sla-rules
 * Update an existing SLA rule.
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Rule id is required" }, { status: 400 });
    }

    // Convert numeric fields
    const data: any = {};
    if (updateData.slaDays !== undefined) data.slaDays = Number(updateData.slaDays);
    if (updateData.warningHours !== undefined) data.warningHours = Number(updateData.warningHours);
    if (updateData.criticalHours !== undefined) data.criticalHours = Number(updateData.criticalHours);
    if (updateData.appealWindowDays !== undefined) data.appealWindowDays = Number(updateData.appealWindowDays);
    if (updateData.reviewThreshold !== undefined) data.reviewThreshold = Number(updateData.reviewThreshold);
    if (updateData.recognitionThreshold !== undefined) data.recognitionThreshold = Number(updateData.recognitionThreshold);
    if (updateData.repeatDelayThreshold !== undefined) data.repeatDelayThreshold = Number(updateData.repeatDelayThreshold);
    if (updateData.isActive !== undefined) data.isActive = Boolean(updateData.isActive);

    const rule = await prisma.slaRule.update({
      where: { id },
      data,
      include: {
        service: {
          include: { department: { select: { name: true } } },
        },
      },
    });

    await logAudit(
      "Updated SLA Rule",
      "SlaRule",
      `Updated rule for Service: ${rule.service.name}. New Thresholds: SLA=${rule.slaDays}d, Warning=${rule.warningHours}h, Critical=${rule.criticalHours}h`,
      rule.id
    );

    return NextResponse.json({ success: true, rule });
  } catch (error: any) {
    console.error("PUT /api/sla-rules error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

