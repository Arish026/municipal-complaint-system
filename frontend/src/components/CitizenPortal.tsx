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

const URDU_STEPS = ['موصول', 'جانچ', 'تفویض', 'کارروائی', 'حل شدہ'];

interface DeptStyle {
  icon: React.ReactNode;
  urdu: string;
  color: string;
  bg: string;
  border: string;
}

const DEPT_METADATA: Record<number, DeptStyle> = {
  1: {
    icon: <Droplets size={20} strokeWidth={2} />,
    urdu: 'پانی اور نکاسی آب',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
  },
  2: {
    icon: <Construction size={20} strokeWidth={2} />,
    urdu: 'سڑکیں اور مرمت',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
  },
  3: {
    icon: <Trash2 size={20} strokeWidth={2} />,
    urdu: 'صفائی اور کچرا',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
  },
  4: {
    icon: <Lightbulb size={20} strokeWidth={2} />,
    urdu: 'اسٹریٹ لائٹس',
    color: '#ca8a04',
    bg: '#fefce8',
    border: '#fef08a',
  },
  5: {
    icon: <ShieldAlert size={20} strokeWidth={2} />,
    urdu: 'صحتِ عامہ و اسپرے',
    color: '#e11d48',
    bg: '#fff1f2',
    border: '#fecdd3',
  },
  6: {
    icon: <Trees size={20} strokeWidth={2} />,
    urdu: 'پارکس اور درخت',
    color: '#0d9488',
    bg: '#f0fdfa',
    border: '#99f6e4',
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
  const [location, setLocation] = useState('Main Boulevard near Central Metro');
  const [description, setDescription] = useState(
    'Deep crater formed after recent rains, causing traffic congestion and pedestrian hazard.'
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Tracking Search State
  const [searchQuery, setSearchQuery] = useState(
    trackedComplaintId ? trackedComplaintId.toString() : '1'
  );

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
      setValidationError('Please enter a valid phone number.');
      return;
    }
    if (!address.trim()) {
      setValidationError('Residential address is required.');
      return;
    }
    if (location.trim().length < 5) {
      setValidationError('Location must be at least 5 characters (Street, Ward, Landmark).');
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

  const getCurrentStepIndex = (status: ComplaintStatus) => {
    if (status === 'Closed' || status === 'Verified') return 4;
    const idx = STATUS_STEPS.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Sub-Navigation Toggle */}
      <div className="sub-nav-bar">
        <div className="segmented-toggle">
          <button
            id="tab-btn-file-grievance"
            className={`segmented-toggle-btn ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveTab('submit')}
          >
            <FileText size={15} strokeWidth={2} />
            <span>Lodge Complaint</span>
            <span className="urdu-text" style={{ fontSize: '0.8rem', opacity: 0.9 }}>شکایت درج کریں</span>
          </button>
          <button
            id="tab-btn-track-inquiry"
            className={`segmented-toggle-btn ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <Search size={15} strokeWidth={2} />
            <span>Track Status</span>
            <span className="urdu-text" style={{ fontSize: '0.8rem', opacity: 0.9 }}>شکایت کی تفصیلات</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span>Active Records:</span>
          <strong style={{ color: 'var(--text-main)' }}>{complaints.length} complaints</strong>
        </div>
      </div>

      {/* VIEW 1: FILE GRIEVANCE */}
      {activeTab === 'submit' && (
        <div className="civic-card">
          <div className="civic-card-header">
            <div>
              <span className="hero-pill">
                Citizen Assistance • شہری رہنمائی
              </span>
              <h2 className="civic-card-title">
                Lodge a Municipal Complaint
                <span className="urdu-text" style={{ fontSize: '1.15rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
                  شکایت کا اندراج
                </span>
              </h2>
              <p className="civic-card-desc">
                Select the relevant department and describe your issue. We dispatch work orders to field inspectors promptly.
              </p>
            </div>
          </div>

          {validationError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.75rem 1rem',
                background: '#fff1f2',
                border: '1px solid #fecdd3',
                borderRadius: 'var(--radius-sm)',
                color: '#be123c',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                fontWeight: 600,
              }}
            >
              <AlertCircle size={18} strokeWidth={2} />
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Step 1: Citizen Contact */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <User size={16} color="var(--primary-blue)" />
                  <span>1. Contact Details</span>
                </span>
                <span className="urdu-text" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  شہری کی بنیادی معلومات
                </span>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
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
                    <span>Contact Phone Number *</span>
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
                    <span>Residential Address *</span>
                  </label>
                  <input
                    id="input-citizen-address"
                    type="text"
                    className="form-input"
                    placeholder="House / Flat No., Street, Sector or Ward"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Department Selection with Cohesive Highlights */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Building2 size={16} color="#059669" />
                  <span>2. Select Department &amp; Issue Category</span>
                </span>
                <span className="urdu-text" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  متعلقہ شعبہ منتخب کریں
                </span>
              </div>

              {/* Department Tiles Grid */}
              <div className="category-tiles-grid">
                {departments.map((dept) => {
                  const meta = DEPT_METADATA[dept.department_id] || DEPT_METADATA[1];
                  const isSelected = dept.department_id === selectedDeptId;

                  return (
                    <button
                      type="button"
                      key={dept.department_id}
                      className={`category-tile ${isSelected ? 'active' : ''}`}
                      style={{
                        ['--active-bg' as any]: meta.bg,
                        ['--active-border' as any]: meta.color,
                      }}
                      onClick={() => {
                        setSelectedDeptId(dept.department_id);
                        if (dept.category_keywords && dept.category_keywords.length > 0) {
                          setCategory(dept.category_keywords[0]);
                        }
                      }}
                    >
                      <div
                        className="tile-icon-box"
                        style={{
                          background: meta.bg,
                          color: meta.color,
                        }}
                      >
                        {meta.icon}
                      </div>
                      <div className="tile-title">{dept.department_name}</div>
                      <div className="tile-urdu">{meta.urdu}</div>
                      {isSelected && (
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: meta.color, fontWeight: 700 }}>
                          <Check size={13} strokeWidth={2.5} />
                          <span>Selected</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Suggested Common Issues */}
              <div style={{ marginTop: '1rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Common issues for {activeDept?.department_name}:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.4rem' }}>
                  {activeDept?.category_keywords?.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      className="btn-secondary btn-sm"
                      style={{
                        background: category === tag ? 'var(--primary-tint)' : 'var(--bg-surface)',
                        borderColor: category === tag ? 'var(--primary-blue)' : 'var(--border-subtle)',
                        color: category === tag ? 'var(--primary-blue)' : 'var(--text-body)',
                      }}
                      onClick={() => setCategory(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Location & Brief Narrative */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <MapPin size={16} color="#d97706" />
                  <span>3. Location &amp; Problem Details</span>
                </span>
                <span className="urdu-text" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  مقام اور تفصیل
                </span>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    <span>Street Location / Landmark *</span>
                  </label>
                  <input
                    id="input-complaint-location"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Corner of Street 4, Near Commercial Market"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <div className="form-label">
                    <span>Brief Description *</span>
                    <span className={`char-counter ${description.length >= 10 ? 'valid' : ''}`}>
                      {description.length} / 10 min chars
                    </span>
                  </div>
                  <textarea
                    id="input-complaint-description"
                    className="form-textarea"
                    placeholder="Briefly describe what happened or what requires fixing..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setCitizenName('');
                  setDescription('');
                }}
              >
                Clear
              </button>
              <button id="btn-submit-complaint" type="submit" className="btn-primary">
                <Send size={15} strokeWidth={2} />
                <span>Submit Grievance</span>
                <span className="urdu-text" style={{ fontSize: '0.82rem', marginLeft: '0.25rem' }}>درج کریں</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 2: TRACK & INQUIRY */}
      {activeTab === 'track' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Search Box */}
          <div className="civic-card">
            <div className="civic-card-header">
              <div>
                <span className="hero-pill">Real-time Tracking</span>
                <h2 className="civic-card-title">
                  Track Your Complaint Status
                  <span className="urdu-text" style={{ fontSize: '1.15rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
                    شکایت کی پیش رفت
                  </span>
                </h2>
                <p className="civic-card-desc">
                  Enter your Complaint # (e.g. 1, 2, 5) or registered phone number to view live progress.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '260px', position: 'relative' }}>
                <input
                  id="input-track-search"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Enter Complaint # (e.g. 1) or Phone (+1-555-0201)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search
                  size={16}
                  strokeWidth={2}
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
                />
              </div>
            </div>

            {/* Quick Demo Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Try examples:
              </span>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setSearchQuery('1')}
              >
                #1 (Submitted)
              </button>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setSearchQuery('2')}
              >
                #2 (Assigned)
              </button>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setSearchQuery('5')}
              >
                #5 (In Progress)
              </button>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setSearchQuery('6')}
              >
                #6 (Verified)
              </button>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setSearchQuery('+1-555-0201')}
              >
                Phone +1-555-0201
              </button>
            </div>
          </div>

          {/* Result Card */}
          {selectedComplaint ? (
            <div className="civic-card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.2rem' }}>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        color: 'var(--primary-blue)',
                      }}
                    >
                      #CMP-{selectedComplaint.complaint_id.toString().padStart(4, '0')}
                    </span>
                    <span className="badge badge-inprogress">
                      {selectedComplaint.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700 }}>
                    {selectedComplaint.category}
                  </h3>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
                    <Calendar size={14} />
                    <span>Logged: {new Date(selectedComplaint.complaint_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Segmented Progress Tracker with Urdu */}
              <div className="segmented-progress-wrap">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Resolution Milestones
                  </span>
                  <span className="urdu-text" style={{ fontSize: '0.85rem', color: 'var(--primary-blue)' }}>
                    شکایت کے مراحل
                  </span>
                </div>

                <div className="segmented-progress-bar">
                  {STATUS_STEPS.map((step, idx) => {
                    const currentIdx = getCurrentStepIndex(selectedComplaint.status);
                    const isFilled = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={step}
                        className={`segmented-cell ${isFilled ? 'filled' : ''} ${isCurrent ? 'current' : ''}`}
                      >
                        {isFilled && <Check size={12} strokeWidth={2.5} style={{ marginRight: '3px' }} />}
                        <span>{step}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="segmented-labels">
                  {URDU_STEPS.map((u, i) => (
                    <span key={i} className="urdu-text" style={{ fontSize: '0.82rem' }}>
                      {u}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metadata Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '0.85rem',
                  marginTop: '1.25rem',
                }}
              >
                <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Department
                  </span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    {selectedComplaint.department_name}
                  </div>
                </div>

                <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Incident Location
                  </span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    {selectedComplaint.location}
                  </div>
                </div>

                <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Registered Citizen
                  </span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    {selectedComplaint.citizen_name || 'Citizen'} ({selectedComplaint.citizen_phone || 'Verified'})
                  </div>
                </div>
              </div>

              {/* Narrative */}
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Reported Issue Description:
                </span>
                <p style={{ color: 'var(--text-body)', fontSize: '0.88rem', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  {selectedComplaint.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="civic-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
              <AlertCircle size={28} strokeWidth={1.5} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem' }} />
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                No Grievance Record Found
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                We couldn&apos;t find a complaint matching &ldquo;{searchQuery}&rdquo;. Try using ID #1, #2, or phone +1-555-0201.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
