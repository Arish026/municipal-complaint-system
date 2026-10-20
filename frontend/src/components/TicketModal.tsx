'use client';

import React, { useState } from 'react';
import { Complaint } from '../types';
import { CheckCircle2, Copy, Check, ExternalLink, X, MapPin, Calendar, Building2 } from 'lucide-react';

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle2 size={22} color="#059669" strokeWidth={2} />
            <div>
              <h2 className="modal-title">
                Grievance Registered
                <span className="urdu-text" style={{ fontSize: '0.95rem', color: '#059669', marginLeft: '0.5rem' }}>
                  شکایت درج ہوگئی
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div
            style={{
              textAlign: 'center',
              padding: '1.25rem',
              background: 'var(--primary-tint)',
              border: '1.5px dashed #bfdbfe',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-blue)', display: 'block' }}>
              Tracking Reference Code • شکایتی کوڈ
            </span>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: 'var(--text-main)',
                marginTop: '0.2rem',
                fontFamily: 'monospace',
              }}
            >
              {ticketCode}
            </div>
            <button
              onClick={handleCopy}
              className="btn-secondary btn-sm"
              style={{ marginTop: '0.65rem' }}
              id="btn-copy-ticket-ref"
            >
              {copied ? <Check size={13} color="#059669" strokeWidth={2.5} /> : <Copy size={13} />}
              <span>{copied ? 'Copied Reference' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Details */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
              fontSize: '0.85rem',
              background: 'var(--bg-subtle)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>
                Citizen Name
              </span>
              <strong style={{ color: 'var(--text-main)' }}>{complaint.citizen_name || 'Citizen'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>
                Contact Phone
              </span>
              <strong style={{ color: 'var(--text-main)' }}>{complaint.citizen_phone || 'Verified'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>
                Target Department
              </span>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                {complaint.department_name}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>
                Category
              </span>
              <strong style={{ color: 'var(--primary-blue)' }}>{complaint.category}</strong>
            </div>
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>
                Location
              </span>
              <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                {complaint.location}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: '#065f46',
            }}
          >
            <strong>Note:</strong> Your grievance has been recorded. Our municipal response team will inspect the site and update status accordingly.
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
          <button
            id="btn-modal-track-now"
            className="btn-primary btn-sm"
            onClick={() => {
              onTrack(complaint.complaint_id);
              onClose();
            }}
          >
            <ExternalLink size={14} />
            <span>Track Grievance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
