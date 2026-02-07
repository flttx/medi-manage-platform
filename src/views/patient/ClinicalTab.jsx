import React, { useContext } from 'react';
import { Plus, Edit, Trash2, ClipboardList } from 'lucide-react';
import { RegionContext } from '../../contexts/RegionContext';
import { TOOTH_STATUSES } from '../../components/ToothData';
import { EmptyState } from '../../components/UI';

export const ClinicalTab = ({ selectedToothFilter, setSelectedToothFilter }) => {
  const { region, t, selectedPatient, medicalRecords, setGlobalModal } = useContext(RegionContext);

  const filteredRecords = medicalRecords
    .filter(r => r.patientId === selectedPatient?.id)
    .filter(r => !selectedToothFilter || (r.affectedTeeth && r.affectedTeeth.some(t => (typeof t === 'object' ? t.id : t) === selectedToothFilter)));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {selectedToothFilter && (
        <div className="mb-4 flex items-center justify-between bg-primary/5 p-4 rounded-2xl border border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-xs">#{selectedToothFilter}</div>
            <p className="text-xs font-bold text-slate-600">
              {t('clinical.filteringTooth', { tooth: selectedToothFilter, defaultValue: `Filtering records for tooth #${selectedToothFilter}` })}
            </p>
          </div>
          <button 
            onClick={() => setSelectedToothFilter(null)}
            className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
          >
            {t('common.clearFilter', { defaultValue: 'Clear Filter' })}
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-10">
        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{t('clinical.history')}</h3>
        <button onClick={() => setGlobalModal({ type: 'clinical' })} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/30 border-none"><Plus size={18} /> {t('clinical.addCase')}</button>
      </div>

      <div className="flex gap-4 lg:gap-12 pl-8 lg:pl-32 relative">
        <div className="absolute left-[39.5px] lg:left-[135.5px] top-0 bottom-0 w-[1.5px] bg-slate-100" />
        <div className="flex-1 space-y-12">
            {filteredRecords.length === 0 ? (
                <EmptyState 
                    title={t('common.noData')} 
                    subtitle={t('clinical.noRecord')}
                    icon={ClipboardList}
                    action={
                        <button onClick={() => setGlobalModal({ type: 'clinical' })} className="px-6 py-3 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
                            {t('clinical.addCase')}
                        </button>
                    }
                />
            ) : (
                filteredRecords.map((record, i) => (
                    <div key={i} className="relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* ... existing card rendering ... */}
                        <div className="absolute -left-[140px] top-6 hidden lg:flex flex-col items-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                            <span className="text-[11px] font-black text-slate-900 tabular-nums">{record.date.split('.')[1]}.{record.date.split('.')[2]}</span>
                            <span className="text-[8px] font-black text-slate-300 uppercase">{record.date.split('.')[0]}</span>
                        </div>
                        <div className="absolute -left-[5.5px] lg:absolute lg:-left-[5.5px] top-7 w-2.5 h-2.5 rounded-full bg-white border-2 border-slate-200 group-hover:border-primary group-hover:scale-125 transition-all z-10 shadow-sm" />
                        <div className="card p-8 border border-slate-50 shadow-xl shadow-slate-200/20 space-y-6 bg-white hover:shadow-2xl hover:shadow-slate-200/40 transition-all rounded-[2rem]">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center font-black text-sm">0{i+1}</div>
                                    <div>
                                        <h3 className="text-base font-black text-slate-800">{record.type}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{record.dr}</p>
                                            {record.affectedTeeth?.length > 0 && (
                                                <div className="flex gap-1 ml-2">
                                                    {record.affectedTeeth.map(tooth => {
                                                        const id = typeof tooth === 'object' ? tooth.id : tooth;
                                                        const statusId = typeof tooth === 'object' ? tooth.status : 'healthy';
                                                        const status = TOOTH_STATUSES.find(s => s.id === statusId);
                                                        return (
                                                            <span key={id} className={`px-1.5 py-0.5 bg-white text-[8px] font-black rounded border flex items-center gap-1 shadow-sm ${status?.stroke || 'border-primary/10'}`}>
                                                                <div className={`w-1 h-1 rounded-full ${status?.color || 'bg-primary'}`} />
                                                                <span className="text-slate-700">#{id}</span>
                                                                {tooth.surfaces?.length > 0 && (
                                                                    <span className="text-[10px] font-black text-rose-400 ml-1 decoration-rose-200">{tooth.surfaces.join('')}</span>
                                                                )}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setGlobalModal({ type: 'clinical', data: record })} className="p-2 rounded-lg bg-slate-50 text-slate-300 hover:text-primary transition-all"><Edit size={16} /></button>
                                    <button className="p-2 rounded-lg bg-slate-50 text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">{t('forms.chiefComplaint') || 'CHIEF COMPLAINT'}</h4>
                                    <p className="text-[13px] font-bold text-slate-600 leading-relaxed">{record.cc}</p>
                                </div>
                                <div>
                                    <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">{t('forms.diagnosis') || 'DIAGNOSIS'}</h4>
                                    <p className="text-[13px] font-bold text-slate-600 leading-relaxed">{record.dx}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};
