import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Bell,
  CreditCard,
  Shield,
  ShieldOff,
  MousePointer2,
  Package
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RegionContext } from '../contexts/RegionContext';

export const SidebarBase = () => {
  const { 
    region, setRegion, t, user, setUser, 
    privacyMode, setPrivacyMode, userRole, setUserRole,
    activeView, setActiveView 
  } = useContext(RegionContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const groups = [
    { items: [
      { id: 'dashboard', path: '/', icon: <LayoutDashboard size={20} />, label: t('modules.dashboard') },
      { id: 'patientManage', path: '/patients', icon: <Users size={20} />, label: t('modules.patientManage'), shortcut: true },
      { id: 'appointmentManage', path: '/appointments', icon: <Calendar size={20} />, label: t('modules.appointmentManage'), shortcut: true },
      { id: 'clinicalManage', path: '/clinical', icon: <ClipboardList size={20} />, label: t('modules.clinicalManage'), shortcut: true },
      { 
        id: 'financeManage', 
        path: '/finance',
        icon: <CreditCard size={20} />, 
        label: t('modules.financeManage'),
        roles: ['admin', 'doctor', 'receptionist'] 
      },
      { id: 'operationsCenter', path: '/operations', icon: <TrendingUp size={20} />, label: t('modules.operationsCenter') },
      { 
        id: 'labManage', 
        path: '/lab',
        icon: <Box size={20} />, 
        label: t('modules.labManage')
      },
      { 
        id: 'inventoryManage', 
        path: '/inventory',
        icon: <Package size={20} />, 
        label: t('modules.inventoryManage')
      },
      { 
        id: 'systemSettings', 
        path: '/settings',
        icon: <Settings size={20} />, 
        label: t('modules.systemSettings'),
        roles: ['admin'] 
      },
    ].filter(item => {
        // 1. Role-based visibility for "Lab" vs "Clinic" specialized views
        if (userRole === 'lab') {
            // Lab mode focus
            if (!['labManage', 'inventoryManage', 'dashboard', 'patientManage'].includes(item.id)) return false;
        } else {
            // Clinic mode: hide inventory management by default as it's for production
            if (item.id === 'inventoryManage') return false;
        }
        
        // 2. Permission-based filtering (admin/doctor/etc)
        if (item.roles && !item.roles.includes(user.role)) return false;
        
        return true;
    })}
  ];

  return (
    <aside className="w-64 bg-white border-r border-border h-screen flex flex-col items-stretch shrink-0 z-50">
      <div className="p-6 flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="group w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform cursor-pointer">
              <Box size={20} className="text-white" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tighter text-slate-800 block leading-tight">{t('common.logo')}</span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Dental Pro</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100 scale-90">
          <button onClick={() => setRegion('cn')} className={`px-1.5 py-0.5 rounded text-[9px] font-black transition-all ${region === 'cn' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}>CN</button>
          <button onClick={() => setRegion('global')} className={`px-1.5 py-0.5 rounded text-[9px] font-black transition-all ${region === 'global' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}>EN</button>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto border-none">
        {groups[0].items.map((item, idx) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <div key={idx} className="mb-0.5">
              <div 
                className={`sidebar-item group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-primary/5 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
                onClick={() => {
                  if (item.action) item.action();
                  else if (item.path) navigate(item.path);
                }}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary transition-colors'}`}>
                    {item.icon}
                  </span>
                  <span className="font-bold text-xs tracking-wide">{item.label}</span>
                </div>
                {item.isDeveloping && (
                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-black rounded uppercase tracking-tighter shadow-sm border border-amber-200/50">Beta</span>
                )}
                {item.hasExpand && <ChevronDown size={14} className={`transition-transform duration-300 ${item.expanded ? "rotate-0 text-primary" : "-rotate-90 text-slate-300"}`} />}
              </div>
            </div>
          );
        })}
        
        {/* Quick Entrance Section */}
        <div className="px-4 mt-6 mb-2">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{t('common.quickActions')}</p>
        </div>
        <div className="px-3 space-y-1">
           {userRole === 'lab' ? (
             <>
               <button onClick={() => navigate('/patients')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-primary/5 hover:text-primary transition-all text-[11px] font-bold">
                  <Users size={14} className="text-slate-300" /> {t('patient.list')}
               </button>
               <button onClick={() => navigate('/lab')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-primary/5 hover:text-primary transition-all text-[11px] font-bold">
                  <Box size={14} className="text-slate-300" /> {t('lab.title')}
               </button>
             </>
           ) : (
             <>
               <button onClick={() => navigate('/patients')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-primary/5 hover:text-primary transition-all text-[11px] font-bold">
                  <Plus size={14} className="text-slate-300" /> {t('patient.new')}
               </button>
               <button onClick={() => navigate('/clinical')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-primary/5 hover:text-primary transition-all text-[11px] font-bold">
                  <Clock size={14} className="text-slate-300" /> {t('common.records')}
               </button>
             </>
           )}
        </div>
      </nav>

      <div className="p-4 space-y-3">
        {/* H5 Entrances */}
        <div className="flex gap-2">
           <button 
             onClick={() => {
               const url = window.location.origin + window.location.pathname + '?platform=patient-h5';
               window.open(url, '_blank', 'width=375,height=812');
             }}
             className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all active:scale-95"
           >
              <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                 <Box size={16} />
              </div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-primary transition-colors">{t('common.patientH5')}</span>
           </button>
           <button 
             onClick={() => {
               const url = window.location.origin + window.location.pathname + '?platform=doctor-h5';
               window.open(url, '_blank', 'width=375,height=812');
             }}
             className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all active:scale-95"
           >
              <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                 <Box size={16} />
              </div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-primary transition-colors">{t('common.doctorH5')}</span>
           </button>
        </div>
        
        <div className="bg-blue-50/50 rounded-2xl p-3 border border-blue-100/50">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                    <TrendingUp size={14} className="text-white" />
                 </div>
                 <div className="min-w-0">
                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-60 leading-none mb-1">{t('common.points')}</p>
                    <p className="text-xs font-black text-slate-700 truncate">9,102,394.08</p>
                 </div>
              </div>
              <button className="text-[9px] border border-primary/20 bg-white px-2 py-1 rounded-lg text-primary font-black hover:bg-primary hover:text-white transition-all">{t('common.recharge')}</button>
           </div>
        </div>

        <nav className="space-y-0.5">
           {[
             { icon: <Briefcase size={16} />, label: t('common.promotion'), id: 'promo' },
             { icon: <Gift size={16} />, label: t('common.invite'), id: 'invite' },
             { icon: <Bell size={16} />, label: t('common.messages'), id: 'messages', badge: 3 }
           ].map((item, i) => (
             <div key={i} className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 cursor-pointer transition-all group ${activeView === item.id ? 'bg-primary/5 text-primary' : ''}`} onClick={() => setActiveView(item.id)}>
                <div className="flex items-center gap-3">
                   <div className={`${activeView === item.id ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} transition-colors`}>{item.icon}</div>
                   <span className="text-xs font-bold">{item.label}</span>
                </div>
                {item.badge && <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[8px] font-black flex items-center justify-center shadow-lg shadow-rose-200">{item.badge}</span>}
             </div>
           ))}
        </nav>
        <div className="pt-4 border-t border-slate-100">
           <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all group border border-transparent hover:border-slate-100 relative">
              <div className="relative">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=doctor`} className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-white shadow-sm" alt="avatar" />
                 <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                 <div className="text-xs font-black text-slate-800 truncate">{userRole === 'lab' ? t('common.labTechnician') : user.name}</div>
                 <div className="flex items-center gap-1 mt-0.5" onClick={(e) => {
                    e.stopPropagation();
                    setUser(prev => ({ ...prev, role: prev.role === 'admin' ? 'doctor' : 'admin' }));
                 }}>
                    <div className={`w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                     <span className="text-[9px] font-bold text-slate-400 truncate uppercase tracking-tighter hover:text-primary transition-colors cursor-help">
                        {t(`common.role.${user.role}`)} {t('common.role.label')}
                     </span>
                 </div>
              </div>
              
              <button 
                  onClick={(e) => {
                      e.stopPropagation();
                      setUserRole(userRole === 'clinic' ? 'lab' : 'clinic');
                  }}
                  className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer shrink-0 ${userRole === 'lab' ? 'bg-amber-500' : 'bg-slate-200'}`}
                  title={t('common.labView')}
              >
                  <motion.div 
                      animate={{ x: userRole === 'lab' ? 16 : 0 }}
                      initial={false}
                      className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm"
                  />
              </button>
           </div>
        </div>
      </div>
    </aside>
  );
};
