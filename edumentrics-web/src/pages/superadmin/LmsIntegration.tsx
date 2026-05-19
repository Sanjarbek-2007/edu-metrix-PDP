import React, { useState } from 'react';
import { Database, Link as LinkIcon, RefreshCw, AlertCircle, CheckCircle2, Server, Save, ChevronRight, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { useAppContext } from '../../context/AppContext';

export default function LmsIntegration() {
  const { students, addPointChange } = useAppContext();
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastSync, setLastSync] = useState<string>('Mavjud emas');
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setLastSync(new Date().toLocaleTimeString());
      
      let updatedCount = 0;
      students.forEach(s => {
        // Randomly decide if student deserves a score update (e.g. 40% chance)
        if (Math.random() > 0.6) {
          const delta = Math.random() > 0.5 ? 1 : -1;
          addPointChange({
            studentId: s.id,
            category: 'akademik',
            amount: delta,
            reason: `LMS Sync: ${delta > 0 ? 'Yangi topshiriq bali' : 'Akademik ko\'rsatkich o\'zgarishi'}`,
            approvedBy: 'LMS Auto-Sync'
          });
          updatedCount++;
        }
      });

      toast.success(`LMS bilan sinxronizatsiya yakunlandi: ${updatedCount} ta talaba ballari yangilandi`, { 
        duration: 4000,
        icon: <CheckCircle2 className="w-5 h-5 text-[#0A9B82]" />
      });
    }, 2500);
  };

  const handleSave = () => {
    setIsSaveConfirmOpen(false);
    toast.success('LMS sozlamalari saqlandi va ulanish o\'rnatildi.');
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Page Header consistent with Fix 6 */}
      <div className="pb-5 border-b border-[#E8EFED] flex justify-between items-end">
        <div>
          <p className="text-[12px] text-[#9DB4AB] font-medium mb-1.5 tracking-wide italic">Tizim › LMS Integratsiyasi</p>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">LMS Integratsiyasi</h1>
          <p className="text-[14px] text-[#6B8A80] mt-1">Universitetning asosiy LMS tizimi bilan ulanishni sozlash</p>
        </div>
      </div>

      {/* Status Banner */}
      <div className={cn(
        "bg-white border rounded-[14px] p-5 flex items-center justify-between shadow-sm",
        lastSync === 'Mavjud emas' ? "border-[#FFB800]" : "border-[#0A9B82]"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-full flex items-center justify-center relative",
            lastSync === 'Mavjud emas' ? "bg-[rgba(255,184,0,0.1)] text-[#FFB800]" : "bg-[rgba(10,155,130,0.1)] text-[#0A9B82]"
          )}>
            {lastSync === 'Mavjud emas' ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
            <span className={cn(
              "absolute inset-0 rounded-full animate-ping opacity-25",
              lastSync === 'Mavjud emas' ? "bg-[#FFB800]" : "bg-[#0A9B82]"
            )}></span>
          </div>
          <div>
            <h3 className="font-bold text-[#0D1F1A] text-lg">
              {lastSync === 'Mavjud emas' ? "LMS ulanmagan — Demo rejimi" : "Sinxronizatsiya holati: Faol"}
            </h3>
            <p className="text-sm text-[#6B8A80]">
              {lastSync === 'Mavjud emas' 
                ? "Asosiy tizim bilan ulanish o'rnatilmagan. Hozirda demo ma'lumotlar ko'rsatilmoqda." 
                : `Oxirgi muvaffaqiyatli sinxronizatsiya: ${lastSync}`}
            </p>
          </div>
        </div>
        <button 
          onClick={handleSimulate}
          disabled={isSimulating}
          className="flex items-center gap-2 bg-[#0A9B82] hover:bg-[#087D6A] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4", isSimulating && "animate-spin")} /> 
          {isSimulating ? 'Yangilanmoqda...' : 'Hozir sinxronlash'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Card */}
        <div className="bg-white border border-[#E8EFED] rounded-[16px] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#F0F4F3]">
            <div className="p-2 bg-[#F8FFFE] rounded-lg">
              <Server className="w-5 h-5 text-[#0A9B82]" />
            </div>
            <h3 className="font-bold text-[#0D1F1A] text-lg">Konfiguratsiya</h3>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:items-center">
              <label className="text-[13px] font-bold text-[#6B8A80] uppercase tracking-wide">LMS API URL</label>
              <div className="md:col-span-2">
                <input 
                  type="text" 
                  readOnly
                  placeholder="https://api.lms.pdpu.uz/v1"
                  className="w-full bg-[#F9FBFA] border border-[#E8EFED] rounded-lg py-2.5 px-4 text-[#374151] font-medium text-sm focus:border-[#0A9B82] outline-none transition-colors" 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:items-center">
              <label className="text-[13px] font-bold text-[#6B8A80] uppercase tracking-wide">API Token</label>
              <div className="md:col-span-2">
                <div className="relative">
                  <input 
                    type="password" 
                    readOnly
                    value="************************"
                    className="w-full bg-[#F9FBFA] border border-[#E8EFED] rounded-lg py-2.5 px-4 text-[#374151] text-sm focus:border-[#0A9B82] outline-none transition-colors" 
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#0A9B82] bg-[#EDF7F4] px-1.5 py-0.5 rounded uppercase">Encrypted</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:items-center">
              <label className="text-[13px] font-bold text-[#6B8A80] uppercase tracking-wide">Update Frequency</label>
              <div className="md:col-span-2">
                <select className="w-full bg-white border border-[#E8EFED] rounded-lg py-2.5 px-4 text-[#374151] font-semibold text-sm focus:border-[#0A9B82] outline-none transition-colors cursor-pointer appearance-none shadow-sm">
                  <option>Every 15 minutes</option>
                  <option>Every 30 minutes</option>
                  <option>Every hour</option>
                  <option>Manual only</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 flex justify-end">
            <button 
              onClick={() => setIsSaveConfirmOpen(true)}
              className="bg-[#0A9B82] hover:bg-[#087D6A] text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center gap-2 text-sm shadow-md"
            >
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        </div>

        {/* Data Mapping Card */}
        <div className="bg-white border border-[#E8EFED] rounded-[16px] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#F0F4F3]">
            <div className="p-2 bg-[#FFF8ED] rounded-lg">
              <Database className="w-5 h-5 text-[#D97706]" />
            </div>
            <h3 className="font-bold text-[#0D1F1A] text-lg">Data Mapping</h3>
          </div>
          
          <div className="overflow-hidden border border-[#F0F4F3] rounded-xl bg-[#FBFDFA]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8FFFE] text-[#9DB4AB] uppercase text-[10px] font-extrabold tracking-widest border-b border-[#F0F4F3]">
                <tr>
                  <th className="px-6 py-4">LMS Field</th>
                  <th className="px-2 py-4"></th>
                  <th className="px-6 py-4">EduMetric Field</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F3] text-[#374151]">
                <tr className="hover:bg-white transition-colors">
                  <td className="px-6 py-4 font-mono text-[12px] text-[#6B8A80]">student_grade</td>
                  <td className="px-2 py-4 text-[#9DB4AB]"><ChevronRight className="w-4 h-4" /></td>
                  <td className="px-6 py-4 font-bold text-[#0A9B82]">Akademik ball</td>
                </tr>
                <tr className="hover:bg-white transition-colors">
                  <td className="px-6 py-4 font-mono text-[12px] text-[#6B8A80]">attendance_rate</td>
                  <td className="px-2 py-4 text-[#9DB4AB]"><ChevronRight className="w-4 h-4" /></td>
                  <td className="px-6 py-4 font-bold text-[#2563EB]">Davomat</td>
                </tr>
                <tr className="hover:bg-white transition-colors">
                  <td className="px-6 py-4 font-mono text-[12px] text-[#6B8A80]">discipline_log</td>
                  <td className="px-2 py-4 text-[#9DB4AB]"><ChevronRight className="w-4 h-4" /></td>
                  <td className="px-6 py-4 font-bold text-[#7C3AED]">Xulq-atvor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 bg-[#EDF7F4] border border-[rgba(10,155,130,0.1)] rounded-[16px]">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
            <RefreshCw className="w-5 h-5 text-[#0A9B82]" />
          </div>
          <h4 className="font-bold text-[#0D1F1A] mb-2">Auto Sync</h4>
          <p className="text-sm text-[#6B8A80] leading-relaxed">No more manual entry. Grades are pulled every 15 minutes automatically.</p>
        </div>
        <div className="p-6 bg-[#EFF6FF] border border-[rgba(37,99,235,0.1)] rounded-[16px]">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
            <ShieldAlert className="w-5 h-5 text-[#2563EB]" />
          </div>
          <h4 className="font-bold text-[#0D1F1A] mb-2">Zero Error</h4>
          <p className="text-sm text-[#6B8A80] leading-relaxed">System-to-system mapping ensures student data integrity is 100% accurate.</p>
        </div>
        <div className="p-6 bg-[#F5F3FF] border border-[rgba(124,58,237,0.1)] rounded-[16px]">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
            <LinkIcon className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <h4 className="font-bold text-[#0D1F1A] mb-2">Direct Mapping</h4>
          <p className="text-sm text-[#6B8A80] leading-relaxed">Easily map any LMS variable to our internal tracking indicators.</p>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isSaveConfirmOpen}
        onClose={() => setIsSaveConfirmOpen(false)}
        onConfirm={handleSave}
        title="LMS'ga ulanish"
        message="Haqiqatan ham ushbu sozlamalar orqali ulanish o'rnatmoqchimisiz? Bu jarayon avtomatik ravishda talaba ballarini EduMetric tizimiga yo'naltiradi."
        confirmText="Ulanishni tasdiqlash"
      />
    </div>
  );
}
