# Frontend Application — Next.js 15 & Turbopack

Client-side municipal operations portal for the Municipal Complaint Management System (MCMS), engineered with Next.js 15, Turbopack, and high-contrast WCAG AAA typography.

---

## Key Portals & Core Modules

### 1. Citizen Redressal Portal
- **Grievance Lodging**: Instant validation with character limits, phone format checking, and dynamic department categorization keywords.
- **GPS Map Location Picker**: Interactive Karachi district pin-drop and landmark detection.
- **Live Ticket Tracker**: Real-time status progress timeline tracking tickets (`CMP-0001` through `CMP-0040`) or resident mobile phone numbers.

### 2. Multi-Factor Dispatch & Command Center
- **Automated Fit Scoring Engine**: Evaluates field technicians across 4 operational factors:
  1. *Workload Queue Weight (35%)*: Live active ticket load.
  2. *Skill Specialization (30%)*: Specific domain match (e.g., Pipeline Specialist, Asphalt Technician, Grid Lead).
  3. *Depot Proximity (20%)*: District zone proximity (<1.5 km, 1.5–3 km, >3 km).
  4. *SLA Urgency Rating (15%)*: Hazard priority matching.
- **One-Click Auto-Dispatch**: Automatically dispatches the #1 ranked candidate officer.
- **Escalation Alert Surveillance**: Review and authorize decision-support agent protocol recommendations (Approved / Dismissed).
- **Executive KPIs**: Real-time resolution rates and capacity metrics across all 6 Karachi municipal agencies.

### 3. Staff Workdesk
- **Mobile-Responsive Field Queue**: Technicians review assigned work orders with site location and citizen reports.
- **Two-Way Status Synchronization**: Marking orders "In Progress" or "Completed" syncs the linked citizen complaint in real time.
- **Action Remarks Logging**: Field repair documentation.

---

## Architecture & Integration
- **Hybrid Live-Sync Architecture**: Connects directly to the Django REST Framework API (`http://localhost:8000/api`) when available, while providing seamless local storage offline cache resilience when the API is disconnected.
- **Status Indicator**: Persistent header indicates `🟢 Django API Live` vs `🟡 Offline Cache Mode` with a one-click re-sync trigger.
- **Typography & High-Contrast Theme**: Permanent high-contrast design using **Plus Jakarta Sans** and **JetBrains Mono** for clear visual distinction.

---

## Quickstart

```bash
cd frontend

# Install dependencies
npm install

# Environment configuration
cp .env.example .env.local

# Run development server (port 3000)
npm run dev

# Run production build validation
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.
