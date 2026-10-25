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
  calculateStats,
  loadInitialAppData,
  syncRegisterComplaint,
  syncUpdateWorkOrder,
  syncResolveAuditDecision,
  syncAssignComplaint,
} from '../lib/store';
import { Navbar } from '../components/Navbar';
import { CitizenPortal } from '../components/CitizenPortal';
import { StaffPortal } from '../components/StaffPortal';
import { AdminPortal } from '../components/AdminPortal';
import { TicketModal } from '../components/TicketModal';
import { DbmsLabView } from '../components/DbmsLabView';
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
  Database,
} from 'lucide-react';

export default function Home() {
  const [activePortal, setActivePortal] = useState<'citizen' | 'staff' | 'admin' | 'dbms-lab'>('citizen');

  // Application Data States (Karachi dataset)
  const [departments, setDepartments] = useState<Department[]>(getStoredDepartments);
  const [staffList, setStaffList] = useState<Staff[]>(getStoredStaff);
  const [complaints, setComplaints] = useState<Complaint[]>(getStoredComplaints);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(getStoredWorkOrders);
  const [auditLogs, setAuditLogs] = useState<DecisionAuditLog[]>(getStoredAuditLogs);

  // Backend Connectivity
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Ticket Receipt Modal
  const [recentTicket, setRecentTicket] = useState<Complaint | null>(null);
  const [trackedId, setTrackedId] = useState<number | null>(null);
  const [citizenTab, setCitizenTab] = useState<'submit' | 'track'>('submit');

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

  // Synchronize data from backend API or local cache
  const refreshData = async (notify: boolean = false) => {
    setIsSyncing(true);
    try {
      const res = await loadInitialAppData();
      setBackendConnected(res.connected);
      setDepartments(res.departments);
      setStaffList(res.staff);
      setComplaints(res.complaints);
      setWorkOrders(res.workOrders);
      setAuditLogs(res.auditLogs);

      if (notify) {
        if (res.connected) {
          addToast(
            'success',
            'Connected to Live Django REST API',
            `Synced with SQLite/Postgres backend (${res.health.latencyMs || 25}ms latency)`
          );
        } else {
          addToast(
            'info',
            'Operating in Local Storage Mode',
            'Django API unreachable. Using persistent local cache.'
          );
        }
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Mount effect: initial sync
  useEffect(() => {
    refreshData(false);
  }, []);

  // Compute live KPI metrics
  const stats: SystemStats = calculateStats(complaints, workOrders, auditLogs);

  // Handlers
  const handleRegisterComplaint = async (data: {
    citizenName: string;
    phone: string;
    address: string;
    departmentId: number;
    category: string;
    description: string;
    location: string;
  }) => {
    const { complaint: newRecord, isLive } = await syncRegisterComplaint(data);
    setComplaints(getStoredComplaints());
    setRecentTicket(newRecord);
    addToast(
      'success',
      `Grievance CMP-${newRecord.complaint_id.toString().padStart(4, '0')} Lodged!`,
      isLive
        ? `Persisted to Django database & ${(newRecord.department_name || 'Municipal Agency').split('—')[0]} crew alerted.`
        : `Saved to local storage cache.`
    );
  };

  const handleUpdateWorkOrder = async (
    workOrderId: number,
    status: WorkOrderStatus,
    actionNotes?: string
  ) => {
    const { updatedOrder, isLive } = await syncUpdateWorkOrder(workOrderId, status, actionNotes);
    setWorkOrders(getStoredWorkOrders());
    setComplaints(getStoredComplaints());
    addToast(
      'success',
      `Work Order #${workOrderId} Updated`,
      `Status set to ${status}${isLive ? ' (synced with Django API)' : ''}.`
    );
  };

  const handleResolveDecision = async (auditId: number, decision: SupervisorDecision) => {
    const { auditLogs: updated, isLive } = await syncResolveAuditDecision(auditId, decision);
    setAuditLogs([...updated]);
    addToast(
      'info',
      `Escalation Decision Recorded`,
      `Alert #${auditId} has been ${decision.toLowerCase()}${isLive ? ' on Django server' : ''}.`
    );
  };

  const handleAssignStaff = async (complaintId: number, staffId: number, notes?: string) => {
    const { newWorkOrder, isLive } = await syncAssignComplaint(complaintId, staffId, notes);
    setComplaints(getStoredComplaints());
    setWorkOrders(getStoredWorkOrders());
    addToast(
      'success',
      `Assigned to ${newWorkOrder.staff_name || 'Technician'}`,
      isLive ? 'Work order created and synced with live Django API.' : 'Work order created in local cache.'
    );
  };

  const handleTrackComplaint = (complaintId: number) => {
    setActivePortal('citizen');
    setCitizenTab('track');
    setTrackedId(complaintId);
  };

  const handleNewComplaintClick = () => {
    setActivePortal('citizen');
    setCitizenTab('submit');
    setTrackedId(null);
    setTimeout(() => {
      const el = document.getElementById('citizen-form-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const handleTrackClick = () => {
    setActivePortal('citizen');
    setCitizenTab('track');
    if (!trackedId && complaints.length > 0) {
      setTrackedId(complaints[0].complaint_id);
    }
    setTimeout(() => {
      const el = document.getElementById('citizen-tracking-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  return (
    <div className="app-shell font-scale-normal theme-high-contrast">
      {/* Toast Notification Viewport */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Persistent Top Navigation */}
      <Navbar
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        citizenTab={citizenTab}
        setCitizenTab={setCitizenTab}
        fontSizeLevel={fontSizeLevel}
        onFontSizeChange={setFontSizeLevel}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        backendConnected={backendConnected}
        onReconnect={() => refreshData(true)}
        onNewComplaintClick={handleNewComplaintClick}
        onTrackClick={handleTrackClick}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Simplified DBMS Context Header */}
        <section className="civic-hero-wrap" style={{ marginBottom: '1.25rem' }}>
          <div className="civic-hero-card" style={{ padding: '1.25rem 1.75rem', background: '#ffffff', borderColor: '#e2e8f0', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                  <span className="hero-pill" style={{ background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>
                    {activePortal === 'citizen' && (citizenTab === 'track' ? 'REAL-TIME TRACKING (DFD PROCESS 2.0)' : 'CITIZEN INTAKE (DFD PROCESS 1.0)')}
                    {activePortal === 'staff' && 'FIELD CREW OPERATIONS (DFD PROCESS 4.0)'}
                    {activePortal === 'admin' && 'MUNICIPAL COMMAND & DISPATCH (DFD 3.0 & 5.0)'}
                    {activePortal === 'dbms-lab' && 'RELATIONAL THEORY & 3NF LAB (DR. S. M. KHALID SYLLABUS)'}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                    Schema: 3NF Relational (PostgreSQL 16)
                  </span>
                </div>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06110a', margin: 0 }}>
                  {activePortal === 'citizen' && (citizenTab === 'track' ? 'Live Grievance Tracking & Lifecycle Audit' : 'Civic Grievance Lodging & Registration')}
                  {activePortal === 'staff' && 'Field Technician Inspection & Repair Desk'}
                  {activePortal === 'admin' && 'Municipal Command & Multi-Factor Dispatch Station'}
                  {activePortal === 'dbms-lab' && 'Relational Foundations, Normalization & Query Studio'}
                </h1>
              </div>

              {/* Compact Database Entity Count Strip */}
              <div className="hero-stats-row" style={{ marginTop: 0, gap: '0.65rem' }}>
                <div className="hero-stat-chip" style={{ padding: '0.35rem 0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <span className="hero-stat-number" style={{ fontSize: '1.05rem', color: '#047857' }}>{stats.totalComplaints}</span>
                  <span className="hero-stat-label" style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 600 }}>Complaints (D2)</span>
                </div>
                <div className="hero-stat-chip" style={{ padding: '0.35rem 0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <span className="hero-stat-number" style={{ fontSize: '1.05rem', color: '#d97706' }}>{workOrders.length}</span>
                  <span className="hero-stat-label" style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 600 }}>Work Orders (D5)</span>
                </div>
                <div className="hero-stat-chip" style={{ padding: '0.35rem 0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <span className="hero-stat-number" style={{ fontSize: '1.05rem', color: '#059669' }}>{departments.length}</span>
                  <span className="hero-stat-label" style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 600 }}>Agencies (D3)</span>
                </div>
                <div className="hero-stat-chip" style={{ padding: '0.35rem 0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <span className="hero-stat-number" style={{ fontSize: '1.05rem', color: '#b45309' }}>{staffList.length}</span>
                  <span className="hero-stat-label" style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 600 }}>Staff (D4)</span>
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
              onShowToast={addToast}
              activeTab={citizenTab}
              onTabChange={setCitizenTab}
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
              staffList={staffList}
              workOrders={workOrders}
              auditLogs={auditLogs}
              onResolveDecision={handleResolveDecision}
              onAssignStaff={handleAssignStaff}
            />
          )}

          {activePortal === 'dbms-lab' && (
            <DbmsLabView
              departments={departments}
              staffList={staffList}
              complaints={complaints}
              workOrders={workOrders}
              auditLogs={auditLogs}
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
