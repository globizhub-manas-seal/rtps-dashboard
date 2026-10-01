export type SLAStatus = "ON_TRACK" | "AT_RISK" | "CRITICAL" | "BREACHED" | "DELIVERED";

export interface SLACalculationInput {
  submissionDate: Date;
  statutorySlaDays: number;
  completionDate?: Date | null;
  referenceDate?: Date; // Defaults to new Date()
  // Configurable thresholds (from sla_rules table)
  warningHours?: number;  // Default: 48
  criticalHours?: number; // Default: 12
}

export interface SLACalculationResult {
  dueDate: Date;
  slaConsumedPercent: number;
  timeRemainingHours: number;
  slaStatus: SLAStatus;
  daysTaken?: number;
  isBreached: boolean;
}

// Default thresholds (used when no SLA rule exists for a service)
export const DEFAULT_SLA_THRESHOLDS = {
  warningHours: 48,
  criticalHours: 12,
  reviewThreshold: 80,
  recognitionThreshold: 95,
  repeatDelayThreshold: 3,
  appealWindowDays: 30,
};

/**
 * Retrieves the active SLA rule for a given service from the database.
 * Returns null if no rule is configured (engine falls back to defaults).
 */
export async function getSlaRuleForService(serviceId: string) {
  // Dynamic import to avoid circular dependencies in seed scripts
  const { prisma } = await import("@/lib/prisma");

  const rule = await prisma.slaRule.findFirst({
    where: { serviceId, isActive: true },
  });
  return rule;
}

/**
 * Batch-loads all active SLA rules keyed by serviceId.
 * Use this in API routes that process multiple applications to avoid N+1 queries.
 */
export async function getAllActiveSlaRules(): Promise<
  Map<string, { warningHours: number; criticalHours: number; reviewThreshold: number; recognitionThreshold: number; repeatDelayThreshold: number; appealWindowDays: number }>
> {
  const { prisma } = await import("@/lib/prisma");

  const rules = await prisma.slaRule.findMany({
    where: { isActive: true },
  });

  const map = new Map<string, any>();
  for (const rule of rules) {
    map.set(rule.serviceId, {
      warningHours: rule.warningHours,
      criticalHours: rule.criticalHours,
      reviewThreshold: rule.reviewThreshold,
      recognitionThreshold: rule.recognitionThreshold,
      repeatDelayThreshold: rule.repeatDelayThreshold,
      appealWindowDays: rule.appealWindowDays,
    });
  }
  return map;
}

/**
 * Calculates statutory SLA metrics for an RTPS application.
 * Now supports configurable warningHours/criticalHours from sla_rules table.
 *
 * Status logic:
 * - completionDate exists + within SLA → DELIVERED
 * - completionDate exists + past SLA → BREACHED
 * - timeRemaining <= 0 → BREACHED
 * - timeRemaining < criticalHours → CRITICAL
 * - timeRemaining <= warningHours → AT_RISK
 * - otherwise → ON_TRACK
 */
export function calculateSLA(input: SLACalculationInput): SLACalculationResult {
  const { submissionDate, statutorySlaDays, completionDate } = input;
  const refDate = input.referenceDate || new Date();
  const warningHours = input.warningHours ?? DEFAULT_SLA_THRESHOLDS.warningHours;
  const criticalHours = input.criticalHours ?? DEFAULT_SLA_THRESHOLDS.criticalHours;

  const statutorySlaMs = statutorySlaDays * 24 * 60 * 60 * 1000;
  const dueDate = new Date(submissionDate.getTime() + statutorySlaMs);

  if (completionDate) {
    const timeTakenMs = completionDate.getTime() - submissionDate.getTime();
    const daysTaken = Math.round((timeTakenMs / (1000 * 60 * 60 * 24)) * 10) / 10;
    const slaConsumedPercent = Math.min(250, Math.round((timeTakenMs / statutorySlaMs) * 100 * 10) / 10);
    const isBreached = completionDate.getTime() > dueDate.getTime();
    const slaStatus: SLAStatus = isBreached ? "BREACHED" : "DELIVERED";

    return {
      dueDate,
      slaConsumedPercent,
      timeRemainingHours: 0,
      slaStatus,
      daysTaken,
      isBreached,
    };
  }

  // Active / in-progress application
  const remainingMs = dueDate.getTime() - refDate.getTime();
  const timeRemainingHours = Math.round((remainingMs / (1000 * 60 * 60)) * 10) / 10;

  const elapsedMs = Math.max(0, refDate.getTime() - submissionDate.getTime());
  const slaConsumedPercent = Math.min(300, Math.round((elapsedMs / statutorySlaMs) * 100 * 10) / 10);

  let slaStatus: SLAStatus = "ON_TRACK";
  let isBreached = false;

  if (timeRemainingHours <= 0) {
    slaStatus = "BREACHED";
    isBreached = true;
  } else if (timeRemainingHours < criticalHours) {
    slaStatus = "CRITICAL";
  } else if (timeRemainingHours <= warningHours) {
    slaStatus = "AT_RISK";
  } else {
    slaStatus = "ON_TRACK";
  }

  return {
    dueDate,
    slaConsumedPercent,
    timeRemainingHours,
    slaStatus,
    isBreached,
  };
}

