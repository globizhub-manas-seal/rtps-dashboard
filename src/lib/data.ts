export const mockData = {
  // Periods
  periods: [
    { id: 'today', label: 'Today', compliance: 89.2, breaches: 4, atRisk: 18, totalApps: 1420 },
    { id: '7d', label: 'Last 7 Days', compliance: 88.1, breaches: 29, atRisk: 64, totalApps: 9840 },
    { id: '30d', label: 'Last 30 Days', compliance: 87.4, breaches: 126, atRisk: 213, totalApps: 48642 },
    { id: 'quarter', label: 'This Quarter (Q2 FY26)', compliance: 86.8, breaches: 394, atRisk: 213, totalApps: 142800 },
    { id: 'year', label: 'This Year (FY 2026-27)', compliance: 85.9, breaches: 1280, atRisk: 213, totalApps: 492000 },
  ],

  // Overall SLA status distribution
  slaDistribution: [
    { name: 'On Track', value: 38421, color: '#16803c', percentage: '79.0%', desc: 'Within safe SLA timeline' },
    { name: 'At Risk', value: 213, color: '#D97706', percentage: '0.4%', desc: 'Due within next 24-48h' },
    { name: 'Critical', value: 87, color: '#EA580C', percentage: '0.2%', desc: 'Due in <12h / Escalated' },
    { name: 'Breached', value: 126, color: '#DC2626', percentage: '0.3%', desc: 'Statutory deadline exceeded' },
    { name: 'Delivered', value: 9795, color: '#1464A5', percentage: '20.1%', desc: 'Successfully issued in SLA' },
  ],

  // Department Performance with volume + SLA + breaches
  departments: [
    { id: 'd1', name: 'Revenue & Disaster Mgmt', compliance: 91, avgTat: 4.2, applications: 12421, breaches: 84, activeDps: 184 },
    { id: 'd2', name: 'Transport Department', compliance: 89, avgTat: 5.1, applications: 8213, breaches: 61, activeDps: 96 },
    { id: 'd3', name: 'Health & Family Welfare', compliance: 85, avgTat: 6.8, applications: 6921, breaches: 92, activeDps: 112 },
    { id: 'd4', name: 'Urban & Municipal Affairs', compliance: 82, avgTat: 7.4, applications: 5140, breaches: 78, activeDps: 74 },
    { id: 'd5', name: 'School Education', compliance: 94, avgTat: 3.5, applications: 4110, breaches: 19, activeDps: 82 },
    { id: 'd6', name: 'Panchayat & Rural Dev', compliance: 88, avgTat: 5.8, applications: 3837, breaches: 42, activeDps: 90 },
  ],

  // District-level performance dimension (Assam administrative hierarchy)
  districts: [
    { id: 'dis-1', name: 'Kamrup Metropolitan', compliance: 91, applications: 14210, breaches: 72, offices: 14, status: 'Strong' },
    { id: 'dis-2', name: 'Dibrugarh', compliance: 89, applications: 8940, breaches: 48, offices: 9, status: 'Strong' },
    { id: 'dis-3', name: 'Sonitpur', compliance: 88, applications: 6120, breaches: 39, offices: 7, status: 'Satisfactory' },
    { id: 'dis-4', name: 'Cachar', compliance: 87, applications: 7420, breaches: 64, offices: 8, status: 'Satisfactory' },
    { id: 'dis-5', name: 'Jorhat', compliance: 86, applications: 6850, breaches: 52, offices: 6, status: 'Satisfactory' },
    { id: 'dis-6', name: 'Karimganj', compliance: 82, applications: 5102, breaches: 88, offices: 6, status: 'Attention Required' },
  ],

  // Service Performance dimension (identifying systemic service bottlenecks)
  services: [
    { name: 'Income Certificate', department: 'Revenue', statutoryDays: 7, avgTat: 4.1, compliance: 91, volume: 12400, bottleneck: false },
    { name: 'Birth Certificate', department: 'Health', statutoryDays: 7, avgTat: 3.8, compliance: 94, volume: 9850, bottleneck: false },
    { name: 'Caste Certificate', department: 'WPT&BC', statutoryDays: 15, avgTat: 11.2, compliance: 87, volume: 8200, bottleneck: false },
    { name: 'Permanent Residence Cert', department: 'Revenue / Home', statutoryDays: 14, avgTat: 12.1, compliance: 84, volume: 7100, bottleneck: false },
    { name: 'Mutation / Partition of Land', department: 'Revenue', statutoryDays: 30, avgTat: 34.5, compliance: 76, volume: 6400, bottleneck: true },
    { name: 'Driving License Endorsement', department: 'Transport', statutoryDays: 5, avgTat: 4.4, compliance: 89, volume: 4692, bottleneck: false },
  ],

  // Workload vs Performance Scatter/Matrix Data
  workloadVsPerformance: [
    { name: 'Guwahati Circle', workload: 3400, compliance: 94, department: 'Revenue', type: 'High Workload / High SLA' },
    { name: 'Dispur DTO', workload: 2800, compliance: 92, department: 'Transport', type: 'High Workload / High SLA' },
    { name: 'Jorhat Sadar', workload: 1950, compliance: 91, department: 'Revenue', type: 'Medium Workload / High SLA' },
    { name: 'Dibrugarh West', workload: 2200, compliance: 88, department: 'Revenue', type: 'Medium Workload / High SLA' },
    { name: 'Silchar Circle', workload: 3100, compliance: 78, department: 'Revenue', type: 'High Workload / Low SLA (Capacity Constraint)' },
    { name: 'Karimganj Circle', workload: 2600, compliance: 71, department: 'Revenue', type: 'High Workload / Low SLA (Capacity Constraint)' },
    { name: 'Tezpur Municipal', workload: 1100, compliance: 74, department: 'Municipal', type: 'Low Workload / Low SLA (Admin Inefficiency)' },
    { name: 'Dhubri Sub-Office', workload: 850, compliance: 72, department: 'Municipal', type: 'Low Workload / Low SLA (Admin Inefficiency)' },
    { name: 'Nagaon Circle', workload: 1200, compliance: 95, department: 'Revenue', type: 'Low Workload / High SLA' },
  ],

  // Top & At-Risk Offices
  officesSummary: {
    top: [
      { id: 'OFF-001', name: 'Guwahati Circle Office', district: 'Kamrup Metro', compliance: 97, avgTat: 2.8, volume: 3400 },
      { id: 'OFF-004', name: 'Dibrugarh Circle Office', district: 'Dibrugarh', compliance: 95, avgTat: 3.2, volume: 2200 },
      { id: 'OFF-008', name: 'Jorhat Sadar Office', district: 'Jorhat', compliance: 94, avgTat: 3.4, volume: 1950 },
    ],
    atRisk: [
      { id: 'OFF-003', name: 'Karimganj Circle Office', district: 'Karimganj', compliance: 71, avgTat: 8.4, breaches: 61, volume: 2600, reason: 'Repeat backlogs in land mutation' },
      { id: 'OFF-006', name: 'Silchar Circle Office', district: 'Cachar', compliance: 78, avgTat: 7.1, breaches: 44, volume: 3100, reason: 'Staff shortage & counter rush' },
      { id: 'OFF-009', name: 'Tezpur Urban Office', district: 'Sonitpur', compliance: 74, avgTat: 7.6, breaches: 38, volume: 1100, reason: 'Pendency in trade approvals' },
    ]
  },

  // Trend
  trend: [
    { month: 'April', compliance: 81, applications: 38200, breaches: 210 },
    { month: 'May', compliance: 83, applications: 40100, breaches: 185 },
    { month: 'June', compliance: 85, applications: 42500, breaches: 160 },
    { month: 'July', compliance: 84, applications: 44200, breaches: 172 },
    { month: 'August', compliance: 87, applications: 46800, breaches: 140 },
    { month: 'September', compliance: 87.4, applications: 48642, breaches: 126 },
  ],

  // Designated Public Servants (DPS)
  dps: [
    { id: 'DPS-021', name: 'Sri Bhaskar Jyoti Sarma', department: 'Revenue', office: 'Guwahati Circle', district: 'Kamrup Metro', applications: 1420, compliance: 99, avgTat: 2.8, repeatDelays: 0, score: 98, status: 'Excellent', eligibleForCommendation: true },
    { id: 'DPS-087', name: 'Smti Parbin Sultana', department: 'Transport', office: 'DTO Kamrup Metro', district: 'Kamrup Metro', applications: 980, compliance: 98, avgTat: 3.1, repeatDelays: 0, score: 96, status: 'Strong', eligibleForCommendation: true },
    { id: 'DPS-112', name: 'Dr. Hemen Hazarika', department: 'Health', office: 'Jorhat District Hospital', district: 'Jorhat', applications: 840, compliance: 97, avgTat: 3.5, repeatDelays: 0, score: 94, status: 'Strong', eligibleForCommendation: true },
    { id: 'DPS-054', name: 'Sri Anjan Kumar Das', department: 'Education', office: 'IS Office Dibrugarh', district: 'Dibrugarh', applications: 630, compliance: 96, avgTat: 3.9, repeatDelays: 0, score: 92, status: 'Strong', eligibleForCommendation: true },
    { id: 'DPS-104', name: 'Sri Ramen Barman', department: 'Revenue', office: 'Karimganj Circle', district: 'Karimganj', applications: 642, compliance: 71, avgTat: 8.4, repeatDelays: 18, score: 72, status: 'Review Required', breaches: 61, urgentAction: true },
    { id: 'DPS-231', name: 'Sri Diganta Bora', department: 'Urban Affairs', office: 'Tezpur Municipal', district: 'Sonitpur', applications: 530, compliance: 82, avgTat: 6.8, repeatDelays: 7, score: 79, status: 'Attention', breaches: 24 },
  ],

  // Detailed Applications for Drill-Down Flow
  applications: [
    {
      id: 'RTPS-2026-99214',
      service: 'Mutation / Partition of Land',
      department: 'Revenue & Disaster Mgmt',
      district: 'Karimganj',
      office: 'Karimganj Circle',
      dps: 'DPS-104',
      officerName: 'Sri Ramen Barman',
      submitted: '08 Sep 2026',
      sla: '30 Days',
      due: '01 Oct 2026',
      consumed: 94,
      hoursRemaining: 16,
      urgencyLabel: 'Due in 16h',
      delayRisk: 'HIGH RISK',
      status: 'At Risk',
      citizen: 'Hemanta Kalita',
      reason: 'Field report pending from Lot Mandal (Chotodudhpatil part)',
      delayBreakdown: { verification: 68, applicant: 19, technical: 13 },
      timeline: [
        { title: 'Application Registered on Sewa Setu', date: '08 Sep 2026', done: true },
        { title: 'Field Scrutiny (Lot Mandal)', date: '16 Sep 2026', done: true },
        { title: 'Revenue Supervisor Review', date: '25 Sep 2026', done: true },
        { title: 'Final Order / Seal (DPS-104)', date: '01 Oct 2026 (Pending)', current: true },
      ]
    },
    {
      id: 'RTPS-2026-99182',
      service: 'Caste Certificate',
      department: 'Revenue & Disaster Mgmt',
      district: 'Karimganj',
      office: 'Karimganj Circle',
      dps: 'DPS-104',
      officerName: 'Sri Ramen Barman',
      submitted: '18 Sep 2026',
      sla: '15 Days',
      due: '01 Oct 2026',
      consumed: 91,
      hoursRemaining: 22,
      urgencyLabel: 'Due in 22h',
      delayRisk: 'APPROACHING SLA',
      status: 'At Risk',
      citizen: 'Subrata Roy',
      reason: 'Community recommendation verification delayed',
      delayBreakdown: { verification: 55, applicant: 30, technical: 15 },
      timeline: [
        { title: 'Application Registered', date: '18 Sep 2026', done: true },
        { title: 'Document Verification', date: '24 Sep 2026', done: true },
        { title: 'Certificate Approval (DPS-104)', date: 'Pending', current: true },
      ]
    },
    {
      id: 'RTPS-2026-99105',
      service: 'Permanent Residence Cert',
      department: 'Revenue & Disaster Mgmt',
      district: 'Karimganj',
      office: 'Karimganj Circle',
      dps: 'DPS-104',
      officerName: 'Sri Ramen Barman',
      submitted: '17 Sep 2026',
      sla: '14 Days',
      due: '30 Sep 2026',
      consumed: 98,
      hoursRemaining: 4,
      urgencyLabel: 'Due in 4h',
      delayRisk: 'CRITICAL ESCALATION',
      status: 'Critical',
      citizen: 'Monojit Das',
      reason: 'Police verification report uploaded late by station officer',
      delayBreakdown: { verification: 78, applicant: 12, technical: 10 },
      timeline: [
        { title: 'Application Registered', date: '17 Sep 2026', done: true },
        { title: 'Police Report Attached', date: '29 Sep 2026', done: true },
        { title: 'Urgent Sign-Off Needed', date: 'Due in 4 hours', current: true },
      ]
    },
    {
      id: 'RTPS-2026-98920',
      service: 'Permanent Residence Cert',
      department: 'Revenue & Disaster Mgmt',
      district: 'Cachar',
      office: 'Silchar Circle',
      dps: 'DPS-087',
      officerName: 'Smti Parbin Sultana',
      submitted: '10 Sep 2026',
      sla: '14 Days',
      due: '24 Sep 2026',
      consumed: 142,
      hoursRemaining: -18,
      urgencyLabel: '18h overdue',
      delayRisk: 'BREACHED',
      status: 'Breached',
      citizen: 'Debashis Nath',
      reason: 'Exceeded statutory time limit by 6 days without reason recorded',
      delayBreakdown: { verification: 72, applicant: 18, technical: 10 },
      timeline: [
        { title: 'Application Registered', date: '10 Sep 2026', done: true },
        { title: 'Statutory Deadline Passed', date: '24 Sep 2026', done: true },
        { title: 'SLA Breach Auto-Logged', date: '25 Sep 2026', current: true },
      ]
    },
    {
      id: 'RTPS-2026-98711',
      service: 'Trade License Renewal',
      department: 'Urban & Municipal Affairs',
      district: 'Sonitpur',
      office: 'Tezpur Municipal',
      dps: 'DPS-231',
      officerName: 'Sri Diganta Bora',
      submitted: '12 Sep 2026',
      sla: '10 Days',
      due: '22 Sep 2026',
      consumed: 180,
      hoursRemaining: -192,
      urgencyLabel: '8d overdue',
      delayRisk: 'BREACHED',
      status: 'Breached',
      citizen: 'Assam Trading Co.',
      reason: 'Fire NOC verification delayed at divisional municipal desk',
      delayBreakdown: { verification: 62, applicant: 24, technical: 14 },
      timeline: [
        { title: 'Application Registered', date: '12 Sep 2026', done: true },
        { title: 'Statutory SLA Cut-off', date: '22 Sep 2026', done: true },
        { title: 'Notice Prepared', date: '28 Sep 2026', current: true },
      ]
    },
    {
      id: 'RTPS-2026-99341',
      service: 'Income Certificate',
      department: 'Revenue & Disaster Mgmt',
      district: 'Kamrup Metro',
      office: 'Guwahati Circle',
      dps: 'DPS-021',
      officerName: 'Sri Bhaskar Jyoti Sarma',
      submitted: '27 Sep 2026',
      sla: '7 Days',
      due: '04 Oct 2026',
      consumed: 42,
      hoursRemaining: 96,
      urgencyLabel: '4 days remaining',
      delayRisk: 'NORMAL',
      status: 'On Track',
      citizen: 'Pranab Saikia',
      reason: 'Verification completed; awaiting digital token sign',
      delayBreakdown: { verification: 25, applicant: 10, technical: 5 },
      timeline: [
        { title: 'Application Registered', date: '27 Sep 2026', done: true },
        { title: 'Circle Officer Scrutiny', date: '29 Sep 2026', done: true },
        { title: 'Ready for Issuance', date: '30 Sep 2026', current: true },
      ]
    },
    {
      id: 'RTPS-2026-99402',
      service: 'Birth Certificate',
      department: 'Health & Family Welfare',
      district: 'Jorhat',
      office: 'Jorhat District Hospital',
      dps: 'DPS-112',
      officerName: 'Dr. Hemen Hazarika',
      submitted: '28 Sep 2026',
      sla: '7 Days',
      due: '05 Oct 2026',
      consumed: 31,
      hoursRemaining: 120,
      urgencyLabel: '5 days remaining',
      delayRisk: 'NORMAL',
      status: 'On Track',
      citizen: 'Mitali Medhi',
      reason: 'Institutional birth records cross-verified in hospital registry',
      delayBreakdown: { verification: 20, applicant: 5, technical: 5 },
      timeline: [
        { title: 'Registration on Sewa Setu', date: '28 Sep 2026', done: true },
        { title: 'Hospital Verification', date: '29 Sep 2026', done: true },
        { title: 'Approved by Medical Registrar', date: '30 Sep 2026', current: true },
      ]
    }
  ]
};
