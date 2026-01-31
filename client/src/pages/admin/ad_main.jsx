import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Inbox, 
  ShieldCheck, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  Calendar, 
  Activity, 
  Search, 
  Filter, 
  Bell, 
  BarChart3,
  Clock,
  MessageSquare,
  ArrowRight,
  User as UserIcon,
  Star,
  Zap,
  MapPin,
  Building2,
  Megaphone,
  DollarSign,
  History,
  FileText,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- THEME CONSTANTS ---
const COLORS = {
  primary800: '#1E293B', 
  primary600: '#475569', 
  accent: '#F59E0B',     
  cream: '#FDFCF7',      
};

const App = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Sidebar Menu Items mapped to your Server Architecture
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Pulse' },
    { id: 'requests', icon: ClipboardList, label: 'Requests' },      
    { id: 'queries', icon: Inbox, label: 'Query Box' },             
    { id: 'venues', icon: Building2, label: 'Resources' },          
    { id: 'clubs', icon: Users, label: 'Clubs' },                   
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },       
    { id: 'notifications', icon: Megaphone, label: 'Broadcast' },   
  ];

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  // --- SUB-COMPONENTS ---

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => setActiveSection(id)}
      className={`w-full flex items-center gap-5 py-4 px-6 rounded-[1.8rem] transition-all duration-300 relative group ${
        activeSection === id 
        ? 'bg-[#F59E0B] text-[#1E293B] shadow-xl shadow-[#F59E0B]/10' 
        : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={18} strokeWidth={activeSection === id ? 2.5 : 1.5} />
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      {activeSection === id && (
        <motion.div 
          layoutId="nav-dot"
          className="absolute right-6 w-1.5 h-1.5 bg-[#1E293B] rounded-full" 
        />
      )}
    </motion.button>
  );

  const DashboardHome = () => {
    // Recent Data Logic
    const recentRequests = [
      { id: 1, title: 'Hackathon 2026', club: 'Tech Club', budget: '$1,200', status: 'pending' },
      { id: 2, title: 'Annual Gala', club: 'Socials', budget: '$3,500', status: 'approved' },
      { id: 3, title: 'Music Night', club: 'Fine Arts', budget: '$800', status: 'pending' },
    ];

    const recentQueries = [
      { id: 1, user: 'Shaurya', subject: 'Venue Conflict', time: '2m ago' },
      { id: 2, user: 'Ankur', subject: 'Budget Clearance', time: '15m ago' },
    ];

    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-12 pb-20"
      >
        {/* Hero Welcome */}
        <motion.div 
          variants={itemVariants}
          className="bg-[#1E293B] rounded-[3.5rem] p-12 text-[#FDFCF7] relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-white/10"
            >
              <ShieldCheck size={12} className="text-[#F59E0B]" /> Administrative Root Verified
            </motion.span>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4 leading-none text-white uppercase">
              Control <span className="text-[#F59E0B]">Pulse.</span>
            </h1>
            <p className="text-xl opacity-70 font-medium max-w-xl leading-relaxed">
              Managing infrastructure via <span className="text-[#F59E0B] font-black underline underline-offset-4">analyticsController</span>. Monitoring budget allocation across all active event proposals.
            </p>
          </div>
          <div className="absolute -right-20 -top-20 w-96 h-96 border-[40px] border-[#F59E0B]/5 rounded-full opacity-30" />
        </motion.div>

        {/* Modular Access Grid (Direct Sidebar Connections) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 'requests', label: 'Proposals', sub: 'Event Mgt', icon: ClipboardList, color: 'bg-emerald-50 text-emerald-600' },
            { id: 'queries', label: 'Queries', sub: 'Inquiry Box', icon: Inbox, color: 'bg-amber-50 text-amber-600' },
            { id: 'venues', label: 'Resources', sub: 'Inventory', icon: Building2, color: 'bg-indigo-50 text-indigo-600' },
            { id: 'analytics', label: 'Analytics', sub: 'Data Lab', icon: BarChart3, color: 'bg-rose-50 text-rose-600' },
          ].map((card) => (
            <motion.div
              key={card.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              onClick={() => setActiveSection(card.id)}
              className="bg-white border border-[#1E293B]/5 p-8 rounded-[2.5rem] shadow-sm cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${card.color}`}>
                <card.icon size={20} />
              </div>
              <h4 className="text-xl font-black text-[#1E293B] tracking-tighter">{card.label}</h4>
              <p className="text-[10px] font-black uppercase text-[#475569]/40 tracking-widest">{card.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Budget Allocation Matrix */}
          <motion.div 
            variants={itemVariants} 
            onClick={() => setActiveSection('analytics')}
            className="lg:col-span-8 bg-white border border-[#1E293B]/5 p-12 rounded-[4rem] shadow-sm cursor-pointer group hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="text-3xl font-black text-[#1E293B] tracking-tighter uppercase">Budget Allocated</h3>
                <p className="text-[#475569] text-sm font-bold opacity-60">Distribution across approved events</p>
              </div>
              <div className="p-4 bg-[#1E293B] rounded-2xl text-[#F59E0B] shadow-lg">
                <DollarSign size={24} />
              </div>
            </div>
            
            <div className="flex items-end justify-between gap-4 h-56 px-4">
               {[
                 { m: 'Jan', v: 30 }, { m: 'Feb', v: 45 }, { m: 'Mar', v: 85 }, 
                 { m: 'Apr', v: 65 }, { m: 'May', v: 40 }, { m: 'Jun', v: 95 }
               ].map((item, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-4">
                   <div className="w-full relative flex items-end h-full">
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${item.v}%` }}
                        transition={{ duration: 1, ease: "circOut", delay: i * 0.1 }}
                        className={`w-full rounded-t-2xl transition-all duration-500 ${item.v > 80 ? 'bg-[#F59E0B]' : 'bg-[#1E293B]/5 group-hover:bg-[#1E293B]/10'}`} 
                      />
                   </div>
                   <span className="text-[10px] font-black uppercase text-[#475569]/30">{item.m}</span>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Recent Queries Snippet */}
          <motion.div 
            variants={itemVariants}
            onClick={() => setActiveSection('queries')}
            className="lg:col-span-4 bg-[#1E293B] rounded-[4rem] p-10 text-[#FDFCF7] shadow-xl relative overflow-hidden cursor-pointer group"
          >
             <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
               <MessageSquare size={20} className="text-[#F59E0B]" /> Recent Queries
             </h3>
             <div className="space-y-6">
                {recentQueries.map((q) => (
                  <div key={q.id} className="border-b border-white/5 pb-4 group-hover:border-[#F59E0B]/20 transition-colors">
                     <p className="text-[10px] font-black uppercase text-[#F59E0B] tracking-widest">{q.user}</p>
                     <p className="text-sm font-bold mt-1 line-clamp-1">{q.subject}</p>
                     <p className="text-[9px] opacity-40 font-bold mt-1">{q.time}</p>
                  </div>
                ))}
             </div>
             <div className="mt-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#F59E0B]">
               Authorized Inbox <ArrowRight size={14} />
             </div>
          </motion.div>
        </div>

        {/* Infrastructure / Recent Requests Table Preview */}
        <motion.div 
          variants={itemVariants}
          onClick={() => setActiveSection('requests')}
          className="bg-white border border-[#1E293B]/5 p-12 rounded-[4rem] shadow-sm cursor-pointer"
        >
          <div className="flex justify-between items-center mb-10">
             <h3 className="text-2xl font-black text-[#1E293B] tracking-tighter uppercase">Pending Proposals</h3>
             <span className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B] bg-[#F59E0B]/5 px-4 py-2 rounded-full border border-[#F59E0B]/20">eventController active</span>
          </div>
          <div className="space-y-4">
             {recentRequests.map(req => (
               <div key={req.id} className="flex items-center justify-between p-6 bg-[#FDFCF7] border border-[#1E293B]/5 rounded-3xl hover:border-[#F59E0B]/30 transition-all">
                  <div className="flex items-center gap-6">
                     <div className="p-4 bg-[#1E293B] rounded-2xl text-white shadow-lg"><FileText size={20} /></div>
                     <div>
                        <h4 className="text-lg font-black text-[#1E293B]">{req.title}</h4>
                        <p className="text-xs font-bold text-[#475569]/60 uppercase tracking-tighter">{req.club} • Budget: {req.budget}</p>
                     </div>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${req.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                     {req.status}
                  </span>
               </div>
             ))}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FDFCF7] text-[#1E293B] font-sans selection:bg-[#F59E0B] selection:text-[#1E293B]">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 h-screen bg-[#1E293B] flex flex-col sticky top-0 z-20 shadow-2xl overflow-y-auto scrollbar-hide">
        <div className="p-10">
          <div className="flex flex-col items-center mb-14">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }} 
              className="w-20 h-20 rounded-[2.5rem] border-2 border-[#F59E0B] p-1.5 mb-6 shadow-xl"
            >
              <div className="w-full h-full rounded-[2rem] bg-[#FDFCF7] flex items-center justify-center shadow-inner">
                <ShieldCheck className="text-[#1E293B]" size={32} />
              </div>
            </motion.div>
            <h2 className="text-white font-black text-2xl tracking-tighter uppercase mb-1">UniOne</h2>
            
            {/* GOLD ADMIN BADGE */}
            <div className="flex items-center gap-2 bg-[#F59E0B]/10 px-4 py-1.5 rounded-full border border-[#F59E0B]/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
              <span className="text-[#F59E0B] text-[9px] font-black tracking-[0.4em] uppercase">ADMIN</span>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <SidebarItem key={item.id} {...item} />
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-10 border-t border-white/5">
          <button className="w-full p-4 bg-white/5 rounded-2xl text-white/40 hover:text-[#F59E0B] transition-all flex items-center justify-center gap-4 group">
            <History size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">System Logs</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth bg-[#FDFCF7]">
        {/* Top Header */}
        <div className="max-w-7xl mx-auto px-10 lg:px-20 pt-10 flex items-center gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1E293B]/30 group-focus-within:text-[#F59E0B] transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search eventController nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#1E293B]/10 py-5 pl-16 pr-6 rounded-[2rem] text-[#1E293B] placeholder-[#1E293B]/20 outline-none focus:border-[#F59E0B]/50 transition-all font-medium"
            />
          </div>
          <button className="bg-white border border-[#1E293B]/10 p-5 rounded-[1.5rem] text-[#1E293B]/40 hover:text-[#1E293B] hover:border-[#F59E0B] transition-all">
            <Filter size={22} />
          </button>
        </div>

        <div className="max-w-7xl mx-auto p-10 lg:p-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeSection === 'dashboard' ? (
                <DashboardHome />
              ) : (
                <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-8">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="w-48 h-48 rounded-[4rem] bg-white border border-[#1E293B]/5 flex items-center justify-center text-[#1E293B]/10 shadow-inner relative overflow-hidden"
                  >
                    {(() => {
                       const IconComp = menuItems.find(m => m.id === activeSection)?.icon;
                       return IconComp ? <IconComp size={64} /> : <Zap size={64} />;
                    })()}
                    <div className="absolute inset-0 border-4 border-dashed border-[#F59E0B]/20 rounded-[4rem]" />
                  </motion.div>
                  <div>
                    <h2 className="text-5xl font-black text-[#1E293B] uppercase tracking-tighter mb-2">{activeSection} Module</h2>
                    <p className="text-[#475569] font-black uppercase tracking-[0.5em] text-[10px]">Access Synced with Repo Models</p>
                  </div>
                  <button 
                    onClick={() => setActiveSection('dashboard')}
                    className="bg-[#1E293B] text-[#F59E0B] px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                  >
                    Return to Root
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* --- GLOBAL STYLES --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: #FDFCF7;
          color: #1E293B;
          -webkit-font-smoothing: antialiased;
        }

        ::-webkit-scrollbar { width: 0px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
      `}</style>
    </div>
  );
};

export default App;