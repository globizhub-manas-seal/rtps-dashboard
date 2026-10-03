# Project Proposal & Technical Report
## RTPS Performance Intelligence: A Data-Driven SLA Monitoring and Administrative Decision-Support Platform for Assam

> **Notice & Disclaimer:**  
> This document represents an independent technical proposal and functional prototype submitted in response to the ASCRTPS Innovation Challenge. It is designed to demonstrate technical feasibility and decision-support workflows. It is not an officially commissioned, endorsed, or operational system of the Assam State Commission for Right to Public Services (ASCRTPS), Sewa Setu, National Informatics Centre (NIC), or the Government of Assam.

---

### 1. Problem Statement*
The Assam Right to Public Services (RTPS) Act, 2012 (as amended) statutorily mandates that citizens receive designated public services within specified stipulated timelines across notified services delivered through the Sewa Setu portal. As highlighted in the official ASCRTPS Challenge Overview, an operational gap exists between legislative intent and administrative monitoring:

1. **For the State Commission (ASCRTPS) & Appellate Authorities:**  
   As noted in the official challenge problem description, performance data (stipulated timelines, SLA breaches, repeat delays) currently sits scattered across application transaction logs and periodic reports. Without a consolidated, real-time monitoring mechanism, performance reviews rely primarily on periodic MIS summaries and manual review of appeal records. Consequently, statutory penalty provisions under the Act are invoked reactively—primarily after a citizen appeals and the delay is investigated—rather than through continuous, data-driven monitoring.
2. **For Department Heads, Nodal Officers & District Administrations:**  
   Supervisory authorities lack an automated operational dashboard to continuously monitor throughput across districts and distinguish between one-off, situational delays (e.g., local infrastructure constraints, seasonal disruptions) and chronic, recurring bottlenecks at specific offices or service desks.
3. **For Designated Public Servants (DPS) & Frontline Offices:**  
   Consistently high-performing, diligent officers and offices lack an automated, objective tracking mechanism to highlight exemplary turnaround times for administrative recognition or performance-based incentives, weakening both the deterrent and incentive mechanisms envisioned by the Act.
4. **For Citizens & Public Transparency:**  
   Public visibility into departmental turnaround times and aggregate district-level compliance remains limited, making it difficult for citizens to assess overall service efficiency.

---

### 2. Solution*
We have developed **RTPS Performance Intelligence**—a cloud-native demonstration prototype designed to transition RTPS service-delivery monitoring from periodic manual reviews to continuous, data-driven operational intelligence. 

The system architecture is structured around three interconnected operational layers:

1. **Surveillance & Operational Analytics Layer:**  
   Provides near-real-time visibility into service transactions using simulated ingestion workflows. It tracks application velocity, computes SLA compliance rates, and aggregates average turnaround times (TAT) across departments, administrative offices, and individual DPS profiles.
2. **Bottleneck & Delay Pattern Identification Engine:**  
   Monitors active transactions against statutory time limits, flagging applications approaching deadlines (`At Risk`, `Critical`, or `Breached`). It highlights recurring delay patterns and repeat breach frequencies across specific service categories to support administrative triage.
3. **Administrative Decision-Support & Evidence Dossier Workflow:**  
   Prepares structured, evidence-based review dossiers summarizing transaction histories, timeline milestones, and observed delays to assist authorized appellate and nodal officers during administrative reviews. Simultaneously, it compiles recognition candidate profiles for officers maintaining high compliance rates.
4. **Aggregated Public Transparency View:**  
   Provides an open, public-facing transparency dashboard presenting district-level compliance heatmaps and department-level summary metrics, designed with strict aggregate-only data separation to respect data privacy.

---

### 3. Core Architectural Capabilities & Innovations*
Rather than functioning as a static report viewer, the platform introduces specific architectural capabilities tailored to RTPS governance:

1. **Configurable Rule Engine for Statutory Parameters:**  
   Translates statutory service timelines, alert thresholds (e.g., 24h / 48h early warnings), and evaluation criteria into configurable software parameters, allowing administrative rules to be updated without code modifications.
