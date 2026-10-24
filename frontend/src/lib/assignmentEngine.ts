import { Staff, Complaint, WorkOrder } from '../types';

export interface StaffAssignmentRecommendation {
  staff: Staff;
  compositeScore: number; // 0 - 100
  rank: number;
  workloadScore: number;
  activeTicketCount: number;
  skillScore: number;
  specializationNote: string;
  proximityScore: number;
  estimatedDistanceKm: number;
  zoneName: string;
  urgencyScore: number;
  urgencyLevel: 'Critical' | 'High' | 'Medium' | 'Routine';
  recommendationTier: 'Optimal Best Match' | 'Recommended' | 'Alternative' | 'Overloaded';
  rationale: string;
}

// Multi-factor weights
const WEIGHTS = {
  WORKLOAD: 0.35,
  SKILL: 0.30,
  PROXIMITY: 0.20,
  URGENCY: 0.15,
};

// Key Specialization Dictionary
const SKILL_KEYWORDS: Record<string, string[]> = {
  pipeline: ['pipeline', 'water', 'leak', 'burst', 'conduit', 'meter'],
  asphalt: ['pothole', 'asphalt', 'road', 'paving', 'curb', 'median'],
  sanitation: ['kachra', 'waste', 'garbage', 'debris', 'compactor', 'refuse'],
  electric: ['electric', 'cable', 'wire', 'pole', 'transformer', 'lighting', 'lamp'],
  vector: ['fumigation', 'dengue', 'malaria', 'mosquito', 'spray', 'larvae'],
  horticulture: ['tree', 'park', 'branch', 'greenery', 'foliage', 'swing'],
};

// Karachi District Zones for Locations
const KARACHI_ZONES: Record<string, string> = {
  clifton: 'District South (Clifton Depot)',
  dha: 'District South (DHA Sector)',
  saddar: 'District South (Saddar Central Depot)',
  gulshan: 'District East (Gulshan Depot)',
  'university road': 'District East (Gulshan Depot)',
  'north nazimabad': 'District Central (Nazimabad Wing)',
  korangi: 'District Korangi (Industrial Depot)',
  malir: 'District Malir (Airport Zone)',
};

/**
 * Determine severity level of a complaint based on hazards
 */
export function evaluateSeverityLevel(
  category: string,
  description: string
): 'Critical' | 'High' | 'Medium' | 'Routine' {
  const text = `${category} ${description}`.toLowerCase();
  if (
    text.includes('live electric') ||
    text.includes('sparking') ||
    text.includes('missing manhole') ||
    text.includes('contaminated drinking') ||
    text.includes('burst')
  ) {
    return 'Critical';
  }
  if (
    text.includes('deep pothole') ||
    text.includes('overflowing kachra') ||
    text.includes('dengue') ||
    text.includes('sewage overflow')
  ) {
    return 'High';
  }
  if (text.includes('street blackout') || text.includes('debris') || text.includes('fallen tree')) {
    return 'Medium';
  }
  return 'Routine';
}

/**
 * Multi-Factor Staff Assignment Engine:
 * Evaluates candidate technicians on Workload Queue, Skill Match, Proximity, and SLA Urgency.
 */
