export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit-logger";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, explanationText, closingRemarks } = body;

    const updated = await prisma.reviewCase.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(explanationText ? { explanationText } : {}),
        ...(closingRemarks ? { closingRemarks } : {}),
      },
    });

    if (status) {
      await logAudit(
        status === "CONCLUDED" ? "Review Case Concluded" : "Review Case Status Updated",
        "ReviewCase",
        `Review case ${updated.caseRef} status updated to ${status}.`,
        updated.id
      );
    }

    return NextResponse.json({
      message: "Review Case updated successfully",
      review: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const review = await prisma.reviewCase.findUnique({
      where: { id },
      include: {
        dpsOfficer: {
          include: {
            office: {
              include: { department: true, district: true }
            }
          }
        },
        office: {
          include: { department: true, district: true }
        },
        evidenceList: {
          include: {
            application: {
              include: { service: true }
            }
          }
        }
      }
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
