# Assam RTPS Performance Intelligence Platform
## Executive Brief Report: System Modules & Capabilities

**Platform:** Continuous RTPS Service Delivery Performance & SLA Monitoring Platform  
**Authority:** Assam State Commission for Right to Public Services (ASCRTPS)  
**Act Reference:** Assam Right to Public Services Act, 2012 (Amended 2019)  
**Report Date:** October 2026  

---

### Module Architecture Matrix

| # | Module Name | Route | Primary Governance Roles | Core Purpose |
|---|-------------|-------|--------------------------|--------------|
| 1 | **Authentication & Demo RBAC** | `/` | All Tiers (6 Roles) | Multi-role demo simulation and secure credential access |
| 2 | **Executive Dashboard** | `/dashboard` | `ASCRTPS_ADMIN`, `DEPARTMENT_ADMIN` | Statewide SLA health, volume distribution & compliance trends |
| 3 | **SLA Monitor & Early Warning** | `/sla-monitor` | `ASCRTPS_ADMIN`, `DEPARTMENT_ADMIN`, `OFFICE_HEAD` | Real-time pendency tracking, threshold escalations & search |
| 4 | **Departmental Performance** | `/departments`, `/departments/[id]` | `ASCRTPS_ADMIN`, `DEPARTMENT_ADMIN` | Line department SLA benchmarks, bottlenecks & service drilldown |
| 5 | **Offices & Circles Jurisdiction** | `/offices`, `/offices/[id]` | `ASCRTPS_ADMIN`, `DEPARTMENT_ADMIN`, `OFFICE_HEAD` | Field circle performance, pendency root-causes & CSV export |
| 6 | **DPS Performance Dossiers** | `/dps`, `/dps/[id]` | `ASCRTPS_ADMIN`, `DEPARTMENT_ADMIN`, `DPS` | Individual officer accountability, delay trends & workload scatter |
| 7 | **Statutory Reviews & Inquiries** | `/reviews`, `/reviews/[id]`, `.../notice` | `ASCRTPS_ADMIN`, `REVIEWER` | Due-process hearings, explanation intake & legal notice generation |
| 8 | **Merit Recognition & Honors** | `/recognition`, `.../certificate` | `ASCRTPS_ADMIN`, `DEPARTMENT_ADMIN` | Top-quartile incentive engine & printable state certificates |
| 9 | **Data Integration & Ingestion** | `/data-integration` | `ASCRTPS_ADMIN` | Sewa Setu sync simulator, payload validator & batch ingester |
| 10 | **SLA Rules & Threshold Engine** | `/settings/sla-rules` | `ASCRTPS_ADMIN` | Dynamic statutory SLA days, warning & critical hour overrides |
| 11 | **Statutory Audit Logs Ledger** | `/audit` | `ASCRTPS_ADMIN` | Immutable accountability ledger, action logs & CSV export |
| 12 | **Public Citizen Tracking Portal** | `/public-performance` | Citizen / Public (`PUBLIC`) | Acknowledgment tracking, DPDP-masked names & transparency metrics |

---

### Detailed Module Summaries

#### 1. Authentication & Multi-Role Demo Access (`/`)
* **Objective:** Enable frictionless assessment by senior administrative evaluators alongside standard credential security.
* **Capabilities:**
  * 1-Click demo logins for 6 governance tiers: State Admin, Department Nodal, District DC, Statutory Reviewer, DPS Officer, and Citizen.
  * Role simulation selector in header allowing real-time switching without logout.
  * Secure credential authentication support.

#### 2. Executive Dashboard (`/dashboard`)
* **Objective:** Provide the Chief Secretary and ASCRTPS Commissioners macro-level visibility into Assam's service delivery health.
* **Capabilities:**
  * Real-time statutory KPI cards: Total Volume, Statewide Compliance %, Approaching SLA, Critical (<12h), Breached, and Average Turnaround Time.
  * Interactive Recharts visualizations: Monthly compliance trajectories, department comparison bars, and SLA status distribution donuts.
  * Geographic and district-level performance mapping.

#### 3. SLA Early Warning Monitor (`/sla-monitor`)
* **Objective:** Prevent statutory breaches before they occur through proactive escalation tiers.
* **Capabilities:**
  * Multi-dimensional filtering by Urgency (`CRITICAL`, `AT_RISK`, `BREACHED`), Department, District, and Office.
  * Universal keyword search across citizen reference codes, officer names, and service types.
  * Interactive application drawer displaying stage milestone timelines and countdown timers.

