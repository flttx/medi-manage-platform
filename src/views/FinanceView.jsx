import React, { useContext, useMemo, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  ArrowUpRight, 
  Clock, 
  Filter,
  Download,
  Wallet,
  Calendar as CalendarIcon,
  Search,
  BarChart3,
  PieChart as PieChartIcon,
  Users,
  Timer,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegionContext } from '../contexts/RegionContext';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  ComposedChart, Line
} from 'recharts';
import dayjs from 'dayjs';
import { formatCurrency, formatDate } from '../utils/format';

export const FinanceView = () => {
    const { t, invoices, patients, treatmentPlans, doctors, appointments, region } = useContext(RegionContext);
    const [activeTab, setActiveTab] = useState('overview'); // overview, clinician
    
    const getPatientName = (id) => patients.find(p => p.id === id)?.name || id;
    const getCategoryLabel = (cat) => t(`finance.category.${cat.toLowerCase()}`) !== `finance.category.${cat.toLowerCase()}` ? t(`finance.category.${cat.toLowerCase()}`) : cat;

    // Financial Metrics Calculation
    const metrics = useMemo(() => {
        const totalPaid = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
        const totalPending = invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + inv.amount, 0);
        const totalRefunds = 1200;
        
        // Revenue Breakdown by Category
        const categories = {};
        invoices.filter(inv => inv.status === 'Paid').forEach(inv => {
            categories[inv.category] = (categories[inv.category] || 0) + inv.amount;
        });
        const pieData = Object.entries(categories).map(([name, value]) => ({ 
            name: getCategoryLabel(name), 
            value 
        }));
        
        // Aging Analysis
        const now = dayjs('2026-02-06');
        const agingData = [
            { name: '0-30', value: 0 },
            { name: '31-60', value: 0 },
            { name: '61-90+', value: 0 }
        ];
        invoices.filter(inv => inv.status === 'Pending').forEach(inv => {
            const days = now.diff(dayjs(inv.date.replace(/\./g, '-')), 'day');
            if (days <= 30) agingData[0].value += inv.amount;
            else if (days <= 60) agingData[1].value += inv.amount;
            else agingData[2].value += inv.amount;
        });

        // Clinician Efficiency Analysis
        const clinicianData = doctors.map(doc => {
            const docPlans = treatmentPlans.filter(p => p.doctorId === doc.id);
            const active = docPlans.filter(p => p.status === 'active').length;
            const total = docPlans.length;
            const conversion = total > 0 ? Math.round((active / total) * 100) : 0;
            
            // Revenue by Doctor
            const docRevenue = invoices
                .filter(inv => inv.status === 'Paid' && appointments.find(app => (app.id === inv.patientId || app.patient === getPatientName(inv.patientId)) && app.doctor === doc.name))
                .reduce((sum, inv) => sum + inv.amount, 0);

            return {
                name: doc.name,
                conversion,
                revenue: docRevenue || Math.floor(Math.random() * 5000) + 2000, // Fallback for demo
                visits: appointments.filter(app => app.doctor === doc.name).length,
                avgTime: Math.floor(Math.random() * 15) + 30 // Mock avg time
            };
        });

        return { totalPaid, totalPending, totalRefunds, pieData, agingData, clinicianData };
    }, [invoices, treatmentPlans, doctors, appointments, patients]);

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444'];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-32">
            {/* Page Header with Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('modules.financeManage')}</h2>
                    <div className="flex items-center gap-1 mt-3 p-1 bg-slate-100 rounded-xl w-fit">
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {t('common.overview')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('clinician')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'clinician' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {t('finance.clinicianMetrics')}
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
                        <CalendarIcon size={14} /> {formatDate(dayjs(), region === 'cn' ? 'cn' : 'us', 'MMMM YYYY')}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                        <Download size={14} /> {t('common.export')}
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' ? (
                    <motion.div 
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        {/* Quick Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="p-8 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
                                <Wallet size={24} className="mb-6 opacity-60" />
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">{t('finance.revenue')}</p>
                                <p className="text-3xl font-black tracking-tighter mb-4">{formatCurrency(metrics.totalPaid, region === 'cn' ? 'cn' : 'us')}</p>
                                <div className="flex items-center gap-2 text-[10px] font-black bg-white/10 w-fit px-3 py-1 rounded-full border border-white/5">
                                    <TrendingUp size={12} className="text-emerald-400" />
                                    <span>+18.4%</span>
                                </div>
                            </div>

                            <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/30 relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                        <Clock size={24} />
                                    </div>
                                    <ArrowUpRight size={16} className="text-slate-200 group-hover:text-primary transition-colors" />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('billing.outstanding')}</p>
                                <p className="text-3xl font-black text-slate-800 tracking-tighter mb-1">{formatCurrency(metrics.totalPending, region === 'cn' ? 'cn' : 'us')}</p>
                                <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{t('finance.newInvoicesToday', { count: 3 })}</p>
                            </div>

                            <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/30">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                                        <TrendingDown size={24} />
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('finance.refundsMTD')}</p>
                                <p className="text-3xl font-black text-slate-800 tracking-tighter mb-1">{formatCurrency(metrics.totalRefunds, region === 'cn' ? 'cn' : 'us')}</p>
                                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{t('finance.vsLastMonthDown', { percent: 12 })}</p>
                            </div>

                            <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                        <CreditCard size={24} />
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('finance.netCashFlow')}</p>
                                <p className="text-3xl font-black text-slate-800 tracking-tighter mb-1">{formatCurrency(metrics.totalPaid - metrics.totalRefunds, region === 'cn' ? 'cn' : 'us')}</p>
                                <div className="w-full bg-slate-50 h-1.5 rounded-full mt-4 overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-[85%]" />
                                </div>
                            </div>
                        </div>

                        {/* Visual Analytics Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Revenue Breakdown */}
                            <div className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/30 flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-800 tracking-tight">{t('finance.revenueBreakdown')}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('finance.revenueBreakdownSub')}</p>
                                    </div>
                                    <Filter size={16} className="text-slate-300 hover:text-primary cursor-pointer transition-all" />
                                </div>
                                
                                <div className="flex-1 min-h-[300px] flex items-center">
                                    <div className="w-1/2 h-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={metrics.pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={8}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {metrics.pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip 
                                                    contentStyle={{ borderRadius: '1.2rem', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="w-1/2 space-y-4 pl-8 border-l border-slate-50">
                                        {metrics.pieData.map((entry, index) => (
                                            <div key={entry.name} className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider group-hover:text-slate-800 transition-colors">{entry.name}</span>
                                                </div>
                                                <span className="text-xs font-black text-slate-800 tabular-nums">{formatCurrency(entry.value, region === 'cn' ? 'cn' : 'us')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Aging Analysis */}
                            <div className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/30 flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-800 tracking-tight">{t('finance.agingAnalysis')}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('finance.agingAnalysisSub')}</p>
                                    </div>
                                    <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-100 shadow-sm">{t('finance.criticalFocus')}</div>
                                </div>

                                <div className="flex-1 min-h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={metrics.agingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                                label={{ value: t('finance.daysAging'), position: 'insideBottom', offset: -5, fontSize: 9, fontWeight: 900, fill: '#cbd5e1' }}
                                            />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                                            <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', shadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                                            <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                                                {metrics.agingData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === 2 ? '#ef4444' : index === 1 ? '#f59e0b' : '#6366f1'} opacity={0.8} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Latest Transactions Table */}
                        <div className="p-2 bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
                            <div className="p-6 pb-2 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-black text-slate-800 tracking-tight">{t('finance.latestTransactions')}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('finance.latestTransactionsSub')}</p>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                    <input type="text" placeholder={t('finance.searchInvoices')} className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-primary/20 w-48 md:w-64 transition-all" />
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                                            <th className="px-8 py-5"># ID</th>
                                            <th className="px-8 py-5">{t('patient.name')}</th>
                                            <th className="px-8 py-5">{t('billing.service')}</th>
                                            <th className="px-8 py-5">{t('billing.amount')}</th>
                                            <th className="px-8 py-5">{t('common.status')}</th>
                                            <th className="px-8 py-5 text-left rounded-l-2xl">{t('finance.categoryLabel')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-600">
                                        {invoices.map((inv, i) => (
                                            <motion.tr 
                                                key={inv.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="hover:bg-slate-50/50 transition-colors group"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${inv.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                        <span className="text-[10px] font-black text-slate-400">{inv.id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-primary group-hover:text-white transition-all uppercase">{getPatientName(inv.patientId).charAt(0)}</div>
                                                        <span className="font-black text-slate-800">{getPatientName(inv.patientId)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 opacity-80">{inv.desc}</td>
                                                <td className="px-8 py-6 font-black text-slate-800 tabular-nums">{formatCurrency(inv.amount, region === 'cn' ? 'cn' : 'us')}</td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                                        {inv.status === 'Paid' ? t('billing.paid') : t('billing.pending')}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-400 rounded uppercase tracking-tighter">{getCategoryLabel(inv.category) || '-'}</span>
                                                        <button className="w-8 h-8 rounded-lg bg-slate-50 text-slate-300 hover:text-primary hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all flex items-center justify-center">
                                                            <ArrowUpRight size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="clinician"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        {/* Clinician Performance Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/30">
                                <h3 className="text-sm font-black text-slate-800 tracking-tight mb-8 flex items-center gap-2">
                                    <Target className="text-indigo-500" size={18} />
                                    {t('finance.conversionRate')}
                                </h3>
                                <div className="space-y-6">
                                    {metrics.clinicianData.map((doc, i) => (
                                        <div key={doc.name} className="space-y-2">
                                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                                <span className="text-slate-500">{doc.name}</span>
                                                <span className="text-indigo-600 tabular-nums">{doc.conversion}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${doc.conversion}%` }}
                                                    className="h-full bg-indigo-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2 p-8 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/30">
                                <h3 className="text-sm font-black text-slate-800 tracking-tight mb-8 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="text-emerald-500" size={18} />
                                        {t('finance.profitVsEfficiency')}
                                    </div>
                                        <div className="flex gap-4">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400"><div className="w-2 h-2 rounded-full bg-primary" /> {t('finance.totalRevenue')}</div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400"><div className="w-2 h-2 rounded-full bg-emerald-400" /> {t('finance.patientVisits')}</div>
                                    </div>
                                </h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={metrics.clinicianData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                                            <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: 'none', shadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                                            <Legend iconType="circle" />
                                            <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} name={t('finance.totalRevenue')} />
                                            <Line type="monotone" dataKey="visits" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} name={t('finance.patientVisits')} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Metrics Table */}
                        <div className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/30">
                             <table className="w-full text-left">
                                 <thead>
                                     <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                                         <th className="py-5">{t('doctorManage.doctorName')}</th>
                                         <th className="py-5">{t('finance.patients')}</th>
                                         <th className="py-5">{t('finance.revenuePerPatient')}</th>
                                         <th className="py-5">{t('finance.avgVisitTime')}</th>
                                         <th className="py-5 text-right">{t('finance.performanceScore')}</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-50 text-sm font-bold text-slate-600">
                                     {metrics.clinicianData.map((doc, i) => (
                                         <tr key={doc.name} className="group hover:bg-slate-50/50 transition-all">
                                             <td className="py-6 flex items-center gap-4">
                                                 <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-black">
                                                     {doc.name.charAt(0)}
                                                 </div>
                                                  <div>
                                                      <p className="text-sm font-black text-slate-800">{doc.name}</p>
                                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{doc.visits > 3 ? t('status.highActivity') : t('status.standard')}</p>
                                                  </div>
                                              </td>
                                              <td className="py-6 font-black text-slate-800">{doc.visits}</td>
                                              <td className="py-6 text-slate-500">{formatCurrency((doc.revenue / doc.visits), region === 'cn' ? 'cn' : 'us')}</td>
                                             <td className="py-6 flex items-center gap-2 text-slate-400">
                                                 <Timer size={14} />
                                                 {doc.avgTime}m
                                             </td>
                                             <td className="py-6 text-right">
                                                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${doc.conversion > 70 ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                                     {doc.conversion > 70 ? t('finance.excellent') : t('finance.stable')}
                                                 </span>
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
