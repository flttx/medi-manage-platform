import React, { useContext, useState } from 'react';
import { 
  Users, 
  Gift, 
  MessageCircle, 
  Calendar, 
  TrendingUp, 
  Filter, 
  Send,
  AlertCircle,
  Target,
  MoreHorizontal,
  Cake,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateAgeFromId } from '../utils/calculations';
import { RegionContext } from '../contexts/RegionContext';
import { useToast } from '../contexts/ToastContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- PREMIUM OPERATIONS VIEW ---
// Re-designed for high-end medical analytics with zero-black policy

export const OperationsView = () => {
  const { t, patients } = useContext(RegionContext);
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('retention');

  // Calculate Retention Data
  const retentionData = React.useMemo(() => {
     const total = patients.length;
     const active = patients.filter(p => p.status === 'confirmed').length;
     // Mock logic for risk
     const atRisk = patients.filter(p => p.risk === 'High' || p.risk === 'Medium').length;
     const lost = patients.filter(p => p.status === 'cancelled').length;
     
     return [
       { name: t('operations.total'), count: total, color: '#6366f1', bg: 'bg-indigo-50 text-indigo-600' },
       { name: t('operations.active'), count: active, color: '#3b82f6', bg: 'bg-blue-50 text-blue-600' },
       { name: t('operations.atRisk'), count: atRisk, color: '#f59e0b', bg: 'bg-amber-50 text-amber-600' },
       { name: t('operations.lost'), count: lost, color: '#f43f5e', bg: 'bg-rose-50 text-rose-600' },
     ];
  }, [patients]);

  // Calculate Birthdays
  const birthdayPatients = React.useMemo(() => {
      return patients.slice(0, 3).map((p, i) => ({
          ...p,
          date: `Feb ${10 + i}`,
          age: calculateAgeFromId(p.id),
      }));
  }, [patients]);

  const handleSendWishes = (patient) => {
    showToast(`${t('operations.wishSent', { name: patient.name })}`, 'success');
  };

  const handleBulkAction = (action) => {
    showToast(`${t('operations.bulkAction', { action })}`, 'info');
  };

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700 p-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
           <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t('modules.operationsCenter')}</h2>
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('operations.subtitle')}</p>
           </div>
        </div>
        
        <div className="flex p-1 bg-white rounded-2xl shadow-sm border border-slate-100">
           {['retention', 'care'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                  ? 'bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'text-slate-400 hover:text-primary hover:bg-slate-50'
                }`}
              >
                {tab === 'retention' ? t('operations.retentionAnalysis') : t('operations.care')}
              </button>
           ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-0">
        
        {/* Main Content Area (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-8 overflow-y-auto pr-2 custom-scrollbar">
           
           {/* Retention Dashboard */}
           {activeTab === 'retention' && (
             <>
               {/* Scorecards */}
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {retentionData.map((d, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_-8px_rgba(0,0,0,0.04)] border border-slate-100/60 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
                    >
                        <div className={`absolute top-0 right-0 p-4 opacity-10 font-black text-6xl select-none ${d.bg.split(' ')[1]}`}>{i+1}</div>
                        <div className={`w-12 h-12 rounded-2xl ${d.bg} flex items-center justify-center mb-4 text-xs font-black shadow-inner`}>
                           {i === 0 ? <Users size={20} /> : i === 1 ? <TrendingUp size={20} /> : i === 2 ? <AlertCircle size={20} /> : <Filter size={20} />}
                        </div>
                        <span className="text-4xl font-black tabular-nums tracking-tight text-slate-800">{d.count}</span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">{d.name}</p>
                    </motion.div>
                  ))}
               </div>

               {/* Chart Card */}
               <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_-8px_rgba(0,0,0,0.04)] border border-slate-100/60 flex-1 min-h-[450px] flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start mb-8 z-10">
                      <div>
                          <h3 className="text-xl font-black text-slate-800 tracking-tight">{t('operations.funnelAnalysis')}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t('operations.funnelSubtitle')}</p>
                      </div>
                      <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
                          <MoreHorizontal size={20} />
                      </button>
                  </div>
                  
                  {/* Subtle Grid Background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:40px_40px] -z-0" />

                  <div className="flex-1 w-full z-10">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={retentionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={60}>
                           <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 11, fontWeight: 800, fill: '#94a3b8' }} 
                              dy={15} 
                           />
                           <Tooltip 
                               cursor={{ fill: '#f8fafc', radius: 12 }}
                               contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '12px 20px' }}
                               itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                           />
                           <Bar dataKey="count" radius={[16, 16, 16, 16]}>
                              {retentionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} className="opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-pointer" />
                              ))}
                           </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>
             </>
           )}

           {/* Bulk Care Dashboard */}
           {activeTab === 'care' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="p-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[2.5rem] text-white shadow-[0_20px_50px_-12px_rgba(79,70,229,0.3)] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-20 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
                   
                   <div className="relative z-10 max-w-lg">
                      <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <MessageCircle size={20} className="text-indigo-100" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">{t('operations.bulkCareTitle')}</span>
                      </div>
                      <h3 className="text-3xl font-black mb-4 tracking-tight leading-tight">{t('operations.bulkCareDesc')}</h3>
                      
                      <div className="flex gap-4 mt-8">
                         <button onClick={() => handleBulkAction('recall')} className="px-8 py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all active:scale-95">{t('operations.sendRecall')}</button>
                         <button onClick={() => handleBulkAction('survey')} className="px-8 py-4 bg-indigo-800/40 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-indigo-800/60 transition-all">{t('operations.sendSurvey')}</button>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_-8px_rgba(0,0,0,0.04)] border border-slate-100/60">
                   <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                       <Target size={24} className="text-primary" />
                       {t('operations.targetGroups')}
                   </h3>
                   <div className="space-y-4">
                      {[
                        { title: t('operations.postOpRecall'), count: patients.filter(p => p.risk === 'High').length, icon: <ActivityIcon className="text-rose-500" />, bg: 'bg-rose-50 border-rose-100' },
                        { title: t('operations.cleaningDue'), count: Math.floor(patients.length * 0.4), icon: <Calendar className="text-emerald-500" />, bg: 'bg-emerald-50 border-emerald-100' },
                        { title: t('operations.inactive'), count: patients.filter(p => p.status === 'cancelled').length, icon: <Users className="text-slate-400" />, bg: 'bg-slate-50 border-slate-100' }
                      ].map((g, i) => (
                         <div key={i} className={`flex items-center justify-between p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer group`}>
                            <div className="flex items-center gap-6">
                               <div className={`w-14 h-14 rounded-2xl ${g.bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                                  {g.icon}
                               </div>
                               <div>
                                  <h4 className="font-bold text-slate-700 text-lg">{g.title}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{g.count} {t('operations.patientsSuffix')}</p>
                                  </div>
                               </div>
                            </div>
                            <button className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                <ChevronRightIcon className="" />
                            </button>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
           )}

        </div>

        {/* Right Sidebar (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
           
           {/* Birthday Engine */}
           <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_-8px_rgba(0,0,0,0.04)] border border-slate-100/60 flex flex-col h-full max-h-[600px]">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-14 h-14 rounded-[1.2rem] bg-rose-50 text-rose-500 flex items-center justify-center shadow-sm shadow-rose-100">
                    <Cake size={24} strokeWidth={2.5} />
                 </div>
                 <div>
                    <h3 className="font-black text-slate-800 text-lg leading-tight">{t('operations.birthdays')}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('operations.upcoming7days')}</p>
                 </div>
              </div>
              
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                 {birthdayPatients.map((p, i) => (
                    <motion.div 
                       key={i}
                       initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                       className="p-5 rounded-[1.5rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-lg hover:shadow-rose-500/5 hover:border-rose-100 transition-all group relative overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-rose-500/5 to-transparent rounded-bl-[2rem] -mr-4 -mt-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                       
                       <div className="flex justify-between items-start mb-4 relative z-10">
                          <div className="flex items-center gap-3">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-50" alt="" />
                             <div>
                                <h4 className="font-black text-sm text-slate-700">{p.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                   <Calendar size={10} className="text-rose-400" />
                                   <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">{p.date} • {p.age}yo</p>
                                </div>
                             </div>
                          </div>
                          <button onClick={() => handleSendWishes(p)} className="w-9 h-9 rounded-xl border border-rose-100 text-rose-300 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/20 flex items-center justify-center transition-all bg-white">
                             <Heart size={16} className={p.age % 2 === 0 ? "fill-current" : ""} />
                          </button>
                       </div>
                       
                       {/* Preview Card */}
                       <div className="bg-white p-4 rounded-xl border border-slate-100 text-[10px] font-medium text-slate-500 leading-relaxed italic relative z-10 shadow-sm">
                          <div className="absolute -top-2 left-4 w-3 h-3 bg-white border-t border-l border-slate-100 transform rotate-45" />
                          "{t('operations.birthdayMessage', { name: p.name })}"
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>

           {/* Growth Tip */}
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                          <TrendingUp size={20} className="text-emerald-400" />
                      </div>
                      <h3 className="font-black text-lg">{t('operations.growthTip')}</h3>
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed mb-6 border-l-2 border-indigo-500 pl-4" dangerouslySetInnerHTML={{ __html: t('operations.reactivateTip') }} />
                  <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10">{t('operations.startCampaign')}</button>
               </div>
               <TrendingUp size={120} className="absolute -bottom-8 -right-8 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
           </div>
        </div>

      </div>
    </div>
  );
};

// Sub-components for icons
const ActivityIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);
const ChevronRightIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);
