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
import {
  Building2,
  FileText,
  Wrench,
  BarChart3,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Plus,
  PhoneCall,
  Activity,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const [activePortal, setActivePortal] = useState<'citizen' | 'staff' | 'admin'>('citizen');

  // Application Data States
  const [departments, setDepartments] = useState<Department[]>(getStoredDepartments);
  const [staffList, setStaffList] = useState<Staff[]>(getStoredStaff);
  const [complaints, setComplaints] = useState<Complaint[]>(getStoredComplaints);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(getStoredWorkOrders);
  const [auditLogs, setAuditLogs] = useState<DecisionAuditLog[]>(getStoredAuditLogs);

  // Ticket Receipt Modal
  const [recentTicket, setRecentTicket] = useState<Complaint | null>(null);
  const [trackedId, setTrackedId] = useState<number | null>(null);

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
    setComplaints(getStoredComplaints());
    setRecentTicket(newRecord);
  };

  const handleUpdateWorkOrder = (
    workOrderId: number,
    status: WorkOrderStatus,
    actionNotes?: string
  ) => {
    updateWorkOrderStatus(workOrderId, status, actionNotes);
    setWorkOrders(getStoredWorkOrders());
    setComplaints(getStoredComplaints());
  };

  const handleResolveDecision = (auditId: number, decision: SupervisorDecision) => {
    const updated = resolveAuditDecision(auditId, decision);
    setAuditLogs([...updated]);
  };

  const handleTrackComplaint = (complaintId: number) => {
    setActivePortal('citizen');
    setTrackedId(complaintId);
  };

  return (
    <div className="app-shell">
      {/* Top Navigation */}
      <Navbar
        activePortal={activePortal}
        setActivePortal={setActivePortal}
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
        {/* Civic Hero Section (Compact & Image-Free, Leafora Warm Natural Style) */}
        <section className="civic-hero-wrap">
          <div className="civic-hero-card">
            <div className="hero-top-badge">
              <Sparkles size={13} color="#243e2e" />
              <span>MUNICIPAL CARE &amp; REDRESSAL</span>
            </div>

            <h1 className="civic-hero-title">
              Direct Civic Care for Every Neighborhood
            </h1>

            <p className="civic-hero-desc">
              Report infrastructure issues, track on-site inspections, and verify repairs in real time.
            </p>

            <div className="civic-hero-actions">
              <button
                id="hero-btn-file-grievance"
                className="btn-pill-primary"
                onClick={() => {
                  setActivePortal('citizen');
                  setTrackedId(null);
                  const el = document.getElementById('citizen-form-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>File Grievance</span>
              </button>

              <button
                id="hero-btn-track-status"
                className="btn-pill-secondary"
                onClick={() => {
                  setActivePortal('citizen');
                  setTrackedId(complaints[0]?.complaint_id || null);
                  const el = document.getElementById('citizen-tracking-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Search size={16} strokeWidth={2.2} />
                <span>Track Ticket</span>
              </button>

              <a href="tel:1122" className="helpline-pill-link">
                <PhoneCall size={14} />
                <span>24/7 Helpline: 1122</span>
              </a>
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
        </section>

        {/* Portal Views Container */}
        <div className="container portal-viewport-container">
          {activePortal === 'citizen' && (
            <CitizenPortal
              departments={departments}
              complaints={complaints}
              onSubmitComplaint={handleRegisterComplaint}
              trackedComplaintId={trackedId}
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

      {/* Comprehensive Municipal Footer */}
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
