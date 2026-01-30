import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../hooks/useAuth';

// Keep your existing DarkLineage component as is
const DarkLineage = ({ ripples, accentColor }) => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#010105]">
    <svg className="w-full h-full opacity-60">
      {[...Array(22)].map((_, i) => (
        <motion.path
          key={i}
          d={`M ${-500} ${i * 45 - 100} 
             C ${400 + i * 100} ${i % 2 === 0 ? -600 : 1000}, 
               ${1200 - i * 100} ${i % 2 === 0 ? 1500 : -300}, 
               ${2500} ${500 + (i - 11) * 90}`}
          stroke={i % 2 === 0 ? accentColor : "#3B82F6"} 
          strokeWidth={1.5}
          fill="transparent"
          initial={{ pathLength: 1, opacity: 0.1 }}
          animate={{ x: [-120, 120, -120], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 10 + (i % 5), repeat: Infinity, ease: "linear" }}
        />
      ))}
    </svg>
    <AnimatePresence>
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 3.5, opacity: 0 }}
          className="absolute rounded-full border border-white/20 blur-[1px] pointer-events-none"
          style={{ left: ripple.x - 50, top: ripple.y - 50, width: 100, height: 100 }}
        />
      ))}
    </AnimatePresence>
  </div>
);

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [ripples, setRipples] = useState([]);
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const roleConfigs = {
    student: { hex: '#14b8a6', text: 'text-teal-400', border: 'border-teal-500/50', glow: 'shadow-[0_0_60px_rgba(20,184,166,0.3)]', btn: 'bg-teal-500' },
    admin: { hex: '#3b82f6', text: 'text-blue-400', border: 'border-blue-500/50', glow: 'shadow-[0_0_60px_rgba(59,130,246,0.3)]', btn: 'bg-blue-600' },
    club_leader: { hex: '#a855f7', text: 'text-purple-400', border: 'border-purple-500/50', glow: 'shadow-[0_0_60px_rgba(168,85,247,0.3)]', btn: 'bg-purple-600' }
  };

  const current = roleConfigs[role];

  const handleScreenClick = (e) => {
    const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== newRipple.id)), 700);
  };

  return (
    <div onMouseDown={handleScreenClick} className="min-h-screen w-full flex flex-col md:flex-row relative overflow-x-hidden overflow-y-auto bg-black font-mono">
      <DarkLineage ripples={ripples} accentColor={current.hex} />

      {/* LEFT SIDE: BRANDING */}
      <div className="relative z-10 w-full md:w-5/12 flex flex-col justify-center p-8 md:p-20 pt-16 md:pt-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* CIRCLED: // SYSTEM_CORE_SYNC (Increased by 1-2 points on desktop) */}
          <span className={`${current.text} text-[10px] md:text-[13px] font-black tracking-[0.6em] md:tracking-[0.8em] mb-4 md:mb-6 block transition-colors duration-500 uppercase`}>
            // SYSTEM_CORE_SYNC: {role.toUpperCase()}
          </span>
          <h1 className="text-5xl md:text-8xl font-[1000] uppercase tracking-tighter text-white leading-none">
            JOIN <br /> <span className="transition-colors duration-700" style={{ color: current.hex }}>LINEAGE</span>
          </h1>
          <div className={`mt-8 md:mt-14 p-4 md:p-8 border-l-[4px] md:border-l-[6px] transition-all duration-500 ${current.border} bg-white/[0.04] backdrop-blur-md`}>
            <p className="text-white/90 text-sm md:text-xl leading-relaxed font-bold italic">
              "Engineering is 10% calculating stresses and 90% stressing about calculations."
            </p>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="relative z-10 w-full md:w-7/12 flex items-center justify-center p-4 md:p-12 pb-16 md:pb-12">
        <motion.div 
          animate={{ scale: [0.99, 1] }} 
          className={`w-[92%] sm:w-[85%] md:max-w-2xl lg:max-w-3xl backdrop-blur-[100px] bg-black/60 p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border-[3px] transition-all duration-700 ${current.border} ${current.glow}`}
        >
          {/* CIRCLED: TERMINAL HEADER (Increased by 1-2 points on desktop) */}
          <div className="flex items-center gap-3 mb-8 opacity-50 border-b border-white/10 pb-4 md:pb-6">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
             </div>
             <span className="text-white text-[9px] md:text-[12px] ml-2 tracking-widest uppercase font-black">root@campus_os:~/register</span>
          </div>

          {/* CIRCLED: ROLE SELECTION BUTTONS (Increased size for desktop) */}
          <div className="flex justify-between mb-10 md:mb-14 gap-2 md:gap-4 bg-white/5 p-1.5 md:p-2 rounded-2xl border border-white/10">
            {Object.keys(roleConfigs).map((r) => (
              <button 
                key={r} 
                onClick={() => setRole(r)}
                className={`flex-1 py-3 md:py-4 text-[9px] md:text-[12px] font-black uppercase tracking-widest rounded-xl transition-all duration-500 ${role === r ? 'bg-white text-black' : 'text-white/30'}`}
              >
                {r.split('_')[0]}
              </button>
            ))}
          </div>

          <form className="space-y-8 md:space-y-10">
            {/* CIRCLED: NAME and EMAIL labels (.SRC) */}
            {['name', 'email'].map((field) => (
              <div key={field} className="relative group">
                <span className={`absolute -top-3 md:-top-4 left-6 md:left-8 bg-[#020208] px-2 md:px-3 text-[9px] md:text-[12px] font-black tracking-[0.4em] transition-colors duration-500 z-10 ${current.text}`}>
                  {field.toUpperCase()}.SRC
                </span>
                <input 
                  className="w-full px-6 md:px-10 py-4 md:py-6 rounded-2xl bg-white/[0.04] border border-white/10 outline-none text-white font-[1000] focus:border-white/40 transition-all text-base md:text-xl placeholder:text-white/5" 
                  placeholder={`[INPUT_${field.toUpperCase()}]`} 
                />
              </div>
            ))}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
              {/* CIRCLED: KEY and VERIFY labels (.VAL) */}
              {['key', 'verify'].map((field) => (
                <div key={field} className="relative group">
                   <span className={`absolute -top-3 md:-top-4 left-6 md:left-8 bg-[#020208] px-2 md:px-3 text-[9px] md:text-[12px] font-black tracking-[0.4em] transition-colors duration-500 z-10 ${current.text}`}>
                     {field.toUpperCase()}.VAL
                   </span>
                   <input 
                    type="password" 
                    className="w-full px-6 md:px-10 py-4 md:py-6 rounded-2xl bg-white/[0.04] border border-white/10 outline-none text-white font-[1000] focus:border-white/40 transition-all text-base md:text-xl" 
                    placeholder="••••••••" 
                   />
                </div>
              ))}
            </div>
            
            <motion.button 
              whileTap={{ scale: 0.98 }}
              className={`w-full py-5 md:py-7 mt-4 md:mt-6 rounded-2xl text-white font-black uppercase italic text-lg md:text-2xl tracking-tighter transition-all duration-700 shadow-2xl relative overflow-hidden ${current.btn}`}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                EXECUTE_REGISTRATION 🔓
              </span>
              <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
            </motion.button>
          </form>

          {/* CIRCLED: BOTTOM FOOTER (SIGN IN) */}
          <div className="mt-10 md:mt-14 text-center">
            <Link to="/login" className="text-[10px] md:text-[12px] font-black uppercase text-white/40 hover:text-white tracking-[0.4em] transition-all border-b border-transparent hover:border-white/20 pb-1">
              ALREADY REGISTERED? <span className={`transition-colors duration-500 font-black ${current.text}`}>SIGN IN</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}