import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // <--- Added for Navigation
import { 
  Users, Calendar, BarChart3, ShieldCheck, Zap, 
  MessageSquare, Box, ArrowRight, MousePointer2, 
  Activity, Clock, CheckCircle2, TrendingUp, Heart,
  Lock, Search, Bell, Terminal, Scan, Fingerprint,
  FileCheck, AlertCircle, Shield
} from 'lucide-react';

// --- UTILS & HOOKS ---

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  return mousePosition;
};

const useInView = () => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return [ref, isInView];
};

// --- COMPONENTS ---

const FloatingBadge = ({ children, className, delay = 0 }) => (
  <div 
    className={`absolute animate-float ${className}`} 
    style={{ animationDelay: `${delay}s` }}
  >
    {children}
  </div>
);

const Orb = ({ size, color, top, left, delay, speed = "animate-pulse-slow" }) => (
  <div 
    className={`absolute rounded-full mix-blend-multiply filter blur-3xl ${speed} opacity-60 pointer-events-none`}
    style={{ 
      width: size, 
      height: size, 
      backgroundColor: color, 
      top: top, 
      left: left,
      animationDelay: `${delay}s`
    }} 
  />
);

const SectionTitle = ({ children, color = "text-orange-900" }) => (
  <h2 className={`text-5xl md:text-8xl font-black tracking-tighter mb-12 uppercase transform -rotate-2 ${color} drop-shadow-sm`}>
    {children}
  </h2>
);

const FeatureCard = ({ title, desc, icon, rotation, color, delay }) => {
  const [ref, inView] = useInView();
  
  return (
    <div 
      ref={ref}
      className={`relative group bg-white border-4 border-black p-8 rounded-[3rem] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-700 transform ${rotation} ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-4 hover:scale-105 hover:z-20 overflow-hidden`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-black/5 rounded-bl-[100px] pointer-events-none`}></div>
      <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 border-black mb-6 ${color} text-black group-hover:rotate-12 transition-transform duration-500`}>
        {icon}
      </div>
      <h3 className="text-3xl font-black uppercase mb-4 leading-none tracking-tight">{title}</h3>
      <p className="font-medium text-lg text-stone-600 leading-tight">{desc}</p>
    </div>
  );
};

const StatCounter = ({ end, suffix, label, color }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, end]);

  return (
    <div ref={ref} className="text-center p-6 transform hover:scale-110 transition-transform cursor-crosshair">
      <div className={`text-6xl md:text-8xl font-black mb-2 ${color} drop-shadow-sm`}>
        {count}{suffix}
      </div>
      <div className="font-mono font-bold uppercase tracking-widest text-stone-500">{label}</div>
    </div>
  );
};

// --- NEW & IMPROVED COMPONENTS ---

