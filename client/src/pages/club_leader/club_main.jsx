import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Boxes, FileEdit, ClipboardList, MessageCircle, FileBarChart, 
  ChevronRight, Send, Search, Users, Bell, 
  Plus, Calendar, TrendingUp, 
  Clock, MapPin, Eye, Edit, Trash2, 
  DollarSign, Activity, ExternalLink,
  AlertTriangle, MessageSquare, CheckCircle,
  BarChart3
} from 'lucide-react';

// --- CONFIG & UTILS ---
const API_BASE = '/api'; 
const mockUser = { 
  name: 'Alex Rivera', 
  role: 'Club President', 
  clubName: 'Tech Innovators' 
};

// --- ANALYTICS ---

const EventsVelocityChart = ({ data }) => {
  // Scaling dynamically based on data, no static limit line
  const maxVal = useMemo(() => Math.max(...data.map(d => d.count), 1) * 1.2, [data]);
  
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-[#475569]/10 shadow-sm relative overflow-hidden h-full">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h3 className="text-xl font-black text-[#1E293B]">Monthly Events Conducted</h3>
          <p className="text-xs font-bold text-[#475569]">Total successful club initiatives per month</p>
        </div>
        <div className="bg-[#1E293B]/5 p-3 rounded-2xl">
          <Activity size={20} className="text-[#1E293B]" />
        </div>
      </div>

      <div className="relative h-48 flex items-end justify-between gap-4 px-2">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-3 group h-full">
            <div className="w-full bg-[#1E293B]/5 rounded-t-2xl relative overflow-hidden flex items-end justify-center h-full">
              <div 
                className="w-full bg-[#1E293B] rounded-t-2xl transition-all duration-700 ease-out group-hover:bg-[#F59E0B] origin-bottom animate-bar-grow"
                style={{ height: `${(item.count / maxVal) * 100}%`, animationDelay: `${i * 0.1}s` }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-black text-[#1E293B] transition-opacity whitespace-nowrap bg-white px-3 py-1.5 rounded-xl shadow-lg border border-[#475569]/10">
                  {item.count} Events
                </div>
              </div>
            </div>
            <span className="text-[10px] font-black text-[#475569] uppercase tracking-tighter">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SCROLL-TRIGGERED ACCORDION SECTION ---

const ScrollSection = ({ id, title, icon: Icon, color, children, onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Automatically expand/collapse based on scroll position
        setIsOpen(entry.isIntersecting);
      },
      { threshold: 0.5, rootMargin: "-10% 0px -10% 0px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id={id} 
      className={`relative mb-6 transition-all duration-700 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-60 scale-[0.98]'}`}
    >
      <div className={`sticky top-20 z-30 transition-all duration-500`}>
        <div className={`flex items-center justify-between p-6 rounded-[2rem] border border-[#475569]/10 shadow-xl ${color}`}>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-xl">
              <Icon size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-widest">{title}</h2>
          </div>
          <button 
            onClick={onOpen}
            className="bg-white/10 hover:bg-white text-white hover:text-[#1E293B] px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-sm"
          >
            MANAGE MODULE <ExternalLink size={14} />
          </button>
        </div>
      </div>
      
      <div 
        className={`overflow-hidden transition-all duration-700 ease-in-out px-4 ${
          isOpen ? 'max-h-[1200px] mt-4 opacity-100' : 'max-h-0 mt-0 opacity-0'
        }`}
      >
        <div className="bg-white p-8 rounded-b-[2.5rem] border-x border-b border-[#475569]/10 shadow-sm">
          {children}
        </div>
      </div>
    </section>
  );
};

// --- SHARED MODULE COMPONENTS ---

const ProposalView = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="p-6 bg-[#1E293B]/5 rounded-3xl border border-transparent hover:border-[#F59E0B] transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-black text-lg text-[#1E293B]">Innovation Summit 2026</h4>
        <span className="text-[10px] font-black text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-1 rounded">DRAFT</span>
      </div>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">Core initiative to invite industry leaders for a three-day tech summit. Venue pending.</p>
      <div className="flex items-center gap-2 text-[10px] font-black text-[#475569] uppercase tracking-widest">
        <Calendar size={12}/> Updated Today
      </div>
    </div>
    <button className="p-6 bg-[#1E293B]/5 rounded-3xl border-2 border-dashed border-[#475569]/20 hover:border-[#F59E0B] transition-all flex flex-col items-center justify-center text-center group">
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 group-hover:bg-[#F59E0B] transition-colors shadow-sm">
        <Plus className="text-[#1E293B]" />
      </div>
      <span className="font-black text-xs uppercase tracking-widest text-[#1E293B]">Start New Proposal</span>
    </button>
  </div>
);

const TrackingView = () => (
  <div className="space-y-4">
    {[
      { id: '4921', title: 'Main Auditorium Booking', status: 'In Review', time: '2 hrs ago' },
      { id: '4925', title: 'Budget Allocation: Tech Fest', status: 'Pending', time: '1 day ago' },
      { id: '4890', title: 'Resource Request: Audio Gear', status: 'Approved', time: '3 days ago' }
    ].map((req, i) => (
      <div key={i} className="flex items-center justify-between p-5 bg-[#FDFCF7] border border-[#475569]/10 rounded-2xl hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
            <Clock size={20} />
          </div>
          <div>
            <span className="block font-black text-[#1E293B]">{req.title}</span>
            <span className="text-[10px] font-bold text-[#475569] uppercase tracking-wide">#{req.id} • {req.time}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
            req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>{req.status}</span>
          <button className="text-[#1E293B] hover:text-[#F59E0B] transition-colors"><Eye size={18} /></button>
        </div>
      </div>
    ))}
  </div>
);

const ChatPreview = () => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between p-6 bg-[#1E293B] rounded-3xl text-white">
      <div className="flex items-center gap-6">
        <div className="flex -space-x-4">
          {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-[#1E293B] bg-[#475569] flex items-center justify-center text-[10px] font-black">U{i}</div>)}
        </div>
        <div>
          <h4 className="font-black text-white">#general-channel</h4>
          <p className="text-xs text-white/60 font-bold uppercase tracking-widest">12 Active Members</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all"><MessageSquare size={18}/></button>
      </div>
    </div>
    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl">
      <p className="text-xs font-black text-emerald-700 uppercase mb-2 tracking-widest">Latest Announcement</p>
      <p className="text-sm font-medium text-emerald-800">"Meeting room changed to Lab 4 for the committee discussion."</p>
    </div>
  </div>
);

// --- MAIN PAGES ---

const PageContainer = ({ title, subtitle, children, actions }) => (
  <div className="p-8 lg:p-12 animate-in max-w-[1400px] mx-auto pb-64">
    <header className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-1 bg-[#F59E0B] rounded-full"></div>
        <span className="text-xs font-black text-[#475569] uppercase tracking-widest">Leadership Dashboard</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-[#1E293B] tracking-tight mb-2">{title}</h1>
          <p className="text-[#475569] font-bold">{subtitle}</p>
        </div>
        {actions && <div className="flex gap-4">{actions}</div>}
      </div>
    </header>
    {children}
  </div>
);

const MainDashboard = ({ setActiveItem, stats }) => {
  const conductedEvents = [
    { month: 'SEP', count: 3 },
    { month: 'OCT', count: 5 },
    { month: 'NOV', count: 8 },
    { month: 'DEC', count: 4 },
    { month: 'JAN', count: 9 }, // Decreased as requested
    { month: 'FEB', count: 7 },
  ];

  return (
    <PageContainer 
      title={<>System <span className="text-[#F59E0B]">Overview</span></>} 
      subtitle="Operational performance and module scroller."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <EventsVelocityChart data={conductedEvents} />
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-[#475569]/10 shadow-sm flex flex-col">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-[#1E293B]">Club Health</h3>
              <BarChart3 className="text-[#F59E0B]" size={20} />
           </div>
           <div className="flex-1 space-y-8">
              {[
                { label: 'Event Engagement', val: stats.successRate || 92 },
                { label: 'Budget Efficiency', val: 68 },
                { label: 'Member Retention', val: 85 }
              ].map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                    <span className="text-[#475569]">{s.label}</span>
                    <span className="text-[#1E293B]">{s.val}%</span>
                  </div>
                  <div className="h-2 bg-[#1E293B]/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1E293B] transition-all duration-1000" style={{ width: `${s.val}%` }} />
                  </div>
                </div>
              ))}
           </div>
           <div className="mt-10 pt-8 border-t border-[#475569]/10 flex justify-around">
              <div className="text-center">
                 <p className="text-3xl font-black text-[#1E293B]">{stats.activeMembers || 248}</p>
                 <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest">Students</p>
              </div>
              <div className="text-center">
                 <p className="text-3xl font-black text-[#1E293B]">{stats.pendingApprovals || 0}</p>
                 <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest">Tasks</p>
              </div>
           </div>
        </div>
      </div>

      {/* DYNAMIC SCROLLER SECTION */}
      <div className="space-y-4">
        <ScrollSection id="dash-prop" title="Proposals" icon={FileEdit} color="bg-[#1E293B]" onOpen={() => setActiveItem('Proposal')}>
          <ProposalView />
        </ScrollSection>

        <ScrollSection id="dash-track" title="Requests" icon={ClipboardList} color="bg-[#475569]" onOpen={() => setActiveItem('Request')}>
          <TrackingView />
        </ScrollSection>

        <ScrollSection id="dash-chat" title="Communication" icon={MessageCircle} color="bg-[#F59E0B]" onOpen={() => setActiveItem('Chat')}>
          <ChatPreview />
        </ScrollSection>

        <ScrollSection id="dash-reports" title="Event Reports" icon={FileBarChart} color="bg-emerald-600" onOpen={() => setActiveItem('Event Report')}>
          <div className="p-6 border border-[#475569]/10 rounded-3xl flex items-center justify-between hover:bg-emerald-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm"><FileBarChart size={24}/></div>
              <div>
                <h4 className="font-black text-[#1E293B]">Winter Workshop 2025</h4>
                <p className="text-xs font-bold text-[#475569]">Analysis ready for review</p>
              </div>
            </div>
            <ExternalLink className="text-[#475569] group-hover:text-emerald-600 transition-colors" size={20} />
          </div>
        </ScrollSection>
      </div>
    </PageContainer>
  );
};

// --- APP ROOT ---

export default function App() {
  const [activeItem, setActiveItem] = useState('Main');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [stats, setStats] = useState({});
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch(`${API_BASE}/analytics/dashboard`);
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);

        const eventsRes = await fetch(`${API_BASE}/events`);
        const eventsData = await eventsRes.json();
        if (eventsData.success) setEvents(eventsData.data);
      } catch (e) {
        console.warn("Backend not detected, running mock data.");
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    switch (activeItem) {
      case 'Main': return <MainDashboard setActiveItem={setActiveItem} stats={stats} events={events} />;
      case 'Proposal': 
        return (
          <PageContainer title="Proposals" subtitle="Manage your initiative drafts.">
            <ProposalView />
          </PageContainer>
        );
      case 'Request': 
        return (
          <PageContainer title="Requests" subtitle="Track administrative approvals.">
            <TrackingView />
          </PageContainer>
        );
      case 'Chat': 
        return (
          <PageContainer title="Chat Hub" subtitle="Real-time team communication.">
            <ChatPreview />
          </PageContainer>
        );
      case 'Event Report': 
        return (
          <PageContainer title="Reports" subtitle="Performance data archive.">
            <div className="bg-white p-8 rounded-[2.5rem] border border-[#475569]/10">
              <h4 className="font-black text-emerald-600 mb-2">Winter Workshop 2025</h4>
              <p className="text-sm font-bold text-[#475569]">Final impact report compiled with 94% student satisfaction rating.</p>
            </div>
          </PageContainer>
        );
      default: return <MainDashboard setActiveItem={setActiveItem} stats={stats} events={events} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFCF7] font-sans selection:bg-[#F59E0B] selection:text-[#1E293B] overflow-hidden">
      {/* Sidebar - Locked Width */}
      <div className={`${isCollapsed ? 'w-20' : 'w-72 min-w-[288px]'} bg-[#1E293B] border-r border-[#475569]/30 flex flex-col transition-all duration-300 h-screen sticky top-0 shrink-0 z-50 shadow-2xl`}>
        <div className={`p-8 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          <div className={`flex items-center gap-4 mb-12 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B] flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)] shrink-0 transition-transform hover:scale-105">
              <Boxes className="text-[#1E293B]" size={22} />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h2 className="text-[#FDFCF7] font-black tracking-tighter text-xl leading-none">CLUB</h2>
                <p className="text-[#475569] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Management</p>
              </div>
            )}
          </div>
          <nav className="space-y-2">
            {[
              { id: 'Main', icon: Boxes, label: 'Main' },
              { id: 'Proposal', icon: FileEdit, label: 'Proposal' },
              { id: 'Request', icon: ClipboardList, label: 'Request' },
              { id: 'Chat', icon: MessageCircle, label: 'Chat' },
              { id: 'Event Report', icon: FileBarChart, label: 'Event Report' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-4 px-6'} py-4 rounded-2xl transition-all duration-300 group ${
                  activeItem === item.id 
                  ? 'bg-[#475569]/20 text-[#F59E0B] border-r-4 border-[#F59E0B] shadow-md' 
                  : 'text-[#475569] hover:text-[#FDFCF7] hover:bg-[#475569]/10'
                }`}
              >
                <item.icon size={20} className={activeItem === item.id ? 'text-[#F59E0B]' : 'group-hover:text-[#F59E0B]'} />
                {!isCollapsed && <span className="font-bold text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
        
        {!isCollapsed && (
          <div className="mt-auto p-8 border-t border-[#475569]/10">
            <div className="bg-[#475569]/10 rounded-2xl p-4 border border-[#475569]/20">
              <p className="text-[10px] font-black text-[#F59E0B] uppercase tracking-widest mb-1">Authenticated</p>
              <p className="text-xs font-bold text-[#FDFCF7]">Verified Leader</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Scaffold */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-[#475569]/10 px-8 flex items-center justify-between shrink-0 z-40">
           <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-[#1E293B]/5 rounded-lg text-[#1E293B] transition-colors">
              <div className="w-6 h-0.5 bg-[#1E293B] mb-1"></div>
              <div className="w-4 h-0.5 bg-[#1E293B] mb-1"></div>
              <div className="w-6 h-0.5 bg-[#1E293B]"></div>
           </button>
           <div className="flex items-center gap-6">
              <button className="relative p-2 text-[#475569] hover:text-[#1E293B] transition-colors">
                <Bell size={20}/>
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#F59E0B] rounded-full border border-white"></span>
              </button>
              <div className="flex items-center gap-3 border-l pl-6 border-[#475569]/20">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-[#1E293B] leading-none">{mockUser.name}</p>
                    <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mt-1">{mockUser.role}</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-[#1E293B] border-2 border-[#F59E0B] flex items-center justify-center text-white font-black text-xs shadow-md shrink-0">AR</div>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth bg-[#FDFCF7]">
          {renderContent()}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .animate-in { animation: fadeIn 0.4s ease-out forwards; }
        .animate-bar-grow { animation: barGrow 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}