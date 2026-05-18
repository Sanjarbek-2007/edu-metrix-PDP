import {
  Student,
  PointChange,
  Certificate,
  Violation,
  AbsenceRequest,
  AttendanceRecord,
  Message,
  User
} from '../types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Alisher Rustamov', email: 'superadmin@pdpu.uz', role: 'SuperAdmin' },
  { id: 'u2', name: 'Dilnoza Karimova', email: 'admin@pdpu.uz', role: 'Admin' },
  { id: 'u3', name: 'Rustam Qosimov', email: 'commandant@pdpu.uz', role: 'Commandant' },
];

export const mockStudents: Student[] = [
  {
    id: 's1',
    studentId: 'STU-2025-001',
    name: 'Sardor Ergashev',
    email: 'sardor@students.pdpu.uz',
    role: 'Student',
    year: 1,
    group: '25-101',
    grantType: 'Unicorn',
    roomNumber: 'A-101',
    scores: { baho: 38, davomat: 24, xulq: 18, amaliyot: 5 },
    totalScore: 85,
    riskStatus: 'Safe'
  },
  {
    id: 's2',
    studentId: 'STU-2024-042',
    name: 'Malika Yusupova',
    email: 'malika@students.pdpu.uz',
    role: 'Student',
    year: 2,
    group: '24-201',
    grantType: 'Unicorn',
    roomNumber: 'B-205',
    scores: { baho: 35, davomat: 20, xulq: 15, amaliyot: 8 },
    totalScore: 78,
    riskStatus: 'At Risk'
  },
  {
    id: 's3',
    studentId: 'STU-2023-112',
    name: 'Jasur Toshmatov',
    email: 'jasur@students.pdpu.uz',
    role: 'Student',
    year: 3,
    group: '23-301',
    grantType: 'Golden Mind',
    roomNumber: 'A-110',
    scores: { baho: 39, davomat: 25, xulq: 20, amaliyot: 12 },
    totalScore: 96,
    riskStatus: 'Safe'
  },
  {
    id: 's4',
    studentId: 'STU-2022-005',
    name: 'Nilufar Karimova',
    email: 'nilufar@students.pdpu.uz',
    role: 'Student',
    year: 4,
    group: '22-401',
    grantType: 'Golden Mind',
    scores: { baho: 30, davomat: 18, xulq: 12, amaliyot: 10 },
    totalScore: 70,
    riskStatus: 'Danger'
  },
  {
    id: 's5',
    studentId: 'STU-2025-018',
    name: 'Bobur Rahimov',
    email: 'bobur@students.pdpu.uz',
    role: 'Student',
    year: 1,
    group: '25-102',
    grantType: 'None',
    roomNumber: 'C-302',
    scores: { baho: 36, davomat: 22, xulq: 19, amaliyot: 0 },
    totalScore: 77,
    riskStatus: 'Safe'
  },
  {
    id: 's6',
    studentId: 'STU-2023-088',
    name: 'Madina Aliyeva',
    email: 'madina@students.pdpu.uz',
    role: 'Student',
    year: 3,
    group: '23-302',
    grantType: 'None',
    scores: { baho: 40, davomat: 25, xulq: 20, amaliyot: 5 },
    totalScore: 90,
    riskStatus: 'Safe'
  }
  // Will add more dynamic generation in the context if needed
];

export const mockPointChanges: PointChange[] = [
  {
    id: 'pc1',
    studentId: 's1',
    category: 'Amaliyot',
    amount: 5,
    reason: 'Universitet xakatoni g\'olibi',
    date: '2023-11-15T10:00:00Z',
    approvedBy: 'Dilnoza Karimova'
  },
  {
    id: 'pc2',
    studentId: 's2',
    category: 'Xulq',
    amount: -5,
    reason: 'Jiddiy yotoqxona qoidabuzarligi',
    date: '2023-11-20T14:30:00Z',
    approvedBy: 'Rustam Qosimov'
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: 'c1',
    studentId: 's5',
    title: 'AWS Cloud Practitioner',
    category: 'IT Certification',
    organization: 'Amazon Web Services',
    date: '2023-11-10',
    description: 'Foundation AWS imtihonidan o\'tdi',
    status: 'Pending',
    uploadDate: '2023-11-30T09:00:00Z'
  },
  {
    id: 'c2',
    studentId: 's1',
    title: 'React Native Course',
    category: 'Online Course',
    organization: 'Udemy',
    date: '2023-10-05',
    description: '40 soatlik kursni yakunladi',
    status: 'Approved',
    pointsAwarded: 5,
    uploadDate: '2023-10-10T11:00:00Z'
  }
];

