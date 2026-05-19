import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  ShieldAlert, Plus, Search, Filter, 
  MapPin, TrendingDown, Eye, CheckCircle, 
  X, Upload, Calendar
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

export default function Violations() {
  const { students, violations, addViolation } = useAppContext();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('Barcha');
  const [filterStatus, setFilterStatus] = useState('Barcha');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [studentId, setStudentId] = useState('');
  const [type, setType] = useState('Tunda tashqarida qolish');
  const [severity, setSeverity] = useState<'Minor' | 'Moderate' | 'Serious'>('Minor');
  const [points, setPoints] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (location.state?.studentId) {
      setStudentId(location.state.studentId);
      setShowModal(true);
    }
  }, [location.state]);

  const dormStudents = students.filter(s => s.roomNumber);
  
  const stats = [
    { label: 'Bu oy', value: violations.length },
    { label: 'Jami (semester)', value: violations.length + 4 },
    { label: 'Ball ayirildi', value: -violations.reduce((acc, v) => acc + v.pointsDeducted, 0), color: 'text-[#DC2626]' },
    { label: 'Hal qilingan', value: Math.floor(violations.length * 0.7) },
  ];

  const handleAddViolation = () => {
    if (!studentId || !description) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    addViolation({
      studentId,
      type,
      severity,
      pointsDeducted: points,
      date,
      description,
      status: 'Ochiq'
    });

    setShowModal(false);
    setStudentId('');
    setDescription('');
    setPoints(1);
    setSeverity('Minor');
    toast.success("⚠️ Qoidabuzarlik qayd etildi.");
  };

  const filteredViolations = violations.filter(v => {
    const student = students.find(s => s.id === v.studentId);
    if (!student?.roomNumber) return false;
    
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'Barcha' || 
                            (filterSeverity === 'Engil' && v.severity === 'Minor') ||
                            (filterSeverity === 'O\'rta' && v.severity === 'Moderate') ||
                            (filterSeverity === 'Jiddiy' && v.severity === 'Serious');
    
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Qoidabuzarliklar</h1>
          <p className="text-[13px] text-[#6B8A80] font-medium mt-0.5">Yotoqxona intizom nazorati</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="h-11 px-6 bg-[#0A9B82] text-white rounded-xl text-[14px] font-bold flex items-center gap-2 hover:bg-[#087D6A] transition-all shadow-lg shadow-[#0A9B82]/20"
        >
          <Plus className="w-5 h-5" /> Yangi qoidabuzarlik
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[14px] border border-[#E8EFED] shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <p className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider mb-2">{stat.label}</p>
            <p className={cn("text-2xl font-black text-[#0D1F1A]", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[14px] border border-[#E8EFED] shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-4 border-b border-[#E8EFED] flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9DB4AB]" />
            <input 
              type="text" 
              placeholder="Talaba ismi bo'yicha qidirish..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 h-10 bg-[#F4F7F6] border-none rounded-lg text-[13px] outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="h-10 px-3 bg-[#F4F7F6] border-none rounded-lg text-[13px] font-medium text-[#0D1F1A] outline-none min-w-[120px]"
            >
              <option value="Barcha">Barcha darajalar</option>
              <option value="Engil">Engil</option>
              <option value="O'rta">O'rta</option>
              <option value="Jiddiy">Jiddiy</option>
            </select>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 px-3 bg-[#F4F7F6] border-none rounded-lg text-[13px] font-medium text-[#0D1F1A] outline-none min-w-[120px]"
            >
              <option value="Barcha">Barcha holatlar</option>
              <option value="Ochiq">Ochiq</option>
              <option value="Hal qilingan">Hal qilingan</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FFFE] border-b border-[#E8EFED]">
                <th className="px-6 py-4 text-[11px] font-black text-[#9DB4AB] uppercase tracking-wider">SANA</th>
                <th className="px-6 py-4 text-[11px] font-black text-[#9DB4AB] uppercase tracking-wider">TALABA (+ XONA)</th>
                <th className="px-6 py-4 text-[11px] font-black text-[#9DB4AB] uppercase tracking-wider">TUR</th>
                <th className="px-6 py-4 text-[11px] font-black text-[#9DB4AB] uppercase tracking-wider">DARAJA</th>
                <th className="px-6 py-4 text-[11px] font-black text-[#9DB4AB] uppercase tracking-wider">JARIMA</th>
                <th className="px-6 py-4 text-[11px] font-black text-[#9DB4AB] uppercase tracking-wider">HOLAT</th>
                <th className="px-6 py-4 text-[11px] font-black text-[#9DB4AB] uppercase tracking-wider">AMALLAR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F3]">
              {filteredViolations.map((v) => {
                const student = students.find(s => s.id === v.studentId);
                const date = new Date(v.date);
                return (
                  <tr key={v.id} className="hover:bg-[#F8FFFE] transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-bold text-[#0D1F1A]">
                        {date.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short' })}
                      </p>
                      <p className="text-[11px] text-[#9DB4AB] font-medium uppercase mt-0.5">
                        {date.getFullYear()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A9B82] to-[#0A9B82]/70 flex items-center justify-center text-white text-[11px] font-bold">
                          {student?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[#0D1F1A]">{student?.name}</p>
                          <p className="text-[11px] text-[#6B8A80] font-medium flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#0A9B82]" /> {student?.roomNumber}-xona
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-bold text-[#0D1F1A]">{v.type}</p>
                    </td>
                    <td className="px-6 py-4">
                      <SeverityBadge severity={v.severity} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-[#DC2626] font-bold text-[13px]">
                        <TrendingDown className="w-4 h-4" />
                        -{v.pointsDeducted} ball
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status="Hal qilingan" /> {/* Mocking all as resolved for now */}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-[#6B8A80] hover:bg-white rounded-lg transition-all border border-transparent hover:border-[#E8EFED]">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-[#0A9B82] hover:bg-white rounded-lg transition-all border border-transparent hover:border-[#E8EFED]">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-[480px] bg-white rounded-2xl relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-8 py-6 border-b border-[#E8EFED] flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#0D1F1A]">Qoidabuzarlik bildirish</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-[#9DB4AB]">
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
                    {dormStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.name} — {s.roomNumber}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#0D1F1A]">Qoidabuzarlik turi:</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full h-11 px-4 bg-[#F4F7F6] border-none rounded-xl text-[14px] font-medium text-[#0D1F1A] outline-none"
                  >
                    <option value="Tunda tashqarida qolish">Tunda tashqarida qolish</option>
                    <option value="Ruxsatsiz mehmon olib kirish">Ruxsatsiz mehmon olib kirish</option>
                    <option value="Yotoqxona tartibini buzish">Yotoqxona tartibini buzish</option>
                    <option value="Shovqin-suron">Shovqin-suron</option>
                    <option value="Mulkka zarar yetkazish">Mulkka zarar yetkazish</option>
                    <option value="Boshqa">Boshqa</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#0D1F1A]">Og'irlik darajasi:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { l: 'Engil -1', v: 'Minor', p: 1 },
                      { l: 'O\'rta -3', v: 'Moderate', p: 3 },
                      { l: 'Jiddiy -5', v: 'Serious', p: 5 }
                    ].map((d) => (
                      <button 
                        key={d.v} 
                        type="button"
                        onClick={() => {
                          setSeverity(d.v as any);
                          setPoints(d.p);
                        }}
                        className={cn(
                          "h-10 px-3 rounded-lg text-[12px] font-bold transition-all border",
                          severity === d.v ? (
                            d.v === 'Minor' ? "bg-[#FFB800] text-white border-[#FFB800]" :
                            d.v === 'Moderate' ? "bg-[#F97316] text-white border-[#F97316]" :
                            "bg-[#DC2626] text-white border-[#DC2626]"
                          ) : (
                            d.v === 'Minor' ? "bg-[#FFFBEB] text-[#FFB800] border-[#FFB800]/20" : 
                            d.v === 'Moderate' ? "bg-[#FFF7ED] text-[#F97316] border-[#F97316]/20" :
                            "bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/20"
                          )
                        )}
                      >
                        {d.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#0D1F1A]">Jarima ballari:</label>
                    <input 
                      type="number" 
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value))}
                      min={1} 
                      max={10} 
                      className="w-full h-11 px-4 bg-[#F4F7F6] border-none rounded-xl text-[14px] font-medium text-[#0D1F1A] outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#0D1F1A]">Sana:</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9DB4AB]" />
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full h-11 pl-11 pr-4 bg-[#F4F7F6] border-none rounded-xl text-[14px] font-medium text-[#0D1F1A] outline-none" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#0D1F1A]">Tavsif (min 20 belgi):</label>
                  <textarea 
                    placeholder="Qoidabuzarlik haqida batafsil yozing..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 bg-[#F4F7F6] border-none rounded-xl text-[14px] font-medium text-[#0D1F1A] outline-none min-h-[100px] resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#0D1F1A]">Dalil (ixtiyoriy):</label>
                  <div className="border-2 border-dashed border-[#E8EFED] rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-[#F8FFFE] hover:border-[#0A9B82]/20 transition-all cursor-pointer">
                    <Upload className="w-6 h-6 text-[#9DB4AB]" />
                    <p className="text-[13px] font-bold text-[#6B8A80]">Rasm yoki hujjat yuklash</p>
                    <p className="text-[11px] text-[#9DB4AB]">Maks: 5MB (JPG, PDF)</p>
                  </div>
                </div>
              </div>

              <div className="p-8 pt-4 grid grid-cols-2 gap-3 bg-white border-t border-[#E8EFED]">
                <button 
                  onClick={() => setShowModal(false)}
                  className="h-11 rounded-xl text-[14px] font-bold text-[#6B8A80] hover:bg-slate-50 border border-[#E8EFED]"
                >
                  Bekor qilish
                </button>
                <button 
                  onClick={handleAddViolation}
                  className="h-11 rounded-xl text-[14px] font-bold bg-[#0A9B82] text-white hover:bg-[#087D6A] shadow-lg shadow-[#0A9B82]/10"
                >
                  Bildirish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const styles = {
    Minor: "bg-[#FFFBEB] text-[#FFB800] border-[#FFB800]/20",
    Moderate: "bg-[#FFF7ED] text-[#F97316] border-[#F97316]/20",
    Serious: "bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/20"
  } as any;
  
  const labels = {
    Minor: "Engil",
    Moderate: "O'rta",
    Serious: "Jiddiy"
  } as any;

  return (
    <span className={cn("px-2 py-1 rounded text-[11px] font-black uppercase tracking-wider border", styles[severity] || styles.Minor)}>
      {labels[severity] || severity}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    "Ochiq": "bg-amber-500",
    "Hal qilingan": "bg-[#0A9B82]",
    "Ko'rib chiqilmoqda": "bg-blue-500"
  } as any;

  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", styles[status] || "bg-gray-400")} />
      <span className="text-[13px] font-bold text-[#0D1F1A]">{status}</span>
    </div>
  );
}
