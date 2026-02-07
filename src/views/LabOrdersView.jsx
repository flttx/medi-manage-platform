import React, { useContext, useState } from 'react';
import { RegionContext } from '../contexts/RegionContext';
import dayjs from 'dayjs';
import { formatDate } from '../utils/format';
import { 
  Plus, 
  Search, 
  Filter, 
  Box, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreHorizontal,
  ArrowRight,
  Layers,
  PenTool,
  BoxSelect
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lab3DPreview } from '../components/Lab3DPreview';
import { useToast } from '../contexts/ToastContext';

export const LabOrdersView = () => {
  const { userRole, labOrders, setLabOrders, t, region } = useContext(RegionContext);
  const { showToast } = useToast();
  const [activeSegment, setActiveSegment] = useState('all');
  const [previewOrder, setPreviewOrder] = useState(null);

  const handleOrderDrop = (orderId, newStatus) => {
      setLabOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  // --- COMPONENT: CLINIC VIEW (The "Ordering" Experience) ---
  const ClinicView = () => (
    <div className="h-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('lab.title')}</h2>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-primary" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('lab.digitalOrderManagement')}</p>
            </div>
          </div>
          <button 
            onClick={() => showToast(t('lab.newOrder') + ' ' + t('common.success'), 'success')}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-[1.5rem] shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95 group"
          >
             <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" strokeWidth={3} />
             <span className="text-xs font-black uppercase tracking-widest">{t('lab.newOrder')}</span>
          </button>
       </div>

       {/* Order Status Filters */}
       <div className="flex items-center gap-4 border-b border-slate-100 pb-2">
          {['all', 'in_transit', 'in_production', 'completed'].map(status => (
            <button 
              key={status}
              onClick={() => setActiveSegment(status)}
              className={`relative pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all ${
                activeSegment === status 
                ? 'text-primary' 
                : 'text-slate-300 hover:text-slate-500'
              }`}
            >
              {status === 'all' ? t('common.all') : t(`lab.${status}`)}
              {activeSegment === status && (
                 <motion.div 
                   layoutId="activeTab" 
                   className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-primary rounded-full shadow-[0_-2px_8px_rgba(59,130,246,0.5)]" 
                 />
              )}
            </button>
          ))}
       </div>

       {/* Orders List */}
       <div className="grid gap-6">
          {labOrders.map((order, i) => (
            <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white p-8 rounded-[2.5rem] border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] hover:border-primary/20 transition-all group relative overflow-hidden"
            >
              {/* Subtle accent border */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-50 group-hover:bg-primary/40 transition-colors" />

              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                 
                 {/* Order Info */}
                 <div className="flex items-center gap-6 xl:w-72 shrink-0">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/10 transition-all duration-500 shrink-0 shadow-inner">
                       <Box size={28} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                       <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="font-black text-slate-800 text-xl tracking-tight truncate">{order.patientName}</span>
                          <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest shadow-sm">{order.id}</span>
                       </div>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide leading-relaxed truncate">
                          <span className="text-slate-600">{order.type}</span> • <span className="text-primary/60">{order.shade}</span> • <span className="text-slate-600">#{order.teeth.join(', ')}</span>
                       </p>
                    </div>
                 </div>

                 {/* Progress Tracker based on status */}
                 <div className="flex-1 max-w-3xl">
                    <div className="relative flex items-center justify-between w-full px-4">
                       {/* Progress Line Background */}
                       <div className="absolute top-1/2 left-0 w-full h-[6px] bg-slate-50 -translate-y-1/2 -z-10 rounded-full border border-slate-100/50"></div>
                       
                       {/* Active Progress Line with Glow */}
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: getProgressWidth(order.status) }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className="absolute top-1/2 left-0 h-[6px] bg-gradient-to-r from-primary to-indigo-500 -translate-y-1/2 z-0 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                       />

                       <StatusStep label={t('lab.sent')} active={true} icon={CheckCircle2} />
                       <StatusStep label={t('lab.received')} active={['received', 'designing', 'milling', 'qc', 'shipping', 'completed'].includes(order.status)} icon={Box} />
                       <StatusStep label={t('lab.production')} active={['designing', 'milling', 'qc', 'shipping', 'completed'].includes(order.status)} icon={PenTool} />
                       <StatusStep label={t('lab.shipped')} active={['shipping', 'completed'].includes(order.status)} icon={Truck} />
                    </div>
                 </div>

                 <div className="flex items-center justify-between xl:justify-end gap-6 pt-6 xl:pt-0 border-t xl:border-none border-slate-50">
                     <div className="text-left xl:text-right">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">{t('lab.estDelivery')}</p>
                        <div className="flex items-center gap-2">
                           <Clock size={14} className="text-primary/40" />
                           <p className="text-sm font-black text-slate-700 tabular-nums tracking-tight">{formatDate(dayjs().add(2, 'day'), region === 'cn' ? 'cn' : 'us')}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        {['designing', 'milling', 'received'].includes(order.status) && (
                           <button 
                              onClick={() => setPreviewOrder(order)}
                              className="h-12 px-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-3 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all group/btn active:scale-95"
                           >
                               <BoxSelect size={18} className="group-hover/btn:rotate-12 transition-transform" />
                               <span className="text-[10px] font-black uppercase tracking-[0.15em]">{t('lab.review3d')}</span>
                           </button>
                        )}
                        <button className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 hover:text-primary hover:bg-white hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group/arrow active:scale-95">
                           <ArrowRight size={20} className="group-hover/arrow:translate-x-1 transition-transform" />
                        </button>
                     </div>
                  </div>
              </div>
            </motion.div>
          ))}
       </div>
    </div>
  );

  // --- COMPONENT: LAB VIEW (The "Production" Experience) ---
  const LabView = () => {
      const columns = [
          { id: 'received', title: t('lab.column.received'), color: 'bg-blue-500' },
          { id: 'designing', title: t('lab.column.designing'), color: 'bg-indigo-500' },
          { id: 'milling', title: t('lab.column.milling'), color: 'bg-rose-500' },
          { id: 'qc', title: t('lab.column.qc'), color: 'bg-amber-500' },
          { id: 'shipping', title: t('lab.column.shipping'), color: 'bg-emerald-500' }
      ];

      return (
        <div className="h-full flex flex-col gap-8 animate-in fade-in slide-in-from-right-6 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Layers size={32} className="text-primary/20" />
                        {t('lab.kanbanTitle')}
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('lab.technicianDashboard')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => showToast(t('lab.newOrder') + ' ' + t('common.success'), 'success')}
                        className="flex items-center gap-3 px-6 py-2.5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95 group"
                    >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" strokeWidth={3} />
                        <span className="ml-1">{t('lab.newOrder')}</span>
                    </button>
                    <div className="px-6 py-3 bg-white rounded-2xl flex items-center gap-3 border border-slate-100 shadow-sm">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{t('lab.systemOnline')}</span>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto pb-6 scrollbar-hide">
                <div className="flex gap-8 h-full px-2">
                    {columns.map(col => (
                        <KanbanColumn 
                            key={col.id} 
                            status={col.id}
                            title={col.title} 
                            count={labOrders.filter(o => o.status === col.id).length} 
                            color={col.color}
                            onDrop={handleOrderDrop}
                        >
                            {labOrders.filter(o => o.status === col.id).map((order, i) => (
                                <KanbanCard key={i} order={order} onPreview={() => setPreviewOrder(order)} />
                            ))}
                        </KanbanColumn>
                    ))}
                </div>
            </div>
        </div>
      );
  };

  return (
    <>
        {userRole === 'lab' ? <LabView /> : <ClinicView />}
        <AnimatePresence>
            {previewOrder && (
                <Lab3DPreview 
                    order={previewOrder} 
                    onClose={() => setPreviewOrder(null)}
                    onApprove={() => {
                        setLabOrders(prev => prev.map(o => o.id === previewOrder.id ? { ...o, status: 'milling' } : o));
                        setPreviewOrder(null);
                    }}
                    onRequestChanges={() => setPreviewOrder(null)}
                    t={t}
                />
            )}
        </AnimatePresence>
    </>
  );
};

