import React, { useContext } from 'react';
import { 
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RegionContext } from '../contexts/RegionContext';

export const FinanceView = () => {
    const { t } = useContext(RegionContext);
    const transactions = [
        { pName: "Lily Smith", type: "Extraction", amount: "$240.00", date: "2026.02.01", status: "completed" },
        { pName: "Michael Chen", type: "Consult", amount: "$80.00", date: "2026.02.01", status: "pending" },
        { pName: "Emma Wilson", type: "Cleaning", amount: "$120.00", date: "2026.01.30", status: "completed" },
        { pName: "David Zhang", type: "Root Canal", amount: "$850.00", date: "2026.01.28", status: "completed" },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 card overflow-hidden border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem]">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="p-5">{t.fullName}</th>
                                <th className="p-5">{t.treatmentItems || 'Service'}</th>
                                <th className="p-5">{t.costDetails || 'Amount'}</th>
                                <th className="p-5">{t.status}</th>
                                <th className="p-5 text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-bold text-xs text-slate-600">
                            {transactions.map((tr, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-5 text-slate-800 font-black">{tr.pName}</td>
                                    <td className="p-5 text-slate-500 font-medium">{tr.type}</td>
                                    <td className="p-5 font-black text-slate-800 tabular-nums">{tr.amount}</td>
                                    <td className="p-5">
                                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${tr.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {tr.status}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right pr-8">
                                        <button className="text-primary hover:underline transition-all">Receipt</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-6">
                    <div className="card p-8 bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none shadow-xl shadow-emerald-200/50 rounded-[2rem]">
                        <h3 className="text-xs font-black mb-6 opacity-60 uppercase tracking-widest">Monthly Revenue</h3>
                        <p className="text-4xl font-black mb-2 tracking-tighter">$45,280.00</p>
                        <div className="flex items-center gap-2 mt-4 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/5">
                            <TrendingUp size={12} />
                            <span className="text-[10px] font-black">+12% vs last month</span>
                        </div>
                    </div>

                    <div className="card p-6 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] space-y-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Quick Stats</h3>
                        <div className="space-y-4">
                            {['VIP', 'Member', 'Standard'].map((level, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-400">{level}</span>
                                        <span className="text-slate-800">{(3 - i) * 15}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${(3 - i) * 15}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
