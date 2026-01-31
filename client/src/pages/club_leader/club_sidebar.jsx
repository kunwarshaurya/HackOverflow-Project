import { Boxes, FileEdit, ClipboardList, MessageCircle, FileBarChart, ChevronRight } from 'lucide-react';

const ClubSidebar = ({ activeItem = 'Main', setActiveItem }) => {
  const menuItems = [
    { id: 'Main', icon: Boxes, label: 'Main' },
    { id: 'Proposal', icon: FileEdit, label: 'Proposal' },
    { id: 'Request', icon: ClipboardList, label: 'Request' },
    { id: 'Chat', icon: MessageCircle, label: 'Chat' },
    { id: 'Event Report', icon: FileBarChart, label: 'Event Report' },
  ];

  return (
    <div className="w-72 h-[calc(100vh-5rem)] m-4 rounded-[2.5rem] bg-gradient-to-br from-white/25 via-white/15 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#8b597b]/15 via-[#493129]/10 to-[#efa3a0]/15 animate-pulse pointer-events-none" />
      
      {/* Glossy top highlight */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none" />
      
      {/* Floating orb */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b597b]/20 blur-3xl rounded-full -mr-16 -mt-16 animate-pulse" />
      
      <div className="p-8 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b597b] to-[#493129] flex items-center justify-center border border-white/30 shadow-lg relative overflow-hidden group">
            <Boxes className="text-[#ffeadb] relative z-10" size={24} />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div>
            <h2 className="text-[#ffeadb] font-black tracking-tighter text-xl drop-shadow-lg">CLUB</h2>
            <p className="text-[#efa3a0] text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">Management</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveItem?.(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-500 relative overflow-hidden group transform hover:scale-105 ${
                activeItem === item.id 
                ? 'bg-gradient-to-r from-[#efa3a0]/30 via-[#8b597b]/20 to-transparent text-white border-r-4 border-[#efa3a0] shadow-[0_8px_32px_rgba(239,163,160,0.2)] scale-105' 
                : 'text-[#ffdec7]/50 hover:text-[#ffeadb] hover:translate-x-2 hover:bg-white/10'
              }`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animation: 'slideInRight 0.6s ease-out forwards'
              }}
            >
              {/* Active background animation */}
              {activeItem === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#8b597b]/10 to-[#efa3a0]/10 animate-pulse"></div>
              )}
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#efa3a0]/0 via-[#efa3a0]/10 to-[#efa3a0]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <item.icon 
                size={18} 
                className={`relative z-10 transition-all duration-300 ${
                  activeItem === item.id ? 'text-[#efa3a0] drop-shadow-lg' : 'group-hover:text-[#efa3a0]'
                }`} 
              />
              <span className="font-bold text-sm relative z-10 transition-all duration-300">
                {item.label}
              </span>
              
              {/* Active indicator */}
              {activeItem === item.id && (
                <ChevronRight size={14} className="ml-auto text-[#efa3a0] animate-pulse relative z-10" />
              )}
              
              {/* Hover arrow */}
              {activeItem !== item.id && (
                <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 relative z-10" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 bg-gradient-to-t from-black/20 to-transparent relative z-10">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-sm">
           <p className="text-[10px] font-black text-[#8b597b] uppercase tracking-widest mb-1 opacity-80">Active Status</p>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-ping"></div>
              <div className="w-2 h-2 rounded-full bg-green-400 absolute"></div>
              <span className="text-xs font-bold text-[#ffeadb] drop-shadow-sm">Verified Leader</span>
           </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ClubSidebar;