2. **Evidence-Based Administrative Review Dossiers:**  
   Assists supervisory authorities by automatically assembling chronological transaction logs, milestone timestamps, and delay indicators into structured review dossiers. Any formal notice, determination of fault, or statutory penalty remains strictly subject to due process and human administrative review.
3. **Separation of Operational Delay Indicators from Legal Determinations:**  
   The platform tracks operational indicators—such as repeat breaches and prolonged TAT—as inputs for supervisory inquiry, explicitly avoiding automated accusations of negligence and preserving due administrative discretion.
4. **Dual Focus on Compliance Triage and Recognition Candidacy:**  
   Maintains dual analytical queues: one highlighting potential operational bottlenecks for administrative review, and another spotlighting consistent high performers (>95% compliance) as objective candidates for departmental recognition.
5. **Architectural Data Separation for Public Transparency:**  
   Implements an aggregate-only public reporting interface that surfaces macro trends while shielding individual officer profiles, personal identifiable information (PII), and internal review workflows.

---

### 4. Technology Stack & Implementation Status*

The technical architecture cleanly delineates between implemented prototype components and proposed production extensions:

#### Implemented in Current Demonstration Prototype
- **Frontend Framework:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React icons, and Recharts for responsive visualizations.
- **Geospatial Visualization:** Custom interactive SVG/D3-geo map rendering 35 districts of Assam with choropleth compliance shading and drill-down filtering.
- **Backend & Database:** Node.js API routes paired with PostgreSQL (Neon Serverless) and Prisma ORM (v5.22.0), featuring indexed queries for fast multi-parameter filtering.
- **Access Control & Privacy:** Route-level middleware simulating role-based views (`ASCRTPS_ADMIN`, `DEPARTMENT_ADMIN`, `OFFICE_HEAD`, `REVIEWER`, `DPS`, `PUBLIC`), with aggregate-only data filtering on public endpoints.
- **Simulated Ingestion Pipeline:** Interactive JSON transaction simulator demonstrating real-time ingestion, payload validation, and instant SLA recalculation.

#### Proposed Production Architecture (Subject to Grant & Authorizations)
- **Direct Data Ingestion:** Production integration with Sewa Setu APIs, webhooks, or approved State Data Centre (SDC) exchange mechanisms, subject to official data-sharing agreements and security clearances.
- **Enterprise Identity & Access Management (IAM):** Integration with official State SSO (e.g., Jan Parichay / e-Pramaan) with Multi-Factor Authentication (MFA).
- **Formal Security & Compliance:** Comprehensive Vulnerability Assessment and Penetration Testing (VAPT) by a CERT-In empaneled auditor, formal GIGW 3.0 accessibility verification, and DPDP Act compliance review.
- **Legally Validated Workflow Automation:** Formal review and digitization of Section 7(1) inquiry notice templates and digital signature integration (e-Sign).

---

### 5. Current Stage*
**Functional MVP Prototype / Demonstration-Ready**  
A working full-stack prototype has been developed and deployed to demonstrate RTPS service-delivery monitoring using synthetic transaction data and simulated ingestion. The MVP includes a configurable SLA rules engine, department, office and DPS analytics, administrative review dossiers, audit logging, simulated role-based access, an interactive 35-district map, and an aggregated public performance dashboard. Integration with Sewa Setu and deployment in a government-approved production environment are proposed future milestones, subject to authorization, official data access, and technical validation.

