'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
          // Scroll smoothly to form
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
        {/* Civic Hero Section with Real Generated Municipal Imagery */}
        <section className="hero-banner-section">
          <div className="hero-banner-image-wrapper">
            <Image
              src="/images/hero-civic.jpg"
              alt="City Hall and Civic Operations Center"
              fill
              priority
              className="hero-banner-image"
              sizes="100vw"
            />
            <div className="hero-banner-overlay"></div>
          </div>

          <div className="container hero-banner-container">
            <div className="hero-banner-content">
              <div className="hero-badge">
                <Sparkles size={14} color="#fde047" />
                <span>Municipal Services &amp; Infrastructure Portal</span>
              </div>

              <h1 className="hero-banner-title">
                Direct Citizen Grievance Redressal &amp; Field Dispatch
              </h1>

              <p className="hero-banner-desc">
                Register neighborhood infrastructure issues, track inspection and repair progress in real time, and connect directly with municipal service crews across the metropolitan region.
              </p>

              <div className="hero-banner-cta-group">
                <button
                  id="hero-btn-file-grievance"
                  className="btn-hero-primary"
                  onClick={() => {
                    setActivePortal('citizen');
                    setTrackedId(null);
                    const el = document.getElementById('citizen-form-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Plus size={18} strokeWidth={2.5} />
                  <span>File a Grievance</span>
                </button>

                <button
                  id="hero-btn-track-status"
                  className="btn-hero-secondary"
                  onClick={() => {
                    setActivePortal('citizen');
                    setTrackedId(complaints[0]?.complaint_id || null);
                    const el = document.getElementById('citizen-tracking-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Search size={18} strokeWidth={2.2} />
                  <span>Track Status by Ticket ID</span>
                </button>

                <a href="tel:1122" className="btn-hero-tertiary">
                  <PhoneCall size={17} />
                  <span>24/7 Helpline: 1122</span>
                </a>
              </div>

              {/* Quick Metrics Strip */}
              <div className="hero-metrics-strip">
                <div className="hero-metric-card">
                  <div className="hero-metric-icon">
                    <FileText size={18} color="#2563eb" />
                  </div>
                  <div>
                    <strong className="hero-metric-val">{stats.totalComplaints}</strong>
                    <span className="hero-metric-lbl">Total Registered</span>
                  </div>
                </div>

                <div className="hero-metric-card">
                  <div className="hero-metric-icon">
                    <CheckCircle2 size={18} color="#059669" />
                  </div>
                  <div>
                    <strong className="hero-metric-val">{stats.resolvedCount}</strong>
                    <span className="hero-metric-lbl">Cases Resolved</span>
                  </div>
                </div>

                <div className="hero-metric-card">
                  <div className="hero-metric-icon">
                    <Wrench size={18} color="#d97706" />
                  </div>
                  <div>
                    <strong className="hero-metric-val">{stats.inProgressCount}</strong>
                    <span className="hero-metric-lbl">Active In Progress</span>
                  </div>
                </div>

                <div className="hero-metric-card">
                  <div className="hero-metric-icon">
                    <Clock size={18} color="#7c3aed" />
                  </div>
                  <div>
                    <strong className="hero-metric-val">{stats.avgResolutionHours}h</strong>
                    <span className="hero-metric-lbl">Avg. Resolution</span>
                  </div>
                </div>
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
