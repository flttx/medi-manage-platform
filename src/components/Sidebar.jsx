import React, { useContext } from 'react';
import { 
  Users, 
  Calendar, 
  LayoutDashboard, 
  Settings, 
  ClipboardList, 
  TrendingUp,
  Clock,
  Plus,
  Box,
  ChevronDown,
  ChevronRight,
  Briefcase,
  Gift,
  Bell
} from 'lucide-react';
import { RegionContext } from '../contexts/RegionContext';

export const SidebarBase = () => {
  const { region, setRegion, t, activeView, setActiveView } = useContext(RegionContext);
  
  const groups = [
    { items: [
      { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: t.dashboard },
      { id: 'patientManage', icon: <Users size={20} />, label: t.patientManage, shortcut: true },
      { id: 'appointmentManage', icon: <Calendar size={20} />, label: t.appointmentManage, shortcut: true },
      { id: 'clinicalManage', icon: <ClipboardList size={20} />, label: t.clinicalManage, shortcut: true },
      { id: 'financeManage', icon: <CreditCard size={20} />, label: t.financeManage },
      { id: 'operationsCenter', icon: <TrendingUp size={20} />, label: t.operationsCenter },
      { id: 'systemSettings', icon: <Settings size={20} />, label: t.systemSettings },
    ]}
  ];

  return (
    <aside className="w-64 bg-white border-r border-border h-screen flex flex-col items-stretch shrink-0 z-50">
      <div className="p-6 flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="group w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform cursor-pointer">
              <Box size={20} className="text-white" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tighter text-slate-800 block leading-tight">{t.logo}</span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Dental Pro</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100 scale-90">
          <button onClick={() => setRegion('cn')} className={`px-1.5 py-0.5 rounded text-[9px] font-black transition-all ${region === 'cn' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}>CN</button>
          <button onClick={() => setRegion('global')} className={`px-1.5 py-0.5 rounded text-[9px] font-black transition-all ${region === 'global' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}>EN</button>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {groups[0].items.map((item, idx) => (
          <div key={idx} className="mb-0.5">
            <div 
              className={`sidebar-item group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${activeView === item.id || (item.children && item.children.some(c => c.id === activeView)) ? 'bg-primary/5 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => !item.children && setActiveView(item.id)}
            >
              <div className="flex items-center gap-3">
                <span className={`${activeView === item.id || (item.children && item.children.some(c => c.id === activeView)) ? 'text-primary' : 'text-slate-400 group-hover:text-primary transition-colors'}`}>
                  {item.icon}
                </span>
                <span className="font-bold text-xs tracking-wide">{item.label}</span>
              </div>
              {item.hasExpand && <ChevronDown size={14} className={`transition-transform duration-300 ${item.expanded ? "rotate-0 text-primary" : "-rotate-90 text-slate-300"}`} />}
            </div>
          </div>
        ))}
        
        {/* Quick Entrance Section */}
        <div className="px-4 mt-6 mb-2">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{region === 'cn' ? '快速入口' : 'Quick Actions'}</p>
        </div>
        <div className="px-3 space-y-1">
           <button onClick={() => setActiveView('patientManage')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-primary/5 hover:text-primary transition-all text-[11px] font-bold">
              <Plus size={14} className="text-slate-300" /> {t.newPatient}
           </button>
           <button onClick={() => setActiveView('clinicalManage')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-primary/5 hover:text-primary transition-all text-[11px] font-bold">
              <Clock size={14} className="text-slate-300" /> {t.todayIntake}
           </button>
        </div>
      </nav>

      <div className="p-4 space-y-2">
        <div className="bg-blue-50/50 rounded-2xl p-3 border border-blue-100/50">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                    <TrendingUp size={14} className="text-white" />
                 </div>
                 <div className="min-w-0">
                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-60 leading-none mb-1">{t.points || 'Points'}</p>
                    <p className="text-xs font-black text-slate-700 truncate">9,102,394.08</p>
                 </div>
              </div>
              <button className="text-[9px] border border-primary/20 bg-white px-2 py-1 rounded-lg text-primary font-black hover:bg-primary hover:text-white transition-all">{t.recharge}</button>
           </div>
        </div>

        <nav className="space-y-0.5">
           {[
             { icon: <Briefcase size={16} />, label: region === 'cn' ? '推广中心' : 'Promotion', id: 'promo' },
             { icon: <Gift size={16} />, label: region === 'cn' ? '邀请好友' : 'Invite', id: 'invite' },
             { icon: <Bell size={16} />, label: region === 'cn' ? '消息' : 'Messages', id: 'messages', badge: 3 }
           ].map((item, i) => (
             <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 cursor-pointer transition-all group">
                <div className="flex items-center gap-3">
                   <div className="text-slate-400 group-hover:text-primary transition-colors">{item.icon}</div>
                   <span className="text-xs font-bold">{item.label}</span>
                </div>
                {item.badge && <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[8px] font-black flex items-center justify-center shadow-lg shadow-rose-200">{item.badge}</span>}
             </div>
           ))}
        </nav>

        <div className="pt-4 border-t border-slate-100">
           <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all group border border-transparent hover:border-slate-100">
              <div className="relative">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=doctor`} className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-white shadow-sm" alt="avatar" />
                 <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
              </div>
              <div className="flex-1 min-w-0 pr-4">
                 <div className="text-xs font-black text-slate-800 truncate">测试 Pro</div>
                 <div className="text-[9px] font-bold text-slate-400 truncate mt-0.5">100****0000</div>
              </div>
              <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
           </div>
        </div>
      </div>
    </aside>
  );
};

// Also define the icons needed for CreditCard which was missing in imports list but present in groups
const CreditCard = ({ size }) => <Briefcase size={size} />; // Fallback or import correctly if available
