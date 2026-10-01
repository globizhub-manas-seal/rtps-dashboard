export type DistrictAnalytics = {
  id: string;
  name: string;
  compliance: number;
  totalApplications: number;
  pendingApplications: number;
  beyondTime: number;
};

export type DepartmentAnalytics = {
  id: string;
  name: string;
  compliance: number;
  totalApplications: number;
  pendingApplications: number;
  beyondTime: number;
  pendingAtApplicant: number;
};

export type MonthlyTrend = {
  month: string;
  compliance: number;
  avgTat: number;
  breaches: number;
};

export const demoDistricts: DistrictAnalytics[] = [
  { id: "d1", name: "Barpeta", compliance: 82, totalApplications: 6800, pendingApplications: 1200, beyondTime: 250 },
  { id: "d2", name: "Bongaigaon", compliance: 88, totalApplications: 4500, pendingApplications: 600, beyondTime: 80 },
  { id: "d3", name: "Cachar", compliance: 85, totalApplications: 9100, pendingApplications: 1400, beyondTime: 180 },
  { id: "d4", name: "Darrang", compliance: 76, totalApplications: 5100, pendingApplications: 1100, beyondTime: 300 },
  { id: "d5", name: "Dhemaji", compliance: 81, totalApplications: 3800, pendingApplications: 700, beyondTime: 140 },
  { id: "d6", name: "Dhuburi", compliance: 68, totalApplications: 7100, pendingApplications: 2200, beyondTime: 650 },
  { id: "d7", name: "Dibrugarh", compliance: 92, totalApplications: 8400, pendingApplications: 900, beyondTime: 65 },
  { id: "d8", name: "Goalpara", compliance: 79, totalApplications: 6200, pendingApplications: 1300, beyondTime: 280 },
  { id: "d9", name: "Golaghat", compliance: 86, totalApplications: 5400, pendingApplications: 950, beyondTime: 110 },
  { id: "d10", name: "Hailakandi", compliance: 71, totalApplications: 4200, pendingApplications: 1100, beyondTime: 380 },
  { id: "d11", name: "Jorhat", compliance: 88, totalApplications: 7200, pendingApplications: 1100, beyondTime: 120 },
  { id: "d12", name: "Kamrup", compliance: 95, totalApplications: 12500, pendingApplications: 1200, beyondTime: 50 },
  { id: "d13", name: "Karbi Anglong", compliance: 74, totalApplications: 4900, pendingApplications: 1200, beyondTime: 310 },
  { id: "d14", name: "Karimganj", compliance: 74, totalApplications: 5800, pendingApplications: 1500, beyondTime: 420 },
  { id: "d15", name: "Kokrajhar", compliance: 84, totalApplications: 5500, pendingApplications: 900, beyondTime: 150 },
  { id: "d16", name: "Lakhimpur", compliance: 80, totalApplications: 6100, pendingApplications: 1200, beyondTime: 240 },
  { id: "d17", name: "Marigaon", compliance: 85, totalApplications: 4700, pendingApplications: 750, beyondTime: 110 },
  { id: "d18", name: "Nagaon", compliance: 79, totalApplications: 8800, pendingApplications: 1800, beyondTime: 340 },
  { id: "d19", name: "Nalbari", compliance: 89, totalApplications: 5300, pendingApplications: 600, beyondTime: 70 },
  { id: "d20", name: "North Cachar Hills", compliance: 72, totalApplications: 2800, pendingApplications: 800, beyondTime: 220 },
  { id: "d21", name: "Sibsagar", compliance: 91, totalApplications: 6600, pendingApplications: 650, beyondTime: 60 },
  { id: "d22", name: "Sonitpur", compliance: 82, totalApplications: 6500, pendingApplications: 1300, beyondTime: 250 },
  { id: "d23", name: "Tinsukia", compliance: 90, totalApplications: 6200, pendingApplications: 800, beyondTime: 75 },
];

export const demoDepartments: DepartmentAnalytics[] = [
  { id: "dept1", name: "Revenue & Disaster Mgmt", compliance: 91, totalApplications: 45000, pendingApplications: 4200, beyondTime: 380, pendingAtApplicant: 1200 },
  { id: "dept2", name: "Transport", compliance: 94, totalApplications: 32000, pendingApplications: 1800, beyondTime: 150, pendingAtApplicant: 800 },
  { id: "dept3", name: "Health & Family Welfare", compliance: 88, totalApplications: 28000, pendingApplications: 3100, beyondTime: 420, pendingAtApplicant: 500 },
  { id: "dept4", name: "Urban Affairs", compliance: 76, totalApplications: 21000, pendingApplications: 4500, beyondTime: 1100, pendingAtApplicant: 1500 },
  { id: "dept5", name: "Panchayat & Rural Dev", compliance: 84, totalApplications: 18000, pendingApplications: 2800, beyondTime: 550, pendingAtApplicant: 900 },
  { id: "dept6", name: "Education", compliance: 89, totalApplications: 15000, pendingApplications: 1500, beyondTime: 200, pendingAtApplicant: 300 },
  { id: "dept7", name: "Food & Civil Supplies", compliance: 82, totalApplications: 12000, pendingApplications: 2100, beyondTime: 450, pendingAtApplicant: 600 },
  { id: "dept8", name: "WPT & BC", compliance: 72, totalApplications: 8500, pendingApplications: 2400, beyondTime: 780, pendingAtApplicant: 400 },
];

export const demoMonthlyTrends: MonthlyTrend[] = [
  { month: "Jan", compliance: 78, avgTat: 8.4, breaches: 1240 },
  { month: "Feb", compliance: 81, avgTat: 7.9, breaches: 1100 },
  { month: "Mar", compliance: 84, avgTat: 7.2, breaches: 950 },
  { month: "Apr", compliance: 82, avgTat: 7.5, breaches: 1020 },
  { month: "May", compliance: 87, avgTat: 6.8, breaches: 840 },
  { month: "Jun", compliance: 89, avgTat: 6.2, breaches: 710 },
];
