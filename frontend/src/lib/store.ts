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
import {
  checkBackendHealth,
  apiGetDepartments,
  apiGetStaff,
  apiGetCitizens,
  apiGetComplaints,
  apiGetWorkOrders,
  apiGetAuditLogs,
  apiRegisterComplaint,
  apiUpdateWorkOrderStatus,
  apiDecideAuditLog,
  apiTrackComplaints,
  apiAssignComplaint,
  BackendHealthResponse,
} from './api';

const STORAGE_KEYS = {
  COMPLAINTS: 'mcms_complaints_khi_v2',
  WORK_ORDERS: 'mcms_work_orders_khi_v2',
  AUDIT_LOGS: 'mcms_audit_logs_khi_v2',
  CITIZENS: 'mcms_citizens_khi_v2',
  DEPARTMENTS: 'mcms_departments_khi_v2',
  STAFF: 'mcms_staff_khi_v2',
};

export const getStoredDepartments = (): Department[] => {
  if (typeof window === 'undefined') return INITIAL_DEPARTMENTS;
  const raw = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
    return INITIAL_DEPARTMENTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEPARTMENTS;
  }
};

export const getStoredStaff = (): Staff[] => {
  if (typeof window === 'undefined') return INITIAL_STAFF;
  const raw = localStorage.getItem(STORAGE_KEYS.STAFF);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
    return INITIAL_STAFF;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_STAFF;
  }
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

export const saveDepartments = (depts: Department[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(depts));
  }
};

export const saveStaff = (staff: Staff[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  }
};

export const saveCitizens = (citizens: Citizen[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CITIZENS, JSON.stringify(citizens));
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

/**
 * Local Fallback: Register a complaint entirely in browser storage
 */
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
    saveCitizens(citizens);
  }

  const depts = getStoredDepartments();
  const dept = depts.find((d) => d.department_id === data.departmentId);
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

/**
 * Local Fallback: Update work order in browser storage
 */
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

/**
 * Local Fallback: Resolve audit decision in browser storage
 */
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

/**
 * Calculate KPI summary stats
 */
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

/**
 * Hybrid Sync: Loads all datasets from Django API if reachable, falling back to local storage.
 */
export async function loadInitialAppData(): Promise<{
  connected: boolean;
  health: BackendHealthResponse;
  departments: Department[];
  staff: Staff[];
  citizens: Citizen[];
  complaints: Complaint[];
  workOrders: WorkOrder[];
  auditLogs: DecisionAuditLog[];
}> {
  const health = await checkBackendHealth();

  if (health.healthy) {
    try {
      const [
        deptRes,
        staffRes,
        citRes,
        cmpRes,
        woRes,
        auditRes,
      ] = await Promise.allSettled([
        apiGetDepartments(),
        apiGetStaff(),
        apiGetCitizens(),
        apiGetComplaints(),
        apiGetWorkOrders(),
        apiGetAuditLogs(),
      ]);

      const departments =
        deptRes.status === 'fulfilled' ? deptRes.value : getStoredDepartments();
      const staff =
        staffRes.status === 'fulfilled' ? staffRes.value : getStoredStaff();
      const citizens =
        citRes.status === 'fulfilled' ? citRes.value : getStoredCitizens();
      const complaints =
        cmpRes.status === 'fulfilled' ? cmpRes.value : getStoredComplaints();
      const workOrders =
        woRes.status === 'fulfilled' ? woRes.value : getStoredWorkOrders();
      const auditLogs =
        auditRes.status === 'fulfilled' ? auditRes.value : getStoredAuditLogs();

      // Cache fresh data locally
      saveDepartments(departments);
      saveStaff(staff);
      saveCitizens(citizens);
      saveComplaints(complaints);
      saveWorkOrders(workOrders);
      saveAuditLogs(auditLogs);

      return {
        connected: true,
        health,
        departments,
        staff,
        citizens,
        complaints,
        workOrders,
        auditLogs,
      };
    } catch {
      // Fall through to local cache on error
    }
  }

  return {
    connected: false,
    health,
    departments: getStoredDepartments(),
    staff: getStoredStaff(),
    citizens: getStoredCitizens(),
    complaints: getStoredComplaints(),
    workOrders: getStoredWorkOrders(),
    auditLogs: getStoredAuditLogs(),
  };
}

/**
 * Hybrid Sync: Register complaint via API or local fallback
 */
export async function syncRegisterComplaint(data: {
  citizenName: string;
  phone: string;
  address: string;
  departmentId: number;
  category: string;
  description: string;
  location: string;
}): Promise<{ complaint: Complaint; isLive: boolean }> {
  try {
    const liveComplaint = await apiRegisterComplaint(data);
    // Add to local cache and save
    const currentComplaints = getStoredComplaints();
    const updated = [
      liveComplaint,
      ...currentComplaints.filter((c) => c.complaint_id !== liveComplaint.complaint_id),
    ];
    saveComplaints(updated);
    return { complaint: liveComplaint, isLive: true };
  } catch (err) {
    // Graceful offline fallback
    const local = registerComplaint(data);
    return { complaint: local, isLive: false };
  }
}

