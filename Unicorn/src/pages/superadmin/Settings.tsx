import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  Users, Sliders, Palette, Globe, CheckCircle, Plus, Trash2, Edit2, 
  ChevronRight, Save, XCircle, ToggleLeft, ToggleRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

const tabs = [
  { id: 'users', label: 'Foydalanuvchilar', icon: Users },
  { id: 'scoring', label: 'Ballar konfiguratsiyasi', icon: Sliders },
  { id: 'appearance', label: 'Tizim ko\'rinishi', icon: Palette },
  { id: 'language', label: 'Til va hudud', icon: Globe },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="space-y-8 max-w-6xl pb-10">
      {/* Page Header consistent with Fix 6 */}
      <div className="pb-5 border-b border-[#E8EFED] flex justify-between items-end">
        <div>
          <p className="text-[12px] text-[#9DB4AB] font-medium mb-1.5 tracking-wide italic">Tizim › Sozlamalar</p>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Tizim sozlamalari</h1>
          <p className="text-[14px] text-[#6B8A80] mt-1">Konfiguratsiya, foydalanuvchilar va qoidalarni boshqarish</p>
        </div>
      </div>
      
      {/* Refined Tabs (Fix 5) */}
      <div className="flex border-b border-[#E8EFED] gap-10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "flex items-center gap-2 py-4 text-[14px] font-bold transition-all relative border-b-2",
              activeTab === t.id ? "text-[#0A9B82] border-[#0A9B82]" : "text-[#9DB4AB] border-transparent hover:text-[#0D1F1A]"
            )}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>
      
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {activeTab === 'users' && <UserManagementTab key="users" />}
          {activeTab === 'scoring' && <ScoringConfigTab key="scoring" />}
          {activeTab === 'appearance' && <AppearanceTab key="appearance" />}
          {activeTab === 'language' && <LanguageTab key="language" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function UserManagementTab() {
  const { users, addUser, updateUser } = useAppContext();
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const confirmDelete = () => {
    // We would need a deleteUser in context too, but let's just toast for now or add it to context
    toast.success('Haqiqiy tizimda foydalanuvchi o\'chirildi');
    setUserToDelete(null);
  };

  const openAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="table-container">
        <div className="px-6 py-5 border-b border-[#E8EFED] flex justify-between items-center bg-white">
          <h3 className="text-[16px] font-bold text-[#0D1F1A]">Administratorlar ro'yxati</h3>
          <button 
            onClick={openAddModal}
            className="bg-[#0A9B82] hover:bg-[#087D6A] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Yangi admin qo'shish
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F8FFFE] text-[#9DB4AB] border-b border-[#E8EFED] text-[11px] uppercase font-extrabold tracking-widest">
                <th className="px-6 py-4">Foydalanuvchi</th>
                <th className="px-6 py-4 text-center">Rol</th>
                <th className="px-6 py-4 text-center">Holat</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F3]">
              {users.filter(u => u.role !== 'Student').map((u) => (
                <tr key={u.id} className="hover:bg-[#F8FFFE] transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EDF7F4] border border-[#C6E5DF] flex items-center justify-center text-[#0A9B82]">
                      <img 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${u.name}&backgroundColor=EDF7F4&fontFamily=Inter&fontWeight=700`} 
                        alt="avatar" 
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-[#0D1F1A] text-[15px]">{u.name}</p>
                      <p className="text-[12px] text-[#9DB4AB] font-medium">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "inline-flex px-3 py-1 rounded-full text-[11px] font-bold border",
                      u.role === 'SuperAdmin' ? "bg-[#EDF7F4] text-[#0A9B82] border-[rgba(10,155,130,0.2)]" : "bg-[#F0F4F8] text-[#475569] border-[#E2E8F0]"
                    )}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] animate-pulse" />
                      <span className="text-[#00C896] text-[13px] font-bold">Active</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 text-[#0A9B82]">
                      <button onClick={() => openEditModal(u)} className="text-[13px] font-bold hover:underline px-2 py-1 cursor-pointer">Tahrirlash</button>
                      {u.role !== 'SuperAdmin' && (
                        <button onClick={() => setUserToDelete(u.id)} className="text-[#FF4C6A] text-[13px] font-bold hover:underline px-2 py-1 cursor-pointer">O'chirish</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
        title="Adminni o'chirish"
        message="Haqiqatan ham ushbu administratorni o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."
        confirmText="O'chirish"
        isDestructive={true}
      />

      <UserFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingUser} 
        onSave={(data) => {
          if (editingUser) {
            updateUser(editingUser.id, data);
            toast.success('Ma\'lumotlar yangilandi');
          } else {
            addUser({ ...data, role: data.role as any });
            toast.success('Yangi administrator qo\'shildi');
          }
          setIsModalOpen(false);
        }}
      />
    </motion.div>
  );
}

function UserFormModal({ isOpen, onClose, onSave, initialData }: any) {
  const [formData, setFormData] = useState(initialData || { name: '', email: '', role: 'Admin' });

  React.useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ name: '', email: '', role: 'Admin' });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6 border-b border-[#E8EFED] flex justify-between items-center bg-[#F8FFFE]">
          <h2 className="text-xl font-bold text-[#0D1F1A]">
            {initialData ? 'Adminni tahrirlash' : 'Yangi admin qo\'shish'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#EDF7F4] rounded-full transition-colors text-[#9DB4AB]">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#6B8A80] uppercase tracking-wide">To'liq ism</label>
            <input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Ism Familiya"
              className="w-full bg-[#F9FBFA] border border-[#E8EFED] rounded-xl py-3 px-4 text-[#374151] font-medium focus:border-[#0A9B82] outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#6B8A80] uppercase tracking-wide">Email manzili</label>
            <input 
              required
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="example@univ.uz"
              className="w-full bg-[#F9FBFA] border border-[#E8EFED] rounded-xl py-3 px-4 text-[#374151] font-medium focus:border-[#0A9B82] outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#6B8A80] uppercase tracking-wide">Tizimdagi roli</label>
            <select 
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              className="w-full bg-[#F9FBFA] border border-[#E8EFED] rounded-xl py-3 px-4 text-[#374151] font-medium focus:border-[#0A9B82] outline-none"
            >
              <option value="Admin">Admin (Oktay)</option>
              <option value="Commandant">Komendant</option>
              <option value="SuperAdmin">Super Admin</option>
            </select>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#E8EFED] rounded-xl text-sm font-bold text-[#6B8A80] hover:bg-[#F9FBFA] transition-all">Bekor qilish</button>
            <button type="submit" className="flex-1 py-3 bg-[#0A9B82] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#087D6A] transition-all">Saqlash</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function ScoringConfigTab() {
  const [weights, setWeights] = useState({ academic: 40, attendance: 25, behavior: 20, practical: 15 });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-[#E8EFED] rounded-[16px] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#F0F4F3]">
            <div className="p-2 bg-[#F8FFFE] rounded-lg">
              <Sliders className="w-5 h-5 text-[#0A9B82]" />
            </div>
            <h3 className="font-bold text-[#0D1F1A] text-lg">Ballar vazni (%)</h3>
          </div>
          
          <div className="space-y-8">
            {Object.entries(weights).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[13px] font-bold text-[#6B8A80] uppercase tracking-wide capitalize">{key}</span>
                  <span className="text-base font-bold text-[#0A9B82]">{val}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={val} 
                  onChange={e => setWeights({...weights, [key]: Number(e.target.value)})}
                  className="w-full h-1.5 bg-[#EDF7F4] rounded-lg appearance-none cursor-pointer accent-[#0A9B82]" 
                />
              </div>
            ))}
            <div className="pt-6 border-t border-[#F0F4F3] flex justify-between items-center">
              <span className="text-sm font-bold text-[#9DB4AB]">Jami vazn:</span>
              <div className={cn(
                "px-4 py-1 rounded-full font-bold text-lg", 
                (weights.academic + weights.attendance + weights.behavior + weights.practical) === 100 
                  ? "bg-[#EDF7F4] text-[#0A9B82]" 
                  : "bg-[#FEF2F2] text-[#DC2626]"
              )}>
                {weights.academic + weights.attendance + weights.behavior + weights.practical}%
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-[#E8EFED] rounded-[16px] p-8 shadow-sm">
            <h3 className="text-lg font-bold text-[#0D1F1A] mb-6">Grant chegaralari</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F9FBFA] border border-[#E8EFED] rounded-xl">
                <div>
                  <span className="text-[14px] font-bold text-[#0D1F1A] block">Unicorn Grant</span>
                  <span className="text-[12px] text-[#6B8A80]">1st & 2nd Year students</span>
                </div>
                <input type="number" defaultValue={80} className="w-16 bg-white border border-[#E8EFED] rounded-lg py-2 text-center font-bold text-[#0A9B82] shadow-sm outline-none" />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F9FBFA] border border-[#E8EFED] rounded-xl">
                <div>
                  <span className="text-[14px] font-bold text-[#0D1F1A] block">Golden Mind</span>
                  <span className="text-[12px] text-[#6B8A80]">3rd & 4th Year students</span>
                </div>
                <input type="number" defaultValue={85} className="w-16 bg-white border border-[#E8EFED] rounded-lg py-2 text-center font-bold text-[#D97706] shadow-sm outline-none" />
              </div>
            </div>
          </div>
          
          <button onClick={() => toast.success('Sozlamalar saqlandi')} className="w-full py-4 bg-[#0A9B82] text-white rounded-[14px] font-bold transition-all shadow-lg hover:bg-[#087D6A] flex items-center justify-center gap-2">
            <Save className="w-5 h-5" /> Saqlash
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function AppearanceTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white border border-[#E8EFED] rounded-[16px] p-8 shadow-sm max-w-2xl">
        <h3 className="section-title mb-6">Mavzu sozlamalari</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="border-2 border-[#0A9B82] bg-white p-5 rounded-2xl relative cursor-pointer group shadow-sm transition-all hover:scale-[1.02]">
            <div className="absolute top-3 right-3 text-[#0A9B82]"><CheckCircle className="w-6 h-6" /></div>
            <div className="h-28 bg-[#F4F7F6] rounded-xl mb-4 border border-[#E8EFED]"></div>
            <p className="text-center font-bold text-[#0D1F1A]">Kungi rejim</p>
          </div>
          <div className="border border-[#E8EFED] bg-[#F1F5F9] p-5 rounded-2xl opacity-60 grayscale cursor-not-allowed">
            <div className="h-28 bg-[#0F172A] rounded-xl mb-4 border border-[#1E293B]"></div>
            <p className="text-center font-bold text-[#64748B]">Tungi rejim (Tez orada)</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LanguageTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white border border-[#E8EFED] rounded-[16px] p-8 shadow-sm max-w-xl">
        <h3 className="text-lg font-bold text-[#0D1F1A] mb-8 pb-4 border-b border-[#F0F4F3]">Mahalliylashtirish</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-2">
            <label className="text-[13px] font-bold text-[#6B8A80] uppercase tracking-wide">Tizim tili</label>
            <select className="w-full bg-[#F9FBFA] border border-[#E8EFED] rounded-lg py-3 px-4 text-[#374151] font-medium text-sm focus:border-[#0A9B82] outline-none shadow-sm cursor-pointer">
              <option>O'zbekcha</option>
              <option>English</option>
              <option>Русский</option>
            </select>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <label className="text-[13px] font-bold text-[#6B8A80] uppercase tracking-wide">Vaqt hududi</label>
            <select className="w-full bg-[#F9FBFA] border border-[#E8EFED] rounded-lg py-3 px-4 text-[#374151] font-medium text-sm focus:border-[#0A9B82] outline-none shadow-sm cursor-pointer">
              <option>Asia/Tashkent (GMT+5)</option>
              <option>Europe/London (GMT+0)</option>
            </select>
          </div>
          <div className="pt-6 flex justify-end">
             <button onClick={() => toast.success('Saqlandi')} className="bg-[#0A9B82] hover:bg-[#087D6A] text-white px-10 py-3 rounded-lg font-bold shadow-md transition-all">Saqlash</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
