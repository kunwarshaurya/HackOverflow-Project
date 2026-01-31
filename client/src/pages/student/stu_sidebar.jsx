import { LayoutDashboard, CalendarDays, Images, Sparkles, User as UserIcon } from 'lucide-react';

const UserSidebar = ({ activeItem = 'Main', setActiveItem }) => {
  const menuItems = [
    { id: 'Main', icon: LayoutDashboard, label: 'Main' },
    { id: 'Event', icon: CalendarDays, label: 'Event' },
    { id: 'Galleries', icon: Images, label: 'Galleries' },
  ];

  return (
    <div className="w-72 h-[calc(100vh-5rem)] m-4 rounded-[2.5rem] bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col overflow-hidden relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#493129]/10 via-[#8b597b]/5 to-[#efa3a0]/10 animate-pulse pointer-events-none" />
      
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />

      <div className="p-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-full border-2 border-[#efa3a0]/50 p-1 mb-4 shadow-[0_0_30px_rgba(239,163,160,0.4)] relative">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8b597b] via-[#493129] to-[#8b597b] flex items-center justify-center overflow-hidden animate-pulse">
               <UserIcon className="text-[#ffeadb]" size={32} />
            </div>
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#efa3a0]/30 animate-spin" style={{ animationDuration: '3s' }}></div>
          </div>
          <h2 className="text-[#ffeadb] font-black text-xl tracking-tight drop-shadow-lg">STUDENT</h2>
          <span className="text-[#efa3a0] text-[10px] font-black tracking-[0.5em] uppercase italic opacity-80">Personal Node</span>
        </div>

        <nav className="space-y-3">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveItem?.(item.id)}
              className={`w-full flex flex-col items-center gap-2 py-5 px-4 rounded-[2rem] transition-all duration-500 transform hover:scale-105 relative overflow-hidden group ${
                activeItem === item.id 
                ? 'bg-gradient-to-r from-white/30 to-white/10 text-[#ffeadb] shadow-[0_8px_32px_rgba(255,255,255,0.1)] border border-white/30 scale-105' 
                : 'text-[#ffdec7]/40 hover:text-[#efa3a0] hover:bg-white/10'
              }`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animation: 'slideInLeft 0.6s ease-out forwards'
              }}
            >
              {/* Animated background for active item */}
              {activeItem === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#8b597b]/20 to-[#efa3a0]/20 animate-pulse"></div>
              )}
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#efa3a0]/0 to-[#efa3a0]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <item.icon 
                size={24} 
                strokeWidth={activeItem === item.id ? 2.5 : 1.5}
                className={`relative z-10 transition-all duration-300 ${
                  activeItem === item.id ? 'drop-shadow-lg' : ''
                }`}
              />
              <span className="text-[10px] font-black uppercase tracking-widest relative z-10">
                {item.label}
              </span>
              
              {/* Active indicator */}
              {activeItem === item.id && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#efa3a0] rounded-full animate-ping"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 text-center relative z-10">
        <button className="w-full py-4 bg-gradient-to-r from-[#efa3a0] to-[#8b597b] text-white rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group">
          <span className="relative z-10">Discovery Hub</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
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

export default UserSidebar;