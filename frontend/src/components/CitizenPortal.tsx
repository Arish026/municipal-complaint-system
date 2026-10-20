'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
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
  ExternalLink,
  ChevronRight,
  ArrowRight,
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
  image?: string;
  color: string;
  bg: string;
  border: string;
  tagline: string;
}

const DEPT_METADATA: Record<number, DeptStyle> = {
  1: {
    icon: <Droplets size={22} strokeWidth={2} />,
    image: '/images/water-service.jpg',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    tagline: 'Pipelines, leaks & sewage',
  },
  2: {
    icon: <Construction size={22} strokeWidth={2} />,
    image: '/images/road-service.jpg',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    tagline: 'Potholes, paving & curbs',
  },
  3: {
    icon: <Trash2 size={22} strokeWidth={2} />,
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    tagline: 'Dumpsters & refuse cleanup',
  },
  4: {
    icon: <Lightbulb size={22} strokeWidth={2} />,
    color: '#ca8a04',
    bg: '#fefce8',
    border: '#fef08a',
    tagline: 'Street lighting & cables',
  },
  5: {
    icon: <ShieldAlert size={22} strokeWidth={2} />,
    color: '#e11d48',
    bg: '#fff1f2',
    border: '#fecdd3',
    tagline: 'Vector control & sanitation',
  },
  6: {
    icon: <Trees size={22} strokeWidth={2} />,
    image: '/images/park-service.jpg',
    color: '#0d9488',
    bg: '#f0fdfa',
    border: '#99f6e4',
    tagline: 'Parks, landscaping & trees',
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
      setValidationError('Residential address is required for municipal verification.');
      return;
    }
    if (location.trim().length < 5) {
      setValidationError('Incident location must be at least 5 characters (Street, Ward, Landmark).');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Sub-Navigation Toggle (Mobile-friendly full-width tabs) */}
      <div className="citizen-sub-nav">
        <div className="segmented-toggle citizen-segmented-toggle">
          <button
            id="tab-btn-file-grievance"
            className={`segmented-toggle-btn ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveTab('submit')}
          >
            <FileText size={16} strokeWidth={2} />
            <span>Lodge a Grievance</span>
          </button>
          <button
            id="tab-btn-track-inquiry"
            className={`segmented-toggle-btn ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <Search size={16} strokeWidth={2} />
            <span>Live Ticket Tracker</span>
          </button>
        </div>

        <div className="active-records-counter">
          <Activity size={14} color="#059669" />
          <span>Active In-System:</span>
          <strong>{complaints.length} Tickets Registered</strong>
        </div>
      </div>

      {/* VIEW 1: LODGE GRIEVANCE */}
      {activeTab === 'submit' && (
        <div id="citizen-form-section" className="civic-card">
          <div className="civic-card-header">
            <div>
              <span className="hero-pill">
                <Sparkles size={13} color="var(--primary-blue)" />
                Citizen Assistance &amp; Lodging
              </span>
              <h2 className="civic-card-title">
                Lodge a Municipal Complaint
              </h2>
              <p className="civic-card-desc">
                Select the responsible department, provide incident location details, and submit. An official tracking ticket reference will be generated immediately.
              </p>
            </div>
          </div>

          {validationError && (
            <div className="form-error-banner">
              <AlertCircle size={18} strokeWidth={2} />
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Step 1: Citizen Contact */}
            <div className="form-section-block">
              <div className="form-section-heading">
                <span className="form-section-title">
                  <User size={16} color="var(--primary-blue)" />
                  <span>1. Resident Contact Information</span>
                </span>
                <span className="form-section-subtitle">
                  Required for SMS notification and inspector verification
                </span>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <User size={14} />
                    <span>Full Legal Name *</span>
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
                    <Phone size={14} />
                    <span>Contact Mobile Number *</span>
                  </label>
                  <input
                    id="input-citizen-phone"
                    type="text"
                    className="form-input"
                    placeholder="0300-1234567 or +1-555-0201"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    <MapPin size={14} />
                    <span>Residential Street Address *</span>
                  </label>
                  <input
                    id="input-citizen-address"
                    type="text"
                    className="form-input"
                    placeholder="House / Flat No., Street, Sector, Ward"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Department Selection with Visual Imagery */}
            <div className="form-section-block">
              <div className="form-section-heading">
                <span className="form-section-title">
                  <Building2 size={16} color="#059669" />
                  <span>2. Select Target Municipal Agency</span>
                </span>
                <span className="form-section-subtitle">
                  Directly routes complaint to specialized maintenance crew
                </span>
              </div>

              {/* Department Cards Grid with Real Imagery */}
              <div className="category-cards-grid">
                {departments.map((dept) => {
                  const meta = DEPT_METADATA[dept.department_id] || DEPT_METADATA[1];
                  const isSelected = dept.department_id === selectedDeptId;

                  return (
                    <button
                      key={dept.department_id}
                      type="button"
                      id={`dept-choice-${dept.department_id}`}
                      className={`dept-visual-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedDeptId(dept.department_id);
                        const catList = dept.categories || dept.category_keywords || [];
                        if (catList.length > 0) {
                          setCategory(catList[0]);
                        }
                      }}
                      style={{
                        borderColor: isSelected ? meta.color : 'var(--border-subtle)',
                        boxShadow: isSelected ? `0 0 0 2px ${meta.color}25` : undefined,
                      }}
                    >
                      {/* Image Thumbnail for departments with photos */}
                      {meta.image && (
                        <div className="dept-card-image-box">
                          <Image
                            src={meta.image}
                            alt={dept.department_name}
                            fill
                            className="dept-card-img"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          <div className="dept-card-image-overlay"></div>
                        </div>
                      )}

                      <div className="dept-card-body">
                        <div className="dept-card-top-row">
                          <div
                            className="dept-card-icon"
                            style={{
                              background: meta.bg,
                              color: meta.color,
                              borderColor: meta.border,
                            }}
                          >
                            {meta.icon}
                          </div>
                          {isSelected && (
                            <span className="dept-selected-badge" style={{ background: meta.color }}>
                              <Check size={12} strokeWidth={3} />
                              <span>Selected</span>
                            </span>
                          )}
                        </div>

                        <strong className="dept-card-name">{dept.department_name}</strong>
                        <span className="dept-card-tagline">{meta.tagline}</span>
                        <span className="dept-card-depot">
                          <MapPin size={11} />
                          <span>{dept.office_location}</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Category Quick Selector Pills */}
              {activeDept && (activeDept.categories || activeDept.category_keywords) && (
                <div className="category-pills-wrap">
                  <label className="form-label" style={{ marginBottom: '0.4rem' }}>
                    <span>Common Issue Types under {activeDept.department_name}:</span>
                  </label>
                  <div className="category-pills-row">
                    {(activeDept.categories || activeDept.category_keywords || []).map((catName: string) => (
                      <button
                        key={catName}
                        type="button"
                        className={`category-pill-btn ${category === catName ? 'active' : ''}`}
                        onClick={() => setCategory(catName)}
                      >
                        <CheckCircle2 size={13} />
                        <span>{catName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Incident Details */}
            <div className="form-section-block">
              <div className="form-section-heading">
                <span className="form-section-title">
                  <MapPin size={16} color="#d97706" />
                  <span>3. Location &amp; Problem Description</span>
                </span>
                <span className="form-section-subtitle">
                  Give clear physical landmarks for rapid dispatch
                </span>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    <MapPin size={14} />
                    <span>Exact Incident Location or Landmark *</span>
                  </label>
                  <input
                    id="input-incident-location"
                    type="text"
                    className="form-input"
                    placeholder="e.g. In front of Central Hospital Gate 2, Main Boulevard"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    <FileText size={14} />
                    <span>Detailed Grievance Narrative * (min 10 characters)</span>
                  </label>
                  <textarea
                    id="input-incident-description"
                    className="form-textarea"
                    rows={4}
                    placeholder="Describe the severity, duration, and immediate safety impact on residents..."
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
                className="btn-primary"
                style={{ minWidth: '220px', padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
              >
                <Send size={16} />
                <span>Submit Grievance to Municipal Crew</span>
              </button>
              <span className="form-privacy-note">
                <ShieldCheck size={14} color="#059669" />
                <span>Protected under Municipal Right to Redressal Charter</span>
              </span>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 2: LIVE TICKET TRACKER */}
      {activeTab === 'track' && (
        <div id="citizen-tracking-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Search Header Bar */}
          <div className="civic-card">
            <div className="civic-card-header">
              <div>
                <span className="hero-pill">
                  <Search size={13} color="var(--primary-blue)" />
                  Real-Time Municipal Tracking
                </span>
                <h2 className="civic-card-title">Live Grievance Tracker</h2>
                <p className="civic-card-desc">
                  Enter your tracking ticket number (e.g. <code>CMP-0001</code> or <code>1</code>) or registered phone number to view live inspection logs.
                </p>
              </div>
            </div>

            <div className="tracking-search-bar-wrap">
              <div className="tracking-input-box">
                <Search size={20} className="tracking-search-icon" />
                <input
                  id="input-track-ticket-search"
                  type="text"
                  className="tracking-search-input"
                  placeholder="Search by ticket ID (e.g., CMP-0001) or phone number..."
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

              {/* Quick Preset Buttons */}
              <div className="quick-presets-row">
                <span className="preset-label">Quick Sample Tickets:</span>
                {complaints.slice(0, 4).map((c) => (
                  <button
                    key={c.complaint_id}
                    type="button"
                    className="preset-ticket-btn"
                    onClick={() => setSearchQuery(c.complaint_id.toString())}
                  >
                    <CheckCircle2 size={12} />
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
                    <Calendar size={14} />
                    <span>Lodged: {new Date(selectedComplaint.complaint_date).toLocaleDateString()}</span>
                  </span>
                  <span className="meta-item">
                    <Clock size={14} />
                    <span>Time: {new Date(selectedComplaint.complaint_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                </div>
              </div>

              {/* Responsive Lifecycle Timeline */}
              <div className="lifecycle-timeline-wrap">
                <h4 className="timeline-title">
                  <Activity size={16} color="var(--primary-blue)" />
                  <span>Official Resolution Milestones</span>
                </h4>

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
                          {isDone ? <Check size={14} strokeWidth={3} /> : idx + 1}
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
                  <span className="detail-lbl">Responsible Department</span>
                  <strong className="detail-val" style={{ color: 'var(--primary-blue)' }}>
                    {selectedComplaint.department_name}
                  </strong>
                </div>

                <div className="ticket-detail-item">
                  <span className="detail-lbl">Issue Category</span>
                  <strong className="detail-val">{selectedComplaint.category}</strong>
                </div>

                <div className="ticket-detail-item">
                  <span className="detail-lbl">Incident Location</span>
                  <strong className="detail-val">{selectedComplaint.location}</strong>
                </div>

                <div className="ticket-detail-item">
                  <span className="detail-lbl">Submitter Name</span>
                  <strong className="detail-val">{selectedComplaint.citizen_name || 'Verified Citizen'}</strong>
                </div>

                <div className="ticket-detail-item full-width">
                  <span className="detail-lbl">Citizen Narrative</span>
                  <p className="detail-desc">{selectedComplaint.description}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="civic-card empty-search-card">
              <AlertCircle size={36} color="var(--text-muted)" />
              <h3>No Ticket Found</h3>
              <p>We could not find any active complaint matching &quot;{searchQuery}&quot;. Please verify the ticket code or phone number.</p>
            </div>
          )}

          {/* All Registered Neighborhood Complaints Table */}
          <div className="civic-card">
            <div className="civic-card-header">
              <div>
                <span className="hero-pill">Community Registry</span>
                <h3 className="civic-card-title">Recent Neighborhood Complaints</h3>
                <p className="civic-card-desc">
                  Transparent public ledger of all registered grievances across municipal divisions.
                </p>
              </div>

              {/* Filters */}
              <div className="table-filter-bar">
                <div className="filter-select-box">
                  <Filter size={14} />
                  <select
                    className="form-select sm"
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                  >
                    <option value="all">All Departments</option>
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

            {/* Responsive Card List on Mobile / Table on Desktop */}
            <div className="responsive-table-wrap">
              <table className="civic-table hide-on-mobile">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Department</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Lodged</th>
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
                          className="btn-secondary btn-sm"
                          onClick={() => {
                            setSearchQuery(c.complaint_id.toString());
                            window.scrollTo({ top: 350, behavior: 'smooth' });
                          }}
                        >
                          <Eye size={13} />
                          <span>Inspect</span>
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
                        <MapPin size={13} />
                        <span>{c.location}</span>
                      </span>
                      <span className="meta-item">
                        <Calendar size={13} />
                        <span>{new Date(c.complaint_date).toLocaleDateString()}</span>
                      </span>
                    </div>

                    <button
                      className="btn-secondary btn-sm"
                      style={{ width: '100%', marginTop: '0.65rem', justifyContent: 'center' }}
                      onClick={() => {
                        setSearchQuery(c.complaint_id.toString());
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                    >
                      <Eye size={14} />
                      <span>Track Inspection Progress</span>
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
