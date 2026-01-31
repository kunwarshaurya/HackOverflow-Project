import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Calendar, BarChart3, ShieldCheck, Zap, 
  MessageSquare, Box, ArrowRight, Activity, Clock, 
  CheckCircle2, TrendingUp, Lock, FileCheck, AlertCircle, 
  Shield, ChevronRight, Layout, Globe, Cpu, UserCircle, 
  Settings, Layers, Bell, Search, Menu, X, Mail, Sparkles,
  Trophy, Target, Rocket, Share2, Filter, PieChart, Database,
  ArrowDown, MousePointer2, Scan, Fingerprint, Terminal,
  ExternalLink, Workflow, ShieldAlert, HardDrive, Camera,
  Image as ImageIcon, Eye, Smartphone, Instagram, Twitter, Linkedin,
  TrendingUp as TrendingIcon, ShieldCheck as ShieldIcon, Clock as ClockIcon,
  Search as SearchIcon, RefreshCw
} from 'lucide-react';

import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const updateScroll = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(currentScroll / scrollHeight);
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);
  return progress;
};

const Orb = ({ size, color, top, left, delay }) => (
  <div 
    className="absolute rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none animate-pulse-slow"
    style={{ width: size, height: size, backgroundColor: color, top, left, animationDelay: `${delay}s` }} 
  />
);

