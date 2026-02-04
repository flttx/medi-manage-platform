import React, { useContext } from 'react';
import { 
  TrendingUp, 
  ChevronRight, 
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RegionContext } from '../contexts/RegionContext';

export const DashboardView = () => {
  const { region, t, setActiveView, setSelectedPatient, appointments, setGlobalModal } = useContext(RegionContext);
  
  const metrics = [
    { label: region === 'cn' ? '明日预约' : 'Tomorrow', value: "18", color: "text-blue-500", bg: "bg-blue-50", target: 'appointmentManage' },
    { label: region === 'cn' ? '待跟进' : 'Follow-up', value: "07", color: "text-amber-500", bg: "bg-amber-50", target: 'clinicalManage' },
    { label: region === 'cn' ? '新入组' : 'New Intake', value: "12", color: "text-emerald-500", bg: "bg-emerald-50", target: 'patientManage' },
    { label: region === 'cn' ? '异常提醒' : 'Alerts', value: "02", color: "text-rose-500", bg: "bg-rose-50", target: 'dashboard' },
  ];

  const handleApptClick = (app) => {
    setSelectedPatient({ name: app.patient, id: app.id, age: 30, gender: 'female', phone: '138****8888' });
    setActiveView('patientDetail');
  };

  const handleNewPatientClick = () => {
    setActiveView('patientManage');
    setGlobalModal({ type: 'patient' });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 w-full pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white shadow-2xl">
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-black mb-2 tracking-tighter">Hello, Dr. Sterling</h1>
                <p className="text-slate-400 font-bold text-sm tracking-wide uppercase">{region === 'cn' ? `目前共有 ${appointments.length} 名预约患者待处理` : `${appointments.length} APPOINTMENTS SCHEDULED TODAY`}</p>
                <div className="flex gap-4 mt-8">
                  <button className="px-8 py-3 bg-primary text-white rounded-2xl font-black text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95" onClick={handleNewPatientClick}>
                    + {t.newPatient}
                  </button>
                  <button className="px-8 py-3 bg-white/10 text-white rounded-2xl font-black text-xs hover:bg-white/20 transition-all backdrop-blur-md active:scale-95 border border-white/5" onClick={() => setActiveView('appointmentManage')}>
                    {t.appointments}
                  </button>
                </div>
              </div>
              <div className="hidden md:flex w-32 h-32 rounded-3xl bg-primary/20 backdrop-blur-3xl border border-white/10 flex-col items-center justify-center p-4">
                 <span className="text-4xl font-black text-primary mb-1">24</span>
                 <span className="text-[10px] font-black opacity-60 uppercase">{region === 'cn' ? '就诊效率' : 'Efficiency'}</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m, i) => (
              <div key={i} onClick={() => setActiveView(m.target)} className="card p-6 border-none shadow-xl shadow-slate-200/50 bg-white hover:translate-y-[-4px] transition-all cursor-pointer group rounded-[2rem]">
                <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">{m.label}</p>
                <div className="flex items-end justify-between">
                   <span className={`text-3xl font-black ${m.color}`}>{m.value}</span>
                   <div className={`w-10 h-10 rounded-2xl ${m.bg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                      <ChevronRight size={16} className={m.color} />
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-10 border-none shadow-xl shadow-slate-200/50 bg-white min-h-[460px] rounded-[2.5rem]">
             <div className="flex items-center justify-between mb-12">
               <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">{t.patientGrowth}</h3>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-2">Monthly Analytics Trend</p>
               </div>
               <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                  {['Day', 'Week', 'Month'].map(p => (
                    <button key={p} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${p === 'Week' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{p}</button>
                  ))}
               </div>
            </div>
            <div className="h-72 flex items-end gap-4 px-2 relative">
               {[40, 65, 50, 80, 55, 90, 70, 85].map((h, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.05, type: 'spring', damping: 20 }}
                      className="w-full bg-slate-50/50 rounded-2xl group-hover:bg-primary transition-all relative overflow-hidden ring-1 ring-slate-100 group-hover:ring-primary/20"
                    >
                       <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                       {h > 70 && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary/40 animate-ping" />}
                    </motion.div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Mon {i+1}</span>
                 </div>
               ))}
               <svg className="absolute bottom-0 left-0 w-full h-full pointer-events-none px-12 overflow-visible" preserveAspectRatio="none">
                  <motion.path 
                     initial={{ pathLength: 0 }}
                     animate={{ pathLength: 1 }}
                     d="M 0 180 Q 150 100, 300 140 T 600 60 T 900 120"
                     fill="none" stroke="rgba(79, 70, 229, 0.1)" strokeWidth="6" strokeLinecap="round"
                  />
               </svg>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
          <div className="card p-10 border-none shadow-2xl shadow-slate-200/50 flex flex-col flex-1 bg-white relative overflow-hidden rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-10 z-10">
               <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">{region === 'cn' ? '今日就诊' : 'Today Focus'}</h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded mt-2 inline-block">Live status</p>
               </div>
               <button className="text-[10px] font-black text-slate-300 hover:text-primary transition-all uppercase tracking-widest" onClick={() => setActiveView('appointmentManage')}>{region === 'cn' ? '查看大项' : 'Full Schedule'}</button>
            </div>
            
            <div className="space-y-4 flex-1 z-10">
               {appointments.map((app, i) => (
                 <div 
                   key={i} 
                   onClick={() => handleApptClick(app)}
                   className="flex items-center gap-5 p-6 rounded-[2rem] bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/60 transition-all group cursor-pointer border border-transparent hover:border-slate-100"
                 >
                    <div className="w-16 text-center shrink-0 border-r border-slate-200/50 pr-4">
                       <span className="text-sm font-black text-slate-800 block mb-0.5 tracking-tighter">{app.time}</span>
                       <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Apt</span>
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-sm font-black text-slate-800 truncate group-hover:text-primary transition-colors">{app.patient}</h4>
                       <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{app.type}</p>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${app.status === 'confirmed' ? 'bg-emerald-500 shadow-[0_0_8px_var(--emerald-500)]' : 'bg-amber-500 shadow-[0_0_8px_var(--amber-500)]'} transition-all group-hover:scale-125`} />
                 </div>
               ))}
               
               <div 
                 onClick={() => setGlobalModal({ type: 'appointment' })}
                 className="flex flex-col items-center justify-center p-12 bg-slate-50/30 rounded-[2.5rem] border-2 border-dashed border-slate-200 mt-6 group cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
               >
                  <div className="w-14 h-14 bg-white rounded-[1.25rem] shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-100">
                     <Plus size={24} className="text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs font-black text-slate-400 group-hover:text-primary transition-colors">{region === 'cn' ? '添加预约' : 'Add Appointment'}</p>
                  <p className="text-[10px] font-bold text-slate-300 mt-2">Available slots from 16:00</p>
               </div>
            </div>

            <div className="absolute top-1/2 right-0 w-40 h-80 bg-slate-50 rounded-l-full -z-0 opacity-40 translate-x-20" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
