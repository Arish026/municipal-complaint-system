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
} from 'lucide-react';

interface NavbarProps {
  activePortal: 'citizen' | 'staff' | 'admin';
  setActivePortal: (portal: 'citizen' | 'staff' | 'admin') => void;
  onNewComplaintClick: () => void;
  onTrackClick: () => void;
  fontSizeLevel: 'normal' | 'large' | 'larger';
  onFontSizeChange: (level: 'normal' | 'large' | 'larger') => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePortalSwitch = (portal: 'citizen' | 'staff' | 'admin') => {
    setActivePortal(portal);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header-wrapper persistent-navbar">
        {/* Top Utility Bar with Accessibility Controls & Live Indicators (NO HELPLINES/NUMBERS) */}
        <div className="top-utility-bar">
          <div className="container top-utility-content">
            <div className="utility-left">
              <span className="utility-badge">
                <span className="status-dot-pulse" />
                Karachi Municipal Grid Live
              </span>
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

            {/* Ease of Access Controls: Font Scaling & High Contrast */}
            <div className="utility-right accessibility-tray">
              <div className="a11y-control-group" title="Adjust Interface Text Size">
                <Type size={12} className="a11y-icon" />
                <button
                  type="button"
                  className={`a11y-btn ${fontSizeLevel === 'normal' ? 'active' : ''}`}
                  onClick={() => onFontSizeChange('normal')}
                  aria-label="Standard Font Size"
                >
                  A
                </button>
                <button
                  type="button"
                  className={`a11y-btn ${fontSizeLevel === 'large' ? 'active' : ''}`}
                  onClick={() => onFontSizeChange('large')}
                  aria-label="Large Font Size"
                >
                  A+
                </button>
                <button
                  type="button"
                  className={`a11y-btn ${fontSizeLevel === 'larger' ? 'active' : ''}`}
                  onClick={() => onFontSizeChange('larger')}
                  aria-label="Extra Large Font Size"
                >
                  A++
                </button>
              </div>

              <span className="utility-divider">|</span>

              <button
                type="button"
                className={`a11y-contrast-toggle ${highContrast ? 'active' : ''}`}
                onClick={onToggleHighContrast}
                title="Toggle High Contrast for Visual Ease"
                aria-label="Toggle High Contrast Mode"
              >
                <Eye size={12} />
                <span>{highContrast ? 'High Contrast: On' : 'Contrast'}</span>
              </button>

              <span className="utility-divider hide-on-mobile">|</span>

              <span className="utility-item hide-on-mobile">
                <ShieldCheck size={12} color="var(--primary-moss)" />
                <span>Verified 3NF Schema</span>
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
                <span>Command Center</span>
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
