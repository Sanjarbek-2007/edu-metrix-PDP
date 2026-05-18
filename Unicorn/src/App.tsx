import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Login from './pages/auth/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Super Admin
import SADashboard from './pages/superadmin/Dashboard';
import SAStudents from './pages/superadmin/Students';
import SAGroups from './pages/superadmin/Groups';
import SAStudentList from './pages/superadmin/StudentList';
import SALmsIntegration from './pages/superadmin/LmsIntegration';
import SASettings from './pages/superadmin/Settings';
import SAGrants from './pages/superadmin/Grants';
import SAReports from './pages/superadmin/Reports';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminStudentProfile from './pages/admin/StudentProfile';
import AdminCertificates from './pages/admin/Certificates';
import AdminViolations from './pages/admin/Violations';
import AdminMessages from './pages/admin/Messages';

// Commandant
import ComDashboard from './pages/commandant/Dashboard';
import ComAttendance from './pages/commandant/Attendance';
import ComViolations from './pages/commandant/Violations';
import ComAbsenceRequests from './pages/commandant/AbsenceRequests';
import ComStudents from './pages/commandant/Students';

// Student
import StudentDashboard from './pages/student/Dashboard';
import StudentScores from './pages/student/Scores';
import StudentCertificates from './pages/student/Certificates';
import StudentAbsence from './pages/student/AbsenceRequest';
import StudentProfile from './pages/student/Profile';

export default function App() {
  const { currentUser } = useAppContext();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Root redirect */}
      <Route path="/" element={
        currentUser ? (
          <Navigate to={`/${currentUser.role.toLowerCase()}/dashboard`} replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/* Super Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['SuperAdmin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/superadmin/dashboard" element={<SADashboard />} />
          <Route path="/superadmin/students" element={<SAStudents />} />
          <Route path="/superadmin/students/year/:year" element={<SAGroups />} />
          <Route path="/superadmin/students/year/:year/group/:group" element={<SAStudentList />} />
          <Route path="/superadmin/students/profile/:id" element={<AdminStudentProfile />} />
          <Route path="/superadmin/grants" element={<SAGrants />} />
          <Route path="/superadmin/reports" element={<SAReports />} />
          <Route path="/superadmin/lms-integration" element={<SALmsIntegration />} />
          <Route path="/superadmin/settings" element={<SASettings />} />
          {/* Missing ones map to dashboard for now */}
          <Route path="/superadmin/*" element={<Navigate to="/superadmin/dashboard" replace />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/students/profile/:id" element={<AdminStudentProfile />} />
          <Route path="/admin/certificates" element={<AdminCertificates />} />
          <Route path="/admin/violations" element={<AdminViolations />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Route>

      {/* Commandant Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Commandant']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/commandant/dashboard" element={<ComDashboard />} />
          <Route path="/commandant/attendance" element={<ComAttendance />} />
          <Route path="/commandant/violations" element={<ComViolations />} />
          <Route path="/commandant/absence-requests" element={<ComAbsenceRequests />} />
          <Route path="/commandant/students" element={<ComStudents />} />
          <Route path="/commandant/*" element={<Navigate to="/commandant/dashboard" replace />} />
        </Route>
      </Route>

      {/* Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/scores" element={<StudentScores />} />
          <Route path="/student/certificates" element={<StudentCertificates />} />
          <Route path="/student/absence" element={<StudentAbsence />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/*" element={<Navigate to="/student/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
