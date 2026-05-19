import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  User, Student, PointChange, Certificate, Violation, 
  AbsenceRequest, AttendanceRecord, Message,
  Achievement, Employment, Mentor, TyutorEvaluation
} from '../types';

const API_BASE = 'http://localhost:17075/api';

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
  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  employment: Employment[];
  mentors: Mentor[];
  tyutorEvaluations: TyutorEvaluation[];
  
  // UI States
  isActivitySidebarOpen: boolean;
  setIsActivitySidebarOpen: (open: boolean) => void;
  
  // Actions
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  checkPhone: (phoneNumber: string) => Promise<any[]>;
  updateProfile: (updates: any) => Promise<boolean>;
  updateCertificate: (id: string, updates: Partial<Certificate>) => Promise<void>;
  addViolation: (violation: Omit<Violation, 'id'>) => Promise<void>;
  addPointChange: (change: Omit<PointChange, 'id' | 'date'>) => Promise<void>;
  updateAbsenceRequest: (id: string, status: 'Approved' | 'Rejected', note?: string) => Promise<void>;
  addAbsenceRequest: (req: Omit<AbsenceRequest, 'id'>) => Promise<void>;
  addCertificate: (cert: Omit<Certificate, 'id'>) => Promise<void>;
  submitAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'date'>) => Promise<void>;
  updateAchievement: (id: string, status: Achievement['status'], points?: number) => Promise<void>;
  addAchievement: (ach: Omit<Achievement, 'id'>) => Promise<void>;
  addTyutorEvaluation: (evaluation: Omit<TyutorEvaluation, 'id'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | Student | null>(null);
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [pointChanges, setPointChanges] = useState<PointChange[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [absenceRequests, setAbsenceRequests] = useState<AbsenceRequest[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [employment, setEmployment] = useState<Employment[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [tyutorEvaluations, setTyutorEvaluations] = useState<TyutorEvaluation[]>([]);

  // Helper for authenticated requests
  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  const fetchAllData = async () => {
    try {
      const headers = getHeaders();
      
      const [
        resUsers, resStudents, resPointChanges, resCertificates,
        resViolations, resAbsences, resAttendance, resMessages,
        resAchievements, resEmployments, resMentors, resTyutorEvals
      ] = await Promise.all([
        fetch(`${API_BASE}/users`, { headers }),
        fetch(`${API_BASE}/students`, { headers }),
        fetch(`${API_BASE}/point-changes`, { headers }),
        fetch(`${API_BASE}/certificates`, { headers }),
        fetch(`${API_BASE}/violations`, { headers }),
        fetch(`${API_BASE}/absence-requests`, { headers }),
        fetch(`${API_BASE}/attendance-records`, { headers }),
        fetch(`${API_BASE}/messages`, { headers }),
        fetch(`${API_BASE}/achievements`, { headers }),
        fetch(`${API_BASE}/employments`, { headers }),
        fetch(`${API_BASE}/mentors`, { headers }),
        fetch(`${API_BASE}/tyutor-evaluations`, { headers })
      ]);

      if (resUsers.ok) setUsers(await resUsers.json());
      if (resStudents.ok) {
        const studentList = await resStudents.json();
        setStudents(studentList);
        // Refresh current user profile if student
        const localUser = localStorage.getItem('user');
        if (localUser) {
          const parsed = JSON.parse(localUser);
          const updatedCur = studentList.find((s: any) => s.id === parsed.id || s.studentId === parsed.studentId);
          if (updatedCur) {
            setCurrentUser(updatedCur);
            localStorage.setItem('user', JSON.stringify(updatedCur));
          }
        }
      }
      if (resPointChanges.ok) setPointChanges(await resPointChanges.json());
      if (resCertificates.ok) setCertificates(await resCertificates.json());
      if (resViolations.ok) setViolations(await resViolations.json());
      if (resAbsences.ok) setAbsenceRequests(await resAbsences.json());
      if (resAttendance.ok) setAttendanceRecords(await resAttendance.json());
      if (resMessages.ok) setMessages(await resMessages.json());
      if (resAchievements.ok) setAchievements(await resAchievements.json());
      if (resEmployments.ok) setEmployment(await resEmployments.json());
      if (resMentors.ok) setMentors(await resMentors.json());
      if (resTyutorEvals.ok) setTyutorEvaluations(await resTyutorEvals.json());
    } catch (err) {
      console.error('Error fetching backend data', err);
    }
  };

  // Restore session
  useEffect(() => {
    const token = localStorage.getItem('token');
    const localUser = localStorage.getItem('user');
    if (token && localUser) {
      const parsed = JSON.parse(localUser);
      setCurrentUser(parsed);
      fetchAllData();
    }
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/public/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'password123' })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        
        setTimeout(() => {
          fetchAllData();
        }, 100);
        return true;
      }
    } catch (err) {
      console.error('Login error', err);
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const checkPhone = async (phoneNumber: string): Promise<any[]> => {
    try {
      const res = await fetch(`${API_BASE}/public/auth/check-phone?phoneNumber=${encodeURIComponent(phoneNumber)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Check phone error', err);
    }
    return [];
  };

  const updateProfile = async (updates: any): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        fetchAllData();
        return true;
      }
    } catch (err) {
      console.error('Update profile error', err);
    }
    return false;
  };

  const updateCertificate = async (id: string, updates: Partial<Certificate>) => {
    try {
      const res = await fetch(`${API_BASE}/certificates/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          status: updates.status,
          pointsAwarded: updates.pointsAwarded,
          approvedBy: currentUser?.name || 'Admin',
          rejectionReason: updates.rejectionReason
        })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addPointChange = async (change: Omit<PointChange, 'id' | 'date'>) => {
    try {
      const res = await fetch(`${API_BASE}/point-changes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(change)
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addViolation = async (violation: Omit<Violation, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/violations`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(violation)
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateAbsenceRequest = async (id: string, status: 'Approved' | 'Rejected', note?: string) => {
    try {
      const res = await fetch(`${API_BASE}/absence-requests/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status, note })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addAbsenceRequest = async (req: Omit<AbsenceRequest, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/absence-requests`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(req)
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addCertificate = async (cert: Omit<Certificate, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/certificates`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(cert)
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitAttendance = async (records: Omit<AttendanceRecord, 'id'>[]) => {
    try {
      const res = await fetch(`${API_BASE}/attendance-records/batch`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(records)
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addUser = async (user: Omit<User, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(user)
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      const res = await fetch(`${API_BASE}/students/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addMessage = async (message: Omit<Message, 'id' | 'timestamp' | 'date'>) => {
    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(message)
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateAchievement = async (id: string, status: Achievement['status'], points?: number) => {
    try {
      const res = await fetch(`${API_BASE}/achievements/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          status,
          points,
          approvedBy: currentUser?.name || 'Admin'
        })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addAchievement = async (ach: Omit<Achievement, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/achievements`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(ach)
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addTyutorEvaluation = async (evaluation: Omit<TyutorEvaluation, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/tyutor-evaluations`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          studentId: evaluation.studentId,
          mentorId: currentUser?.email || 'admin@pdpu.uz',
          period: evaluation.period,
          korporativMadaniyat: evaluation.scores.korporativMadaniyat,
          ijtimoiyFaollik: evaluation.scores.ijtimoiyFaollik,
          softSkills: evaluation.scores.softSkills,
          intizom: evaluation.scores.intizom,
          yotoqxonaHayot: evaluation.scores.yotoqxonaHayot,
          totalPoints: evaluation.totalPoints,
          notes: evaluation.notes || ''
        })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, users, setUsers, students, setStudents, pointChanges, certificates,
      violations, absenceRequests, attendanceRecords, messages,
      achievements, setAchievements, employment, mentors, tyutorEvaluations,
      isActivitySidebarOpen, setIsActivitySidebarOpen,
      login, logout, checkPhone, updateProfile, updateCertificate, addViolation, addPointChange,
      updateAbsenceRequest, addAbsenceRequest, addCertificate, submitAttendance,
      updateUser, addUser, updateStudent, addMessage, updateAchievement, addAchievement, addTyutorEvaluation
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
