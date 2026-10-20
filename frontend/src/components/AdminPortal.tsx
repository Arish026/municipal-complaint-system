'use client';

import React, { useState } from 'react';
import { Department, Complaint, WorkOrder, DecisionAuditLog, SystemStats, SupervisorDecision } from '../types';
import {
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  ShieldAlert,
  Building2,
  Users,
  Layers,
} from 'lucide-react';

interface AdminPortalProps {
  stats: SystemStats;
  departments: Department[];
  complaints: Complaint[];
  auditLogs: DecisionAuditLog[];
  onResolveDecision: (auditId: number, decision: SupervisorDecision) => void;
}

const DEPT_COLORS: Record<number, { bar: string; text: string }> = {
  1: { bar: '#0284c7', text: '#0369a1' },
  2: { bar: '#d97706', text: '#b45309' },
  3: { bar: '#059669', text: '#047857' },
  4: { bar: '#ca8a04', text: '#a16207' },
  5: { bar: '#e11d48', text: '#be123c' },
  6: { bar: '#0d9488', text: '#0f766e' },
};

export const AdminPortal: React.FC<AdminPortalProps> = ({
  stats,
  departments,
  complaints,
  auditLogs,
  onResolveDecision,
}) => {
  const [activeAlertTab, setActiveAlertTab] = useState<'pending' | 'resolved'>('pending');

  const pendingAlerts = auditLogs.filter((l) => l.supervisor_decision === 'Pending');
  const resolvedAlerts = auditLogs.filter((l) => l.supervisor_decision !== 'Pending');

  const departmentStats = departments.map((dept) => {
    const deptComplaints = complaints.filter((c) => c.department_id === dept.department_id);
    const resolved = deptComplaints.filter(
      (c) => c.status === 'Resolved' || c.status === 'Verified' || c.status === 'Closed'
    ).length;
    const total = deptComplaints.length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;
    return {
      ...dept,
      total,
      resolved,
      resolutionRate,
      colors: DEPT_COLORS[dept.department_id] || { bar: '#2563eb', text: '#1d4ed8' },
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Overview Header */}
      <div>
        <span className="hero-pill">Town Hall Analytics</span>
        <h2 className="hero-title">
          Supervisor Command Center
          <span className="urdu-text" style={{ fontSize: '1.4rem', color: 'var(--primary-blue)', fontWeight: 600, marginLeft: '0.75rem' }}>
            انتظامی کنٹرول و جائزہ
          </span>
        </h2>
        <p className="hero-desc">
          Monitor municipal resolution rates, oversee supervisor escalation alerts, and inspect department performance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div className="stat-top">
            <span className="stat-label">Total Grievances</span>
            <Layers size={18} color="#2563eb" />
          </div>
          <div className="stat-value">{stats.totalComplaints}</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #d97706' }}>
          <div className="stat-top">
            <span className="stat-label">Active in Queue</span>
            <Clock size={18} color="#d97706" />
          </div>
          <div className="stat-value">{stats.pendingCount + stats.inProgressCount}</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #059669' }}>
          <div className="stat-top">
            <span className="stat-label">Resolved &amp; Verified</span>
            <CheckCircle2 size={18} color="#059669" />
          </div>
          <div className="stat-value">{stats.resolvedCount}</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #e11d48' }}>
          <div className="stat-top">
            <span className="stat-label">Overdue Alerts (&gt;72h)</span>
            <AlertTriangle size={18} color="#e11d48" />
          </div>
          <div className="stat-value">{stats.overdueCount}</div>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="civic-card">
        <div className="civic-card-header">
          <div>
            <span className="hero-pill">Decision Intelligence</span>
            <h3 className="civic-card-title">
              Supervisor Escalation Feed
              <span className="urdu-text" style={{ fontSize: '1.05rem', color: '#e11d48', fontWeight: 600 }}>
                توجہ طلب شکایات
              </span>
            </h3>
            <p className="civic-card-desc">
              Flags overdue tickets in queue (&gt; 72 hours) and staff workload imbalances. Supervisor review required.
            </p>
          </div>

          <div className="segmented-toggle">
            <button
              id="btn-alert-tab-pending"
              className={`segmented-toggle-btn ${activeAlertTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveAlertTab('pending')}
            >
              Pending Approval ({pendingAlerts.length})
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
                <div
                  key={alert.audit_id}
                  style={{
                    padding: '1.15rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #fecdd3',
                    background: '#fff1f2',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-overdue">{alert.alert_type}</span>
                      <strong style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>
                        #CMP-{alert.complaint_id.toString().padStart(4, '0')}
                      </strong>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Flagged: {new Date(alert.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#9f1239' }}>
                    <strong>Detected Issue: </strong>
                    {alert.explanation}
                  </div>

                  <div
                    style={{
                      padding: '0.65rem 0.85rem',
                      background: '#ffffff',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #fecdd3',
                      fontSize: '0.82rem',
                      color: 'var(--text-main)',
                    }}
                  >
                    <strong>Recommended Action: </strong>
                    {alert.suggested_action}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <button
                      id={`btn-reject-alert-${alert.audit_id}`}
                      className="btn-secondary btn-sm"
                      onClick={() => onResolveDecision(alert.audit_id, 'Rejected')}
                    >
                      <XCircle size={14} />
                      <span>Dismiss</span>
                    </button>
                    <button
                      id={`btn-approve-alert-${alert.audit_id}`}
                      className="btn-primary btn-sm"
                      style={{ background: '#e11d48' }}
                      onClick={() => onResolveDecision(alert.audit_id, 'Approved')}
                    >
                      <CheckCircle2 size={14} />
                      <span>Authorize Escalation</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <CheckCircle2 size={28} color="#059669" style={{ margin: '0 auto 0.5rem' }} />
              <strong style={{ display: 'block', color: 'var(--text-main)' }}>
                All Escalation Queues Clear
              </strong>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                No pending bottlenecks or staff overload alerts detected.
              </span>
            </div>
          )
        ) : (
          /* Audit Trail Table */
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.65rem' }}>Audit ID</th>
                  <th style={{ padding: '0.65rem' }}>Alert Type</th>
                  <th style={{ padding: '0.65rem' }}>Ticket</th>
                  <th style={{ padding: '0.65rem' }}>Suggested Action</th>
                  <th style={{ padding: '0.65rem' }}>Supervisor Decision</th>
                </tr>
              </thead>
              <tbody>
                {resolvedAlerts.map((log) => (
                  <tr key={log.audit_id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.65rem', fontFamily: 'monospace' }}>#{log.audit_id}</td>
                    <td style={{ padding: '0.65rem', fontWeight: 600 }}>{log.alert_type}</td>
                    <td style={{ padding: '0.65rem', fontFamily: 'monospace', color: 'var(--primary-blue)' }}>
                      #CMP-{log.complaint_id.toString().padStart(4, '0')}
                    </td>
                    <td style={{ padding: '0.65rem', maxWidth: '300px', color: 'var(--text-body)' }}>
                      {log.suggested_action}
                    </td>
                    <td style={{ padding: '0.65rem' }}>
                      <span className={`badge ${log.supervisor_decision === 'Approved' ? 'badge-resolved' : 'badge-overdue'}`}>
                        {log.supervisor_decision}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Department Capacity Breakdown */}
      <div className="civic-card">
        <div className="civic-card-header">
          <div>
            <span className="hero-pill">Capacity Monitoring</span>
            <h3 className="civic-card-title">
              Department Performance &amp; Resolution
              <span className="urdu-text" style={{ fontSize: '1.05rem', color: '#059669', fontWeight: 600 }}>
                محکمہ جاتی کارکردگی
              </span>
            </h3>
            <p className="civic-card-desc">
              Resolution rates and active workloads across the 6 municipal agencies.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {departmentStats.map((dept) => (
            <div
              key={dept.department_id}
              style={{
                padding: '1.15rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {dept.department_name}
                </strong>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: dept.colors.text }}>
                  {dept.resolutionRate}%
                </span>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  height: '8px',
                  width: '100%',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-subtle)',
                  marginBottom: '0.65rem',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${dept.resolutionRate}%`,
                    background: dept.colors.bar,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Workload: {dept.total} Tickets</span>
                <span>{dept.office_location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
