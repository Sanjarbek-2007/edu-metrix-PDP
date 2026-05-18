import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  ShieldAlert, Plus, Search, Filter, MoreHorizontal, Eye, 
  CheckCircle2, User, ChevronDown, ChevronUp, AlertCircle, 
  TrendingDown, Info, Clock, AlertTriangle, X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'motion/react';

export default function Violations() {
  const { violations, students, addViolation } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [studentId, setStudentId] = useState('');
  const [type, setType] = useState('Tartibni buzish');
  const [severity, setSeverity] = useState<'Minor' | 'Moderate' | 'Serious'>('Minor');
  const [points, setPoints] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!studentId || !description) return;
    
    addViolation({
      studentId,
      type,
      severity,
      pointsDeducted: points,
      date,
      description,
      status: 'Open'
    });

    setIsModalOpen(false);
    setStudentId('');
    setDescription('');
    setPoints(1);
  };
  
  const stats = [
    { label: "Jami qoidabuzarlik", value: violations.length, icon: ShieldAlert, color: "text-[#0D1F1A]", bg: "bg-[#F3F4F6]" },
    { label: "Bugun", value: 2, icon: Clock, color: "text-[#D97706]", bg: "bg-[#FFFBEB]" },
    { label: "Jiddiy holatlar", value: violations.filter(v => v.severity === 'High').length, icon: AlertTriangle, color: "text-[#DC2626]", bg: "bg-[#FEF2F2]" },
    { label: "Hal qilingan", value: violations.filter(v => v.status === 'Resolved').length, icon: CheckCircle2, color: "text-[#0A9B82]", bg: "bg-[#EDF7F4]" },
  ];

  const filteredViolations = violations.filter(v => {
    const student = students.find(s => s.id === v.studentId);
    const studentName = student?.name || '';
    return studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           v.type.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'High': case 'Serious': return { dot: 'bg-[#DC2626]', text: 'Jiddiy', bg: 'bg-[#FEF2F2]', color: 'text-[#DC2626]' };
      case 'Medium': case 'Moderate': return { dot: 'bg-[#D97706]', text: 'O\'rta', bg: 'bg-[#FFFBEB]', color: 'text-[#D97706]' };
      default: return { dot: 'bg-[#9DB4AB]', text: 'Engil', bg: 'bg-[#F3F4F6]', color: 'text-[#374151]' };
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Open': return { dot: 'bg-[#D97706]', text: 'Ochiq' };
      case 'Resolved': return { dot: 'bg-[#0A9B82]', text: 'Hal qilingan' };
      default: return { dot: 'bg-[#2563EB]', text: 'Ko\'rib chiqilmoqda' };
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E8EFED]">
        <div>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Qoidabuzarliklar jurnali</h1>
          <p className="text-[13px] text-[#6B8A80] mt-1 font-medium">Talabalar xulq-atvori va intizomiy choralar monitoringi</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-4 bg-[#0A9B82] text-white rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-[#087D6A] shadow-lg shadow-[#0A9B82]/10 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Yangi qoidabuzarlik
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-[480px] bg-white rounded-2xl relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-8 py-6 border-b border-[#E8EFED] flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#0D1F1A]">Yangi qoidabuzarlik qo'shish</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-[#9DB4AB]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 pb-4 space-y-6 overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#0D1F1A]">Talaba:</label>
                  <select 
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full h-11 px-4 bg-[#F4F7F6] border-none rounded-xl text-[14px] font-medium text-[#0D1F1A] outline-none"
                  >
                    <option value="">Talabani tanlang...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.group})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#0D1F1A]">Qoidabuzarlik turi:</label>
                  <input 
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full h-11 px-4 bg-[#F4F7F6] border-none rounded-xl text-[14px] font-medium text-[#0D1F1A] outline-none"
                    placeholder="Masalan: Kechikish"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#0D1F1A]">Og'irlik darajasi:</label>
                    <select 
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as any)}
                      className="w-full h-11 px-4 bg-[#F4F7F6] border-none rounded-xl text-[14px] font-medium text-[#0D1F1A] outline-none"
                    >
                      <option value="Minor">Engil</option>
                      <option value="Moderate">O'rta</option>
                      <option value="Serious">Jiddiy</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#0D1F1A]">Jarima ballari:</label>
                    <input 
                      type="number"
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value))}
                      className="w-full h-11 px-4 bg-[#F4F7F6] border-none rounded-xl text-[14px] font-medium text-[#0D1F1A] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#0D1F1A]">Tavsif:</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 bg-[#F4F7F6] border-none rounded-xl text-[14px] font-medium text-[#0D1F1A] outline-none min-h-[100px] resize-none"
                    placeholder="Qoidabuzarlik tafsilotlari..."
                  />
                </div>
              </div>

              <div className="p-8 pt-4 grid grid-cols-2 gap-3 bg-white border-t border-[#E8EFED]">
                <button onClick={() => setIsModalOpen(false)} className="h-11 rounded-xl text-[14px] font-bold text-[#6B8A80] hover:bg-slate-50 border border-[#E8EFED]">Bekor qilish</button>
                <button onClick={handleCreate} className="h-11 rounded-xl text-[14px] font-bold bg-[#0A9B82] text-white hover:bg-[#087D6A] shadow-lg shadow-[#0A9B82]/10">Saqlash</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-[#E8EFED] shadow-[0_1px_4px_rgba(0,0,0,0.05)] flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", stat.bg, stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-extrabold text-[#0D1F1A] leading-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[14px] border border-[#E8EFED] shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-[#E8EFED] bg-[#F8FFFE] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DB4AB]" />
            <input 
              type="text" 
              placeholder="Talaba yoki qoida turi bo'yicha..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 h-10 bg-white border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#0A9B82]"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="h-10 px-4 flex items-center gap-2 text-xs font-bold text-[#374151] border border-[#D1D5DB] rounded-lg hover:bg-[#F3F4F6] transition-colors">
              <Filter className="w-4 h-4" /> Filtrlar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FFFE] text-[#9DB4AB] uppercase text-[11px] font-bold tracking-widest border-b border-[#E8EFED]">
              <tr>
                <th className="px-6 py-4">Sana</th>
                <th className="px-6 py-4">Talaba</th>
                <th className="px-6 py-4">Tur</th>
                <th className="px-6 py-4 text-center">Daraja</th>
                <th className="px-6 py-4 text-center">Jarima</th>
                <th className="px-6 py-4">Xabar bergan</th>
                <th className="px-6 py-4 text-center">Holat</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F3]">
              {filteredViolations.map((v) => {
                const student = students.find(s => s.id === v.studentId);
                const sev = getSeverityStyles(v.severity);
                const stat = getStatusStyles(v.status || 'Open');
                const isExpanded = expandedRow === v.id;

                return (
                  <React.Fragment key={v.id}>
                    <tr 
                      className={cn(
                        "hover:bg-[#F8FFFE] transition-colors cursor-pointer group border-l-4 border-transparent",
                        isExpanded ? "bg-[#F8FFFE] border-l-[#0A9B82]" : ""
                      )}
                      onClick={() => setExpandedRow(isExpanded ? null : v.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#0D1F1A]">{new Date(v.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                          <span className="text-[11px] text-[#9DB4AB] font-medium">{new Date(v.date).getFullYear()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#9DB4AB] font-bold text-xs">
                            {student?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[#0D1F1A] group-hover:text-[#0A9B82] transition-colors">{student?.name}</p>
                            <p className="text-[11px] text-[#9DB4AB] font-medium">{student?.year}-kurs · {student?.group}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] font-semibold text-[#0D1F1A]">{v.type === 'Late Night' ? 'Yotoqxona qoidasi' : v.type}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold", sev.bg, sev.color)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", sev.dot)} />
                          {sev.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-[#DC2626] font-bold text-[14px]">
                          <TrendingDown className="w-3.5 h-3.5" />
                          -{v.finePoints || v.pointsDeducted} ball
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-[#374151]">{v.reportedBy}</span>
                          <span className="text-[11px] text-[#9DB4AB] font-medium">Mas'ul xodim</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#374151]">
                          <span className={cn("w-2 h-2 rounded-full", stat.dot)} />
                          {stat.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 px-2 text-[#9DB4AB] hover:text-[#0D1F1A] transition-colors">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button onClick={(e) => e.stopPropagation()} className="p-1.5 text-[#9DB4AB] hover:text-[#0D1F1A] transition-all cursor-pointer">
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl border border-[#E8EFED] shadow-xl">
                              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#374151] rounded-lg cursor-pointer">
                                <Eye className="w-4 h-4 text-[#2563EB]" /> Ko'proq ma'lumot
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#374151] rounded-lg cursor-pointer">
                                <CheckCircle2 className="w-4 h-4 text-[#0A9B82]" /> Hal qilindi deb belgilash
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#374151] rounded-lg cursor-pointer">
                                <User className="w-4 h-4 text-[#D97706]" /> Profilga o'tish
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="p-0 border-none">
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-[#FBFDFD]"
                            >
                              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[#E8EFED]">
                                <div className="space-y-4">
                                  <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-[#9DB4AB] mt-0.5" />
                                    <div>
                                      <p className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider mb-1">Tavsif:</p>
                                      <p className="text-[13px] text-[#374151] leading-relaxed font-medium">{v.description || "Talaba belgilangan qoidalarni buzganligi qayd etildi."}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-[#9DB4AB] mt-0.5" />
                                    <div>
                                      <p className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider mb-1">Admin izohi:</p>
                                      <p className="text-[13px] text-[#6B8A80] italic leading-relaxed">Talaba bilan suhbat o'tkazildi. {v.finePoints || v.pointsDeducted} ball ayirildi. Takrorlansa jiddiy chora ko'riladi.</p>
                                    </div>
                                  </div>
                                  <div className="pt-2 flex gap-3">
                                    <button className="h-9 px-4 bg-white border border-[#E8EFED] text-[#0A9B82] rounded-lg text-xs font-bold hover:bg-[#F8FFFE] transition-colors">
                                      Tahrirlash
                                    </button>
                                    <button className="h-9 px-6 bg-[#0A9B82] text-white rounded-lg text-xs font-bold hover:bg-[#087D6A] transition-colors">
                                      Hal qilindi deb belgilash
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
