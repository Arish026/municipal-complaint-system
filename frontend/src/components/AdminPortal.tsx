'use client';

import React, { useState, useMemo } from 'react';
import {
  Department,
  Staff,
  Complaint,
  WorkOrder,
  DecisionAuditLog,
  SystemStats,
  SupervisorDecision,
} from '../types';
import { rankStaffForComplaint, StaffAssignmentRecommendation } from '../lib/assignmentEngine';
import {
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  ShieldAlert,
  Building2,
  Layers,
  Droplets,
  Construction,
  Trash2,
  Lightbulb,
  Trees,
  Activity,
  Zap,
  MapPin,
  User,
  Wrench,
  Check,
  ChevronRight,
  Sparkles,
  Sliders,
  Compass,
  Database,
} from 'lucide-react';

interface AdminPortalProps {
  stats: SystemStats;
  departments: Department[];
  complaints: Complaint[];
  staffList: Staff[];
  workOrders: WorkOrder[];
  auditLogs: DecisionAuditLog[];
  onResolveDecision: (auditId: number, decision: SupervisorDecision) => void;
  onAssignStaff?: (complaintId: number, staffId: number, notes?: string) => void;
}

const DEPT_CONFIG: Record<number, { color: string; icon: React.ReactNode }> = {
  1: { color: '#0f2b18', icon: <Droplets size={15} /> },
  2: { color: '#784803', icon: <Construction size={15} /> },
  3: { color: '#1f3325', icon: <Trash2 size={15} /> },
  4: { color: '#784803', icon: <Lightbulb size={15} /> },
  5: { color: '#7f1d1d', icon: <ShieldAlert size={15} /> },
  6: { color: '#0f2b18', icon: <Trees size={15} /> },
};

