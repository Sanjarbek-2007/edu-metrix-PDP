import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ChevronRight, Search, Eye, AlertCircle, MessageSquare, MoreVertical, ShieldAlert, Award, Sparkles, Brain, Star, Users } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const getAvatarGradient = (name: string) => {
  const firstLetter = name.charAt(0).toUpperCase();
  if (firstLetter >= 'A' && firstLetter <= 'D') return 'linear-gradient(135deg,#0A9B82,#06D6A0)';
  if (firstLetter >= 'E' && firstLetter <= 'H') return 'linear-gradient(135deg,#2563EB,#60A5FA)';
  if (firstLetter >= 'I' && firstLetter <= 'L') return 'linear-gradient(135deg,#7C3AED,#A78BFA)';
  if (firstLetter >= 'M' && firstLetter <= 'P') return 'linear-gradient(135deg,#D97706,#FCD34D)';
  if (firstLetter >= 'Q' && firstLetter <= 'T') return 'linear-gradient(135deg,#DC2626,#F87171)';
  return 'linear-gradient(135deg,#0891B2,#67E8F9)';
};

export default function StudentList() {
  const { year, group } = useParams();
  const navigate = useNavigate();
  const { students } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');
  const [sortBy, setSortBy] = useState('Score ↓');
  const [studentToFlag, setStudentToFlag] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const yearNum = parseInt(year || '1');
  const yearOrdinals = ['1-kurs', '2-kurs', '3-kurs', '4-kurs'];
  const yearLabel = yearOrdinals[yearNum - 1];

  let filtered = students.filter(s => s.year === yearNum && (s.group === group || (!s.group && group === 'Unassigned')));

  if (searchTerm) {
    const lower = searchTerm.toLowerCase();
    filtered = filtered.filter(s => {
      const name = s.name || '';
      const studentId = s.studentId || '';
      return name.toLowerCase().includes(lower) || studentId.toLowerCase().includes(lower);
    });
  }

  if (filterRisk !== 'All') {
    filtered = filtered.filter(s => s.riskStatus === filterRisk);
  }

  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'Score ↑': return a.totalScore - b.totalScore;
      case 'Score ↓': return b.totalScore - a.totalScore;
      case 'Name A-Z': return a.name.localeCompare(b.name);
      case 'Risk Level': {
        const riskVal = (r: string) => r === 'Danger' ? 3 : r === 'At Risk' ? 2 : 1;
        return riskVal(b.riskStatus) - riskVal(a.riskStatus);
      }
      default: return 0;
    }
  });

  const confirmFlagStudent = () => {
    toast.success('Talaba belgilandi va komendantga xabar berildi.');
    setStudentToFlag(null);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/superadmin/students" className="hover:text-primary transition-colors">Talabalar</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/superadmin/students/year/${year}`} className="hover:text-primary transition-colors">{yearLabel}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-text-primary font-medium">{group}-guruh</span>
      </div>

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="page-title">{group}-guruh talabalari</h1>
          <p className="text-text-secondary text-sm">{filtered.length} ta o'quvchi topildi</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="relative w-full xl:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Qidiruv (ism yoki ID)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-dark-900 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <select 
            value={filterRisk} 
            onChange={e => setFilterRisk(e.target.value)}
            className="bg-dark-900 border border-border rounded-lg py-2 px-3 text-sm text-text-primary focus:outline-none focus:border-primary/50 cursor-pointer"
          >
            <option value="All">Barcha holat</option>
            <option value="Safe">Xavfsiz</option>
            <option value="At Risk">Xatarda</option>
            <option value="Danger">Yuqori xatar</option>
          </select>

          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            className="bg-dark-900 border border-border rounded-lg py-2 px-3 text-sm text-text-primary focus:outline-none focus:border-primary/50 cursor-pointer"
          >
            <option value="Score ↓">Ball kamayishi</option>
            <option value="Score ↑">Ball ko'payishi</option>
            <option value="Name A-Z">Ism A-Z</option>
            <option value="Risk Level">Xatar darajasi</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-[#E8EFED] rounded-[16px] overflow-hidden shadow-sm mt-6">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F8FFFE] text-[#9DB4AB] border-b border-[#E8EFED] text-[11px] uppercase font-extrabold tracking-widest">
                <th className="px-6 py-4">Student Info</th>
                <th className="px-6 py-4">Year/Group</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4 text-center">Grant</th>
                <th className="px-6 py-4 text-center">Risk</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F3] relative">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#F8FFFE] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-[12px]">
                      <div 
                        className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-white text-[15px] font-bold shadow-sm"
                        style={{ background: getAvatarGradient(s.name) }}
                      >
                        {getInitials(s.name)}
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#0D1F1A]">{s.name}</p>
                        <p className="text-[12px] text-[#9DB4AB]">{s.studentId || `STU-${s.id.substring(0, 4)}`}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-[#F0F4F3] text-[#374151] rounded-[6px] px-[10px] py-[4px] text-[13px] font-medium font-mono">
                      {s.year}-kurs · {s.group}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-baseline gap-0.5">
                        <span className={cn(
                          "text-[18px] font-bold",
                          s.totalScore >= 85 ? "text-[#0A9B82]" : s.totalScore >= 75 ? "text-[#D97706]" : "text-[#DC2626]"
                        )}>
                          {s.totalScore}
                        </span>
                        <span className="text-[12px] text-[#9DB4AB] font-normal">/100</span>
                      </div>
                      <div className="w-[64px] h-[4px] bg-[#F0F4F3] rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            s.totalScore >= 85 ? "bg-[#0A9B82]" : s.totalScore >= 75 ? "bg-[#D97706]" : "bg-[#DC2626]"
                          )}
                          style={{ width: `${s.totalScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {s.grantType === 'Unicorn' ? (
                        <div className="bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] rounded-[20px] px-[12px] py-[4px] text-[12px] font-bold flex items-center gap-[5px]">
                          <Sparkles className="w-[12px] h-[12px]" /> Unicorn
                        </div>
                      ) : s.grantType === 'Golden Mind' ? (
                        <div className="bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] rounded-[20px] px-[12px] py-[4px] text-[12px] font-bold flex items-center gap-[5px]">
                          <Brain className="w-[12px] h-[12px]" /> Golden Mind
                        </div>
                      ) : s.grantType === 'Candidate' ? (
                        <div className="bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] rounded-[20px] px-[12px] py-[4px] text-[12px] font-bold flex items-center gap-[5px]">
                          <Star className="w-[12px] h-[12px]" /> Candidate
                        </div>
                      ) : (
                        <div className="bg-[#F9FAFB] text-[#9DB4AB] border border-[#E5E7EB] rounded-[20px] px-[12px] py-[4px] text-[12px] font-bold">
                          —
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className={cn(
                        "rounded-[20px] px-[12px] py-[4px] text-[12px] font-bold border flex items-center gap-2",
                        s.riskStatus === 'Safe' ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]" :
                        s.riskStatus === 'At Risk' ? "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]" :
                        "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]"
                      )}>
                        <div className={cn(
                          "w-[6px] h-[6px] rounded-full",
                          s.riskStatus === 'Safe' ? "bg-[#059669]" :
                          s.riskStatus === 'At Risk' ? "bg-[#D97706]" :
                          "bg-[#DC2626]"
                        )} />
                        {s.riskStatus}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-[6px] relative">
                      <button 
                        onClick={() => navigate(`/superadmin/students/profile/${s.id}`)}
                        className="h-[32px] px-[14px] bg-white border border-[#D1D5DB] rounded-[8px] text-[13px] font-medium text-[#374151] flex items-center gap-[6px] hover:border-[#0A9B82] hover:text-[#0A9B82] hover:bg-[rgba(10,155,130,0.04)] transition-all cursor-pointer"
                      >
                        <Eye className="w-[14px] h-[14px]" /> Ko'rish
                      </button>
                      
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button 
                            className="w-[32px] h-[32px] bg-white border border-[#D1D5DB] rounded-[8px] flex items-center justify-center hover:bg-[#F9FAFB] transition-all outline-none"
                          >
                            <MoreVertical className="w-[16px] h-[16px] text-[#6B7280]" />
                          </button>
                        </DropdownMenu.Trigger>
                        
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content 
                            align="end" 
                            sideOffset={5}
                            className="bg-white border border-[#E5E7EB] rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-1 z-[100] min-w-[190px] animate-in fade-in zoom-in-95"
                          >
                            <DropdownMenu.Item 
                              onClick={() => navigate('/admin/messages')} 
                              className="flex items-center gap-[10px] p-[9px_12px] rounded-[7px] text-[13px] text-[#374151] hover:bg-[#F8FFFE] hover:text-[#0A9B82] cursor-pointer outline-none"
                            >
                              <MessageSquare className="w-4 h-4" /> Xabar yuborish
                            </DropdownMenu.Item>
                            <DropdownMenu.Item 
                              onClick={() => setStudentToFlag(s.id)}
                              className="flex items-center gap-[10px] p-[9px_12px] rounded-[7px] text-[13px] text-[#374151] hover:bg-[#F8FFFE] hover:text-[#0A9B82] cursor-pointer outline-none"
                            >
                              <ShieldAlert className="w-4 h-4" /> Jarima qo'shish
                            </DropdownMenu.Item>
                            <DropdownMenu.Item 
                              onClick={() => toast.success('Grant holati oynasi')}
                              className="flex items-center gap-[10px] p-[9px_12px] rounded-[7px] text-[13px] text-[#374151] hover:bg-[#F8FFFE] hover:text-[#0A9B82] cursor-pointer outline-none"
                            >
                              <Award className="w-4 h-4" /> Grant holati
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-24">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-[48px] h-[48px] bg-[#F0F4F3] rounded-full flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-[#D1D5DB]" />
                      </div>
                      <p className="text-[16px] font-bold text-[#6B8A80]">
                        {students.filter(s => s.year === yearNum && (s.group === group || (!s.group && group === 'Unassigned'))).length === 0 
                          ? "Bu guruhda hali o'quvchi yo'q" 
                          : "O'quvchi topilmadi"}
                      </p>
                      <p className="text-[13px] text-[#9DB4AB] mt-[6px]">Qidiruv yoki filtrni o'zgartiring</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!studentToFlag}
        onClose={() => setStudentToFlag(null)}
        onConfirm={confirmFlagStudent}
        title="Talabani belgilash"
        message="Haqiqatan ham bu talabani belgilamoqchimisiz? Bu komendant va ma'murlarga darhol ko'rib chiqish uchun xabar yuboradi."
        confirmText="Belgilash"
        isDestructive={true}
      />
    </div>
  );
}
