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
  Home,
  FileText,
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
    <>
      <header className="header-wrapper">
        {/* Top Utility Bar */}
        <div className="top-utility-bar">
          <div className="container top-utility-content">
            <div className="utility-left">
              <span className="utility-badge">
                <span className="status-dot-pulse"></span>
                Operations Live
              </span>
              <a href="tel:1122" className="utility-item helpline-link">
                <PhoneCall size={12} />
                <span>Helpline: <strong>1122</strong> (24/7)</span>
              </a>
              <span className="utility-divider hide-on-mobile">|</span>
              <span className="utility-item hide-on-mobile">
                <Clock size={12} />
                <span>Mon–Sat 8:00 AM – 8:00 PM</span>
              </span>
            </div>
            <div className="utility-right">
              <span className="utility-item hide-on-mobile">
                <ShieldCheck size={12} color="#233d2c" />
                <span>3NF Relational System</span>
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
                <span className="brand-title">Municipal Corporation</span>
                <span className="brand-subtitle">Civic Grievance &amp; Redressal</span>
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
                <span>Citizen</span>
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
                <span>Track</span>
              </button>
              <button
                id="portal-nav-staff"
                className={`portal-tab-btn ${activePortal === 'staff' ? 'active' : ''}`}
                onClick={() => handlePortalSwitch('staff')}
              >
                <Wrench size={15} strokeWidth={2} />
                <span>Staff</span>
              </button>
              <button
                id="portal-nav-admin"
                className={`portal-tab-btn ${activePortal === 'admin' ? 'active' : ''}`}
                onClick={() => handlePortalSwitch('admin')}
              >
                <BarChart3 size={15} strokeWidth={2} />
                <span>Admin</span>
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
                    <div className="brand-title" style={{ fontSize: '0.95rem' }}>MCMS Redressal</div>
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
                  <span className="mobile-group-label">Navigation</span>
                  <button
                    className={`mobile-nav-item ${activePortal === 'citizen' ? 'active' : ''}`}
                    onClick={() => handlePortalSwitch('citizen')}
                  >
                    <div className="mobile-item-icon">
                      <User size={16} />
                    </div>
                    <div className="mobile-item-text">
                      <strong>Citizen Portal</strong>
                      <span>Submit and review issues</span>
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
                      <span>Check ticket inspection status</span>
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
                      <span>Technician job dispatches</span>
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
                      <span>Analytics and escalations</span>
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
                    <span>File Grievance</span>
                  </button>

                  <a
                    href="tel:1122"
                    className="btn-pill-secondary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                  >
                    <PhoneCall size={15} />
                    <span>Emergency: 1122</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Fixed Bottom Nav (Leafora App Style) */}
      <nav className="mobile-bottom-nav hide-on-desktop" aria-label="Mobile Navigation">
        <button
          className={`bottom-nav-item ${activePortal === 'citizen' ? 'active' : ''}`}
          onClick={() => setActivePortal('citizen')}
        >
          <Home size={19} />
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
          <Search size={19} />
          <span>Track</span>
        </button>

        <button
          className={`bottom-nav-item ${activePortal === 'staff' ? 'active' : ''}`}
          onClick={() => setActivePortal('staff')}
        >
          <Wrench size={19} />
          <span>Staff</span>
        </button>

        <button
          className={`bottom-nav-item ${activePortal === 'admin' ? 'active' : ''}`}
          onClick={() => setActivePortal('admin')}
        >
          <BarChart3 size={19} />
          <span>Admin</span>
        </button>
      </nav>
    </>
  );
};
