'use client';

import React, { useState, useMemo } from 'react';
import { Staff, WorkOrder, Complaint, WorkOrderStatus } from '../types';
import {
  Wrench,
  Check,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  FileCheck,
  Send,
  Building2,
  User,
  ShieldCheck,
  Filter,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface StaffPortalProps {
  staffList: Staff[];
  workOrders: WorkOrder[];
  complaints: Complaint[];
  onUpdateWorkOrder: (
    workOrderId: number,
    status: WorkOrderStatus,
    actionNotes?: string
  ) => void;
}

export const StaffPortal: React.FC<StaffPortalProps> = ({
  staffList,
  workOrders,
  complaints,
  onUpdateWorkOrder,
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState<number>(staffList[0]?.staff_id || 6);
  const [statusFilter, setStatusFilter] = useState<'ALL' | WorkOrderStatus>('ALL');

  const [activeEditingOrder, setActiveEditingOrder] = useState<WorkOrder | null>(null);
  const [editStatus, setEditStatus] = useState<WorkOrderStatus>('In Progress');
  const [actionNotes, setActionNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const currentStaff = useMemo(
    () => staffList.find((s) => s.staff_id === selectedStaffId) || staffList[0],
    [staffList, selectedStaffId]
  );

  const staffOrders = useMemo(() => {
    return workOrders.filter((order) => {
      const matchStaff = order.staff_id === selectedStaffId;
      if (!matchStaff) return false;
      if (statusFilter === 'ALL') return true;
      return order.work_status === statusFilter;
    });
  }, [workOrders, selectedStaffId, statusFilter]);

  const handleOpenEdit = (order: WorkOrder) => {
    setActiveEditingOrder(order);
    setEditStatus(order.work_status);
    setActionNotes(order.action_taken || '');
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEditingOrder) return;

    setIsUpdating(true);
    setTimeout(() => {
      onUpdateWorkOrder(activeEditingOrder.work_order_id, editStatus, actionNotes);
      setIsUpdating(false);
      setActiveEditingOrder(null);
    }, 200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Banner */}
      <div className="civic-card">
        <div className="civic-card-header">
          <div>
            <span className="hero-pill">
              <Wrench size={13} color="var(--primary-blue)" />
              Field Operations &amp; Inspection Desk
            </span>
            <h2 className="civic-card-title">Field Technician Workdesk</h2>
            <p className="civic-card-desc">
              Manage assigned municipal work orders, log physical on-site diagnostic remarks, and certify maintenance resolution.
            </p>
          </div>

          {/* Profile Switcher */}
          <div style={{ minWidth: '260px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Select Active Field Personnel:
            </label>
            <select
              id="select-active-technician"
              className="form-select"
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(Number(e.target.value))}
            >
              {staffList.map((s) => (
                <option key={s.staff_id} value={s.staff_id}>
                  {s.name} ({s.designation})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Technician Info Banner */}
        <div className="staff-info-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="staff-avatar-circle">
              {currentStaff.name.charAt(0)}
            </div>
            <div>
              <strong style={{ fontSize: '1rem', color: 'var(--text-main)', display: 'block' }}>
                {currentStaff.name}
              </strong>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {currentStaff.designation} • {currentStaff.phone}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', flexWrap: 'wrap' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Assigned Jobs</span>
              <strong style={{ color: 'var(--primary-blue)', fontSize: '0.95rem' }}>
                {staffOrders.length} Tasks
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Operating Department</span>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                {currentStaff.department_name}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="staff-filter-bar">
        <div className="segmented-toggle">
          {(['ALL', 'Assigned', 'In Progress', 'Completed'] as const).map((filter) => (
            <button
              key={filter}
              id={`filter-workorder-${filter.toLowerCase().replace(' ', '-')}`}
              className={`segmented-toggle-btn ${statusFilter === filter ? 'active' : ''}`}
              onClick={() => setStatusFilter(filter)}
            >
              {filter === 'ALL' ? 'All Orders' : filter}
            </button>
          ))}
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Showing {staffOrders.length} work orders in technician queue
        </span>
      </div>

      {/* Orders Grid */}
      {staffOrders.length > 0 ? (
        <div className="work-orders-grid">
          {staffOrders.map((order) => {
            const linkedComplaint = complaints.find((c) => c.complaint_id === order.complaint_id);

            return (
              <div key={order.work_order_id} className="civic-card work-order-card">
                <div className="work-order-top">
                  <div>
                    <span className="work-order-id-code">
                      WORK ORDER #{order.work_order_id.toString().padStart(4, '0')}
                    </span>
                    <h3 className="work-order-title">
                      {linkedComplaint?.category || 'Field Repair'}
                    </h3>
                  </div>
                  <span className={`status-pill status-${order.work_status.toLowerCase().replace(/\s+/g, '')}`}>
                    {order.work_status}
                  </span>
                </div>

                <div className="work-order-location-box">
                  <div className="location-heading">
                    <MapPin size={15} />
                    <span>{linkedComplaint?.location || 'Assigned Zone'}</span>
                  </div>
                  <p className="location-desc">
                    {linkedComplaint?.description || 'Inspection and site maintenance required.'}
                  </p>
                </div>

                <div className="inspection-log-box">
                  <span className="log-caption">
                    <FileCheck size={12} />
                    <span>Inspection Remarks &amp; Action Taken:</span>
                  </span>
                  <div className="log-text">
                    {order.action_taken || 'No field remarks logged yet.'}
                  </div>
                </div>

                <div className="work-order-footer">
                  <div className="assigned-date-item">
                    <Calendar size={13} />
                    <span>Assigned: {new Date(order.assigned_date).toLocaleDateString()}</span>
                  </div>
                  <button
                    id={`btn-update-order-${order.work_order_id}`}
                    className="btn-primary btn-sm"
                    onClick={() => handleOpenEdit(order)}
                  >
                    <FileCheck size={14} />
                    <span>Update Status</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="civic-card empty-orders-card">
          <Clock size={32} strokeWidth={1.5} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem' }} />
          <h3>No Assigned Jobs Found</h3>
          <p>No active work orders currently assigned to {currentStaff.name} matching filter &ldquo;{statusFilter}&rdquo;.</p>
        </div>
      )}

      {/* UPDATE MODAL */}
      {activeEditingOrder && (
        <div className="modal-overlay" onClick={() => setActiveEditingOrder(null)} role="dialog" aria-modal="true">
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                Update Work Order #{activeEditingOrder.work_order_id.toString().padStart(4, '0')}
              </h2>
            </div>
            <form onSubmit={handleSaveUpdate}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <Activity size={14} />
                    <span>Work Order Status *</span>
                  </label>
                  <select
                    id="select-edit-order-status"
                    className="form-select"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as WorkOrderStatus)}
                  >
                    <option value="Assigned">Assigned (Queued)</option>
                    <option value="In Progress">In Progress (Field Work Started)</option>
                    <option value="Completed">Completed (Repairs Executed)</option>
                    <option value="On Hold">On Hold (Pending Material)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FileCheck size={14} />
                    <span>Field Action Notes &amp; Observations</span>
                  </label>
                  <textarea
                    id="input-edit-order-notes"
                    className="form-textarea"
                    rows={3}
                    placeholder="Describe what was repaired, inspected, or replaced on site..."
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => setActiveEditingOrder(null)}
                >
                  Cancel
                </button>
                <button
                  id="btn-save-order-status"
                  type="submit"
                  className="btn-primary btn-sm"
                  disabled={isUpdating}
                >
                  <Send size={14} />
                  <span>{isUpdating ? 'Saving...' : 'Save Update'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
