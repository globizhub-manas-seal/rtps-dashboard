import { PrismaClient } from "@prisma/client";
import { calculateSLA } from "../src/lib/sla-engine";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Cleaning existing data...");
  await prisma.reviewEvidence.deleteMany();
  await prisma.reviewCase.deleteMany();
  await prisma.slaRule.deleteMany();
  await prisma.application.deleteMany();
  await prisma.dpsOfficer.deleteMany();
  await prisma.service.deleteMany();
  await prisma.office.deleteMany();
  await prisma.district.deleteMany();
  await prisma.department.deleteMany();

  console.log("🏛️ Seeding Departments...");
  const departmentsData = [
    { code: "REV", name: "Revenue & Disaster Management", nodalOfficer: "sec-revenue@assam.gov.in" },
    { code: "TRN", name: "Transport Department", nodalOfficer: "sec-transport@assam.gov.in" },
    { code: "HFW", name: "Health & Family Welfare", nodalOfficer: "sec-health@assam.gov.in" },
    { code: "UDD", name: "Urban Development & Municipal Affairs", nodalOfficer: "sec-urban@assam.gov.in" },
    { code: "EDU", name: "Secondary Education Department", nodalOfficer: "sec-education@assam.gov.in" },
    { code: "PRD", name: "Panchayat & Rural Development", nodalOfficer: "sec-prd@assam.gov.in" },
    { code: "FCS", name: "Food, Civil Supplies & Consumer Affairs", nodalOfficer: "sec-fcs@assam.gov.in" },
    { code: "WPT", name: "Welfare of Plain Tribes & Backward Classes", nodalOfficer: "sec-wpt@assam.gov.in" },
  ];

  const departments: Record<string, any> = {};
  for (const d of departmentsData) {
    departments[d.code] = await prisma.department.create({ data: d });
  }

  console.log("📍 Seeding Districts...");
  const districtsData = [
    { code: "KAM_M", name: "Kamrup Metropolitan", division: "Lower Assam" },
    { code: "DIB", name: "Dibrugarh", division: "Upper Assam" },
    { code: "JOR", name: "Jorhat", division: "Upper Assam" },
    { code: "SON", name: "Sonitpur", division: "North Assam" },
    { code: "CAC", name: "Cachar", division: "Barak Valley" },
    { code: "KAR", name: "Karimganj", division: "Barak Valley" },
    { code: "NAG", name: "Nagaon", division: "Central Assam" },
    { code: "DHU", name: "Dhubri", division: "Lower Assam" },
    { code: "NAL", name: "Nalbari", division: "Lower Assam" },
    { code: "TIN", name: "Tinsukia", division: "Upper Assam" },
  ];

  const districts: Record<string, any> = {};
  for (const dist of districtsData) {
    districts[dist.code] = await prisma.district.create({ data: dist });
  }

  console.log("🏢 Seeding 20 Offices...");
  const officesData = [
    { code: "OFF-GUW-01", name: "Guwahati Circle Office", officeType: "Circle Office", districtCode: "KAM_M", deptCode: "REV" },
    { code: "OFF-GUW-DTO", name: "Dispur DTO Office", officeType: "DTO", districtCode: "KAM_M", deptCode: "TRN" },
    { code: "OFF-GUW-MED", name: "GMCH Medical Super Office", officeType: "Hospital", districtCode: "KAM_M", deptCode: "HFW" },
    { code: "OFF-GUW-GMC", name: "GMC Municipal Headquarters", officeType: "Municipal Board", districtCode: "KAM_M", deptCode: "UDD" },

    { code: "OFF-DIB-01", name: "Dibrugarh West Circle", officeType: "Circle Office", districtCode: "DIB", deptCode: "REV" },
    { code: "OFF-DIB-DTO", name: "Dibrugarh DTO", officeType: "DTO", districtCode: "DIB", deptCode: "TRN" },
    { code: "OFF-DIB-MED", name: "AMCH Dibrugarh", officeType: "Hospital", districtCode: "DIB", deptCode: "HFW" },

    { code: "OFF-JOR-01", name: "Jorhat Sadar Circle", officeType: "Circle Office", districtCode: "JOR", deptCode: "REV" },
    { code: "OFF-JOR-DTO", name: "Jorhat DTO Office", officeType: "DTO", districtCode: "JOR", deptCode: "TRN" },
    { code: "OFF-JOR-TIT", name: "Titabor Circle Office", officeType: "Circle Office", districtCode: "JOR", deptCode: "REV" },

    { code: "OFF-SON-01", name: "Tezpur Sadar Circle", officeType: "Circle Office", districtCode: "SON", deptCode: "REV" },
    { code: "OFF-SON-MUN", name: "Tezpur Urban Municipal Board", officeType: "Municipal Board", districtCode: "SON", deptCode: "UDD" },

    { code: "OFF-CAC-01", name: "Silchar Sadar Circle", officeType: "Circle Office", districtCode: "CAC", deptCode: "REV" },
    { code: "OFF-CAC-DTO", name: "Cachar DTO Office", officeType: "DTO", districtCode: "CAC", deptCode: "TRN" },

    { code: "OFF-KAR-01", name: "Karimganj Circle Office", officeType: "Circle Office", districtCode: "KAR", deptCode: "REV" },
    { code: "OFF-KAR-DTO", name: "Karimganj DTO", officeType: "DTO", districtCode: "KAR", deptCode: "TRN" },

    { code: "OFF-NAG-01", name: "Nagaon Sadar Circle", officeType: "Circle Office", districtCode: "NAG", deptCode: "REV" },
    { code: "OFF-NAG-KAL", name: "Kaliabor Revenue Circle", officeType: "Circle Office", districtCode: "NAG", deptCode: "REV" },

    { code: "OFF-DHU-01", name: "Dhubri Sadar Circle", officeType: "Circle Office", districtCode: "DHU", deptCode: "REV" },
    { code: "OFF-DHU-BIL", name: "Bilasipara Circle Office", officeType: "Circle Office", districtCode: "DHU", deptCode: "REV" },
  ];

  const offices: Record<string, any> = {};
  for (const off of officesData) {
    offices[off.code] = await prisma.office.create({
      data: {
        code: off.code,
        name: off.name,
        officeType: off.officeType,
        districtId: districts[off.districtCode].id,
        departmentId: departments[off.deptCode].id,
      },
    });
  }

  console.log("📜 Seeding 15 Services...");
  const servicesData = [
    { serviceCode: "INC_CERT", name: "Issuance of Income Certificate", statutorySlaDays: 7, deptCode: "REV" },
    { serviceCode: "MUTATION", name: "Mutation / Partition of Land", statutorySlaDays: 30, deptCode: "REV" },
    { serviceCode: "PRC_CERT", name: "Permanent Resident Certificate (PRC)", statutorySlaDays: 14, deptCode: "REV" },
    { serviceCode: "NEC_CERT", name: "Non-Encumbrance Certificate (NEC)", statutorySlaDays: 10, deptCode: "REV" },
    { serviceCode: "JAMABANDI", name: "Issuance of Jamabandi / Chitha Copy", statutorySlaDays: 5, deptCode: "REV" },

    { serviceCode: "DL_LEARN", name: "Learner Driving License Issuance", statutorySlaDays: 3, deptCode: "TRN" },
    { serviceCode: "DL_PERM", name: "Driving License Endorsement & Renewal", statutorySlaDays: 7, deptCode: "TRN" },
    { serviceCode: "VEH_REG", name: "Vehicle Registration Certificate (RC)", statutorySlaDays: 10, deptCode: "TRN" },

    { serviceCode: "BIRTH_REG", name: "Birth Certificate Registration", statutorySlaDays: 7, deptCode: "HFW" },
    { serviceCode: "DEATH_REG", name: "Death Certificate Registration", statutorySlaDays: 7, deptCode: "HFW" },

    { serviceCode: "TRADE_LIC", name: "Urban Trade License Approval", statutorySlaDays: 15, deptCode: "UDD" },
    { serviceCode: "BLD_PERM", name: "Building Permission Clearance", statutorySlaDays: 30, deptCode: "UDD" },

    { serviceCode: "CASTE_CERT", name: "Caste Certificate (SC/ST/OBC)", statutorySlaDays: 15, deptCode: "WPT" },
    { serviceCode: "RATION_CD", name: "New Ration Card Issuance / Addition", statutorySlaDays: 21, deptCode: "FCS" },
    { serviceCode: "PMAY_VERIF", name: "Rural Housing Scheme Eligibility Verification", statutorySlaDays: 14, deptCode: "PRD" },
  ];

  const services: Record<string, any> = {};
  for (const svc of servicesData) {
    services[svc.serviceCode] = await prisma.service.create({
      data: {
        serviceCode: svc.serviceCode,
        name: svc.name,
        statutorySlaDays: svc.statutorySlaDays,
        departmentId: departments[svc.deptCode].id,
      },
    });
  }

  console.log("📏 Seeding SLA Rules (Configurable Thresholds)...");
  const slaRulesData = [
    // Revenue services
    { serviceCode: "INC_CERT",   slaDays: 7,  warningHours: 48,  criticalHours: 12, appealWindowDays: 30, reviewThreshold: 80, recognitionThreshold: 95, repeatDelayThreshold: 3 },
    { serviceCode: "MUTATION",   slaDays: 30, warningHours: 72,  criticalHours: 24, appealWindowDays: 60, reviewThreshold: 75, recognitionThreshold: 92, repeatDelayThreshold: 4 },
    { serviceCode: "PRC_CERT",   slaDays: 14, warningHours: 48,  criticalHours: 12, appealWindowDays: 30, reviewThreshold: 80, recognitionThreshold: 95, repeatDelayThreshold: 3 },
    { serviceCode: "NEC_CERT",   slaDays: 10, warningHours: 36,  criticalHours: 10, appealWindowDays: 30, reviewThreshold: 80, recognitionThreshold: 95, repeatDelayThreshold: 3 },
    { serviceCode: "JAMABANDI",  slaDays: 5,  warningHours: 24,  criticalHours: 8,  appealWindowDays: 15, reviewThreshold: 85, recognitionThreshold: 97, repeatDelayThreshold: 2 },
    // Transport services
    { serviceCode: "DL_LEARN",   slaDays: 3,  warningHours: 24,  criticalHours: 6,  appealWindowDays: 15, reviewThreshold: 85, recognitionThreshold: 97, repeatDelayThreshold: 2 },
    { serviceCode: "DL_PERM",    slaDays: 7,  warningHours: 36,  criticalHours: 10, appealWindowDays: 30, reviewThreshold: 80, recognitionThreshold: 95, repeatDelayThreshold: 3 },
    { serviceCode: "VEH_REG",    slaDays: 10, warningHours: 48,  criticalHours: 12, appealWindowDays: 30, reviewThreshold: 80, recognitionThreshold: 95, repeatDelayThreshold: 3 },
    // Health services
    { serviceCode: "BIRTH_REG",  slaDays: 7,  warningHours: 36,  criticalHours: 8,  appealWindowDays: 30, reviewThreshold: 85, recognitionThreshold: 97, repeatDelayThreshold: 2 },
    { serviceCode: "DEATH_REG",  slaDays: 7,  warningHours: 36,  criticalHours: 8,  appealWindowDays: 30, reviewThreshold: 85, recognitionThreshold: 97, repeatDelayThreshold: 2 },
    // Urban services
    { serviceCode: "TRADE_LIC",  slaDays: 15, warningHours: 48,  criticalHours: 12, appealWindowDays: 30, reviewThreshold: 78, recognitionThreshold: 93, repeatDelayThreshold: 3 },
    { serviceCode: "BLD_PERM",   slaDays: 30, warningHours: 72,  criticalHours: 24, appealWindowDays: 60, reviewThreshold: 75, recognitionThreshold: 90, repeatDelayThreshold: 4 },
    // Welfare/Others
    { serviceCode: "CASTE_CERT", slaDays: 15, warningHours: 48,  criticalHours: 12, appealWindowDays: 30, reviewThreshold: 80, recognitionThreshold: 95, repeatDelayThreshold: 3 },
    { serviceCode: "RATION_CD",  slaDays: 21, warningHours: 60,  criticalHours: 18, appealWindowDays: 30, reviewThreshold: 78, recognitionThreshold: 93, repeatDelayThreshold: 3 },
    { serviceCode: "PMAY_VERIF", slaDays: 14, warningHours: 48,  criticalHours: 12, appealWindowDays: 30, reviewThreshold: 80, recognitionThreshold: 95, repeatDelayThreshold: 3 },
  ];

  for (const rule of slaRulesData) {
    await prisma.slaRule.create({
      data: {
        serviceId: services[rule.serviceCode].id,
        slaDays: rule.slaDays,
        warningHours: rule.warningHours,
        criticalHours: rule.criticalHours,
        appealWindowDays: rule.appealWindowDays,
        reviewThreshold: rule.reviewThreshold,
        recognitionThreshold: rule.recognitionThreshold,
        repeatDelayThreshold: rule.repeatDelayThreshold,
        isActive: true,
      },
    });
  }
  console.log(`  ✅ ${slaRulesData.length} SLA rules created`);

  console.log("👮 Seeding 40 DPS Officers with Intentional Profiles...");
  // 10 Good (95-100%), 18 Normal (80-95%), 7 At Risk (70-80%), 5 Chronic (<70%)
  const dpsProfiles = [
    // --- 10 GOOD PERFORMERS (95-100%, repeat delays 0-2) ---
    { code: "DPS-021", name: "Sri Bhaskar Jyoti Sarma", desig: "Circle Officer", off: "OFF-GUW-01", cat: "GOOD" },
    { code: "DPS-087", name: "Smti Parbin Sultana", desig: "District Transport Officer", off: "OFF-GUW-DTO", cat: "GOOD" },
    { code: "DPS-112", name: "Dr. Hemen Hazarika", desig: "Superintendent", off: "OFF-GUW-MED", cat: "GOOD" },
    { code: "DPS-054", name: "Sri Anjan Kumar Das", desig: "Assistant Commissioner", off: "OFF-DIB-01", cat: "GOOD" },
    { code: "DPS-033", name: "Smti Nabaneeta Phukan", desig: "Circle Officer", off: "OFF-JOR-01", cat: "GOOD" },
    { code: "DPS-078", name: "Sri Bipul Chandra Roy", desig: "DTO", off: "OFF-JOR-DTO", cat: "GOOD" },
    { code: "DPS-091", name: "Dr. Rupjyoti Goswami", desig: "Registrar Birth & Death", off: "OFF-DIB-MED", cat: "GOOD" },
    { code: "DPS-015", name: "Smti Runjun Borgohain", desig: "Circle Officer", off: "OFF-NAG-01", cat: "GOOD" },
    { code: "DPS-042", name: "Sri Pranjal Kalita", desig: "Circle Officer", off: "OFF-DHU-BIL", cat: "GOOD" },
    { code: "DPS-066", name: "Sri Monojit Pathak", desig: "Executive Officer", off: "OFF-GUW-GMC", cat: "GOOD" },

    // --- 18 NORMAL PERFORMERS (80-94%) ---
    { code: "DPS-131", name: "Sri Dipankar Saikia", desig: "Circle Officer", off: "OFF-DIB-01", cat: "NORMAL" },
    { code: "DPS-132", name: "Smti Mousumi Devi", desig: "Motor Vehicle Inspector", off: "OFF-DIB-DTO", cat: "NORMAL" },
    { code: "DPS-133", name: "Sri Kalyan Barua", desig: "Circle Officer", off: "OFF-JOR-TIT", cat: "NORMAL" },
    { code: "DPS-134", name: "Smti Ananya Goswami", desig: "Circle Officer", off: "OFF-SON-01", cat: "NORMAL" },
    { code: "DPS-135", name: "Sri Chandan Bhattacharya", desig: "Circle Officer", off: "OFF-CAC-01", cat: "NORMAL" },
    { code: "DPS-136", name: "Sri Debashis Sen", desig: "DTO", off: "OFF-CAC-DTO", cat: "NORMAL" },
    { code: "DPS-137", name: "Sri Rituraj Gogoi", desig: "Circle Officer", off: "OFF-NAG-KAL", cat: "NORMAL" },
    { code: "DPS-138", name: "Sri Nurul Islam", desig: "Circle Officer", off: "OFF-DHU-01", cat: "NORMAL" },
    { code: "DPS-139", name: "Smti Gitashree Deka", desig: "Assistant Commissioner", off: "OFF-GUW-01", cat: "NORMAL" },
    { code: "DPS-140", name: "Sri Hitesh Baishya", desig: "MVI", off: "OFF-GUW-DTO", cat: "NORMAL" },
    { code: "DPS-141", name: "Sri Mukul Chandra Nath", desig: "Superintendent", off: "OFF-GUW-GMC", cat: "NORMAL" },
    { code: "DPS-142", name: "Smti Jayashree Das", desig: "Circle Officer", off: "OFF-DIB-01", cat: "NORMAL" },
    { code: "DPS-143", name: "Sri Kamal Kishore Das", desig: "DTO", off: "OFF-JOR-DTO", cat: "NORMAL" },
    { code: "DPS-144", name: "Sri Prasanta Konwar", desig: "Circle Officer", off: "OFF-SON-01", cat: "NORMAL" },
    { code: "DPS-145", name: "Sri Samarjit Dey", desig: "Enforcement Inspector", off: "OFF-CAC-DTO", cat: "NORMAL" },
    { code: "DPS-146", name: "Sri Ashim Purkayastha", desig: "Assistant Engineer", off: "OFF-CAC-01", cat: "NORMAL" },
    { code: "DPS-147", name: "Smti Reena Bordoloi", desig: "Circle Officer", off: "OFF-NAG-01", cat: "NORMAL" },
    { code: "DPS-148", name: "Sri Gautam Choudhury", desig: "Circle Officer", off: "OFF-DHU-01", cat: "NORMAL" },

    // --- 7 AT RISK PERFORMERS (70-80%) ---
    { code: "DPS-201", name: "Sri Bikramaditya Singha", desig: "Circle Officer", off: "OFF-CAC-01", cat: "AT_RISK" },
    { code: "DPS-202", name: "Sri Manojit Roy", desig: "MVI", off: "OFF-KAR-DTO", cat: "AT_RISK" },
    { code: "DPS-203", name: "Sri Utpal Doley", desig: "Circle Officer", off: "OFF-DIB-01", cat: "AT_RISK" },
    { code: "DPS-204", name: "Smti Bandana Neog", desig: "Executive Officer", off: "OFF-SON-MUN", cat: "AT_RISK" },
    { code: "DPS-205", name: "Sri Jagadish Talukdar", desig: "Circle Officer", off: "OFF-DHU-01", cat: "AT_RISK" },
    { code: "DPS-206", name: "Sri Hemen Sharma", desig: "Circle Officer", off: "OFF-NAG-KAL", cat: "AT_RISK" },
    { code: "DPS-207", name: "Sri Subhashish Roy", desig: "Circle Officer", off: "OFF-CAC-01", cat: "AT_RISK" },

    // --- 5 CHRONIC DELAY PERFORMERS (<70%, repeat delays >10) ---
    { code: "DPS-104", name: "Sri Ramen Barman", desig: "Circle Officer", off: "OFF-KAR-01", cat: "CHRONIC" },
    { code: "DPS-231", name: "Sri Diganta Bora", desig: "Municipal Trade Officer", off: "OFF-SON-MUN", cat: "CHRONIC" },
    { code: "DPS-318", name: "Sri Biplab Paul", desig: "Circle Officer", off: "OFF-KAR-01", cat: "CHRONIC" },
    { code: "DPS-319", name: "Sri Sanjib Tamuly", desig: "Assistant Town Planner", off: "OFF-GUW-GMC", cat: "CHRONIC" },
    { code: "DPS-320", name: "Sri Kabir Ahmed", desig: "Circle Officer", off: "OFF-DHU-01", cat: "CHRONIC" },
  ];

  const officers: Record<string, any> = {};
  for (const p of dpsProfiles) {
    officers[p.code] = await prisma.dpsOfficer.create({
      data: {
        employeeCode: p.code,
        name: p.name,
        designation: p.desig,
        officeId: offices[p.off].id,
        email: `${p.code.toLowerCase()}@assam.gov.in`,
        phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      },
    });
  }

  console.log("📝 Generating 500 Applications with Realistic SLA calculations...");
  const citizenNames = [
    "Rajen Das", "Ananya Baruah", "Mohammed Ali", "Binod Chetri", "Hemanta Kalita",
    "Priyanka Bora", "Tarun Saikia", "Nandini Goswami", "Debojit Hazarika", "Sunita Begum",
    "Bikash Sharma", "Jyotika Deka", "Monoj Mahanta", "Deepali Nath", "Arunav Kakati",
    "Abdul Karim", "Rekha Boro", "Kalyan Dutta", "Snigdha Barman", "Pranab Talukdar",
    "Pallabi Das", "Surajit Paul", "Dipali Ghosh", "Mridul Sarma", "Karuna Kanta Roy",
    "Subrata Deb", "Mamata Basumatary", "Nayan Moni Nath", "Zakir Hussain", "Barnali Sarma"
  ];

  const stages = [
    "Application Submitted",
    "Document Verification",
    "Field Land Survey",
    "Officer Scrutiny",
    "Final Approval Pending",
  ];

  const allServiceKeys = Object.keys(services);
  const now = new Date("2026-10-01T11:00:00Z");

  const seededApplications = [];
  let appCounter = 10000;

  for (const prof of dpsProfiles) {
    const officer = officers[prof.code];
    const off = offices[prof.off];

    // Determine how many applications this DPS will have (total ~500 across 40 officers = ~12-15 each)
    let appCount = 12;
    if (prof.cat === "CHRONIC") appCount = 18; // higher volume of delayed cases for demonstration
    if (prof.cat === "GOOD") appCount = 14;

    for (let i = 0; i < appCount; i++) {
      appCounter++;
      const rtpsRef = `RTPS-2026-${appCounter}`;
      const citizen = citizenNames[Math.floor(Math.random() * citizenNames.length)];

      // Pick service appropriate to office department
      const deptId = off.departmentId;
      const deptServices = Object.values(services).filter((s) => s.departmentId === deptId);
      const svc = deptServices.length > 0 ? deptServices[i % deptServices.length] : services[allServiceKeys[0]];

      // Performance outcome based on category
      let isCompleted = false;
      let isBreached = false;
      let daysAgo = 5;
      let delayReason: string | null = null;
      let stage = stages[Math.floor(Math.random() * stages.length)];

      if (prof.cat === "GOOD") {
        // 96% completed in SLA, 4% on track active
        if (i < 11) {
          isCompleted = true;
          daysAgo = Math.floor(Math.random() * 20) + 5;
        } else {
          isCompleted = false;
          daysAgo = Math.floor(Math.random() * 3) + 1; // recent
        }
      } else if (prof.cat === "NORMAL") {
        // ~85% completed in SLA, ~10% active on track, ~5% breached
        if (i < 9) {
          isCompleted = true;
          daysAgo = Math.floor(Math.random() * 25) + 5;
        } else if (i === 10) {
          isCompleted = false;
          daysAgo = svc.statutorySlaDays + 2; // Breached
          isBreached = true;
          delayReason = "Counter backlog";
          stage = "Officer Scrutiny";
        } else {
          isCompleted = false;
          daysAgo = Math.floor(Math.random() * 4) + 1;
        }
      } else if (prof.cat === "AT_RISK") {
        // ~75% compliance, multiple near deadline or at risk
        if (i < 7) {
          isCompleted = true;
          daysAgo = Math.floor(Math.random() * 25) + 8;
        } else if (i < 10) {
          isCompleted = false;
          daysAgo = Math.max(1, svc.statutorySlaDays - 1); // 12-24h remaining
          delayReason = "Document Verification pending";
          stage = "Document Verification";
        } else {
          isCompleted = false;
          daysAgo = svc.statutorySlaDays + 4; // Breached
          isBreached = true;
          delayReason = "Citizen clarification awaited";
          stage = "Officer Scrutiny";
        }
      } else {
        // CHRONIC: <70% compliance, high repeat delays, many breaches
        if (i < 6) {
          isCompleted = true;
          daysAgo = Math.floor(Math.random() * 20) + 10;
        } else if (i < 12) {
          // Breached active cases
          isCompleted = false;
          daysAgo = svc.statutorySlaDays + (Math.floor(Math.random() * 8) + 2);
          isBreached = true;
          delayReason = "Document Verification delay";
          stage = "Document Verification";
        } else {
          // Critical active (<12h remaining)
          isCompleted = false;
          daysAgo = svc.statutorySlaDays;
          delayReason = "Land Record discrepancies";
          stage = "Field Land Survey";
        }
      }

      const submissionDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      let completionDate: Date | null = null;

      if (isCompleted) {
        // Took less than statutorySlaDays
        const daysTaken = Math.max(1, svc.statutorySlaDays - Math.floor(Math.random() * 3) - 1);
        completionDate = new Date(submissionDate.getTime() + daysTaken * 24 * 60 * 60 * 1000);
      }

      // Calculate mathematically via SLA engine!
      const sla = calculateSLA({
        submissionDate,
        statutorySlaDays: svc.statutorySlaDays,
        completionDate,
        referenceDate: now,
      });

      const app = await prisma.application.create({
        data: {
          rtpsRefNo: rtpsRef,
          serviceId: svc.id,
          officeId: off.id,
          dpsId: officer.id,
          citizenName: citizen,
          citizenPhone: `+91 97${Math.floor(10000000 + Math.random() * 90000000)}`,
          submissionDate,
          targetSlaDate: sla.dueDate,
          completionDate,
          currentStatus: isCompleted ? "DELIVERED" : (isBreached ? "APPROVAL_PENDING" : "UNDER_SCRUTINY"),
          slaStatus: sla.slaStatus,
          slaConsumedPercent: sla.slaConsumedPercent,
          timeRemainingHours: sla.timeRemainingHours,
          daysTaken: sla.daysTaken,
          currentStage: isCompleted ? "Delivered to Citizen" : stage,
          delayReason,
        },
      });

      seededApplications.push(app);
    }
  }

  console.log(`✅ Seeded ${seededApplications.length} total applications!`);

  console.log("⚖️ Seeding Initial Administrative Review Cases...");
  // Review Case 1: DPS-104 (Sri Ramen Barman) - Chronic delays in Mutation
  const dps104 = officers["DPS-104"];
  const offKarimganj = offices["OFF-KAR-01"];
  const dps104Apps = seededApplications.filter((a) => a.dpsId === dps104.id && a.slaStatus === "BREACHED");

  const revCase1 = await prisma.reviewCase.create({
    data: {
      caseRef: "REV-2026-089",
      targetType: "DPS",
      dpsId: dps104.id,
      officeId: offKarimganj.id,
      status: "PENDING_ACTION",
      priority: "HIGH",
      reason: "SLA compliance below configured threshold (71%) with chronic repeat delays in Land Mutation",
      sectionCited: "Assam RTPS Act 2012, Sec 7(1)",
      primaryIssue: "Persistent backlog in Land Mutation document verification leading to statutory breach.",
      noticeDispatchedAt: new Date("2026-09-29T10:00:00Z"),
    },
  });

  // Link evidences
  for (const app of dps104Apps.slice(0, 5)) {
    await prisma.reviewEvidence.create({
      data: {
        reviewCaseId: revCase1.id,
        applicationId: app.id,
      },
    });
  }

  // Review Case 2: DPS-231 (Sri Diganta Bora) - Municipal trade license pendency
  const dps231 = officers["DPS-231"];
  const offTezpurMun = offices["OFF-SON-MUN"];
  const dps231Apps = seededApplications.filter((a) => a.dpsId === dps231.id && a.slaStatus === "BREACHED");

  const revCase2 = await prisma.reviewCase.create({
    data: {
      caseRef: "REV-2026-092",
      targetType: "DPS",
      dpsId: dps231.id,
      officeId: offTezpurMun.id,
      status: "IN_REVIEW",
      priority: "CRITICAL",
      reason: "Statutory deadline exceeded for Urban Trade License clearance; unexplained 14-day file stoppage.",
      sectionCited: "Assam RTPS Act 2012, Sec 8(2)",
      primaryIssue: "Unexcused delay at Scrutiny counter without issuing query to applicant.",
      noticeDispatchedAt: new Date("2026-09-27T14:30:00Z"),
      explanationText: "Staff shortage at Tezpur Municipal billing counter during festival season; file clearance underway.",
    },
  });

  for (const app of dps231Apps.slice(0, 4)) {
    await prisma.reviewEvidence.create({
      data: {
        reviewCaseId: revCase2.id,
        applicationId: app.id,
      },
    });
  }

  console.log("✨ All initial demo seed data successfully populated in PostgreSQL!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
