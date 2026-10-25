'use client';

import React, { useState } from 'react';
import {
  Building2,
  User,
  Wrench,
  BarChart3,
  Plus,
  Search,
  Menu,
  X,
  Database,
  CheckCircle2,
  AlertCircle,
  Home,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  activePortal: 'citizen' | 'staff' | 'admin' | 'dbms-lab';
  setActivePortal: (portal: 'citizen' | 'staff' | 'admin' | 'dbms-lab') => void;
  citizenTab?: 'submit' | 'track';
  setCitizenTab?: (tab: 'submit' | 'track') => void;
  onNewComplaintClick: () => void;
  onTrackClick: () => void;
  fontSizeLevel: 'normal' | 'large' | 'larger';
  onFontSizeChange: (level: 'normal' | 'large' | 'larger') => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  backendConnected?: boolean;
  onReconnect?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePortal,
  setActivePortal,
  citizenTab = 'submit',
  setCitizenTab,
  onNewComplaintClick,
  onTrackClick,
  fontSizeLevel,
  onFontSizeChange,
  highContrast,
  onToggleHighContrast,
  backendConnected = false,
  onReconnect,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePortalSwitch = (portal: 'citizen' | 'staff' | 'admin' | 'dbms-lab', tab?: 'submit' | 'track') => {
    setActivePortal(portal);
    if (portal === 'citizen' && tab && setCitizenTab) {
      setCitizenTab(tab);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header-wrapper persistent-navbar">
        {/* Main Navigation Bar */}
        <div className="main-nav-bar">
          <div className="container nav-container">
            {/* Brand Logo & Authority Label */}
            <div
              className="brand-section"
              onClick={() => handlePortalSwitch('citizen', 'submit')}
              role="button"
              tabIndex={0}
              aria-label="Navigate to Home"
            >
              <div className="brand-icon-box">
                <Building2 size={22} strokeWidth={2.2} />
              </div>
              <div className="brand-title-wrap">
                <div className="brand-title-row">
                  <span className="brand-title">
                    Karachi Metropolitan <span className="brand-accent">Redressal</span>
                  </span>
                </div>
                <span className="brand-subtitle">
                  Municipal Grievance &amp; Field Dispatch Authority
                </span>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="portal-tabs-nav" aria-label="Portal Selection">
              <button
                id="portal-nav-citizen"
                className={`portal-tab-btn ${activePortal === 'citizen' && citizenTab === 'submit' ? 'active' : ''}`}
                onClick={() => handlePortalSwitch('citizen', 'submit')}
              >
                <User size={15} strokeWidth={2.2} />
                <span>Citizen Portal</span>
              </button>

              <button
                id="portal-nav-track"
                className={`portal-tab-btn ${activePortal === 'citizen' && citizenTab === 'track' ? 'active' : ''}`}
                onClick={() => {
                  onTrackClick();
                  setMobileMenuOpen(false);
                }}
              >
                <Search size={15} strokeWidth={2.2} />
                <span>Live Tracker</span>
              </button>

              <button
                id="portal-nav-staff"
                className={`portal-tab-btn ${activePortal === 'staff' ? 'active' : ''}`}
                onClick={() => handlePortalSwitch('staff')}
              >
                <Wrench size={15} strokeWidth={2.2} />
                <span>Staff Workdesk</span>
              </button>

              <button
                id="portal-nav-admin"
                className={`portal-tab-btn ${activePortal === 'admin' ? 'active' : ''}`}
                onClick={() => handlePortalSwitch('admin')}
              >
                <BarChart3 size={15} strokeWidth={2.2} />
                <span>Dispatch Center</span>
              </button>

              <button
                id="portal-nav-dbms"
                className={`portal-tab-btn portal-tab-dbms ${activePortal === 'dbms-lab' ? 'active' : ''}`}
                onClick={() => handlePortalSwitch('dbms-lab')}
                title="Curriculum Database Theory & 3NF Schema Lab"
              >
                <Database size={15} strokeWidth={2.2} />
                <span>DBMS 3NF Lab</span>
              </button>
            </nav>

            {/* Desktop Actions & Status */}
            <div className="nav-actions-desktop">
              {/* Database Live Connectivity Badge */}
              <div
                className={`nav-status-chip ${backendConnected ? 'connected' : 'cached'}`}
                title={backendConnected ? 'PostgreSQL Database Live & Synced' : 'Offline Local Storage Cache'}
                onClick={onReconnect}
              >
                <span className={`status-dot-pulse ${backendConnected ? 'dot-online' : 'dot-offline'}`} />
                <span className="nav-status-label">{backendConnected ? 'DB Live' : 'Cached'}</span>
              </div>

              {/* Primary Call to Action Button */}
              <button
                id="btn-quick-file-complaint"
                className="btn-pill-primary btn-sm"
                onClick={onNewComplaintClick}
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>Lodge Grievance</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-nav-toggle"
              className="mobile-hamburger-btn"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-drawer-header">
                <div className="brand-section">
                  <div className="brand-icon-box sm">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <div className="brand-title" style={{ fontSize: '1rem' }}>
                      Karachi Metropolitan <span style={{ color: '#047857' }}>Redressal</span>
                    </div>
                    <span className="brand-subtitle" style={{ fontSize: '0.68rem' }}>
                      MCMS Civic Portal
                    </span>
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
                  <span className="mobile-group-label">Municipal Portals</span>
                  <button
                    className={`mobile-nav-item ${activePortal === 'citizen' && citizenTab === 'submit' ? 'active' : ''}`}
                    onClick={() => handlePortalSwitch('citizen', 'submit')}
                  >
                    <div className="mobile-item-icon">
                      <User size={18} />
                    </div>
                    <div className="mobile-item-text">
                      <strong>Citizen Portal</strong>
                      <span>Lodge civic issues &amp; verify tickets</span>
                    </div>
                  </button>

                  <button
                    className={`mobile-nav-item ${activePortal === 'citizen' && citizenTab === 'track' ? 'active' : ''}`}
                    onClick={() => {
                      onTrackClick();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <div className="mobile-item-icon">
                      <Search size={18} />
                    </div>
                    <div className="mobile-item-text">
                      <strong>Live Tracker</strong>
                      <span>Real-time milestone progress &amp; 3NF audit</span>
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
                      <strong>Staff Workdesk</strong>
                      <span>Field crew assignments &amp; repair orders</span>
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
                      <strong>Dispatch Center</strong>
                      <span>Multi-factor technician allocation &amp; SLAs</span>
                    </div>
                  </button>

                  <button
                    className={`mobile-nav-item ${activePortal === 'dbms-lab' ? 'active' : ''}`}
                    onClick={() => handlePortalSwitch('dbms-lab')}
                  >
                    <div className="mobile-item-icon" style={{ color: '#047857' }}>
                      <Database size={18} />
                    </div>
                    <div className="mobile-item-text">
                      <strong style={{ color: '#047857' }}>DBMS 3NF Architecture Lab</strong>
                      <span>Normalization, ANSI-SPARC, Relational Algebra</span>
                    </div>
                  </button>
                </div>

                <div className="mobile-drawer-actions">
                  <button
                    className="btn-pill-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      onNewComplaintClick();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    <span>Lodge Grievance</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav hide-on-desktop" aria-label="Mobile Navigation">
        <button
          className={`bottom-nav-item ${activePortal === 'citizen' && citizenTab === 'submit' ? 'active' : ''}`}
          onClick={() => handlePortalSwitch('citizen', 'submit')}
        >
          <Home size={18} />
          <span>Home</span>
        </button>

        <button
          className="bottom-nav-item"
          onClick={onNewComplaintClick}
        >
          <div className="bottom-nav-lodge-bubble">
            <Plus size={18} strokeWidth={3} />
          </div>
          <span>Lodge</span>
        </button>

        <button
          className={`bottom-nav-item ${activePortal === 'citizen' && citizenTab === 'track' ? 'active' : ''}`}
          onClick={onTrackClick}
        >
          <Search size={18} />
          <span>Track</span>
        </button>

        <button
          className={`bottom-nav-item ${activePortal === 'staff' ? 'active' : ''}`}
          onClick={() => setActivePortal('staff')}
        >
          <Wrench size={18} />
          <span>Staff</span>
        </button>

        <button
          className={`bottom-nav-item ${activePortal === 'admin' ? 'active' : ''}`}
          onClick={() => setActivePortal('admin')}
        >
          <BarChart3 size={18} />
          <span>Admin</span>
        </button>

        <button
          className={`bottom-nav-item ${activePortal === 'dbms-lab' ? 'active' : ''}`}
          onClick={() => setActivePortal('dbms-lab')}
        >
          <Database size={18} />
          <span>Lab</span>
        </button>
      </nav>
    </>
  );
};
