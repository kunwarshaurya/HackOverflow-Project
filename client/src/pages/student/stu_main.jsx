import React, { useState, useEffect, useContext, createContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Images, 
  Users, 
  User as UserIcon,
  Star, 
  TrendingUp, 
  ChevronRight, 
  Search, 
  Ticket, 
  ArrowRight, 
  X, 
  MapPin, 
  Clock, 
  Zap, 
  Bell,
  Activity,
  Layers,
  Camera,
  LogOut,
  Info
} from 'lucide-react';

// --- CONFIG & API HELPERS ---
const API_BASE_URL = 'http://localhost:5000/api'; // Adjust based on your server config

const fetchWithAuth = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    return response.json();
  } catch (error) {
    // Re-throw to let components handle fallback
    throw error;
  }
};

// --- SHARED UI COMPONENTS ---

const Card = ({ children, className = "", layoutId }) => (
  <motion.div 
    layout
    layoutId={layoutId}
    className={`bg-white border border-[#1e293b]/10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow duration-500 ${className}`}
  >
    {children}
  </motion.div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-20">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="w-12 h-12 border-4 border-[#f59e0b] border-t-transparent rounded-full"
    />
  </div>
);

// --- SUB-VIEWS ---

const DashboardView = ({ onNavigate, user }) => {
  const [activeBar, setActiveBar] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const eventsData = await fetchWithAuth('/events');
        const sorted = eventsData
          .filter(e => new Date(e.date) > new Date())
          .slice(0, 2);
        setUpcomingEvents(sorted);
      } catch (err) {
        console.warn("Dashboard load error: Falling back to mock data", err.message);
        // Fallback mock data for visual consistency
        setUpcomingEvents([
          { _id: 'mock1', title: 'Tech Convergence 2026', date: new Date().toISOString(), venue: { name: 'Hall 01' } },
          { _id: 'mock2', title: 'Global Ethics Summit', date: new Date(Date.now() + 86400000 * 3).toISOString(), venue: { name: 'Auditorium' } },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const chartData = [
    { day: 'Mon', value: 60, info: '1.2k Reach' },
    { day: 'Tue', value: 40, info: '0.8k Reach' },
    { day: 'Wed', value: 80, info: '2.4k Reach' },
    { day: 'Thu', value: 50, info: '1.5k Reach' },
    { day: 'Fri', value: 90, info: '3.1k Reach' },
    { day: 'Sat', value: 70, info: '2.0k Reach' },
    { day: 'Sun', value: 95, info: '3.5k Reach' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-12 pb-20">
      {/* Hero Section */}
      <motion.div 
        variants={item}
        className="bg-[#1e293b] rounded-[3.5rem] p-12 text-[#fdfcf7] relative overflow-hidden shadow-2xl"
      >
        <div className="relative z-10">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-white/10"
          >
            <Star size={12} className="text-[#f59e0b]" /> Student Portal Active
          </motion.span>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4 leading-none text-white uppercase">
            Hello, {user?.name || 'Student'}
          </h1>
          <p className="text-xl opacity-70 font-medium max-w-xl leading-relaxed">
            Your campus experience is optimized. You have <span className="text-[#f59e0b] font-black underline underline-offset-4">{upcomingEvents.length} major events</span> synced for this month.
          </p>
        </div>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-20 -top-20 w-96 h-96 bg-[#f59e0b]/20 rounded-full blur-[100px]" 
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          {/* Timeline Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-end px-4">
               <div>
                 <h2 className="text-3xl font-black text-[#1e293b] tracking-tighter uppercase">Upcoming Spotlight</h2>
                 <p className="text-[#475569] text-sm font-medium">Synced with Server Schedule</p>
               </div>
               <button 
                 onClick={() => onNavigate('Event')}
                 className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1e293b] hover:text-[#f59e0b] transition-colors"
               >
                 View All Events <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {loading ? <LoadingSpinner /> : (
                upcomingEvents.length > 0 ? (
                  upcomingEvents.map((e) => (
                    <motion.div 
                      variants={item}
                      whileHover={{ x: 10 }}
                      key={e._id} 
                      className="bg-white border border-[#1e293b]/5 p-6 rounded-[2.5rem] shadow-sm flex items-center gap-6 group cursor-pointer"
                      onClick={() => onNavigate('Event')}
                    >
                      <div className="bg-[#1e293b] text-[#fdfcf7] px-5 py-3 rounded-2xl text-center shadow-lg group-hover:bg-[#f59e0b] group-hover:text-[#1e293b] transition-colors duration-500 min-w-[80px]">
                        <p className="text-2xl font-black leading-none">{new Date(e.date).getDate()}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                          {new Date(e.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                        </p>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-[#1e293b] tracking-tighter">{e.title}</h3>
                        <p className="text-xs text-[#475569] flex items-center gap-1.5 font-bold mt-1 uppercase tracking-tighter">
                          <MapPin size={12} className="text-[#f59e0b]" /> {e.venue?.name || 'Campus Venue'}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-10 text-center bg-white/50 rounded-[2.5rem] border border-dashed border-[#1e293b]/10">
                    <p className="text-[#475569] font-black uppercase text-xs tracking-widest">No scheduled events found</p>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Social Stats */}
          <Card className="p-10 relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <h3 className="text-sm font-black text-[#1e293b] uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={18} className="text-[#f59e0b]" /> Campus Activity Flow
              </h3>
              {activeBar !== null && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#fdfcf7] px-6 py-2 rounded-full border border-[#f59e0b]/20 shadow-inner">
                  <span className="text-[10px] font-black uppercase text-[#1e293b] tracking-widest">
                    {chartData[activeBar].day}: {chartData[activeBar].info}
                  </span>
                </motion.div>
              )}
            </div>
            
            <div className="w-full h-40 flex items-end justify-between gap-4">
               {chartData.map((d, i) => (
                 <motion.div key={i} onMouseEnter={() => setActiveBar(i)} onMouseLeave={() => setActiveBar(null)} className="flex-1 flex flex-col items-center gap-3 cursor-crosshair group">
                    <div className="w-full h-full relative flex items-end">
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${d.value}%` }} 
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className={`w-full rounded-t-xl relative transition-all duration-300 ${activeBar === i ? 'bg-[#f59e0b] shadow-lg shadow-[#f59e0b]/20' : 'bg-[#1e293b]/5 group-hover:bg-[#1e293b]/10'}`}
                      />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${activeBar === i ? 'text-[#1e293b]' : 'text-[#475569]/30'}`}>{d.day}</span>
                 </motion.div>
               ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
           {/* Clubs Preview */}
           <motion.div 
             variants={item}
             whileHover={{ y: -5 }}
             className="bg-white border border-[#1e293b]/10 rounded-[3rem] p-8 shadow-sm group cursor-pointer"
             onClick={() => onNavigate('Clubs')}
           >
              <div className="flex items-center justify-between mb-8">
                <div className="p-3 bg-[#1e293b] rounded-2xl text-[#f59e0b]"><Users size={20} strokeWidth={2.5} /></div>
                <ArrowRight size={18} className="text-[#1e293b]/20 group-hover:text-[#f59e0b] group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-[10px] font-black text-[#475569] uppercase tracking-[0.3em] mb-2">Clubs Alliance</h3>
              <h4 className="text-2xl font-black text-[#1e293b] leading-tight mb-6">Discover New <br/> Collectives</h4>
              <div className="flex -space-x-3">
                  {[101, 102, 103, 104].map((id, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white overflow-hidden bg-[#fdfcf7] shadow-sm">
                       <img src={`https://picsum.photos/id/${id}/100/100`} alt="club" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-4 border-white bg-[#f59e0b] flex items-center justify-center text-[10px] font-black text-[#1e293b]">+8</div>
              </div>
           </motion.div>

           {/* Archive Snippet */}
           <motion.div 
             variants={item}
             whileHover={{ y: -5 }}
             className="bg-[#1e293b] rounded-[3rem] p-8 shadow-xl group cursor-pointer relative overflow-hidden"
             onClick={() => onNavigate('Galleries')}
           >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-3 bg-[#f59e0b] rounded-2xl text-[#1e293b]"><Camera size={20} strokeWidth={2.5} /></div>
                  <Images size={18} className="text-white/20 group-hover:text-[#f59e0b] transition-all" />
                </div>
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Archive Flash</h3>
                <h4 className="text-2xl font-black text-white leading-tight mb-4">Latest Campus <br/> Snapshots</h4>
                <div className="grid grid-cols-2 gap-2 mt-4 opacity-80 group-hover:opacity-100 transition-opacity">
                   <div className="h-16 rounded-xl overflow-hidden bg-white/10">
                      <img src="https://picsum.photos/id/107/300/300" className="w-full h-full object-cover" alt="prev" />
                   </div>
                   <div className="h-16 rounded-xl overflow-hidden bg-white/10">
                      <img src="https://picsum.photos/id/108/300/300" className="w-full h-full object-cover" alt="prev" />
                   </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#f59e0b]/5 rounded-full blur-2xl" />
           </motion.div>

           {/* Quick Status */}
           <motion.div variants={item} className="bg-[#fdfcf7] border border-[#1e293b]/5 rounded-[2.5rem] p-8 text-center shadow-inner">
              <p className="text-[9px] font-black text-[#475569] uppercase tracking-[0.5em] mb-4">ID: {user?._id?.slice(-8).toUpperCase() || 'STU-AUTH'}</p>
              <div className="flex items-center justify-center gap-2">
                  <Zap size={14} className="text-[#f59e0b]" />
                  <span className="text-xs font-black text-[#1e293b] uppercase">Premium Student Access</span>
              </div>
           </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const EventsView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await fetchWithAuth('/events');
        setEvents(data);
      } catch (err) {
        console.warn("Failed to fetch events: Using mock data", err.message);
        setEvents([
          { _id: 'e1', title: 'Code Odyssey 2026', category: 'Technical', date: new Date().toISOString(), venue: { name: 'IT Lab 01' } },
          { _id: 'e2', title: 'Arts & Beats Fest', category: 'Cultural', date: new Date(Date.now() + 86400000 * 5).toISOString(), venue: { name: 'Central Garden' } },
          { _id: 'e3', title: 'Future Leaders Forum', category: 'Social', date: new Date(Date.now() + 86400000 * 10).toISOString(), venue: { name: 'Main Hall' } },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      console.log(`Attempting registration for event: ${eventId}`);
      // await fetchWithAuth(`/events/${eventId}/register`, { method: 'POST' });
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <h1 className="text-7xl font-black text-[#1e293b] tracking-tighter leading-none uppercase">Event <span className="text-[#475569] underline decoration-[#f59e0b] decoration-8 underline-offset-8">Lab</span></h1>
        <div className="flex gap-4">
           <div className="px-6 py-3 rounded-full bg-white border border-[#1e293b]/10 flex items-center gap-3">
              <Search size={16} className="text-[#475569]" />
              <input type="text" placeholder="Search events..." className="bg-transparent outline-none text-xs font-bold uppercase tracking-widest w-40" />
           </div>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.map((event, idx) => (
            <motion.div 
              key={event._id || idx} 
              whileHover={{ y: -15 }} 
              className="group bg-white rounded-[3rem] border border-[#1e293b]/5 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer"
            >
              <div className="h-72 bg-[#fdfcf7] relative overflow-hidden">
                 <motion.img 
                   whileHover={{ scale: 1.1 }} transition={{ duration: 1.5 }}
                   src={event.image && !event._id.startsWith('mock') ? `${API_BASE_URL}/uploads/${event.image}` : `https://picsum.photos/id/${100 + idx}/1200/900`} 
                   className="w-full h-full object-cover transition-all duration-1000" 
                   alt={event.title} 
                 />
                 <div className="absolute top-6 left-6 bg-[#1e293b] text-[#fdfcf7] px-6 py-3 rounded-[2rem] shadow-2xl font-black uppercase text-center border border-white/10">
                    <p className="text-2xl leading-none mb-0.5">{new Date(event.date).getDate()}</p>
                    <p className="text-[10px] text-[#f59e0b] tracking-widest">{new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</p>
                 </div>
              </div>
              <div className="p-10">
                <span className="text-[#475569] font-black text-[10px] uppercase tracking-[0.3em] mb-3 block">{event.category || 'CAMPUS EVENT'}</span>
                <h3 className="text-3xl font-black text-[#1e293b] mb-6 leading-tight tracking-tighter line-clamp-2">{event.title}</h3>
                <div className="flex items-center gap-2 mb-8 text-[#475569] text-xs font-bold">
                   <MapPin size={14} className="text-[#f59e0b]" /> {event.venue?.name || 'General Hall'}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRegister(event._id); }}
                  className="w-full py-5 bg-[#1e293b] text-[#fdfcf7] rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl hover:bg-[#f59e0b] hover:text-[#1e293b] transition-all duration-500"
                >
                  <Ticket size={18} /> Confirm Entry
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const ClubsView = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const data = await fetchWithAuth('/clubs');
        setClubs(data);
      } catch (err) {
        console.warn("Failed to fetch clubs: Using mock data", err.message);
        setClubs([
          { _id: 'c1', name: 'Elite Tech Corps', description: 'Driving technical excellence through workshops and hackathons.' },
          { _id: 'c2', name: 'Creative Minds Society', description: 'A collective of artists, designers, and visionaries shaping campus aesthetics.' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-10">
      <h1 className="text-7xl font-black text-[#1e293b] tracking-tighter leading-none uppercase">Club <span className="text-[#f59e0b]">Alliance</span></h1>
      
      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {clubs.map((club, idx) => (
            <motion.div 
              key={club._id || idx}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-10 rounded-[3.5rem] border border-[#1e293b]/10 shadow-sm flex flex-col md:flex-row gap-10 items-center"
            >
              <div className="w-32 h-32 rounded-[2.5rem] bg-[#1e293b] p-1 flex-shrink-0">
                 <div className="w-full h-full rounded-[2rem] overflow-hidden bg-white">
                    <img src={`https://picsum.photos/id/${120+idx}/200/200`} className="w-full h-full object-cover" alt="logo" />
                 </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-black text-[#1e293b] tracking-tighter mb-2">{club.name}</h3>
                <p className="text-[#475569] text-sm font-medium line-clamp-2 mb-6">{club.description || 'Shaping the campus culture with innovation and leadership.'}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                   <div className="px-4 py-2 rounded-full bg-[#fdfcf7] border border-[#1e293b]/10 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Users size={12} className="text-[#f59e0b]" /> 42+ Members
                   </div>
                   <button className="px-6 py-2 rounded-full bg-[#1e293b] text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#f59e0b] hover:text-[#1e293b] transition-all">Join Club</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const GalleriesView = () => {
  const [selectedGallery, setSelectedGallery] = useState(null);
  const galleries = [
    { id: 1, title: 'Sports Day 2025', count: 48, category: 'Sports', imgId: '104' },
    { id: 2, title: 'Convocation', count: 156, category: 'Academic', imgId: '106' },
    { id: 3, title: 'Music Night', count: 92, category: 'Cultural', imgId: '107' },
  ];

  return (
    <div className="space-y-12 pb-10">
      <h1 className="text-7xl font-black text-[#1e293b] tracking-tighter leading-none uppercase">UniOne <span className="text-[#f59e0b]">Flash</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {galleries.map(g => (
          <motion.div 
            key={g.id} 
            layoutId={`gallery-${g.id}`}
            whileHover={{ scale: 1.03, rotate: 1 }} 
            className="relative h-[500px] rounded-[3.5rem] overflow-hidden group cursor-pointer shadow-2xl border-4 border-white transition-all duration-500"
            onClick={() => setSelectedGallery(g)}
          >
            <img src={`https://picsum.photos/id/${g.imgId}/900/1200`} className="w-full h-full object-cover transition-all duration-1000" alt={g.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-[#1e293b]/10 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
            <div className="absolute bottom-10 left-10 right-10 text-[#fdfcf7]">
              <span className="text-[#f59e0b] text-[10px] font-black uppercase tracking-widest mb-2 block">{g.category}</span>
              <h3 className="text-4xl font-black mb-4 leading-none tracking-tighter">{g.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">{g.count} Captures</span>
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-[#f59e0b] group-hover:text-[#1e293b] transition-all"><ArrowRight size={20} /></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedGallery && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#1e293b]/95 backdrop-blur-2xl flex items-center justify-center p-8 md:p-20">
            <button onClick={() => setSelectedGallery(null)} className="absolute top-10 right-10 text-[#fdfcf7] hover:rotate-90 transition-transform duration-500 bg-white/10 p-4 rounded-full"><X size={32} /></button>
            <motion.div layoutId={`gallery-${selectedGallery.id}`} className="max-w-5xl w-full text-center">
               <img src={`https://picsum.photos/id/${selectedGallery.imgId}/1600/1200`} className="w-full rounded-[4rem] shadow-2xl mb-10 border-8 border-white/5" alt={selectedGallery.title} />
               <h2 className="text-6xl font-black text-white uppercase tracking-tighter">{selectedGallery.title}</h2>
               <p className="text-[#f59e0b] font-black uppercase tracking-[0.5em] mt-4 text-xs">A moment in time preserved by UniOne</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MAIN APP ENTRY ---

export default function App() {
  const [activeItem, setActiveItem] = useState('Main');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const profile = await fetchWithAuth('/auth/me');
        setUser(profile);
      } catch (err) {
        console.warn("Auth check failed: Using fallback user", err.message);
        setUser({ name: "Ankur", role: "student", _id: "65b912345678" });
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const menuItems = [
    { id: 'Main', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'Event', icon: CalendarDays, label: 'Events' },
    { id: 'Clubs', icon: Users, label: 'Clubs' },
    { id: 'Galleries', icon: Images, label: 'Galleries' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const renderContent = () => {
    if (loading) return <div className="h-[70vh] flex items-center justify-center"><LoadingSpinner /></div>;
    
    switch (activeItem) {
      case 'Main': return <DashboardView onNavigate={setActiveItem} user={user} />;
      case 'Event': return <EventsView />;
      case 'Galleries': return <GalleriesView />;
      case 'Clubs': return <ClubsView />;
      default: return <DashboardView onNavigate={setActiveItem} user={user} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FDFCF7] text-[#1E293B] font-sans selection:bg-[#F59E0B] selection:text-[#1E293B]">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="w-72 h-screen bg-[#1E293B] flex flex-col sticky top-0 z-20 shadow-2xl">
        <div className="p-10">
          <div className="flex flex-col items-center mb-14">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }} 
              className="w-20 h-20 rounded-[2.5rem] border-2 border-[#f59e0b] p-1.5 mb-6 shadow-xl"
            >
               <div className="w-full h-full rounded-[2rem] bg-[#fdfcf7] flex items-center justify-center shadow-inner text-[#1e293b]">
                 <UserIcon size={32} />
               </div>
            </motion.div>
            <h2 className="text-white font-black text-2xl tracking-tighter uppercase mb-1">UniOne</h2>
            <div className="flex items-center gap-2 opacity-60">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
               <span className="text-white text-[9px] font-black tracking-[0.4em] uppercase">Student Identity</span>
            </div>
          </div>

          <nav className="space-y-3">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center gap-5 py-5 px-6 rounded-[2rem] transition-all duration-300 relative group ${
                  activeItem === item.id 
                  ? 'bg-[#f59e0b] text-[#1e293b] shadow-xl shadow-[#f59e0b]/10' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={18} strokeWidth={activeItem === item.id ? 2.5 : 1.5} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                {activeItem === item.id && (
                  <motion.div layoutId="nav-dot" className="absolute right-6 w-1.5 h-1.5 bg-[#1e293b] rounded-full" />
                )}
              </motion.button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-10 space-y-4 border-t border-white/5">
          <button className="w-full p-2 text-white/40 hover:text-white transition-colors flex items-center justify-center gap-4 group">
            <Bell size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Alerts</span>
          </button>
          <button onClick={handleLogout} className="w-full p-4 rounded-2xl bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center gap-4 group">
            <LogOut size={16} />
            <span className="text-[9px] font-black uppercase tracking-widest">Exit Portal</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth bg-[#fdfcf7]">
        <div className="max-w-7xl mx-auto p-10 lg:p-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        :root {
          --primary-800: #1e293b;
          --primary-600: #475569;
          --accent: #f59e0b;
          --cream: #fdfcf7;
        }
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        main::-webkit-scrollbar { width: 8px; }
        main::-webkit-scrollbar-track { background: transparent; }
        main::-webkit-scrollbar-thumb { 
          background: rgba(30, 41, 59, 0.05); 
          border-radius: 100px; 
          border: 4px solid transparent;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}