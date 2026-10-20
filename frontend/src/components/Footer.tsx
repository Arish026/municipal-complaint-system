'use client';

import React from 'react';
import {
  Building2,
  ShieldCheck,
  MapPin,
  Clock,
  Mail,
  Droplets,
  Construction,
  Trash2,
  Lightbulb,
  ShieldAlert,
  Trees,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-wrapper">
      {/* Main Footer Directory */}
      <div className="container footer-main-grid">
        {/* Column 1: Corporation Identity */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <div className="footer-brand-icon">
              <Building2 size={20} strokeWidth={2.2} />
            </div>
            <div>
              <span className="footer-brand-title">Karachi Metropolitan Corporation</span>
              <span className="footer-brand-sub">Civic Grievance &amp; Redressal System</span>
            </div>
          </div>
          <p className="footer-brand-desc">
            Direct municipal care and transparent grievance tracking for Karachi residents across all 7 districts.
          </p>
          <div className="footer-cert-badge">
            <ShieldCheck size={14} color="var(--primary-moss)" />
            <span>3NF Relational Architecture Verified</span>
          </div>
        </div>

        {/* Column 2: Civic Services */}
        <div className="footer-col">
          <h4 className="footer-col-title">Karachi Agencies</h4>
          <ul className="footer-links-list">
            <li>
              <a href="#portal-nav-citizen">
                <Droplets size={13} />
                <span>KWSC Water Supply</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-citizen">
                <Construction size={13} />
                <span>KMC Roads &amp; Works</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-citizen">
                <Trash2 size={13} />
                <span>SSWMB Solid Waste</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-citizen">
                <Lightbulb size={13} />
                <span>K-Electric Street Lighting</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-citizen">
                <ShieldAlert size={13} />
                <span>Sindh Health Vector Control</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-citizen">
                <Trees size={13} />
                <span>KMC Parks &amp; Forestry</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact & Hours */}
        <div className="footer-col">
          <h4 className="footer-col-title">Municipal Depots</h4>
          <div className="footer-contact-items">
            <div className="footer-contact-item">
              <MapPin size={14} />
              <span>Civic Centre, University Road, Gulshan-e-Iqbal, Karachi</span>
            </div>
            <div className="footer-contact-item">
              <Clock size={14} />
              <span>Town Hall Depots: Mon – Sun (24/7 Field Response)</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={14} />
              <span>grievances@karachicity.gov.pk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="footer-bottom-bar">
        <div className="container footer-bottom-content">
          <div className="footer-copy">
            &copy; 2026 Karachi Municipal Corporation. University of Karachi (BSCS) DBMS Coursework.
          </div>
          <div className="footer-status-indicator">
            <span className="footer-pulse-dot" />
            <span>Relational Services Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
