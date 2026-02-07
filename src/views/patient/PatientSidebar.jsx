import React, { useContext } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { RegionContext } from '../../contexts/RegionContext';

export const PatientSidebar = ({ 
  sidebarOpen, 
  setActiveView, 
  searchQuery, 
  setSearchQuery, 
  filteredPatients, 
  handleSelectPatient 
}) => {
  const { region, t, selectedPatient } = useContext(RegionContext);

  return (
    <div className={`${sidebarOpen ? 'w-64 xl:w-80' : 'w-0'} flex flex-col border-r border-slate-50 bg-slate-50/20 transition-all duration-300 overflow-hidden shrink-0`}>
       <div className="p-6 border-b border-slate-50 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('patient.queue', { defaultValue: 'Patient Queue' })}</h3>
             <button onClick={() => setActiveView('patientManage')} className="p-1 px-2 rounded-lg bg-slate-100 text-[9px] font-black text-slate-400 hover:text-primary transition-all uppercase">{t('common.exit', { defaultValue: 'Exit' })}</button>
          </div>
          <div className="relative">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
             <input 
               placeholder={t('patient.quickSwitch', { defaultValue: 'Quick Switch...' })}
               className="w-full pl-9 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold outline-none shadow-sm focus:ring-2 focus:ring-primary/10 transition-all"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
       </div>
       
       <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {filteredPatients.map((p, i) => (
             <div 
               key={i} 
               onClick={() => handleSelectPatient(p)}
               className={`flex items-center gap-4 p-4 rounded-[1.5rem] cursor-pointer transition-all border-2 ${
                 p.id === selectedPatient?.id 
                 ? 'bg-white border-primary/20 shadow-xl shadow-slate-200/30' 
                 : 'hover:bg-white border-transparent text-slate-500'
               }`}
             >
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} className={`w-10 h-10 rounded-xl bg-white shadow-sm border ${p.id === selectedPatient?.id ? 'border-primary/20' : 'border-white'}`} alt="" />
                <div className="flex-1 min-w-0">
                   <p className={`text-[13px] font-black truncate leading-none mb-1.5 ${p.id === selectedPatient?.id ? 'text-primary' : 'text-slate-800'}`}>{p.name}</p>
                   <p className="text-[10px] font-bold text-slate-400">{t('patient.id')}: {p.id}</p>
                </div>
                {p.id === selectedPatient?.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                )}
             </div>
          ))}
       </div>
    </div>
  );
};
