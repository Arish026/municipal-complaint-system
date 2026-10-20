'use client';

import React, { useState } from 'react';
import {
  Building2,
  User,
  Wrench,
  BarChart3,
  Plus,
  PhoneCall,
  Search,
  Menu,
  X,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activePortal: 'citizen' | 'staff' | 'admin';
  setActivePortal: (portal: 'citizen' | 'staff' | 'admin') => void;
  onNewComplaintClick: () => void;
  onTrackClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePortal,
  setActivePortal,
  onNewComplaintClick,
  onTrackClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePortalSwitch = (portal: 'citizen' | 'staff' | 'admin') => {
    setActivePortal(portal);
    setMobileMenuOpen(false);
  };

  return (
    <header className="header-wrapper">
      {/* Top Utility Bar */}
      <div className="top-utility-bar">
        <div className="container top-utility-content">
          <div className="utility-left">
            <span className="utility-badge">
              <span className="status-dot-pulse"></span>
              Civic Operations Live
            </span>
            <a href="tel:1122" className="utility-item helpline-link">
              <PhoneCall size={13} className="text-primary" />
              <span>Emergency Hotline: <strong>1122</strong> (24/7 Toll-Free)</span>
            </a>
            <span className="utility-divider">|</span>
            <span className="utility-item hide-on-mobile">
              <Clock size={13} />
              <span>Depots Open: Mon – Sat 8:00 AM – 8:00 PM</span>
            </span>
          </div>
          <div className="utility-right">
            <span className="utility-item hide-on-mobile">
              <ShieldCheck size={13} color="#059669" />
              <span>3NF Relational Database Verified</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="main-nav-bar">
        <div className="container nav-container">
          {/* Brand Logo & Name */}
          <div
            className="brand-section"
            onClick={() => handlePortalSwitch('citizen')}
            style={{ cursor: 'pointer' }}
          >
            <div className="brand-icon-box">
              <Building2 size={22} strokeWidth={2.2} />
            </div>
            <div className="brand-title-wrap">
              <span className="brand-title">City Municipal Corporation</span>
              <span className="brand-subtitle">MCMS Civic Grievance &amp; Redressal Gateway</span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="portal-tabs-nav" aria-label="Portal Selection">
            <button
              id="portal-nav-citizen"
              className={`portal-tab-btn ${activePortal === 'citizen' ? 'active' : ''}`}
              onClick={() => handlePortalSwitch('citizen')}
            >
              <User size={16} strokeWidth={2} />
              <span>Citizen Portal</span>
            </button>
            <button
              id="portal-nav-track"
              className="portal-tab-btn"
              onClick={() => {
                onTrackClick();
                setMobileMenuOpen(false);
              }}
            >
              <Search size={16} strokeWidth={2} />
              <span>Live Tracker</span>
            </button>
            <button
              id="portal-nav-staff"
              className={`portal-tab-btn ${activePortal === 'staff' ? 'active' : ''}`}
              onClick={() => handlePortalSwitch('staff')}
            >
              <Wrench size={16} strokeWidth={2} />
              <span>Field Workdesk</span>
            </button>
            <button
              id="portal-nav-admin"
              className={`portal-tab-btn ${activePortal === 'admin' ? 'active' : ''}`}
              onClick={() => handlePortalSwitch('admin')}
            >
              <BarChart3 size={16} strokeWidth={2} />
              <span>Command Center</span>
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="nav-actions-desktop">
            <button
              id="btn-quick-file-complaint"
              className="btn-primary btn-sm"
              onClick={onNewComplaintClick}
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>File Grievance</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            id="mobile-nav-toggle"
            className="mobile-hamburger-btn"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Reactive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="brand-section">
                <div className="brand-icon-box sm">
                  <Building2 size={18} />
                </div>
                <div>
                  <div className="brand-title" style={{ fontSize: '1rem' }}>Municipal Portal</div>
                  <div className="brand-subtitle" style={{ fontSize: '0.72rem' }}>Civic Services &amp; Tracking</div>
                </div>
              </div>
              <button
                className="btn-icon-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-body">
              <div className="mobile-nav-group">
                <span className="mobile-group-label">Select Civic Workspace</span>
                <button
                  className={`mobile-nav-item ${activePortal === 'citizen' ? 'active' : ''}`}
                  onClick={() => handlePortalSwitch('citizen')}
                >
                  <div className="mobile-item-icon">
                    <User size={18} />
                  </div>
                  <div className="mobile-item-text">
                    <strong>Citizen Portal</strong>
                    <span>Submit grievances and check neighborhood tickets</span>
                  </div>
                </button>

                <button
                  className="mobile-nav-item"
                  onClick={() => {
                    onTrackClick();
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="mobile-item-icon">
                    <Search size={18} />
                  </div>
                  <div className="mobile-item-text">
                    <strong>Live Ticket Tracker</strong>
                    <span>Real-time inspection and resolution progress</span>
                  </div>
                </button>

                <button
                  className={`mobile-nav-item ${activePortal === 'staff' ? 'active' : ''}`}
                  onClick={() => handlePortalSwitch('staff')}
                >
                  <div className="mobile-item-icon">
                    <Wrench size={18} />
                  </div>
                  <div className="mobile-item-text">
                    <strong>Field Workdesk</strong>
                    <span>Technician dispatches, job orders &amp; status logs</span>
                  </div>
                </button>

                <button
                  className={`mobile-nav-item ${activePortal === 'admin' ? 'active' : ''}`}
                  onClick={() => handlePortalSwitch('admin')}
                >
                  <div className="mobile-item-icon">
                    <BarChart3 size={18} />
                  </div>
                  <div className="mobile-item-text">
                    <strong>Command Center</strong>
                    <span>Departmental analytics, backlogs &amp; supervisor audits</span>
                  </div>
                </button>
              </div>

              <div className="mobile-drawer-actions">
                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
                  onClick={() => {
                    onNewComplaintClick();
                    setMobileMenuOpen(false);
                  }}
                >
                  <Plus size={18} strokeWidth={2.5} />
                  <span>File a Grievance Now</span>
                </button>

                <a
                  href="tel:1122"
                  className="btn-helpline-pulse"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem', padding: '0.8rem' }}
                >
                  <PhoneCall size={18} />
                  <span>Emergency Hotline: Dial 1122</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
