'use client';

import React from 'react';
import { Building2, User, Wrench, BarChart3, Plus, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activePortal: 'citizen' | 'staff' | 'admin';
  setActivePortal: (portal: 'citizen' | 'staff' | 'admin') => void;
  onNewComplaintClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePortal,
  setActivePortal,
  onNewComplaintClick,
}) => {
  return (
    <header className="header-wrapper">
      <div className="container nav-container">
        {/* Brand Section with Bilingual Touch */}
        <div className="brand-section">
          <div className="brand-icon-box">
            <Building2 size={20} strokeWidth={2} />
          </div>
          <div className="brand-title-wrap">
            <span className="brand-title">
              MCMS Civic Portal
              <span className="urdu-text" style={{ fontSize: '0.95rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
                بلدیاتی پورٹل
              </span>
            </span>
            <span className="brand-subtitle">Municipal Complaint &amp; Inquiry System</span>
          </div>
        </div>

        {/* Portal Switcher Tabs */}
        <nav className="portal-tabs-nav" aria-label="Portal Selection">
          <button
            id="portal-nav-citizen"
            className={`portal-tab-btn ${activePortal === 'citizen' ? 'active' : ''}`}
            onClick={() => setActivePortal('citizen')}
          >
            <User size={16} strokeWidth={2} />
            <span>Citizen Hub</span>
            <span className="urdu-text" style={{ fontSize: '0.8rem', opacity: 0.85 }}>شہری</span>
          </button>
          <button
            id="portal-nav-staff"
            className={`portal-tab-btn ${activePortal === 'staff' ? 'active' : ''}`}
            onClick={() => setActivePortal('staff')}
          >
            <Wrench size={16} strokeWidth={2} />
            <span>Field Workdesk</span>
            <span className="urdu-text" style={{ fontSize: '0.8rem', opacity: 0.85 }}>فیلڈ ورک</span>
          </button>
          <button
            id="portal-nav-admin"
            className={`portal-tab-btn ${activePortal === 'admin' ? 'active' : ''}`}
            onClick={() => setActivePortal('admin')}
          >
            <BarChart3 size={16} strokeWidth={2} />
            <span>Command Center</span>
            <span className="urdu-text" style={{ fontSize: '0.8rem', opacity: 0.85 }}>انتظامیہ</span>
          </button>
        </nav>

        {/* Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="header-status-badge">
            <span className="status-dot-pulse"></span>
            <span>Online</span>
          </div>
          <button
            id="btn-quick-file-complaint"
            className="btn-primary btn-sm"
            onClick={onNewComplaintClick}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>File Grievance</span>
            <span className="urdu-text" style={{ fontSize: '0.82rem', marginLeft: '0.2rem' }}>درج کریں</span>
          </button>
        </div>
      </div>
    </header>
  );
};
