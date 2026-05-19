import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  Users, Search, Filter, ShieldAlert, 
  ArrowRight, ShieldCheck, Mail, MapPin, 
  Grid, Home, Settings, ChevronLeft, DoorOpen, 
  UserPlus, Hash, Calendar, History
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function Students() {
  const { students, updateStudent } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBlock, setFilterBlock] = useState('Barchasi');
  const [filterRisk, setFilterRisk] = useState('Barchasi');
  
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isChangeRoomModalOpen, setIsChangeRoomModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [newRoomNumber, setNewRoomNumber] = useState('');

  const dormStudents = students.filter(s => s.roomNumber);
  
  // Group by room
  const roomsGrouped = dormStudents.reduce((acc, s) => {
    const r = s.roomNumber || 'Unknown';
    if (!acc[r]) acc[r] = [];
    acc[r].push(s);
    return acc;
  }, {} as Record<string, typeof dormStudents>);

  const roomNames = Object.keys(roomsGrouped).sort();

  const filteredRoomNames = roomNames.filter(r => {
    const matchesBlock = filterBlock === 'Barchasi' || r.startsWith(filterBlock);
    const matchesSearch = r.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          roomsGrouped[r].some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesBlock && matchesSearch;
  });

  const studentsInSelectedRoom = selectedRoom ? roomsGrouped[selectedRoom].filter(s => {
    return filterRisk === 'Barchasi' || s.riskStatus === filterRisk;
  }) : [];

  const handleRoomChange = () => {
    if (!selectedStudent || !newRoomNumber) return;
    updateStudent(selectedStudent.id, { roomNumber: newRoomNumber });
    toast.success(`${selectedStudent.name} ${newRoomNumber}-xonaga o'tkazildi`);
    setIsChangeRoomModalOpen(false);
    setSelectedStudent(null);
    setNewRoomNumber('');
    // If room changes, we might need to reset selectedRoom if it was the old one, 
    // but usually user stays in the drill down. 
    // Let's just reset the view if room doesn't exist anymore in that drill down.
  };

  const openRoomChange = (e: React.MouseEvent, student: any) => {
    e.stopPropagation();
    setSelectedStudent(student);
    setNewRoomNumber(student.roomNumber);
    setIsChangeRoomModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-14">
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
              {selectedRoom ? `${selectedRoom}-xona talabalari` : 'Yotoqxona talabalari'}
            </h1>
          </div>
          <p className="text-[13px] text-[#6B8A80] font-medium">
            {selectedRoom ? `${selectedRoom}-xonadagi barcha talabalar ro'yxati` : 'Xonalar bo\'yicha kategoriyalangan ro\'yxat'}
          </p>
        </div>
        {!selectedRoom && (
          <div className="flex bg-white rounded-xl border border-[#E8EFED] p-1 px-4 items-center gap-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2 py-2">
              <span className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider">Jami:</span>
              <span className="text-[14px] font-black text-[#0D1F1A]">{dormStudents.length}</span>
            </div>
            <div className="w-px h-3 bg-[#E8EFED]" />
            <div className="flex items-center gap-2 py-2">
              <span className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider">Xonalar:</span>
              <span className="text-[14px] font-black text-[#0D1F1A]">{roomNames.length}</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-[14px] border border-[#E8EFED] shadow-[0_1px_4px_rgba(0,0,0,0.05)] flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9DB4AB]" />
          <input 
            type="text" 
            placeholder={selectedRoom ? "Talaba ismini qidirish..." : "Xona yoki talabani qidirish..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 h-10 bg-[#F4F7F6] border-none rounded-lg text-[13px] outline-none font-medium"
          />
        </div>
        {!selectedRoom && (
          <select 
            value={filterBlock}
            onChange={(e) => setFilterBlock(e.target.value)}
            className="h-10 px-3 bg-[#F4F7F6] border-none rounded-lg text-[13px] font-medium text-[#0D1F1A] outline-none min-w-[140px]"
          >
            <option value="Barchasi">Barcha bloklar</option>
            <option value="A">A blok</option>
            <option value="B">B blok</option>
            <option value="C">C blok</option>
          </select>
        )}
        {selectedRoom && (
           <select 
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="h-10 px-3 bg-[#F4F7F6] border-none rounded-lg text-[13px] font-medium text-[#0D1F1A] outline-none min-w-[140px]"
          >
            <option value="Barchasi">Barcha holatlar</option>
            <option value="Safe">Xavfsiz (Safe)</option>
            <option value="At Risk">Xavf ostida (At Risk)</option>
            <option value="Danger">Xavfli (Danger)</option>
          </select>
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
            {filteredRoomNames.map(room => {
              const studentsInRoom = roomsGrouped[room];
              const riskStatus = studentsInRoom.some(s => s.riskStatus === 'Danger') ? 'Danger' : 
                                studentsInRoom.some(s => s.riskStatus === 'At Risk') ? 'At Risk' : 'Safe';
              
              return (
                <div 
                  key={room}
                  onClick={() => setSelectedRoom(room)}
                  className={cn(
                    "bg-white p-5 rounded-[16px] border border-[#E8EFED] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center gap-3 active:scale-95",
                    riskStatus === 'Danger' ? "border-l-4 border-l-[#DC2626]" : 
                    riskStatus === 'At Risk' ? "border-l-4 border-l-[#FFB800]" : "hover:border-[#0A9B82]/40"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                    riskStatus === 'Danger' ? "bg-[#FEF2F2] text-[#DC2626]" : 
                    riskStatus === 'At Risk' ? "bg-[#FFFBEB] text-[#FFB800]" : "bg-[#EDF7F4] text-[#0A9B82]"
                  )}>
                    <DoorOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-[#0D1F1A]">{room}</h4>
                    <p className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-widest mt-0.5">{studentsInRoom.length} talaba</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            key="room-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {studentsInSelectedRoom.map((s) => (
              <div key={s.id} className={cn(
                "bg-white rounded-[16px] border border-[#E8EFED] p-6 shadow-sm flex flex-col transition-all hover:shadow-md h-full relative group",
                s.riskStatus === 'Safe' ? "border-l-[4px] border-l-[#0A9B82]" :
                s.riskStatus === 'At Risk' ? "border-l-[4px] border-l-[#FFB800]" :
                "border-l-[4px] border-l-[#DC2626]"
              )}>
                 <button 
                  onClick={(e) => openRoomChange(e, s)}
                  className="absolute top-4 right-4 p-2 bg-slate-50 text-[#9DB4AB] hover:text-[#0A9B82] hover:bg-[#EDF7F4] rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Xonani o'zgartirish"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-4 mb-5">
                  <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-[#0A9B82] to-[#0A9B82]/70 flex items-center justify-center text-white text-[18px] font-black shadow-sm">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-[#0D1F1A] flex items-center gap-2">
                      {s.name}
                      <RiskBadge status={s.riskStatus} />
                    </h4>
                    <p className="text-[12px] text-[#6B8A80] font-medium mt-1 uppercase tracking-wide">{s.studentId} · {s.group}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#F0F4F3] mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#EDF7F4] flex items-center justify-center text-[#0A9B82]">
                      <Hash className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#9DB4AB] uppercase tracking-widest">Kurs</p>
                      <p className="text-[13px] font-bold text-[#0D1F1A]">{s.year}-kurs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#9DB4AB] uppercase tracking-widest">Davomat</p>
                      <p className="text-[13px] font-bold text-[#0D1F1A]">92%</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-auto pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold text-[#9DB4AB] uppercase tracking-widest leading-none mb-1">Intizom balli</span>
                    <span className="text-xl font-black text-[#0D1F1A]">{s.scores.intizom.value}/{s.scores.intizom.max}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate('/commandant/violations', { state: { studentId: s.id } })}
                      className="flex-1 h-10 px-4 rounded-xl bg-[#0A9B82] text-white text-[13px] font-bold hover:bg-[#087D6A] transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 whitespace-nowrap"
                    >
                      <ShieldAlert className="w-4 h-4 shrink-0" /> Jarima berish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Room Modal */}
      <AnimatePresence>
        {isChangeRoomModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsChangeRoomModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-[400px] bg-white rounded-[24px] p-8 relative z-10 shadow-2xl overflow-hidden border border-[#E8EFED]">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Home className="w-32 h-32 text-[#0A9B82]" />
              </div>
              <h3 className="text-xl font-bold text-[#0D1F1A] mb-2">Xonani o'zgartirish</h3>
              <p className="text-[14px] text-[#6B8A80] mb-8 font-medium">
                <span className="text-[#0A9B82] font-bold">{selectedStudent?.name}</span> uchun yangi xona raqamini kiriting.
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#9DB4AB] uppercase tracking-widest">Hozirgi xona</label>
                  <div className="w-full h-12 bg-slate-50 border border-[#E8EFED] rounded-xl flex items-center px-4 text-[#9DB4AB] font-bold italic">
                     {selectedStudent?.roomNumber}
                  </div>
                </div>
                
                <div className="space-y-2 relative">
                  <label className="text-[11px] font-black text-[#9DB4AB] uppercase tracking-widest pl-1">Yangi xona raqami</label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9DB4AB]" />
                    <input 
                      autoFocus
                      type="text"
                      className="w-full h-14 bg-white border-2 border-[#E8EFED] rounded-xl pl-12 pr-4 font-bold text-[#0D1F1A] focus:border-[#0A9B82] outline-none transition-all placeholder:text-[#9DB4AB]/50"
                      placeholder="Masalan: B204"
                      value={newRoomNumber}
                      onChange={(e) => setNewRoomNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button onClick={() => setIsChangeRoomModalOpen(false)} className="h-12 rounded-xl text-[14px] font-bold text-[#6B8A80] hover:bg-slate-50 border border-[#E8EFED] transition-all">Bekor qilish</button>
                  <button onClick={handleRoomChange} disabled={!newRoomNumber || newRoomNumber === selectedStudent?.roomNumber} className="h-12 rounded-xl text-[14px] font-bold bg-[#0A9B82] text-white hover:bg-[#087D6A] disabled:bg-slate-200 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#0A9B82]/10">Saqlash</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RiskBadge({ status }: { status: string }) {
  const styles = {
    Safe: "text-[#0A9B82]",
    "At Risk": "text-[#FFB800]",
    Danger: "text-[#DC2626]"
  } as any;

  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-bold", styles[status])}>
      <div className={cn("w-1.5 h-1.5 rounded-full bg-current")} />
      {status === 'Safe' ? 'Safe' : status === 'At Risk' ? 'At Risk' : 'Danger'}
    </span>
  );
}
