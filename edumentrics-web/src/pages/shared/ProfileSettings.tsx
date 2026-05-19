import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  User as UserIcon, Mail, Phone, Lock, 
  Save, Sparkles, CheckCircle2, ShieldCheck,
  Eye, EyeOff
} from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

const avatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Tigger',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Princess'
];

export default function ProfileSettings() {
  const { currentUser, updateProfile } = useAppContext();
  
  if (!currentUser) return null;

  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phoneNumber || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || avatars[0]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error('Parollar bir-biriga mos kelmadi');
      return;
    }

    setIsSaving(true);
    const updates: any = { name, phoneNumber: phone, avatar };
    if (password) {
      updates.password = password;
    }

    const success = await updateProfile(updates);
    setIsSaving(false);

    if (success) {
      toast.success('Profil ma\'lumotlari muvaffaqiyatli saqlandi!');
      setPassword('');
      setConfirmPassword('');
    } else {
      toast.error('Xatolik yuz berdi');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-20">
      {/* Page Header */}
      <div className="pb-5 border-b border-[#E8EFED] flex justify-between items-end">
        <div>
          <p className="text-[12px] text-[#9DB4AB] font-medium mb-1.5 tracking-wide italic">Tizim › Profil sozlamalari</p>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Shaxsiy Profilingiz</h1>
          <p className="text-[14px] text-[#6B8A80] mt-1">Ism, telefon raqam, avatar va parolingizni tahrirlash</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary Card */}
        <div className="md:col-span-1">
          <div className="bg-white p-8 rounded-[32px] border border-[#E8EFED] shadow-sm flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="w-28 h-28 rounded-[24px] bg-[#EDF7F4] border border-[#C6E5DF] flex items-center justify-center overflow-hidden shadow-md">
                <img 
                  src={avatar} 
                  alt="avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#0D1F1A]">{currentUser.name}</h2>
            <p className="text-[11px] font-black text-[#0A9B82] uppercase tracking-widest bg-[#EDF7F4] px-3 py-1 rounded-full mt-2 border border-[#0A9B82]/10">
              {currentUser.role}
            </p>

            <div className="w-full mt-8 pt-6 border-t border-[#F0F4F3] space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#9DB4AB] font-semibold">Tizimdagi ID</span>
                <span className="text-[#0D1F1A] font-bold">#{currentUser.id}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#9DB4AB] font-semibold">Email</span>
                <span className="text-[#0D1F1A] font-bold max-w-[150px] truncate">{currentUser.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Settings */}
        <form onSubmit={handleSave} className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 sm:p-10 rounded-[32px] border border-[#E8EFED] shadow-sm space-y-6">
            
            {/* Avatar Selector */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-[#9DB4AB] uppercase tracking-widest pl-1">Avatar tanlang</label>
              <div className="flex flex-wrap gap-4">
                {avatars.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all active:scale-95 ${avatar === av ? 'border-[#0A9B82] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={av} alt="avatar option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-2 group">
              <label className="text-[11px] font-black text-[#9DB4AB] uppercase tracking-widest pl-1">To'liq ism-sharif</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9DB4AB] transition-colors group-focus-within:text-[#0A9B82]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 bg-[#F4F7F6] border-2 border-transparent rounded-xl pl-12 pr-4 text-[#0D1F1A] text-sm font-bold focus:bg-white focus:border-[#0A9B82] outline-none transition-all placeholder:text-[#9DB4AB]/50"
                  placeholder="Ism Familiya"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div className="space-y-2 group">
              <label className="text-[11px] font-black text-[#9DB4AB] uppercase tracking-widest pl-1">Telefon raqam</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9DB4AB] transition-colors group-focus-within:text-[#0A9B82]" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-12 bg-[#F4F7F6] border-2 border-transparent rounded-xl pl-12 pr-4 text-[#0D1F1A] text-sm font-bold focus:bg-white focus:border-[#0A9B82] outline-none transition-all placeholder:text-[#9DB4AB]/50"
                  placeholder="+998 90 123 45 67"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#F0F4F3] space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#0D1F1A]">Parolni o'zgartirish (Majburiy emas)</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password Input */}
                <div className="space-y-2 group">
                  <label className="text-[11px] font-black text-[#9DB4AB] uppercase tracking-widest pl-1">Yangi parol</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9DB4AB] transition-colors group-focus-within:text-[#0A9B82]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 bg-[#F4F7F6] border-2 border-transparent rounded-xl pl-12 pr-12 text-[#0D1F1A] text-sm font-bold focus:bg-white focus:border-[#0A9B82] outline-none transition-all placeholder:text-[#9DB4AB]/50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9DB4AB] hover:text-[#0A9B82]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2 group">
                  <label className="text-[11px] font-black text-[#9DB4AB] uppercase tracking-widest pl-1">Yangi parolni tasdiqlash</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9DB4AB] transition-colors group-focus-within:text-[#0A9B82]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 bg-[#F4F7F6] border-2 border-transparent rounded-xl pl-12 pr-4 text-[#0D1F1A] text-sm font-bold focus:bg-white focus:border-[#0A9B82] outline-none transition-all placeholder:text-[#9DB4AB]/50"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 h-12 bg-[#0A9B82] hover:bg-[#087D6A] text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> 
              {isSaving ? 'Saqlanmoqda...' : 'O\'zgarishlarni saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
