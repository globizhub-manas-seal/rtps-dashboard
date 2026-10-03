# Assam RTPS Performance Intelligence Dashboard
### Continuous SLA Monitoring, Bottleneck Detection & Administrative Decision-Support System

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-blue?logo=postgresql)](https://neon.tech/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-v5.22-2D3748?logo=prisma)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

> **Prototype Notice:**  
> Developed as a functional decision-support and SLA intelligence prototype for the **Assam Right to Public Services (RTPS)** / Sewa Setu ecosystem. Designed to transition government-to-citizen (G2C) service delivery from periodic manual reviews to continuous, data-driven operational intelligence.

---

## 1. Overview & Problem Statement

The Assam Right to Public Services (RTPS) Act mandates time-bound delivery of notified public services (e.g. land mutations, income certificates, trade licenses, permits). However, administrative leadership previously lacked real-time visibility to:
1. **Identify systemic pendency bottlenecks** across 35 districts and 300+ circle/block offices.
2. **Intervene proactively** before applications breach statutory deadlines at the critical 12h/48h early-warning thresholds.
3. **Enforce administrative accountability** on chronic non-performing Designated Public Servants (DPS) via structured Section 7(1) inquiry notices and evidentiary dossiers.
4. **Reward diligence** by spotlighting exemplary officers ($\ge 95\%$ SLA compliance) with official merit commendation certificates.
5. **Ensure citizen transparency** while protecting privacy under the Digital Personal Data Protection (DPDP) Act, 2023.

---

## 2. Core Functional Modules

| Module | Route | Capabilities |
| :--- | :--- | :--- |
| **Executive Command Dashboard** | `/dashboard` | Statewide KPI cards, SLA compliance trends, interactive 35-district choropleth map, workload matrix. |
| **SLA Early-Warning Monitor** | `/sla-monitor` | Real-time tracking of active transactions (`ON_TRACK`, `AT_RISK`, `CRITICAL`, `BREACHED`) with application milestone drawers. |
| **DPS Directory & Scorecards** | `/dps` & `/dps/[id]` | Individual officer performance index (0–100), TAT velocity, repeat delay flags, and CSV exports. |
| **Office & Circle Intelligence** | `/offices` & `/offices/[id]` | Subordinate circle office adherence rates, staff rosters, and administrative health indicators. |
| **Department Performance** | `/departments` & `/departments/[id]` | Inter-departmental benchmarking, service bottleneck heatmaps, and downloadable analytics. |
| **Administrative Reviews** | `/reviews` & `/reviews/[id]` | Section 7(1) inquiry case lifecycle (`PENDING_ACTION` $\rightarrow$ `IN_REVIEW` $\rightarrow$ `CONCLUDED`) with printable legal notice (Form 7A). |
| **Merit Recognition** | `/recognition` & `/recognition/[id]/certificate` | Automated candidate evaluation with printable official Government of Assam Merit Commendation Certificates with QR code validation. |
| **Public Transparency Portal** | `/public-performance` | Public-facing tracker allowing citizens to track application acknowledgment numbers with masked PII and stage progress. |
| **SLA Rules Engine** | `/settings/sla-rules` | Configurable statutory parameters, warning hours (48h/12h), and appeal windows without code changes. |
| **Data Ingestion Simulator** | `/data-integration` | Live REST webhook simulator testing Sewa Setu transaction feeds and instant SLA recalculation. |
| **System Audit Ledger** | `/audit` | Tamper-evident operational event logs with CSV export. |

---

## 3. Technology Stack

- **Framework:** Next.js 16 (App Router, Server Components & Route Handlers)
- **Language:** TypeScript 5
- **Database:** PostgreSQL (Neon Serverless pooler)
- **ORM:** Prisma v5.22
- **Styling:** Vanilla Tailwind CSS v4 with Indian Government Web Guidelines (GIGW 3.0) design language
- **Visualizations:** Recharts & custom interactive D3-geo SVG Assam district map
- **Icons:** Lucide React

---

## 4. Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- PostgreSQL database instance (Neon / AWS RDS / Local PostgreSQL)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/globizhub-manas-seal/rtps-dashboard.git
   cd rtps-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Provide your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://username:password@hostname:5432/database_name?sslmode=require"
   NODE_ENV="development"
   ```

4. **Initialize Database & Master Data:**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push schema to database
   npx prisma db push

   # Seed master departments, services, 35 districts, offices, and sample applications
   npm run prisma:seed # or npx tsx prisma/seed.ts
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Role-Based Access Control (RBAC) & Demo Logins

The application includes an interactive multi-role simulator to test authorization scopes across different governance levels:

| Role Tier | Access Scope | Recommended Starting View |
| :--- | :--- | :--- |
| **State Super Admin** (`ASCRTPS_ADMIN`) | Full statewide read/write across all departments & districts | `/dashboard` |
| **Department Nodal Officer** (`DEPARTMENT_ADMIN`) | Department-specific services, circle offices, and DPS staff | `/departments` |
| **District Commissioner (DC)** (`OFFICE_HEAD`) | District circle offices, blocks, and local officer performance | `/offices` |
| **Inquiry Reviewer** (`REVIEWER`) | Disciplinary case review, evidence assembly, and notices | `/reviews` |
| **Designated Public Servant** (`DPS`) | Assigned transactions and personal turnaround scorecard | `/dps` |
| **Public Citizen** (`PUBLIC`) | Aggregate transparency metrics & citizen application tracker | `/public-performance` |

---

## 6. Project Architecture

```
rtps-dashboard/
├── docs/                           # Strategic proposals & MVP specifications
│   ├── ASSAM_STARTUP_GRANT_PROPOSAL.md
│   └── MVP_SPECIFICATION.md
├── prisma/
│   ├── schema.prisma               # Relational data model
│   └── seed.ts                     # Master data seeding script
├── public/
│   ├── assam_districts.geojson     # Assam 35-district geo boundary data
│   ├── logo/                       # Official emblem and institutional logos
│   └── images/                     # Assam skyline and UI artwork
├── src/
│   ├── app/                        # Next.js App Router routes & API endpoints
│   │   ├── api/                    # Dynamic API route handlers
│   │   ├── dashboard/              # Executive monitoring view
│   │   ├── sla-monitor/            # SLA early-warning queue
│   │   ├── dps/                    # Officer directory & [id] dossiers
│   │   ├── offices/                # Circle offices & [id] views
│   │   ├── departments/            # Departments & [id] views
│   │   ├── reviews/                # Administrative inquiry & [id]/notice print
│   │   ├── recognition/            # Merit recognition & [id]/certificate print
│   │   ├── public-performance/     # Citizen tracking portal
│   │   └── settings/               # System configuration & SLA rules
│   ├── components/                 # Reusable UI, Layout, Branding & Charts
│   └── lib/                        # SLA engine, Prisma client, and utilities
```

---

## 7. License

Government of Assam Ecosystem Reference Prototype. Prepared for technical evaluation and decision-support demonstration.
