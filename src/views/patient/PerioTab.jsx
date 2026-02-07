import React, { useContext, useState } from 'react';
import { Plus, LayoutGrid, List as ListIcon } from 'lucide-react';
import { RegionContext } from '../../contexts/RegionContext';
import { PerioVisualChart } from '../../components/dental/PerioVisualChart';

const PDCell = ({ value, risk, borderRight }) => (
    <td className={`py-4 group/cell relative ${borderRight ? 'border-r border-slate-100' : ''}`}>
        <div className={`text-[11px] font-black tabular-nums transition-all ${risk || value > 3 ? 'text-rose-500' : 'text-slate-500'}`}>
            {value || '-'}
        </div>
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/cell:opacity-100 transition-opacity pointer-events-none" />
    </td>
);

export const PerioTab = () => {
  const { t, perioRecords, setGlobalModal, selectedPatient } = useContext(RegionContext);
  const [viewMode, setViewMode] = useState('visual'); // 'list' or 'visual'
  
  const currentRecord = perioRecords.find(r => r.patientId === (selectedPatient?.id || 'P2026001'));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="flex justify-between items-end mb-6 px-4">
        <div>
          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">{t('perio.title')}</h3>
          <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('perio.latestExam')}</h2>
              <div className="flex bg-slate-100/80 p-1 rounded-xl shadow-inner">
                  <button 
                    onClick={() => setViewMode('visual')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${viewMode === 'visual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                      <LayoutGrid size={12} /> {t('common.view.visual', { defaultValue: 'Visual' })}
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                      <ListIcon size={12} /> {t('common.view.table', { defaultValue: 'Table' })}
                  </button>
              </div>
          </div>
          <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{t('perio.lastExam')}: {currentRecord?.date} • {currentRecord?.doctor}</p>
        </div>
        <button onClick={() => setGlobalModal({ type: 'perio' })} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-200 border-none hover:scale-105 active:scale-95"><Plus size={18} /> {t('perio.newExam')}</button>
      </div>

      {viewMode === 'visual' ? (
          <PerioVisualChart record={currentRecord} history={perioRecords.filter(r => r.patientId === (selectedPatient?.id || 'P2026001'))} />
      ) : (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/30 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
                <thead>
                <tr className="bg-slate-50/50">
                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">{t('perio.tooth')}</th>
                    <th colSpan="3" className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">{t('perio.buccalPd')}</th>
                    <th colSpan="3" className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('perio.lingualPd')}</th>
                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-l border-slate-100">{t('perio.bop')}</th>
                </tr>
                <tr className="bg-slate-50/20 text-[8px] font-black text-slate-300 border-b border-slate-100">
                    <th className="py-2 border-r border-slate-100">#</th>
                    <th className="py-2">D</th><th className="py-2">M</th><th className="py-2 border-r border-slate-100">L</th>
                    <th className="py-2">D</th><th className="py-2">M</th><th className="py-2">L</th>
                    <th className="py-2 border-l border-slate-100">Point</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                {currentRecord && Object.entries(currentRecord.data).map(([toothId, data], i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-all duration-300">
                    <td className="py-4 font-black text-indigo-600 border-r border-slate-100 tabular-nums text-xs">#{toothId}</td>
                    <PDCell value={data.pd_b[0]} /><PDCell value={data.pd_b[1]} /><PDCell value={data.pd_b[2]} borderRight />
                    <PDCell value={data.pd_l[0]} /><PDCell value={data.pd_l[1]} /><PDCell value={data.pd_l[2]} />
                    <td className="py-4 border-l border-slate-100">
                        {data.bi > 0 && <div className="w-2 h-2 rounded-full bg-rose-500 mx-auto shadow-sm shadow-rose-200" />}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t('perio.riskSummary')}</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-600">{t('perio.deepPockets')} ({'>'}4mm)</span><span className="text-sm font-black text-rose-500">12%</span></div>
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-600">{t('perio.bopPositive')}</span><span className="text-sm font-black text-rose-500">8%</span></div>
            <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-rose-500 h-full w-[12%]" />
            </div>
          </div>
        </div>
        <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
          <h4 className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-4">{t('perio.guidanceTitle')}</h4>
          <p className="text-[13px] font-bold leading-relaxed opacity-90">{t('perio.guidance')}</p>
        </div>
      </div>
    </div>
  );
};
