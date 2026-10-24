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
  ShieldCheck,
  Clock,
  Home,
  Eye,
  Type,
  MapPin,
  Database,
} from 'lucide-react';

interface NavbarProps {
  activePortal: 'citizen' | 'staff' | 'admin' | 'dbms-lab';
  setActivePortal: (portal: 'citizen' | 'staff' | 'admin' | 'dbms-lab') => void;
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

  const handlePortalSwitch = (portal: 'citizen' | 'staff' | 'admin' | 'dbms-lab') => {
    setActivePortal(portal);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header-wrapper persistent-navbar">
        {/* Top Utility Bar with Accessibility Controls & Live Indicators */}
        <div className="top-utility-bar">
          <div className="container top-utility-content">
            <div className="utility-left">
              <span
                className={`utility-badge ${backendConnected ? 'badge-api-connected' : 'badge-api-offline'}`}
                title={backendConnected ? 'Live Django REST API connected (PostgreSQL / SQLite)' : 'Backend API disconnected; operating in local storage mode'}
              >
                <span className={`status-dot-pulse ${backendConnected ? 'dot-online' : 'dot-offline'}`} />
                {backendConnected ? 'Django API Live' : 'Offline Cache Mode'}
              </span>
              {!backendConnected && onReconnect && (
                <button
                  type="button"
                  className="reconnect-api-btn"
                  onClick={onReconnect}
                  title="Retry connecting to Django backend server"
                >
                  Connect API
                </button>
              )}
              <span className="utility-item hide-on-mobile">
                <MapPin size={12} />
                <span>Zone: All 7 Karachi Districts</span>
              </span>
              <span className="utility-divider hide-on-mobile">|</span>
              <span className="utility-item hide-on-mobile">
                <Clock size={12} />
                <span>Field Depots: 24/7 Mon–Sun</span>
              </span>
            </div>

            {/* Operational Summary & Live System Status */}
            <div className="utility-right">
              <span className="utility-item hide-on-mobile">
                <span className="status-dot-pulse" style={{ backgroundColor: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                <span>Multi-Factor Dispatch SLA Engine Active</span>
              </span>
              <span className="utility-divider hide-on-mobile">|</span>
              <span className="utility-item hide-on-mobile" style={{ color: '#e5ede7', fontWeight: 600 }}>
                High-Contrast Operational Mode
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
                <Building2 size={20} strokeWidth={2.2} />
              </div>
              <div className="brand-title-wrap">
                <span className="brand-title">Karachi Metropolitan Redressal</span>
                <span className="brand-subtitle">Municipal Complaint &amp; Dispatch Gateway</span>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="portal-tabs-nav" aria-label="Portal Selection">
              <button
                id="portal-nav-citizen"
                className={`portal-tab-btn ${activePortal === 'citizen' ? 'active' : ''}`}
                onClick={() => handlePortalSwitch('citizen')}
              >
                <User size={15} strokeWidth={2} />
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
                <Search size={15} strokeWidth={2} />
                <span>Live Tracker</span>
              </button>
              <button
                id="portal-nav-staff"
                className={`portal-tab-btn ${activePortal === 'staff' ? 'active' : ''}`}
                onClick={() => handlePortalSwitch('staff')}
              >
                <Wrench size={15} strokeWidth={2} />
                <span>Staff Workdesk</span>
              </button>
              <button
                id="portal-nav-admin"
                className={`portal-tab-btn ${activePortal === 'admin' ? 'active' : ''}`}
                onClick={() => handlePortalSwitch('admin')}
              >
                <BarChart3 size={15} strokeWidth={2} />
                <span>Dispatch &amp; Command</span>
              </button>
              <button
                id="portal-nav-dbms"
                className={`portal-tab-btn portal-tab-dbms ${activePortal === 'dbms-lab' ? 'active' : ''}`}
                onClick={() => handlePortalSwitch('dbms-lab')}
                title="Curriculum Database Theory & 3NF Schema Lab"
              >
                <Database size={15} strokeWidth={2} />
                <span>DBMS 3NF Lab</span>
              </button>
            </nav>

            {/* Desktop Actions */}
            <div className="nav-actions-desktop">
              <button
                id="btn-quick-file-complaint"
                className="btn-pill-primary btn-sm"
                onClick={onNewComplaintClick}
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>Lodge Grievance</span>
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
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
                    <Building2 size={16} />
                  </div>
                  <div>
                    <div className="brand-title" style={{ fontSize: '0.92rem' }}>Karachi MCMS</div>
                  </div>
                </div>
                <button
                  className="btn-icon-close"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close Menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mobile-drawer-body">
                <div className="mobile-nav-group">
                  <span className="mobile-group-label">Municipal Portals</span>
                  <button
                    className={`mobile-nav-item ${activePortal === 'citizen' ? 'active' : ''}`}
                    onClick={() => handlePortalSwitch('citizen')}
                  >
                    <div className="mobile-item-icon">
                      <User size={16} />
                    </div>
                    <div className="mobile-item-text">
                      <strong>Citizen Portal</strong>
                      <span>Lodge and review neighborhood issues</span>
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
                      <Search size={16} />
                    </div>
                    <div className="mobile-item-text">
                      <strong>Live Tracker</strong>
                      <span>Check ticket milestone progress</span>
                    </div>
                  </button>

                  <button
                    className={`mobile-nav-item ${activePortal === 'staff' ? 'active' : ''}`}
                    onClick={() => handlePortalSwitch('staff')}
                  >
                    <div className="mobile-item-icon">
                      <Wrench size={16} />
                    </div>
                    <div className="mobile-item-text">
                      <strong>Field Workdesk</strong>
                      <span>Field crew assignments &amp; repair logs</span>
                    </div>
                  </button>

                  <button
                    className={`mobile-nav-item ${activePortal === 'admin' ? 'active' : ''}`}
                    onClick={() => handlePortalSwitch('admin')}
                  >
                    <div className="mobile-item-icon">
                      <BarChart3 size={16} />
                    </div>
                    <div className="mobile-item-text">
                      <strong>Supervisor Center</strong>
                      <span>Town hall SLA analytics &amp; escalations</span>
                    </div>
                  </button>

                  <button
                    className={`mobile-nav-item ${activePortal === 'dbms-lab' ? 'active' : ''}`}
                    onClick={() => handlePortalSwitch('dbms-lab')}
                  >
                    <div className="mobile-item-icon" style={{ color: '#38bdf8' }}>
                      <Database size={16} />
                    </div>
                    <div className="mobile-item-text">
                      <strong style={{ color: '#38bdf8' }}>DBMS 3NF Architecture Lab</strong>
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

      {/* Mobile Fixed Bottom Nav (Leafora App Style) */}
      <nav className="mobile-bottom-nav hide-on-desktop" aria-label="Mobile Bottom Navigation">
        <button
          className={`bottom-nav-item ${activePortal === 'citizen' ? 'active' : ''}`}
          onClick={() => setActivePortal('citizen')}
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
          className="bottom-nav-item"
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
      </nav>
    </>
  );
};