// --- SUBCOMPONENTS ---

const StatusStep = ({ label, active, icon: Icon }) => (
    <div className="flex flex-col items-center gap-3 z-10">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-[3px] transition-all duration-700 ${
            active 
            ? 'bg-white border-primary text-primary shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-110' 
            : 'bg-white border-slate-100 text-slate-200 shadow-sm'
        }`}>
            <Icon size={16} strokeWidth={active ? 3 : 2} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-500 whitespace-nowrap ${
            active 
            ? 'text-slate-800' 
            : 'text-slate-300'
        }`}>{label}</span>
    </div>
);

const KanbanColumn = ({ status, title, count, color, children, onDrop }) => {
    const { t } = useContext(RegionContext);
    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-slate-50', 'dark:bg-slate-800/50');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('bg-slate-50', 'dark:bg-slate-800/50');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-slate-50', 'dark:bg-slate-800/50');
        const orderId = e.dataTransfer.getData('orderId');
        if (orderId && onDrop) {
            onDrop(orderId, status);
        }
    };

    return (
        <div 
            className="w-80 flex flex-col gap-4 rounded-3xl transition-colors p-2"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className={`p-5 rounded-3xl ${color} bg-opacity-5 flex items-center justify-between border-b-2 ${color.replace('bg-', 'border-')}/10`}>
                <h3 className={`font-black uppercase tracking-[0.2em] text-[10px] ${color.replace('bg-', 'text-')}`}>{title}</h3>
                <span className={`px-2.5 py-1 rounded-xl bg-white text-[10px] font-black shadow-sm border border-slate-100 ${color.replace('bg-', 'text-')}`}>{count}</span>
            </div>
            <div className="flex-1 flex flex-col gap-3 min-h-[100px]">
                {count === 0 && (
                     <div className="h-24 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800/50 flex items-center justify-center opacity-50">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{t('lab.dropHere')}</span>
                     </div>
                )}
                {children}
            </div>
        </div>
    );
};

