import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { LogOut, Menu, X, Bell, LayoutDashboard, Users, Award, FileText, Settings, ShieldAlert, GraduationCap, Clock, MessageSquare, Link as LinkIcon, AlertTriangle, User as UserIcon, ChevronDown, Calendar, Trophy, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Role } from '../../types';
import * as Popover from '@radix-ui/react-popover';

import GlobalSearch from '../ui/GlobalSearch';
import NotificationCenter from '../ui/NotificationCenter';
import ActivitySidebar from '../ui/ActivitySidebar';

interface SidebarLink {
  name: string;
  path: string;
  icon: React.ElementType;
}

const roleLinks: Record<Role, SidebarLink[]> = {
  SuperAdmin: [
    { name: 'Dashboard', path: '/superadmin/dashboard', icon: LayoutDashboard },
    { name: 'Talabalar', path: '/superadmin/students', icon: Users },
    { name: 'Grantlar', path: '/superadmin/grants', icon: Award },
    { name: 'Hisobotlar', path: '/superadmin/reports', icon: FileText },
    { name: 'Reyting', path: '/superadmin/rating', icon: Trophy },
    { name: 'LMS Integratsiya', path: '/superadmin/lms-integration', icon: LinkIcon },
    { name: 'Sozlamalar', path: '/superadmin/settings', icon: Settings },
  ],
  Admin: [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Talabalar', path: '/admin/students', icon: Users },
    { name: 'Sertifikatlar', path: '/admin/achievements', icon: Award },
    { name: 'Qoidabuzarliklar', path: '/admin/violations', icon: ShieldAlert },
    { name: 'Xabarlar', path: '/admin/messages', icon: MessageSquare },
  ],
  Commandant: [
    { name: 'Dashboard', path: '/commandant/dashboard', icon: LayoutDashboard },
    { name: 'Davomat', path: '/commandant/attendance', icon: Clock },
    { name: 'Qoidabuzarliklar', path: '/commandant/violations', icon: ShieldAlert },
    { name: 'Ruxsat so\'rovlari', path: '/commandant/absence-requests', icon: FileText },
    { name: 'Talabalar', path: '/commandant/students', icon: Users },
  ],
  Student: [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Mening ballarim', path: '/student/scores', icon: Award },
    { name: 'Yutuqlarim', path: '/student/achievements', icon: FileText },
    { name: 'Ruxsat so\'rovi', path: '/student/absence', icon: Calendar },
    { name: 'Profil', path: '/student/profile', icon: UserIcon },
  ],
  Mentor: [
    { name: 'Dashboard', path: '/mentor/dashboard', icon: LayoutDashboard },
    { name: 'Mening talabalarim', path: '/mentor/students', icon: Users },
    { name: 'Baholash tarixi', path: '/mentor/evaluations', icon: Star },
    { name: 'Xabarlar', path: '/mentor/messages', icon: MessageSquare },
  ],
};

function UserMenu() {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SuperAdmin': return 'bg-[#0A9B82]';
      case 'Admin': return 'bg-[#06B6D4]';
      case 'Commandant': return 'bg-[#FFB800]';
      case 'Student': return 'bg-[#6C63FF]';
      case 'Mentor': return 'bg-rose-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-all outline-none group ring-2 ring-transparent hover:ring-emerald-500/20">
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow-sm transition-all",
            getRoleColor(currentUser.role)
          )}>
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-data-[state=open]:rotate-180 transition-transform" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          align="end" 
          sideOffset={8}
          className="w-64 bg-[#1C2B27] border border-emerald-500/20 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="p-4 border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-3">
               <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                getRoleColor(currentUser.role)
              )}>
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white truncate text-sm">{currentUser.name}</p>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{currentUser.role}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
              </div>
            </div>
          </div>
          <div className="p-2 space-y-0.5">
            <button 
              onClick={() => navigate(currentUser.role === 'Student' ? '/student/profile' : `/${currentUser.role.toLowerCase()}/settings`)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm group"
            >
              <UserIcon className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
              <span>Profilim</span>
            </button>
            <button 
              onClick={() => navigate(`/${currentUser.role.toLowerCase()}/settings`)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm group"
            >
              <Settings className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
              <span>Sozlamalar</span>
            </button>
            <div className="h-px bg-white/5 my-1 mx-2" />
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all text-sm group"
            >
              <LogOut className="w-4 h-4" />
              <span>Tizimdan chiqish</span>
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default function DashboardLayout() {
  const { currentUser, logout, absenceRequests, students, mentors } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentUser) return null; // Or redirect

  const links = roleLinks[currentUser.role as Role] || [];
  const pendingRequests = absenceRequests.filter(r => r.status === 'Pending').length;

  let mentorPendingCount = 0;
  if (currentUser.role === 'Mentor') {
    const myMentor = mentors?.find(m => m.email === currentUser.email);
    const myStudents = myMentor 
      ? students.filter(s => myMentor.assignedStudents.includes(s.id))
      : students.filter(s => s.year <= 2);
    
    mentorPendingCount = myStudents.filter(s => {
      const lastDate = s.scores.tyutorBahosi?.lastEvaluatedAt;
      if (!lastDate) return true;
      const diffDays = Math.abs(new Date().getTime() - new Date(lastDate).getTime()) / (1000 * 3600 * 24);
      return diffDays > 30;
    }).length;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background text-text-primary overflow-hidden">
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-[240px] bg-gradient-to-b from-[#0A6B59] to-[#087A66] transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col shadow-2xl",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center px-6 border-b border-white/10 mb-2">
          <GraduationCap className="h-8 w-8 text-white mr-3" />
          <span className="text-xl font-black font-sans tracking-tight text-white uppercase italic">EduMetric</span>
          <button className="ml-auto lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5 text-white/70" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg text-[14px] font-medium transition-all duration-200 group mx-2 relative",
                  isActive
                    ? "bg-white/15 text-white backdrop-blur-md shadow-sm"
                    : "text-white/60 hover:bg-white/10 hover:text-white/90"
                )}
              >
                <Icon className={cn("flex-shrink-0 h-5 w-5 mr-3 transition-colors", isActive ? "text-white" : "text-emerald-100 group-hover:text-white")} />
                {link.name}
                {link.name === 'Ruxsat so\'rovlari' && pendingRequests > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#FFB800] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {pendingRequests}
                  </span>
                )}
                {link.name === 'Mening talabalarim' && mentorPendingCount > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#D97706] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {mentorPendingCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="mt-auto p-4 border-t border-white/10">
          <div className="bg-black/15 rounded-xl border border-white/5 p-3 flex items-center gap-3 group transition-all hover:bg-black/20">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white font-black border border-white/10 group-hover:scale-105 transition-transform">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-bold truncate text-white leading-tight">{currentUser.name}</span>
              <span className="text-[10px] uppercase tracking-widest text-emerald-300/80 font-bold mt-0.5">{currentUser.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-all"
              title="Chiqish"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-background">
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-sm">
          <button
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 mr-4 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 flex justify-between items-center gap-6">
            <div className="max-w-md w-full">
              <GlobalSearch />
            </div>
            <div className="flex justify-end items-center gap-4">
              <NotificationCenter />
              <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 w-full max-w-7xl mx-auto custom-scrollbar">
          <Outlet />
        </div>
      </main>
      <ActivitySidebar />
    </div>
  );
}
