'use client';

import React, { useState, useMemo } from 'react';
import { Department, Complaint, ComplaintStatus } from '../types';
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
  Sparkles,
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
    label: 'Water',
    tagline: 'Pipelines & sewage',
  },
  2: {
    icon: <Construction size={22} strokeWidth={2} />,
    label: 'Roads',
    tagline: 'Paving & potholes',
  },
  3: {
    icon: <Trash2 size={22} strokeWidth={2} />,
    label: 'Sanitation',
    tagline: 'Refuse & waste',
  },
  4: {
    icon: <Lightbulb size={22} strokeWidth={2} />,
    label: 'Lighting',
    tagline: 'Poles & wiring',
  },
  5: {
    icon: <ShieldAlert size={22} strokeWidth={2} />,
    label: 'Health',
    tagline: 'Sanitation & vector',
  },
  6: {
    icon: <Trees size={22} strokeWidth={2} />,
    label: 'Parks',
    tagline: 'Greenery & trees',
  },
};

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  departments,
  complaints,
  onSubmitComplaint,
  trackedComplaintId,
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>(
    trackedComplaintId ? 'track' : 'submit'
  );

  // Form State
  const [citizenName, setCitizenName] = useState('');
  const [phone, setPhone] = useState('+1-555-0201');
  const [address, setAddress] = useState('Flat 102, Building B, Municipal Zone 2');
  const [selectedDeptId, setSelectedDeptId] = useState<number>(departments[0]?.department_id || 1);
  const [category, setCategory] = useState('Dangerous Deep Pothole');
  const [location, setLocation] = useState('Main Boulevard near Central Metro Station');
  const [description, setDescription] = useState(
    'Deep crater formed after recent rains, causing traffic congestion and pedestrian hazard.'
  );
  const [validationError, setValidationError] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!citizenName.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setValidationError('Please enter a valid phone number (minimum 8 digits).');
      return;
    }
    if (!address.trim()) {
      setValidationError('Residential address is required.');
      return;
    }
    if (location.trim().length < 5) {
      setValidationError('Incident location must be at least 5 characters.');
      return;
    }
    if (description.trim().length < 10) {
      setValidationError('Please provide a brief description (minimum 10 characters).');
      return;
    }

    onSubmitComplaint({
      citizenName,
      phone,
      address,
      departmentId: selectedDeptId,
      category,
      description,
      location,
    });
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
          <Activity size={13} color="#233d2c" />
          <span>Active:</span>
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
                Select your service category, pinpoint the location, and receive an instant tracking ticket.
              </p>
            </div>
          </div>

          {validationError && (
            <div className="form-error-banner">
              <AlertCircle size={16} strokeWidth={2} />
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Step 1: Resident Info */}
            <div className="form-section-block">
              <div className="form-section-heading">
                <span className="form-section-title">
                  <User size={15} color="var(--primary-moss)" />
                  <span>1. Contact Details</span>
                </span>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <User size={13} />
                    <span>Full Name *</span>
                  </label>
                  <input
                    id="input-citizen-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Asad Khan"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Phone size={13} />
                    <span>Mobile Phone *</span>
                  </label>
                  <input
                    id="input-citizen-phone"
                    type="text"
                    className="form-input"
                    placeholder="0300-1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    <MapPin size={13} />
                    <span>Address *</span>
                  </label>
                  <input
                    id="input-citizen-address"
                    type="text"
                    className="form-input"
                    placeholder="House/Flat No., Street, Sector"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Department Selection (Leafora Squircle Category Buttons) */}
            <div className="form-section-block">
              <div className="form-section-heading">
                <span className="form-section-title">
                  <Building2 size={15} color="var(--primary-moss)" />
                  <span>2. Select Department</span>
                </span>
                <span className="form-section-subtitle">
                  {activeDept?.department_name} • {activeDept?.office_location}
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
                  <span className="form-sublabel">Common issues in {activeDept.department_name}:</span>
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

            {/* Step 3: Location & Problem Description */}
            <div className="form-section-block">
              <div className="form-section-heading">
                <span className="form-section-title">
                  <MapPin size={15} color="var(--primary-moss)" />
                  <span>3. Location &amp; Description</span>
                </span>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    <MapPin size={13} />
                    <span>Exact Landmark or Street *</span>
                  </label>
                  <input
                    id="input-incident-location"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Near Central Hospital Gate 2, Main Boulevard"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    <FileText size={13} />
                    <span>Problem Description *</span>
                  </label>
                  <textarea
                    id="input-incident-description"
                    className="form-textarea"
                    rows={3}
                    placeholder="Briefly describe the issue and safety impact..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <div className="form-submit-footer">
              <button
                type="submit"
                id="btn-submit-complaint"
                className="btn-pill-primary"
                style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}
              >
                <Send size={15} />
                <span>Submit Grievance</span>
              </button>
              <span className="form-privacy-note">
                <ShieldCheck size={14} color="#233d2c" />
                <span>Official Redressal Guarantee</span>
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
                <span className="hero-pill">Status Verification</span>
                <h2 className="civic-card-title">Live Grievance Tracker</h2>
                <p className="civic-card-desc">
                  Enter your ticket ID or phone number to check field inspection notes.
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
                  placeholder="Ticket ID (e.g. 1, CMP-0001) or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="tracking-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sample Ticket Chips */}
              <div className="quick-presets-row">
                <span className="preset-label">Sample Tickets:</span>
                {complaints.slice(0, 4).map((c) => (
                  <button
                    key={c.complaint_id}
                    type="button"
                    className="preset-ticket-btn"
                    onClick={() => setSearchQuery(c.complaint_id.toString())}
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
                    <span className="status-dot-pulse"></span>
                    {selectedComplaint.status}
                  </span>
                </div>

                <div className="ticket-dossier-meta">
                  <span className="meta-item">
                    <Calendar size={13} />
                    <span>{new Date(selectedComplaint.complaint_date).toLocaleDateString()}</span>
                  </span>
                </div>
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
                  <span className="detail-lbl">Department</span>
                  <strong className="detail-val">{selectedComplaint.department_name}</strong>
                </div>

                <div className="ticket-detail-item">
                  <span className="detail-lbl">Issue</span>
                  <strong className="detail-val">{selectedComplaint.category}</strong>
                </div>

                <div className="ticket-detail-item">
                  <span className="detail-lbl">Location</span>
                  <strong className="detail-val">{selectedComplaint.location}</strong>
                </div>

                <div className="ticket-detail-item">
                  <span className="detail-lbl">Resident</span>
                  <strong className="detail-val">{selectedComplaint.citizen_name || 'Citizen'}</strong>
                </div>

                <div className="ticket-detail-item full-width">
                  <span className="detail-lbl">Description</span>
                  <p className="detail-desc">{selectedComplaint.description}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="civic-card empty-search-card">
              <AlertCircle size={32} color="var(--text-muted)" />
              <h3>No Ticket Found</h3>
              <p>No complaint found matching &quot;{searchQuery}&quot;. Please check the number.</p>
            </div>
          )}

          {/* Registered Neighborhood Complaints */}
          <div className="civic-card">
            <div className="civic-card-header">
              <div>
                <span className="hero-pill">Public Ledger</span>
                <h3 className="civic-card-title">Recent Neighborhood Complaints</h3>
                <p className="civic-card-desc">
                  Transparent municipal registry of active grievances.
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
                    <option value="all">All Depts</option>
                    {departments.map((d) => (
                      <option key={d.department_id} value={d.department_name}>
                        {d.department_name}
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
                    <th>Department</th>
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
                      <td>{c.department_name}</td>
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
                    <span className="mobile-card-dept">{c.department_name}</span>

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
    </div>
  );
};