/**
 * Hybrid Sync: Update work order via API or local fallback
 */
export async function syncUpdateWorkOrder(
  workOrderId: number,
  status: WorkOrderStatus,
  actionNotes?: string
): Promise<{ updatedOrder: WorkOrder; isLive: boolean }> {
  try {
    const liveOrder = await apiUpdateWorkOrderStatus(workOrderId, status, actionNotes);
    const orders = getStoredWorkOrders();
    const updatedOrders = orders.map((o) =>
      o.work_order_id === workOrderId ? liveOrder : o
    );
    saveWorkOrders(updatedOrders);

    // Also update local complaint status if present
    const complaints = getStoredComplaints();
    const cIdx = complaints.findIndex((c) => c.complaint_id === liveOrder.complaint_id);
    if (cIdx !== -1) {
      if (status === 'In Progress') complaints[cIdx].status = 'In Progress';
      if (status === 'Completed') complaints[cIdx].status = 'Resolved';
      saveComplaints(complaints);
    }

    return { updatedOrder: liveOrder, isLive: true };
  } catch (err) {
    const { updatedOrder } = updateWorkOrderStatus(workOrderId, status, actionNotes);
    return { updatedOrder, isLive: false };
  }
}

/**
 * Hybrid Sync: Resolve audit alert via API or local fallback
 */
export async function syncResolveAuditDecision(
  auditId: number,
  decision: SupervisorDecision
): Promise<{ auditLogs: DecisionAuditLog[]; isLive: boolean }> {
  try {
    const updatedRecord = await apiDecideAuditLog(auditId, decision);
    const logs = getStoredAuditLogs();
    const updatedLogs = logs.map((l) => (l.audit_id === auditId ? updatedRecord : l));
    saveAuditLogs(updatedLogs);
    return { auditLogs: updatedLogs, isLive: true };
  } catch (err) {
    const localLogs = resolveAuditDecision(auditId, decision);
    return { auditLogs: localLogs, isLive: false };
  }
}

/**
 * Local Fallback: Assign staff to complaint in browser storage
 */
export const assignComplaint = (
  complaintId: number,
  staffId: number,
  actionNotes?: string
): { updatedComplaint: Complaint; newWorkOrder: WorkOrder } => {
  const complaints = getStoredComplaints();
  const orders = getStoredWorkOrders();
  const staffList = getStoredStaff();

  const cIdx = complaints.findIndex((c) => c.complaint_id === complaintId);
  if (cIdx === -1) throw new Error('Complaint not found');

  const staff = staffList.find((s) => s.staff_id === staffId);
  const newWoId = Math.max(...orders.map((o) => o.work_order_id), 100) + 1;

  const newWorkOrder: WorkOrder = {
    work_order_id: newWoId,
    complaint_id: complaintId,
    staff_id: staffId,
    staff_name: staff?.name || 'Field Officer',
    staff_phone: staff?.phone,
    department_name: staff?.department_name,
    assigned_date: new Date().toISOString(),
    completion_date: null,
    work_status: 'Assigned',
    action_taken: actionNotes || 'Assigned via Multi-Factor Dispatch Engine',
  };

  orders.unshift(newWorkOrder);
  saveWorkOrders(orders);

  complaints[cIdx] = {
    ...complaints[cIdx],
    status: 'Assigned',
    work_order: newWorkOrder,
  };
  saveComplaints(complaints);

  return { updatedComplaint: complaints[cIdx], newWorkOrder };
};

/**
 * Hybrid Sync: Multi-Factor Dispatch Assignment via Django API or local fallback
 */
export async function syncAssignComplaint(
  complaintId: number,
  staffId: number,
  actionNotes?: string
): Promise<{ updatedComplaint: Complaint; newWorkOrder: WorkOrder; isLive: boolean }> {
  try {
    const res = await apiAssignComplaint(complaintId, staffId, actionNotes);
    const complaints = getStoredComplaints();
    const orders = getStoredWorkOrders();

    const updatedComplaints = complaints.map((c) =>
      c.complaint_id === complaintId ? res.complaint : c
    );
    const updatedOrders = [
      res.work_order,
      ...orders.filter((o) => o.work_order_id !== res.work_order.work_order_id),
    ];

    saveComplaints(updatedComplaints);
    saveWorkOrders(updatedOrders);

    return { updatedComplaint: res.complaint, newWorkOrder: res.work_order, isLive: true };
  } catch {
    const local = assignComplaint(complaintId, staffId, actionNotes);
    return { ...local, isLive: false };
  }
}