#### 4. Departmental Performance Analytics (`/departments`, `/departments/[id]`)
* **Objective:** Rank and audit line departments on statutory velocity and citizen responsiveness.
* **Capabilities:**
  * Department ranking table with compliance scores, total applications, and average turnaround days.
  * Deep-dive departmental dossier (`/departments/[id]`) highlighting notified service portfolios, circle distribution, and repeat delay hotspots.
  * One-click CSV performance export.

#### 5. Circles & Offices Directory (`/offices`, `/offices/[id]`)
* **Objective:** Monitor field administration units (Revenue Circles, DTOs, Civil Hospitals, Block Development Offices).
* **Capabilities:**
  * Circle-level drilldown showing circle officer rosters, pendency backlog, and localized bottleneck categories.
  * Root-cause breakdown analyzing delays (Field Inspection, Verification, Technical, Applicant).
  * Filterable table with one-click CSV export.

#### 6. DPS Performance & Individual Officer Dossiers (`/dps`, `/dps/[id]`)
* **Objective:** Operationalize Section 4 of the Assam RTPS Act by identifying specific Designated Public Servants accountable for service delivery.
* **Capabilities:**
  * Officer performance rankings with composite scores (0–100) weighted by compliance, speed, and repeat delay penalties.
  * Dynamic Officer Dossier (`/dps/[id]`): Displays 6-month trajectory graphs, root-cause delay distributions, live assigned application queues, and direct commendation links.
  * One-click CSV export of all DPS records.

#### 7. Statutory Disciplinary Reviews & Notices (`/reviews`, `/reviews/[id]`, `/reviews/[id]/notice`)
* **Objective:** Provide a digital, legally sound due-process pipeline for chronic SLA non-compliance.
* **Capabilities:**
  * Active case queue with case reference codes, priority markers, and penalty risks.
  * Case Examination Dossier (`/reviews/[id]`): Evidence log, officer explanation submission, review status updates (`PENDING`, `EXPLANATION_RECEIVED`, `NOTICE_ISSUED`, `CLOSED`).
  * Official Notice Generator (`/reviews/[id]/notice`): Produces printable, formal statutory notices with evidence schedules and administrative seals.

#### 8. Merit Recognition & Commendation Generator (`/recognition`, `.../certificate`)
* **Objective:** Incentivize exceptional public servants by recognizing top-quartile performance (>95% compliance, minimal delays).
* **Capabilities:**
  * Eligible officer candidate list automatically computed via the SLA engine.
  * Official Commendation Certificate Generator (`/recognition/[id]/certificate`): Renders a printable A4 Landscape certificate complete with the State Emblem, gold border, digital QR verification hash, and official state seals.

#### 9. Sewa Setu Data Integration & Ingestion Engine (`/data-integration`)
* **Objective:** Interface with Assam's unified citizen portal (Sewa Setu) for live event streaming.
* **Capabilities:**
  * Real-time ingestion simulation triggering Prisma database upserts for new applications and milestone transitions.
  * Visual pipeline health monitor displaying throughput, payload error rates, and API queue latency.

#### 10. Dynamic SLA Rules & Threshold Configuration (`/settings/sla-rules`)
* **Objective:** Allow administrators to configure service-specific statutory deadlines without code changes.
* **Capabilities:**
  * Service catalog configuration for statutory SLA days, warning hour thresholds (default: 48h), and critical escalation windows (default: 12h).
  * Direct synchronization with `sla-engine.ts` calculation logic.

#### 11. Statutory Audit Logs & Accountability Ledger (`/audit`)
* **Objective:** Ensure non-repudiation and compliance with state e-governance audit guidelines.
* **Capabilities:**
  * Immutable activity log tracking review creations, notice issuances, threshold modifications, and data sync events.
  * Role and action filtering with one-click audit CSV export.

#### 12. Public Citizen Tracking & Transparency Portal (`/public-performance`)
* **Objective:** Empower citizens of Assam with transparent access to their statutory entitlements.
* **Capabilities:**
  * Instant RTPS Acknowledgment Tracker (`RTPS-2026-xxxxx`) displaying milestone progression timelines and remaining statutory days.
  * DPDP Act 2023 privacy compliance featuring masked applicant names (`B***** S****`).
  * Public state-wide service performance leaderboard.

---

### Verification & Technical Baseline
* **Framework:** Next.js 16.3.7 (Turbopack) & React 19
* **Database ORM:** Prisma 5.22.0 with PostgreSQL schema
* **Static / Dynamic Routes:** 17 production routes compiled with 0 build errors
* **Unit Testing:** 7/7 core SLA engine automated tests passing (`npm test`)
* **Static Analysis:** ESLint 9 (0 errors) & TypeScript (0 errors)
* **DevOps Packaging:** Multi-stage Docker container & Docker Compose orchestration
