import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { 
  GraduationCap, Shield, User as UserIcon, Lock, 
  ArrowRight, Sparkles, ShieldCheck,
  ChevronRight, Phone, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'phone' | 'role_select' | 'password'>('phone');
  const [matchedAccounts, setMatchedAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, checkPhone } = useAppContext();
  const navigate = useNavigate();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setIsLoading(true);
    const accounts = await checkPhone(phone);
    setIsLoading(false);

    if (accounts.length === 0) {
      toast.error('Ushbu telefon raqamiga tegishli hisob topilmadi');
      return;
    }

    setMatchedAccounts(accounts);
    if (accounts.length === 1) {
      setSelectedAccount(accounts[0]);
      setStep('password');
    } else {
      setStep('role_select');
    }
  };

  const handleAccountSelect = (account: any) => {
    setSelectedAccount(account);
    setStep('password');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount || !password.trim()) return;

    setIsLoading(true);
    const success = await login(selectedAccount.email, password);
    setIsLoading(false);

    if (success) {
      toast.success(`Xush kelibsiz, ${selectedAccount.name}!`);
      navigate('/');
    } else {
      toast.error('Girish ma\'lumotlari yoki parol xato');
    }
  };

  const handleBack = () => {
    if (step === 'password' && matchedAccounts.length > 1) {
      setStep('role_select');
    } else {
      setStep('phone');
      setSelectedAccount(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#0A9B82]/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#2563EB]/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-[#FFB800]/5 blur-[80px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[32px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.06)] border border-white relative z-10"
      >
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0A9B82] via-[#0A9B82] to-[#087D6A] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-8">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
              PDP University <br />
              <span className="text-white/70">Grant Tizimi</span>
            </h2>
            <p className="text-white/60 mt-4 text-[15px] font-medium max-w-[280px] leading-relaxed">
              Talabalar reytingi, intizom va yutuqlarini boshqarish uchun yaxlit platforma.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Xavfsiz Kirish</p>
                <p className="text-white/50 text-[12px]">Ma'lumotlar to'liq himoyalangan</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Aqlli Monitor</p>
                <p className="text-white/50 text-[12px]">Real-vaqtda tahlil va vizualizatsiya</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-12 text-white/30 text-[11px] font-bold uppercase tracking-[3px]">
            &copy; 2024 PDP UNIVERSITY
          </div>
        </div>

        {/* Right Side: Two-Step Form */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative min-h-[500px]">
          <div className="lg:hidden mb-8 flex items-center gap-3">
             <div className="w-10 h-10 bg-[#0A9B82] rounded-xl flex items-center justify-center shadow-lg shadow-[#0A9B82]/20">
               <GraduationCap className="w-6 h-6 text-white" />
             </div>
             <h1 className="text-xl font-black text-[#0D1F1A] tracking-tight">EduMetric CRM</h1>
          </div>

          <AnimatePresence mode="wait">
            {step === 'phone' && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-3xl font-black text-[#0D1F1A] tracking-tighter">Xush Kelibsiz!</h3>
                  <p className="text-[#6B8A80] text-[15px] font-medium mt-2">Tizimga kirish uchun telefon raqamingizni kiriting</p>
                </div>

                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                  <div className="space-y-2 group">
                    <label className="text-[11px] font-black text-[#9DB4AB] uppercase tracking-widest pl-1">Telefon raqam</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9DB4AB] transition-colors group-focus-within:text-[#0A9B82]" />
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-14 bg-[#F4F7F6] border-2 border-transparent rounded-[18px] pl-12 pr-4 text-[#0D1F1A] text-[15px] font-bold focus:bg-white focus:border-[#0A9B82] focus:shadow-[0_8px_20px_rgba(10,155,130,0.06)] outline-none transition-all placeholder:text-[#9DB4AB]/50"
                        placeholder="+998 90 123 45 67"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="w-full h-14 bg-[#0A9B82] hover:bg-[#087D6A] text-white rounded-[18px] font-bold text-[16px] transition-all shadow-[0_12px_24px_rgba(10,155,130,0.2)] hover:shadow-[0_12px_32px_rgba(10,155,130,0.3)] active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-50"
                  >
                    {isLoading ? 'Tekshirilmoqda...' : 'Davom etish'}
                    <motion.div
                      animate={{ x: isHovered ? 4 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'role_select' && (
              <motion.div
                key="role_select"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <button onClick={handleBack} className="p-2 hover:bg-[#F4F7F6] rounded-xl text-[#6B8A80]">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-2xl font-black text-[#0D1F1A] tracking-tighter">Profilni Tanlang</h3>
                    <p className="text-[#6B8A80] text-[13px] font-medium">Ushbu raqamda bir nechta profil topildi</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {matchedAccounts.map((account) => (
                    <button
                      key={account.email}
                      onClick={() => handleAccountSelect(account)}
                      className="w-full p-4 border border-[#E8EFED] hover:border-[#0A9B82] hover:bg-[#F8FFFE] rounded-2xl flex items-center justify-between text-left transition-all group active:scale-98"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#EDF7F4] border border-[#C6E5DF] flex items-center justify-center overflow-hidden">
                          {account.avatar ? (
                            <img src={account.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-6 h-6 text-[#0A9B82]" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#0D1F1A] text-sm">{account.name}</p>
                          <p className="text-[11px] font-black text-[#0A9B82] uppercase tracking-widest mt-0.5">{account.role}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#9DB4AB] group-hover:text-[#0A9B82] transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'password' && selectedAccount && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <button onClick={handleBack} className="p-2 hover:bg-[#F4F7F6] rounded-xl text-[#6B8A80]">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-2xl font-black text-[#0D1F1A] tracking-tighter">Parolni Kiriting</h3>
                    <p className="text-[#6B8A80] text-[13px] font-medium">Profilingizni tasdiqlang</p>
                  </div>
                </div>

                {/* Selected Profile Summary */}
                <div className="p-4 bg-[#F4F7F6] rounded-2xl flex items-center gap-3 border border-[#E8EFED]">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#C6E5DF] flex items-center justify-center overflow-hidden shadow-sm">
                    {selectedAccount.avatar ? (
                      <img src={selectedAccount.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-6 h-6 text-[#0A9B82]" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#0D1F1A] text-sm">{selectedAccount.name}</p>
                    <p className="text-[10px] font-black text-[#9DB4AB] uppercase tracking-wider">{selectedAccount.role} • {selectedAccount.email}</p>
                  </div>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="space-y-2 group">
                    <label className="text-[11px] font-black text-[#9DB4AB] uppercase tracking-widest pl-1">Parol</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9DB4AB] transition-colors group-focus-within:text-[#0A9B82]" />
                      <input
                        type="password"
                        required
                        autoFocus
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-14 bg-[#F4F7F6] border-2 border-transparent rounded-[18px] pl-12 pr-4 text-[#0D1F1A] text-[15px] font-bold focus:bg-white focus:border-[#0A9B82] focus:shadow-[0_8px_20px_rgba(10,155,130,0.06)] outline-none transition-all placeholder:text-[#9DB4AB]/50"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-[#0A9B82] hover:bg-[#087D6A] text-white rounded-[18px] font-bold text-[16px] transition-all shadow-[0_12px_24px_rgba(10,155,130,0.2)] hover:shadow-[0_12px_32px_rgba(10,155,130,0.3)] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isLoading ? 'Kirilmoqda...' : 'Kirish'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Footer Support Text */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-0 right-0 text-center text-[#9DB4AB] text-[13px] font-medium"
      >
        Savollar bormi? <button className="text-[#0A9B82] font-bold hover:underline">Texnik yordam</button>
      </motion.p>
    </div>
  );
}
