import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderOpen, 
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RegionContext } from '../contexts/RegionContext';

export const CaseListView = () => {
  const { t, setActiveView, setSelectedPatient, viewPatient } = useContext(RegionContext);
  const navigate = useNavigate();
  
  const cases = [
    { name: "ces", patient: "kk", id: "P2026001", type: t('case.dentalDesign'), doctor: "测", date: "2026.01.28", modified: "2026.01.28" },
    { name: "测试纹理调节", patient: "DD-TEST", id: "DD-TEST0518", type: t('case.dentalDesign'), doctor: "测", date: "2026.01.27", modified: "2026.01.27" },
    { name: "00816", patient: "kk", id: "P2026001", type: t('case.dentalDesign'), doctor: "测", date: "2026.01.27", modified: "2026.01.27" },
    { name: "00372", patient: "kk", id: "P2026001", type: t('case.dentalDesign'), doctor: "测", date: "2026.01.27", modified: "2026.01.27" },
    { name: "00337", patient: "kk", id: "P2026001", type: t('case.dentalDesign'), doctor: "测", date: "2026.01.27", modified: "2026.01.27" },
    { name: "00168", patient: "kk", id: "P2026001", type: t('case.dentalDesign'), doctor: "测", date: "2026.01.27", modified: "2026.01.27" },
    { name: "测试预设参数", patient: "DD-TEST", id: "DD-TEST0518", type: t('case.dentalDesign'), doctor: "测", date: "2026.01.09", modified: "2026.01.09" },
  ];

  const handlePatientClick = (pName) => {
    const p = { name: pName, id: "P2026001", age: 28, gender: "Male", phone: "138****8888" };
    viewPatient(p);
    navigate(`/patients/detail/${p.id}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="card flex-1 overflow-hidden flex flex-col h-full bg-white rounded-2xl border-none shadow-xl shadow-slate-200/50"
    >
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur-md">
            <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/30">
              <th className="p-4 w-12 text-center"><input type="checkbox" className="rounded-sm accent-primary" /></th>
              <th className="p-4 w-1/4">{t('case.name')}</th>
              <th className="p-4">{t('case.doctor')}</th>
              <th className="p-4">{t('case.id')}</th>
              <th className="p-4">{t('case.type')}</th>
              <th className="p-4">{t('case.doctor')}</th>
              <th className="p-4 w-32">{t('case.created')}</th>
              <th className="p-4 w-24 text-right">{t('common.action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {cases.map((c, i) => (
              <tr key={i} className="group hover:bg-blue-50/30 transition-colors text-xs text-slate-600">
                <td className="p-4 text-center"><input type="checkbox" className="rounded-sm border-slate-300 accent-primary" /></td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 text-primary rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                        <FolderOpen size={16} />
                    </div>
                    <span className="font-bold text-slate-700 truncate">{c.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span 
                    className="cursor-pointer text-primary hover:underline font-medium"
                    onClick={() => handlePatientClick(c.patient)}
                  >
                    {c.patient}
                  </span>
                </td>
                <td className="p-4 text-slate-400 font-mono tracking-tighter">{c.id}</td>
                <td className="p-4">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-500 uppercase">{c.type}</span>
                </td>
                <td className="p-4 font-medium">{c.doctor}</td>
                <td className="p-4 text-slate-400 tabular-nums">{c.date}</td>
                <td className="p-4 text-right">
                    <button 
                      onClick={() => handlePatientClick(c.patient)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <ChevronRight size={18} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
        <span className="text-[11px] text-slate-400 font-medium">{t('common.showingItems', { count: cases.length })}</span>
        <div className="flex items-center gap-1 text-[11px] font-bold">
          {[1, 2, 3, '...', 12].map((n, i) => (
            <div key={i} className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all ${n === 1 ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400 hover:bg-white hover:shadow-sm'}`}>
              {n}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
