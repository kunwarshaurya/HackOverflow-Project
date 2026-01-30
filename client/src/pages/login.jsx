import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../hooks/useAuth';

// LIGHTNING SPARK COMPONENT
const LightningSpark = ({ x, y, color }) => {
  // Generates a jagged path for the spark
  const sparkPath = `M 0 0 L ${Math.random() * 20 - 10} ${Math.random() * 20 - 10} L ${Math.random() * 40 - 20} ${Math.random() * 40 - 20}`;
  
  return (
    <motion.svg
      initial={{ opacity: 1, scale: 0.5 }}
      animate={{ opacity: 0, scale: 1.5 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute pointer-events-none z-50"
      style={{ left: x - 20, top: y - 20, width: 40, height: 40 }}
      viewBox="0 0 40 40"
    >
      <motion.path
        d={sparkPath}
        stroke={color}
        strokeWidth="2"
        fill="transparent"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
    </motion.svg>
  );
};

const DarkLineage = ({ accentColor }) => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#010105]">
    <svg className="w-full h-full opacity-60">
      {[...Array(22)].map((_, i) => (
        <motion.path
          key={i}
          d={`M ${-500} ${i * 45 - 100} C ${400 + i * 100} ${i % 2 === 0 ? -600 : 1000}, ${1200 - i * 100} ${i % 2 === 0 ? 1500 : -300}, ${2500} ${500 + (i - 11) * 90}`}
          stroke={i % 2 === 0 ? accentColor : "#3B82F6"} 
          strokeWidth={1.5}
          fill="transparent"
          initial={{ pathLength: 1, opacity: 0.1 }}
          animate={{ x: [-120, 120, -120], opacity: [0.1, 0.4, 0.1], strokeWidth: [1.2, 2.5, 1.2] }}
          transition={{ duration: 10 + (i % 5), repeat: Infinity, ease: "linear" }}
        />
      ))}
    </svg>
  </div>
);

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('User'); 
  const [sparks, setSparks] = useState([]);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const roleConfigs = {
    'User': { hex: '#14b8a6', accent: 'bg-teal-500', glow: 'shadow-[0_0_60px_rgba(20,184,166,0.4)]', text: 'text-teal-400' },
    'Admin': { hex: '#3b82f6', accent: 'bg-blue-600', glow: 'shadow-[0_0_60px_rgba(59,130,246,0.4)]', text: 'text-blue-400' },
    'Club Lead': { hex: '#a855f7', accent: 'bg-purple-600', glow: 'shadow-[0_0_60px_rgba(168,85,247,0.4)]', text: 'text-purple-400' }
  };

  const current = roleConfigs[role];

  const handleScreenClick = (e) => {
    const id = Date.now();
    setSparks((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setSparks((prev) => prev.filter((s) => s.id !== id)), 400);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.email, formData.password, role);
    if (result.success) navigate('/dashboard');
    else setLoading(false);
  };

  return (
    <div onMouseDown={handleScreenClick} className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-black font-mono p-4">
      <DarkLineage accentColor={current.hex} />
      
      <AnimatePresence>
        {sparks.map((spark) => (
          <LightningSpark key={spark.id} x={spark.x} y={spark.y} color={current.hex} />
        ))}
      </AnimatePresence>

      <motion.div 
        animate={{ scale: [0.99, 1] }}
        className={`relative z-10 w-[92%] sm:w-[85%] md:max-w-2xl lg:max-w-[800px] max-h-[90vh] overflow-hidden backdrop-blur-[60px] bg-black/60 rounded-[2.5rem] md:rounded-[4rem] border-[3px] transition-all duration-700 border-white/20 ${current.glow} p-6 sm:p-10 md:p-14`}
      >
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-4xl md:text-7xl lg:text-7xl font-[1000] uppercase italic tracking-tighter text-white transition-colors duration-700" style={{ color: current.hex }}>
            {role}
          </h2>
          <p className="text-white/60 font-black text-[10px] md:text-xs tracking-[0.8em] uppercase mt-2">SECURE ACCESS PORTAL</p>
        </div>

        <div className="relative flex bg-white/5 p-1.5 rounded-2xl mb-8 md:mb-12 border border-white/10">
          <motion.div 
            className={`absolute inset-y-1.5 rounded-xl ${current.accent} shadow-xl`}
            animate={{ x: role === 'User' ? '0%' : role === 'Admin' ? '100%' : '200%' }}
            style={{ width: 'calc(100% / 3 - 6px)' }} 
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
          />
          {['User', 'Admin', 'Club Lead'].map((item) => (
            <button key={item} onClick={(e) => { e.stopPropagation(); setRole(item); }} className={`relative z-10 flex-1 py-2 md:py-4 text-[11px] md:text-base font-[1000] uppercase tracking-widest transition-all duration-300 ${role === item ? 'text-white' : 'text-white/30'}`}>{item}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
          {/* Identity Field */}
          <div className="relative group">
            <span className={`absolute -top-3 md:-top-4 left-6 md:left-10 bg-[#08080c] px-2 text-[10px] md:text-sm font-black tracking-[0.4em] transition-colors duration-500 z-10 ${current.text}`}>IDENTITY.SRC</span>
            <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-8 md:px-12 py-4 md:py-6 rounded-2xl bg-white/[0.03] border border-white/10 outline-none font-[1000] text-white focus:border-white/40 transition-all text-lg md:text-2xl placeholder:text-white/5" placeholder="[ID@COLLEGE.EDU]" required />
          </div>
          {/* Access Field */}
          <div className="relative group">
            <span className={`absolute -top-3 md:-top-4 left-6 md:left-10 bg-[#08080c] px-2 text-[10px] md:text-sm font-black tracking-[0.4em] transition-colors duration-500 z-10 ${current.text}`}>ACCESS.VAL</span>
            <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full px-8 md:px-12 py-4 md:py-6 rounded-2xl bg-white/[0.03] border border-white/10 outline-none font-[1000] text-white focus:border-white/40 transition-all text-lg md:text-2xl" placeholder="••••••••" required />
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`relative w-full py-5 md:py-8 mt-4 rounded-2xl text-white font-black uppercase italic text-xl md:text-3xl tracking-tighter transition-all duration-700 shadow-2xl overflow-hidden ${current.accent}`}>
            <span className="relative z-10 flex items-center justify-center gap-4">{loading ? 'SYNCING...' : 'UNLOCK PORTAL 🔓'}</span>
            <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
          </motion.button>
        </form>

        <div className="mt-8 md:mt-12 text-center">
          <Link to="/signup" className="text-[10px] md:text-sm font-black uppercase text-white/30 hover:text-white tracking-[0.4em] transition-all">NEW IDENTITY? <span className={`transition-colors duration-500 font-black ${current.text}`}>REGISTER</span></Link>
        </div>
      </motion.div>
    </div>
  );
}