const ManifestoCard = ({ icon, title, desc, color, hoverColor }) => (
  <div className={`relative p-8 border-4 border-black rounded-3xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 bg-white`}>
     <div className={`absolute inset-0 ${hoverColor} translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0`}></div>
     
     <div className="relative z-10">
       <div className={`w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mb-6 border-2 border-black group-hover:bg-white group-hover:text-black group-hover:rotate-12 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
         {icon}
       </div>
       <h4 className="font-black text-3xl mb-3 uppercase leading-none group-hover:text-white transition-colors">{title}</h4>
       <p className="font-medium text-lg text-stone-600 group-hover:text-white/90 transition-colors leading-tight">{desc}</p>
       
       <div className="mt-6 flex items-center gap-2 font-bold uppercase text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-white translate-x-[-10px] group-hover:translate-x-0 duration-300">
          See How <ArrowRight size={16}/>
       </div>
     </div>
  </div>
);

const SystemWidget = ({ title, subtitle, type }) => {
  return (
    <div className="bg-white border-4 border-black rounded-2xl overflow-hidden relative group hover:-translate-y-1 transition-transform shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-48 flex flex-col cursor-default">
      <div className="bg-black text-white p-3 flex justify-between items-center border-b-4 border-black">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="font-mono text-xs uppercase tracking-wider">{subtitle}</span>
      </div>

      <div className="flex-1 p-4 relative overflow-hidden flex flex-col justify-between">
        <h4 className="font-black text-2xl uppercase leading-none z-10 relative">{title}</h4>
        
        <div className="absolute right-0 bottom-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity">
           {type === 'rbac' && <Shield size={128} />}
           {type === 'analytics' && <BarChart3 size={128} />}
           {type === 'conflict' && <AlertCircle size={128} />}
           {type === 'approval' && <FileCheck size={128} />}
        </div>

        <div className="mt-4 relative z-10">
          {type === 'rbac' && (
            <div className="flex items-center gap-3">
               <div className="relative">
                 <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-50"></div>
                 <div className="relative bg-green-500 text-white p-2 rounded-full border-2 border-black">
                   <Lock size={20} />
                 </div>
               </div>
               <div className="font-mono text-sm font-bold bg-green-100 px-2 py-1 rounded border border-green-300 text-green-800">
                 SECURE
               </div>
            </div>
          )}

          {type === 'analytics' && (
             <div className="flex items-end gap-1 h-12 w-full mt-2">
                {[40, 70, 30, 80, 50, 90, 60].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-blue-500 border border-black hover:bg-blue-400 transition-colors"
                    style={{ 
                      height: `${h}%`,
                      animation: `equalizer 1s infinite ease-in-out ${i * 0.1}s alternate`
                    }}
                  ></div>
                ))}
             </div>
          )}

          {type === 'conflict' && (
             <div className="relative h-12 bg-stone-100 border-2 border-stone-300 rounded overflow-hidden flex items-center justify-center">
                <div className="absolute w-full h-[2px] bg-red-500 animate-scan"></div>
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest animate-pulse">Scanning...</span>
             </div>
          )}

          {type === 'approval' && (
             <div className="flex gap-2 mt-2">
                <div className="bg-stone-100 border-2 border-stone-300 p-2 rounded w-8 h-10 animate-slide-paper" style={{animationDelay: '0s'}}></div>
                <div className="bg-stone-100 border-2 border-stone-300 p-2 rounded w-8 h-10 animate-slide-paper" style={{animationDelay: '0.2s'}}></div>
                <div className="bg-green-400 border-2 border-black p-2 rounded w-8 h-10 flex items-center justify-center transform scale-110 shadow-sm">
                   <CheckCircle2 size={16} className="text-white"/>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PhotoRow = ({ images, direction, speed, scrollY, rotate }) => {
  const move = direction === 'left' ? -1 : 1;
  const xPos = (scrollY * speed * move) % 1200; 

  return (
    <div className={`flex gap-6 mb-12 ${rotate}`} style={{ transform: `translateX(${xPos}px)` }}>
       {[...images, ...images, ...images, ...images].map((img, i) => (
         <div key={i} className="flex-shrink-0 w-[280px] h-[220px] bg-white p-3 pb-8 border-2 border-stone-200 shadow-lg transform transition-transform hover:scale-110 hover:z-50 hover:rotate-0 rotate-odd-even cursor-pointer group relative">
            <div className="w-full h-full overflow-hidden bg-stone-800 border border-stone-100">
               <img src={img} alt="Campus Life" className="w-full h-full object-cover filter sepia-[0.3] group-hover:sepia-0 transition-all duration-500" />
            </div>
            <div className="absolute bottom-2 left-0 w-full text-center font-handwriting text-stone-600 text-sm rotate-[-1deg] opacity-70">
              Campus Memory #{i*42}
            </div>
         </div>
       ))}
    </div>
  );
};

// Changed 'App' to 'LandingPage' to avoid conflict with main App component
const LandingPage = () => { 
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mouse = useMousePosition();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(totalScroll / windowHeight);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const row1Images = [
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600",
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b955?q=80&w=600",
    "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=600"
  ];
  
  const row2Images = [
    "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600",
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=600",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600",
    "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600"
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#F9F4EF] z-[100] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-96 h-96 bg-[#FFD166] rounded-full blur-[100px] animate-pulse"></div>
        </div>
        <div className="flex gap-4 items-center animate-bounce z-10">
          <Box size={64} className="text-orange-500" />
          <h1 className="text-8xl font-black tracking-tighter text-orange-600">
            LOADING
          </h1>
        </div>
        <div className="w-64 h-2 bg-stone-200 rounded-full mt-8 overflow-hidden z-10">
          <div className="h-full bg-orange-500 animate-progress"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F4EF] min-h-screen overflow-x-hidden text-stone-900 font-sans cursor-none selection:bg-orange-400 selection:text-white">
      
      <div 
        className="fixed top-0 left-0 w-8 h-8 bg-orange-500 rounded-full pointer-events-none z-[100] mix-blend-difference transition-transform duration-100 ease-out hidden md:block"
        style={{ 
          transform: `translate(${mouse.x - 16}px, ${mouse.y - 16}px) scale(${1 + scrollProgress})` 
        }}
      />
      
      <div className="fixed top-0 left-0 h-2 bg-orange-500 z-[101]" style={{ width: `${scrollProgress * 100}%` }}></div>

      {/* --- NAV --- */}
      <nav className={`fixed top-0 w-full p-6 flex justify-between items-center z-50 transition-all duration-300 ${scrollProgress > 0.05 ? 'bg-white/90 backdrop-blur-md py-4 border-b-2 border-stone-100' : ''}`}>
        <div className="text-3xl font-black tracking-tighter text-orange-600 flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">C</div>
          CAMPUS<span className="text-black">OS</span>
        </div>
        <div className="hidden md:flex gap-8 font-bold uppercase text-sm tracking-widest">
           <a href="#mission" className="hover:text-orange-500 transition-colors">Mission</a>
           <a href="#features" className="hover:text-orange-500 transition-colors">Features</a>
           <a href="#feed" className="hover:text-orange-500 transition-colors">Live Feed</a>
        </div>
        <Link to="/login">
            <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-orange-500 hover:scale-110 transition-all shadow-lg border-2 border-transparent hover:border-black">
            ENTER PORTAL
            </button>
        </Link>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative min-h-screen flex flex-col items-center justify-center perspective-1000 overflow-hidden pt-20">
        <Orb size="600px" color="#FFD166" top="-10%" left="-10%" delay="0" />
        <Orb size="500px" color="#EF476F" top="40%" left="60%" delay="1" />
        <Orb size="400px" color="#06D6A0" top="60%" left="-10%" delay="2" />
        <Orb size="300px" color="#118AB2" top="10%" left="80%" delay="3" speed="animate-float" />

        <div className="relative z-10 text-center transform hover:scale-[1.02] transition-transform duration-700">
          <FloatingBadge className="top-[-60px] md:top-[-80px] right-[-20px] md:right-[-40px] rotate-12" delay={0.5}>
            <div className="bg-[#FFD166] text-black font-black p-3 md:p-4 rounded-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase text-xs md:text-sm animate-bounce">
              Now Live v2.0
            </div>
          </FloatingBadge>
          
          <h1 className="text-[13vw] leading-[0.8] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-red-600 drop-shadow-sm filter">
            UNIFIED<br/>CAMPUS
          </h1>
          
          <Link to="/signup" className="mt-12 inline-block bg-white border-4 border-black px-12 py-6 rounded-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 hover:rotate-0 transition-transform group cursor-pointer hover:bg-black hover:text-white hover:border-white">
             <p className="text-xl md:text-3xl font-bold uppercase tracking-wide flex items-center gap-4">
               The Revolution is Here <ArrowRight className="group-hover:translate-x-2 transition-transform" />
             </p>
          </Link>
        </div>

        {/* 3D Floating Elements */}
        <div className="absolute top-1/3 left-10 w-24 h-24 bg-[#EF476F] rounded-2xl border-4 border-black animate-float-slow shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-12 hidden lg:flex items-center justify-center opacity-80 hover:scale-125 transition-transform cursor-pointer">
            <Calendar size={40} className="text-white"/>
        </div>
        <div className="absolute bottom-1/4 right-20 w-32 h-32 bg-[#06D6A0] rounded-full border-4 border-black animate-float shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-12 hidden lg:flex items-center justify-center opacity-80 hover:scale-125 transition-transform cursor-pointer" style={{animationDelay: '1.5s'}}>
            <Zap size={50} className="text-black"/>
        </div>
         <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-[#118AB2] rounded-lg border-4 border-black animate-bounce-slow shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-3 hidden lg:flex items-center justify-center opacity-80 hover:scale-125 transition-transform cursor-pointer">
            <Users size={32} className="text-white"/>
        </div>
      </header>

      {/* --- LIVE ACTIVITY FEED --- */}
      <div id="feed" className="bg-stone-900 py-4 border-y-4 border-black overflow-hidden relative z-20">
        <div className="flex gap-12 animate-marquee whitespace-nowrap items-center">
            {[1,2,3,4,5].map((i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-3 text-stone-400 font-mono text-sm">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-white font-bold">EVENT APPROVED:</span> Hackathon 2024
                </div>
                <div className="flex items-center gap-3 text-stone-400 font-mono text-sm">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                   <span className="text-white font-bold">BOOKING:</span> Lab 3 (Robotics Club)
                </div>
                <div className="flex items-center gap-3 text-stone-400 font-mono text-sm">
                   <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
                   <span className="text-white font-bold">NEW MEMBER:</span> Sarah J. joined Design Club
                </div>
              </React.Fragment>
            ))}
        </div>
      </div>

      {/* --- MANIFESTO --- */}
      <section id="mission" className="py-32 px-6 bg-white relative z-10">
        <div className="max-w-6xl mx-auto text-center">
           <p className="text-xl font-bold text-orange-500 tracking-widest uppercase mb-8">The Mission</p>
           <h2 className="text-4xl md:text-6xl font-black leading-tight mb-20">
             WE BELIEVE CAMPUS LIFE SHOULD BE <span className="bg-[#FFD166] px-2 text-black transform skew-x-12 inline-block border-2 border-black hover:skew-x-0 transition-transform">VIBRANT</span>, NOT BURIED IN PAPERWORK.
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <ManifestoCard 
                icon={<Clock size={32} />}
                title="Save Time"
                desc="Automated workflows mean approvals happen in minutes, not days. Get back to what matters."
                color="bg-red-500"
                hoverColor="bg-[#EF476F]"
              />
              <ManifestoCard 
                icon={<TrendingUp size={32} />}
                title="Boost Engagement"
                desc="Centralized discovery helps students find clubs they actually care about. No more empty rooms."
                color="bg-green-500"
                hoverColor="bg-[#06D6A0]"
              />
              <ManifestoCard 
                icon={<ShieldCheck size={32} />}
                title="Stay Secure"
                desc="Role-based access ensures only the right people press the big red buttons. Sleep easy."
                color="bg-blue-500"
                hoverColor="bg-[#118AB2]"
              />
           </div>
        </div>
      </section>

      {/* --- PROBLEM/SOLUTION SPLIT --- */}
      <section className="py-32 px-6 relative z-10 bg-[#F9F4EF]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            <div className="relative">
              <SectionTitle>
                Chaos <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Neutralized</span>
              </SectionTitle>
              <p className="text-2xl font-medium leading-relaxed text-stone-700 mb-10">
                Stop juggling Google Forms and WhatsApp groups. We built a central nervous system for your campus.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <SystemWidget title="RBAC Security" subtitle="Sys.Lock_v2" type="rbac" />
                 <SystemWidget title="Analytics" subtitle="Data.Stream_Live" type="analytics" />
                 <SystemWidget title="Conflict AI" subtitle="Auto.Detect_On" type="conflict" />
                 <SystemWidget title="Approvals" subtitle="Workflow.Speed_Max" type="approval" />
              </div>
            </div>

            <div className="relative h-[600px] w-full perspective-1000 group mt-10 lg:mt-0">
               <div className="absolute top-10 right-10 w-full h-full bg-black rounded-[4rem] transform rotate-6 opacity-20"></div>
               <div className="absolute top-5 right-5 w-full h-full bg-[#EF476F] rounded-[4rem] transform rotate-3 border-4 border-black"></div>
               <div className="absolute inset-0 bg-[#FFD166] rounded-[4rem] border-4 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:-translate-x-2">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-110"></div>
                  <div className="absolute top-8 left-8 bg-white/90 backdrop-blur border-2 border-black p-4 rounded-xl shadow-lg transform -rotate-2 animate-float">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="font-bold font-mono text-xs">LIVE: AUDITORIUM</span>
                     </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-10">
                    <p className="font-mono text-sm mb-2 text-[#FFD166]">DASHBOARD VIEW</p>
                    <h3 className="text-4xl font-black uppercase text-white">Complete<br/>Control</h3>
                  </div>
               </div>
               <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-full border-4 border-black animate-spin-slow shadow-lg z-20">
                  <Activity size={40} className="text-orange-500"/>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="bg-black text-[#F2E8CF] py-24 border-y-8 border-[#EF476F] mt-20">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-stone-800">
            <StatCounter end={50} suffix="+" label="Active Clubs" color="text-[#FFD166]" />
            <StatCounter end={1200} suffix="" label="Events Managed" color="text-[#EF476F]" />
            <StatCounter end={98} suffix="%" label="Faster Approvals" color="text-[#06D6A0]" />
         </div>
      </section>

      {/* --- FEATURES GRID (The Stack) --- */}
      <section id="features" className="py-32 bg-stone-900 text-[#F2E8CF] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#888 2px, transparent 2px)', backgroundSize: '30px 30px'}}></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
             <h2 className="text-6xl md:text-9xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] to-[#EF476F]">
               The Stack
             </h2>
             <p className="text-xl mt-6 font-mono text-stone-400">EVERYTHING YOU NEED TO RUN THE SHOW</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard delay={0} title="Event Lifecycle" desc="Draft, approve, publish. A seamless pipeline." icon={<Calendar size={40}/>} color="bg-[#EF476F]" rotation="rotate-1" />
            <FeatureCard delay={100} title="Resource Hub" desc="Book labs and halls without conflict." icon={<Box size={40}/>} color="bg-[#FFD166]" rotation="-rotate-2 lg:translate-y-12" />
            <FeatureCard delay={200} title="Club Collab" desc="Joint events made easy." icon={<Users size={40}/>} color="bg-[#118AB2]" rotation="rotate-2" />
            <FeatureCard delay={300} title="Smart Analytics" desc="Track attendance and budget burn." icon={<BarChart3 size={40}/>} color="bg-[#06D6A0]" rotation="-rotate-1" />
            <FeatureCard delay={400} title="Instant Comms" desc="Context-aware chat groups." icon={<MessageSquare size={40}/>} color="bg-[#FF9F1C]" rotation="rotate-3 lg:translate-y-12" />
            <FeatureCard delay={500} title="User Profiles" desc="Showcase membership history." icon={<ShieldCheck size={40}/>} color="bg-[#CBF3F0]" rotation="-rotate-2" />
          </div>
        </div>
      </section>

      {/* --- PHOTO FLOW --- */}
      <section className="py-32 bg-[#118AB2] relative overflow-hidden min-h-screen flex flex-col justify-center">
         <Orb size="1200px" color="#000" top="50%" left="50%" delay="0" speed="opacity-20" />
         
         <div className="relative z-10">
            <div className="text-center mb-24">
               <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic transform -rotate-2">
                 Memories Made<br/>Hassle Free
               </h2>
               <div className="mt-8 inline-block bg-white px-6 py-2 rounded-full font-mono font-bold uppercase rotate-2">
                 Swipe to explore
               </div>
            </div>
            
            <div className="w-full overflow-hidden scale-105 space-y-8">
               <PhotoRow images={row1Images} direction="left" speed={0.5} scrollY={scrollY} rotate="rotate-2" />
               <PhotoRow images={row2Images} direction="right" speed={0.6} scrollY={scrollY} rotate="-rotate-1" />
            </div>

            <div className="text-center mt-24">
               <button className="bg-black text-white px-10 py-5 rounded-full font-black uppercase text-xl border-4 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group">
                  See the Gallery <span className="inline-block group-hover:rotate-45 transition-transform">↗</span>
               </button>
            </div>
         </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <footer className="bg-[#EF476F] min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden rounded-t-[4rem] -mt-20 border-t-8 border-black z-20">
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
           <div className="w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] border-[60px] border-black rounded-full animate-ping-slow"></div>
        </div>

        <div className="z-10 text-center px-4">
          <div className="inline-block bg-white text-black font-bold px-6 py-2 rounded-full mb-8 animate-bounce border-2 border-black">
             Spots filling up for Fall 2024
          </div>
          <h2 className="text-[12vw] font-black uppercase leading-[0.85] text-white drop-shadow-[8px_8px_0px_rgba(0,0,0,1)]">
            Ready to<br/>Launch?
          </h2>
          
          <Link to="/signup">
            <button className="mt-16 bg-white text-black text-2xl md:text-4xl font-black py-8 px-16 rounded-full shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 transition-all border-4 border-black flex items-center gap-4 mx-auto group">
                START NOW <ArrowRight size={48} className="group-hover:translate-x-4 transition-transform"/>
            </button>
          </Link>
        </div>

        <div className="absolute bottom-10 w-full flex justify-between px-10 font-bold uppercase tracking-widest text-black/40">
           <span>© 2024 CampusOS</span>
           <span className="hidden md:inline">Designed for Revolutionaries</span>
        </div>
      </footer>

      {/* --- GLOBAL STYLES & ANIMATIONS --- */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-slow {
          0% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-30px) rotate(8deg); }
          100% { transform: translateY(0px) rotate(12deg); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes slide-up {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        @keyframes grow-bar {
          0% { height: 0%; }
          100% { height: 100%; }
        }
        @keyframes scan {
            0% { top: 0; opacity: 1; }
            50% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        @keyframes equalizer {
            0% { height: 30%; }
            100% { height: 100%; }
        }
        @keyframes slide-paper {
            0% { transform: translateX(0) scale(1); opacity: 1; }
            100% { transform: translateX(100px) scale(0.8); opacity: 0; }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-progress { animation: progress 2s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-grow-bar { animation: grow-bar 1s ease-out forwards; }
        .animate-scan { animation: scan 2s linear infinite; }
        .animate-slide-paper { animation: slide-paper 2s infinite ease-in-out; }
        
        .perspective-1000 { perspective: 1000px; }
        
        .rotate-odd-even:nth-child(odd) { transform: rotate(2deg); }
        .rotate-odd-even:nth-child(even) { transform: rotate(-2deg); }
        .rotate-odd-even:hover { transform: rotate(0deg) scale(1.1) !important; z-index: 50; }
      `}</style>
    </div>
  );
};

export default LandingPage;