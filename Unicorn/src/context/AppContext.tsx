import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  User, Student, PointChange, Certificate, Violation, 
  AbsenceRequest, AttendanceRecord, Message 
} from '../types';
import { 
  mockUsers, mockStudents, mockPointChanges, mockCertificates, 
  mockViolations, mockAbsenceRequests, mockAttendanceRecords, mockMessages 
} from '../data/mockData';

interface AppContextType {
  currentUser: User | Student | null;
  setCurrentUser: (user: User | Student | null) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  pointChanges: PointChange[];
  certificates: Certificate[];
  violations: Violation[];
  absenceRequests: AbsenceRequest[];
  attendanceRecords: AttendanceRecord[];
  messages: Message[];
  
  // UI States
  isActivitySidebarOpen: boolean;
  setIsActivitySidebarOpen: (open: boolean) => void;
  
  // Actions
  login: (email: string) => boolean;
  logout: () => void;
  updateCertificate: (id: string, status: 'Approved'|'Rejected', points?: number, reason?: string) => void;
  addViolation: (violation: Omit<Violation, 'id'>) => void;
  addPointChange: (change: Omit<PointChange, 'id' | 'date'>) => void;
  updateAbsenceRequest: (id: string, status: 'Approved' | 'Rejected', note?: string) => void;
  addAbsenceRequest: (req: Omit<AbsenceRequest, 'id'>) => void;
  addCertificate: (cert: Omit<Certificate, 'id'>) => void;
  submitAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'date'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | Student | null>(null);
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);
  
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [pointChanges, setPointChanges] = useState<PointChange[]>(mockPointChanges);
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [violations, setViolations] = useState<Violation[]>(mockViolations);
  const [absenceRequests, setAbsenceRequests] = useState<AbsenceRequest[]>(mockAbsenceRequests);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const login = (email: string) => {
    const user = users.find(u => u.email === email) || students.find(s => s.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const updateCertificate = (id: string, status: 'Approved'|'Rejected', points?: number, reason?: string) => {
    setCertificates(prev => prev.map(c => 
      c.id === id ? { ...c, status, pointsAwarded: points, rejectionReason: reason } : c
    ));
    if (status === 'Approved' && points) {
      const cert = certificates.find(c => c.id === id);
      if (cert) {
        addPointChange({
          studentId: cert.studentId,
          category: 'Amaliyot',
          amount: points,
          reason: `Certificate Approved: ${cert.title}`,
          approvedBy: currentUser?.name || 'Admin',
        });
      }
    }
  };

  const addPointChange = (change: Omit<PointChange, 'id' | 'date'>) => {
    const newChange: PointChange = {
      ...change,
      id: `pc-${Date.now()}`,
      date: new Date().toISOString()
    };
    setPointChanges(prev => [newChange, ...prev]);

    // Update student score
    setStudents(prev => prev.map(s => {
      if (s.id === change.studentId) {
        const categoryKey = change.category.toLowerCase() as keyof Student['scores'];
        const newScore = s.scores[categoryKey] + change.amount;
        // Cap max scores
        let finalScore = newScore;
        if (change.category === 'Baho' && newScore > 40) finalScore = 40;
        if (change.category === 'Davomat' && newScore > 25) finalScore = 25;
        if (change.category === 'Xulq' && newScore > 20) finalScore = 20;
        if (change.category === 'Amaliyot' && newScore > 15) finalScore = 15;
        
        return {
          ...s,
          scores: { ...s.scores, [categoryKey]: finalScore },
          totalScore: s.totalScore + (finalScore - s.scores[categoryKey]) // adjustment
        };
      }
      return s;
    }));
  };

  const addViolation = (violation: Omit<Violation, 'id'>) => {
    const newViolation: Violation = {
      ...violation,
      id: `v-${Date.now()}`,
      date: violation.date || new Date().toISOString()
    };
    setViolations(prev => [newViolation, ...prev]);
    addPointChange({
      studentId: violation.studentId,
      category: 'Xulq',
      amount: -violation.pointsDeducted,
      reason: `Violation: ${violation.type} - ${violation.description}`,
      approvedBy: currentUser?.name || 'System'
    });
  };

  const updateAbsenceRequest = (id: string, status: 'Approved' | 'Rejected', note?: string) => {
    setAbsenceRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status, note } : req
    ));
  };

  const addAbsenceRequest = (req: Omit<AbsenceRequest, 'id'>) => {
    const newReq: AbsenceRequest = {
      ...req,
      id: `req-${Date.now()}`
    };
    setAbsenceRequests(prev => [newReq, ...prev]);
  };

  const addCertificate = (cert: Omit<Certificate, 'id'>) => {
    const newCert: Certificate = {
      ...cert,
      id: `cert-${Date.now()}`
    };
    setCertificates(prev => [newCert, ...prev]);
  };

  const submitAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    const newRecords = records.map(r => ({
      ...r,
      id: `at-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    setAttendanceRecords(prev => [...newRecords, ...prev]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: `u-${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addMessage = (message: Omit<Message, 'id' | 'timestamp' | 'date'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, users, setUsers, students, setStudents, pointChanges, certificates,
      violations, absenceRequests, attendanceRecords, messages,
      isActivitySidebarOpen, setIsActivitySidebarOpen,
      login, logout, updateCertificate, addViolation, addPointChange,
      updateAbsenceRequest, addAbsenceRequest, addCertificate, submitAttendance,
      updateUser, addUser, updateStudent, addMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