export interface DPSAnalyticsSummary {
  dpsId: string;
  name: string;
  employeeCode: string;
  designation: string;
  department: string;
  office: string;
  district: string;
  volume: number;
  completedVolume: number;
  activeVolume: number;
  breaches: number;
  repeatDelays: number;
  complianceRate: number;
  avgTat: number;
  performanceScore: number;
  status: "Excellent" | "Strong" | "Attention" | "Review Required";
  eligibleForCommendation: boolean;
  urgentAction: boolean;
  recurringDelayPattern?: {
    detected: boolean;
    mostCommonDelayStage: string;
    affectedService: string;
    description: string;
  };
}

/**
 * Configurable thresholds for DPS performance evaluation.
 * When not provided, falls back to DEFAULT_SLA_THRESHOLDS.
 */
export interface DPSThresholdOverrides {
  recognitionThreshold?: number;  // Default: 95
  repeatDelayThreshold?: number;  // Default: 3
  reviewThreshold?: number;       // Default: 80
}

/**
 * Computes composite DPS metrics and detects recurring delay patterns.
 * Now accepts optional threshold overrides from the SLA rules table.
 */
export function computeDPSMetrics(officer: {
  id: string;
  name: string;
  employeeCode: string;
  designation: string;
  office: {
    name: string;
    district: { name: string };
    department: { name: string };
  };
  applications: Array<{
    id: string;
    submissionDate: Date;
    completionDate: Date | null;
    slaStatus: string;
    daysTaken: number | null;
    currentStage: string;
    delayReason: string | null;
    service: { name: string };
  }>;
}, thresholds?: DPSThresholdOverrides): DPSAnalyticsSummary {
  const apps = officer.applications;
  const volume = apps.length;

  const recogThreshold = thresholds?.recognitionThreshold ?? DEFAULT_SLA_THRESHOLDS.recognitionThreshold;
  const repeatThreshold = thresholds?.repeatDelayThreshold ?? DEFAULT_SLA_THRESHOLDS.repeatDelayThreshold;
  const reviewThreshold = thresholds?.reviewThreshold ?? DEFAULT_SLA_THRESHOLDS.reviewThreshold;

  if (volume === 0) {
    return {
      dpsId: officer.id,
      name: officer.name,
      employeeCode: officer.employeeCode,
      designation: officer.designation,
      department: officer.office.department.name,
      office: officer.office.name,
      district: officer.office.district.name,
      volume: 0,
      completedVolume: 0,
      activeVolume: 0,
      breaches: 0,
      repeatDelays: 0,
      complianceRate: 100,
      avgTat: 0,
      performanceScore: 100,
      status: "Strong",
      eligibleForCommendation: false,
      urgentAction: false,
    };
  }

  const completed = apps.filter((a) => a.completionDate !== null);
  const active = apps.filter((a) => a.completionDate === null);
  const breaches = apps.filter((a) => a.slaStatus === "BREACHED").length;

  // Repeat delays: applications with delayReason or stage pendency > expected
  const repeatDelays = apps.filter((a) => a.delayReason !== null || a.slaStatus === "BREACHED").length;

  // Compliance Rate = 100 - ((breaches / volume) * 100)
  const complianceRate = Math.max(0, Math.round(((volume - breaches) / volume) * 1000) / 10);

  // Average Turnaround Time
  const tatSum = completed.reduce((sum, a) => sum + (a.daysTaken || 0), 0);
  const avgTat = completed.length > 0 ? Math.round((tatSum / completed.length) * 10) / 10 : 4.5;

  // Performance Score (0 - 100)
  // Weighted: 65% SLA compliance, 20% Speed/TAT, 15% Repeat Delays penalty
  let score = Math.round(complianceRate * 0.7 + Math.max(0, 10 - avgTat) * 2 - Math.min(20, repeatDelays * 0.8));
  score = Math.max(20, Math.min(100, score));

  let status: DPSAnalyticsSummary["status"] = "Strong";
  let urgentAction = false;
  let eligibleForCommendation = false;

  // Use configurable thresholds instead of hardcoded values
  if (complianceRate >= recogThreshold && repeatDelays <= repeatThreshold) {
    status = "Excellent";
    eligibleForCommendation = true;
  } else if (complianceRate >= (recogThreshold + reviewThreshold) / 2) {
    // Midpoint between recognition and review threshold (e.g., 87.5 with defaults)
    status = "Strong";
  } else if (complianceRate >= reviewThreshold) {
    status = "Attention";
  } else {
    status = "Review Required";
    urgentAction = true;
  }

  // Detect Recurring Delay Pattern
  const delayCountsByStage: Record<string, number> = {};
  const delayCountsByService: Record<string, number> = {};

  apps.forEach((a) => {
    if (a.delayReason || a.slaStatus === "BREACHED" || a.slaStatus === "CRITICAL") {
      const stage = a.currentStage || "Document Verification";
      delayCountsByStage[stage] = (delayCountsByStage[stage] || 0) + 1;
      const svc = a.service.name;
      delayCountsByService[svc] = (delayCountsByService[svc] || 0) + 1;
    }
  });

  let topStage = "Document Verification";
  let topStageCount = 0;
  for (const [stg, count] of Object.entries(delayCountsByStage)) {
    if (count > topStageCount) {
      topStageCount = count;
      topStage = stg;
    }
  }

  let topService = "Mutation / Partition of Land";
  let topServiceCount = 0;
  for (const [svc, count] of Object.entries(delayCountsByService)) {
    if (count > topServiceCount) {
      topServiceCount = count;
      topService = svc;
    }
  }

  const recurringDetected = repeatDelays >= 8 || breaches >= 5;

  return {
    dpsId: officer.id,
    name: officer.name,
    employeeCode: officer.employeeCode,
    designation: officer.designation,
    department: officer.office.department.name,
    office: officer.office.name,
    district: officer.office.district.name,
    volume,
    completedVolume: completed.length,
    activeVolume: active.length,
    breaches,
    repeatDelays,
    complianceRate,
    avgTat,
    performanceScore: score,
    status,
    eligibleForCommendation,
    urgentAction,
    recurringDelayPattern: recurringDetected
      ? {
          detected: true,
          mostCommonDelayStage: topStage,
          affectedService: topService,
          description: `Chronic bottleneck identified in '${topStage}' for ${topService}. Officer has ${repeatDelays} repeat pendency events exceeding statutory SLA tolerances.`,
        }
      : undefined,
  };
}

