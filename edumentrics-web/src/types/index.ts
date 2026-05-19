export type Role = 'SuperAdmin' | 'Admin' | 'Commandant' | 'Student' | 'Mentor';

export type GrantName = 'Unicorn' | 'Golden Mind' | 'None';
export type RiskLevel = 'Safe' | 'At Risk' | 'Danger';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Student extends User {
  role: 'Student';
  year: 1 | 2 | 3 | 4;
  group?: string; // Add group
  studentId?: string; // like STU-2025-001
  grantType: GrantName;
  roomNumber?: string;
  scores: {
    akademik: { value: number; max: number; gpa: number; gpaWarning: boolean; };
    davomat: { value: number; max: number; percentage: number; };
    amaliy: { value: number; max: number; subjects: { name: string; score: number; max: number; }[]; };
    faollik: { value: number; max: number; breakdown: { competitions: number; mentoring: number; certificates: number; volunteering: number; }; };
    tyutorBahosi: { value: number; max: number; lastEvaluatedBy: string; lastEvaluatedAt: string; breakdown: { korporativMadaniyat: number; ijtimoiyFaollik: number; softSkills: number; intizom: number; yotoqxonaHayot: number; }; };
    intizom: { value: number; max: number; breakdown: { akademikHalollik: number; ichkiTartib: number; auditoriyaIntizom: number; yotoqxonaIntizom: number; }; };
    asosiyTotal: number;
    bonus: {
      bandlikBonusi: { value: number; max: number; type: string; company: string; position: string; };
      reabilitatsiya: { value: number; max: number; tasksCompleted: string[]; };
      jarimalar: { value: number; max: number; history: { type: string; reason: string; points: number; date: string; }[]; };
    };
    finalScore: number;
  };
  totalScore: number;
  totalPenaltyThisSemester?: number;
  remainingPenaltyCapacity?: number;
  rehabilitationEarned?: number;
  riskStatus: RiskLevel;
}

export interface PointChange {
  id: string;
  studentId: string;
  category: 'akademik' | 'davomat' | 'amaliy' | 'faollik' | 'tyutorBahosi' | 'intizom' | 'jarima' | 'reabilitatsiya' | 'bandlik';
  amount: number;
  reason: string;
  date: string;
  approvedBy: string; // User ID or Name
}

export interface Certificate {
  id: string;
  studentId: string;
  title: string;
  category: string;
  organization: string;
  date: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  pointsAwarded?: number;
  rejectionReason?: string;
  uploadDate: string;
  fileUrl?: string; // Mock
}

export interface Violation {
  id: string;
  studentId: string;
  type: string;
  severity: 'Minor' | 'Moderate' | 'Serious';
  description: string;
  pointsDeducted: number;
  date: string;
  reportedBy: string; // Commandant ID or Admin ID
}

export interface AbsenceRequest {
  id: string;
  studentId: string;
  date: string;
  duration: string; // e.g., '1 night', 'Weekend'
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  note?: string;
  submittedAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  type: 'Morning' | 'Evening';
  status: 'Present' | 'Late' | 'Absent' | 'Pending';
  markedBy?: string;
}

export interface Message {
  id: string;
  studentId: string; // The student this message is about/from
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  date: string; // Using date for consistency with other types
  timestamp: string;
  threadId?: string; // E.g., tied to a certificate ID
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  assignedStudents: string[];
}

export interface TyutorEvaluation {
  id: string;
  studentId: string;
  mentorId: string;
  period: string; // e.g., 'May 2026'
  scores: {
    korporativMadaniyat: number;
    ijtimoiyFaollik: number;
    softSkills: number;
    intizom: number;
    yotoqxonaHayot: number;
  };
  totalPoints: number;
  notes: string;
  date: string;
}

export interface Achievement {
  id: string;
  studentId: string;
  type: string;
  title: string;
  result: string;
  points: number;
  status: 'kutilmoqda' | 'tasdiqlangan' | 'rad_etilgan';
  approvedBy?: string;
  date: string;
}

export interface Employment {
  id: string;
  studentId: string;
  company: string;
  position: string;
  type: 'part-time' | 'full-time' | 'amaliyot';
  bonusPoints: number;
  startDate: string;
  verified: boolean;
}