const KanbanCard = ({ order, onPreview }) => {
    const { t } = useContext(RegionContext);
    const handleDragStart = (e) => {
        e.dataTransfer.setData('orderId', order.id);
        e.dataTransfer.effectAllowed = 'move';
        // Add a ghost opacity maybe?
    };

    return (
        <div 
            draggable="true"
            onDragStart={handleDragStart}
            className="p-5 bg-white rounded-3xl border border-slate-100/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08)] hover:border-primary/20 hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing group active:scale-95"
        >
            <div className="flex justify-between items-start mb-4">
                <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest">{order.id}</span>
                {order.priority === 'rush' && (
                   <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-[8px] font-black text-rose-500 uppercase tracking-tighter">{t('lab.urgentLabel')}</span>
                   </div>
                )}
            </div>
            <h4 className="font-black text-slate-800 mb-1 tracking-tight">{order.patientName}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-4 truncate">{order.type} • #{order.teeth.join(',')}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
               <div className="flex-1">
                 {order.status === 'designing' && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onPreview(); }}
                        className="w-full mb-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                        {t('lab.startDesign') || 'CAD 设计'}
                    </button>
                 )}
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-primary/5 text-primary flex items-center justify-center text-[10px] font-black border border-primary/10">
                            {order.doctorName.charAt(0)}
                        </div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight">{order.doctorName}</span>
                    </div>
                    <span className="text-[9px] font-black text-slate-300 tabular-nums">{order.date}</span>
                 </div>
               </div>
            </div>
        </div>
    );
};

// Helper for progress width
const getProgressWidth = (status) => {
    switch(status) {
        case 'received': return '25%';
        case 'designing': return '50%';
        case 'milling': return '75%';
        case 'qc': return '85%';
        case 'shipping': return '100%';
        case 'completed': return '100%';
        default: return '5%';
    }
};
