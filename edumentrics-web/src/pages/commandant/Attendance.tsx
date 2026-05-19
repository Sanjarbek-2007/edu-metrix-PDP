import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  CheckCircle2, Clock, XCircle, Search, 
  Building2, Calendar, FileCheck, CheckCircle,
  ChevronLeft, DoorOpen, Users as UsersIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

type AttStatus = 'Present' | 'Late' | 'Absent' | 'Pending';

export default function Attendance() {
  const { students, submitAttendance } = useAppContext();
  const navigate = useNavigate();
  const dormStudents = students.filter(s => s.roomNumber);
  
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<Record<string, AttStatus>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Group by room
  const roomsObj = dormStudents.reduce((acc, student) => {
    const room = student.roomNumber || 'Unknown';
    if (!acc[room]) acc[room] = [];
    acc[room].push(student);
    return acc;
  }, {} as Record<string, typeof dormStudents>);
  
  const rooms = Object.keys(roomsObj).sort();

  const filteredRooms = rooms.filter(r => {
    const matchesSearch = r.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          roomsObj[r].some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);

  const handleMark = (studentId: string, status: AttStatus) => {
    if (attendance[studentId] === status) {
      const newAtt = { ...attendance };
      delete newAtt[studentId];
      setAttendance(newAtt);
    } else {
      setAttendance(prev => ({ ...prev, [studentId]: status }));
    }
  };

  const handleBulkMarkConfirm = () => {
    const newAtt: Record<string, AttStatus> = {};
    dormStudents.forEach(s => {
      newAtt[s.id] = 'Present';
    });
    setAttendance(newAtt);
    toast.success("Barcha talabalar 'Bor' deb belgilandi");
    setIsBulkConfirmOpen(false);
  };

  const handleBulkMark = () => {
    setIsBulkConfirmOpen(true);
  };

  const handleSubmit = () => {
    const markedCount = Object.keys(attendance).length;
    if (markedCount === 0) return;
    
    setShowConfirmModal(true);
  };

  const confirmSubmit = () => {
    const records = dormStudents.map((s) => ({
      studentId: s.id,
      date: new Date().toISOString().split('T')[0],
      type: 'Evening' as const,
      status: attendance[s.id] || 'Pending',
      markedBy: 'Rustam Qosimov'
    }));

    submitAttendance(records);
    setIsSubmitted(true);
    setShowConfirmModal(false);
    toast.success("✓ Kechki yo'riqnoma topshirildi!");
    
    setTimeout(() => {
      navigate('/commandant/dashboard');
    }, 2000);
  };

  const markedCount = Object.keys(attendance).length;
  const totalCount = dormStudents.length;

  return (
    <div className="space-y-6 pb-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {selectedRoom && (
              <button 
                onClick={() => setSelectedRoom(null)}
                className="p-1.5 hover:bg-[#EDF7F4] rounded-lg text-[#0A9B82] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">
              {selectedRoom ? `${selectedRoom}-xona davomati` : "Yo'riqnoma jurnali (21:00)"}
            </h1>
          </div>
          <p className="text-[13px] text-[#6B8A80] font-medium">
             {selectedRoom ? `${selectedRoom}-xonadagi talabalarni tekshirish` : new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#F8FFFE] px-4 py-2 rounded-xl border border-[#0A9B82]/20">
          <Clock className="w-4 h-4 text-[#0A9B82]" />
          <span className="text-[14px] font-bold text-[#0A9B82]">Kechki davomat</span>
          {isSubmitted && <CheckCircle2 className="w-4 h-4 text-[#0A9B82] ml-1" />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DB4AB]" />
          <input 
            type="text" 
            placeholder={selectedRoom ? "Talaba ismini qidirish..." : "Qidirish (Talaba yoki xona)..."} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 h-11 bg-white border border-[#E8EFED] rounded-xl text-[14px] font-medium focus:border-[#0A9B82] outline-none shadow-sm transition-all"
          />
        </div>
        {!selectedRoom && (
          <button 
            onClick={handleBulkMark}
            className="h-11 px-4 bg-[#EDF7F4] text-[#0A9B82] border border-[#0A9B82]/20 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#0A9B82] hover:text-white transition-all shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" /> Hammani 'bor' deb belgilash
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!selectedRoom ? (
          <motion.div 
            key="rooms-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {filteredRooms.map(room => {
              const rStudents = roomsObj[room];
              const markedInRoom = rStudents.filter(s => attendance[s.id]).length;
              const isAllMarked = markedInRoom === rStudents.length;

              return (
                <div 
                  key={room}
                  onClick={() => setSelectedRoom(room)}
                  className={cn(
                    "bg-white p-5 rounded-[16px] border border-[#E8EFED] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center gap-3 active:scale-95",
                    isAllMarked ? "border-b-[4px] border-b-[#0A9B82] bg-[#F8FFFE]" : "hover:border-[#0A9B82]/40"
                  )}
                >
                  <div className={cn(
                    "relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                    isAllMarked ? "bg-[#0A9B82] text-white" : "bg-[#EDF7F4] text-[#0A9B82]"
                  )}>
                    <DoorOpen className="w-6 h-6" />
                    {isAllMarked && <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-[#0A9B82] bg-white rounded-full" />}
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-[#0D1F1A]">{room}</h4>
                    <p className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-widest mt-0.5">
                      {markedInRoom}/{rStudents.length} ta
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            key="room-attendance"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[14px] border border-[#E8EFED] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
          >
            <div className="bg-[#F8FFFE] border-b border-[#E8EFED] px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-[#0A9B82]" />
                <span className="text-[15px] font-bold text-[#0D1F1A]">{selectedRoom} xona</span>
                <span className="text-[12px] text-[#9DB4AB] font-medium">tekshiruvi</span>
              </div>
              <span className="text-[12px] text-[#9DB4AB] font-bold">{roomsObj[selectedRoom].length} talaba</span>
            </div>
            
            <div className="divide-y divide-[#F0F4F3]">
              {roomsObj[selectedRoom].filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(student => {
                const status = attendance[student.id];
                return (
                  <div 
                    key={student.id} 
                    className={cn(
                      "flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 px-5 gap-4 transition-all",
                      status === 'Present' ? "bg-[#F8FFFE] border-l-[4px] border-l-[#0A9B82]" : 
                      status === 'Late' ? "border-l-[4px] border-l-[#FFB800]" :
                      status === 'Absent' ? "border-l-[4px] border-l-[#DC2626]" : "border-l-[4px] border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-[#0A9B82] to-[#0D1F1A] flex items-center justify-center text-white text-[14px] font-bold shadow-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#0D1F1A] text-[15px]">{student.name}</p>
                        <p className="text-[12px] text-[#6B8A80] font-medium mt-0.5">{student.group} · {student.year}-kurs</p>
                      </div>
                    </div>
                    
                    <div className="flex bg-[#F4F7F6] rounded-[12px] p-1 gap-1 w-full sm:w-auto">
                      <AttendanceButton 
                        active={status === 'Present'}
                        type="Present"
                        label="Bor"
                        onClick={() => handleMark(student.id, 'Present')}
                      />
                      <AttendanceButton 
                        active={status === 'Late'}
                        type="Late"
                        label="Kechikdi"
                        onClick={() => handleMark(student.id, 'Late')}
                      />
                      <AttendanceButton 
                        active={status === 'Absent'}
                        type="Absent"
                        label="Yo'q"
                        onClick={() => handleMark(student.id, 'Absent')}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Submit Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-[240px] bg-white border-t border-[#E8EFED] p-4 px-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-40">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="space-y-1.5 flex-1 md:flex-none md:w-[200px]">
            <div className="flex justify-between text-[14px] font-bold text-[#0D1F1A]">
              <span>Belgilandi: {markedCount}/{totalCount}</span>
            </div>
            <div className="h-1.5 w-full bg-[#F0F4F3] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0A9B82] transition-all duration-300" 
                style={{ width: `${(markedCount / totalCount) * 100}%` }}
              />
            </div>
            <p className={cn(
              "text-[12px] font-bold",
              markedCount === totalCount ? "text-[#0A9B82]" : "text-[#FFB800]"
            )}>
              {markedCount === totalCount ? "Barcha talabalar belgilandi ✓" : `${totalCount - markedCount} ta talaba hali belgilanmadi`}
            </p>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={markedCount === 0 || isSubmitted}
          className={cn(
            "h-11 px-8 rounded-xl text-[14px] font-bold flex items-center gap-2.5 transition-all shadow-lg",
            markedCount === 0 || isSubmitted 
              ? "bg-[#D1D5DB] text-white cursor-not-allowed shadow-none" 
              : "bg-[#0A9B82] text-white hover:bg-[#087D6A] shadow-[#0A9B82]/20"
          )}
        >
          {isSubmitted ? "Topshirildi ✓" : <><FileCheck className="w-5 h-5" /> Hisobotni topshirish</>}
        </button>
      </div>

      <AnimatePresence>
        {isBulkConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBulkConfirmOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-[400px] bg-white rounded-2xl p-8 relative z-10 shadow-2xl">
              <div className="w-16 h-16 bg-[#EDF7F4] rounded-full flex items-center justify-center text-[#0A9B82] mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#0D1F1A] mb-2 text-center">Barchasini belgilash</h3>
              <p className="text-[14px] text-[#6B8A80] text-center mb-8 font-medium">
                Barcha {dormStudents.length} ta talabani <span className="text-[#0A9B82] font-bold">'Bor'</span> deb belgilashni tasdiqlaysizmi?
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsBulkConfirmOpen(false)}
                  className="h-11 rounded-xl text-[14px] font-bold text-[#6B8A80] hover:bg-slate-50 border border-[#E8EFED]"
                >
                  Bekor qilish
                </button>
                <button 
                  onClick={handleBulkMarkConfirm}
                  className="h-11 rounded-xl text-[14px] font-bold bg-[#0A9B82] text-white hover:bg-[#087D6A] shadow-lg shadow-[#0A9B82]/10"
                >
                  Tasdiqlash
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirmModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-[420px] bg-white rounded-2xl p-8 relative z-10 shadow-2xl">
              <h3 className="text-xl font-bold text-[#0D1F1A] mb-2 text-center">Yo'riqnomani topshirish</h3>
              <p className="text-[14px] text-[#6B8A80] text-center mb-8 font-medium">
                Kechki yo'riqnoma natijalarini tasdiqlaysizmi?
              </p>
              
              <div className="bg-[#F8FFFE] border border-[#E8EFED] rounded-xl p-4 mb-8 space-y-3">
                <div className="flex justify-between text-[13px] font-bold">
                  <span className="text-[#6B8A80]">Bor:</span>
                  <span className="text-[#0A9B82]">{Object.values(attendance).filter(v => v === 'Present').length} ta</span>
                </div>
                <div className="flex justify-between text-[13px] font-bold">
                  <span className="text-[#6B8A80]">Kechikdi:</span>
                  <span className="text-[#FFB800]">{Object.values(attendance).filter(v => v === 'Late').length} ta</span>
                </div>
                <div className="flex justify-between text-[13px] font-bold">
                  <span className="text-[#6B8A80]">Kelmagan:</span>
                  <span className="text-[#DC2626]">{Object.values(attendance).filter(v => v === 'Absent').length} ta</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="h-11 rounded-xl text-[14px] font-bold text-[#6B8A80] hover:bg-slate-50 border border-[#E8EFED]"
                >
                  Bekor qilish
                </button>
                <button 
                  onClick={confirmSubmit}
                  className="h-11 rounded-xl text-[14px] font-bold bg-[#0A9B82] text-white hover:bg-[#087D6A] shadow-lg shadow-[#0A9B82]/10"
                >
                  Topshirish ✓
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AttendanceButton({ active, type, label, onClick }: { active: boolean, type: AttStatus, label: string, onClick: () => void }) {
  const Icon = type === 'Present' ? CheckCircle2 : type === 'Late' ? Clock : XCircle;
  
  const activeStyles = {
    Present: "bg-[#0A9B82] text-white shadow-[0_2px_8px_rgba(10,155,130,0.3)]",
    Late: "bg-[#FFB800] text-white shadow-[0_2px_8px_rgba(255,184,0,0.3)]",
    Absent: "bg-[#DC2626] text-white shadow-[0_2px_8_px_rgba(220,38,38,0.3)]",
    Pending: ""
  };

  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 h-9 px-3 rounded-lg text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all",
        active ? activeStyles[type] : "text-[#6B8A80] hover:bg-white/50"
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
