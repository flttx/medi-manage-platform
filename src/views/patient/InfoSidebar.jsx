import React, { useContext } from 'react';
import { 
  PanelRightClose, PanelRightOpen, Plus, Activity, 
  ChevronRight, Phone, Mail, MapPin, Box, BoxSelect 
} from 'lucide-react';
import { RegionContext } from '../../contexts/RegionContext';
import { useToast } from '../../contexts/ToastContext';
import { MiniDentalChart } from '../../components/MiniDentalChart';
import { TOOTH_STATUSES } from '../../components/ToothData';

export const InfoSidebar = ({ 
  infoSidebarOpen, 
  setInfoSidebarOpen, 
  selectedToothFilter, 
  setSelectedToothFilter,
  patientTeeth,
  setToothModalVisible,
  outstandingDisplay,
  generateAISummary,
  setActiveTab
}) => {
  const { region, t, selectedPatient, labOrders } = useContext(RegionContext);
  const patientOrders = (labOrders || []).filter(o => o.patientName === selectedPatient?.name);
  const { showToast } = useToast();

  return (
    <div className={`${infoSidebarOpen ? 'w-80 xl:w-96' : 'w-0'} bg-white transition-all duration-300 shrink-0 relative z-30`}>
      <div className="w-full h-full overflow-hidden border-l border-slate-50 flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none border-l-2 border-primary pl-2">{t('common.details')}</h4>
                <button 
                  onClick={() => setInfoSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                >
                  <PanelRightClose size={16} />
                </button>
              </div>
              
              <div className="p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100/50 space-y-6">
                  <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none border-l-2 border-primary/30 pl-2">{t('perio.dentalStatus')}</h4>
                      <button onClick={() => setToothModalVisible(true)} className="p-1 px-2 rounded-lg bg-slate-50 text-[9px] font-black text-primary hover:bg-primary hover:text-white transition-all uppercase">{t('toothChart.markChart')}</button>
                  </div>
                  
                  <div className="flex justify-center py-2">
                      <MiniDentalChart 
                          selectedTeeth={patientTeeth} 
                          onToothClick={(id) => {
                              setSelectedToothFilter(id);
                              showToast(t('common.filteredTooth', { id }), 'info');
                          }}
                      />
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                      {patientTeeth.map(({ id, status: statusId }) => {
                          const status = TOOTH_STATUSES.find(s => s.id === statusId);
                          return (
                              <div 
                                  key={id} 
                                  onClick={() => setSelectedToothFilter(id === selectedToothFilter ? null : id)}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-all cursor-pointer select-none ${selectedToothFilter === id ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'bg-white border-slate-50 text-slate-500 hover:border-primary/20'}`}
                              >
                                  <div className={`w-1 h-1 rounded-full ${selectedToothFilter === id ? 'bg-white' : (status?.color || 'bg-primary')}`} />
                                  <span className="text-[9px] font-black">#{id}</span>
                              </div>
                          );
                      })}

                      <button onClick={() => setToothModalVisible(true)} className="w-6 h-6 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-primary hover:text-primary transition-all group">
                          <Plus size={12} className="group-hover:scale-110 transition-transform" />
                      </button>
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 text-center uppercase tracking-widest">{patientTeeth.length} {t('patient.markersFound')}</p>
              </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none border-l-2 border-indigo-400 pl-2 mb-3">{t('ai.assistant')}</h4>
            <div className="p-5 bg-indigo-50 rounded-3xl border border-indigo-100 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-indigo-200 group-hover:text-indigo-400 transition-colors"><Activity size={16} /></div>
                <p className="text-[11px] font-black text-indigo-700 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  {t('ai.summary')}
                </p>
                <p className="text-[11px] font-bold text-indigo-600/80 leading-relaxed mb-4">{generateAISummary()}</p>

                <div className="flex gap-2">
                  <input type="text" placeholder={t('ai.askPlaceholder')} className="flex-1 bg-white border-none rounded-xl px-3 py-2 text-[10px] font-bold focus:ring-1 focus:ring-indigo-300 outline-none" />
                  <button onClick={() => showToast(t('ai.analyzing'), 'info')} className="p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all"><ChevronRight size={14} /></button>
                </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none border-l-2 border-primary/30 pl-2 mb-3">{t('clinical.notes')}</h4>
            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">{t('clinical.noteDefault', { defaultValue: 'Patient is sensitive to cold on lower left molars. Prefers pm appointments.' })}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none border-l-2 border-emerald-400 pl-2 mb-3">{t('lab.title')}</h4>
            <div className="p-5 bg-emerald-50/50 rounded-3xl border border-emerald-100 flex items-center justify-between group cursor-pointer hover:bg-emerald-50 transition-all border-dashed" onClick={() => setActiveTab('lab')}>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                      <Box size={18} />
                   </div>
                   <div>
                      <p className="text-[11px] font-black text-emerald-700">{patientOrders.length} {t('lab.orderVolume') || t('common.records')}</p>
                      <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest">{t('lab.liveConnection')}</p>
                   </div>
                </div>
                <ChevronRight size={14} className="text-emerald-300 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none border-l-2 border-slate-200 pl-2">{t('common.details')}</h4>
            {[
              { icon: <Phone size={14} />, label: t('patient.phone'), value: selectedPatient?.phone },
              { icon: <Mail size={14} />, label: t('billing.email'), value: "sterling@example.com" },
              { icon: <MapPin size={14} />, label: t('patient.location'), value: region === 'cn' ? t('common.shanghai') : t('common.california') }
            ].map((item, i) => (
              <div key={i} className="group">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">{item.icon}</div>
                    <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1.5">{item.label}</p>
                        <p className="text-[13px] font-black text-slate-700">{item.value}</p>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
