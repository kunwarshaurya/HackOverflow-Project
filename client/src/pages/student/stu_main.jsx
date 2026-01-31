import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Users, 
  ChevronRight, 
  Send, 
  Bell, 
  Search,
  X,
  Maximize2,
  Zap,
  TrendingUp,
  Award,
  Calendar,
  Layers
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

/**
 * NOTE: Ensure your local import is preserved:
 * import useAuth from '../../hooks/useAuth';
 */
const useAuth = () => ({
  user: { name: "Alex Explorer", tier: 2 }
});

// --- Mock Data ---
const UPCOMING_EVENTS = [
  {
    id: 1,
    name: "Lunar Music Festival",
    desc: "Experience the ultimate synth-wave night under the stars.",
    date: "Oct 24, 2024",
    time: "19:00 - 23:00",
    images: [
      "https://images.unsplash.com/photo-1459749411177-042180ceea72?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 2,
    name: "Tech Innovators Summit",
    desc: "Where the future of coding meets high-level networking.",
    date: "Nov 02, 2024",
    time: "10:00 - 17:00",
    images: [
      "https://images.unsplash.com/photo-1540575861501-7ad0582373f3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 3,
    name: "Art & Canvas Night",
    desc: "Unleash your creativity with professional mentors and gear.",
    date: "Nov 15, 2024",
    time: "14:00 - 18:00",
    images: [
      "https://images.unsplash.com/photo-1460666819451-7410f58939b1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&w=600&q=80"
    ]
  }
];

const TIMELINE_EVENTS = [
  { id: 101, name: "Design Sprint", date: "Feb 02" },
  { id: 102, name: "Code Jam", date: "Feb 10" },
  { id: 103, name: "hackOverflow 2.0", date: "Feb 22" },
  { id: 104, name: "Project Demo", date: "Mar 05" },
];

const CHAT_MESSAGES = [
  { id: 1, sender: "Club Lead Sarah", text: "Hey everyone! Don't forget about the summit registration!", type: "lead" },
  { id: 2, sender: "You", text: "Got it! Are there any student discounts left?", type: "me" },
  { id: 3, sender: "Club Lead Sarah", text: "Yes, use code HACK50 for a half-off ticket!", type: "lead" },
  { id: 4, sender: "James", text: "Is the event in the main auditorium?", type: "other" },
];

// --- Sub-Components ---

const UpcomingEventsTimeline = () => {
  return (
    <div className="bg-[#5c3a52] p-8 rounded-[2.5rem] text-white flex flex-col shadow-2xl relative overflow-hidden h-full min-h-[450px]">
      <div className="relative z-10 mb-8 text-center">
        <h3 className="text-xl font-black uppercase tracking-[0.3em] text-[#ffdec7] flex items-center justify-center gap-2">
          <Calendar size={18} /> Timeline
        </h3>
        <p className="text-white/40 text-[10px] font-black uppercase mt-1 tracking-widest">Upcoming phases</p>
      </div>

      <div className="relative flex-1 flex flex-col justify-between py-4">
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#efa3a0] to-transparent -translate-x-1/2 opacity-30"></div>
        
        {TIMELINE_EVENTS.map((item, idx) => (
          <div key={item.id} className={`relative w-full flex items-center mb-8 last:mb-0 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className={`w-1/2 px-4 group cursor-pointer transition-all ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
              <span className="block text-[10px] font-black text-[#efa3a0] uppercase tracking-widest">{item.date}</span>
              <h4 className="text-sm md:text-base font-black text-white group-hover:text-[#ffdec7] transition-all line-clamp-1">{item.name}</h4>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white z-10 border-4 border-[#5c3a52] shadow-[0_0_10px_#efa3a0] group-hover:scale-150 transition-transform"></div>
            <div className="w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserStats = () => {
  const { user } = useAuth();
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Progress',
        data: [12, 19, 15, 28, 22, 35],
        borderColor: '#8b597b',
        backgroundColor: 'rgba(139, 89, 123, 0.1)',
        tension: 0.45,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { 
      y: { display: false }, 
      x: { 
        grid: { display: false }, 
        ticks: { color: '#493129', font: { size: 10, weight: 'bold' } } 
      } 
    }
  };

  return (
    <div id="profile" className="pb-12 px-6 max-w-7xl mx-auto mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-[#8b597b]/10 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
          {/* Tie Dye Texture Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none tie-dye-bg"></div>
          
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#8b597b] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-2">
                <Award size={12} /> Student Tier {user?.tier || 2}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#493129] mb-4 tracking-tighter leading-tight">
              Welcome back,<br/>
              <span className="text-[#5c3a52]">{user?.name || 'Student'}</span>
            </h1>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-[#f5e6d3] p-6 rounded-[2.5rem] border border-[#493129]/5 cursor-pointer transition-all duration-300 hover:bg-[#8b597b] hover:text-white group">
                <p className="text-[10px] text-[#8b597b] font-black uppercase tracking-widest mb-1 group-hover:text-white/60">Clubs Joined</p>
                <p className="text-3xl font-black">12</p>
              </div>
              <div className="bg-[#efa3a0] p-6 rounded-[2.5rem] border border-white/20 cursor-pointer transition-all duration-300 hover:scale-105 group text-white">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Events Attended</p>
                <p className="text-3xl font-black">28</p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-80 h-72 bg-white/60 backdrop-blur-sm rounded-[3rem] p-8 border border-[#ffeadb] relative overflow-hidden group hover:border-[#8b597b]/20 transition-all z-10">
             <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-[10px] font-black text-[#493129]/40 uppercase">Performance</p>
                  <h4 className="text-xl font-black text-[#8b597b]">Growth</h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
                   <TrendingUp className="text-[#5c3a52]" size={18} />
                </div>
             </div>
             <div className="h-40">
               <Line data={chartData} options={chartOptions} />
             </div>
          </div>
        </div>

        <UpcomingEventsTimeline />
      </div>
    </div>
  );
};

const TicketGallery = ({ images, onGalleryOpen }) => {
  return (
    <div 
      className="relative w-full h-full cursor-pointer group flex items-center justify-center"
      onClick={() => onGalleryOpen(images)}
    >
      {images.map((img, i) => (
        <div 
          key={i}
          className="absolute w-[85%] h-[85%] rounded-2xl overflow-hidden shadow-2xl border-[4px] border-white transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-y-[-5px]"
          style={{
            transform: `translate(${i * 6}px, ${-i * 4}px) rotate(${i * 2}deg)`,
            zIndex: images.length - i,
          }}
        >
          <img src={img} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
        </div>
      ))}
    </div>
  );
};

const CurvedCarousel = ({ onGalleryOpen }) => {
  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
  };

  return (
    <section id="events" className="py-24 overflow-hidden relative">
      <div className="px-6 max-w-7xl mx-auto mb-16">
        <h2 className="text-5xl md:text-7xl font-black text-[#493129] tracking-tighter">Upcoming Events</h2>
        <p className="text-[#493129]/40 font-bold max-w-md mt-4 text-xs uppercase tracking-[0.3em]">Your interactive ticket wallet</p>
      </div>

      <div className="w-full overflow-hidden">
        <div 
          ref={scrollRef} 
          onScroll={handleScroll}
          className="overflow-x-auto scrollbar-hide flex gap-12 md:gap-24 px-[10vw] h-[520px] items-center cursor-grab active:cursor-grabbing snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {UPCOMING_EVENTS.map((event, i) => {
            const cardCount = UPCOMING_EVENTS.length;
            const currentPos = i / (cardCount - 1 || 1);
            const dist = (currentPos - scrollProgress) * 1.8;
            
            const rotationY = dist * -20;
            const translationZ = Math.abs(dist) * -120;
            const translationY = Math.abs(dist) * 15;
            const opacity = 1 - Math.abs(dist) * 0.3;

            return (
              <div 
                key={event.id} 
                className="min-w-[300px] md:min-w-[550px] h-[360px] relative transition-transform duration-500 snap-center flex-shrink-0"
                style={{
                  perspective: '1200px',
                  transform: `rotateY(${rotationY}deg) translateZ(${translationZ}px) translateY(${translationY}px)`,
                  opacity: Math.max(0.2, opacity),
                  zIndex: Math.floor(50 - Math.abs(dist) * 20),
                }}
              >
                <div className="w-full h-full bg-white rounded-[3rem] flex flex-col md:flex-row overflow-hidden shadow-2xl border-2 border-[#493129]/5 group">
                  <div className="flex-[1.5] p-8 md:p-10 flex flex-col justify-between relative bg-white h-full">
                    <div>
                      <h3 className="text-3xl font-black text-[#493129] leading-none mb-4 tracking-tighter group-hover:text-[#8b597b] transition-colors">{event.name}</h3>
                      <p className="text-xs text-[#493129]/60 font-medium leading-relaxed line-clamp-3">{event.desc}</p>
                    </div>
                    <div className="flex justify-between items-end border-t border-[#ffeadb] pt-6">
                      <div>
                        <p className="text-[10px] text-[#5c3a52] font-black uppercase tracking-widest mb-1">Details</p>
                        <p className="text-base font-black text-[#493129]">{event.date}</p>
                      </div>
                      <div className="bg-[#5c3a52] text-white p-3 rounded-xl hover:scale-110 transition-all cursor-pointer">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 bg-[#fdfaf8] p-8 relative overflow-hidden h-full">
                    <TicketGallery images={event.images} onGalleryOpen={onGalleryOpen} />
                  </div>
                </div>
              </div>
            );
          })}
          <div className="min-w-[10vw] flex-shrink-0"></div>
        </div>
      </div>
    </section>
  );
};

const GalleryModal = ({ images, onClose }) => {
  const [index, setIndex] = useState(0);
  const next = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div 
      className="fixed inset-0 z-[200] bg-[#2a1b16]/95 backdrop-blur-2xl flex items-center justify-center p-8 md:p-24"
      onClick={onClose}
    >
      <button className="absolute top-10 right-10 z-[220] w-12 h-12 bg-white/10 hover:bg-[#efa3a0] text-white rounded-full flex items-center justify-center" onClick={onClose}>
        <X size={24} />
      </button>

      <div className="relative w-full max-w-4xl aspect-video" onClick={next}>
        {images.map((img, i) => (
          <div 
            key={i}
            className={`absolute inset-0 rounded-[2.5rem] overflow-hidden border-4 border-white/10 transition-all duration-500`}
            style={{
              opacity: i === index ? 1 : 0,
              transform: i === index ? 'scale(1)' : 'scale(0.9)',
              zIndex: i === index ? 10 : 0,
            }}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CommunityChat = () => {
  const [msg, setMsg] = useState("");
  const [activeChannel, setActiveChannel] = useState(0);

  return (
    <section id="community" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col lg:row h-[650px] border border-[#493129]/5">
        <div className="w-full lg:w-[300px] bg-[#5c3a52] p-8 flex flex-col text-white">
          <h2 className="text-xl font-black tracking-tighter italic mb-8">Lobby</h2>
          <div className="space-y-2 flex-1">
            {['Global Chat', 'hackOverflow 2.0', 'Bug Hunting'].map((name, i) => (
              <div 
                key={i} 
                onClick={() => setActiveChannel(i)}
                className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between group ${activeChannel === i ? 'bg-[#ffeadb] text-[#5c3a52] shadow-lg' : 'hover:bg-white/10 text-white/60'}`}
              >
                <p className="font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
                   {name}
                </p>
                {activeChannel === i && <div className="w-2 h-2 rounded-full bg-[#5c3a52]"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white">
          <div className="p-6 border-b border-[#ffeadb] flex items-center justify-between">
            <h3 className="font-black text-[#493129] text-lg italic">{['Global Chat', 'hackOverflow 2.0', 'Bug Hunting'][activeChannel]}</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-[#fdfaf8]">
            {CHAT_MESSAGES.map((c) => (
              <div key={c.id} className={`flex flex-col ${c.type === 'me' ? 'items-end' : 'items-start'}`}>
                <p className="text-[9px] font-black text-[#493129]/30 uppercase tracking-widest mb-1 px-2">{c.sender}</p>
                <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-xs font-bold leading-relaxed shadow-sm ${
                    c.type === 'me' ? 'bg-[#5c3a52] text-white rounded-tr-none' : 'bg-[#ffeadb] text-[#493129] rounded-tl-none'
                  }`}>
                  {c.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-8">
            <div className="flex items-center gap-3 bg-[#ffeadb] p-2 rounded-[1.5rem] border-2 border-white shadow-lg">
              <input 
                type="text" 
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setMsg("")}
                placeholder="Message..." 
                className="flex-1 bg-transparent border-none outline-none px-4 text-[#493129] font-black placeholder:text-[#493129]/30 text-xs"
              />
              <button onClick={() => setMsg("")} className="bg-[#5c3a52] text-white w-10 h-10 rounded-full flex items-center justify-center">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function StudentMain() {
  const [galleryImages, setGalleryImages] = useState(null);

  return (
    <div className="min-h-screen bg-[#ffeadb] text-[#493129] font-sans selection:bg-[#8b597b] selection:text-white overflow-x-hidden">
      
      <main className="relative w-full max-w-full">
        {/* Background Tie Dye Blobs */}
        <div className="fixed -top-[10%] -right-[10%] w-[50vw] h-[50vw] tie-dye-blob opacity-20 pointer-events-none"></div>
        <div className="fixed top-[40%] -left-[10%] w-[40vw] h-[40vw] tie-dye-blob-alt opacity-10 pointer-events-none"></div>

        <UserStats />
        
        <CurvedCarousel onGalleryOpen={(imgs) => setGalleryImages(imgs)} />
        
        <CommunityChat />

        <footer className="py-16 px-12 bg-white mt-12 border-t border-[#ffeadb] rounded-t-[3.5rem]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#5c3a52] rounded-xl flex items-center justify-center text-white shadow-xl">
                <Zap size={18} fill="currentColor" />
              </div>
              <span className="font-black text-2xl tracking-tighter">hackOverflow</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#493129]/30">Level Up Your Student Life</p>
          </div>
        </footer>
      </main>

      {galleryImages && (
        <GalleryModal images={galleryImages} onClose={() => setGalleryImages(null)} />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');
        
        :root { 
          font-family: 'Poppins', sans-serif; 
        }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        /* Tie Dye Aesthetic Gradients */
        .tie-dye-bg {
          background: radial-gradient(circle at 20% 30%, #8b597b 0%, transparent 40%),
                      radial-gradient(circle at 80% 20%, #efa3a0 0%, transparent 40%),
                      radial-gradient(circle at 50% 80%, #ffeadb 0%, transparent 50%),
                      radial-gradient(circle at 10% 90%, #5c3a52 0%, transparent 30%);
          filter: blur(20px);
          background-size: 200% 200%;
        }

        .tie-dye-blob {
          background: radial-gradient(circle, #8b597b 0%, #efa3a0 40%, transparent 70%);
          filter: blur(80px);
          border-radius: 50%;
        }

        .tie-dye-blob-alt {
          background: radial-gradient(circle, #5c3a52 0%, #ffeadb 50%, transparent 80%);
          filter: blur(100px);
          border-radius: 50%;
        }

        /* Standard static reveal for better performance without "dropping" */
        main { opacity: 1; }
      `}} />
    </div>
  );
}