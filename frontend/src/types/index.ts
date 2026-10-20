export type ComplaintStatus =
  | 'Submitted'
  | 'Categorized'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Verified'
  | 'Closed'
  | 'Rejected';

export type WorkOrderStatus =
  | 'Assigned'
  | 'In Progress'
  | 'Completed'
  | 'On Hold'
  | 'Cancelled';

export type AlertType =
  | 'Overdue Alert'
  | 'Workload Check'
  | 'Recurring Issue';

export type SupervisorDecision =
  | 'Pending'
  | 'Approved'
  | 'Rejected';

export interface Citizen {
  citizen_id: number;
  name: string;
  phone: string;
  address: string;
  created_at?: string;
}

export interface Department {
  department_id: number;
  department_name: string;
  office_location: string;
  category_keywords?: string[];
}

export interface Staff {
  staff_id: number;
  department_id: number;
  name: string;
  phone: string;
  designation: string;
  is_active: boolean;
  department_name?: string;
}

export interface Complaint {
  complaint_id: number;
  citizen_id: number;
  department_id: number;
  complaint_date: string;
  category: string;
  description: string;
  location: string;
  status: ComplaintStatus;
  citizen_name?: string;
  citizen_phone?: string;
  department_name?: string;
  work_order?: WorkOrder;
}

export interface WorkOrder {
  work_order_id: number;
  complaint_id: number;
  staff_id: number;
  assigned_date: string;
  completion_date?: string | null;
  work_status: WorkOrderStatus;
  action_taken?: string | null;
  staff_name?: string;
  staff_phone?: string;
  department_name?: string;
}

export interface DecisionAuditLog {
  audit_id: number;
  complaint_id: number;
  work_order_id?: number | null;
  alert_type: AlertType;
  explanation: string;
  suggested_action: string;
  supervisor_decision: SupervisorDecision;
  decided_by_staff_id?: number | null;
  decision_timestamp?: string | null;
  created_at: string;
}

export interface SystemStats {
  totalComplaints: number;
  pendingCount: number;
  inProgressCount: number;
  resolvedCount: number;
  overdueCount: number;
  avgResolutionHours: number;
}
