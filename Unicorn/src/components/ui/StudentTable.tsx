import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../../types';
import { Search, Filter, MoreHorizontal, ShieldAlert, Award, Sparkles, Brain, Eye, MessageSquare, FileCheck, Users, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface StudentTableProps {
  students: Student[];
  onRowClick?: (id: string) => void;
  initialFilter?: string;
}

export default function StudentTable({ students, onRowClick, initialFilter }: StudentTableProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>(initialFilter === 'risk' ? 'Risk' : 'All');
  
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const name = s.name || '';
      const email = s.email || '';
      const studentId = s.studentId || '';

      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           studentId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesYear = filterYear === 'All' || s.year.toString() === filterYear;
      
      let matchesStatus = true;
      if (filterStatus === 'Risk') {
        matchesStatus = s.riskStatus === 'At Risk' || s.riskStatus === 'Danger';
      } else if (filterStatus === 'Safe') {
        matchesStatus = s.riskStatus === 'Safe';
      } else if (filterStatus === 'At Risk') {
        matchesStatus = s.riskStatus === 'At Risk';
      } else if (filterStatus === 'Danger') {
        matchesStatus = s.riskStatus === 'Danger';
      }

      return matchesSearch && matchesYear && matchesStatus;
    });
  }, [students, searchTerm, filterYear, filterStatus]);

  return (
    <div className="bg-white rounded-[14px] flex flex-col h-full border border-[#E8EFED] shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Search & Filters */}
      <div className="p-5 border-b border-[#E8EFED] bg-[#F8FFFE] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DB4AB]" />
          <input 
            type="text" 
            placeholder="Qidirish (ism, ID, email)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 h-10 bg-white border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#0A9B82] focus:ring-3 focus:ring-[#0A9B82]/10 transition-all text-[#0D1F1A]"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative min-w-[140px]">
            <select 
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full h-10 pl-3 pr-9 bg-white border border-[#D1D5DB] rounded-lg text-[13px] font-medium appearance-none cursor-pointer focus:outline-none focus:border-[#0A9B82]"
            >
              <option value="All">Barcha kurslar</option>
              <option value="1">1-kurs</option>
              <option value="2">2-kurs</option>
              <option value="3">3-kurs</option>
              <option value="4">4-kurs</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DB4AB] pointer-events-none" />
          </div>

          <div className="relative min-w-[140px]">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full h-10 pl-3 pr-9 bg-white border border-[#D1D5DB] rounded-lg text-[13px] font-medium appearance-none cursor-pointer focus:outline-none focus:border-[#0A9B82]"
            >
              <option value="All">Barcha holat</option>
              <option value="Safe">Safe</option>
              <option value="At Risk">At Risk</option>
              <option value="Danger">Danger</option>
              <option value="Risk">Risk + Danger</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DB4AB] pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar flex-1">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#F8FFFE] text-[#9DB4AB] border-b border-[#E8EFED] uppercase text-[11px] font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">F.I.SH. / Ma'lumot</th>
              <th className="px-6 py-4 text-center">Kurs</th>
              <th className="px-6 py-4 text-center">Ball</th>
              <th className="px-6 py-4 text-center">Grant</th>
              <th className="px-6 py-4 text-center">Xavf</th>
              <th className="px-6 py-4 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F4F3]">
            {filteredStudents.map(student => (
              <tr 
                key={student.id} 
                onClick={(e) => {
                  // Direct click on row, not on action buttons
                  const target = e.target as HTMLElement;
                  if (!target.closest('button')) {
                    onRowClick?.(student.id);
                  }
                }}
                className="hover:bg-[#F8FFFE] transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0A9B82] to-[#0A9B82]/70 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {student.name ? student.name.split(' ').map(n => n[0]).join('') : '??'}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="font-bold text-[#0D1F1A] group-hover:text-[#0A9B82] transition-colors leading-tight truncate">{student.name || 'Noma\'lum talaba'}</p>
                      <p className="text-[11px] text-[#9DB4AB] font-medium leading-tight mt-1">{student.studentId} · {student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-[#F3F4F6] text-[#374151] font-bold text-[11px]">
                    {student.year}-kurs
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className={cn(
                      "font-extrabold text-base",
                      student.totalScore < 80 ? "text-[#DC2626]" : "text-[#0D1F1A]"
                    )}>
                      {student.totalScore}
                    </span>
                    {student.totalScore < 80 && (
                      <span className="text-[9px] font-black uppercase text-[#DC2626]">{student.riskStatus}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {student.grantType === 'Unicorn' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EDF7F4] text-[#0A9B82] border border-[#0A9B82]/20">
                      <Sparkles className="w-3 h-3" /> {student.grantType}
                    </span>
                  )}
                  {student.grantType === 'Golden Mind' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFFBEB] text-[#D97706] border border-[#D97706]/20">
                      <Brain className="w-3 h-3" /> {student.grantType}
                    </span>
                  )}
                  {student.grantType === 'None' && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F3F4F6] text-[#6B8A80]">
                      Nomzod
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={cn(
                    "inline-flex justify-center items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider min-w-[70px] border",
                    student.riskStatus === 'Safe' ? "bg-[#EDF7F4] text-[#0A9B82] border-[#0A9B82]/20" : 
                    student.riskStatus === 'At Risk' ? "bg-[#FFFBEB] text-[#D97706] border-[#D97706]/20" : 
                    "bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/20"
                  )}>
                    {student.riskStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onRowClick?.(student.id)}
                      className="h-8 px-3 bg-white border border-[#D1D5DB] text-[#374151] rounded-lg text-xs font-bold flex items-center gap-1.5 hover:border-[#0A9B82] hover:text-[#0A9B82] transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Ko'rish
                    </button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 text-[#9DB4AB] hover:text-[#0D1F1A] hover:bg-[#F3F4F6] rounded-lg transition-all cursor-pointer">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl border border-[#E8EFED] shadow-xl">
                        <DropdownMenuItem onClick={() => navigate('/admin/messages')} className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#374151] rounded-lg cursor-pointer">
                          <MessageSquare className="w-4 h-4 text-[#2563EB]" /> Xabar yuborish
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/violations')} className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#374151] rounded-lg cursor-pointer">
                          <ShieldAlert className="w-4 h-4 text-[#DC2626]" /> Jarima qo'shish
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/certificates')} className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#374151] rounded-lg cursor-pointer">
                          <FileCheck className="w-4 h-4 text-[#0A9B82]" /> Sertifikatlar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRowClick?.(student.id)} className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#374151] rounded-lg cursor-pointer">
                          <Award className="w-4 h-4 text-[#D97706]" /> Grant holati
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredStudents.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-[#9DB4AB]" />
            </div>
            <h4 className="text-[15px] font-bold text-[#0D1F1A]">O'quvchi topilmadi</h4>
            <p className="text-[13px] text-[#6B8A80] mt-1 max-w-[240px]">Qidiruv yoki filtrni o'zgartirib ko'ring</p>
          </div>
        )}
      </div>
    </div>
  );
}
