import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { 
  GraduationCap, Shield, User as UserIcon, Lock, 
  ArrowRight, Sparkles, CheckCircle2, ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      toast.success('Xush kelibsiz!');
      navigate('/');
    } else {
      toast.error('Girish ma\'lumotlari xato');
    }
  };

  const demoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    const success = await login(demoEmail, 'password123');
    if (success) {
      toast.success('Demo rejimiga xush kelibsiz!');
      navigate('/');
    } else {
      toast.error('Demo rejimga kirib bo\'lmadi');
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

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
          <div className="lg:hidden mb-8 flex items-center gap-3">
             <div className="w-10 h-10 bg-[#0A9B82] rounded-xl flex items-center justify-center shadow-lg shadow-[#0A9B82]/20">
               <GraduationCap className="w-6 h-6 text-white" />
             </div>
             <h1 className="text-xl font-black text-[#0D1F1A] tracking-tight">EduMetric CRM</h1>
          </div>

          <div className="mb-10">
            <h3 className="text-3xl font-black text-[#0D1F1A] tracking-tighter">Xush Kelibsiz!</h3>
            <p className="text-[#6B8A80] text-[15px] font-medium mt-2">Dasturga kirish uchun ma'lumotlaringizni kiriting</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2 group">
              <label className="text-[11px] font-black text-[#9DB4AB] uppercase tracking-widest pl-1">Login yoki Email</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9DB4AB] transition-colors group-focus-within:text-[#0A9B82]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-[#F4F7F6] border-2 border-transparent rounded-[18px] pl-12 pr-4 text-[#0D1F1A] text-[15px] font-bold focus:bg-white focus:border-[#0A9B82] focus:shadow-[0_8px_20px_rgba(10,155,130,0.06)] outline-none transition-all placeholder:text-[#9DB4AB]/50"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black text-[#9DB4AB] uppercase tracking-widest">Parol</label>
                <button type="button" className="text-[11px] font-black text-[#0A9B82] uppercase tracking-tight hover:underline">Unutdingizmi?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9DB4AB] transition-colors group-focus-within:text-[#0A9B82]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-[#F4F7F6] border-2 border-transparent rounded-[18px] pl-12 pr-4 text-[#0D1F1A] text-[15px] font-bold focus:bg-white focus:border-[#0A9B82] focus:shadow-[0_8px_20px_rgba(10,155,130,0.06)] outline-none transition-all placeholder:text-[#9DB4AB]/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-full h-14 bg-[#0A9B82] hover:bg-[#087D6A] text-white rounded-[18px] font-bold text-[16px] transition-all shadow-[0_12px_24px_rgba(10,155,130,0.2)] hover:shadow-[0_12px_32px_rgba(10,155,130,0.3)] active:scale-[0.98] flex items-center justify-center gap-3 group"
            >
              Tizimga kirish
              <motion.div
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </button>
          </form>

          {/* Optimized Demo Accounts Section */}
          <div className="mt-12 pt-8 border-t border-[#F0F4F3]">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-[#F0F4F3]" />
              <span className="text-[10px] font-black text-[#9DB4AB] uppercase tracking-[3px]">Tezkor Kirish</span>
              <div className="flex-1 h-px bg-[#F0F4F3]" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <DemoButton 
                label="Super Admin" 
                icon={<Shield className="w-4 h-4" />}
                onClick={() => demoLogin('superadmin@pdpu.uz')}
                color="emerald"
              />
              <DemoButton 
                label="Admin" 
                icon={<Shield className="w-4 h-4" />}
                onClick={() => demoLogin('admin@pdpu.uz')}
                color="blue"
              />
              <DemoButton 
                label="Komendant" 
                icon={<Shield className="w-4 h-4" />}
                onClick={() => demoLogin('commandant@pdpu.uz')}
                color="amber"
              />
              <DemoButton 
                label="Talaba" 
                icon={<GraduationCap className="w-4 h-4" />}
                onClick={() => demoLogin('sardor@students.pdpu.uz')}
                color="indigo"
              />
            </div>
          </div>
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

interface DemoButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: 'emerald' | 'blue' | 'amber' | 'indigo';
}

function DemoButton({ label, icon, onClick, color }: DemoButtonProps) {
  const colorStyles = {
    emerald: "bg-[#EDF7F4] text-[#0A9B82] hover:bg-[#0A9B82] hover:text-white border-[#0A9B82]/10",
    blue: "bg-[#EFF6FF] text-[#2563EB] hover:bg-[#2563EB] hover:text-white border-[#2563EB]/10",
    amber: "bg-[#FFFBEB] text-[#D97706] hover:bg-[#D97706] hover:text-white border-[#D97706]/10",
    indigo: "bg-[#F5F3FF] text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white border-[#4F46E5]/10",
  };

  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between px-4 py-3 border rounded-2xl text-[13px] font-bold transition-all hover:shadow-md hover:-translate-y-0.5 group active:scale-95",
        colorStyles[color]
      )}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
    </button>
  );
}
