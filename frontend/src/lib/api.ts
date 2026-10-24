import {
  Department,
  Staff,
  Citizen,
  Complaint,
  WorkOrder,
  DecisionAuditLog,
  WorkOrderStatus,
  SupervisorDecision,
} from '../types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

const DEFAULT_TIMEOUT_MS = 4000;

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export interface BackendHealthResponse {
  healthy: boolean;
  service?: string;
  version?: string;
  database?: string;
  timestamp?: string;
  counts?: {
    departments: number;
    complaints: number;
    staff: number;
  };
  latencyMs?: number;
  error?: string;
}

/**
 * Checks if the Django REST backend is live and healthy.
 */
export async function checkBackendHealth(): Promise<BackendHealthResponse> {
  const start = performance.now();
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/health/`, {}, 2500);
    const latencyMs = Math.round(performance.now() - start);
    if (!res.ok) {
      return { healthy: false, error: `HTTP ${res.status}: ${res.statusText}`, latencyMs };
    }
    const data = await res.json();
    return {
      healthy: data.status === 'healthy',
      service: data.service,
      version: data.version,
      database: data.database,
      timestamp: data.timestamp,
      counts: data.counts,
      latencyMs,
    };
  } catch (err: any) {
    return {
      healthy: false,
      error: err.name === 'AbortError' ? 'Connection timed out' : (err.message || 'Network unreachable'),
    };
  }
}

/**
 * Fetch all municipal departments.
 */
export async function apiGetDepartments(): Promise<Department[]> {
  const res = await fetchWithTimeout(`${API_BASE_URL}/departments/`);
  if (!res.ok) throw new Error(`Failed to load departments (HTTP ${res.status})`);
  return res.json();
}

/**
 * Fetch field staff members.
 */
export async function apiGetStaff(departmentId?: number): Promise<Staff[]> {
  const url = departmentId
    ? `${API_BASE_URL}/staff/?department_id=${departmentId}`
    : `${API_BASE_URL}/staff/`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Failed to load staff list (HTTP ${res.status})`);
  return res.json();
}

/**
 * Fetch registered citizens.
 */
export async function apiGetCitizens(): Promise<Citizen[]> {
  const res = await fetchWithTimeout(`${API_BASE_URL}/citizens/`);
  if (!res.ok) throw new Error(`Failed to load citizens (HTTP ${res.status})`);
  return res.json();
}

/**
 * Fetch complaints with optional filtering.
 */
export async function apiGetComplaints(filters?: {
  status?: string;
  departmentId?: number;
  phone?: string;
}): Promise<Complaint[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.departmentId) params.append('department_id', filters.departmentId.toString());
  if (filters?.phone) params.append('phone', filters.phone);

  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await fetchWithTimeout(`${API_BASE_URL}/complaints/${qs}`);
  if (!res.ok) throw new Error(`Failed to load complaints (HTTP ${res.status})`);
  return res.json();
}

/**
 * Track complaint by ID or phone number.
 */
export async function apiTrackComplaints(params: {
  id?: string | number;
  phone?: string;
}): Promise<Complaint[]> {
  const searchParams = new URLSearchParams();
  if (params.id) searchParams.append('id', params.id.toString());
  if (params.phone) searchParams.append('phone', params.phone.trim());

  const res = await fetchWithTimeout(
    `${API_BASE_URL}/complaints/track/?${searchParams.toString()}`
  );
  if (res.status === 404) return [];
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Tracking query failed (HTTP ${res.status})`);
  }
  return res.json();
}

/**
 * Lodge / Register a new complaint.
 */
export async function apiRegisterComplaint(data: {
  citizenName: string;
  phone: string;
  address: string;
  departmentId: number;
  category: string;
  description: string;
  location: string;
}): Promise<Complaint> {
  const payload = {
    citizenName: data.citizenName.trim(),
    phone: data.phone.trim(),
    address: data.address.trim(),
    departmentId: data.departmentId,
    category: data.category.trim(),
    description: data.description.trim(),
    location: data.location.trim(),
  };

  const res = await fetchWithTimeout(`${API_BASE_URL}/complaints/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const message =
      errData.detail ||
      Object.entries(errData)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`)
        .join(', ') ||
      `Submission failed (HTTP ${res.status})`;
    throw new Error(message);
  }

  return res.json();
}

/**
 * Multi-Factor Dispatch: Assign staff to a complaint.
 */
export async function apiAssignComplaint(
  complaintId: number,
  staffId: number,
  actionNotes?: string
): Promise<{ work_order: WorkOrder; complaint: Complaint }> {
  const res = await fetchWithTimeout(
    `${API_BASE_URL}/complaints/${complaintId}/assign/`,
    {
      method: 'POST',
      body: JSON.stringify({
        staff_id: staffId,
        action_notes: actionNotes || 'Dispatched via Multi-Factor Decision Engine.',
      }),
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Assignment failed (HTTP ${res.status})`);
  }

  return res.json();
}

/**
 * Fetch all work orders.
 */
export async function apiGetWorkOrders(filters?: {
  staffId?: number;
  workStatus?: string;
}): Promise<WorkOrder[]> {
  const params = new URLSearchParams();
  if (filters?.staffId) params.append('staff_id', filters.staffId.toString());
  if (filters?.workStatus) params.append('work_status', filters.workStatus);

  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await fetchWithTimeout(`${API_BASE_URL}/work-orders/${qs}`);
  if (!res.ok) throw new Error(`Failed to load work orders (HTTP ${res.status})`);
  return res.json();
}

/**
 * Update work order status and action taken.
 */
export async function apiUpdateWorkOrderStatus(
  workOrderId: number,
  status: WorkOrderStatus,
  actionNotes?: string
): Promise<WorkOrder> {
  const payload: Record<string, any> = { work_status: status };
  if (actionNotes !== undefined) {
    payload.action_taken = actionNotes;
  }

  const res = await fetchWithTimeout(`${API_BASE_URL}/work-orders/${workOrderId}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Work order update failed (HTTP ${res.status})`);
  }

  return res.json();
}

/**
 * Fetch decision audit logs.
 */
export async function apiGetAuditLogs(decision?: SupervisorDecision): Promise<DecisionAuditLog[]> {
  const url = decision
    ? `${API_BASE_URL}/agent/alerts/?decision=${decision}`
    : `${API_BASE_URL}/agent/alerts/`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Failed to load audit alerts (HTTP ${res.status})`);
  return res.json();
}

/**
 * Record supervisor decision on an agent alert.
 */
export async function apiDecideAuditLog(
  auditId: number,
  decision: SupervisorDecision,
  staffId: number = 1
): Promise<DecisionAuditLog> {
  const res = await fetchWithTimeout(`${API_BASE_URL}/agent/alerts/${auditId}/decide/`, {
    method: 'POST',
    body: JSON.stringify({ decision, staff_id: staffId }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Failed to record decision (HTTP ${res.status})`);
  }

  return res.json();
}

/**
 * Fetch administrative KPI analytics report.
 */
export async function apiGetReports(): Promise<any> {
  const res = await fetchWithTimeout(`${API_BASE_URL}/reports/`);
  if (!res.ok) throw new Error(`Failed to load KPI reports (HTTP ${res.status})`);
  return res.json();
}
