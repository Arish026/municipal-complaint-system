'use client';

import React from 'react';
import { AlertCircle, X, ShieldAlert, ArrowRight } from 'lucide-react';

interface ErrorModalProps {
  isOpen: boolean;
  title?: string;
  errors: string[];
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  title = 'Grievance Submission Incomplete',
  errors,
  onClose,
}) => {
  if (!isOpen || errors.length === 0) return null;

  return (
    <div className="modal-overlay error-modal-overlay" onClick={onClose} role="alertdialog">
      <div className="modal-dialog error-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header error-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="error-icon-bubble">
              <AlertCircle size={20} color="#993030" strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="modal-title" style={{ color: '#852929' }}>{title}</h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Please review required fields before dispatching
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close error popup">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body error-modal-body">
          <p className="error-modal-lead">
            The municipal system requires valid details for crew dispatch and SMS confirmation:
          </p>

          <ul className="error-list">
            {errors.map((err, idx) => (
              <li key={idx} className="error-list-item">
                <span className="error-bullet">•</span>
                <span>{err}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="modal-footer error-modal-footer">
          <button
            type="button"
            className="btn-pill-primary btn-sm"
            style={{ background: '#993030' }}
            onClick={onClose}
          >
            <span>Correct Highlighted Fields</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
