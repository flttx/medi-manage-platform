import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  ChevronRight, 
  Plus,
  Box,
  Truck,
  Layers,
  Factory,
  Package,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { RegionContext } from '../contexts/RegionContext';
import { formatCurrency } from '../utils/format';

export const DashboardView = () => {
  const { userRole, region, t, setActiveView, viewPatient, appointments, setGlobalModal, recentPatients, labOrders } = useContext(RegionContext);
  const navigate = useNavigate();
  
  const data = [
    { name: 'Mon', value: 40 },
    { name: 'Tue', value: 65 },
    { name: 'Wed', value: 50 },
    { name: 'Thu', value: 80 },
    { name: 'Fri', value: 55 },
    { name: 'Sat', value: 90 },
    { name: 'Sun', value: 70 },
  ];
  
  const clinicMetrics = [
    { id: 'appts', label: t('dashboard.metrics.tomorrowAppts'), value: "18", icon: <Clock size={14} />, color: "text-indigo-600", bg: "bg-indigo-50", target: 'appointmentManage', sub: t('dashboard.orthoImplant', { ortho: 3, implant: 2 }) },
    { id: 'arrears', label: t('dashboard.metrics.pendingArrears'), value: formatCurrency(12400, region === 'cn' ? 'cn' : 'us'), icon: <TrendingUp size={14} />, color: "text-rose-600", bg: "bg-rose-50", target: 'financeManage', sub: t('dashboard.arrearsCount', { count: 5 }) },
    { id: 'recalls', label: t('dashboard.metrics.pendingRecalls'), value: "09", icon: <Package size={14} />, color: "text-amber-600", bg: "bg-amber-50", target: 'clinicalManage', sub: t('dashboard.recallCount', { count: 3 }) },
    { id: 'revenue', label: t('dashboard.metrics.todayActual'), value: formatCurrency(8960, region === 'cn' ? 'cn' : 'us'), icon: <TrendingUp size={14} />, color: "text-emerald-600", bg: "bg-emerald-50", target: 'financeManage', sub: t('dashboard.vsYesterday', { percent: '+12%' }) },
  ];

  const labMetrics = [
    { id: 'pending', label: t('lab.pendingReceive'), value: labOrders.filter(o => o.status === 'received').length.toString(), icon: <Box size={14} />, color: "text-indigo-600", bg: "bg-indigo-50", target: 'labManage', sub: t('lab.awaitingIntake') },
    { id: 'production', label: t('lab.inProduction'), value: labOrders.filter(o => ['designing', 'milling'].includes(o.status)).length.toString(), icon: <Factory size={14} />, color: "text-amber-600", bg: "bg-amber-50", target: 'labManage', sub: t('lab.activeWorkstations') },
    { id: 'urgent', label: t('lab.urgent'), value: labOrders.filter(o => o.priority === 'high' || o.priority === 'rush').length.toString(), icon: <AlertTriangle size={14} />, color: "text-rose-600", bg: "bg-rose-50", target: 'labManage', sub: t('lab.dueSoon') },
    { id: 'inventory', label: t('lab.stockLevel'), value: "04", icon: <Layers size={14} />, color: "text-emerald-600", bg: "bg-emerald-50", target: 'inventoryManage', sub: t('lab.lowStock') },
  ];

  const metrics = userRole === 'lab' ? labMetrics : clinicMetrics;

  const handleApptClick = (app) => {
    const patientObj = { name: app.patient, id: app.id || 'P-New', age: 30, gender: 'female' };
    viewPatient(patientObj);
    navigate(`/patients/detail/${patientObj.id}`);
  };

  const handleNewPatientClick = () => {
    setActiveView('patientManage');
    navigate('/patients');
    setGlobalModal({ type: 'patient' });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 w-full pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-primary/20">
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-black mb-2 tracking-tighter">
                    {userRole === 'lab' ? t('dashboard.lab.hello') : t('dashboard.hello', { name: 'Sterling' })}
                </h1>
                <p className="text-cyan-100/80 font-bold text-sm tracking-wide uppercase">
                    {userRole === 'lab' 
                        ? t('dashboard.lab.ordersActive', { count: labOrders.length })
                        : t('dashboard.welcome.apptCount', { count: appointments.length })
                    }
                </p>
                
                <div className="flex gap-4 mt-8">
                  {userRole === 'lab' ? (
                    <>
                      <button className="px-8 py-3 bg-white text-primary rounded-2xl font-black text-xs hover:bg-slate-50 transition-all shadow-xl active:scale-95" onClick={() => navigate('/lab')}>
                        {t('lab.manageOrders')}
                      </button>
                      <button className="px-8 py-3 bg-white/10 text-white rounded-2xl font-black text-xs hover:bg-white/20 transition-all backdrop-blur-md active:scale-95 border border-white/5" onClick={() => navigate('/patients')}>
                        {t('modules.patientManage')}
                      </button>
                      <button className="px-8 py-3 bg-white/10 text-white rounded-2xl font-black text-xs hover:bg-white/20 transition-all backdrop-blur-md active:scale-95 border border-white/5" onClick={() => navigate('/inventory')}>
                        {t('modules.inventoryManage')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="px-8 py-3 bg-primary text-white rounded-2xl font-black text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95" onClick={handleNewPatientClick}>
                        + {t('patient.new')}
                      </button>
                      <button className="px-8 py-3 bg-white/10 text-white rounded-2xl font-black text-xs hover:bg-white/20 transition-all backdrop-blur-md active:scale-95 border border-white/5" onClick={() => setActiveView('appointmentManage')}>
                        {t('modules.appointmentManage')}
                      </button>
                    </>
                  )}
                </div>

                {recentPatients.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-3">{t('clinical.recentVisits')}</p>
                    <div className="flex gap-3">
                      {recentPatients.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => { viewPatient(p); navigate(`/patients/detail/${p.id}`); }}
                          className="flex items-center gap-2 pl-1 pr-4 py-1 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5 group"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-[9px] font-black text-white shadow-sm">
                            {p.name.charAt(0)}
                          </div>
                          <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
              <div className="hidden md:flex w-32 h-32 rounded-3xl bg-primary/20 backdrop-blur-3xl border border-white/10 flex-col items-center justify-center p-4">
                 <span className="text-4xl font-black text-primary mb-1">24</span>
                 <span className="text-[10px] font-black opacity-60 uppercase">{t('dashboard.welcome.efficiency')}</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m, i) => (
              <div key={i} onClick={() => { 
                const map = {
                  'patientManage': '/patients',
                  'appointmentManage': '/appointments',
                  'financeManage': '/finance',
                  'clinicalManage': '/clinical',
                  'labManage': '/lab',
                  'inventoryManage': '/inventory',
                  'dashboard': '/'
                };
                navigate(map[m.target] || '/');
              }} className="card p-6 border border-slate-50 shadow-sm bg-white hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-slate-200/50 transition-all cursor-pointer group rounded-[2rem]">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                  <div className={`w-8 h-8 rounded-xl ${m.bg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                    {m.icon || <ChevronRight size={14} className={m.color} />}
                  </div>
                </div>
                <div className="space-y-1">
                   <span className={`text-2xl font-black ${m.color} tabular-nums tracking-tighter shrink-0`}>{m.value}</span>
                   <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tight truncate">{m.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-10 border-none shadow-xl shadow-slate-200/50 bg-white min-h-[460px] rounded-[2.5rem]">
             <div className="flex items-center justify-between mb-12">
                <div>
                   <h3 className="text-xl font-black text-slate-800 tracking-tight">
                     {userRole === 'lab' ? t('dashboard.lab.productionTrend') : t('clinical.patientGrowth')}
                   </h3>
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-2">
                     {userRole === 'lab' ? t('dashboard.lab.orderVolume') : t('dashboard.monthlyTrend')}
                   </p>
                </div>
               <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                  {['Day', 'Week', 'Month'].map(p => (
                    <button key={p} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${p === 'Week' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{t(`appointment.views.${p.toLowerCase()}`)}</button>
                  ))}
               </div>
            </div>
            <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 900 }} 
                      dy={10}
                   />
                   <YAxis hide />
                   <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                   />
                   <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#6366f1" 
                      strokeWidth={4}
                      dot={{ r: 0 }}
                      activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                      isAnimationActive={false}
                   />
                 </LineChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
          <div className="card p-10 border-none shadow-2xl shadow-slate-200/50 flex flex-col flex-1 bg-white relative overflow-hidden rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-10 z-10">
               <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">
                    {userRole === 'lab' ? t('dashboard.lab.urgentOrders') : t('dashboard.focus.title')}
                  </h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded mt-2 inline-block">
                    {t('dashboard.liveStatus')}
                  </p>
               </div>
               <button className="text-[10px] font-black text-slate-300 hover:text-primary transition-all uppercase tracking-widest" onClick={() => navigate(userRole === 'lab' ? '/lab' : '/appointments')}>
                 {userRole === 'lab' ? t('lab.viewAll') : t('dashboard.focus.fullSchedule')}
               </button>
            </div>
            
            <div className="space-y-4 flex-1 z-10">
               {userRole === 'lab' ? (
                 labOrders.slice(0, 4).map((order, i) => (
                   <div 
                     key={i} 
                     onClick={() => navigate('/lab')}
                     className="flex items-center gap-5 p-6 rounded-[2rem] bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/60 transition-all group cursor-pointer border border-transparent hover:border-slate-100"
                   >
                      <div className="w-16 text-center shrink-0 border-r border-slate-200/50 pr-4">
                         <span className="text-sm font-black text-slate-800 block mb-0.5 tracking-tighter">#{order.teeth[0]}</span>
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Tooth</span>
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-sm font-black text-slate-800 truncate group-hover:text-primary transition-colors">{order.patientName}</h4>
                         <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{order.type}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                          <div className={`w-2.5 h-2.5 rounded-full ${order.priority === 'rush' ? 'bg-rose-500 shadow-[0_0_8px_var(--rose-500)]' : 'bg-amber-500 shadow-[0_0_8px_var(--amber-500)]'} transition-all group-hover:scale-125`} />
                          <span className="text-[8px] font-black text-slate-300 uppercase">{order.status}</span>
                      </div>
                   </div>
                 ))
               ) : (
                 appointments.map((app, i) => (
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
                 ))
               )}
               
               {userRole !== 'lab' && (
                 <div 
                   onClick={() => setGlobalModal({ type: 'appointment' })}
                   className="flex flex-col items-center justify-center p-12 bg-slate-50/30 rounded-[2.5rem] border-2 border-dashed border-slate-200 mt-6 group cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
                 >
                    <div className="w-14 h-14 bg-white rounded-[1.25rem] shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-100">
                       <Plus size={24} className="text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-xs font-black text-slate-400 group-hover:text-primary transition-colors">{t('dashboard.focus.addAppt')}</p>
                    <p className="text-[10px] font-bold text-slate-300 mt-2">{t('dashboard.availableSlots')}</p>
                 </div>
               )}
            </div>

            <div className="absolute top-1/2 right-0 w-40 h-80 bg-slate-50 rounded-l-full -z-0 opacity-40 translate-x-20" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