export interface OfficeAnalyticsSummary {
  officeId: string;
  officeCode: string;
  officeName: string;
  district: string;
  department: string;
  totalApplications: number;
  slaCompliance: number;
  averageTat: number;
  atRisk: number;
  breached: number;
  repeatDelays: number;
  performanceScore: number;
  status: "Excellent" | "Satisfactory" | "Attention Required" | "Critical";
  recurringDelayPattern?: {
    detected: boolean;
    description: string;
  };
}

export function computeOfficeMetrics(office: {
  id: string;
  code: string;
  name: string;
  district: { name: string };
  department: { name: string };
  applications: Array<{
    id: string;
    slaStatus: string;
    daysTaken: number | null;
    delayReason: string | null;
  }>;
}): OfficeAnalyticsSummary {
  const apps = office.applications;
  const totalApps = apps.length;

  if (totalApps === 0) {
    return {
      officeId: office.id,
      officeCode: office.code,
      officeName: office.name,
      district: office.district.name,
      department: office.department.name,
      totalApplications: 0,
      slaCompliance: 100,
      averageTat: 0,
      atRisk: 0,
      breached: 0,
      repeatDelays: 0,
      performanceScore: 100,
      status: "Satisfactory",
    };
  }

  const breached = apps.filter((a) => a.slaStatus === "BREACHED").length;
  const atRisk = apps.filter((a) => a.slaStatus === "AT_RISK" || a.slaStatus === "CRITICAL").length; // group both as risk for top level summary
  const repeatDelays = apps.filter((a) => a.delayReason !== null || a.slaStatus === "BREACHED").length;
  const completed = apps.filter((a) => a.daysTaken !== null);

  const complianceRate = Math.max(0, Math.round(((totalApps - breached) / totalApps) * 1000) / 10);

  const tatSum = completed.reduce((sum, a) => sum + (a.daysTaken || 0), 0);
  const avgTat = completed.length > 0 ? Math.round((tatSum / completed.length) * 10) / 10 : 4.5;

  // Illustrative Performance Score calculation
  let score = Math.round(complianceRate * 0.7 + Math.max(0, 10 - avgTat) * 2 - Math.min(20, repeatDelays * 0.8));
  score = Math.max(20, Math.min(100, score));

  let status: "Excellent" | "Satisfactory" | "Attention Required" | "Critical" = "Satisfactory";
  if (score >= 90) status = "Excellent";
  else if (score < 70) status = "Critical";
  else if (score < 80) status = "Attention Required";

  const recurringDetected = repeatDelays >= 5 || breached >= 3 || complianceRate < 80;

  return {
    officeId: office.id,
    officeCode: office.code,
    officeName: office.name,
    district: office.district.name,
    department: office.department.name,
    totalApplications: totalApps,
    slaCompliance: complianceRate,
    averageTat: avgTat,
    atRisk,
    breached,
    repeatDelays,
    performanceScore: score,
    status,
    recurringDelayPattern: recurringDetected
      ? {
          detected: true,
          description: `${repeatDelays} recurring delays or ${breached} active breaches detected. Needs immediate intervention.`,
        }
      : undefined,
  };
}
