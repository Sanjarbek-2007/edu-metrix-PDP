import {
  Student,
  PointChange,
  Certificate,
  Violation,
  AbsenceRequest,
  AttendanceRecord,
  Message,
  User,
  Mentor,
  TyutorEvaluation,
  Achievement,
  Employment
} from '../types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Alisher Rustamov', email: 'superadmin@pdpu.uz', role: 'SuperAdmin' },
  { id: 'u2', name: 'Dilnoza Karimova', email: 'admin@pdpu.uz', role: 'Admin' },
  { id: 'u3', name: 'Rustam Qosimov', email: 'commandant@pdpu.uz', role: 'Commandant' },
  { id: 'u4', name: 'Aziz Karimov', email: 'mentor@pdpu.uz', role: 'Mentor' },
];

const generateBaseScore = (
  akademikBase: number, 
  davomatBase: number, 
  amaliyBase: number,
  faollikBase: number = 7,
  tyutorBase: number = 4,
  intizomBase: number = 8
) => {
  const finalAmaliy = Math.min(15, amaliyBase);
  const asosiyTotal = akademikBase + davomatBase + finalAmaliy + faollikBase + tyutorBase + intizomBase;
  
  // Bonus and penalties for mock data initialization
  const bandlikVal = 5; 
  const jarimaVal = -3;
  const reabilitatsiyaVal = 0;

  return {
    akademik: {
      value: akademikBase,
      max: 40,
      gpa: Math.round((akademikBase / 40) * 100),
      gpaWarning: Math.round((akademikBase / 40) * 100) < 80
    },
    davomat: {
      value: davomatBase,
      max: 20,
      percentage: Math.round((davomatBase / 20) * 100)
    },
    amaliy: {
      value: finalAmaliy,
      max: 15,
      subjects: [
        { name: "ITS", score: Math.round(finalAmaliy / 3), max: 5 },
        { name: "Programming", score: Math.round(finalAmaliy / 3), max: 5 },
        { name: "Website", score: Math.min(5, finalAmaliy - 2 * Math.round(finalAmaliy / 3)), max: 5 }
      ]
    },
    faollik: {
      value: faollikBase,
      max: 10,
      breakdown: { competitions: 2, mentoring: 1, certificates: 3, volunteering: 1 }
    },
    tyutorBahosi: {
      value: tyutorBase,
      max: 5,
      lastEvaluatedBy: "Aziz Karimov",
      lastEvaluatedAt: "2026-05-01",
      breakdown: { korporativMadaniyat: 1.0, ijtimoiyFaollik: 1.0, softSkills: 1.0, intizom: 0.5, yotoqxonaHayot: 0.5 }
    },
    intizom: {
      value: intizomBase,
      max: 10,
      breakdown: { akademikHalollik: 3, ichkiTartib: 2, auditoriyaIntizom: 2, yotoqxonaIntizom: 1 }
    },
    asosiyTotal,
    bonus: {
      bandlikBonusi: { value: bandlikVal, max: 10, type: "part-time", company: "PDP Academy", position: "Junior Developer" },
      reabilitatsiya: { value: reabilitatsiyaVal, max: 10, tasksCompleted: [] },
      jarimalar: { value: jarimaVal, max: -20, history: [{ type: "yengil", reason: "Darsga kechikish", points: jarimaVal, date: "2026-05-10" }] }
    },
    finalScore: asosiyTotal + bandlikVal + jarimaVal + reabilitatsiyaVal
  }
};

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
    scores: generateBaseScore(34, 18, 11, 7, 4, 8),
    get totalScore() { return this.scores.finalScore; },
    totalPenaltyThisSemester: -3,
    remainingPenaltyCapacity: -17,
    rehabilitationEarned: 0,
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
    scores: generateBaseScore(31, 15, 9, 6, 3, 7),
    get totalScore() { return this.scores.finalScore; },
    totalPenaltyThisSemester: -3,
    remainingPenaltyCapacity: -17,
    rehabilitationEarned: 0,
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
    scores: generateBaseScore(39, 20, 15, 10, 5, 10),
    get totalScore() { return this.scores.finalScore; },
    totalPenaltyThisSemester: 0,
    remainingPenaltyCapacity: -20,
    rehabilitationEarned: 0,
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
    scores: generateBaseScore(28, 14, 8, 5, 3, 6),
    get totalScore() { return this.scores.finalScore; },
    totalPenaltyThisSemester: -8,
    remainingPenaltyCapacity: -12,
    rehabilitationEarned: 0,
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
    scores: generateBaseScore(36, 18, 13, 8, 4, 9),
    get totalScore() { return this.scores.finalScore; },
    totalPenaltyThisSemester: -1,
    remainingPenaltyCapacity: -19,
    rehabilitationEarned: 0,
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
    scores: generateBaseScore(38, 19, 14, 9, 5, 10),
    get totalScore() { return this.scores.finalScore; },
    totalPenaltyThisSemester: 0,
    remainingPenaltyCapacity: -20,
    rehabilitationEarned: 0,
    riskStatus: 'Safe'
  },
  { 
    id: 's7', 
    name: 'Sherzod Kamolov', 
    email: 'sherzod@students.pdpu.uz',
    studentId: 'STU-2025-099',
    role: 'Student',
    year: 1, 
    group: '25-101',
    grantType: 'Unicorn', 
    scores: generateBaseScore(36, 19, 13, 9, 5, 10),
    get totalScore() { return this.scores.finalScore; },
    riskStatus: 'Safe'
  },
  { 
    id: 's8', 
    name: 'Zulfiya Nazarova', 
    email: 'zulfiya@students.pdpu.uz',
    studentId: 'STU-2025-110',
    role: 'Student',
    year: 1, 
    group: '25-102', 
    grantType: 'None', 
    scores: generateBaseScore(33, 16, 11, 7, 4, 8),
    get totalScore() { return this.scores.finalScore; },
    riskStatus: 'Safe'
  },
  { 
    id: 's9', 
    name: 'Doniyor Yusupov', 
    email: 'doniyor@students.pdpu.uz',
    studentId: 'STU-2025-155',
    role: 'Student',
    year: 1, 
    group: '25-101',
    grantType: 'Unicorn', 
    scores: generateBaseScore(35, 18, 12, 8, 4, 9),
    get totalScore() { return this.scores.finalScore; },
    riskStatus: 'Safe'
  },
  { 
    id: 's10', 
    name: 'Mohira Tosheva', 
    email: 'mohira@students.pdpu.uz',
    studentId: 'STU-2024-222',
    role: 'Student',
    year: 2, 
    group: '24-201',
    grantType: 'Unicorn', 
    scores: generateBaseScore(37, 17, 14, 10, 5, 10),
    get totalScore() { return this.scores.finalScore; },
    riskStatus: 'Safe'
  },
  { 
    id: 's11', 
    name: 'Ulugbek Rashidov', 
    email: 'ulugbek@students.pdpu.uz',
    studentId: 'STU-2024-333',
    role: 'Student',
    year: 2, 
    group: '24-202',
    grantType: 'None', 
    scores: generateBaseScore(29, 13, 9, 6, 3, 7),
    get totalScore() { return this.scores.finalScore; },
    riskStatus: 'At Risk'
  },
  { 
    id: 's12', 
    name: 'Feruza Xolmatova', 
    email: 'feruza@students.pdpu.uz',
    studentId: 'STU-2023-444',
    role: 'Student',
    year: 3, 
    group: '23-301',
    grantType: 'Golden Mind', 
    scores: generateBaseScore(38, 20, 14, 10, 5, 10),
    get totalScore() { return this.scores.finalScore; },
    riskStatus: 'Safe'
  },
  { 
    id: 's13', 
    name: 'Bekzod Mirzayev', 
    email: 'bekzod@students.pdpu.uz',
    studentId: 'STU-2023-555',
    role: 'Student',
    year: 3, 
    group: '23-302',
    grantType: 'None', 
    scores: generateBaseScore(34, 17, 12, 8, 4, 9),
    get totalScore() { return this.scores.finalScore; },
    riskStatus: 'Safe'
  },
  { 
    id: 's14', 
    name: 'Gulnora Abdullayeva', 
    email: 'gulnora@students.pdpu.uz',
    studentId: 'STU-2022-666',
    role: 'Student',
    year: 4, 
    group: '22-401',
    grantType: 'Golden Mind', 
    scores: generateBaseScore(39, 19, 15, 10, 5, 10),
    get totalScore() { return this.scores.finalScore; },
    riskStatus: 'Safe'
  },
  { 
    id: 's15', 
    name: 'Sanjar Ergashev', 
    email: 'sanjar@students.pdpu.uz',
    studentId: 'STU-2022-777',
    role: 'Student',
    year: 4, 
    group: '22-401',
    grantType: 'None', 
    scores: generateBaseScore(27, 12, 8, 5, 2, 6),
    get totalScore() { return this.scores.finalScore; },
    riskStatus: 'Danger'
  },
  {
    id: 's16',
    name: 'Laylo Akramova',
    email: 'laylo@students.pdpu.uz',
    studentId: 'STU-2025-201',
    role: 'Student',
    year: 1,
    group: '25-103',
    grantType: 'None',
    scores: generateBaseScore(32, 17, 10, 6, 4, 7),
    get totalScore() { return this.scores.finalScore; },
    riskStatus: 'Safe'
  },
  {
    id: 's17',
    name: 'Abbos Sodiqov',
    email: 'abbos@students.pdpu.uz',
    studentId: 'STU-2024-118',
    role: 'Student',
    year: 2,
    group: '24-203',
    grantType: 'Unicorn',
    scores: generateBaseScore(35, 18, 12, 9, 5, 9),
    get totalScore() { return this.scores.finalScore; },
    riskStatus: 'Safe'
  },
  {
    id: 's18',
    name: 'Nigina Holiqova',
    email: 'nigina@students.pdpu.uz',
    studentId: 'STU-2023-095',
    role: 'Student',
    year: 3,
    group: '23-303',
    grantType: 'Golden Mind',
    scores: generateBaseScore(38, 19, 14, 10, 5, 10),
    get totalScore() { return this.scores.finalScore; },
    riskStatus: 'Safe'
  },
  {
    id: 's19',
    name: 'Javohir Orifov',
    email: 'javohir@students.pdpu.uz',
    studentId: 'STU-2022-111',
    role: 'Student',
    year: 4,
    group: '22-402',
    grantType: 'None',
    scores: generateBaseScore(25, 10, 7, 4, 2, 5),
    get totalScore() { return this.scores.finalScore; },
    riskStatus: 'Danger'
  },
  {
    id: 's20',
    name: 'Kamola Saidova',
    email: 'kamola@students.pdpu.uz',
    studentId: 'STU-2025-333',
    role: 'Student',
    year: 1,
    group: '25-103',
    grantType: 'Unicorn',
    scores: generateBaseScore(37, 20, 15, 8, 4, 9),
    get totalScore() { return this.scores.finalScore; },
    riskStatus: 'Safe'
  }
];

