import React, { useContext } from 'react';
import { Plus, Edit } from 'lucide-react';
import { RegionContext } from '../../contexts/RegionContext';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/format';

export const TreatmentPlansTab = ({ compareMode, setCompareMode, selectedPlans, setSelectedPlans }) => {
  const { t, selectedPatient, treatmentPlans, setGlobalModal, region } = useContext(RegionContext);
  const { showToast } = useToast();
  
  const patientPlans = treatmentPlans.filter(p => p.patientId === selectedPatient?.id);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{t('treatmentPlan.overview')}</h3>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              if (compareMode) {
                if (selectedPlans.length < 2) {
                  showToast(t('treatmentPlan.selectTwoPlans'), 'info');
                } else {
                  setGlobalModal({ type: 'compare', data: selectedPlans });
                }
              }
              setCompareMode(!compareMode);
              setSelectedPlans([]);
            }} 
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${compareMode ? 'bg-primary text-white border-primary' : 'bg-white text-slate-400 border-slate-100 hover:text-primary hover:border-primary/30'}`}
          >
            {compareMode ? t('treatmentPlan.confirmCompare') : t('common.compare')}
          </button>
          <button onClick={() => setGlobalModal({ type: 'treatmentPlan' })} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/30 border-none"><Plus size={18} /> {t('treatmentPlan.new')}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {patientPlans.map((plan, i) => (
          <div 
            key={plan.id} 
            onClick={() => {
              if (compareMode) {
                setSelectedPlans(prev => prev.find(p => p.id === plan.id) ? prev.filter(p => p.id !== plan.id) : [...prev, plan]);
              }
            }}
            className={`bg-white rounded-[2.5rem] border shadow-xl shadow-slate-200/20 overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500 cursor-pointer ${compareMode && selectedPlans.find(p => p.id === plan.id) ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-slate-100'}`}
          >
            <div className="p-8 pb-6 border-b border-slate-50 flex items-start justify-between bg-slate-50/30 group-hover:bg-white transition-colors">
              <div className="flex gap-6">
                <div className={`w-16 h-16 rounded-2xl bg-white border shadow-sm flex items-center justify-center font-black text-xl transition-all ${compareMode && selectedPlans.find(p => p.id === plan.id) ? 'bg-primary text-white' : 'border-slate-100 text-primary'}`}>
                  {compareMode && selectedPlans.find(p => p.id === plan.id) ? '✓' : `0${i+1}`}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 mb-1.5 truncate max-w-[400px]">{plan.title || plan.titleEn}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400">ID: {plan.id}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-black text-slate-400">{plan.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 text-right">
                <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${plan.status === 'active' ? 'bg-primary text-white' : 'bg-amber-100 text-amber-600'}`}>
                  {t(`treatmentPlan.${plan.status}`)}
                </div>
                <div className="text-lg font-black text-slate-800">{formatCurrency(plan.totalCost, region === 'cn' ? 'cn' : 'us')}</div>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-4">
                {plan.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50 group/item hover:bg-white hover:border-primary/20 transition-all">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${item.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                      {item.status === 'completed' ? '✓' : item.phase}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className={`text-[13px] font-black ${item.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {item.title || item.titleEn}
                        </h4>
                        {item.teeth.map(t => {
                          const toothId = typeof t === 'object' ? t.id : t;
                          return (
                            <span key={toothId} className="px-1.5 py-0.5 bg-primary/5 text-primary text-[8px] font-black rounded">#{toothId}</span>
                          );
                        })}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t(`status.${item.status}`)}</p>
                    </div>
                    <div className="text-[13px] font-black text-slate-700">{formatCurrency(item.cost, region === 'cn' ? 'cn' : 'us')}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 border-t border-slate-50 flex justify-between items-center bg-slate-50/10">
              <div className="flex gap-2">
                {plan.status === 'confirmed' ? (
                  <span className="px-4 py-2 bg-emerald-500 text-white text-[9px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-emerald-100">{t('status.confirmed')}</span>
                ) : (
                  <button onClick={() => showToast(t('treatmentPlan.selectAsOptimal'), 'success')} className="px-4 py-2 bg-primary/10 text-primary text-[9px] font-black rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white transition-all">{t('treatmentPlan.selectAsOptimal')}</button>
                )}
                <button onClick={() => showToast(t('common.generatingPreview'), 'info')} className="px-4 py-2 bg-white text-slate-400 border border-slate-100 text-[9px] font-black rounded-xl uppercase tracking-widest hover:text-primary transition-all">{t('treatmentPlan.printPDF')}</button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setGlobalModal({ type: 'billing', data: { desc: `Payment for Plan: ${plan.title || plan.titleEn}`, amount: plan.totalCost, category: 'Treatment' } }); }}
                  className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black rounded-xl uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                >
                  {t('billing.createInvoice')}
                </button>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setGlobalModal({ type: 'treatmentPlan', data: plan }); }}
                className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-all"
              >
                <Edit size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
