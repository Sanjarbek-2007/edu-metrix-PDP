export type Role = 'SuperAdmin' | 'Admin' | 'Commandant' | 'Student';

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
    baho: number; // max 40
    davomat: number; // max 25
    xulq: number; // max 20
    amaliyot: number; // max 15
  };
  totalScore: number;
  riskStatus: RiskLevel;
}

export interface PointChange {
  id: string;
  studentId: string;
  category: 'Baho' | 'Davomat' | 'Xulq' | 'Amaliyot';
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