export const AdminPortal: React.FC<AdminPortalProps> = ({
  stats,
  departments,
  complaints,
  staffList,
  workOrders,
  auditLogs,
  onResolveDecision,
  onAssignStaff,
}) => {
  const [activeAlertTab, setActiveAlertTab] = useState<'pending' | 'resolved'>('pending');

  // Grievance selected for Multi-Factor Dispatch
  const unassignedComplaints = useMemo(
    () => complaints.filter((c) => c.status === 'Submitted' || c.status === 'Categorized'),
    [complaints]
  );

  const [selectedDispatchComplaintId, setSelectedDispatchComplaintId] = useState<number>(
    unassignedComplaints[0]?.complaint_id || complaints[0]?.complaint_id || 1
  );

  const currentDispatchComplaint = useMemo(
    () => complaints.find((c) => c.complaint_id === selectedDispatchComplaintId) || complaints[0],
    [complaints, selectedDispatchComplaintId]
  );

  // Multi-Factor Ranked Recommendations
  const rankedTechnicians = useMemo(() => {
    if (!currentDispatchComplaint) return [];
    return rankStaffForComplaint(currentDispatchComplaint, staffList, workOrders);
  }, [currentDispatchComplaint, staffList, workOrders]);

  const bestMatchCandidate = rankedTechnicians[0] || null;

  const pendingAlerts = auditLogs.filter((l) => l.supervisor_decision === 'Pending');
  const resolvedAlerts = auditLogs.filter((l) => l.supervisor_decision !== 'Pending');

  const departmentStats = departments.map((dept) => {
    const deptComplaints = complaints.filter((c) => c.department_id === dept.department_id);
    const resolved = deptComplaints.filter(
      (c) => c.status === 'Resolved' || c.status === 'Verified' || c.status === 'Closed'
    ).length;
    const total = deptComplaints.length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;
    const config = DEPT_CONFIG[dept.department_id] || {
      color: '#0f2b18',
      icon: <Building2 size={15} />,
    };

    return {
      ...dept,
      total,
      resolved,
      resolutionRate,
      ...config,
    };
  });

  const handleDispatch = (staffId: number, techName: string) => {
    if (!onAssignStaff || !currentDispatchComplaint) return;
    const notes = `Dispatched to ${techName} via Karachi Multi-Factor Decision Engine.`;
    onAssignStaff(currentDispatchComplaint.complaint_id, staffId, notes);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. Overview Header & High-Contrast KPIs */}
      <div className="civic-card">
        <div className="civic-card-header">
          <div>
            <span className="hero-pill" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
              Command Center
            </span>
            <h2 className="civic-card-title">Municipal Dispatch &amp; Operations Center</h2>
            <p className="civic-card-desc">
              Multi-factor technician assignment, SLA compliance metrics, and escalation alerts.
            </p>
          </div>
        </div>

        {/* High-Contrast KPI Cards */}
        <div className="stats-grid" style={{ marginTop: '0.75rem' }}>
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Total Grievances</span>
              <Layers size={16} color="var(--primary-moss)" />
            </div>
            <div className="stat-value">{stats.totalComplaints}</div>
            <span className="stat-subtext">Registered across Karachi</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Active Field Orders</span>
              <Clock size={16} color="#784803" />
            </div>
            <div className="stat-value">{stats.pendingCount + stats.inProgressCount}</div>
            <span className="stat-subtext">Assigned or under repair</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Resolved Rate</span>
              <CheckCircle2 size={16} color="#064e3b" />
            </div>
            <div className="stat-value" style={{ color: '#064e3b' }}>
              {stats.totalComplaints > 0
                ? Math.round((stats.resolvedCount / stats.totalComplaints) * 100)
                : 0}
              %
            </div>
            <span className="stat-subtext">{stats.resolvedCount} completed jobs</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Escalation Alerts</span>
              <AlertTriangle size={16} color="#7f1d1d" />
            </div>
            <div className="stat-value" style={{ color: '#7f1d1d' }}>
              {stats.overdueCount}
            </div>
            <span className="stat-subtext">Overdue or capacity alerts</span>
          </div>
        </div>
      </div>

      {/* 2. MULTI-FACTOR FIELD DISPATCH STATION */}
      <div className="civic-card dispatch-station-card">
        <div className="civic-card-header" style={{ flexWrap: 'wrap', gap: '1rem', borderBottom: '2px solid var(--border-medium)', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <span className="hero-pill" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                Multi-Factor Assignment Engine
              </span>
              <span className="hero-pill" style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Database size={11} />
                <span>ACID Atomic Dispatch</span>
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                FR-04 &amp; FR-05
              </span>
            </div>
            <h3 className="civic-card-title">Intelligent Field Crew Dispatch</h3>
            <p className="civic-card-desc">
              Work order allocation computed across <strong>4 Operational Factors</strong>: Workload Queue (35%), Specialization Match (30%), Geographic Depot Proximity (20%), and SLA Urgency (15%).
            </p>
          </div>

          {bestMatchCandidate && currentDispatchComplaint?.status !== 'Resolved' && (
            <button
              id="btn-auto-dispatch-best"
              className="btn-pill-primary"
              style={{ background: '#064e3b', borderColor: '#047857', padding: '0.55rem 1.1rem' }}
              onClick={() => handleDispatch(bestMatchCandidate.staff.staff_id, bestMatchCandidate.staff.name)}
            >
              <Zap size={16} />
              <span>Auto-Dispatch Best Fit ({bestMatchCandidate.compositeScore}% Fit)</span>
            </button>
          )}
        </div>

        {/* Grievance Selection Strip */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Select Grievance To Dispatch ({unassignedComplaints.length} Unassigned / {complaints.length} Total):
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Click ticket to calculate multi-factor rankings
            </span>
          </div>

          <div className="dispatch-ticket-selector-strip">
            {complaints.map((c) => {
              const isSelected = c.complaint_id === selectedDispatchComplaintId;
              const isPending = c.status === 'Submitted' || c.status === 'Categorized';

              return (
                <button
                  key={c.complaint_id}
                  type="button"
                  className={`dispatch-selector-chip ${isSelected ? 'active' : ''} ${isPending ? 'is-pending' : ''}`}
                  onClick={() => setSelectedDispatchComplaintId(c.complaint_id)}
                >
                  <span className="chip-code">CMP-{c.complaint_id.toString().padStart(4, '0')}</span>
                  <span className="chip-category">{c.category}</span>
                  <span className={`chip-status-pill status-${c.status.toLowerCase().replace(/\s+/g, '')}`}>
                    {c.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dispatch Console Viewport */}
        {currentDispatchComplaint && (
          <div className="dispatch-console-layout" style={{ marginTop: '1.25rem' }}>
            {/* Left: Grievance Context Card */}
            <div className="dispatch-complaint-summary">
              <div className="summary-banner">
                <span className="summary-badge">Selected Grievance</span>
                <span className={`status-pill status-${currentDispatchComplaint.status.toLowerCase().replace(/\s+/g, '')}`}>
                  {currentDispatchComplaint.status}
                </span>
              </div>

              <h4 className="summary-title">{currentDispatchComplaint.category}</h4>
              <div className="summary-code">Ticket ID: CMP-{currentDispatchComplaint.complaint_id.toString().padStart(4, '0')}</div>

              <div className="summary-field">
                <MapPin size={13} className="field-icon" />
                <div>
                  <div className="field-label">Location &amp; District</div>
                  <div className="field-value">{currentDispatchComplaint.location}</div>
                </div>
              </div>

              <div className="summary-field">
                <Building2 size={13} className="field-icon" />
                <div>
                  <div className="field-label">Assigned Agency</div>
                  <div className="field-value">{currentDispatchComplaint.department_name}</div>
                </div>
              </div>

              <div className="summary-field">
                <User size={13} className="field-icon" />
                <div>
                  <div className="field-label">Resident Reporter</div>
                  <div className="field-value">
                    {currentDispatchComplaint.citizen_name || 'Resident'} ({currentDispatchComplaint.citizen_phone || 'Karachi'})
                  </div>
                </div>
              </div>

              <div className="summary-desc-box">
                <div className="desc-heading">Reported Hazard:</div>
                <p className="desc-text">{currentDispatchComplaint.description}</p>
              </div>

              {currentDispatchComplaint.work_order && (
                <div className="linked-order-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#064e3b', fontWeight: 700 }}>
                    <CheckCircle2 size={14} />
                    <span>Dispatched Order #{currentDispatchComplaint.work_order.work_order_id}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', marginTop: '0.2rem' }}>
                    Officer: <strong>{currentDispatchComplaint.work_order.staff_name}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Multi-Factor Candidates Ranked */}
            <div className="dispatch-candidates-container">
              <div className="candidates-header">
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Candidate Field Technicians Ranked by Fit Score
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Composite rating evaluates workload queue, skill relevance, proximity &amp; hazard SLA.
                  </span>
                </div>
              </div>

              <div className="candidates-list">
                {rankedTechnicians.slice(0, 4).map((cand) => {
                  const isTopMatch = cand.rank === 1;

                  return (
                    <div
                      key={cand.staff.staff_id}
                      className={`candidate-card ${isTopMatch ? 'top-match' : ''}`}
                    >
                      <div className="candidate-top-row">
                        <div className="candidate-identity">
                          <div className="rank-badge">#{cand.rank}</div>
                          <div>
                            <div className="staff-name-text">{cand.staff.name}</div>
                            <div className="staff-role-text">
                              {cand.staff.designation} • {cand.staff.phone}
                            </div>
                          </div>
                        </div>

                        {/* Composite Score Pill */}
                        <div className="fit-score-wrapper">
                          <div
                            className={`fit-score-badge score-tier-${cand.recommendationTier.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <span className="score-number">{cand.compositeScore}%</span>
                            <span className="score-tier-label">{cand.recommendationTier}</span>
                          </div>
                        </div>
                      </div>

                      {/* 4 Multi-Factor Breakdown Badges */}
                      <div className="factors-row">
                        <div className="factor-chip" title="Active non-completed work orders assigned to technician">
                          <span className="factor-label">Queue</span>
                          <strong className="factor-val">
                            {cand.activeTicketCount === 0 ? '0 Jobs (100% capacity)' : `${cand.activeTicketCount} Active Jobs (${cand.workloadScore}%)`}
                          </strong>
                        </div>

                        <div className="factor-chip" title="Designation and skill match with complaint category">
                          <span className="factor-label">Skill</span>
                          <strong className="factor-val">{cand.specializationNote}</strong>
                        </div>

                        <div className="factor-chip" title="Estimated distance from technician depot">
                          <span className="factor-label">Proximity</span>
                          <strong className="factor-val">
                            {cand.estimatedDistanceKm} km ({cand.zoneName.split('(')[0].trim()})
                          </strong>
                        </div>

                        <div className="factor-chip" title="SLA Urgency and hazard matching">
                          <span className="factor-label">Urgency</span>
                          <strong className="factor-val">
                            {cand.urgencyLevel} Priority ({cand.urgencyScore}%)
                          </strong>
                        </div>
                      </div>

                      <div className="candidate-action-row">
                        <span className="rationale-text">{cand.rationale}</span>
                        <button
                          type="button"
                          className="btn-pill-primary btn-sm"
                          style={{
                            background: isTopMatch ? '#064e3b' : 'var(--primary-moss)',
                            whiteSpace: 'nowrap',
                          }}
                          onClick={() => handleDispatch(cand.staff.staff_id, cand.staff.name)}
                        >
                          <Wrench size={13} />
                          <span>Dispatch {cand.staff.name.split(' ')[0]}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Decision Intelligence Escalation Feed */}
      <div className="civic-card">
        <div className="civic-card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="hero-pill" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}>
              Decision Intelligence
            </span>
            <h3 className="civic-card-title">Supervisory Escalation &amp; Audit Feed</h3>
            <p className="civic-card-desc">
              Automated surveillance alerts for overdue repairs (&gt; 72h) and crew workload imbalances.
            </p>
          </div>

          <div className="segmented-toggle">
            <button
              id="btn-alert-tab-pending"
              className={`segmented-toggle-btn ${activeAlertTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveAlertTab('pending')}
            >
              Pending Reviews ({pendingAlerts.length})
            </button>
            <button
              id="btn-alert-tab-resolved"
              className={`segmented-toggle-btn ${activeAlertTab === 'resolved' ? 'active' : ''}`}
              onClick={() => setActiveAlertTab('resolved')}
            >
              Audit Trail ({resolvedAlerts.length})
            </button>
          </div>
        </div>

        {/* Pending Alerts */}
        {activeAlertTab === 'pending' ? (
          pendingAlerts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {pendingAlerts.map((alert) => (
                <div key={alert.audit_id} className="civic-card alert-item-card">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="status-pill status-overdue">
                        <AlertTriangle size={12} />
                        <span>{alert.alert_type}</span>
                      </span>
                      <strong style={{ fontSize: '0.9rem' }}>
                        CMP-{alert.complaint_id.toString().padStart(4, '0')}
                      </strong>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Flagged: {new Date(alert.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-body)', margin: '0.45rem 0' }}>
                    {alert.explanation}
                  </p>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Suggested Strategy: <strong>{alert.suggested_action}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button
                      id={`btn-reject-alert-${alert.audit_id}`}
                      className="btn-pill-secondary btn-sm"
                      onClick={() => onResolveDecision(alert.audit_id, 'Rejected')}
                    >
                      <XCircle size={14} />
                      <span>Dismiss Recommendation</span>
                    </button>
                    <button
                      id={`btn-approve-alert-${alert.audit_id}`}
                      className="btn-pill-primary btn-sm"
                      style={{ background: '#064e3b' }}
                      onClick={() => onResolveDecision(alert.audit_id, 'Approved')}
                    >
                      <CheckCircle2 size={14} />
                      <span>Authorize Protocol</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <CheckCircle2 size={36} color="#064e3b" style={{ margin: '0 auto 0.5rem' }} />
              <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '1rem' }}>
                All Operational Alerts Cleared
              </strong>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                No SLA violations or critical bottlenecks detected in active queues.
              </span>
            </div>
          )
        ) : (
          /* Resolved Alerts Audit Trail */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {resolvedAlerts.map((alert) => (
              <div key={alert.audit_id} className="civic-card audit-item-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      className={`status-pill ${
                        alert.supervisor_decision === 'Approved' ? 'status-resolved' : 'status-overdue'
                      }`}
                    >
                      {alert.supervisor_decision === 'Approved' ? (
                        <CheckCircle2 size={11} />
                      ) : (
                        <XCircle size={11} />
                      )}
                      <span>{alert.supervisor_decision}</span>
                    </span>
                    <strong style={{ fontSize: '0.85rem' }}>
                      CMP-{alert.complaint_id.toString().padStart(4, '0')}
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Decided:{' '}
                    {alert.decision_timestamp
                      ? new Date(alert.decision_timestamp).toLocaleDateString()
                      : 'Logged'}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.35rem 0' }}>
                  {alert.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Department Performance Capacities */}
      <div className="civic-card">
        <div className="civic-card-header">
          <div>
            <span className="hero-pill">FR-08 Governance</span>
            <h3 className="civic-card-title">Department Workload &amp; Resolution Ratios</h3>
            <p className="civic-card-desc">
              Capacity monitoring across all 6 Karachi municipal services.
            </p>
          </div>
        </div>

        <div className="department-analytics-grid">
          {departmentStats.map((dept) => (
            <div key={dept.department_id} className="dept-stat-card">
              <div className="dept-stat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--primary-tint)',
                      color: 'var(--primary-moss)',
                    }}
                  >
                    {dept.icon}
                  </span>
                  <strong style={{ fontSize: '0.86rem', color: 'var(--text-main)' }}>
                    {dept.department_name.split('—')[0].trim()}
                  </strong>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {dept.resolutionRate}%
                </span>
              </div>

              <div className="resolution-progress-bar">
                <div
                  className="resolution-progress-fill"
                  style={{
                    width: `${dept.resolutionRate}%`,
                    background: dept.resolutionRate >= 70 ? '#064e3b' : '#784803',
                  }}
                />
              </div>

              <div className="dept-stat-footer">
                <span>{dept.resolved} Resolved</span>
                <span>{dept.total} Total Grievances</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
