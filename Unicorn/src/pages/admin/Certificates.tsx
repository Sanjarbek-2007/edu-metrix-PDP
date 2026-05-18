import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  FileCheck, XCircle, Search, Clock, Eye, CheckCircle2, 
  Filter, FileText, Calendar, Building, ChevronDown, Award, X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

export default function Certificates() {
  const { certificates, updateCertificate, students, addPointChange, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  const [rejectReason, setRejectReason] = useState('');
  const [approveForm, setApproveForm] = useState({
    type: 'Milliy',
    score: 4,
    comment: ''
  });

  const certsWithStudentNames = certificates.map(c => {
    const student = students.find(s => s.id === c.studentId);
    return {
      ...c,
      studentName: student?.name || 'Noma\'lum talaba'
    };
  });

  const filteredCerts = certsWithStudentNames.filter(c => {
    const matchesTab = c.status === activeTab;
    const matchesSearch = c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    Pending: certificates.filter(c => c.status === 'Pending').length,
    Approved: certificates.filter(c => c.status === 'Approved').length,
    Rejected: certificates.filter(c => c.status === 'Rejected').length
  };

  const handleApprove = () => {
    if (!selectedCert) return;

    updateCertificate(selectedCert.id, { 
      status: 'Approved',
      pointsAwarded: approveForm.score
    });

    addPointChange({
      studentId: selectedCert.studentId,
      category: 'Amaliyot',
      amount: approveForm.score,
      reason: `${selectedCert.type} sertifikat tasdiqlandi: ${approveForm.comment}`,
      approvedBy: currentUser?.name || 'Admin'
    });

    toast.success(`✓ Tasdiqlandi! +${approveForm.score} ball ${selectedCert.studentName}ning Amaliyot balliga qo'shildi`, {
      position: 'bottom-right',
      className: 'text-sm font-bold border-l-4 border-[#0A9B82]',
      icon: <CheckCircle2 className="w-5 h-5 text-[#0A9B82]" />
    });

    setShowApproveModal(false);
    setSelectedCert(null);
    setApproveForm({ type: 'Milliy', score: 4, comment: '' });
  };

  const handleReject = () => {
    if (!selectedCert || !rejectReason) {
      toast.error('Rad etish sababini ko\'rsatish shart');
      return;
    }

    updateCertificate(selectedCert.id, { 
      status: 'Rejected',
      rejectionReason: rejectReason
    });

    toast.success("Sertifikat rad etildi. Talabaga xabar yuborildi.", {
      position: 'bottom-right',
    });

    setShowRejectModal(false);
    setSelectedCert(null);
    setRejectReason('');
  };

  const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "px-5 py-2.5 text-[13px] font-bold transition-all rounded-lg flex items-center gap-2",
        activeTab === id 
          ? "bg-white text-[#0A9B82] shadow-sm border border-[#E8EFED] ring-1 ring-[#0A9B82]/10" 
          : "text-[#9DB4AB] hover:text-[#6B8A80]"
      )}
    >
      {label}
      <span className={cn(
        "px-1.5 py-0.5 rounded-md text-[10px] font-black",
        activeTab === id ? "bg-[#0A9B82] text-white" : "bg-[#F3F4F6] text-[#9DB4AB]"
      )}>
        {stats[id]}
      </span>
    </button>
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E8EFED]">
        <div>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Sertifikatlarni ko'rib chiqish</h1>
          <p className="text-[13px] text-[#6B8A80] mt-1 font-medium">Talabalar tomonidan topshirilgan yutuqlar nazorati</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-[#F8FFFE] p-4 rounded-xl border border-[#E8EFED]">
        <div className="flex bg-[#F3F4F6] p-1 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
          <TabButton id="Pending" label="Kutilmoqda" />
          <TabButton id="Approved" label="Tasdiqlangan" />
          <TabButton id="Rejected" label="Rad etilgan" />
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DB4AB]" />
          <input 
            type="text" 
            placeholder="Talaba ismini qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 h-10 bg-white border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#0A9B82] transition-all text-[#0D1F1A]"
          />
        </div>
      </div>

      {filteredCerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={cert.id} 
              className="bg-white border border-[#E8EFED] rounded-[14px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)] flex flex-col hover:shadow-md transition-shadow relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-[#0D1F1A] truncate max-w-[200px]">{cert.studentName}</h4>
                  <p className="text-[11px] text-[#9DB4AB] font-medium uppercase mt-0.5 tracking-tight">{cert.type} Sertifikati</p>
                </div>
                <span className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                  cert.status === 'Pending' ? "bg-[#FFFBEB] text-[#D97706]" :
                  cert.status === 'Approved' ? "bg-[#EDF7F4] text-[#0A9B82]" :
                  "bg-[#FEF2F2] text-[#DC2626]"
                )}>
                  {cert.status === 'Pending' ? 'KUTILMOQDA' : 
                   cert.status === 'Approved' ? 'TASDIQLANGAN' : 'RAD ETILGAN'}
                </span>
              </div>

              <div className="space-y-2 mb-6 flex-1">
                <div className="flex items-center gap-2 text-[#6B8A80]">
                  <Calendar className="w-3.5 h-3.5 text-[#9DB4AB]" />
                  <span className="text-xs font-semibold">{new Date(cert.uploadDate || cert.date).toLocaleDateString()}</span>
                </div>
                {cert.organization && (
                  <div className="flex items-center gap-2 text-[#6B8A80]">
                    <Building className="w-3.5 h-3.5 text-[#9DB4AB]" />
                    <span className="text-xs font-semibold truncate">{cert.organization}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[#6B8A80]">
                  <FileText className="w-3.5 h-3.5 text-[#9DB4AB]" />
                  <span className="text-xs font-semibold">Sertifikat fayli yuklangan</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <button 
                  onClick={() => { setSelectedCert(cert); setShowPreviewModal(true); }}
                  className="flex-1 h-9 bg-white border border-[#D1D5DB] text-[#374151] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:border-[#0A9B82] hover:text-[#0A9B82] transition-all"
                >
                  <Eye className="w-4 h-4" /> Ko'rish
                </button>
                
                {cert.status === 'Pending' && (
                  <>
                    <button 
                      onClick={() => { setSelectedCert(cert); setShowApproveModal(true); }}
                      className="flex-1 h-9 bg-[#0A9B82] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#087D6A] transition-all"
                    >
                      Tasdiqlash
                    </button>
                    <button 
                      onClick={() => { setSelectedCert(cert); setShowRejectModal(true); }}
                      className="px-2.5 h-9 bg-[#FEF2F2] text-[#DC2626] rounded-lg flex items-center justify-center hover:bg-[#FEE2E2] transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {cert.status === 'Approved' && (
                <div className="mt-4 pt-4 border-t border-[#F0F4F3] flex items-center gap-2 text-[#0A9B82]">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-tight">Berilgan ball: +{cert.pointsAwarded || 4}</span>
                </div>
              )}

              {cert.status === 'Rejected' && (
                <div className="mt-4 pt-4 border-t border-[#F0F4F3]">
                  <p className="text-[11px] text-[#DC2626] font-medium leading-relaxed">
                    <span className="font-bold">Rad etilish sababi:</span> {cert.rejectionReason}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 bg-white rounded-2xl border border-[#E8EFED] flex flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 bg-[#F8FFFE] rounded-full flex items-center justify-center mb-6">
            {activeTab === 'Pending' ? <CheckCircle2 className="w-10 h-10 text-[#0A9B82]" /> :
             activeTab === 'Approved' ? <FileCheck className="w-10 h-10 text-[#0A9B82]" /> :
             <XCircle className="w-10 h-10 text-[#DC2626]" />}
          </div>
          <h4 className="text-lg font-bold text-[#0D1F1A]">Hozircha hech narsa yo'q</h4>
          <p className="text-[13px] text-[#6B8A80] mt-1 max-w-[280px]">Ushbu bo'limda {activeTab === 'Pending' ? 'kutilayotgan' : activeTab === 'Approved' ? 'tasdiqlangan' : 'rad etilgan'} sertifikatlar mavjud emas.</p>
        </div>
      )}

      {/* Approve Modal */}
      <AnimatePresence>
        {showApproveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowApproveModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-[480px] bg-white rounded-2xl p-6 shadow-2xl relative z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#0D1F1A]">Sertifikatni tasdiqlash</h3>
                <button onClick={() => setShowApproveModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-[#9DB4AB]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider">Ball turi</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Mahalliy', 'Milliy', 'Xalqaro'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setApproveForm(prev => ({ ...prev, type: t, score: t === 'Xalqaro' ? 6 : t === 'Milliy' ? 4 : 2 }))}
                        className={cn(
                          "py-2.5 rounded-lg border text-xs font-bold transition-all",
                          approveForm.type === t ? "bg-[#EDF7F4] border-[#0A9B82] text-[#0A9B82]" : "border-[#D1D5DB] text-[#6B8A80] hover:bg-slate-50"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider">Aniq ball</label>
                  <input 
                    type="number" 
                    value={approveForm.score}
                    onChange={(e) => setApproveForm(prev => ({ ...prev, score: parseInt(e.target.value) }))}
                    className="w-full h-10 px-4 bg-white border border-[#D1D5DB] rounded-lg text-sm font-bold focus:border-[#0A9B82] outline-none shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider">Talabaga izoh</label>
                  <textarea 
                    rows={3} 
                    value={approveForm.comment}
                    onChange={(e) => setApproveForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Masalan: IELTS 7.5 sertifikati uchun 4 ball berildi"
                    className="w-full p-4 bg-white border border-[#D1D5DB] rounded-lg text-sm font-medium focus:border-[#0A9B82] outline-none shadow-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-8">
                <button 
                  onClick={() => setShowApproveModal(false)}
                  className="h-10 px-6 text-[13px] font-bold text-[#6B8A80] hover:text-[#0D1F1A]"
                >
                  Bekor qilish
                </button>
                <button 
                  onClick={handleApprove}
                  className="h-10 px-8 bg-[#0A9B82] text-white rounded-lg text-[13px] font-bold shadow-lg shadow-[#0A9B82]/20 hover:bg-[#087D6A] transition-all"
                >
                  Tasdiqlash
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowRejectModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-[480px] bg-white rounded-2xl p-6 shadow-2xl relative z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#0D1F1A]">Sertifikatni rad etish</h3>
                <button onClick={() => setShowRejectModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-[#9DB4AB]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-[#6B8A80] font-medium leading-relaxed">
                  Sertifikatni rad etayotganingizning sababini yozing. Bu xabar talabaga yuboriladi.
                </p>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider">Rad etish sababi:</label>
                  <textarea 
                    rows={4} 
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Masalan: Sertifikat muddati o'tgan yoki fayl sifati past..."
                    className="w-full p-4 bg-white border border-[#D1D5DB] rounded-lg text-sm font-medium focus:border-[#0A9B82] outline-none shadow-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-8">
                <button 
                  onClick={() => setShowRejectModal(false)}
                  className="h-10 px-6 text-[13px] font-bold text-[#6B8A80] hover:text-[#0D1F1A]"
                >
                  Bekor qilish
                </button>
                <button 
                  onClick={handleReject}
                  className="h-10 px-8 bg-[#DC2626] text-white rounded-lg text-[13px] font-bold shadow-lg shadow-[#DC2626]/20 hover:bg-[#B91C1C] transition-all"
                >
                  Rad etish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPreviewModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-[700px] bg-white rounded-2xl overflow-hidden shadow-2xl relative z-10"
            >
              <div className="p-6 border-b border-[#E8EFED] flex items-center justify-between bg-[#F8FFFE]">
                <div>
                  <h3 className="text-lg font-bold text-[#0D1F1A]">Faylni ko'rish</h3>
                  <p className="text-[12px] text-[#9DB4AB] font-bold uppercase tracking-tight mt-0.5">Sertifikat ID: {selectedCert?.id?.slice(0, 8)}</p>
                </div>
                <button onClick={() => setShowPreviewModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-[#9DB4AB] hover:text-[#0D1F1A] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 bg-[#F3F4F6] min-h-[400px] flex items-center justify-center">
                <div className="w-full max-w-md aspect-[1.4/1] bg-white rounded-lg shadow-inner border-2 border-dashed border-[#D1D5DB] flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-[#F8FFFE] rounded-full flex items-center justify-center mb-6">
                    <FileText className="w-8 h-8 text-[#0A9B82]" />
                  </div>
                  <h4 className="text-lg font-bold text-[#0D1F1A]">{selectedCert?.studentName} - Sertifikat</h4>
                  <p className="text-[13px] text-[#6B8A80] mt-1">Ushbu joyda sertifikatning PDF yoki rasm fayli ko'rsatiladi.</p>
                  <div className="mt-8 flex gap-4">
                    <div className="text-left px-4 py-3 bg-white border border-[#E8EFED] rounded-xl">
                      <p className="text-[10px] font-bold text-[#9DB4AB] uppercase tracking-wider mb-0.5">Talaba ID</p>
                      <p className="text-sm font-bold text-[#0D1F1A] tracking-tight">ST-2024-001</p>
                    </div>
                    <div className="text-left px-4 py-3 bg-white border border-[#E8EFED] rounded-xl">
                      <p className="text-[10px] font-bold text-[#9DB4AB] uppercase tracking-wider mb-0.5">Turi</p>
                      <p className="text-sm font-bold text-[#0D1F1A] tracking-tight">{selectedCert?.type}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#E8EFED] flex items-center justify-end bg-[#F8FFFE]">
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  className="h-10 px-8 bg-white border border-[#D1D5DB] text-[#374151] rounded-lg text-[13px] font-bold hover:bg-slate-50 transition-all"
                >
                  Yopish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
