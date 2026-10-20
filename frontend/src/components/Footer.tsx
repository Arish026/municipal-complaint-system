'use client';

import React from 'react';
import {
  Building2,
  ShieldCheck,
  PhoneCall,
  MapPin,
  Clock,
  Mail,
  ExternalLink,
  FileText,
  Search,
  Droplets,
  Construction,
  Trash2,
  Lightbulb,
  ShieldAlert,
  Trees,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-wrapper">
      {/* Top Assistance Banner */}
      <div className="footer-cta-banner">
        <div className="container footer-cta-content">
          <div className="footer-cta-text">
            <div className="footer-cta-icon">
              <PhoneCall size={24} />
            </div>
            <div>
              <h3>24/7 Citizen Emergency &amp; Rapid Response Helpline</h3>
              <p>For urgent pipeline bursts, open manholes, electrical hazards, or road obstructions.</p>
            </div>
          </div>
          <div className="footer-cta-actions">
            <a href="tel:1122" className="btn-helpline-pulse">
              <PhoneCall size={18} />
              <span>Dial 1122 (Toll-Free)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="container footer-main-grid">
        {/* Column 1: Corporation Identity */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <div className="footer-brand-icon">
              <Building2 size={24} strokeWidth={2.2} />
            </div>
            <div>
              <span className="footer-brand-title">City Municipal Corporation</span>
              <span className="footer-brand-sub">MCMS Civic Grievance Gateway</span>
            </div>
          </div>
          <p className="footer-brand-desc">
            An integrated civic technology platform dedicated to transparent grievance resolution, rapid field maintenance dispatch, and citizen-first urban governance.
          </p>
          <div className="footer-cert-badge">
            <ShieldCheck size={16} color="var(--primary-blue)" />
            <span>ISO 9001:2015 Civic Quality Standards Certified</span>
          </div>
        </div>

        {/* Column 2: Civic Services Directory */}
        <div className="footer-col">
          <h4 className="footer-col-title">Municipal Services</h4>
          <ul className="footer-links-list">
            <li>
              <a href="#portal-nav-citizen">
                <Droplets size={14} color="#0284c7" />
                <span>Water Supply &amp; Pipeline Repairs</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-citizen">
                <Construction size={14} color="#d97706" />
                <span>Roads &amp; Civil Infrastructure</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-citizen">
                <Trash2 size={14} color="#059669" />
                <span>Solid Waste &amp; Refuse Collection</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-citizen">
                <Lightbulb size={14} color="#ca8a04" />
                <span>Street Lighting &amp; Electrical Grid</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-citizen">
                <ShieldAlert size={14} color="#e11d48" />
                <span>Public Health &amp; Vector Spraying</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-citizen">
                <Trees size={14} color="#0d9488" />
                <span>Parks &amp; Urban Forestry</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Citizen Resources & Governance */}
        <div className="footer-col">
          <h4 className="footer-col-title">Citizen Resources</h4>
          <ul className="footer-links-list">
            <li>
              <a href="#portal-nav-citizen">
                <FileText size={14} />
                <span>Citizen Service Charter &amp; SLA</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-citizen">
                <Search size={14} />
                <span>Track Complaint by Ticket ID</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-staff">
                <ShieldCheck size={14} />
                <span>Field Inspector Verification</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-admin">
                <ExternalLink size={14} />
                <span>Right to Information (RTI) Portal</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-admin">
                <BookOpen size={14} />
                <span>Municipal By-Laws &amp; Regulations</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Central Depots & Contact */}
        <div className="footer-col">
          <h4 className="footer-col-title">Depots &amp; Contact</h4>
          <div className="footer-contact-items">
            <div className="footer-contact-item">
              <MapPin size={16} />
              <span>Central Civic Center, Block 4, Metropolitan Zone, Main Boulevard</span>
            </div>
            <div className="footer-contact-item">
              <Clock size={16} />
              <span>Front Desk: Mon – Sat, 8:00 AM – 8:00 PM<br />Emergency Teams: 24/7 Operations</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={16} />
              <span>grievances@municipal-city.gov.pk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="footer-bottom-bar">
        <div className="container footer-bottom-content">
          <div className="footer-copy">
            &copy; 2026 City Municipal Corporation. All rights reserved. • Academic DBMS Project (University of Karachi, BSCS — Dr. S. M. Khalid Standards).
          </div>
          <div className="footer-status-indicator">
            <span className="footer-pulse-dot"></span>
            <span>Relational Services Operational • 99.8% SLA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
