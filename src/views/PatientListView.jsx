import React, { useState, useContext } from 'react';
import { 
  Plus, 
  Share, 
  Search, 
  Grid, 
  ClipboardList, 
  FileText, 
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RegionContext } from '../contexts/RegionContext';
import { useToast } from '../contexts/ToastContext';

export const PatientListView = () => {
  const { region, t, setActiveView, setSelectedPatient, patients, setPatients, setGlobalModal } = useContext(RegionContext);
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // grid or list

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  const handlePatientClick = (p) => {
    setSelectedPatient(p);
    setActiveView('patientDetail');
  };

  const handleDelete = (id, name, e) => {
     e.stopPropagation();
     setPatients(patients.filter(p => p.id !== id));
     showToast(region === 'cn' ? `已删除患者: ${name}` : `Deleted patient: ${name}`, 'info');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 p-4 rounded-3xl backdrop-blur-sm border border-white/50 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setGlobalModal({ type: 'patient' })}
            className="btn btn-primary shadow-lg shadow-primary/20 bg-primary px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 active:scale-95 transition-all"
          >
            <Plus size={18} /> {t.newPatient}
          </button>
          <button 
            onClick={() => setGlobalModal({ type: 'export' })}
            className="btn btn-secondary border-none bg-white shadow-sm px-4 py-2.5 rounded-xl font-bold text-xs text-slate-500 flex items-center gap-2 hover:bg-slate-50"
          >
             <Share size={16} className="text-slate-400" /> {region === 'cn' ? '数据导出' : 'Export'}
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              className="w-full pl-11 pr-4 py-2.5 bg-white border-none rounded-xl text-xs font-bold outline-none shadow-sm focus:ring-1 focus:ring-primary/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
             <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary/10 text-primary shadow-sm' : 'text-slate-300 hover:text-slate-500'}`}><Grid size={16} /></button>
             <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary/10 text-primary shadow-sm' : 'text-slate-300 hover:text-slate-500'}`}><ClipboardList size={16} /></button>
          </div>
        </div>
      </div>


      {viewMode === 'list' ? (
        <div className="card overflow-hidden border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem]">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-5 w-12 text-center"><input type="checkbox" className="rounded-sm accent-primary" /></th>
                <th className="p-5">{t.fullName}</th>
                <th className="p-5">{region === 'cn' ? '编号' : 'ID'}</th>
                <th className="p-5">{t.gender}</th>
                <th className="p-5">{t.contact}</th>
                <th className="p-5">{region === 'cn' ? '最近就诊' : 'Last Visit'}</th>
                <th className="p-5">{region === 'cn' ? '风险' : 'Risk'}</th>
                <th className="p-5">{t.status}</th>
                <th className="p-5 text-right pr-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold text-xs text-slate-600">
              {filteredPatients.map((p, i) => (
                <tr key={i} className="group hover:bg-blue-50/40 transition-colors cursor-pointer" onClick={() => handlePatientClick(p)}>
                  <td className="p-5 text-center" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded-sm accent-primary" /></td>
                  <td className="p-5">
                     <div className="flex items-center gap-3">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} className="w-9 h-9 rounded-xl bg-slate-100 shadow-sm border border-white" alt="" />
                        <span className="font-black text-slate-800 group-hover:text-primary transition-colors">{p.name}</span>
                     </div>
                  </td>
                  <td className="p-5 font-mono text-slate-400 text-[10px] tracking-tighter">{p.id}</td>
                  <td className="p-5 uppercase tracking-widest text-[10px]">{t[p.gender] || p.gender}</td>
                  <td className="p-5 text-slate-500">{p.phone}</td>
                  <td className="p-5 text-slate-400 tabular-nums">{p.lastVisit}</td>
                  <td className="p-5">
                     <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${p.risk === 'High' ? 'bg-rose-100 text-rose-600' : p.risk === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {p.risk}
                     </span>
                  </td>
                  <td className="p-5">
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'confirmed' ? 'bg-emerald-500' : p.status === 'pending' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                         <span className="text-[10px] opacity-70">{t[p.status] || p.status}</span>
                      </div>
                  </td>
                  <td className="p-5 text-right pr-8">
                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={(e) => { e.stopPropagation(); setActiveView('patientDetail'); setSelectedPatient(p); }} className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm"><FileText size={14} /></button>
                        <button onClick={(e) => handleDelete(p.id, p.name, e)} className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-500/30 transition-all shadow-sm"><Trash2 size={14} /></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPatients.length === 0 && (
             <div className="p-20 flex flex-col items-center justify-center text-slate-300 space-y-4">
                <Search size={48} strokeWidth={1} />
                <p className="font-black text-xs uppercase tracking-[0.2em]">{region === 'cn' ? '未找到相关患者' : 'No Patients Found'}</p>
             </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredPatients.map((p, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
               className="card p-6 border-none shadow-xl shadow-slate-200/50 bg-white hover:translate-y-[-4px] transition-all cursor-pointer group rounded-[2rem]"
               onClick={() => handlePatientClick(p)}
             >
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-4">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} className="w-12 h-12 rounded-2xl bg-slate-100 shadow-inner" alt="" />
                      <div>
                         <h4 className="font-black text-slate-800 group-hover:text-primary transition-colors">{p.name}</h4>
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{p.id}</p>
                      </div>
                   </div>
                   <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${p.risk === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>{p.risk}</span>
                </div>
                <div className="space-y-3 pt-4 border-t border-slate-50">
                   <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-slate-400 uppercase tracking-widest">{t.contact}</span>
                       <span className="text-slate-600">{p.phone}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-slate-400 uppercase tracking-widest">Last Visit</span>
                       <span className="text-slate-600">{p.lastVisit}</span>
                   </div>
                </div>
                <div className="mt-6 flex gap-2">
                   <button className="flex-1 py-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl text-[10px] font-black uppercase transition-all">Profile</button>
                   <button className="flex-1 py-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl text-[10px] font-black uppercase transition-all">Records</button>
                </div>
             </motion.div>
           ))}
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-slate-100">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Showing {filteredPatients.length} items</p>
         <div className="flex gap-2">
            {[1, 2, 3].map(n => (
              <button key={n} className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${n === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-400 hover:text-slate-600'}`}>{n}</button>
            ))}
         </div>
      </div>
    </motion.div>
  );
};
