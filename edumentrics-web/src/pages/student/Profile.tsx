import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Student } from '../../types';
import { 
  User, Mail, Phone, MapPin, 
  Calendar, BookOpen, Shield, Award,
  Sparkles, Brain, Edit2, Settings,
  LogOut, X, Save, Lock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { currentUser, logout, updateProfile } = useAppContext();
  const student = currentUser as Student;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(student?.name || '');
  const [editPhone, setEditPhone] = useState(student?.phoneNumber || '');
  const [editPassword, setEditPassword] = useState('');
  const [editConfirmPassword, setEditConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!student) return null;

  const getGrantTarget = () => {
    if (student.year <= 2) return { name: 'Unicorn', target: 80, current: student.totalScore, icon: <Sparkles className="w-5 h-5 text-purple-400" />, color: 'primary' };
    return { name: 'Golden Mind', target: 85, current: student.totalScore, icon: <Brain className="w-5 h-5 text-amber-500" />, color: 'secondary' };
  };

  const target = getGrantTarget();

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editPassword && editPassword !== editConfirmPassword) {
      toast.error('Parollar bir-biriga mos kelmadi');
      return;
    }

    setIsSaving(true);
    const updates: any = { name: editName, phoneNumber: editPhone };
    if (editPassword) {
      updates.password = editPassword;
    }

    const success = await updateProfile(updates);
    setIsSaving(false);

    if (success) {
      toast.success('Profil ma\'lumotlari muvaffaqiyatli saqlandi!');
      setIsEditOpen(false);
      setEditPassword('');
      setEditConfirmPassword('');
    } else {
      toast.error('Xatolik yuz berdi');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">Mening profilim</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Shaxsiy ma'lumotlar va hisob sozlamalari</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsEditOpen(true)}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 transition-colors shadow-sm cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Chiqish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal Info Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="relative group mb-8">
              <div className="w-32 h-32 rounded-[32px] bg-emerald-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-emerald-100 overflow-hidden">
                {student.avatar ? (
                  <img src={student.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  student.name.charAt(0)
                )}
              </div>
              <button 
                onClick={() => setIsEditOpen(true)}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full border border-slate-200 shadow-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">{student.name}</h2>
            <p className="text-slate-500 text-sm font-medium italic mb-8">{student.year}-kurs • {student.group}</p>

            <div className="w-full space-y-4">
              <InfoItem icon={<Mail className="w-4 h-4" />} label="Email" value={student.email} />
              <InfoItem icon={<Phone className="w-4 h-4" />} label="Telefon" value={student.phoneNumber || 'Kiritilmagan'} />
              <InfoItem icon={<MapPin className="w-4 h-4" />} label="Xona" value={student.roomNumber || 'Belgilanmagan'} />
              <InfoItem icon={<Shield className="w-4 h-4" />} label="Status" value={student.riskStatus} status />
            </div>
          </div>

          <div className="bg-emerald-600 p-8 rounded-[40px] shadow-lg shadow-emerald-200 relative overflow-hidden text-white">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-100 mb-6 flex items-center gap-2">
              <Award className="w-4 h-4" /> Grant Ma'lumoti
            </h3>
            <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                 {target.icon}
               </div>
               <div>
                  <p className="text-xl font-black tracking-tight">{student.grantType === 'None' ? 'Kandidat' : student.grantType}</p>
                  <p className="text-xs text-emerald-100 font-medium">{student.grantType === 'None' ? 'Grant uchun kurashmoqda' : 'Ushbu grant sohibi'}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Performance & Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-10">O'zlashtirish ko'rsatkichlari</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
               <ScoreProgress label="Akademik" value={student.scores.akademik.value} max={student.scores.akademik.max} color="emerald" icon={<BookOpen className="w-4 h-4" />} />
               <ScoreProgress label="Davomat" value={student.scores.davomat.value} max={student.scores.davomat.max} color="blue" icon={<Calendar className="w-4 h-4" />} />
               <ScoreProgress label="Amaliy ko'nikmalar" value={student.scores.amaliy.value} max={student.scores.amaliy.max} color="amber" icon={<Award className="w-4 h-4" />} />
               <ScoreProgress label="Faollik va Sert." value={student.scores.faollik.value} max={student.scores.faollik.max} color="purple" icon={<Award className="w-4 h-4" />} />
               <ScoreProgress label="Tyutor bahosi" value={student.scores.tyutorBahosi.value} max={student.scores.tyutorBahosi.max} color="indigo" icon={<Award className="w-4 h-4" />} />
               <ScoreProgress label="Intizom (Korporativ)" value={student.scores.intizom.value} max={student.scores.intizom.max} color="rose" icon={<Shield className="w-4 h-4" />} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6">Tizimga kirish</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Oxirgi faollik</span>
                  <span className="text-xs font-bold text-slate-900">Bugun, 09:42</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">IP Manzil</span>
                  <span className="text-xs font-bold text-slate-900">192.168.1.1</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-emerald-600/10 group-hover:scale-110 transition-transform">
                <Sparkles className="w-20 h-20" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Talabalik guvohnomasi</h3>
              <p className="text-4xl font-black text-slate-900 tracking-tighter mb-2">#ID-{student.id.split('-')[1] || '7291'}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Faol (Active)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">Profilni tahrirlash</h2>
                <button onClick={() => setIsEditOpen(false)} className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider pl-1">To'liq ism</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 text-slate-900 text-xs font-bold outline-none focus:border-emerald-500"
                      placeholder="Sardor Ergashev"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider pl-1">Telefon raqam</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 text-slate-900 text-xs font-bold outline-none focus:border-emerald-500"
                      placeholder="+998 90 123 45 67"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-50 space-y-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Parolni o'zgartirish (ixtiyoriy)</p>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider pl-1">Yangi parol</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 text-slate-900 text-xs font-bold outline-none focus:border-emerald-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider pl-1">Yangi parolni tasdiqlash</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        value={editConfirmPassword}
                        onChange={(e) => setEditConfirmPassword(e.target.value)}
                        className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 text-slate-900 text-xs font-bold outline-none focus:border-emerald-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsEditOpen(false)} 
                    className="flex-1 py-3 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoItem({ icon, label, value, status }: { icon: any, label: string, value: string, status?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/50 rounded-2xl border border-slate-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className="text-slate-400">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      {status ? (
        <span className={cn(
          "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
          value === 'Safe' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
          value === 'At Risk' ? 'bg-amber-50 text-amber-600 border-amber-100' :
          'bg-rose-50 text-rose-600 border-rose-100'
        )}>{value}</span>
      ) : (
        <span className="text-xs font-black text-slate-900">{value}</span>
      )}
    </div>
  );
}

function ScoreProgress({ label, value, max, color, icon }: { label: string, value: number, max: number, color: string, icon: any }) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  
  const colors = {
    emerald: 'bg-emerald-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    amber: 'bg-amber-500'
  } as any;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl text-white", colors[color])}>{icon}</div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
        </div>
        <span className="text-sm font-black text-slate-900">{value} / {max}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          className={cn("h-full rounded-full", colors[color])} 
        />
      </div>
    </div>
  );
}
