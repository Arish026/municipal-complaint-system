'use client';

import React, { useState, useMemo } from 'react';
import { Department, Complaint, ComplaintStatus } from '../types';
import { MapPicker } from './MapPicker';
import { ErrorModal } from './ErrorModal';
import {
  FileText,
  Search,
  Send,
  MapPin,
  Building2,
  Phone,
  User,
  AlertCircle,
  Clock,
  CheckCircle2,
  Check,
  Calendar,
  ShieldCheck,
  Droplets,
  Construction,
  Trash2,
  Lightbulb,
  ShieldAlert,
  Trees,
  Filter,
  Eye,
  Activity,
  Compass,
  Database,
} from 'lucide-react';

interface CitizenPortalProps {
  departments: Department[];
  complaints: Complaint[];
  onSubmitComplaint: (data: {
    citizenName: string;
    phone: string;
    address: string;
    departmentId: number;
    category: string;
    description: string;
    location: string;
  }) => void;
  trackedComplaintId?: number | null;
  onShowToast?: (type: 'success' | 'error' | 'info', message: string, sub?: string) => void;
}

const STATUS_STEPS: ComplaintStatus[] = [
  'Submitted',
  'Categorized',
  'Assigned',
  'In Progress',
  'Resolved',
];

interface DeptStyle {
  icon: React.ReactNode;
  label: string;
  tagline: string;
}