export const mockViolations: Violation[] = [
  {
    id: 'v1',
    studentId: 's2',
    type: 'Yotoqxona qoidasi',
    severity: 'Serious',
    description: 'Tunda soat 23:00 dan keyin ogohlantirishsiz kelgan.',
    pointsDeducted: 5,
    date: '2026-05-15T23:15:00Z',
    reportedBy: 'Rustam Qosimov'
  },
  {
    id: 'v2',
    studentId: 's1',
    type: 'Shovqin-suron',
    severity: 'Minor',
    description: 'Xonada baland ovozda musiqa qo\'ygan.',
    pointsDeducted: 1,
    date: '2026-05-14T21:00:00Z',
    reportedBy: 'Rustam Qosimov'
  },
  {
    id: 'v3',
    studentId: 's5',
    type: 'Yotoqxona tartibini buzish',
    severity: 'Moderate',
    description: 'Xonada umumiy tartib-intizomga amal qilmagan.',
    pointsDeducted: 3,
    date: '2026-05-13T20:00:00Z',
    reportedBy: 'Rustam Qosimov'
  },
  {
    id: 'v4',
    studentId: 's3',
    type: 'Tunda tashqarida qolish',
    severity: 'Moderate',
    description: 'Ruxsatsiz yotoqxonaga kelmagan.',
    pointsDeducted: 3,
    date: '2026-05-12T23:45:00Z',
    reportedBy: 'Rustam Qosimov'
  }
];

export const mockAbsenceRequests: AbsenceRequest[] = [
  {
    id: 'ar1',
    studentId: 's1',
    date: '2026-05-16',
    duration: '1 kecha',
    reason: 'Oilaviy tadbirga borish',
    status: 'Pending',
    submittedAt: '2026-05-16T10:30:00Z'
  },
  {
    id: 'ar2',
    studentId: 's2',
    date: '2026-05-17',
    duration: '2 kecha',
    reason: 'Toshkentdan qarindoshlar kelmoqda',
    status: 'Pending',
    submittedAt: '2026-05-15T18:45:00Z'
  },
  {
    id: 'ar3',
    studentId: 's3',
    date: '2026-05-10',
    duration: '1 kecha',
    reason: 'Shifokorga borish',
    status: 'Approved',
    note: 'Tasdiqlandi',
    submittedAt: '2026-05-09T09:15:00Z'
  },
  {
    id: 'ar4',
    studentId: 's5',
    date: '2026-05-05',
    duration: '3 kecha',
    reason: 'Uy-joy muammosi',
    status: 'Rejected',
    note: '3 kunlik ruxsat normadan oshadi',
    submittedAt: '2026-05-04T16:20:00Z'
  }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'at1',
    studentId: 's1',
    date: '2023-12-01',
    type: 'Morning',
    status: 'Present',
    markedBy: 'u3'
  },
  {
    id: 'at2',
    studentId: 's2',
    date: '2023-12-01',
    type: 'Morning',
    status: 'Late',
    markedBy: 'u3'
  }
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    studentId: 's5',
    senderId: 's5',
    receiverId: 'u2',
    subject: 'Sertifikat tekshiruvi',
    content: 'Assalomu alaykum, AWS sertifikatimni yukladim. Amaliyot ballari uchun hisobga olinadimi?',
    date: '2023-11-30T09:05:00Z',
    timestamp: '2023-11-30T09:05:00Z',
    threadId: 'c1'
  },
  {
    id: 'm2',
    studentId: 's1',
    senderId: 's1',
    receiverId: 'u2',
    subject: 'Ballar hisoblanishi',
    content: 'LMS ballarim hali yangilanmagan ekan, qachon yangilanadi?',
    date: '2023-12-01T10:20:00Z',
    timestamp: '2023-12-01T10:20:00Z'
  },
  {
    id: 'm3',
    studentId: 's2',
    senderId: 's2',
    receiverId: 'u2',
    subject: 'Yotoqxona qoidalari',
    content: 'Yotoqxonaga kechroq kelish bo\'yicha ruxsat so\'ramoqchi edim.',
    date: '2023-12-02T15:45:00Z',
    timestamp: '2023-12-02T15:45:00Z'
  }
];
