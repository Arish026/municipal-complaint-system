'use client';

import React, { useState } from 'react';
import { Department, Complaint, DecisionAuditLog, SystemStats, SupervisorDecision } from '../types';
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
} from 'lucide-react';

interface AdminPortalProps {
  stats: SystemStats;
  departments: Department[];
  complaints: Complaint[];
  auditLogs: DecisionAuditLog[];
  onResolveDecision: (auditId: number, decision: SupervisorDecision) => void;
}

const DEPT_CONFIG: Record<number, { color: string; icon: React.ReactNode }> = {
  1: { color: '#233d2c', icon: <Droplets size={15} /> },
  2: { color: '#8a6523', icon: <Construction size={15} /> },
  3: { color: '#2e5a3c', icon: <Trash2 size={15} /> },
  4: { color: '#946c1e', icon: <Lightbulb size={15} /> },
  5: { color: '#993030', icon: <ShieldAlert size={15} /> },
  6: { color: '#1e4d3a', icon: <Trees size={15} /> },
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
    const config = DEPT_CONFIG[dept.department_id] || {
      color: '#233d2c',
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Overview Header */}
      <div className="civic-card">
        <div className="civic-card-header">
          <div>
            <span className="hero-pill">Town Hall Analytics</span>
            <h2 className="civic-card-title">Supervisor Command Center</h2>
            <p className="civic-card-desc">
              Resolution metrics, escalation alerts, and department capacity.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="stats-grid" style={{ marginTop: '0.5rem' }}>
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Total Grievances</span>
              <Layers size={16} color="var(--primary-moss)" />
            </div>
            <div className="stat-value">{stats.totalComplaints}</div>
            <span className="stat-subtext">All city zones</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Active Queue</span>
              <Clock size={16} color="#8a6523" />
            </div>
            <div className="stat-value">{stats.pendingCount + stats.inProgressCount}</div>
            <span className="stat-subtext">Assigned or in progress</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Resolved</span>
              <CheckCircle2 size={16} color="#235336" />
            </div>
            <div className="stat-value" style={{ color: '#235336' }}>{stats.resolvedCount}</div>
            <span className="stat-subtext">
              {stats.totalComplaints > 0 ? Math.round((stats.resolvedCount / stats.totalComplaints) * 100) : 0}% Closed
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Overdue Alerts</span>
              <AlertTriangle size={16} color="#993030" />
            </div>
            <div className="stat-value" style={{ color: '#993030' }}>{stats.overdueCount}</div>
            <span className="stat-subtext">&gt; 72h Pending Review</span>
          </div>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="civic-card">
        <div className="civic-card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="hero-pill">Decision Intelligence</span>
            <h3 className="civic-card-title">Escalation Feed</h3>
            <p className="civic-card-desc">
              Overdue tickets and technician workload alerts.
            </p>
          </div>

          <div className="segmented-toggle">
            <button
              id="btn-alert-tab-pending"
              className={`segmented-toggle-btn ${activeAlertTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveAlertTab('pending')}
            >
              Pending ({pendingAlerts.length})
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pendingAlerts.map((alert) => (
                <div
                  key={alert.audit_id}
                  className="civic-card alert-item-card"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="status-pill status-overdue">
                        <AlertTriangle size={11} />
                        <span>{alert.alert_type}</span>
                      </span>
                      <strong style={{ fontSize: '0.85rem' }}>
                        CMP-{alert.complaint_id.toString().padStart(4, '0')}
                      </strong>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Flagged: {new Date(alert.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', margin: '0.35rem 0' }}>
                    {alert.explanation}
                  </p>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Action: <strong>{alert.suggested_action}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      id={`btn-reject-alert-${alert.audit_id}`}
                      className="btn-pill-secondary btn-sm"
                      onClick={() => onResolveDecision(alert.audit_id, 'Rejected')}
                    >
                      <XCircle size={13} />
                      <span>Dismiss</span>
                    </button>
                    <button
                      id={`btn-approve-alert-${alert.audit_id}`}
                      className="btn-pill-primary btn-sm"
                      onClick={() => onResolveDecision(alert.audit_id, 'Approved')}
                    >
                      <CheckCircle2 size={13} />
                      <span>Authorize</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <CheckCircle2 size={32} color="#233d2c" style={{ margin: '0 auto 0.5rem' }} />
              <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                All Escalations Clear
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                No pending bottlenecks detected.
              </span>
            </div>
          )
        ) : (
          <div className="responsive-table-wrap">
            <table className="civic-table hide-on-mobile">
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Type</th>
                  <th>Ticket</th>
                  <th>Action</th>
                  <th>Decision</th>
                </tr>
              </thead>
              <tbody>
                {resolvedAlerts.map((log) => (
                  <tr key={log.audit_id}>
                    <td>#{log.audit_id}</td>
                    <td>{log.alert_type}</td>
                    <td>CMP-{log.complaint_id.toString().padStart(4, '0')}</td>
                    <td>{log.suggested_action}</td>
                    <td>
                      <span className={`status-pill ${log.supervisor_decision === 'Approved' ? 'status-resolved' : 'status-overdue'}`}>
                        {log.supervisor_decision}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="mobile-complaints-card-list hide-on-desktop">
              {resolvedAlerts.map((log) => (
                <div key={log.audit_id} className="mobile-ticket-card">
                  <div className="mobile-card-top">
                    <span className="ticket-code-pill">CMP-{log.complaint_id.toString().padStart(4, '0')}</span>
                    <span className={`status-pill ${log.supervisor_decision === 'Approved' ? 'status-resolved' : 'status-overdue'}`}>
                      {log.supervisor_decision}
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.85rem' }}>{log.alert_type}</strong>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{log.suggested_action}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Department Capacity Breakdown */}
      <div className="civic-card">
        <div className="civic-card-header">
          <div>
            <span className="hero-pill">Capacity Monitoring</span>
            <h3 className="civic-card-title">Department Performance</h3>
            <p className="civic-card-desc">
              Resolution velocity and volume across the 6 municipal agencies.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
          {departmentStats.map((dept) => (
            <div
              key={dept.department_id}
              className="dept-stat-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <div className="dept-stat-icon" style={{ background: '#f2efe9', color: 'var(--primary-moss)' }}>
                    {dept.icon}
                  </div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    {dept.department_name}
                  </strong>
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-moss)' }}>
                  {dept.resolutionRate}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="dept-progress-track">
                <div
                  className="dept-progress-fill"
                  style={{ width: `${dept.resolutionRate}%`, background: 'var(--primary-moss)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>{dept.total} Tickets</span>
                <span>{dept.office_location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
