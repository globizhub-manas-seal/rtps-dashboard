import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Clear out data
    await prisma.reviewEvidence.deleteMany({});
    await prisma.reviewCase.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.application.deleteMany({});
    
    // Execute prisma seed
    await execAsync("npx prisma db seed", {
      cwd: process.cwd()
    });
    
    return NextResponse.json({ message: "Database reset and seeded successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
