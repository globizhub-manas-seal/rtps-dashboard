import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { calculateSLA, computeDPSMetrics } from "../src/lib/sla-engine";

describe("Assam RTPS Statutory SLA Engine", () => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const ONE_HOUR_MS = 60 * 60 * 1000;

  test("calculates DELIVERED when application is completed within statutory timeline", () => {
    const submissionDate = new Date("2026-03-01T10:00:00Z");
    const completionDate = new Date("2026-03-05T10:00:00Z"); // 4 days later
    const statutorySlaDays = 15;

    const result = calculateSLA({
      submissionDate,
      statutorySlaDays,
      completionDate,
    });

    assert.equal(result.slaStatus, "DELIVERED");
    assert.equal(result.isBreached, false);
    assert.equal(result.daysTaken, 4);
    assert.ok(result.slaConsumedPercent < 100);
  });

  test("calculates BREACHED when completed after statutory SLA limit", () => {
    const submissionDate = new Date("2026-03-01T10:00:00Z");
    const completionDate = new Date("2026-03-20T10:00:00Z"); // 19 days later
    const statutorySlaDays = 15;

    const result = calculateSLA({
      submissionDate,
      statutorySlaDays,
      completionDate,
    });

    assert.equal(result.slaStatus, "BREACHED");
    assert.equal(result.isBreached, true);
    assert.equal(result.daysTaken, 19);
    assert.ok(result.slaConsumedPercent > 100);
  });

  test("calculates ON_TRACK for in-progress application with plenty of time remaining", () => {
    const submissionDate = new Date("2026-03-01T10:00:00Z");
    const statutorySlaDays = 10;
    // Reference date is 2 days in
    const referenceDate = new Date("2026-03-03T10:00:00Z");

    const result = calculateSLA({
      submissionDate,
      statutorySlaDays,
      referenceDate,
    });

    assert.equal(result.slaStatus, "ON_TRACK");
    assert.equal(result.isBreached, false);
    assert.ok(result.timeRemainingHours > 48);
  });

  test("calculates AT_RISK when time remaining is between 12 and 48 hours", () => {
    const submissionDate = new Date("2026-03-01T10:00:00Z");
    const statutorySlaDays = 5; // Due on 2026-03-06T10:00:00Z
    // Reference date is 24 hours before due date
    const dueDate = new Date(submissionDate.getTime() + 5 * ONE_DAY_MS);
    const referenceDate = new Date(dueDate.getTime() - 24 * ONE_HOUR_MS);

    const result = calculateSLA({
      submissionDate,
      statutorySlaDays,
      referenceDate,
      warningHours: 48,
      criticalHours: 12,
    });

    assert.equal(result.slaStatus, "AT_RISK");
    assert.equal(result.isBreached, false);
  });

  test("calculates CRITICAL when time remaining is under 12 hours", () => {
    const submissionDate = new Date("2026-03-01T10:00:00Z");
    const statutorySlaDays = 5;
    const dueDate = new Date(submissionDate.getTime() + 5 * ONE_DAY_MS);
    const referenceDate = new Date(dueDate.getTime() - 6 * ONE_HOUR_MS); // 6 hours remaining

    const result = calculateSLA({
      submissionDate,
      statutorySlaDays,
      referenceDate,
      warningHours: 48,
      criticalHours: 12,
    });

    assert.equal(result.slaStatus, "CRITICAL");
    assert.equal(result.isBreached, false);
  });

  test("calculates BREACHED for active application when overdue", () => {
    const submissionDate = new Date("2026-03-01T10:00:00Z");
    const statutorySlaDays = 5;
    const dueDate = new Date(submissionDate.getTime() + 5 * ONE_DAY_MS);
    const referenceDate = new Date(dueDate.getTime() + 2 * ONE_HOUR_MS); // 2 hours past due

    const result = calculateSLA({
      submissionDate,
      statutorySlaDays,
      referenceDate,
    });

    assert.equal(result.slaStatus, "BREACHED");
    assert.equal(result.isBreached, true);
  });

  test("computeDPSMetrics correctly identifies high performers for commendation", () => {
    const officerMock = {
      id: "dps-1",
      name: "Bishnu Prasad Rabha",
      employeeCode: "DPS-REV-001",
      designation: "Circle Officer",
      office: {
        name: "Dispur Revenue Circle",
        district: { name: "Kamrup Metropolitan" },
        department: { name: "Revenue & Disaster Management" },
      },
      applications: [
        {
          id: "app-1",
          submissionDate: new Date(),
          completionDate: new Date(),
          slaStatus: "DELIVERED",
          daysTaken: 2,
          currentStage: "Disposed",
          delayReason: null,
          service: { name: "Mutation" },
        },
        {
          id: "app-2",
          submissionDate: new Date(),
          completionDate: new Date(),
          slaStatus: "DELIVERED",
          daysTaken: 3,
          currentStage: "Disposed",
          delayReason: null,
          service: { name: "Mutation" },
        },
      ],
    };

    const metrics = computeDPSMetrics(officerMock);
    assert.equal(metrics.complianceRate, 100);
    assert.equal(metrics.eligibleForCommendation, true);
    assert.equal(metrics.status, "Excellent");
  });
});
