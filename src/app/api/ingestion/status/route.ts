import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalApps = await prisma.application.count();
    const lastApp = await prisma.application.findFirst({
      orderBy: { createdAt: "desc" },
      include: { service: true, office: true },
    });

    return NextResponse.json({
      source: "RTPS / Sewa Setu",
      connection: "Prototype Mode",
      integrationStatus: "Ready for API Integration",
      lastSynchronization: lastApp ? lastApp.createdAt.toISOString() : new Date().toISOString(),
      applicationsReceived: totalApps,
      lastEvent: lastApp
        ? {
            rtpsRefNo: lastApp.rtpsRefNo,
            service: lastApp.service.name,
            office: lastApp.office.name,
            timestamp: lastApp.createdAt.toISOString(),
          }
        : null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
