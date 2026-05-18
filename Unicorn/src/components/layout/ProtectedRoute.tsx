import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Role } from '../../types';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role as Role)) {
    // Redirect to their default dashboard
    const defaultPaths: Record<Role, string> = {
      SuperAdmin: '/superadmin/dashboard',
      Admin: '/admin/dashboard',
      Commandant: '/commandant/dashboard',
      Student: '/student/dashboard',
    };
    return <Navigate to={defaultPaths[currentUser.role as Role] || '/login'} replace />;
  }

  return <Outlet />;
}
