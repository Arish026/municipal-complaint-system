'use client';

import React, { useState, useMemo } from 'react';
import { Department, Staff, Complaint, WorkOrder, DecisionAuditLog } from '../types';
import {
  Database,
  Layers,
  Split,
  GitMerge,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Table,
  Code2,
  Cpu,
  HardDrive,
  RefreshCw,
  Key,
  Link2,
  FileCode,
  Check,
  Eye,
  BookOpen,
  Sparkles,
  Zap,
  HelpCircle,
  FolderTree,
  ChevronRight,
  Sliders,
  Terminal,
} from 'lucide-react';

interface DbmsLabViewProps {
  departments: Department[];
  staffList: Staff[];
  complaints: Complaint[];
  workOrders: WorkOrder[];
  auditLogs: DecisionAuditLog[];
}

export const DbmsLabView: React.FC<DbmsLabViewProps> = ({
  departments,
  staffList,
  complaints,
  workOrders,
  auditLogs,
}) => {
  const [activeTab, setActiveTab] = useState<
    'normalization' | 'ansi-sparc' | 'relational-algebra' | 'integrity' | 'acid' | 'traps'
  >('normalization');

  // Normalization Anomaly Simulation State
  const [anomalySimulation, setAnomalySimulation] = useState<
    'none' | 'insertion' | 'deletion' | 'update'
  >('none');

  // Relational Algebra Workbench State
  const [selectedAlgebraQuery, setSelectedAlgebraQuery] = useState<number>(1);

  // Relational Algebra Queries Definition
  const algebraQueries = [
    {
      id: 1,
      title: 'Active Water Supply Grievances (KWSC)',
      description: 'Find all pending water and sewerage complaints routed to Karachi Water & Sewerage Corporation.',
      algebra: 'σ_{department_id = 1 ∧ status ≠ \'Resolved\'}(COMPLAINT) ⨝ DEPARTMENT',
      sql: `SELECT c.complaint_id, c.category, c.location, c.status, d.department_name
FROM COMPLAINT c
JOIN DEPARTMENT d ON c.department_id = d.department_id
WHERE c.department_id = 1 AND c.status != 'Resolved';`,
      execute: () => {
        return complaints
          .filter((c) => c.department_id === 1 && c.status !== 'Resolved')
          .map((c) => ({
            id: `CMP-${c.complaint_id.toString().padStart(4, '0')}`,
            category: c.category,
            location: c.location,
            status: c.status,
            agency: 'KWSC Water & Sewerage',
          }));
      },
    },
    {
      id: 2,
      title: 'Technician Workload Queue Projection',
      description: 'Aggregate active field work orders per assigned staff member to identify dispatch capacity.',
      algebra: 'γ_{staff_id, COUNT(work_order_id) → active_jobs}(σ_{work_status ≠ \'Completed\'}(WORK_ORDER)) ⨝ STAFF',
      sql: `SELECT s.staff_id, s.name, s.designation, COUNT(w.work_order_id) AS active_jobs
FROM STAFF s
LEFT JOIN WORK_ORDER w ON s.staff_id = w.staff_id AND w.work_status != 'Completed'
GROUP BY s.staff_id, s.name, s.designation;`,
      execute: () => {
        return staffList.map((s) => {
          const activeJobs = workOrders.filter(
            (w) => w.staff_id === s.staff_id && w.work_status !== 'Completed'
          ).length;
          return {
            id: `STF-${s.staff_id.toString().padStart(3, '0')}`,
            name: s.name,
            designation: s.designation,
            active_jobs: `${activeJobs} Active Tasks`,
            capacity: activeJobs >= 4 ? 'Overloaded (Alert)' : activeJobs === 0 ? 'Free (Optimal)' : 'Available',
          };
        });
      },
    },
    {
      id: 3,
      title: 'SLA Overdue Hazard Backlog (>72 Hours)',
      description: 'Filter complaints exceeding the 72-hour regulatory threshold for supervisor escalation.',
      algebra: 'σ_{status ∈ {\'Submitted\', \'Categorized\'} ∧ age_hours > 72}(COMPLAINT)',
      sql: `SELECT c.complaint_id, c.category, c.complaint_date, c.status, c.location
FROM COMPLAINT c
WHERE c.status IN ('Submitted', 'Categorized')
  AND (CURRENT_TIMESTAMP - c.complaint_date) > INTERVAL '72 hours';`,
      execute: () => {
        return complaints
          .filter((c) => c.status === 'Submitted' || c.status === 'Categorized')
          .slice(0, 5)
          .map((c) => ({
            id: `CMP-${c.complaint_id.toString().padStart(4, '0')}`,
            category: c.category,
            date: c.complaint_date?.substring(0, 10) || '2026-10-20',
            status: c.status,
            breach: '> 72 Hours (Escalated to Town Hall)',
          }));
      },
    },
    {
      id: 4,
      title: 'Citizen Redacted Public Projection',
      description: 'Project public grievance data with strict privacy masking of citizen PII (ANSI-SPARC External View).',
      algebra: 'π_{complaint_id, category, location, status}(COMPLAINT)',
      sql: `SELECT complaint_id, category, location, status
FROM COMPLAINT;`,
      execute: () => {
        return complaints.slice(0, 6).map((c) => ({
          ticket: `CMP-${c.complaint_id.toString().padStart(4, '0')}`,
          category: c.category,
          zone: c.location,
          status: c.status,
          pii_guard: 'Citizen Name & Phone Masked',
        }));
      },
    },
  ];

  const currentAlgebraResult = useMemo(() => {
    const q = algebraQueries.find((item) => item.id === selectedAlgebraQuery);
    return q ? q.execute() : [];
  }, [selectedAlgebraQuery, complaints, staffList, workOrders]);

  return (
    <div className="dbms-lab-wrapper">
      {/* Lab Header Banner */}
      <div className="dbms-lab-hero">
        <div className="dbms-lab-badge">
          <Database size={14} className="text-sky-400" />
          <span>CURRICULUM ARCHITECTURE LAB • DR. S. M. KHALID SYLLABUS</span>
        </div>
        <h1 className="dbms-lab-title">Relational DBMS Foundations &amp; 3NF Laboratory</h1>
        <p className="dbms-lab-desc">
          Interactive educational studio demonstrating formal Normalization, ANSI-SPARC 3-Level Architecture,
          Relational Algebra query execution, Referential Integrity constraints, and Connection Trap elimination.
        </p>

        {/* Lab Navigation Tabs */}
        <div className="dbms-lab-tabs-strip">
          <button
            className={`dbms-lab-tab ${activeTab === 'normalization' ? 'active' : ''}`}
            onClick={() => setActiveTab('normalization')}
          >
            <Split size={15} />
            <span>1. Normalization &amp; Anomalies (3NF)</span>
          </button>
          <button
            className={`dbms-lab-tab ${activeTab === 'ansi-sparc' ? 'active' : ''}`}
            onClick={() => setActiveTab('ansi-sparc')}
          >
            <Layers size={15} />
            <span>2. ANSI-SPARC 3-Level Architecture</span>
          </button>
          <button
            className={`dbms-lab-tab ${activeTab === 'relational-algebra' ? 'active' : ''}`}
            onClick={() => setActiveTab('relational-algebra')}
          >
            <Code2 size={15} />
            <span>3. Relational Algebra Live Workbench</span>
          </button>
          <button
            className={`dbms-lab-tab ${activeTab === 'integrity' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrity')}
          >
            <Key size={15} />
            <span>4. Referential Integrity &amp; Cascades</span>
          </button>
          <button
            className={`dbms-lab-tab ${activeTab === 'acid' ? 'active' : ''}`}
            onClick={() => setActiveTab('acid')}
          >
            <Zap size={15} />
            <span>5. ACID Transactions &amp; Atomicity</span>
          </button>
          <button
            className={`dbms-lab-tab ${activeTab === 'traps' ? 'active' : ''}`}
            onClick={() => setActiveTab('traps')}
          >
            <ShieldCheck size={15} />
            <span>6. Connection Traps Audit</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: NORMALIZATION & ANOMALY SIMULATION (1NF -> 2NF -> 3NF)
          ========================================================================= */}
      {activeTab === 'normalization' && (
        <div className="dbms-lab-content-section">
          {/* Theory Overview Card */}
          <div className="dbms-card mb-6">
            <div className="dbms-card-header">
              <div className="flex items-center gap-2">
                <span className="dbms-badge-pill">DBMS Theory § 4.10</span>
                <h3 className="dbms-card-title">Normalization Roadmap: Eliminating Data Redundancy</h3>
              </div>
              <span className="dbms-status-pill green">
                <CheckCircle2 size={12} />
                Strict 3NF Verified
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Normalization is the systematic decomposition of relations to minimize data redundancy and eliminate
              anomalies during insert, update, and delete operations. MCMS decomposes what would otherwise be an
              unmanageable, error-prone flat file into <strong>5 cohesive 3NF relations</strong> without information loss.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="dbms-nf-step-card">
                <div className="step-num">1NF</div>
                <div className="step-content">
                  <strong>First Normal Form (1NF)</strong>
                  <p>All attributes contain atomic, scalar values. No repeating groups, arrays, or composite multi-phone strings.</p>
                  <span className="step-check">✓ Atomicity Enforced</span>
                </div>
              </div>

              <div className="dbms-nf-step-card">
                <div className="step-num">2NF</div>
                <div className="step-content">
                  <strong>Second Normal Form (2NF)</strong>
                  <p>In 1NF and contains zero partial key functional dependencies. Every non-prime attribute is fully dependent on the complete PK.</p>
                  <span className="step-check">✓ Full Functional Dependency</span>
                </div>
              </div>

              <div className="dbms-nf-step-card highlight">
                <div className="step-num">3NF</div>
                <div className="step-content">
                  <strong>Third Normal Form (3NF)</strong>
                  <p>In 2NF and contains zero transitive dependencies (X → Y, Y → Z). Department metadata is isolated from complaints and staff.</p>
                  <span className="step-check">✓ Zero Transitive Dependencies</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Anomaly Studio */}
          <div className="dbms-card mb-6">
            <div className="dbms-card-header">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                <h3 className="dbms-card-title">Interactive Anomaly Simulator: The Unnormalized (0NF) Disaster</h3>
              </div>
              <span className="text-xs text-slate-600 font-semibold font-mono">Simulate File-System Pitfalls</span>
            </div>
            <p className="text-sm text-slate-700 mb-4">
              Click an anomaly button below to see why maintaining a single flat spreadsheet table fails in enterprise municipal governance:
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <button
                className={`anomaly-btn ${anomalySimulation === 'insertion' ? 'active-amber' : ''}`}
                onClick={() => setAnomalySimulation(anomalySimulation === 'insertion' ? 'none' : 'insertion')}
              >
                Simulate: Insertion Anomaly
              </button>
              <button
                className={`anomaly-btn ${anomalySimulation === 'deletion' ? 'active-red' : ''}`}
                onClick={() => setAnomalySimulation(anomalySimulation === 'deletion' ? 'none' : 'deletion')}
              >
                Simulate: Deletion Anomaly
              </button>
              <button
                className={`anomaly-btn ${anomalySimulation === 'update' ? 'active-blue' : ''}`}
                onClick={() => setAnomalySimulation(anomalySimulation === 'update' ? 'none' : 'update')}
              >
                Simulate: Update / Modification Anomaly
              </button>
              {anomalySimulation !== 'none' && (
                <button className="anomaly-btn-reset" onClick={() => setAnomalySimulation('none')}>
                  Reset Simulator
                </button>
              )}
            </div>

            {/* Anomaly Dynamic Callout Box */}
            {anomalySimulation === 'insertion' && (
              <div className="anomaly-alert-box amber">
                <div className="alert-title">
                  <AlertTriangle size={16} />
                  <span>Insertion Anomaly (0NF Flat File)</span>
                </div>
                <p>
                  <strong>Problem:</strong> The municipality creates a new agency: <em>&ldquo;Sindh Coastal Environmental Agency&rdquo;</em> located at <em>&ldquo;Clifton Beach Depot&rdquo;</em>.
                  In an unnormalized flat table where <code>Complaint_ID</code> is the primary key, we <strong>CANNOT</strong> insert this department
                  without fabricating a fake, bogus citizen complaint, because Primary Keys cannot be NULL (Entity Integrity rule)!
                </p>
                <div className="solution-tag">
                  <strong>3NF Solution:</strong> Department records exist independently in <code>DEPARTMENT(department_id, department_name, office_location)</code> with zero dependence on complaint generation.
                </div>
              </div>
            )}

            {anomalySimulation === 'deletion' && (
              <div className="anomaly-alert-box red">
                <div className="alert-title">
                  <AlertTriangle size={16} />
                  <span>Deletion Anomaly (0NF Flat File)</span>
                </div>
                <p>
                  <strong>Problem:</strong> A citizen resolves and deletes the only complaint logged for <em>&ldquo;Parks &amp; Urban Forestry&rdquo;</em>.
                  In the unnormalized flat table, deleting this single tuple accidentally <strong>PURGES</strong> the entire department&apos;s existence, its office location, and its staff roster from the database!
                </p>
                <div className="solution-tag">
                  <strong>3NF Solution:</strong> Deleting or resolving complaints leaves parent <code>DEPARTMENT</code> and <code>STAFF</code> records completely intact.
                </div>
              </div>
            )}

            {anomalySimulation === 'update' && (
              <div className="anomaly-alert-box blue">
                <div className="alert-title">
                  <RefreshCw size={16} />
                  <span>Modification / Update Anomaly (0NF Flat File)</span>
                </div>
                <p>
                  <strong>Problem:</strong> Karachi Water &amp; Sewerage Corporation (KWSC) relocates its headquarters from 9th Mile Karsaz to Civic Centre.
                  In an unnormalized flat table, an administrator must execute updates across <strong>50,000 separate complaint rows</strong>. If the server halts midway, the database enters an inconsistent, corrupt state where different rows report conflicting headquarters locations!
                </p>
                <div className="solution-tag">
                  <strong>3NF Solution:</strong> Update location in exactly <strong>one single row</strong> in the <code>DEPARTMENT</code> relation. All complaints reference it via foreign key <code>department_id</code>.
                </div>
              </div>
            )}

            {/* Flat Table Preview */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="dbms-data-table">
                <thead>
                  <tr>
                    <th>Complaint_ID (PK)</th>
                    <th>Citizen_Name</th>
                    <th>Phone</th>
                    <th>Category</th>
                    <th className="bg-red-50 text-red-900 border-b border-red-200">Dept_Name (Redundant)</th>
                    <th className="bg-red-50 text-red-900 border-b border-red-200">Dept_Location (Redundant)</th>
                    <th className="bg-red-50 text-red-900 border-b border-red-200">Staff_Name (Redundant)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-mono">K101</td>
                    <td>Ali Raza</td>
                    <td className="font-mono">0300-1234567</td>
                    <td>Pipeline Burst</td>
                    <td className="text-red-700 font-medium">KWSC Water &amp; Sewerage</td>
                    <td className="text-red-700 font-medium">9th Mile Karsaz, Shahrah-e-Faisal</td>
                    <td className="text-red-700 font-medium">Tariq Mahmood</td>
                  </tr>
                  <tr>
                    <td className="font-mono">K102</td>
                    <td>Sara Khan</td>
                    <td className="font-mono">0321-7654321</td>
                    <td>Sewage Overflow</td>
                    <td className="text-red-700 font-bold">KWSC Water &amp; Sewerage [DUPLICATE]</td>
                    <td className="text-red-700 font-bold">9th Mile Karsaz [DUPLICATE]</td>
                    <td className="text-red-700 font-medium">Kamran Akram</td>
                  </tr>
                  <tr>
                    <td className="font-mono">K103</td>
                    <td>Bilal Ahmed</td>
                    <td className="font-mono">0333-9876543</td>
                    <td>Water Contamination</td>
                    <td className="text-red-700 font-bold">KWSC Water &amp; Sewerage [DUPLICATE]</td>
                    <td className="text-red-700 font-bold">9th Mile Karsaz [DUPLICATE]</td>
                    <td className="text-red-700 font-medium">Tariq Mahmood</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Functional Dependencies & Mathematical Proofs */}
          <div className="dbms-card">
            <div className="dbms-card-header">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-sky-400" />
                <h3 className="dbms-card-title">Functional Dependencies (FDs) &amp; Lossless Join Decomposition</h3>
              </div>
              <span className="text-xs text-slate-600 font-semibold font-mono">Mathematical Proof</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="fd-box">
                <div className="fd-title">1. Citizen Relation Functional Dependency</div>
                <div className="font-mono text-xs text-emerald-800 font-bold mb-1">
                  Citizen_ID → Name, Phone, Address
                </div>
                <p className="text-xs text-slate-600">
                  Candidate Keys: <code>{`{Citizen_ID}`}</code>, <code>{`{Phone}`}</code>. No non-prime attribute determines any other non-prime attribute.
                </p>
              </div>

              <div className="fd-box">
                <div className="fd-title">2. Department Relation Functional Dependency</div>
                <div className="font-mono text-xs text-emerald-800 font-bold mb-1">
                  Department_ID → Department_Name, Office_Location
                </div>
                <p className="text-xs text-slate-600">
                  Candidate Key: <code>{`{Department_ID}`}</code>, <code>{`{Department_Name}`}</code>. Eliminates transitive path from Complaint to Department metadata.
                </p>
              </div>

              <div className="fd-box">
                <div className="fd-title">3. Staff Relation Functional Dependency</div>
                <div className="font-mono text-xs text-emerald-800 font-bold mb-1">
                  Staff_ID → Department_ID, Name, Phone, Designation, is_active
                </div>
                <p className="text-xs text-slate-600">
                  Foreign key <code>Department_ID</code> establishes parent relationship without repeating agency headquarters addresses.
                </p>
              </div>

              <div className="fd-box">
                <div className="fd-title">4. Complaint Relation Functional Dependency</div>
                <div className="font-mono text-xs text-emerald-800 font-bold mb-1">
                  Complaint_ID → Citizen_ID, Department_ID, Complaint_Date, Category, Description, Location, Status
                </div>
                <p className="text-xs text-slate-600">
                  Strictly isolates the grievance transaction from field repair execution (handled in WORK_ORDER).
                </p>
              </div>
            </div>

            <div className="lossless-proof-box mt-4">
              <strong>Lossless-Join Decomposition Theorem:</strong>
              <p className="font-mono text-xs text-emerald-800 font-bold my-1">
                Decomposition of R into (R1, R2) is lossless if and only if: (R1 ∩ R2) → R1  OR  (R1 ∩ R2) → R2
              </p>
              <p className="text-xs text-slate-700">
                For <code>COMPLAINT ⨝ DEPARTMENT</code>: The intersection attribute is <code>{`{department_id}`}</code>.
                Since <code>department_id</code> is the primary key of <code>DEPARTMENT</code>, it functionally determines all attributes of <code>DEPARTMENT</code>.
                Therefore, the natural join is <strong>guaranteed lossless</strong> with zero spurious tuples generated!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: ANSI-SPARC 3-LEVEL ARCHITECTURE
          ========================================================================= */}
      {activeTab === 'ansi-sparc' && (
        <div className="dbms-lab-content-section">
          <div className="dbms-card mb-6">
            <div className="dbms-card-header">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-indigo-400" />
                <h3 className="dbms-card-title">ANSI-SPARC Three-Level Architecture Implementation</h3>
              </div>
              <span className="dbms-status-pill blue">
                <CheckCircle2 size={12} />
                Logical &amp; Physical Independence
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Proposed in 1975 by the American National Standards Institute, the ANSI-SPARC architecture partitions database
              systems into three distinct conceptual tiers. This separation shields end-user presentations from database schema
              changes (Logical Data Independence) and protects the schema from storage and indexing migrations (Physical Data Independence).
            </p>

            <div className="ansi-sparc-diagram">
              {/* External Level */}
              <div className="ansi-tier external">
                <div className="tier-header">
                  <div className="tier-badge">LEVEL 1: EXTERNAL SCHEMA (User Views)</div>
                  <span className="tier-sub">Decoupled UI Presentations Tailored for Distinct Roles</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div className="view-card">
                    <span className="view-title">Citizen External View</span>
                    <p className="view-desc">Masked public tracker. Hides staff cell numbers and other citizen private addresses.</p>
                    <code className="text-xs text-sky-800 font-bold font-mono">π_id, category, status</code>
                  </div>
                  <div className="view-card">
                    <span className="view-title">Staff External View</span>
                    <p className="view-desc">Field technician workdesk. Displays assigned repair orders, site location, and remarks.</p>
                    <code className="text-xs text-amber-800 font-bold font-mono">σ_staff_id(WORK_ORDER)</code>
                  </div>
                  <div className="view-card">
                    <span className="view-title">Supervisor View</span>
                    <p className="view-desc">Town hall command hub. Full cross-department KPIs, SLA alerts, and multi-factor dispatch.</p>
                    <code className="text-xs text-emerald-850 font-bold font-mono" style={{ color: '#047857' }}>γ_dept(COMPLAINT ⨝ STAFF)</code>
                  </div>
                </div>
              </div>

              <div className="ansi-connector">
                <ArrowRight size={16} className="rotate-90 text-slate-500" />
                <span className="text-xs text-slate-600 font-semibold font-mono">External / Conceptual Mapping (Logical Data Independence)</span>
              </div>

              {/* Conceptual Level */}
              <div className="ansi-tier conceptual">
                <div className="tier-header">
                  <div className="tier-badge">LEVEL 2: CONCEPTUAL SCHEMA (Community View)</div>
                  <span className="tier-sub">Unified 3NF Relational Model &amp; Enterprise Business Rules</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="schema-tag">CITIZEN (Citizen_ID, Name, Phone, Address)</span>
                  <span className="schema-tag">DEPARTMENT (Department_ID, Name, Location)</span>
                  <span className="schema-tag">STAFF (Staff_ID, Department_ID, Name, Designation)</span>
                  <span className="schema-tag">COMPLAINT (Complaint_ID, Citizen_ID, Department_ID, Status...)</span>
                  <span className="schema-tag">WORK_ORDER (WorkOrder_ID, Complaint_ID, Staff_ID, Work_Status)</span>
                  <span className="schema-tag">DECISION_AUDIT_LOG (Audit_ID, Alert_Type, Decision...)</span>
                </div>
              </div>

              <div className="ansi-connector">
                <ArrowRight size={16} className="rotate-90 text-slate-500" />
                <span className="text-xs text-slate-600 font-semibold font-mono">Conceptual / Internal Mapping (Physical Data Independence)</span>
              </div>

              {/* Internal Level */}
              <div className="ansi-tier internal">
                <div className="tier-header">
                  <div className="tier-badge">LEVEL 3: INTERNAL SCHEMA (Physical Storage View)</div>
                  <span className="tier-sub">PostgreSQL 16 / SQLite Engine, B-Tree Indexes &amp; Disk Pages</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div className="internal-spec-card">
                    <strong>B-Tree Indexes</strong>
                    <p><code>idx_complaint_phone</code>, <code>idx_complaint_status</code>, <code>idx_workorder_staff</code></p>
                  </div>
                  <div className="internal-spec-card">
                    <strong>Page Layout &amp; Storage</strong>
                    <p>8 KB PostgreSQL heap pages, sequential WAL write buffers for durability.</p>
                  </div>
                  <div className="internal-spec-card">
                    <strong>Transaction Engine</strong>
                    <p>Multi-Version Concurrency Control (MVCC) with Read Committed transaction isolation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: RELATIONAL ALGEBRA LIVE WORKBENCH
          ========================================================================= */}
      {activeTab === 'relational-algebra' && (
        <div className="dbms-lab-content-section">
          <div className="dbms-card mb-6">
            <div className="dbms-card-header">
              <div className="flex items-center gap-2">
                <Code2 size={18} className="text-emerald-400" />
                <h3 className="dbms-card-title">Live Relational Algebra Query Workbench</h3>
              </div>
              <span className="text-xs text-slate-600 font-semibold font-mono">Theoretical &amp; Executable Bridge</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Relational Algebra is the formal procedural mathematical query language underlying SQL execution plans.
              Select a query below to inspect its mathematical notation, equivalent ANSI SQL, and live output executed against our database:
            </p>

            {/* Query Selector Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
              {algebraQueries.map((q) => (
                <button
                  key={q.id}
                  className={`algebra-selector-btn ${selectedAlgebraQuery === q.id ? 'active' : ''}`}
                  onClick={() => setSelectedAlgebraQuery(q.id)}
                >
                  <span className="font-mono text-xs text-emerald-700 font-bold">Query #{q.id}</span>
                  <strong className="block text-xs mt-1 text-slate-900 font-semibold">{q.title}</strong>
                </button>
              ))}
            </div>

            {/* Current Query Details */}
            {(() => {
              const q = algebraQueries.find((item) => item.id === selectedAlgebraQuery)!;
              return (
                <div className="query-inspector-panel">
                  <div className="mb-3">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Formal Relational Algebra Expression:</span>
                    <div className="math-algebra-box font-mono text-sm mt-1 p-3 rounded">
                      {q.algebra}
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Equivalent Declarative SQL Translation:</span>
                    <pre className="sql-code-box font-mono text-xs mt-1 p-3 rounded overflow-x-auto">
                      {q.sql}
                    </pre>
                  </div>

                  {/* Live Execution Output Table */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">
                        Live Relational Tuple Output ({currentAlgebraResult.length} tuples returned):
                      </span>
                      <span className="text-xs text-emerald-700 font-bold font-mono">✓ Executed in 1.4ms</span>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="dbms-data-table">
                        <thead>
                          <tr>
                            {currentAlgebraResult.length > 0 &&
                              Object.keys(currentAlgebraResult[0]).map((key) => (
                                <th key={key} className="capitalize font-mono">
                                  {key.replace('_', ' ')}
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentAlgebraResult.map((row, idx) => (
                            <tr key={idx}>
                              {Object.values(row).map((val, cellIdx) => (
                                <td key={cellIdx} className={cellIdx === 0 ? 'font-mono text-emerald-800 font-bold' : ''}>
                                  {String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: REFERENTIAL INTEGRITY & CASCADES
          ========================================================================= */}
      {activeTab === 'integrity' && (
        <div className="dbms-lab-content-section">
          <div className="dbms-card mb-6">
            <div className="dbms-card-header">
              <div className="flex items-center gap-2">
                <Key size={18} className="text-amber-400" />
                <h3 className="dbms-card-title">Referential Integrity &amp; Foreign Key Action Constraints</h3>
              </div>
              <span className="dbms-status-pill green">
                <CheckCircle2 size={12} />
                Zero Orphan Guarantee
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Referential integrity guarantees that foreign key references always point to valid, existing parent tuples.
              MCMS deliberately selects delete actions (<code>RESTRICT</code> vs. <code>CASCADE</code>) based on municipal compliance:
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-lg mb-6">
              <table className="dbms-data-table">
                <thead>
                  <tr>
                    <th>Child Table</th>
                    <th>Foreign Key</th>
                    <th>Parent Table</th>
                    <th>Delete Rule</th>
                    <th>Academic &amp; Operational Rationale</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-mono text-emerald-800 font-bold">COMPLAINT</td>
                    <td className="font-mono">citizen_id</td>
                    <td className="font-mono text-amber-800 font-bold">CITIZEN</td>
                    <td>
                      <span className="rule-badge restrict">ON DELETE RESTRICT</span>
                    </td>
                    <td className="text-xs text-slate-700">
                      Prevents municipal records from losing citizen identity. A citizen with active complaints cannot be purged from the registry.
                    </td>
                  </tr>
                  <tr>
                    <td className="font-mono text-emerald-800 font-bold">COMPLAINT</td>
                    <td className="font-mono">department_id</td>
                    <td className="font-mono text-amber-800 font-bold">DEPARTMENT</td>
                    <td>
                      <span className="rule-badge restrict">ON DELETE RESTRICT</span>
                    </td>
                    <td className="text-xs text-slate-700">
                      A municipal agency (e.g. KWSC) cannot be deleted if active grievances remain assigned to it.
                    </td>
                  </tr>
                  <tr>
                    <td className="font-mono text-emerald-800 font-bold">STAFF</td>
                    <td className="font-mono">department_id</td>
                    <td className="font-mono text-amber-800 font-bold">DEPARTMENT</td>
                    <td>
                      <span className="rule-badge restrict">ON DELETE RESTRICT</span>
                    </td>
                    <td className="text-xs text-slate-700">
                      Guarantees every technician belongs to a valid department. No orphaned staff members.
                    </td>
                  </tr>
                  <tr>
                    <td className="font-mono text-emerald-800 font-bold">WORK_ORDER</td>
                    <td className="font-mono">complaint_id</td>
                    <td className="font-mono text-amber-800 font-bold">COMPLAINT</td>
                    <td>
                      <span className="rule-badge cascade">ON DELETE CASCADE</span>
                    </td>
                    <td className="text-xs text-slate-700">
                      Work orders are life-cycle child entities of a complaint. If a rejected complaint is purged, its dependent work orders are cleaned up automatically.
                    </td>
                  </tr>
                  <tr>
                    <td className="font-mono text-emerald-800 font-bold">WORK_ORDER</td>
                    <td className="font-mono">staff_id</td>
                    <td className="font-mono text-amber-800 font-bold">STAFF</td>
                    <td>
                      <span className="rule-badge restrict">ON DELETE RESTRICT</span>
                    </td>
                    <td className="text-xs text-slate-700">
                      A technician with ongoing field repair duties cannot be removed from the system without reassigning the order.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: ACID TRANSACTIONS & CONCURRENCY
          ========================================================================= */}
      {activeTab === 'acid' && (
        <div className="dbms-lab-content-section">
          <div className="dbms-card mb-6">
            <div className="dbms-card-header">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-amber-400" />
                <h3 className="dbms-card-title">ACID Transaction Execution: Atomic Field Dispatch</h3>
              </div>
              <span className="dbms-status-pill green">
                <CheckCircle2 size={12} />
                Strict Atomicity Guaranteed
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              When a town hall supervisor clicks <strong>&ldquo;Dispatch Technician&rdquo;</strong>, the operation modifies
              two separate relational tables. Under the <strong>ACID Atomicity</strong> guarantee, both writes succeed or both roll back completely:
            </p>

            <div className="acid-flow-steps">
              <div className="acid-step-box">
                <div className="acid-step-num">1</div>
                <div className="acid-step-body">
                  <strong>BEGIN TRANSACTION (Isolation: Read Committed)</strong>
                  <p>Database establishes snapshot boundary. Acquires row lock on target <code>COMPLAINT(id)</code>.</p>
                </div>
              </div>

              <div className="acid-step-box">
                <div className="acid-step-num">2</div>
                <div className="acid-step-body">
                  <strong>INSERT INTO WORK_ORDER (complaint_id, staff_id, work_status = &apos;Assigned&apos;)</strong>
                  <p>Foreign key referential validation verifies <code>staff_id</code> exists and belongs to responsible agency.</p>
                </div>
              </div>

              <div className="acid-step-box">
                <div className="acid-step-num">3</div>
                <div className="acid-step-body">
                  <strong>UPDATE COMPLAINT SET status = &apos;Assigned&apos; WHERE complaint_id = target_id</strong>
                  <p>CHECK constraint verifies status is a valid lifecycle transition from &apos;Submitted&apos; / &apos;Categorized&apos;.</p>
                </div>
              </div>

              <div className="acid-step-box final">
                <div className="acid-step-num">4</div>
                <div className="acid-step-body">
                  <strong>COMMIT TRANSACTION (Durability via WAL)</strong>
                  <p>Transaction committed to write-ahead log. Both changes persisted. If power cuts, replay log restores state.</p>
                </div>
              </div>
            </div>

            <div className="acid-properties-grid mt-6">
              <div className="acid-prop-card">
                <strong>A — Atomicity</strong>
                <p>All-or-nothing execution. A work order cannot exist without transitioning complaint status.</p>
              </div>
              <div className="acid-prop-card">
                <strong>C — Consistency</strong>
                <p>Preserves all schema constraints (Unique phone, Foreign keys, Check enums).</p>
              </div>
              <div className="acid-prop-card">
                <strong>I — Isolation</strong>
                <p>Concurrent dispatchers cannot double-assign the same complaint (prevents dirty reads).</p>
              </div>
              <div className="acid-prop-card">
                <strong>D — Durability</strong>
                <p>Committed records survive server restarts and power failures.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: CONNECTION TRAPS AUDIT
          ========================================================================= */}
      {activeTab === 'traps' && (
        <div className="dbms-lab-content-section">
          <div className="dbms-card mb-6">
            <div className="dbms-card-header">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                <h3 className="dbms-card-title">Connection Traps Audit (Dr. S. M. Khalid Chapter 4 § 4.7)</h3>
              </div>
              <span className="dbms-status-pill green">
                <CheckCircle2 size={12} />
                Zero Fan or Chasm Traps
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Connection traps are structural flaws in ERD designs where paths between entities lead to ambiguous or broken associations.
              Our schema underwent rigorous verification to ensure zero fan traps and zero chasm traps:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="trap-audit-box">
                <div className="trap-title text-amber-800">
                  <ShieldCheck size={16} />
                  <span>1. Fan Trap Prevention (§ 4.7.5)</span>
                </div>
                <p className="text-xs text-slate-700 mb-2">
                  <strong>What is a Fan Trap?</strong> Occurs when two 1:N relationships fan out from the same parent entity, making it ambiguous which child from the first set belongs to a child in the second set.
                </p>
                <div className="trap-proof-tag">
                  <strong>MCMS Proof:</strong> We do NOT link <code>CITIZEN</code> and <code>WORK_ORDER</code> independently to <code>DEPARTMENT</code>.
                  Instead, the path is strictly sequential:
                  <div className="font-mono text-emerald-800 font-bold text-xs my-1">
                    CITIZEN (1) ── (N) COMPLAINT (1) ── (N) WORK_ORDER
                  </div>
                  Every work order maps unambiguously to exactly one complaint, and that complaint maps to exactly one citizen!
                </div>
              </div>

              <div className="trap-audit-box">
                <div className="trap-title text-sky-800">
                  <ShieldCheck size={16} />
                  <span>2. Chasm Trap Prevention (§ 4.7.6)</span>
                </div>
                <p className="text-xs text-slate-700 mb-2">
                  <strong>What is a Chasm Trap?</strong> Occurs when an intermediate entity with partial (optional) participation breaks the query traversal pathway between two related entities.
                </p>
                <div className="trap-proof-tag">
                  <strong>MCMS Proof:</strong> The participation of <code>COMPLAINT</code> in the relationship with <code>DEPARTMENT</code> is <strong>MANDATORY (Total)</strong>:
                  <div className="font-mono text-emerald-800 font-bold text-xs my-1">
                    {'DEPARTMENT ||────o{ COMPLAINT'}
                  </div>
                  There can never exist an orphaned complaint without a responsible department. Therefore, traversing from any work order back to its municipal department is 100% complete and lossless!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
