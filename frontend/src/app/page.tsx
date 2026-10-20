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
import {
  Building2,
  FileText,
  Wrench,
  BarChart3,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        onNewComplaintClick={() => {
          setActivePortal('citizen');
          setTrackedId(null);
        }}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '4rem' }}>
        <div className="container">
          {/* Welcoming Civic Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <span className="hero-pill">
                Civic Services Platform • شہری خدمات
              </span>
              <h1 className="hero-title">
                Municipal Complaint Management System
                <span className="urdu-text" style={{ display: 'block', fontSize: '1.65rem', color: 'var(--primary-blue)', fontWeight: 600, marginTop: '0.4rem' }}>
                  بلدیاتی شکایات کا آن لائن حل
                </span>
              </h1>
              <p className="hero-desc">
                Easily register civic issues, track field inspection progress in real time, and connect directly with municipal service teams.
              </p>
            </div>
          </section>

          {/* Active Portal Views */}
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

      {/* Welcoming Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          padding: '2rem 0',
          marginTop: 'auto',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong style={{ color: 'var(--text-main)', display: 'block', fontSize: '0.92rem' }}>
              Municipal Complaint Management System (MCMS)
            </strong>
            <span>Direct Citizen Grievance Redressal Portal</span>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem', flexWrap: 'wrap' }}>
            <span>پانی (Water)</span>
            <span>سڑکیں (Roads)</span>
            <span>صفائی (Sanitation)</span>
            <span>بجلی (Lighting)</span>
            <span>صحت (Health)</span>
            <span>پارکس (Parks)</span>
          </div>
        </div>
      </footer>

      {/* Instant Ticket Modal */}
      <TicketModal
        complaint={recentTicket}
        onClose={() => setRecentTicket(null)}
        onTrack={handleTrackComplaint}
      />
    </div>
  );
}