export function rankStaffForComplaint(
  complaint: Complaint,
  staffList: Staff[],
  workOrders: WorkOrder[]
): StaffAssignmentRecommendation[] {
  const severity = evaluateSeverityLevel(complaint.category, complaint.description);
  const complaintDeptId = complaint.department_id;
  const complaintText = `${complaint.category} ${complaint.description} ${complaint.location}`.toLowerCase();

  // Find candidate technicians (prioritize staff from the target department)
  const candidateStaff = staffList.filter((s) => s.is_active);

  const recommendations: StaffAssignmentRecommendation[] = candidateStaff.map((staff) => {
    // 1. FACTOR: Workload Queue (Active orders)
    const activeOrders = workOrders.filter(
      (wo) =>
        wo.staff_id === staff.staff_id &&
        (wo.work_status === 'Assigned' || wo.work_status === 'In Progress')
    );
    const activeCount = activeOrders.length;
    let workloadScore = 100;
    if (activeCount === 1) workloadScore = 85;
    else if (activeCount === 2) workloadScore = 60;
    else if (activeCount === 3) workloadScore = 35;
    else if (activeCount >= 4) workloadScore = 15;

    // 2. FACTOR: Skill Specialization & Designation Match
    let skillScore = 50;
    let specNote = 'General municipal field technician';
    const staffTitle = `${staff.name} ${staff.designation}`.toLowerCase();
    const isSameDept = staff.department_id === complaintDeptId;

    if (isSameDept) {
      skillScore = 75;
      specNote = `${staff.designation} (Department Specialist)`;

      // Keyword boost
      for (const [key, terms] of Object.entries(SKILL_KEYWORDS)) {
        const matchesComplaint = terms.some((t) => complaintText.includes(t));
        const matchesStaff = terms.some((t) => staffTitle.includes(t));
        if (matchesComplaint && matchesStaff) {
          skillScore = 98;
          specNote = `Primary Specialist for ${complaint.category}`;
          break;
        }
      }
    } else {
      skillScore = 30;
      specNote = 'Cross-department backup officer';
    }

    // 3. FACTOR: Geographic Proximity
    let zone = 'Karachi Central Ward';
    for (const [kw, zName] of Object.entries(KARACHI_ZONES)) {
      if (complaintText.includes(kw)) {
        zone = zName;
        break;
      }
    }

    // Hash pseudo-random distance based on staff_id and complaint_id for consistent simulation
    const seed = (staff.staff_id * 17 + complaint.complaint_id * 31) % 50;
    const estimatedDistanceKm = Number((0.6 + (seed / 10)).toFixed(1));

    let proximityScore = 75;
    if (estimatedDistanceKm < 1.5) proximityScore = 98;
    else if (estimatedDistanceKm < 3.0) proximityScore = 86;
    else if (estimatedDistanceKm < 4.5) proximityScore = 70;
    else proximityScore = 52;

    // 4. FACTOR: SLA Urgency Matching
    let urgencyScore = 70;
    const isLeadOrSenior =
      staffTitle.includes('lead') ||
      staffTitle.includes('senior') ||
      staffTitle.includes('chief') ||
      staffTitle.includes('engineer');

    if (severity === 'Critical') {
      urgencyScore = isLeadOrSenior ? 100 : 65;
    } else if (severity === 'High') {
      urgencyScore = isLeadOrSenior ? 90 : 80;
    } else {
      urgencyScore = 85;
    }

    // Compute composite score
    const compositeScore = Math.round(
      workloadScore * WEIGHTS.WORKLOAD +
        skillScore * WEIGHTS.SKILL +
        proximityScore * WEIGHTS.PROXIMITY +
        urgencyScore * WEIGHTS.URGENCY
    );

    // Determine Tier
    let recommendationTier: StaffAssignmentRecommendation['recommendationTier'] = 'Alternative';
    if (compositeScore >= 85) recommendationTier = 'Optimal Best Match';
    else if (compositeScore >= 72) recommendationTier = 'Recommended';
    else if (activeCount >= 3) recommendationTier = 'Overloaded';

    // Rationale Summary
    const rationale = `${recommendationTier}: ${activeCount} active orders, ${estimatedDistanceKm} km from ${zone}. ${specNote}.`;

    return {
      staff,
      compositeScore,
      rank: 0,
      workloadScore,
      activeTicketCount: activeCount,
      skillScore,
      specializationNote: specNote,
      proximityScore,
      estimatedDistanceKm,
      zoneName: zone,
      urgencyScore,
      urgencyLevel: severity,
      recommendationTier,
      rationale,
    };
  });

  // Sort descending by composite score, prioritizing same department
  recommendations.sort((a, b) => {
    const aSame = a.staff.department_id === complaintDeptId ? 1 : 0;
    const bSame = b.staff.department_id === complaintDeptId ? 1 : 0;
    if (aSame !== bSame) return bSame - aSame;
    return b.compositeScore - a.compositeScore;
  });

  // Assign ranks
  recommendations.forEach((rec, idx) => {
    rec.rank = idx + 1;
  });

  return recommendations;
}