const DEPT_METADATA: Record<number, DeptStyle> = {
  1: {
    icon: <Droplets size={22} strokeWidth={2} />,
    label: 'Water & Sewerage',
    tagline: 'KWSC pipeline leaks & sewage overflows',
  },
  2: {
    icon: <Construction size={22} strokeWidth={2} />,
    label: 'Roads & Works',
    tagline: 'KMC potholes, paving & manhole covers',
  },
  3: {
    icon: <Trash2 size={22} strokeWidth={2} />,
    label: 'Solid Waste',
    tagline: 'SSWMB kachra kundi & debris removal',
  },
  4: {
    icon: <Lightbulb size={22} strokeWidth={2} />,
    label: 'Street Lighting',
    tagline: 'K-Electric utility poles & street blackout',
  },
  5: {
    icon: <ShieldAlert size={22} strokeWidth={2} />,
    label: 'Health & Vector',
    tagline: 'Sindh Health dengue/malaria spray',
  },
  6: {
    icon: <Trees size={22} strokeWidth={2} />,
    label: 'Parks & Trees',
    tagline: 'KMC fallen trees & public parks',
  },
};

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  departments,
  complaints,
  onSubmitComplaint,
  trackedComplaintId,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>(
    trackedComplaintId ? 'track' : 'submit'
  );

  // Form State: EMPTY by default so subtle, greyed out hints vanish on first stroke
  const [citizenName, setCitizenName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<number>(departments[0]?.department_id || 1);
  const [category, setCategory] = useState('Dangerous Deep Pothole');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // Field-level error states
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorList, setErrorList] = useState<string[]>([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  // Map Picker visibility toggle
  const [showMapPicker, setShowMapPicker] = useState(true);

  // Tracking Search State
  const [searchQuery, setSearchQuery] = useState(
    trackedComplaintId ? trackedComplaintId.toString() : '1'
  );
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const activeDept = useMemo(
    () => departments.find((d) => d.department_id === selectedDeptId) || departments[0] || null,
    [departments, selectedDeptId]
  );

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const list: string[] = [];

    if (!citizenName.trim()) {
      errors.name = 'Resident full name is required.';
      list.push('Full Name: Please enter your complete name.');
    } else if (citizenName.trim().length < 3) {
      errors.name = 'Full name must be at least 3 characters.';
      list.push('Full Name: Must be at least 3 characters.');
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    const pakPhoneRegex = /^((\+92)|(0092)|(0))?3[0-9]{9}$/;
    if (!cleanPhone) {
      errors.phone = 'Karachi contact mobile number is required.';
      list.push('Mobile Phone: Valid 11-digit mobile number required (03XX-XXXXXXX).');
    } else if (!pakPhoneRegex.test(cleanPhone) && cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid Pakistani mobile number (03XX-XXXXXXX).';
      list.push('Mobile Phone: Format should be 0300-1234567 or +923001234567.');
    }

    if (!address.trim()) {
      errors.address = 'Residential address in Karachi is required.';
      list.push('Residential Address: Required for municipal inspector verification.');
    }

    if (!location.trim() || location.trim().length < 6) {
      errors.location = 'Specify landmark or use Karachi Map Picker (min 6 characters).';
      list.push('Incident Location: Pinpoint location on map or enter landmark (e.g., Near Disco Bakery).');
    }

    if (!description.trim() || description.trim().length < 10) {
      errors.description = 'Provide a brief problem description (min 10 characters).';
      list.push('Problem Description: Must describe the hazard or severity (minimum 10 characters).');
    }

    setFieldErrors(errors);
    setErrorList(list);
    return list.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setIsErrorModalOpen(true);
      if (onShowToast) {
        onShowToast('error', 'Form Incomplete', 'Please correct the highlighted fields.');
      }
      return;
    }

    onSubmitComplaint({
      citizenName: citizenName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      departmentId: selectedDeptId,
      category,
      description: description.trim(),
      location: location.trim(),
    });

    if (onShowToast) {
      onShowToast('success', 'Grievance Registered', 'Assigned to Karachi municipal field crew.');
    }
  };

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const cleanId = q.replace(/^cmp-?/i, '').replace(/^#/i, '');
    const numId = parseInt(cleanId, 10);

    return complaints.filter((c) => {
      if (!isNaN(numId) && c.complaint_id === numId) return true;
      if (c.citizen_phone && c.citizen_phone.toLowerCase().includes(q)) return true;
      if (c.category.toLowerCase().includes(q)) return true;
      if (c.location.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [complaints, searchQuery]);

  const selectedComplaint = searchResults[0] || null;

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (filterDept !== 'all' && c.department_name !== filterDept) return false;
      if (filterStatus !== 'all' && c.status !== filterStatus) return false;
      return true;
    });
  }, [complaints, filterDept, filterStatus]);

  const getCurrentStepIndex = (status: ComplaintStatus) => {
    if (status === 'Closed' || status === 'Verified') return 4;
    const idx = STATUS_STEPS.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Sub-Navigation Toggle */}
      <div className="citizen-sub-nav">
        <div className="segmented-toggle">
          <button
            id="tab-btn-file-grievance"
            className={`segmented-toggle-btn ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveTab('submit')}
          >
            <FileText size={15} strokeWidth={2} />
            <span>Lodge Grievance</span>
          </button>
          <button
            id="tab-btn-track-inquiry"
            className={`segmented-toggle-btn ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <Search size={15} strokeWidth={2} />
            <span>Live Tracker</span>
          </button>
        </div>

        <div className="active-records-counter">
          <Activity size={13} color="var(--primary-moss)" />
          <span>Active Karachi Registry:</span>
          <strong>{complaints.length} Registered</strong>
        </div>
      </div>

      {/* VIEW 1: LODGE GRIEVANCE */}
      {activeTab === 'submit' && (
        <div id="citizen-form-section" className="civic-card">
          <div className="civic-card-header">
            <div>
              <span className="hero-pill">Citizen Assistance</span>
              <h2 className="civic-card-title">File a Grievance</h2>
              <p className="civic-card-desc">
                Select target agency, pinpoint Karachi location via map or GPS, and receive an instant tracking ticket.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Step 1: Resident Info */}
            <div className="form-section-block">
              <div className="form-section-heading">
                <span className="form-section-title">
                  <User size={15} color="var(--primary-moss)" />
                  <span>1. Contact Details</span>
                </span>
                <span className="form-section-subtitle">
                  Required for SMS notification &amp; inspector site visit
                </span>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="input-citizen-name">
                    <User size={13} />
                    <span>Full Name *</span>
                  </label>
                  <input
                    id="input-citizen-name"
                    type="text"
                    className={`form-input ${fieldErrors.name ? 'input-error' : ''}`}
                    placeholder="e.g. Syed Murtaza Zaidi"
                    value={citizenName}
                    onChange={(e) => {
                      setCitizenName(e.target.value);
                      if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
                    }}
                  />
                  {fieldErrors.name && (
                    <span className="field-error-msg">{fieldErrors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-citizen-phone">
                    <Phone size={13} />
                    <span>Mobile Phone (03XX-XXXXXXX) *</span>
                  </label>
                  <input
                    id="input-citizen-phone"
                    type="tel"
                    className={`form-input ${fieldErrors.phone ? 'input-error' : ''}`}
                    placeholder="0300-1234567"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                  />
                  {fieldErrors.phone && (
                    <span className="field-error-msg">{fieldErrors.phone}</span>
                  )}
                </div>

                <div className="form-group full-width">
                  <label className="form-label" htmlFor="input-citizen-address">
                    <MapPin size={13} />
                    <span>Residential Address *</span>
                  </label>
                  <input
                    id="input-citizen-address"
                    type="text"
                    className={`form-input ${fieldErrors.address ? 'input-error' : ''}`}
                    placeholder="e.g. Flat 402, Al-Ghafoor Heights, Block 13-D, Gulshan-e-Iqbal"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (fieldErrors.address) setFieldErrors((prev) => ({ ...prev, address: '' }));
                    }}
                  />
                  {fieldErrors.address && (
                    <span className="field-error-msg">{fieldErrors.address}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Department Selection (Leafora Squircle Category Buttons) */}
            <div className="form-section-block">
              <div className="form-section-heading">
                <span className="form-section-title">
                  <Building2 size={15} color="var(--primary-moss)" />
                  <span>2. Target Municipal Agency</span>
                </span>
                <span className="form-section-subtitle">
                  {activeDept?.department_name}
                </span>
              </div>

              {/* Squircles Category Row */}
              <div className="category-squircles-row">
                {departments.map((dept) => {
                  const meta = DEPT_METADATA[dept.department_id] || DEPT_METADATA[1];
                  const isSelected = dept.department_id === selectedDeptId;

                  return (
                    <button
                      key={dept.department_id}
                      type="button"
                      id={`dept-choice-${dept.department_id}`}
                      className={`squircle-cat-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedDeptId(dept.department_id);
                        const catList = dept.categories || dept.category_keywords || [];
                        if (catList.length > 0) {
                          setCategory(catList[0]);
                        }
                      }}
                    >
                      <div className="squircle-icon-box">
                        {meta.icon}
                      </div>
                      <span className="squircle-cat-label">{meta.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Category Quick Selector Pills */}
              {activeDept && (activeDept.categories || activeDept.category_keywords) && (
                <div className="category-pills-wrap">
                  <span className="form-sublabel">Common issues under {activeDept.department_name}:</span>
                  <div className="category-pills-row">
                    {(activeDept.categories || activeDept.category_keywords || []).map((catName: string) => (
                      <button
                        key={catName}
                        type="button"
                        className={`category-pill-btn ${category === catName ? 'active' : ''}`}
                        onClick={() => setCategory(catName)}
                      >
                        <CheckCircle2 size={12} />
                        <span>{catName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Location & GPS Map Picker */}
            <div className="form-section-block">
              <div className="form-section-heading">
                <span className="form-section-title">
                  <MapPin size={15} color="var(--primary-moss)" />
                  <span>3. Location &amp; Problem Description</span>
                </span>
                <button
                  type="button"
                  className="btn-text-action"
                  onClick={() => setShowMapPicker(!showMapPicker)}
                >
                  <Compass size={13} />
                  <span>{showMapPicker ? 'Hide Karachi Map' : 'Show Karachi GPS Map'}</span>
                </button>
              </div>

              {/* Integrated GPS & Map Picker */}
              {showMapPicker && (
                <MapPicker
                  currentLocation={location}
                  onLocationSelect={(text) => {
                    setLocation(text);
                    if (fieldErrors.location) setFieldErrors((prev) => ({ ...prev, location: '' }));
                  }}
                  onGpsSuccess={(msg) => onShowToast?.('success', 'GPS Location Locked', msg)}
                  onGpsError={(err) => onShowToast?.('info', 'GPS Fallback', err)}
                />
              )}

              <div className="form-grid" style={{ marginTop: '0.75rem' }}>
                <div className="form-group full-width">
                  <label className="form-label" htmlFor="input-incident-location">
                    <MapPin size={13} />
                    <span>Exact Landmark or Street *</span>
                  </label>
                  <input
                    id="input-incident-location"
                    type="text"
                    className={`form-input ${fieldErrors.location ? 'input-error' : ''}`}
                    placeholder="e.g. Main University Road near Disco Bakery, Block 13-D Gulshan"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (fieldErrors.location) setFieldErrors((prev) => ({ ...prev, location: '' }));
                    }}
                  />
                  {fieldErrors.location && (
                    <span className="field-error-msg">{fieldErrors.location}</span>
                  )}
                </div>

                <div className="form-group full-width">
                  <label className="form-label" htmlFor="input-incident-description">
                    <FileText size={13} />
                    <span>Problem Narrative *</span>
                  </label>
                  <textarea
                    id="input-incident-description"
                    className={`form-textarea ${fieldErrors.description ? 'input-error' : ''}`}
                    rows={3}
                    placeholder="Describe the leak severity, pothole crater depth, or hazard..."
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (fieldErrors.description) setFieldErrors((prev) => ({ ...prev, description: '' }));
                    }}
                  />
                  {fieldErrors.description && (
                    <span className="field-error-msg">{fieldErrors.description}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <div className="form-submit-footer">
              <button
                type="submit"
                id="btn-submit-complaint"
                className="btn-pill-primary"
                style={{ padding: '0.85rem 2.2rem', fontSize: '0.95rem' }}
              >
                <Send size={15} />
                <span>Submit Grievance to Municipal Crew</span>
              </button>
              <span className="form-privacy-note">
                <ShieldCheck size={14} color="var(--primary-moss)" />
                <span>Verified 3NF Relational Municipal Dispatch</span>
              </span>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 2: LIVE TICKET TRACKER */}
      {activeTab === 'track' && (
        <div id="citizen-tracking-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Search Header Bar */}
          <div className="civic-card">
            <div className="civic-card-header">
              <div>
                <span className="hero-pill">Real-Time Verification</span>
                <h2 className="civic-card-title">Live Grievance Tracker</h2>
                <p className="civic-card-desc">
                  Enter your ticket ID or phone number to check field inspection notes across Karachi.
                </p>
              </div>
            </div>

            <div className="tracking-search-bar-wrap">
              <div className="tracking-input-box">
                <Search size={18} className="tracking-search-icon" />
                <input
                  id="input-track-ticket-search"
                  type="text"
                  className="tracking-search-input"
                  placeholder="e.g. 1, CMP-0001, or 0300-2415981..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="tracking-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search query"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sample Ticket Chips */}
              <div className="quick-presets-row">
                <span className="preset-label">Sample Karachi Tickets:</span>
                {complaints.slice(0, 4).map((c) => (
                  <button
                    key={c.complaint_id}
                    type="button"
                    className="preset-ticket-btn"
                    onClick={() => {
                      setSearchQuery(c.complaint_id.toString());
                      onShowToast?.('info', 'Loaded Sample Ticket', `CMP-${c.complaint_id.toString().padStart(4, '0')}`);
                    }}
                  >
                    <CheckCircle2 size={11} />
                    <span>CMP-000{c.complaint_id} ({c.category.split(' ')[0]})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Ticket Status Card */}
          {selectedComplaint ? (
            <div className="civic-card active-ticket-dossier">
              <div className="ticket-dossier-top">
                <div className="ticket-dossier-ref">
                  <span className="ticket-code-pill">
                    CMP-{selectedComplaint.complaint_id.toString().padStart(4, '0')}
                  </span>
                  <span className={`status-pill status-${selectedComplaint.status.toLowerCase().replace(/\s+/g, '')}`}>
                    <span className="status-dot-pulse" />
                    {selectedComplaint.status}
                  </span>
                </div>

                <div className="ticket-dossier-meta">
                  <span className="meta-item">
                    <Calendar size={13} />
                    <span>Lodged: {new Date(selectedComplaint.complaint_date).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>

              {/* 3NF Relational Query Plan Breadcrumb */}
              <div style={{ padding: '0.45rem 0.85rem', background: '#090d18', border: '1px solid #1e293b', borderRadius: 'var(--radius-sm)', margin: '0.5rem 0 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                  <Database size={12} />
                  <span>3NF Relational Plan:</span>
                </span>
                <code style={{ fontSize: '0.72rem', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                  COMPLAINT(id: {selectedComplaint.complaint_id}) ⨝ DEPARTMENT(id: {selectedComplaint.department_id}) ⨝ WORK_ORDER ⨝ STAFF
                </code>
              </div>

              {/* Lifecycle Milestones */}
              <div className="lifecycle-timeline-wrap">
                <div className="timeline-steps-track">
                  {STATUS_STEPS.map((step, idx) => {
                    const currentIdx = getCurrentStepIndex(selectedComplaint.status);
                    const isDone = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={step}
                        className={`timeline-step-node ${isDone ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                      >
                        <div className="timeline-node-circle">
                          {isDone ? <Check size={12} strokeWidth={3} /> : idx + 1}
                        </div>
                        <span className="timeline-step-label">{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ticket Details Grid */}
              <div className="ticket-details-grid">
                <div className="ticket-detail-item">
                  <span className="detail-lbl">Responsible Agency</span>
                  <strong className="detail-val">{selectedComplaint.department_name}</strong>
                </div>

                <div className="ticket-detail-item">
                  <span className="detail-lbl">Issue Category</span>
                  <strong className="detail-val">{selectedComplaint.category}</strong>
                </div>

                <div className="ticket-detail-item">
                  <span className="detail-lbl">Karachi Location</span>
                  <strong className="detail-val">{selectedComplaint.location}</strong>
                </div>

                <div className="ticket-detail-item">
                  <span className="detail-lbl">Resident Contact</span>
                  <strong className="detail-val">{selectedComplaint.citizen_name || 'Citizen'} ({selectedComplaint.citizen_phone || 'Verified'})</strong>
                </div>

                <div className="ticket-detail-item full-width">
                  <span className="detail-lbl">Citizen Narrative</span>
                  <p className="detail-desc">{selectedComplaint.description}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="civic-card empty-search-card">
              <AlertCircle size={32} color="var(--text-muted)" />
              <h3>No Complaint Record Found</h3>
              <p>No complaint matching &quot;{searchQuery}&quot; was found. Check the ticket ID or mobile number.</p>
            </div>
          )}

          {/* Registered Neighborhood Complaints */}
          <div className="civic-card">
            <div className="civic-card-header">
              <div>
                <span className="hero-pill">Public City Ledger</span>
                <h3 className="civic-card-title">Recent Karachi Complaints</h3>
                <p className="civic-card-desc">
                  Transparent municipal registry of active grievances across Karachi districts.
                </p>
              </div>

              {/* Filters */}
              <div className="table-filter-bar">
                <div className="filter-select-box">
                  <Filter size={13} />
                  <select
                    className="form-select sm"
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                  >
                    <option value="all">All Karachi Agencies</option>
                    {departments.map((d) => (
                      <option key={d.department_id} value={d.department_name}>
                        {d.department_name.split('—')[0]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-select-box">
                  <select
                    className="form-select sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Categorized">Categorized</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table on Desktop / Card List on Mobile */}
            <div className="responsive-table-wrap">
              <table className="civic-table hide-on-mobile">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Agency</th>
                    <th>Issue</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((c) => (
                    <tr key={c.complaint_id}>
                      <td>
                        <strong>CMP-{c.complaint_id.toString().padStart(4, '0')}</strong>
                      </td>
                      <td>{(c.department_name || 'Agency').split('—')[0]}</td>
                      <td>{c.category}</td>
                      <td>{c.location}</td>
                      <td>
                        <span className={`status-pill status-${c.status.toLowerCase().replace(/\s+/g, '')}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>{new Date(c.complaint_date).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn-pill-secondary btn-sm"
                          onClick={() => {
                            setSearchQuery(c.complaint_id.toString());
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                            onShowToast?.('info', 'Loaded Ticket', `CMP-${c.complaint_id.toString().padStart(4, '0')}`);
                          }}
                        >
                          <Eye size={12} />
                          <span>Track</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Card List (< 768px) */}
              <div className="mobile-complaints-card-list hide-on-desktop">
                {filteredComplaints.map((c) => (
                  <div key={c.complaint_id} className="mobile-ticket-card">
                    <div className="mobile-card-top">
                      <span className="ticket-code-pill">CMP-{c.complaint_id.toString().padStart(4, '0')}</span>
                      <span className={`status-pill status-${c.status.toLowerCase().replace(/\s+/g, '')}`}>
                        {c.status}
                      </span>
                    </div>

                    <h4 className="mobile-card-title">{c.category}</h4>
                    <span className="mobile-card-dept">{(c.department_name || 'Agency').split('—')[0]}</span>

                    <div className="mobile-card-meta">
                      <span className="meta-item">
                        <MapPin size={12} />
                        <span>{c.location}</span>
                      </span>
                      <span className="meta-item">
                        <Calendar size={12} />
                        <span>{new Date(c.complaint_date).toLocaleDateString()}</span>
                      </span>
                    </div>

                    <button
                      className="btn-pill-secondary btn-sm"
                      style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
                      onClick={() => {
                        setSearchQuery(c.complaint_id.toString());
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                        onShowToast?.('info', 'Loaded Ticket', `CMP-${c.complaint_id.toString().padStart(4, '0')}`);
                      }}
                    >
                      <Eye size={13} />
                      <span>Track Status</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Structured Validation Error Modal */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        errors={errorList}
        onClose={() => setIsErrorModalOpen(false)}
      />
    </div>
  );
};
