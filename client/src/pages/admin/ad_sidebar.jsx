import { LayoutDashboard, ClipboardList, Inbox, ShieldCheck, ChevronRight } from 'lucide-react';

const AdminSidebar = ({ activeItem = 'Main', setActiveItem }) => {
  const menuItems = [
    { id: 'Main', icon: LayoutDashboard, label: 'Main' },
    { id: 'Request', icon: ClipboardList, label: 'Request' },
    { id: 'Query Box', icon: Inbox, label: 'Query Box' },
  ];

  return (
    <div className="w-72 h-[calc(100vh-5rem)] m-4 rounded-[2.5rem] bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-xl border border-white/30 shadow-2xl flex flex-col overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#493129]/20 via-[#8b597b]/15 to-[#efa3a0]/20 animate-pulse pointer-events-none" />
      
      {/* Refractive Header Glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#efa3a0]/20 via-white/10 to-transparent pointer-events-none" />
      
      {/* Floating particles effect */}
      <div className="absolute top-10 right-10 w-2 h-2 bg-[#efa3a0] rounded-full animate-ping"></div>
      <div className="absolute top-20 right-16 w-1 h-1 bg-[#8b597b] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-16 right-8 w-1.5 h-1.5 bg-[#493129] rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
      
      <div className="p-8 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#493129] via-[#8b597b] to-[#493129] flex items-center justify-center border border-white/30 shadow-lg relative overflow-hidden group">
            <ShieldCheck className="text-[#efa3a0] relative z-10" size={24} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#efa3a0]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div>
            <h2 className="text-[#ffeadb] font-black tracking-tighter text-xl drop-shadow-lg">ADMIN</h2>
            <p className="text-[#efa3a0] text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">Authority Node</p>
          </div>
        </div>

        <nav className="space-y-3">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveItem?.(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden transform hover:scale-105 ${
                activeItem === item.id 
                ? 'bg-gradient-to-r from-[#8b597b]/40 via-[#493129]/30 to-[#8b597b]/40 text-white border-l-4 border-[#efa3a0] shadow-[0_0_30px_rgba(239,163,160,0.3)] scale-105' 
                : 'text-[#ffdec7]/50 hover:bg-white/15 hover:text-[#ffeadb] hover:translate-x-1'
              }`}
              style={{ 
                animationDelay: `${index * 0.15}s`,
                animation: 'slideInUp 0.6s ease-out forwards'
              }}
            >
              {/* Active background glow */}
              {activeItem === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#efa3a0]/10 via-[#8b597b]/10 to-[#efa3a0]/10 animate-pulse"></div>
              )}
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#efa3a0]/0 via-[#efa3a0]/20 to-[#efa3a0]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <item.icon 
                size={20} 
                className={`relative z-10 transition-all duration-300 ${
                  activeItem === item.id ? 'text-[#efa3a0] drop-shadow-lg' : 'group-hover:text-white'
                }`} 
              />
              <span className="font-bold text-sm tracking-wide relative z-10 transition-all duration-300">
                {item.label}
              </span>
              
              {/* Active indicator with pulse */}
              {activeItem === item.id && (
                <div className="ml-auto flex items-center gap-2 relative z-10">
                  <div className="w-2 h-2 bg-[#efa3a0] rounded-full animate-ping"></div>
                  <ChevronRight size={14} className="text-[#efa3a0] animate-pulse" />
                </div>
              )}
              
              {/* Hover indicator */}
              {activeItem !== item.id && (
                <ChevronRight 
                  size={14} 
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 relative z-10" 
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-white/10 bg-gradient-to-t from-black/20 to-transparent relative z-10">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-sm">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#efa3a0] to-[#8b597b] flex items-center justify-center text-[#493129] font-black text-xs shadow-lg">
            A
          </div>
          <div className="text-[10px] font-bold text-[#ffdec7]/60 tracking-widest uppercase">
            <div className="text-[#ffeadb] font-black">System Root 01</div>
            <div className="text-[#efa3a0] text-[8px] opacity-60">Administrator Access</div>
          </div>
          <div className="ml-auto">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminSidebar;