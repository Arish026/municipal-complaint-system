'use client';

import {
  Department,
  Staff,
  Citizen,
  Complaint,
  WorkOrder,
  DecisionAuditLog,
  SystemStats,
  ComplaintStatus,
  WorkOrderStatus,
  SupervisorDecision,
} from '../types';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_STAFF,
  INITIAL_CITIZENS,
  INITIAL_COMPLAINTS,
  INITIAL_WORK_ORDERS,
  INITIAL_AUDIT_LOGS,
} from './initialData';

const STORAGE_KEYS = {
  COMPLAINTS: 'mcms_complaints',
  WORK_ORDERS: 'mcms_work_orders',
  AUDIT_LOGS: 'mcms_audit_logs',
  CITIZENS: 'mcms_citizens',
};

export const getStoredDepartments = (): Department[] => {
  return INITIAL_DEPARTMENTS;
};

export const getStoredStaff = (): Staff[] => {
  return INITIAL_STAFF;
};

export const getStoredCitizens = (): Citizen[] => {
  if (typeof window === 'undefined') return INITIAL_CITIZENS;
  const raw = localStorage.getItem(STORAGE_KEYS.CITIZENS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.CITIZENS, JSON.stringify(INITIAL_CITIZENS));
    return INITIAL_CITIZENS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_CITIZENS;
  }
};

export const getStoredComplaints = (): Complaint[] => {
  if (typeof window === 'undefined') return INITIAL_COMPLAINTS;
  const raw = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
    return INITIAL_COMPLAINTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_COMPLAINTS;
  }
};

export const getStoredWorkOrders = (): WorkOrder[] => {
  if (typeof window === 'undefined') return INITIAL_WORK_ORDERS;
  const raw = localStorage.getItem(STORAGE_KEYS.WORK_ORDERS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.WORK_ORDERS, JSON.stringify(INITIAL_WORK_ORDERS));
    return INITIAL_WORK_ORDERS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_WORK_ORDERS;
  }
};

export const getStoredAuditLogs = (): DecisionAuditLog[] => {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
  const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    return INITIAL_AUDIT_LOGS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
};

export const saveComplaints = (complaints: Complaint[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  }
};

export const saveWorkOrders = (orders: WorkOrder[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.WORK_ORDERS, JSON.stringify(orders));
  }
};

export const saveAuditLogs = (logs: DecisionAuditLog[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  }
};

export const registerComplaint = (data: {
  citizenName: string;
  phone: string;
  address: string;
  departmentId: number;
  category: string;
  description: string;
  location: string;
}): Complaint => {
  const citizens = getStoredCitizens();
  let citizen = citizens.find((c) => c.phone.trim() === data.phone.trim());

  if (!citizen) {
    const newCitizenId = Math.max(...citizens.map((c) => c.citizen_id), 0) + 1;
    citizen = {
      citizen_id: newCitizenId,
      name: data.citizenName.trim(),
      phone: data.phone.trim(),
      address: data.address.trim(),
      created_at: new Date().toISOString(),
    };
    citizens.push(citizen);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CITIZENS, JSON.stringify(citizens));
    }
  }

  const dept = INITIAL_DEPARTMENTS.find((d) => d.department_id === data.departmentId);
  const complaints = getStoredComplaints();
  const newComplaintId = Math.max(...complaints.map((c) => c.complaint_id), 0) + 1;

  const newComplaint: Complaint = {
    complaint_id: newComplaintId,
    citizen_id: citizen.citizen_id,
    citizen_name: citizen.name,
    citizen_phone: citizen.phone,
    department_id: data.departmentId,
    department_name: dept?.department_name || 'General Municipal Services',
    complaint_date: new Date().toISOString(),
    category: data.category,
    description: data.description,
    location: data.location,
    status: 'Submitted',
  };

  const updatedComplaints = [newComplaint, ...complaints];
  saveComplaints(updatedComplaints);

  return newComplaint;
};

export const updateWorkOrderStatus = (
  workOrderId: number,
  status: WorkOrderStatus,
  actionNotes?: string
): { updatedOrder: WorkOrder; updatedComplaint?: Complaint } => {
  const orders = getStoredWorkOrders();
  const complaints = getStoredComplaints();

  const orderIndex = orders.findIndex((o) => o.work_order_id === workOrderId);
  if (orderIndex === -1) {
    throw new Error('Work order not found');
  }

  const existingOrder = orders[orderIndex];
  const updatedOrder: WorkOrder = {
    ...existingOrder,
    work_status: status,
    action_taken: actionNotes || existingOrder.action_taken,
    completion_date: status === 'Completed' ? new Date().toISOString() : existingOrder.completion_date,
  };
  orders[orderIndex] = updatedOrder;
  saveWorkOrders(orders);

  // Synchronize Complaint Status according to FR-06
  let updatedComplaint: Complaint | undefined;
  const complaintIndex = complaints.findIndex((c) => c.complaint_id === existingOrder.complaint_id);
  if (complaintIndex !== -1) {
    let syncedStatus: ComplaintStatus = complaints[complaintIndex].status;
    if (status === 'In Progress') syncedStatus = 'In Progress';
    if (status === 'Completed') syncedStatus = 'Resolved';

    complaints[complaintIndex] = {
      ...complaints[complaintIndex],
      status: syncedStatus,
    };
    updatedComplaint = complaints[complaintIndex];
    saveComplaints(complaints);
  }

  return { updatedOrder, updatedComplaint };
};

export const resolveAuditDecision = (
  auditId: number,
  decision: SupervisorDecision
): DecisionAuditLog[] => {
  const logs = getStoredAuditLogs();
  const index = logs.findIndex((l) => l.audit_id === auditId);
  if (index !== -1) {
    logs[index] = {
      ...logs[index],
      supervisor_decision: decision,
      decided_by_staff_id: 1, // Logged in Supervisor
      decision_timestamp: new Date().toISOString(),
    };
    saveAuditLogs(logs);
  }
  return logs;
};

export const calculateStats = (
  complaints: Complaint[],
  workOrders: WorkOrder[],
  auditLogs: DecisionAuditLog[]
): SystemStats => {
  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'Categorized' || c.status === 'Assigned'
  ).length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(
    (c) => c.status === 'Resolved' || c.status === 'Verified' || c.status === 'Closed'
  ).length;
  const overdueCount = auditLogs.filter(
    (a) => a.alert_type === 'Overdue Alert' && a.supervisor_decision === 'Pending'
  ).length;

  return {
    totalComplaints,
    pendingCount,
    inProgressCount,
    resolvedCount,
    overdueCount,
    avgResolutionHours: 14.2,
  };
};
