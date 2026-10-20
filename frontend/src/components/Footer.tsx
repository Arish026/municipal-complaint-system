'use client';

import React from 'react';
import {
  Building2,
  ShieldCheck,
  PhoneCall,
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
      {/* Helpline CTA Strip */}
      <div className="footer-cta-banner">
        <div className="container footer-cta-content">
          <div className="footer-cta-text">
            <div className="footer-cta-icon">
              <PhoneCall size={20} />
            </div>
            <div>
              <h3>24/7 Rapid Response Helpline</h3>
              <p>For urgent pipeline bursts, road hazards, or electrical faults.</p>
            </div>
          </div>
          <div className="footer-cta-actions">
            <a href="tel:1122" className="btn-pill-primary">
              <PhoneCall size={15} />
              <span>Dial 1122</span>
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
              <Building2 size={20} strokeWidth={2.2} />
            </div>
            <div>
              <span className="footer-brand-title">Municipal Corporation</span>
              <span className="footer-brand-sub">Civic Redressal Gateway</span>
            </div>
          </div>
          <p className="footer-brand-desc">
            Direct municipal care and real-time grievance tracking for residents.
          </p>
          <div className="footer-cert-badge">
            <ShieldCheck size={14} color="var(--primary-moss)" />
            <span>3NF Relational Architecture Verified</span>
          </div>
        </div>

        {/* Column 2: Civic Services */}
        <div className="footer-col">
          <h4 className="footer-col-title">Services</h4>
          <ul className="footer-links-list">
            <li>
              <a href="#portal-nav-citizen">
                <Droplets size={13} />
                <span>Water Supply</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-citizen">
                <Construction size={13} />
                <span>Roads &amp; Curbs</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-citizen">
                <Trash2 size={13} />
                <span>Solid Waste</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-citizen">
                <Lightbulb size={13} />
                <span>Street Lighting</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-citizen">
                <ShieldAlert size={13} />
                <span>Public Health</span>
              </a>
            </li>
            <li>
              <a href="#portal-nav-citizen">
                <Trees size={13} />
                <span>Urban Parks</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact & Hours */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contact</h4>
          <div className="footer-contact-items">
            <div className="footer-contact-item">
              <MapPin size={14} />
              <span>Metropolitan Civic Center, Main Boulevard</span>
            </div>
            <div className="footer-contact-item">
              <Clock size={14} />
              <span>Mon – Sat: 8:00 AM – 8:00 PM</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={14} />
              <span>complaints@municipal-city.gov.pk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="footer-bottom-bar">
        <div className="container footer-bottom-content">
          <div className="footer-copy">
            &copy; 2026 City Municipal Corporation. DBMS Coursework (BSCS).
          </div>
          <div className="footer-status-indicator">
            <span className="footer-pulse-dot"></span>
            <span>Relational Services Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
