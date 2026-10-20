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
  Calendar,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={20} color="#059669" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="modal-title">Grievance Registered Successfully</h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Official Municipal Dispatch Receipt
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Tracking Ticket Box */}
          <div className="modal-ticket-highlight">
            <span className="modal-ticket-caption">Official Tracking Reference Code</span>
            <div className="modal-ticket-code">{ticketCode}</div>
            <button
              id="btn-copy-ticket-ref"
              onClick={handleCopy}
              className="btn-secondary btn-sm"
              style={{ marginTop: '0.65rem' }}
            >
              {copied ? <Check size={14} color="#059669" strokeWidth={2.5} /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Tracking Code'}</span>
            </button>
          </div>

          {/* Key Ticket Details */}
          <div className="modal-details-grid">
            <div className="modal-detail-box">
              <span className="modal-detail-lbl">
                <User size={12} />
                <span>Submitter</span>
              </span>
              <strong className="modal-detail-val">{complaint.citizen_name || 'Verified Citizen'}</strong>
            </div>

            <div className="modal-detail-box">
              <span className="modal-detail-lbl">
                <Phone size={12} />
                <span>Contact Phone</span>
              </span>
              <strong className="modal-detail-val">{complaint.citizen_phone || 'Verified'}</strong>
            </div>

            <div className="modal-detail-box">
              <span className="modal-detail-lbl">
                <Building2 size={12} />
                <span>Target Department</span>
              </span>
              <strong className="modal-detail-val" style={{ color: 'var(--primary-blue)' }}>
                {complaint.department_name}
              </strong>
            </div>

            <div className="modal-detail-box">
              <span className="modal-detail-lbl">
                <Tag size={12} />
                <span>Issue Category</span>
              </span>
              <strong className="modal-detail-val">{complaint.category}</strong>
            </div>

            <div className="modal-detail-box full-width">
              <span className="modal-detail-lbl">
                <MapPin size={12} />
                <span>Incident Location</span>
              </span>
              <span className="modal-detail-val">{complaint.location}</span>
            </div>
          </div>

          {/* Informational SLA Note */}
          <div className="modal-sla-note">
            <ShieldCheck size={16} color="#059669" />
            <span>
              <strong>Municipal SLA Standard:</strong> An on-site inspection crew will be dispatched within 24 hours. You can track progress in real time using your ticket code.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} style={{ padding: '0.65rem 1.25rem' }}>
            Done
          </button>
          <button
            id="btn-modal-track-now"
            className="btn-primary"
            style={{ padding: '0.65rem 1.25rem' }}
            onClick={() => {
              onTrack(complaint.complaint_id);
              onClose();
            }}
          >
            <ExternalLink size={15} />
            <span>Track Grievance Live</span>
          </button>
        </div>
      </div>
    </div>
  );
};