export const mockPointChanges: PointChange[] = [
  {
    id: 'pc1',
    studentId: 's1',
    category: 'amaliy',
    amount: 5,
    reason: 'Universitet xakatoni g\'olibi',
    date: '2025-11-15T10:00:00Z',
    approvedBy: 'Dilnoza Karimova'
  },
  {
    id: 'pc2',
    studentId: 's2',
    category: 'intizom',
    amount: -5,
    reason: 'Jiddiy yotoqxona qoidabuzarligi',
    date: '2025-11-20T14:30:00Z',
    approvedBy: 'Rustam Qosimov'
  },
  {
    id: 'pc3',
    studentId: 's4',
    category: 'jarima',
    amount: -8,
    reason: 'Akademik halollik buzilishi',
    date: '2025-12-05T09:00:00Z',
    approvedBy: 'Dilnoza Karimova'
  },
  {
    id: 'pc4',
    studentId: 's5',
    category: 'akademik',
    amount: 2,
    reason: 'Oraliq nazorat natijasi',
    date: '2025-12-10T10:00:00Z',
    approvedBy: 'LMS (Auto)'
  },
  {
    id: 'pc5',
    studentId: 's7',
    category: 'davomat',
    amount: 1,
    reason: 'Sababli dars qoldirilishi tiklandi',
    date: '2025-12-12T11:00:00Z',
    approvedBy: 'Dilnoza Karimova'
  },
  {
    id: 'pc6',
    studentId: 's10',
    category: 'faollik',
    amount: 3,
    reason: 'Sport musobaqasi g\'olibi',
    date: '2025-12-15T15:00:00Z',
    approvedBy: 'Aziz Karimov'
  },
  {
    id: 'pc7',
    studentId: 's12',
    category: 'tyutorBahosi',
    amount: 5,
    reason: 'A\'lo darajadagi intizom va faollik',
    date: '2026-01-05T09:00:00Z',
    approvedBy: 'Aziz Karimov'
  },
  {
    id: 'pc8',
    studentId: 's3',
    category: 'bandlik',
    amount: 5,
    reason: 'Soha bo\'yicha ishga joylashgani uchun',
    date: '2026-01-10T10:00:00Z',
    approvedBy: 'Dilnoza Karimova'
  },
  {
    id: 'pc9',
    studentId: 's8',
    category: 'jarima',
    amount: -3,
    reason: 'Yotoqxona tozalik qoidasi buzilishi',
    date: '2026-01-15T20:00:00Z',
    approvedBy: 'Rustam Qosimov'
  },
  {
    id: 'pc10',
    studentId: 's11',
    category: 'reabilitatsiya',
    amount: 4,
    reason: 'Ijtimoiy foydali mehnat (Kutubxona)',
    date: '2026-01-20T14:00:00Z',
    approvedBy: 'Dilnoza Karimova'
  },
  {
    id: 'pc11',
    studentId: 's15',
    category: 'akademik',
    amount: -2,
    reason: 'Yakuniy nazoratdan qayta topshirish',
    date: '2026-01-25T11:00:00Z',
    approvedBy: 'LMS (Auto)'
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
  },
  {
    id: 'c3',
    studentId: 's3',
    title: 'Google Data Analytics Certificate',
    category: 'Professional Certificate',
    organization: 'Coursera',
    date: '2025-05-15',
    description: 'Data analytics foundation course',
    status: 'Approved',
    pointsAwarded: 8,
    uploadDate: '2025-05-16T10:00:00Z'
  },
  {
    id: 'c4',
    studentId: 's7',
    title: 'Python for Beginners',
    category: 'Local Course',
    organization: 'IT Park',
    date: '2026-04-20',
    description: 'Python asoslari kursi',
    status: 'Rejected',
    rejectionReason: 'Sertifikat nusxasi o\'qib bo\'lmaydi',
    uploadDate: '2026-04-25T14:00:00Z'
  },
  {
    id: 'c5',
    studentId: 's10',
    title: 'Hackathon Finalist 2026',
    category: 'Competition',
    organization: 'U-Enter',
    date: '2026-05-01',
    description: 'Smart City Hackathon finalchisi',
    status: 'Pending',
    uploadDate: '2026-05-05T09:00:00Z'
  },
  {
    id: 'c6',
    studentId: 's12',
    title: 'IELTS 8.0',
    category: 'Language',
    organization: 'British Council',
    date: '2026-03-10',
    description: 'International English Language Testing System',
    status: 'Approved',
    pointsAwarded: 10,
    uploadDate: '2026-03-15T11:00:00Z'
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
  },
  {
    id: 'v5',
    studentId: 's8',
    type: 'Shaxsiy gigiyena',
    severity: 'Minor',
    description: 'Xona tozaligiga e\'tiborsizlik.',
    pointsDeducted: 1,
    date: '2026-05-11T10:00:00Z',
    reportedBy: 'Rustam Qosimov'
  },
  {
    id: 'v6',
    studentId: 's11',
    type: 'Dars vaqtida tartibsizlik',
    severity: 'Moderate',
    description: 'Auditoriyada baland ovozda gaplashish.',
    pointsDeducted: 2,
    date: '2026-05-10T14:00:00Z',
    reportedBy: 'Dilnoza Karimova'
  },
  {
    id: 'v7',
    studentId: 's15',
    type: 'Akademik firibgarlik',
    severity: 'Serious',
    description: 'Boshqa talabaning ishini ko\'chirgan.',
    pointsDeducted: 10,
    date: '2026-05-09T09:00:00Z',
    reportedBy: 'Dilnoza Karimova'
  },
  {
    id: 'v8',
    studentId: 's9',
    type: 'Yotoqxona anjomlariga zarar yetkazish',
    severity: 'Moderate',
    description: 'Xonadagi stolni shikastlagan.',
    pointsDeducted: 5,
    date: '2026-05-08T16:00:00Z',
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
  },
  {
    id: 'ar5',
    studentId: 's7',
    date: '2026-05-18',
    duration: '1 kecha',
    reason: 'Tug\'ilgan kunga borish',
    status: 'Pending',
    submittedAt: '2026-05-17T20:00:00Z'
  },
  {
    id: 'ar6',
    studentId: 's10',
    date: '2026-05-20',
    duration: '2 kecha',
    reason: 'Dam olish kunlari uyga borish',
    status: 'Pending',
    submittedAt: '2026-05-18T09:00:00Z'
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

export const mockMentors: Mentor[] = [
  {
    id: 'm1',
    name: 'Aziz Karimov',
    email: 'mentor@pdpu.uz',
    assignedStudents: ['s1', 's2', 's7', 's8', 's9']
  }
];

export const mockTyutorEvaluations: TyutorEvaluation[] = [
  {
    id: 'te1',
    studentId: 's1',
    mentorId: 'm1',
    period: 'May 2026',
    scores: {
      korporativMadaniyat: 1,
      ijtimoiyFaollik: 1,
      softSkills: 1,
      intizom: 0.5,
      yotoqxonaHayot: 0.5
    },
    totalPoints: 4,
    notes: 'Yaxshi natija',
    date: '2026-05-01'
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: 'ach1',
    studentId: 's1',
    type: 'musobaqa',
    title: 'PDP Hackathon 2025',
    result: 'ishtirokchi',
    points: 1,
    status: 'tasdiqlangan',
    approvedBy: 'u2',
    date: '2025-11-15'
  }
];

export const mockEmployment: Employment[] = [
  {
    id: 'emp1',
    studentId: 's3',
    company: 'PDP Tech',
    position: 'Frontend Developer',
    type: 'part-time',
    bonusPoints: 6,
    startDate: '2025-09-01',
    verified: true
  }
];
