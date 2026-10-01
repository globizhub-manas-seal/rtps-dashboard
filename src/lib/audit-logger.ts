import { prisma } from "@/lib/prisma";

export async function logAudit(
  action: string,
  targetEntity: string,
  details: string,
  targetId?: string,
  actorRole: string = "ASCRTPS_ADMIN"
) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        targetEntity,
        details,
        targetId,
        actorRole,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