// --- AUTH GATEWAY (UPDATED LOGIC) ---
const AuthGateway = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  // Logic to clear data on tab switch
  const handleTabSwitch = (loginState) => {
    setIsLogin(loginState);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'student'
    });
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } else {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'student' // Registration defaults to student per logic
      });
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    }
  };
  
  return (
    <div className="w-full max-w-lg bg-white border-[8px] border-[#493129] rounded-[3rem] shadow-[20px_20px_0px_0px_#493129] overflow-hidden relative z-20 transition-all duration-500 hover:shadow-[30px_30px_0px_0px_#8b597b]">
      <div className="bg-[#493129] px-8 py-4 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#efa3a0] animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffdec7]"></div>
        </div>
        <span className="text-white/40 font-mono text-xs uppercase tracking-widest font-black">auth_protocol_v5.4</span>
      </div>

      <div className="flex bg-[#ffeadb] border-b-[8px] border-[#493129]">
        <button onClick={() => handleTabSwitch(true)} className="flex-1 py-6 font-black uppercase tracking-widest text-sm transition-all relative">
          {isLogin && <div className="absolute top-0 left-0 w-full h-1.5 bg-[#8b597b]"></div>}
          Existing Node
        </button>
        <button onClick={() => handleTabSwitch(false)} className="flex-1 py-6 font-black uppercase tracking-widest text-sm transition-all relative">
          {!isLogin && <div className="absolute top-0 left-0 w-full h-1.5 bg-[#efa3a0]"></div>}
          New Identity
        </button>
      </div>

      <div className="p-10 md:p-14 space-y-8">
        <div className="space-y-1">
            <h3 className="text-4xl font-black text-[#493129] uppercase tracking-tighter">{isLogin ? "Boot Portal." : "Create ID."}</h3>
            <p className="text-sm font-bold text-[#8b597b] uppercase tracking-[0.4em]">{isLogin ? "Role-Specific Credentials Required" : "Initial Node Provisioning"}</p>
        </div>

        {/* ROLE PICKER: ONLY SHOW FOR EXISTING NODE (LOGIN) - REMOVED FOR SIMPLICITY */}

        {error && (
          <div className="bg-red-100 border-4 border-red-400 text-red-700 px-4 py-3 rounded-2xl">
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="FULL LEGAL NAME" 
              className="w-full bg-[#ffeadb] border-4 border-[#493129] rounded-2xl p-5 font-bold placeholder:text-[#493129]/20 focus:outline-none focus:bg-white transition-all text-base" 
              required
            />
          )}
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="INSTITUTIONAL EMAIL" 
            className="w-full bg-[#ffeadb] border-4 border-[#493129] rounded-2xl p-5 font-bold placeholder:text-[#493129]/20 focus:outline-none focus:bg-white transition-all text-base" 
            required
          />
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="SECURE KEY" 
            className="w-full bg-[#ffeadb] border-4 border-[#493129] rounded-2xl p-5 font-bold placeholder:text-[#493129]/20 focus:outline-none focus:bg-white transition-all text-base" 
            required
          />

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#493129] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-lg shadow-[10px_10px_0px_0px_#efa3a0] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? 'PROCESSING...' : (isLogin ? 'BOOT ACCESS' : 'SYNC ID')} 
            {!loading && <ArrowRight size={24} />}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- REST OF COMPONENTS REMAIN THE SAME ---
const MissionSection = () => (
  <section className="py-32 px-10 bg-white relative z-10 border-b-[8px] border-[#493129]">
    <div className="max-w-[1200px] mx-auto text-center space-y-12">
      <span className="text-[#efa3a0] font-black uppercase tracking-[0.5em] text-sm">THE MISSION</span>
      <h2 className="text-5xl md:text-7xl font-black text-[#493129] leading-tight tracking-tight uppercase">
        WE BELIEVE CAMPUS LIFE SHOULD BE <br/>
        <span className="relative inline-block px-4 ml-2 group cursor-default">
          <span className="relative z-10">VIBRANT,</span>
          <div className="absolute inset-0 bg-[#ffdec7] border-4 border-[#493129] -rotate-2 group-hover:rotate-0 group-hover:bg-[#efa3a0] transition-all duration-300"></div>
        </span> NOT BURIED IN PAPERWORK.
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
        {[
          { title: "SAVE TIME", desc: "Automated workflows mean approvals happen in minutes, not days. Get back to what matters.", icon: ClockIcon },
          { title: "BOOST ENGAGEMENT", desc: "Centralized discovery helps students find clubs they actually care about. No more empty rooms.", icon: TrendingIcon },
          { title: "STAY SECURE", desc: "Role-based access ensures only the right people press the big red buttons. Sleep easy.", icon: ShieldIcon }
        ].map((item, i) => (
          <div key={i} className="group relative p-10 border-[6px] border-[#493129] rounded-[2.5rem] bg-white text-left space-y-6 hover:shadow-[16px_16px_0px_0px_#493129] transition-all duration-500 overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-[#efa3a0] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
            <div className="relative z-10">
                <div className="w-20 h-20 bg-[#493129] text-white rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-[#493129] transition-colors duration-300">
                  <item.icon size={48} />
                </div>
                <h4 className="text-2xl font-black uppercase mt-6 group-hover:text-white transition-colors duration-300">{item.title}</h4>
                <p className="font-bold text-[#493129]/60 leading-relaxed group-hover:text-[#493129] transition-colors duration-300">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ChaosSection = () => {
  return (
    <section className="py-32 px-10 bg-[#ffeadb] border-b-[8px] border-[#493129] relative z-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <h2 className="text-7xl font-black text-[#493129] leading-[0.8] tracking-tighter uppercase">
            CHAOS <br/> <span className="text-[#8b597b]">NEUTRALIZED.</span>
          </h2>
          <p className="text-2xl font-bold text-[#493129]/60 max-w-lg">
            Stop juggling Google Forms and WhatsApp groups. We built a central nervous system for your campus.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border-4 border-[#493129] rounded-2xl p-6 shadow-[8px_8px_0px_0px_#493129] group overflow-hidden">
               <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <Lock size={24} className="opacity-20 group-hover:rotate-12 transition-transform" />
               </div>
               <h5 className="font-black uppercase text-sm tracking-widest mb-4">RBAC SECURITY</h5>
               <div className="h-16 bg-stone-100 rounded-lg border-2 border-[#493129]/10 flex items-center justify-between px-4 overflow-hidden relative">
                  <div className="flex flex-col gap-1">
                     <div className="w-16 h-1.5 bg-[#493129]/10 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-[#efa3a0] animate-scan-fast"></div>
                     </div>
                     <span className="text-[10px] font-black opacity-40 uppercase tracking-tighter">ENCRYPTING...</span>
                  </div>
                  <div className="text-sm font-black text-green-600 bg-green-50 px-4 py-1 rounded border-2 border-green-200 animate-pulse">SECURE</div>
               </div>
            </div>

            <div className="bg-white border-4 border-[#493129] rounded-2xl p-6 shadow-[8px_8px_0px_0px_#493129] group">
               <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  </div>
                  <BarChart3 size={24} className="opacity-20" />
               </div>
               <h5 className="font-black uppercase text-sm tracking-widest mb-4">ANALYTICS</h5>
               <div className="h-16 bg-stone-100 rounded-lg border-2 border-[#493129]/10 flex items-end justify-center gap-1 p-2">
                  <div className="w-full bg-[#8b597b] animate-grow-bounce" style={{ height: '40%' }}></div>
                  <div className="w-full bg-[#efa3a0] animate-grow-bounce" style={{ height: '80%', animationDelay: '0.2s' }}></div>
                  <div className="w-full bg-[#8b597b] animate-grow-bounce" style={{ height: '60%', animationDelay: '0.4s' }}></div>
                  <div className="w-full bg-[#efa3a0] animate-grow-bounce" style={{ height: '90%', animationDelay: '0.1s' }}></div>
                  <div className="w-full bg-[#8b597b] animate-grow-bounce" style={{ height: '30%', animationDelay: '0.5s' }}></div>
               </div>
            </div>

            <div className="bg-white border-4 border-[#493129] rounded-2xl p-6 shadow-[8px_8px_0px_0px_#493129] group relative overflow-hidden">
               <div className="flex gap-1 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
               </div>
               <h5 className="font-black uppercase text-sm tracking-widest mb-4">CONFLICT AI</h5>
               <div className="h-16 bg-[#493129] rounded-lg border-2 border-[#493129]/10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(239,163,160,0.1)_10%,transparent_100%)] animate-ping"></div>
                  <div className="absolute w-full h-[1px] bg-[#efa3a0] shadow-[0_0_10px_#efa3a0] animate-scan-vert"></div>
                  <span className="text-xs font-black text-[#efa3a0] uppercase tracking-[0.2em] relative z-10">SCANNING...</span>
               </div>
            </div>

            <div className="bg-white border-4 border-[#493129] rounded-2xl p-6 shadow-[8px_8px_0px_0px_#493129] group">
               <div className="flex gap-1 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#efa3a0]"></div>
                  <div className="w-3 h-3 rounded-full bg-stone-200"></div>
               </div>
               <h5 className="font-black uppercase text-sm tracking-widest mb-4">APPROVALS</h5>
               <div className="h-16 bg-stone-100 rounded-lg border-2 border-[#493129]/10 flex items-center justify-center gap-3 group-hover:bg-[#ffeadb] transition-colors">
                  <FileCheck size={28} className="text-[#493129] animate-bounce-slow" />
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-tighter">ID: #4012</span>
                    <span className="text-xs font-bold text-green-600 uppercase">VERIFIED</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
        
        <div className="relative group">
           <div className="absolute inset-0 bg-[#8b597b] border-[8px] border-[#493129] rounded-[4rem] translate-x-6 translate-y-6"></div>
           <div className="relative bg-[#493129] border-[8px] border-[#493129] rounded-[4rem] overflow-hidden aspect-square flex flex-col">
              <div className="bg-white p-6 flex justify-between items-center border-b-8 border-[#493129]">
                 <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-sm font-black uppercase">Live_Transmission: Auditorium</span>
                 </div>
                 <RefreshCw size={24} className="animate-spin-slow opacity-20" />
              </div>
              <div className="flex-1 bg-stone-200 relative grayscale group-hover:grayscale-0 transition-all duration-700">
                 <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800" className="w-full h-full object-cover" alt="Control" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                 <div className="absolute bottom-10 left-10 text-white space-y-2">
                    <span className="text-xs font-black uppercase tracking-widest opacity-60">Dashboard View_OS v5.4</span>
                    <h3 className="text-6xl font-black uppercase leading-none transform translate-y-4 group-hover:translate-y-0 transition-transform">COMPLETE <br/> CONTROL</h3>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

const StackingTab = ({ index, title, icon: Icon, color, content, features }) => {
    const zIndex = 10 + index;
    const stickyTop = 140 + (index * 45);
    return (
        <div className="sticky w-full mb-20 md:mb-32 transition-all duration-700" style={{ top: `${stickyTop}px`, zIndex }}>
            <div className={`w-full min-h-[500px] border-[8px] border-[#493129] rounded-[4rem] shadow-[20px_20px_0px_0px_#493129] overflow-hidden flex flex-col md:flex-row ${color} transition-all`}>
                <div className="md:w-5/12 p-12 flex flex-col justify-between">
                    <div>
                        <div className="w-20 h-20 bg-white border-4 border-[#493129] rounded-2xl flex items-center justify-center shadow-xl mb-8 transform -rotate-6">
                            <Icon size={40} className="text-[#493129]" />
                        </div>
                        <span className="font-black text-[#493129]/40 uppercase tracking-[0.6em] text-xs">Layer_0{index + 1}</span>
                        <h3 className="text-5xl md:text-6xl font-black text-[#493129] uppercase tracking-tighter leading-none mt-4">{title}</h3>
                    </div>
                    <p className="text-xl font-bold text-[#493129]/70 leading-tight border-l-8 border-[#493129] pl-8 mt-10">{content}</p>
                </div>
                <div className="md:w-7/12 bg-white/40 p-12 md:p-16 border-t-[8px] md:border-t-0 md:border-l-[8px] border-[#493129] backdrop-blur-md">
                    <div className="grid gap-8">
                        {features.map((feat, i) => (
                            <div key={i} className="flex items-start gap-6 group">
                                <div className="w-12 h-12 bg-[#493129] text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg shrink-0 group-hover:bg-[#8b597b] transition-colors">{i + 1}</div>
                                <div>
                                    <h4 className="text-2xl font-black text-[#493129] uppercase tracking-tight mb-1">{feat.label}</h4>
                                    <p className="font-bold text-[#493129]/60 text-sm leading-relaxed">{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const VisualArchive = () => {
    const row1 = [
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600",
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b955?q=80&w=600",
        "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=600"
    ];
    const row2 = [
        "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600",
        "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=600",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600",
        "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600",
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600"
    ];
    return (
        <section id="gallery" className="py-32 bg-white border-y-[8px] border-[#493129] overflow-hidden relative z-10">
            <div className="max-w-[1400px] mx-auto px-10 mb-16">
                <span className="text-[#8b597b] font-black uppercase tracking-[0.5em] text-sm">Visual_Ledger // Media</span>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mt-4 text-[#493129]">THE ARCHIVE.</h2>
            </div>
            <div className="space-y-8">
                <div className="flex gap-8 animate-marquee whitespace-nowrap">
                    {[...row1, ...row1].map((img, i) => (
                        <div key={i} className="w-[350px] h-[250px] shrink-0 border-4 border-[#493129] rounded-3xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform">
                            <img src={img} alt="Campus Event" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                        </div>
                    ))}
                </div>
                <div className="flex gap-8 animate-marquee-reverse whitespace-nowrap">
                    {[...row2, ...row2].map((img, i) => (
                        <div key={i} className="w-[350px] h-[250px] shrink-0 border-4 border-[#493129] rounded-3xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform">
                            <img src={img} alt="Campus Event" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const LandingPage = () => {
  const scrollProgress = useScrollProgress();
  return (
    <div className="bg-[#ffeadb] min-h-screen font-poppins text-[#493129] selection:bg-[#8b597b] selection:text-white pb-0.5">
      <div className="fixed top-0 left-0 h-3 bg-[#8b597b] z-[100] transition-all" style={{ width: `${scrollProgress * 100}%` }}></div>
      <nav className="fixed top-0 w-full p-6 md:p-10 flex justify-between items-center z-[80] bg-[#ffeadb]/90 backdrop-blur-lg border-b-[6px] border-[#493129]">
        <div className="flex items-center gap-12">
            <div className="text-3xl font-black tracking-tighter flex items-center gap-4 group cursor-pointer">
                <div className="w-14 h-14 bg-[#493129] text-[#ffeadb] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">U</div>
                <div className="flex flex-col -space-y-1">
                    <span className="text-3xl">UNIFIED</span>
                    <span className="text-[#8b597b] text-base font-bold tracking-[0.3em]">CAMPUS</span>
                </div>
            </div>
            <div className="hidden xl:flex gap-12 font-black uppercase text-sm tracking-[0.4em] ml-8">
                {['Infrastructure', 'Gallery', 'Impact'].map(item => (
                    <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#8b597b] transition-all relative py-2 group">
                        {item}
                        <div className="absolute -bottom-1 left-0 w-0 h-1 bg-[#8b597b] group-hover:w-full transition-all duration-300"></div>
                    </a>
                ))}
            </div>
        </div>
        <button className="bg-[#493129] text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-[6px_6px_0px_0px_#8b597b] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">Launch Portal</button>
      </nav>

      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-48 pb-20 px-10 md:px-20 overflow-hidden">
        <Orb size="1200px" color="#8b597b" top="-20%" left="-15%" delay="0" />
        <Orb size="1000px" color="#efa3a0" top="30%" left="65%" delay="2" />
        <div className="max-w-[1500px] w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative z-10 space-y-12">
            <div className="inline-flex items-center gap-4 bg-[#493129] text-white px-10 py-3.5 rounded-full font-black text-sm uppercase tracking-widest shadow-xl">
              <Rocket size={24} className="text-[#efa3a0]" /> Build v5.4 Operational
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter uppercase text-[#493129]">
                CENTRALIZED <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b597b] via-[#493129] to-[#efa3a0]">CAMPUS.</span> <br/> 
                LOGISTICS.
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-[#493129]/60 max-w-xl leading-snug border-l-[12px] border-[#8b597b] pl-10 py-4">
                Decentralized student management. One unified OS for event lifecycles, resource hubs, and identity verification.
            </p>
            <div className="flex gap-12 pt-6">
                {[
                    { val: "0.4ms", label: "Sync Latency" },
                    { val: "100%", label: "Collision Guard" }
                ].map((s, i) => (
                    <div key={i} className="space-y-2">
                        <h4 className="text-5xl font-black">{s.val}</h4>
                        <p className="text-[#8b597b] font-black uppercase text-sm tracking-widest">{s.label}</p>
                    </div>
                ))}
            </div>
          </div>
          <div className="flex justify-center lg:justify-end items-center h-full">
            <AuthGateway />
          </div>
        </div>
      </section>

      <MissionSection />
      <VisualArchive />
      <ChaosSection />

      <section id="infrastructure" className="py-40 px-10 md:px-20 max-w-[1500px] mx-auto relative">
        <div className="mb-40 text-left space-y-8 relative z-10">
            <span className="font-black uppercase tracking-[0.8em] text-[#8b597b] text-sm block">Architecture // Stacking System</span>
            <h2 className="text-7xl md:text-9xl font-black text-[#493129] uppercase tracking-tighter leading-none">THE STACK.</h2>
            <div className="pt-12 flex justify-start">
                <div className="p-8 border-[6px] border-[#493129] rounded-full animate-bounce">
                    <ArrowDown size={48} />
                </div>
            </div>
        </div>
        <div className="relative pb-40">
            <StackingTab index={0} title="Workflow Node" icon={Calendar} color="bg-[#ffeadb]" content="Automated event lifecycle management from submission to archive." features={[{ label: "Smart Pipelines", desc: "Automated routing for venue approvals and equipment requests." }, { label: "Sync Broadcast", desc: "Instantly update all student nodes as event status changes." }]} />
            <StackingTab index={1} title="Resource Map" icon={Database} color="bg-[#ffdec7]" content="Real-time centralized control over venues and equipment hubs." features={[{ label: "Collision Shield", desc: "Proprietary database logic prevents overlapping bookings." }, { label: "Physical Ledger", desc: "Track equipment checkout history with granular audit logs." }]} />
            <StackingTab index={2} title="Identity Mesh" icon={Fingerprint} color="bg-[#efa3a0]" content="Unified RBAC architecture that respects institutional hierarchies." features={[{ label: "Verified Nodes", desc: "Single identity sync across events, resources, and social streams." }, { label: "Gov Console", desc: "Complete transparency of institutional actions and audit trails." }]} />
        </div>
      </section>

      <footer id="footer" className="bg-[#493129] text-white pt-32 pb-16 px-10 md:px-20 rounded-t-[5rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-20 text-[25rem] font-black text-white/[0.03] pointer-events-none select-none tracking-tighter">UNIFIED</div>
        <div className="max-w-[1400px] mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 pb-20">
                <div className="space-y-12">
                    <div className="text-5xl font-black tracking-tighter flex items-center gap-6">
                        <div className="w-20 h-20 bg-white text-[#493129] rounded-2xl flex items-center justify-center">U</div>
                        <span>UNIFIED<br/><span className="text-[#efa3a0] text-2xl tracking-[0.3em]">CAMPUS_OS</span></span>
                    </div>
                    <p className="text-xl font-bold text-white/50 max-w-md leading-relaxed">Replacing fragmented legacy systems with a single, high-fidelity infrastructure for the next generation of campus life.</p>
                    <div className="flex gap-6">
                        {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#8b597b] transition-all border border-white/10"><Icon size={28} /></a>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    {[{ title: "INFRA", items: ["EVENT NODES", "RESOURCE MAP", "IDENTITY HUB"] }, { title: "GOVERN", items: ["POLICIES", "AUDIT LOGS", "SECURITY"] }, { title: "INTEL", items: ["ROI DASH", "PULSE REPORT", "ANALYTICS"] }, { title: "CORE", items: ["DOCS", "STATUS", "SUPPORT"] }].map((col, idx) => (
                      <div key={idx} className="space-y-8">
                          <h5 className="font-black text-white text-4xl uppercase tracking-tighter">{col.title}</h5>
                          <div className="w-full h-1.5 bg-[#efa3a0] mb-6"></div>
                          <ul className="space-y-4 font-bold text-sm tracking-[0.2em] text-white/60">{col.items.map((item, i) => (<li key={i}><a href="#" className="hover:text-white transition-colors">{item}</a></li>))}</ul>
                      </div>
                    ))}
                </div>
            </div>
            <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-sm font-black uppercase tracking-[0.3em] text-white/20 border-t-2 border-white/10">
                <p>© 2026 UNIFIED CAMPUS INFRASTRUCTURE. ALL PROTOCOLS ENFORCED.</p>
                <div className="flex gap-12">
                    <a href="#" className="hover:text-white transition-colors">Privacy_Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Node_Deployment</a>
                    <a href="#" className="hover:text-white transition-colors">System_Uptime_99.9%</a>
                </div>
            </div>
        </div>
      </footer>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap');
        * { font-family: 'Poppins', sans-serif !important; cursor: default !important; }
        button, a { cursor: pointer !important; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
        @keyframes marquee-reverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .animate-marquee-reverse { animation: marquee-reverse 40s linear infinite; }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.25; transform: scale(1.05); } }
        .animate-pulse-slow { animation: pulse-slow 10s ease-in-out infinite; }
        @keyframes grow-bounce { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.3); } }
        .animate-grow-bounce { animation: grow-bounce 2s ease-in-out infinite; transform-origin: bottom; }
        @keyframes scan-vert { 0% { top: 0; } 100% { top: 100%; } }
        .animate-scan-vert { animation: scan-vert 2s linear infinite; }
        @keyframes scan-fast { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-scan-fast { animation: scan-fast 1.5s linear infinite; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        html { scroll-behavior: smooth; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 12px; }
        ::-webkit-scrollbar-track { background: #ffeadb; }
        ::-webkit-scrollbar-thumb { background: #493129; border-radius: 10px; border: 2px solid #ffeadb; }
      `}</style>
    </div>
  );
};

export default LandingPage;