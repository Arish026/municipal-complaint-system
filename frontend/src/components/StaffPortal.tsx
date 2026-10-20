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
            <span className="hero-pill">Field Operations</span>
            <h2 className="civic-card-title">
              Field Technician Workdesk
              <span className="urdu-text" style={{ fontSize: '1.15rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
                فیلڈ ورک ڈیسک
              </span>
            </h2>
            <p className="civic-card-desc">
              Manage on-site work orders, submit inspection remarks, and mark repairs as resolved.
            </p>
          </div>

          {/* Profile Switcher */}
          <div style={{ minWidth: '260px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Select Inspector Profile:
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
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--primary-tint)',
                border: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-blue)',
                fontWeight: 700,
                fontSize: '0.95rem',
              }}
            >
              {currentStaff.name.charAt(0)}
            </div>
            <div>
              <strong style={{ fontSize: '1rem', color: 'var(--text-main)', display: 'block' }}>
                {currentStaff.name}
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {currentStaff.designation} • {currentStaff.phone}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Assigned Jobs</span>
              <strong style={{ color: 'var(--primary-blue)', fontSize: '0.95rem' }}>
                {staffOrders.length} Tasks
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Department</span>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                {currentStaff.department_name}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
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
          Showing {staffOrders.length} jobs in queue
        </span>
      </div>

      {/* Orders Grid */}
      {staffOrders.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.15rem' }}>
          {staffOrders.map((order) => {
            const linkedComplaint = complaints.find((c) => c.complaint_id === order.complaint_id);

            return (
              <div
                key={order.work_order_id}
                className="civic-card"
                style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '1.25rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-light)' }}>
                      WORK ORDER #{order.work_order_id.toString().padStart(4, '0')}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 700, marginTop: '0.2rem' }}>
                      {linkedComplaint?.category || 'Field Repair'}
                    </h3>
                  </div>
                  <span className="badge badge-inprogress">
                    {order.work_status}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#d97706', fontWeight: 600, marginBottom: '0.3rem' }}>
                    <MapPin size={15} />
                    <span>{linkedComplaint?.location || 'Assigned Zone'}</span>
                  </div>
                  <p style={{ color: 'var(--text-body)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                    {linkedComplaint?.description || 'Inspection and site maintenance required.'}
                  </p>
                </div>

                <div
                  style={{
                    padding: '0.75rem',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', fontWeight: 600 }}>
                    Inspection Log &amp; Remarks:
                  </span>
                  <div style={{ color: 'var(--text-main)', marginTop: '0.2rem', fontWeight: 500 }}>
                    {order.action_taken || 'No field remarks logged yet.'}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Assigned: </span>
                    {new Date(order.assigned_date).toLocaleDateString()}
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
        <div className="civic-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <Clock size={28} strokeWidth={1.5} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem' }} />
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
            No Assigned Jobs Found
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            No work orders assigned to {currentStaff.name} matching filter &ldquo;{statusFilter}&rdquo;.
          </p>
        </div>
      )}

      {/* UPDATE MODAL */}
      {activeEditingOrder && (
        <div className="modal-overlay" onClick={() => setActiveEditingOrder(null)} role="dialog" aria-modal="true">
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                Update Work Order #{activeEditingOrder.work_order_id}
              </h2>
            </div>
            <form onSubmit={handleSaveUpdate}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
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
