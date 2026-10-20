'use client';

import React, { useState, useEffect } from 'react';
import {
  Department,
  Staff,
  Complaint,
  WorkOrder,
  DecisionAuditLog,
  SystemStats,
  WorkOrderStatus,
  SupervisorDecision,
} from '../types';
import {
  getStoredDepartments,
  getStoredStaff,
  getStoredComplaints,
  getStoredWorkOrders,
  getStoredAuditLogs,
  registerComplaint,
  updateWorkOrderStatus,
  resolveAuditDecision,
  calculateStats,
} from '../lib/store';
import { Navbar } from '../components/Navbar';
import { CitizenPortal } from '../components/CitizenPortal';
import { StaffPortal } from '../components/StaffPortal';
import { AdminPortal } from '../components/AdminPortal';
import { TicketModal } from '../components/TicketModal';
import { Footer } from '../components/Footer';
import { ToastContainer, ToastItem } from '../components/Toast';
import {
  Building2,
  FileText,
  Wrench,
  BarChart3,
  Search,
  Plus,
  Sparkles,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';

export default function Home() {
  const [activePortal, setActivePortal] = useState<'citizen' | 'staff' | 'admin'>('citizen');

  // Application Data States (Karachi dataset)
  const [departments, setDepartments] = useState<Department[]>(getStoredDepartments);
  const [staffList, setStaffList] = useState<Staff[]>(getStoredStaff);
  const [complaints, setComplaints] = useState<Complaint[]>(getStoredComplaints);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(getStoredWorkOrders);
  const [auditLogs, setAuditLogs] = useState<DecisionAuditLog[]>(getStoredAuditLogs);

  // Ticket Receipt Modal
  const [recentTicket, setRecentTicket] = useState<Complaint | null>(null);
  const [trackedId, setTrackedId] = useState<number | null>(null);

  // Accessibility States
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'larger'>('normal');
  const [highContrast, setHighContrast] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string, subMessage?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev.slice(-4), { id, type, message, subMessage }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initialize data on mount
  useEffect(() => {
    setDepartments(getStoredDepartments());
    setStaffList(getStoredStaff());
    setComplaints(getStoredComplaints());
    setWorkOrders(getStoredWorkOrders());
    setAuditLogs(getStoredAuditLogs());
  }, []);

  // Compute live KPI metrics
  const stats: SystemStats = calculateStats(complaints, workOrders, auditLogs);

  // Handlers
  const handleRegisterComplaint = (data: {
    citizenName: string;
    phone: string;
    address: string;
    departmentId: number;
    category: string;
    description: string;
    location: string;
  }) => {
    const newRecord = registerComplaint(data);
    const updated = getStoredComplaints();
    setComplaints(updated);
    setRecentTicket(newRecord);
    addToast(
      'success',
      `Grievance CMP-${newRecord.complaint_id.toString().padStart(4, '0')} Lodged!`,
      `${(newRecord.department_name || 'Municipal Agency').split('—')[0]} crew alerted.`
    );
  };

  const handleUpdateWorkOrder = (
    workOrderId: number,
    status: WorkOrderStatus,
    actionNotes?: string
  ) => {
    updateWorkOrderStatus(workOrderId, status, actionNotes);
    setWorkOrders(getStoredWorkOrders());
    setComplaints(getStoredComplaints());
    addToast(
      'success',
      `Work Order #${workOrderId} Updated`,
      `Status set to ${status}.`
    );
  };

  const handleResolveDecision = (auditId: number, decision: SupervisorDecision) => {
    const updated = resolveAuditDecision(auditId, decision);
    setAuditLogs([...updated]);
    addToast(
      'info',
      `Escalation Decision Recorded`,
      `Alert #${auditId} has been ${decision.toLowerCase()}.`
    );
  };

  const handleTrackComplaint = (complaintId: number) => {
    setActivePortal('citizen');
    setTrackedId(complaintId);
  };

  return (
    <div className={`app-shell font-scale-${fontSizeLevel} ${highContrast ? 'theme-high-contrast' : ''}`}>
      {/* Toast Notification Viewport */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Persistent Top Navigation */}
      <Navbar
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        fontSizeLevel={fontSizeLevel}
        onFontSizeChange={setFontSizeLevel}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        onNewComplaintClick={() => {
          setActivePortal('citizen');
          setTrackedId(null);
          const el = document.getElementById('citizen-form-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onTrackClick={() => {
          setActivePortal('citizen');
          setTrackedId(complaints[0]?.complaint_id || null);
          const el = document.getElementById('citizen-tracking-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Dynamic Contextual Hero Section (Different for each Portal Tab) */}
        <section className="civic-hero-wrap">
          {/* TAB 1: CITIZEN PORTAL HERO */}
          {activePortal === 'citizen' && (
            <div className="civic-hero-card hero-portal-citizen">
              <div className="hero-top-badge">
                <Sparkles size={13} color="var(--primary-moss)" />
                <span>MUNICIPAL CARE &amp; REDRESSAL</span>
              </div>

              <h1 className="civic-hero-title">
                Direct Civic Care for Every Neighborhood
              </h1>

              <p className="civic-hero-desc">
                Report infrastructure issues across Karachi, pinpoint on map, and verify repairs in real time.
              </p>

              <div className="civic-hero-actions">
                <button
                  id="hero-btn-file-grievance"
                  className="btn-pill-primary"
                  onClick={() => {
                    setTrackedId(null);
                    const el = document.getElementById('citizen-form-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span>Lodge Grievance</span>
                </button>

                <button
                  id="hero-btn-track-status"
                  className="btn-pill-secondary"
                  onClick={() => {
                    setTrackedId(complaints[0]?.complaint_id || null);
                    const el = document.getElementById('citizen-tracking-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Search size={16} strokeWidth={2.2} />
                  <span>Track Ticket</span>
                </button>
              </div>

              {/* Quick Metrics Strip */}
              <div className="hero-stats-row">
                <div className="hero-stat-chip">
                  <span className="hero-stat-number">{stats.totalComplaints}</span>
                  <span className="hero-stat-label">Total Logged</span>
                </div>

                <div className="hero-stat-chip">
                  <span className="hero-stat-number" style={{ color: '#235336' }}>{stats.resolvedCount}</span>
                  <span className="hero-stat-label">Resolved</span>
                </div>

                <div className="hero-stat-chip">
                  <span className="hero-stat-number" style={{ color: '#8a6523' }}>{stats.inProgressCount}</span>
                  <span className="hero-stat-label">In Progress</span>
                </div>

                <div className="hero-stat-chip">
                  <span className="hero-stat-number">{stats.avgResolutionHours}h</span>
                  <span className="hero-stat-label">Avg. Resolution</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STAFF WORKDESK HERO */}
          {activePortal === 'staff' && (
            <div className="civic-hero-card hero-portal-staff">
              <div className="hero-top-badge" style={{ background: '#f5efe4', color: '#8a6523', borderColor: '#ecdac2' }}>
                <Wrench size={13} color="#8a6523" />
                <span>FIELD CREW &amp; DISPATCH OPERATIONS</span>
              </div>

              <h1 className="civic-hero-title">
                Karachi Municipal Crew Workdesk
              </h1>

              <p className="civic-hero-desc">
                Review assigned work orders, update repair milestones, and record physical on-site diagnostic remarks.
              </p>

              <div className="civic-hero-actions">
                <button
                  className="btn-pill-primary"
                  onClick={() => {
                    const el = document.getElementById('select-active-technician');
                    if (el) el.focus();
                  }}
                >
                  <Wrench size={16} strokeWidth={2.2} />
                  <span>Select Active Technician</span>
                </button>
              </div>

              {/* Staff Workdesk Metrics */}
              <div className="hero-stats-row">
                <div className="hero-stat-chip">
                  <span className="hero-stat-number">{workOrders.length}</span>
                  <span className="hero-stat-label">Active Orders</span>
                </div>

                <div className="hero-stat-chip">
                  <span className="hero-stat-number" style={{ color: '#8a6523' }}>
                    {workOrders.filter((w) => w.work_status === 'In Progress').length}
                  </span>
                  <span className="hero-stat-label">Under Repair</span>
                </div>

                <div className="hero-stat-chip">
                  <span className="hero-stat-number" style={{ color: '#235336' }}>
                    {workOrders.filter((w) => w.work_status === 'Completed').length}
                  </span>
                  <span className="hero-stat-label">Completed Jobs</span>
                </div>

                <div className="hero-stat-chip">
                  <span className="hero-stat-number">{staffList.length}</span>
                  <span className="hero-stat-label">Field Technicians</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADMIN COMMAND CENTER HERO */}
          {activePortal === 'admin' && (
            <div className="civic-hero-card hero-portal-admin">
              <div className="hero-top-badge" style={{ background: '#fbeeee', color: '#993030', borderColor: '#f2cccc' }}>
                <BarChart3 size={13} color="#993030" />
                <span>TOWN HALL DECISION INTELLIGENCE</span>
              </div>

              <h1 className="civic-hero-title">
                Municipal Command &amp; Escalation Hub
              </h1>

              <p className="civic-hero-desc">
                Real-time town hall oversight, cross-agency SLA audit alerts, and Karachi zonal resolution velocity.
              </p>

              <div className="civic-hero-actions">
                <button
                  className="btn-pill-primary"
                  onClick={() => {
                    const el = document.getElementById('btn-alert-tab-pending');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <AlertTriangle size={15} />
                  <span>Review Escalations</span>
                </button>
              </div>

              {/* Supervisor SLA Metrics */}
              <div className="hero-stats-row">
                <div className="hero-stat-chip">
                  <span className="hero-stat-number">{stats.totalComplaints}</span>
                  <span className="hero-stat-label">Total Grievances</span>
                </div>

                <div className="hero-stat-chip">
                  <span className="hero-stat-number" style={{ color: '#235336' }}>
                    {stats.totalComplaints > 0 ? Math.round((stats.resolvedCount / stats.totalComplaints) * 100) : 0}%
                  </span>
                  <span className="hero-stat-label">SLA Compliance</span>
                </div>

                <div className="hero-stat-chip">
                  <span className="hero-stat-number" style={{ color: '#993030' }}>{stats.overdueCount}</span>
                  <span className="hero-stat-label">Active Escalations</span>
                </div>

                <div className="hero-stat-chip">
                  <span className="hero-stat-number">{departments.length}</span>
                  <span className="hero-stat-label">Karachi Agencies</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Portal Views Container */}
        <div className="container portal-viewport-container">
          {activePortal === 'citizen' && (
            <CitizenPortal
              departments={departments}
              complaints={complaints}
              onSubmitComplaint={handleRegisterComplaint}
              trackedComplaintId={trackedId}
              onShowToast={addToast}
            />
          )}

          {activePortal === 'staff' && (
            <StaffPortal
              staffList={staffList}
              workOrders={workOrders}
              complaints={complaints}
              onUpdateWorkOrder={handleUpdateWorkOrder}
            />
          )}

          {activePortal === 'admin' && (
            <AdminPortal
              stats={stats}
              departments={departments}
              complaints={complaints}
              auditLogs={auditLogs}
              onResolveDecision={handleResolveDecision}
            />
          )}
        </div>
      </main>

      {/* Comprehensive Municipal Footer (Helpline banners removed) */}
      <Footer />

      {/* Instant Ticket Modal */}
      <TicketModal
        complaint={recentTicket}
        onClose={() => setRecentTicket(null)}
        onTrack={handleTrackComplaint}
      />
    </div>
  );
}
