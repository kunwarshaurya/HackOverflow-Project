import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, BarChart3, ShieldCheck, Zap, 
  ArrowRight, Activity, Clock, Lock, FileCheck, 
  Shield, Rocket, Fingerprint, Database,
  ArrowDown, RefreshCw, Instagram, Twitter, Linkedin,
  TrendingUp, Target
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

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
    className="absolute rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none animate-pulse-slow transition-all duration-1000"
    style={{ width: size, height: size, backgroundColor: color, top, left, animationDelay: `${delay}s` }} 
  />
);

const AuthGateway = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleTabSwitch = (val) => {
    if (val === isLogin) return;
    setIsTransitioning(true);
    setError('');
    setTimeout(() => {
      setIsLogin(val);
      setIsTransitioning(false);
    }, 200);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData);
      }

      if (!result.success) {
        setError(result.message || 'Authentication failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#FDFCF7] rounded-3xl shadow-[24px_24px_0px_0px_rgba(30,41,59,1)] overflow-hidden relative z-20 border-4 border-[#1E293B] transition-transform hover:-translate-y-1 hover:-translate-x-1 duration-300">
      <div className="px-5 py-4 flex justify-between items-center bg-[#1E293B]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#F59E0B] animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-[#475569]"></div>
        </div>
        {/* Protocol Text Removed */}
      </div>

      <div className="flex border-b-4 border-[#1E293B] bg-[#F1F5F9]">
        <button 
          onClick={() => handleTabSwitch(true)} 
          className={`flex-1 py-5 font-black uppercase tracking-widest text-xs transition-all duration-300 ${isLogin ? 'bg-[#FDFCF7] text-[#1E293B]' : 'bg-[#475569]/10 text-[#475569]'}`}
        >
          Access Node
        </button>
        <button 
          onClick={() => handleTabSwitch(false)} 
          className={`flex-1 py-5 font-black uppercase tracking-widest text-xs transition-all duration-300 ${!isLogin ? 'bg-[#FDFCF7] text-[#1E293B]' : 'bg-[#475569]/10 text-[#475569]'}`}
        >
          Create ID
        </button>
      </div>

      <div className={`p-8 space-y-6 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <div className="space-y-1">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1E293B]">{isLogin ? "Welcome back." : "Initialize."}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#F59E0B]">{isLogin ? "Identify yourself to proceed" : "Provisioning new institutional profile"}</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 border-2 border-red-300 rounded-xl text-red-800 text-sm font-bold">
              {error}
            </div>
          )}
          
          {!isLogin && (
            <>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="FULL LEGAL NAME" 
                className="w-full bg-white border-4 border-[#1E293B] rounded-2xl p-4 font-bold text-sm focus:bg-[#F59E0B]/5 outline-none transition-all placeholder-[#475569]/50"
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full bg-white border-4 border-[#1E293B] rounded-2xl p-4 font-bold text-sm focus:bg-[#F59E0B]/5 outline-none transition-all"
                required
              >
                <option value="student">STUDENT</option>
                <option value="club_lead">CLUB LEADER</option>
                <option value="admin">ADMIN</option>
              </select>
            </>
          )}
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="INSTITUTIONAL EMAIL" 
            className="w-full bg-white border-4 border-[#1E293B] rounded-2xl p-4 font-bold text-sm focus:bg-[#F59E0B]/5 outline-none transition-all placeholder-[#475569]/50"
            required
          />
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="SECURE ACCESS KEY" 
            className="w-full bg-white border-4 border-[#1E293B] rounded-2xl p-4 font-bold text-sm focus:bg-[#F59E0B]/5 outline-none transition-all placeholder-[#475569]/50"
            required
          />

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm bg-[#1E293B] text-[#FDFCF7] hover:bg-[#F59E0B] hover:text-[#1E293B] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                Processing...
              </>
            ) : (
              <>
                {isLogin ? 'Establish Link' : 'Register Identity'} 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const MissionSection = () => (
  <section className="py-32 px-10 bg-[#FDFCF7] relative z-10 border-b-[12px] border-[#1E293B]">
    <div className="max-w-[1200px] mx-auto text-center space-y-12">
      <span className="text-[#F59E0B] font-black uppercase tracking-[0.5em] text-xs">THE MISSION</span>
      <h2 className="text-5xl md:text-8xl font-black text-[#1E293B] leading-[0.9] tracking-tighter uppercase">
        CAMPUS LIFE SHOULD BE <br/>
        <span className="relative inline-block px-4 group cursor-default">
          <span className="relative z-10 group-hover:text-[#1E293B] transition-colors duration-300">VIBRANT,</span>
          <div className="absolute inset-0 bg-[#F59E0B] -rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
        </span> NOT BURIED.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-16">
        {[
          { title: "SAVE TIME", desc: "Automated workflows mean approvals happen in minutes, not days. Get back to what matters.", icon: Clock },
          { title: "BOOST ENGAGEMENT", desc: "Centralized discovery helps students find clubs they actually care about. No more empty rooms.", icon: TrendingUp },
          { title: "STAY SECURE", desc: "Role-based access ensures only the right people press the big red buttons. Sleep easy.", icon: ShieldCheck }
        ].map((item, i) => (
          <div key={i} className="group relative p-8 border-4 border-[#1E293B] rounded-[2rem] bg-white text-left overflow-hidden transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
            <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0 bg-[#F59E0B]"></div>
            <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#1E293B] text-[#FDFCF7] group-hover:bg-white group-hover:text-[#1E293B] transition-colors duration-500 mb-6">
                  <item.icon size={32} />
                </div>
                <h4 className="text-xl font-black uppercase text-[#1E293B] mb-2">{item.title}</h4>
                <p className="text-sm font-bold text-[#475569] group-hover:text-[#1E293B] leading-relaxed transition-colors duration-300">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ChaosSection = () => (
  <section id="impact" className="py-24 px-10 border-b-8 border-[#1E293B] relative z-10 bg-[#F1F5F9]">
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <div className="space-y-8">
        <h2 className="text-5xl font-black leading-none tracking-tighter uppercase text-[#1E293B]">
          UNIFIED <br/> <span className="text-[#F59E0B]">INTELLIGENCE.</span>
        </h2>
        <p className="text-xl font-bold text-[#475569] max-w-lg">
          Stop juggling fragmented tools. We built a central nervous system for your campus infrastructure.
        </p>
        <div className="grid grid-cols-2 gap-6">
          {/* RBAC Security */}
          <div className="bg-white border-4 border-[#1E293B] rounded-3xl p-6 shadow-[10px_10px_0px_0px_#1E293B] group">
             <div className="flex justify-between items-center mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#1E293B]"></div>
                </div>
                <Lock size={20} className="text-[#1E293B] opacity-20 group-hover:rotate-12 transition-transform" />
             </div>
             <h5 className="font-black uppercase text-xs tracking-widest mb-4">RBAC SECURITY</h5>
             <div className="h-10 bg-[#F1F5F9] rounded-xl flex items-center justify-between px-3 relative overflow-hidden">
                <div className="h-full bg-[#F59E0B]/10 absolute inset-0 animate-scan-fast"></div>
                <span className="text-[10px] font-black uppercase opacity-40 relative z-10">ENCRYPTING...</span>
                <div className="text-[8px] font-black text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 animate-pulse relative z-10">SECURE</div>
             </div>
          </div>
          
          {/* Analytics */}
          <div className="bg-white border-4 border-[#1E293B] rounded-3xl p-6 shadow-[10px_10px_0px_0px_#1E293B]">
             <div className="flex justify-between items-center mb-6">
                <BarChart3 size={20} className="text-[#1E293B] opacity-20" />
             </div>
             <h5 className="font-black uppercase text-xs tracking-widest mb-4">ANALYTICS</h5>
             <div className="flex gap-1 items-end h-10">
                {[40, 80, 50, 90, 30].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#F59E0B] animate-grow-bounce" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}></div>
                ))}
             </div>
          </div>

          {/* Conflict AI */}
          <div className="bg-white border-4 border-[#1E293B] rounded-3xl p-6 shadow-[10px_10px_0px_0px_#1E293B] relative overflow-hidden group">
             <div className="flex gap-1.5 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-red-300"></div>
             </div>
             <h5 className="font-black uppercase text-xs tracking-widest mb-4">CONFLICT AI</h5>
             <div className="h-10 bg-[#1E293B] rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute w-full h-[1px] bg-[#F59E0B] animate-scan-vert"></div>
                <span className="text-[10px] font-black text-[#F59E0B] uppercase tracking-widest">SCANNING</span>
             </div>
          </div>

          {/* Approvals */}
          <div className="bg-white border-4 border-[#1E293B] rounded-3xl p-6 shadow-[10px_10px_0px_0px_#1E293B] group">
             <div className="flex gap-1.5 mb-6">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
             </div>
             <h5 className="font-black uppercase text-xs tracking-widest mb-4">APPROVALS</h5>
             <div className="flex items-center gap-3">
                <FileCheck size={24} className="text-[#1E293B] animate-bounce-slow" />
                <div className="flex flex-col">
                    <span className="text-[8px] font-black opacity-40">#ID: 4012</span>
                    <span className="text-[10px] font-black text-green-600">VERIFIED</span>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <div className="relative group">
         <div className="absolute inset-0 bg-[#F59E0B] border-4 border-[#1E293B] rounded-[3rem] translate-x-4 translate-y-4 transition-transform group-hover:translate-x-6 group-hover:translate-y-6"></div>
         <div className="relative bg-[#1E293B] border-4 border-[#1E293B] rounded-[3rem] overflow-hidden aspect-square shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200" 
              className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
              alt="Data Control" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10 right-10">
               <span className="text-xs font-black uppercase tracking-[0.3em] text-[#F59E0B]">Transmission: Live</span>
               <h3 className="text-4xl font-black text-[#FDFCF7] uppercase mt-2">TOTAL COMMAND.</h3>
            </div>
         </div>
      </div>
    </div>
  </section>
);

const VisualArchive = () => {
    const row1 = [
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600",
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b955?q=80&w=600"
    ];
    const row2 = [
        "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600",
        "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=600",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600",
        "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600"
    ];

    return (
        <section id="gallery" className="py-24 bg-white border-y-8 border-[#1E293B] overflow-hidden relative z-10">
            <div className="max-w-7xl mx-auto px-10 mb-12">
                <span className="font-black uppercase tracking-[0.4em] text-[10px] text-[#F59E0B]">Media Ledger</span>
                <h2 className="text-5xl font-black uppercase tracking-tighter mt-2">Visual Stream.</h2>
            </div>
            <div className="space-y-12">
                {/* Row 1 */}
                <div className="flex gap-12 animate-marquee whitespace-nowrap">
                    {[...row1, ...row1].map((img, i) => (
                        <div key={i} className="w-[450px] h-[300px] shrink-0 border-4 border-[#1E293B] rounded-[2.5rem] overflow-hidden shadow-2xl transform hover:scale-105 transition-transform cursor-pointer">
                            <img src={img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Campus Life" />
                        </div>
                    ))}
                </div>
                {/* Row 2 */}
                <div className="flex gap-12 animate-marquee-reverse whitespace-nowrap">
                    {[...row2, ...row2].map((img, i) => (
                        <div key={i} className="w-[450px] h-[300px] shrink-0 border-4 border-[#1E293B] rounded-[2.5rem] overflow-hidden shadow-2xl transform hover:scale-105 transition-transform cursor-pointer">
                            <img src={img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Campus Event" />
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
    <div className="min-h-screen bg-[#FDFCF7] text-[#1E293B] font-sans selection:bg-[#F59E0B] selection:text-[#1E293B]">
      <div className="fixed top-0 left-0 h-2 z-[100] transition-all bg-[#F59E0B]" style={{ width: `${scrollProgress * 100}%` }}></div>
      
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-[80] backdrop-blur-md bg-[#FDFCF7]/80 border-b-4 border-[#1E293B]">
        <div className="flex items-center gap-10">
            <div className="text-2xl font-black tracking-tighter flex items-center gap-2 group cursor-pointer">
                <div className="w-12 h-12 bg-[#1E293B] text-[#FDFCF7] rounded-2xl flex items-center justify-center text-xl group-hover:bg-[#F59E0B] group-hover:text-[#1E293B] transition-colors duration-300">U1</div>
                <div className="flex flex-col -space-y-1">
                    <span className="text-[#1E293B]">UniOne</span>
                    <span className="text-[10px] font-bold tracking-[0.3em] text-[#F59E0B]">SYSTEMS</span>
                </div>
            </div>
            <div className="hidden md:flex gap-8 font-black uppercase text-[10px] tracking-widest">
                <a href="#infrastructure" className="hover:text-[#F59E0B] transition-colors">Infrastructure</a>
                <a href="#gallery" className="hover:text-[#F59E0B] transition-colors">Archive</a>
                <a href="#impact" className="hover:text-[#F59E0B] transition-colors">Impact</a>
            </div>
        </div>
        <button className="px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest bg-[#1E293B] text-[#FDFCF7] hover:bg-[#F59E0B] hover:text-[#1E293B] transition-all active:scale-95 shadow-[4px_4px_0px_0px_#F59E0B] hover:shadow-none">
          Launch Portal
        </button>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-10 overflow-hidden">
        <Orb size="1000px" color="#F1F5F9" top="-20%" left="-20%" delay="0" />
        <Orb size="600px" color="#F59E0B22" top="40%" left="60%" delay="2" />
        
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 space-y-8">
            <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase">
                CENTRALIZED <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E293B] via-[#475569] to-[#F59E0B]">CAMPUS.</span> <br/>
                LOGISTICS.
            </h1>
            <p className="text-xl font-bold text-[#475569] max-w-lg leading-relaxed border-l-8 border-[#F59E0B] pl-8 py-2">
                Decentralized management. One unified OS for event lifecycles, resource hubs, and identity verification.
            </p>
            <div className="pt-4">
                 <div className="p-5 border-4 border-[#1E293B] rounded-2xl bg-white w-fit animate-bounce-slow">
                    <ArrowDown size={32} />
                 </div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end items-center">
            <AuthGateway />
          </div>
        </div>
      </section>

      <MissionSection />
      <VisualArchive />
      <ChaosSection />

      <section id="infrastructure" className="py-32 px-10 max-w-5xl mx-auto relative">
        <div className="mb-20 text-center space-y-4">
            <span className="font-black uppercase tracking-[0.5em] text-xs text-[#F59E0B]">Technical Architecture</span>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">The Stack.</h2>
        </div>
        
        <div className="space-y-12">
            {[
                { title: "Workflow Node", icon: Calendar, desc: "End-to-end event lifecycle automation from request to archive." },
                { title: "Resource Hub", icon: Database, desc: "Real-time venue and equipment mapping preventing collisions." },
                { title: "Identity Mesh", icon: Fingerprint, desc: "Unified institutional access control across all nodes." }
            ].map((stack, i) => (
                <div key={i} className="sticky top-32 group">
                    <div className="bg-[#FDFCF7] border-4 border-[#1E293B] rounded-[3rem] p-10 flex flex-col md:flex-row gap-10 shadow-[16px_16px_0px_0px_rgba(30,41,59,1)] hover:translate-x-2 hover:translate-y-2 transition-all">
                        <div className="md:w-1/3 space-y-6">
                            <div className="w-16 h-16 bg-[#F59E0B] text-[#1E293B] rounded-2xl flex items-center justify-center border-4 border-[#1E293B] -rotate-6 group-hover:rotate-0 transition-transform">
                                <stack.icon size={32} />
                            </div>
                            <h3 className="text-4xl font-black uppercase tracking-tighter">{stack.title}</h3>
                            <p className="font-bold text-[#475569] border-l-4 border-[#F59E0B] pl-4">{stack.desc}</p>
                        </div>
                        <div className="md:w-2/3 bg-[#F1F5F9] rounded-3xl p-8 border-4 border-[#1E293B]">
                             <div className="grid gap-6">
                                {[1, 2].map(n => (
                                    <div key={n} className="flex gap-5 items-start">
                                        <div className="w-8 h-8 rounded-full bg-[#1E293B] text-[#FDFCF7] flex items-center justify-center text-xs font-black shrink-0">{n}</div>
                                        <div className="space-y-1">
                                            <h4 className="font-black uppercase text-sm">Automated Protocol 0{n}</h4>
                                            <p className="text-sm font-bold opacity-60">High-fidelity synchronization across campus nodes.</p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      <footer className="pt-24 pb-12 px-10 bg-[#1E293B] text-[#FDFCF7] rounded-t-[4rem] relative overflow-hidden">
        <div className="absolute -bottom-10 -right-20 text-[20rem] font-black text-[#FDFCF7]/5 pointer-events-none tracking-tighter">UN1ONE</div>
        
        <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 pb-20 border-b border-[#FDFCF7]/10">
                <div className="space-y-8">
                    <div className="text-4xl font-black tracking-tighter flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#F59E0B] rounded-2xl flex items-center justify-center text-[#1E293B]">U1</div>
                        <div>UniOne<br/><span className="text-xl text-[#F59E0B] tracking-[0.3em]">CAMPUS_OS</span></div>
                    </div>
                    <p className="text-lg font-bold max-w-md opacity-60 leading-relaxed">
                        The ultimate infrastructure for campus life.
                    </p>
                    <div className="flex gap-6">
                        {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="w-14 h-14 rounded-2xl border-4 border-[#FDFCF7]/20 flex items-center justify-center hover:bg-[#F59E0B] hover:text-[#1E293B] hover:border-[#F59E0B] transition-all">
                                <Icon size={24} />
                            </a>
                        ))}
                    </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                    {[
                      { title: "Core", items: ["System", "Nodes", "Protocols"] },
                      { title: "Legal", items: ["Privacy", "Identity", "Terms"] },
                      { title: "Contact", items: ["Support", "Deploy", "Status"] }
                    ].map((col, idx) => (
                      <div key={idx} className="space-y-6">
                          <h5 className="font-black uppercase tracking-widest text-[#F59E0B]">{col.title}</h5>
                          <ul className="space-y-4 font-bold text-sm opacity-50">
                              {col.items.map((item, i) => (
                                <li key={i} className="hover:opacity-100 transition-opacity cursor-pointer underline-offset-4 hover:underline">{item}</li>
                              ))}
                          </ul>
                      </div>
                    ))}
                </div>
            </div>
            
            <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                <p>© 2026 UNIONE INFRASTRUCTURE. ALL RIGHTS RESERVED.</p>
                <div className="flex gap-10">
                    <span>Latency: 0.2ms</span>
                    <span>Status: Fully Operational</span>
                </div>
            </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700;900&display=swap');
        * { font-family: 'Space Grotesk', sans-serif !important; scroll-behavior: smooth; }
        
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        
        @keyframes marquee-reverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .animate-marquee-reverse { animation: marquee-reverse 30s linear infinite; }
        
        @keyframes pulse-slow { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.1); } }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        
        @keyframes grow-bounce { 0%, 100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }
        .animate-grow-bounce { animation: grow-bounce 1s ease-in-out infinite; transform-origin: bottom; }
        
        @keyframes scan-vert { 0% { top: 0; } 100% { top: 100%; } }
        .animate-scan-vert { animation: scan-vert 2s linear infinite; }

        @keyframes scan-fast { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-scan-fast { animation: scan-fast 1.5s linear infinite; }

        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #FDFCF7; }
        ::-webkit-scrollbar-thumb { background: #1E293B; border: 2px solid #FDFCF7; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default LandingPage;