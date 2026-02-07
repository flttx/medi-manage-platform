import React, { useContext } from 'react';
import { Plus, FileText } from 'lucide-react';
import { RegionContext } from '../../contexts/RegionContext';
import { formatCurrency } from '../../utils/format';

export const BillingTab = ({ outstandingDisplay, totalPaid, patientInvoices }) => {
  const { region, t, setGlobalModal } = useContext(RegionContext);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 group hover:border-primary/20 transition-all">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('billing.outstanding')}</p>
          <div className="text-3xl font-black text-rose-500 font-mono tracking-tighter">{formatCurrency(outstandingDisplay, region === 'cn' ? 'cn' : 'us')}</div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 group hover:border-primary/20 transition-all">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('billing.totalPaid')}</p>
          <div className="text-3xl font-black text-emerald-500 font-mono tracking-tighter">{formatCurrency(totalPaid, region === 'cn' ? 'cn' : 'us')}</div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 group hover:border-primary/20 transition-all">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('billing.balance')}</p>
          <div className="text-3xl font-black text-slate-800 font-mono tracking-tighter">{formatCurrency(0, region === 'cn' ? 'cn' : 'us')}</div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/30 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{t('billing.recentInvoices')}</h3>
            <p className="text-[9px] font-bold text-slate-300">{t('billing.description', { defaultValue: 'View and manage patient financial transactions' })}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setGlobalModal({ type: 'billing' })} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/30 border-none">
              <Plus size={16} /> {t('billing.createInvoice')}
            </button>
            <button onClick={() => setGlobalModal({ type: 'export' })} className="flex items-center gap-2 px-6 py-3 bg-white text-slate-400 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:text-primary hover:border-primary/30 shadow-sm">
              <FileText size={16} /> Export Statement
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('common.date')}</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('common.description', { defaultValue: 'Description' })}</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t('common.amount', { defaultValue: 'Amount' })}</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('common.status', { defaultValue: 'Status' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {patientInvoices.map((tx, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-all duration-300">
                  <td className="px-10 py-8 text-[11px] font-black text-slate-400 tabular-nums">{tx.date}</td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${tx.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                      <div>
                        <p className="text-sm font-black text-slate-700">{tx.desc}</p>
                        <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">
                          {tx.id} • {tx.method} • {tx.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-base font-black text-slate-900 text-right tabular-nums">{formatCurrency(tx.amount, region === 'cn' ? 'cn' : 'us')}</td>
                  <td className="px-10 py-8 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${tx.status === 'Paid' ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-amber-100 text-amber-600'}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