- **Demonstration URL:** [https://rtps-dashboard.vercel.app](https://rtps-dashboard.vercel.app) *(Demonstration environment utilizing synthetic data).*

---

### 6. Prototype Capability & Validation Matrix

| Capability | Current Prototype Status | Demonstration Evidence | Proposed Production Scope |
| :--- | :--- | :--- | :--- |
| **Configurable SLA Rule Engine** | **Implemented** | Working rules interface (`/settings/sla-rules`) with dynamic threshold updates. | Verification with official departmental RTPS notifications. |
| **Transaction Ingestion** | **Simulated** | Interactive REST/JSON simulator (`/data-integration`) with schema validation. | Authorized API/webhook integration with Sewa Setu backend. |
| **Executive & Departmental Analytics** | **Implemented** | Live KPI metrics, compliance donuts, and department league tables (`/dashboard`, `/departments`). | Integration with multi-year historical State transaction datasets. |
| **Office & DPS Performance Index** | **Implemented (Synthetic)** | Drill-down scorecards tracking volume, TAT, and breaches (`/dps`, `/offices`). | Calibration against verified officer rosters and transfer records. |
| **Administrative Review Dossiers** | **Implemented** | Structured dossier generator compiling timeline evidence (`/reviews`). | Formal legal review with appellate authorities and e-Sign integration. |
| **Merit Recognition Candidacy** | **Implemented** | Filtered recognition candidate view and citation docket preview (`/recognition`). | Alignment with official State administrative award frameworks. |
| **Role-Based Access Control** | **Simulated** | Interactive role selector with server-side middleware route guards. | Integration with State SSO (Jan Parichay) and official RBAC directory. |
| **Public Data Separation** | **Implemented** | Distinct public route (`/public-performance`) presenting aggregate data only. | Independent privacy impact assessment under the DPDP Act, 2023. |
| **Geospatial District Mapping** | **Implemented** | Interactive 35-district Assam SVG map with dynamic choropleth shading. | Validation with official Survey of India / State GIS boundary data. |
| **Security & Audit Logging** | **Implemented (Prototype)** | Database audit ledger recording operational state changes (`/audit`). | CERT-In empaneled VAPT testing and tamper-evident database hardening. |

---

### 7. Market, Stakeholder & Context Analysis

#### Target Stakeholders
1. **Primary Stakeholders — State Regulatory & Appellate Bodies (B2G):**
   - Assam State Commission for Right to Public Services (ASCRTPS) and Administrative Reforms & Training Department.
   - First and Second Appellate Authorities responsible for statutory appeal reviews.
   - District Commissioners (DCs) and Departmental Nodal Officers across Assam’s 35 administrative districts.
2. **Internal Administrative Users (Departmental Delivery Cadre):**
   - Designated Public Servants (DPS) and supervisory heads across notified departments (e.g., Revenue & Disaster Management, Transport, GMC, Food & Civil Supplies).
3. **Public Beneficiaries (Citizens of Assam):**
   - Citizens accessing public services through Sewa Setu, benefiting from proactive bottleneck resolution and transparent service monitoring.

#### Contextual Baseline & Differentiation
Current operational oversight relies heavily on periodic MIS summaries and citizen-initiated appeal cases. Generic APM or commercial ticketing systems lack statutory awareness of the Assam RTPS Act, appellate escalation hierarchies, and government data residency requirements. This platform is designed specifically around the statutory timelines and administrative procedures of the Assam RTPS ecosystem.

---

### 8. Intellectual Property & Commercial Strategy

- **IP Status:** Proprietary software architecture developed for the challenge.
- **Patent Strategy:** Subject to a formal patentability and prior-art assessment, a provisional domestic patent application is planned covering the *method and architecture for automated statutory SLA breach attribution and structured administrative evidence dossier compilation*.
- **Licensing & Engagement Model:** Proposed as an indigenous SaaS / GovTech deployment deployable on State-owned infrastructure (SDC or MeitY cloud), ensuring data sovereignty with ongoing technical support and maintenance.

---

### 9. Funding Requirement & Staged Milestones

**Requested Grant: ₹10,00,000 (Rupees Ten Lakhs Only) [Idea2PoC / Assam Startup Scheme]**

Rather than promising a statewide rollout solely from the grant, the funding is tied to five sequential milestones focused on formal integration, validation, and a controlled pilot:

```
[Milestone 1: Rule Validation] ──> [Milestone 2: API Ingestion] ──> [Milestone 3: Security & Audit] ──> [Milestone 4: Controlled Pilot] ──> [Milestone 5: Scale-up Blueprint]
```

| Milestone & Expenditure Head | Budget Allocation | Key Dependencies / Prerequisites | Proposed Measurable Deliverables |
| :--- | :--- | :--- | :--- |
| **Milestone 1: Data Architecture & Rule Validation** | **₹1,80,000** (18%) | Official RTPS service notification schedules; access to ASCRTPS domain experts. | Formal mapping document of statutory SLAs across pilot services; finalized JSON schema; verified rule engine specifications. |
| **Milestone 2: Integration Connector Development** | **₹2,60,000** (26%) | Departmental API access permissions; Sewa Setu sandbox or test environment. | Production-grade data connector with retry logic, rate limiting, data sanitization, and automated transaction error-handling. |
| **Milestone 3: Security, Privacy & Compliance Hardening** | **₹1,90,000** (19%) | Staging environment on MeitY-compliant cloud or State Data Centre. | Threat modelling report; independent VAPT audit remediation; DPDP privacy compliance assessment; role hardening. |
| **Milestone 4: Controlled Multi-Department Pilot Trial** | **₹2,50,000** (25%) | Approval to conduct pilot with 2–3 selected departments (e.g., Transport, Revenue); field stakeholder availability. | 60-day controlled pilot; onboarding workshops for pilot Nodal Officers; user feedback documentation; performance tuning report. |
| **Milestone 5: Evaluation, Legal Review & Scale-up Readiness** | **₹1,20,000** (12%) | Pilot operational data; legal consultation on dossier templates. | Comprehensive pilot evaluation report; verified legal notice templates; provisional patent filing assessment; statewide rollout blueprint. |
| **Total** | **₹10,00,000** (100%) | | |

---

### 10. Projected Impact & Evaluation Framework

*Note: All projected impacts represent targeted estimates based on pilot assumptions and will be benchmarked against historical baselines during the controlled pilot stage.*

#### A. Targeted Administrative & Governance Impacts
1. **Accelerated Evidence Retrieval for Appellate Authorities:**  
   *Target Objective:* Reduce the time required to retrieve and assemble transaction timelines for appeal hearings from days to minutes through pre-compiled evidence dossiers.
2. **Proactive Operational Triage:**  
   *Target Objective:* Enable Nodal Officers to identify potential bottlenecks 24–48 hours prior to statutory breach, shifting supervisory intervention from post-facto reviews to proactive resolution.
3. **Objective Basis for Recognition & Commendation:**  
   *Target Objective:* Establish an objective, transparent eligibility roster of consistent high performers to support administrative recognition and incentive programs.

#### B. Direct & Ecosystem Employment Targets (Next 12–24 Months)
- **Direct High-Skilled Technical Roles (Startup Level in Assam):**  
  **6–10 direct technical roles**, including Full-Stack Engineers, Data Integration Leads, GIS Specialists, and DevOps/Security Engineers.
- **Ecosystem & Operational Roles Catalyzed:**  
  **25–40 indirect support roles** across pilot departments and districts, encompassing technical support coordinators, data quality assistants, and administrative training facilitators.

---

### 11. Alignment with Assam Incubation and Startup Policy 2025–2030

**Primary Notified Sector: Category B — IT, ITeS & Artificial Intelligence (AI)**

The proposal aligns with the core objectives of "Innovate Assam 2030" across four strategic areas:

1. **Domestic GovTech Innovation:**  
   Fulfills the mandate to build indigenous technology solutions specifically tailored to the operational and statutory needs of Government of Assam departments.
2. **Advancement of IT & Data Governance:**  
   Demonstrates high-performance web development, configurable rule engines, and interactive geospatial data analytics engineered by local technical talent.
3. **Citizen-Centric Good Governance:**  
   Directly supports the statutory objectives of the Assam RTPS Act, 2012, reinforcing public service accountability and transparency.
4. **Feasible, Phased Implementation:**  
   Proposes an accountable, milestone-driven pathway transitioning from a proven demonstration prototype to an authorized, secure government pilot.
