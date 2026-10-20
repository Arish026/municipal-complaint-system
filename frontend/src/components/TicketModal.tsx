'use client';

import React, { useState } from 'react';
import { Complaint } from '../types';
import {
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  X,
  MapPin,
  Building2,
  Tag,
  Phone,
  User,
  ShieldCheck,
} from 'lucide-react';

interface TicketModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  onTrack: (complaintId: number) => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  complaint,
  onClose,
  onTrack,
}) => {
  const [copied, setCopied] = useState(false);

  if (!complaint) return null;

  const ticketCode = `CMP-${complaint.complaint_id.toString().padStart(4, '0')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(ticketCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <div className="modal-icon-bubble">
              <CheckCircle2 size={18} color="#233d2c" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="modal-title">Grievance Registered</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Official Municipal Dispatch Receipt
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Tracking Ticket Box */}
          <div className="modal-ticket-highlight">
            <span className="modal-ticket-caption">Tracking Ticket</span>
            <div className="modal-ticket-code">{ticketCode}</div>
            <button
              id="btn-copy-ticket-ref"
              onClick={handleCopy}
              className="btn-pill-secondary btn-sm"
              style={{ marginTop: '0.5rem' }}
            >
              {copied ? <Check size={12} color="#233d2c" strokeWidth={2.5} /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Details */}
          <div className="modal-details-grid">
            <div className="modal-detail-box">
              <span className="modal-detail-lbl">
                <User size={11} />
                <span>Citizen</span>
              </span>
              <strong className="modal-detail-val">{complaint.citizen_name || 'Resident'}</strong>
            </div>

            <div className="modal-detail-box">
              <span className="modal-detail-lbl">
                <Building2 size={11} />
                <span>Department</span>
              </span>
              <strong className="modal-detail-val">{complaint.department_name}</strong>
            </div>

            <div className="modal-detail-box">
              <span className="modal-detail-lbl">
                <Tag size={11} />
                <span>Issue</span>
              </span>
              <strong className="modal-detail-val">{complaint.category}</strong>
            </div>

            <div className="modal-detail-box">
              <span className="modal-detail-lbl">
                <MapPin size={11} />
                <span>Location</span>
              </span>
              <span className="modal-detail-val">{complaint.location}</span>
            </div>
          </div>

          <div className="modal-sla-note">
            <ShieldCheck size={14} color="#233d2c" />
            <span>Inspection crew assigned within 24 hours.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-pill-secondary btn-sm" onClick={onClose}>
            Done
          </button>
          <button
            id="btn-modal-track-now"
            className="btn-pill-primary btn-sm"
            onClick={() => {
              onTrack(complaint.complaint_id);
              onClose();
            }}
          >
            <ExternalLink size={13} />
            <span>Track Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
