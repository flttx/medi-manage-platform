import React, { useContext, useState } from 'react';
import { 
  Plus, 
  Box, 
  Truck, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter,
  ArrowRight,
  BoxSelect,
  PenTool,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegionContext } from '../../contexts/RegionContext';
import { useToast } from '../../contexts/ToastContext';
import { Lab3DPreview } from '../../components/Lab3DPreview';
import { formatDate } from '../../utils/format';
import dayjs from 'dayjs';

export const LabTab = () => {
  const { region, t, selectedPatient, labOrders, setLabOrders } = useContext(RegionContext);
  const { showToast } = useToast();
  const [previewOrder, setPreviewOrder] = useState(null);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    type: 'Zirconia Crown',
    teeth: [36],
    shade: 'A2',
    priority: 'normal'
  });

  // Filter orders for the specific patient
  const patientOrders = labOrders.filter(order => 
    order.patientName === selectedPatient.name || order.patientId === selectedPatient.id
  );

  const handleCreateOrder = () => {
    const newOrder = {
        id: `LAB-2026-${String(labOrders.length + 1).padStart(3, '0')}`,
        patientName: selectedPatient.name,
        patientId: selectedPatient.id,
        doctorName: t('common.doctorName') || '史医生',
        age: selectedPatient.age,
        ...newOrderData,
        status: 'received',
        date: dayjs().format('YYYY.MM.DD'),
    };
    setLabOrders([newOrder, ...labOrders]);
    setShowNewOrderForm(false);
    showToast(t('common.created'), 'success');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'received': return <Box size={18} className="text-blue-500" />;
      case 'designing': return <PenTool size={18} className="text-indigo-500" />;
      case 'milling': return <BoxSelect size={18} className="text-rose-500" />;
      case 'qc': return <CheckCircle2 size={18} className="text-amber-500" />;
      case 'shipping': return <Truck size={18} className="text-emerald-500" />;
      case 'completed': return <CheckCircle2 size={18} className="text-emerald-600" />;
      default: return <Clock size={18} className="text-slate-400" />;
    }
  };

  const getStatusLabel = (status) => {
    return t(`lab.${status}`) || status;
  };

  const currentStep = (status) => {
    const steps = ['received', 'designing', 'milling', 'qc', 'shipping', 'completed'];
    return steps.indexOf(status);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">{t('lab.title')}</h3>
          <p className="text-sm font-black text-slate-800">{t('lab.trackingTip') || '跟踪数字化修复体加工进度'}</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder={t('common.search')} 
                    className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100/50 rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none w-48 transition-all"
                />
            </div>
            <button 
                onClick={() => setShowNewOrderForm(!showNewOrderForm)}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/30 border-none active:scale-95"
            >
                <Plus size={16} strokeWidth={3} className={`transition-transform duration-500 ${showNewOrderForm ? 'rotate-45' : ''}`} /> {showNewOrderForm ? t('common.cancel') : t('lab.newOrder')}
            </button>
        </div>
      </div>

      <AnimatePresence>
        {showNewOrderForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('common.type')}</label>
                        <select 
                            value={newOrderData.type}
                            onChange={(e) => setNewOrderData({...newOrderData, type: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none ring-primary/20 focus:ring-2 transition-all appearance-none"
                        >
                            {['Zirconia Crown', 'Implant Abutment', 'Veneer', 'Inlay'].map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('toothChart.tooth')}</label>
                        <input 
                            type="text"
                            value={newOrderData.teeth.join(', ')}
                            onChange={(e) => setNewOrderData({...newOrderData, teeth: e.target.value.split(',').map(s => parseInt(s.trim()))})}
                            placeholder="e.g. 36, 37"
                            className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none ring-primary/20 focus:ring-2 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('lab.shade')}</label>
                        <input 
                            type="text"
                            value={newOrderData.shade}
                            onChange={(e) => setNewOrderData({...newOrderData, shade: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none ring-primary/20 focus:ring-2 transition-all"
                        />
                    </div>
                    <div className="space-y-2 flex flex-col justify-end">
                       <button 
                            onClick={handleCreateOrder}
                            className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                       >
                           {t('common.confirm')}
                       </button>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {patientOrders.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-20 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200 mb-8 border border-slate-100 relative group">
                <Box size={40} className="group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-primary/5 rounded-[2rem] scale-0 group-hover:scale-100 transition-transform duration-500" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-3">{t('lab.noOrders') || '暂无加工单'}</h3>
            <p className="text-sm font-bold text-slate-400 max-w-[320px] leading-relaxed mb-10">该患者目前没有正在进行的加工件。您可以点击上方按钮为患者创建新的数字化加工申请。</p>
            <button 
                onClick={() => showToast(t('lab.browsingLabs'), 'info')}
                className="px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:border-primary/30 transition-all"
            >
                {t('lab.browsePartners') || '浏览合作技工所'}
            </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {patientOrders.map((order, i) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 group hover:border-primary/20 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-slate-50 group-hover:bg-primary/20 transition-colors" />
              
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="flex items-center gap-6 xl:w-80 shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 border border-slate-100">
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className="font-black text-slate-800 text-lg tracking-tight uppercase">{order.type}</span>
                       <span className="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-400 text-[8px] font-black border border-slate-100">{order.id}</span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                       <span className="text-primary/60">{order.shade}</span> • <span className="text-slate-500">#{order.teeth.join(', ')}</span> 
                       {order.priority === 'rush' && <span className="ml-2 text-rose-500">• {t('lab.rush')}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex-1 max-w-2xl px-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-[10px] font-black text-primary uppercase tracking-widest">{getStatusLabel(order.status)}</span>
                       <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{t('lab.productionProgress')}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentStep(order.status) + 1) / 6) * 100}%` }}
                          className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full shadow-lg shadow-primary/20"
                       />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between xl:justify-end gap-8 pt-6 xl:pt-0 border-t xl:border-none border-slate-50">
                  <div className="text-left xl:text-right">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{t('lab.estimatedDate')}</p>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-primary/40" />
                      <span className="text-sm font-black text-slate-700">{formatDate(dayjs().add(2, 'day'), region === 'cn' ? 'cn' : 'us')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {['designing', 'milling', 'received'].includes(order.status) && (
                      <button 
                        onClick={() => setPreviewOrder(order)}
                        className="h-12 px-6 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all active:scale-95 group/btn"
                      >
                        <BoxSelect size={16} className="group-hover/btn:rotate-12 transition-transform" />
                        {t('lab.review3d')}
                      </button>
                    )}
                    <button className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 hover:text-primary hover:bg-white hover:border-primary/40 transition-all active:scale-95">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {previewOrder && (
          <Lab3DPreview 
            order={previewOrder} 
            onClose={() => setPreviewOrder(null)}
            onApprove={() => {
              setLabOrders(prev => prev.map(o => o.id === previewOrder.id ? { ...o, status: 'milling' } : o));
              setPreviewOrder(null);
              showToast(t('lab.designApproved'), 'success');
            }}
            onRequestChanges={() => {
              setPreviewOrder(null);
              showToast(t('lab.changesRequested'), 'info');
            }}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
