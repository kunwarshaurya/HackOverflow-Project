import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('User'); 
  const roles = ['User', 'Admin', 'Club Lead'];

  // Updated with vibrant Purple for Club Lead and stronger background tints
  const themes = {
    'User': { accent: 'bg-[#FF4D00]', bg: 'bg-[#FFE8D6]' },     // Deep Orange
    'Admin': { accent: 'bg-[#0070FF]', bg: 'bg-[#D6E8FF]' },    // Strong Blue
    'Club Lead': { accent: 'bg-[#7C3AED]', bg: 'bg-[#F3E8FF]' } // Vibrant Purple
  };

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(formData.email, formData.password, role);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
    setLoading(false);
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-700 ${themes[role].bg}`}>
      
      {/* INCREASED BACKGROUND INTENSITY: Tech Grid + Glowing Aura */}
      <div className="absolute inset-0 z-0 opacity-[0.08]" style={{ backgroundImage: `radial-gradient(#000 3px, transparent 3px)`, backgroundSize: '40px 40px' }} />
      <div className={`absolute inset-0 z-0 opacity-20 blur-[150px] transition-colors duration-700 ${themes[role].accent}`} />

      {/* VIBRANT RED LANYARD RIBBON */}
      <div className="absolute top-0 w-16 h-48 bg-[#D00000] shadow-2xl z-0 rounded-b-xl border-x-4 border-black/10 flex justify-center items-end pb-4">
         <div className="w-10 h-10 bg-gray-300 rounded-full border-4 border-gray-400 shadow-inner" />
      </div>

      <motion.div 
        layout
        className="relative z-10 max-w-md w-full bg-white rounded-[2.5rem] border-[5px] border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] pt-14 p-10 mt-24"
      >
        {/* ID CARD PUNCH HOLE */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-6 bg-gray-200 rounded-full border-2 border-black/20 shadow-inner" />

        <div className="text-center mb-10">
          <h2 className="text-5xl font-[1000] uppercase italic tracking-tighter text-black leading-none">
            {role}
          </h2>
          <p className="text-[12px] font-black text-black/40 tracking-[0.4em] uppercase mt-3">Campus ID System</p>
        </div>

        {/* SEAMLESS TRANSITION SLIDER */}
        <div className="relative flex bg-black/5 p-1.5 rounded-2xl mb-12 border-[3px] border-black">
          <motion.div 
            className={`absolute inset-y-1.5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${themes[role].accent}`}
            initial={false}
            animate={{ 
              x: role === 'User' ? '0%' : role === 'Admin' ? '100%' : '200%' 
            }}
            style={{ width: 'calc(100% / 3 - 6px)' }} 
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
          />
          
          {roles.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRole(item)}
              className={`relative z-10 flex-1 py-3 text-[11px] font-[1000] uppercase tracking-widest transition-colors duration-300 ${
                role === item ? 'text-white' : 'text-black'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 text-left">
          <div className="space-y-2">
            <label className="text-[11px] font-[1000] uppercase text-black tracking-widest ml-1">Identity Mail</label>
            <input
              type="email"
              className="w-full px-6 py-5 rounded-2xl border-[4px] border-black outline-none font-black text-black focus:bg-gray-50 transition-all"
              placeholder="id@college.edu"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-[1000] uppercase text-black tracking-widest ml-1">Access Code</label>
            <input
              type="password"
              className="w-full px-6 py-5 rounded-2xl border-[4px] border-black outline-none font-black text-black focus:bg-gray-50 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className={`w-full py-5 text-white font-[1000] uppercase italic text-2xl rounded-2xl border-[4px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-2 active:translate-y-2 transition-all ${themes[role].accent}`}
          >
            {loading ? 'VERIFYING...' : 'UNLOCK PORTAL 🔓'}
          </button>
        </form>

        <div className="mt-12 text-center border-t-4 border-dotted border-black/10 pt-8">
          <Link to="/signup" className="text-[11px] font-[1000] uppercase tracking-widest text-black/30 hover:text-black">
            Issue New Badge →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}