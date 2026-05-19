import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, Student, PointChange, Certificate, Violation, 
  AbsenceRequest, AttendanceRecord, Message 
} from '../types';
import { api } from '../lib/api';

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
  
  // Actions (Asynchronous)
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateCertificate: (id: string, status: 'Approved'|'Rejected', points?: number, reason?: string) => Promise<void>;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | Student | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [pointChanges, setPointChanges] = useState<PointChange[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [absenceRequests, setAbsenceRequests] = useState<AbsenceRequest[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // 1. Fetch system datasets from backend when logged in
  const fetchAllData = async () => {
    try {
      const [
        usersData, studentsData, pointsData, certsData, 
        violsData, absenceData, attendanceData, messagesData
      ] = await Promise.all([
        api.get('/api/users'),
        api.get('/api/students'),
        api.get('/api/point-changes'),
        api.get('/api/certificates'),
        api.get('/api/violations'),
        api.get('/api/absence-requests'),
        api.get('/api/attendance-records'),
        api.get('/api/messages')
      ]);

      setUsers(usersData || []);
      setStudents(studentsData || []);
      setPointChanges(pointsData || []);
      setCertificates(certsData || []);
      setViolations(violsData || []);
      setAbsenceRequests(absenceData || []);
      setAttendanceRecords(attendanceData || []);
      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error fetching datasets from server', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAllData();
    }
  }, [currentUser]);

  // 2. Actions connected to Spring Boot REST Endpoints
  const login = async (email: string, password = 'password123') => {
    try {
      const response = await api.post('/api/public/auth/login', { email, password });
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setCurrentUser(response.user);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login action failed', e);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setUsers([]);
    setStudents([]);
    setPointChanges([]);
    setCertificates([]);
    setViolations([]);
    setAbsenceRequests([]);
    setAttendanceRecords([]);
    setMessages([]);
  };

  const updateCertificate = async (id: string, status: 'Approved'|'Rejected', points?: number, reason?: string) => {
    try {
      await api.put(`/api/certificates/${id}`, {
        status,
        pointsAwarded: points,
        rejectionReason: reason,
        approvedBy: currentUser?.name || 'Admin'
      });
      // Refresh datasets to sync adjusted scores
      await fetchAllData();
    } catch (e) {
      console.error('Failed to update certificate', e);
    }
  };

  const addPointChange = async (change: Omit<PointChange, 'id' | 'date'>) => {
    try {
      await api.post('/api/point-changes', change);
      await fetchAllData();
    } catch (e) {
      console.error('Failed to add point change', e);
    }
  };

  const addViolation = async (violation: Omit<Violation, 'id'>) => {
    try {
      await api.post('/api/violations', violation);
      await fetchAllData();
    } catch (e) {
      console.error('Failed to report violation', e);
    }
  };

  const updateAbsenceRequest = async (id: string, status: 'Approved' | 'Rejected', note?: string) => {
    try {
      await api.put(`/api/absence-requests/${id}`, { status, note });
      await fetchAllData();
    } catch (e) {
      console.error('Failed to update absence request', e);
    }
  };

  const addAbsenceRequest = async (req: Omit<AbsenceRequest, 'id'>) => {
    try {
      await api.post('/api/absence-requests', req);
      await fetchAllData();
    } catch (e) {
      console.error('Failed to submit absence request', e);
    }
  };

  const addCertificate = async (cert: Omit<Certificate, 'id'>) => {
    try {
      await api.post('/api/certificates', cert);
      await fetchAllData();
    } catch (e) {
      console.error('Failed to submit certificate', e);
    }
  };

  const submitAttendance = async (records: Omit<AttendanceRecord, 'id'>[]) => {
    try {
      await api.post('/api/attendance-records/batch', records);
      await fetchAllData();
    } catch (e) {
      console.error('Failed to submit attendance logs', e);
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      await api.put(`/api/users/${id}`, updates);
      await fetchAllData();
    } catch (e) {
      console.error('Failed to update user', e);
    }
  };

  const addUser = async (user: Omit<User, 'id'>) => {
    try {
      await api.post('/api/users', user);
      await fetchAllData();
    } catch (e) {
      console.error('Failed to create user account', e);
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      await api.put(`/api/students/${id}`, updates);
      await fetchAllData();
    } catch (e) {
      console.error('Failed to update student profile', e);
    }
  };

  const addMessage = async (message: Omit<Message, 'id' | 'timestamp' | 'date'>) => {
    try {
      await api.post('/api/messages', message);
      await fetchAllData();
    } catch (e) {
      console.error('Failed to send message', e);
    }
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
