import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Calendar, 
  Wallet, 
  User, 
  Users,
  MessageCircle, 
  ChevronRight, 
  Bell, 
  Activity,
  CreditCard,
  FileText,
  Settings,
  Plus as IconPlus,
  Check as IconCheck,
  Moon,
  Sun,
  Maximize2,
  Clock,
  MapPin
} from 'lucide-react';
import { RegionContext } from '../../contexts/RegionContext';
import { MiniDentalChart } from '../../components/MiniDentalChart';
import { TOOTH_DATA } from '../../components/ToothData';

export const PatientH5 = () => {
  const { region, t, appointments, invoices, treatmentPlans, setTreatmentPlans, patients, medicalRecords, imagingData, setPlatform, updateInvoice, updateAppointment, messages, setMessages, theme, setTheme } = useContext(RegionContext);
  const [activeTab, setActiveTab] = useState('home');
  const [showPayModal, setShowPayModal] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [island, setIsland] = useState({ show: false, text: '', type: 'info', action: null });
  const [hasNotifiedNewProposal, setHasNotifiedNewProposal] = useState(false);

  const triggerIsland = (text, type = 'info', action = null) => {
      setIsland({ show: true, text, type, action });
      if (!action) {
          setTimeout(() => setIsland(prev => ({ ...prev, show: false })), 3000);
      }
  };
  
  const patient = patients[0]; 
  const nextAppt = appointments.find(a => a.patient === patient.name && a.status !== 'cancelled');
  const myInvoices = invoices.filter(inv => inv.patientId === patient.id);
  const pendingInvoices = myInvoices.filter(inv => inv.status === 'Pending');
  const outstanding = pendingInvoices.reduce((s, i) => s + i.amount, 0);

  useEffect(() => {
    const hasProposedPlan = treatmentPlans.some(p => p.patientId === patient.id && p.status === 'proposing');
    if (hasProposedPlan) {
      // Pinned notification for new plan
      setIsland({
        show: true, 
        text: t('mobile.patient.island.newPlan'), 
        type: 'info',
        action: () => {
          setActiveTab('plans');
          setIsland(prev => ({ ...prev, show: false }));
        }
      });
    } else {
      // Clear specific notification if resolved
      setIsland(prev => {
         if (prev.text === t('mobile.patient.island.newPlan')) {
             return { ...prev, show: false };
         }
         return prev;
      });
    }
  }, [treatmentPlans, patient.id, t]);

  const handlePay = () => {
      setTimeout(() => {
          pendingInvoices.forEach(inv => updateInvoice(inv.id, { status: 'Paid', method: 'AliPay' }));
          setPaySuccess(true);
          triggerIsland(t('mobile.patient.island.paySuccess'), 'success');
          setTimeout(() => {
              setShowPayModal(false);
              setPaySuccess(false);
          }, 2000);
      }, 1500);
  };

  const handleConfirmAppt = (id) => {
      updateAppointment(id, { status: 'confirmed' });
      triggerIsland(t('mobile.patient.island.apptConfirmed'), 'info');
  };

  const handleApprovePlan = (id) => {
      setTreatmentPlans(prev => prev.map(p => p.id === id ? { ...p, status: 'active' } : p));
      triggerIsland(t('mobile.patient.island.planActivated'), 'success');
  };

  const [chatInput, setChatInput] = useState('');
  const handleSendMessage = () => {
      if (!chatInput.trim()) return;
      const newMessage = {
          id: Date.now(),
          sender: 'Me',
          text: chatInput,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'sent'
      };
      setMessages([...messages, newMessage]);
      setChatInput('');
  };

  return (
    <div className={`fixed inset-0 flex flex-col font-sans max-w-md mx-auto shadow-2xl border-x overflow-hidden select-none transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} z-50`}>
      <AnimatePresence>
          {island.show && (
              <motion.div 
                initial={{ y: -100, x: '-50%', scale: 0.5, opacity: 0 }}
                animate={{ y: 12, x: '-50%', scale: 1, opacity: 1 }}
                exit={{ y: -100, x: '-50%', scale: 0.5, opacity: 0 }}
                onClick={() => island.action && island.action()}
                className={`fixed top-0 left-1/2 -translate-x-1/2 z-[100] min-w-[120px] h-10 rounded-full flex items-center justify-center px-6 shadow-2xl border ${theme === 'dark' ? 'bg-white/10 backdrop-blur-xl border-white/20' : 'bg-slate-900 border-white/10'} ${island.action ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
              >
                  <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${island.type === 'success' ? 'bg-emerald-500' : 'bg-primary'} animate-pulse`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${theme === 'dark' ? 'text-white' : 'text-white'}`}>{island.text}</span>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>


      <div className={`h-10 flex items-center justify-between px-8 pt-3 z-50 transition-colors ${theme === 'dark' ? 'bg-slate-900/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'}`}>
        <span className="text-[11px] font-black tracking-tighter">10:24</span>
        <div className="flex gap-2 items-center">
            <div className="flex gap-0.5 items-end h-2.5">
                {[4, 6, 8, 10].map(h => <div key={h} className={`w-[2.5px] rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-slate-800'}`} style={{ height: `${h}px` }} />)}
            </div>
            <span className="text-[9px] font-black tracking-widest">5G</span>
            <div className={`w-6.5 h-3.5 border-1.5 rounded-[4px] p-0.5 flex items-center relative ${theme === 'dark' ? 'border-slate-700' : 'border-slate-300'}`}>
                <div className={`h-full w-[85%] rounded-[1px] ${theme === 'dark' ? 'bg-white' : 'bg-slate-800'}`} />
                <div className={`absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-[3px] rounded-r-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`} />
            </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-24 custom-scrollbar">
        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-500">
            <header className={`p-6 pb-12 rounded-b-[3.5rem] shadow-sm border-b relative transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                   <div className="relative">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`} className={`w-14 h-14 rounded-2xl shadow-sm border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-50'}`} alt="" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-black"><IconCheck size={8} strokeWidth={4} /></div>
                   </div>
                   <div className="flex-1 min-w-0">
                      <h2 className={`text-xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t('mobile.patient.home.hello', { name: patient.name })}</h2>
                      <div className="flex items-center gap-1 opacity-60 mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{t(`status.${patient.status}`)}</p>
                      </div>
                   </div>
                </div>
                <button className={`w-12 h-12 rounded-2xl flex items-center justify-center relative border transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <Bell size={22} strokeWidth={2.5} />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                </button>
              </div>

              {nextAppt && (
                <div className="space-y-4">
                  <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] text-white shadow-2xl shadow-slate-200 relative overflow-hidden"
                  >
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                      <div className="flex justify-between items-center mb-6 relative z-10">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">{t('mobile.patient.home.nextAppt')}</span>
                          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${nextAppt.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                              {nextAppt.status === 'confirmed' ? t('mobile.patient.home.confirmed') : t('mobile.patient.home.pending')}
                          </div>
                      </div>
                      <div className="flex items-baseline gap-2 mb-2 relative z-10">
                          <h2 className="text-4xl font-black tracking-tighter">{nextAppt.time}</h2>
                          <span className="text-sm font-bold opacity-30">{t('common.today')}</span>
                      </div>
                      <p className="text-sm font-bold opacity-60 mb-8 relative z-10">{nextAppt.date} • {nextAppt.type}</p>
                      
                      <div className="flex items-center justify-between relative z-10 border-t border-white/5 pt-6">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/5"><User size={18} className="text-primary" /></div>
                              <div>
                                  <p className="text-[9px] font-black opacity-30 uppercase tracking-widest">{t('mobile.patient.home.attendingDr')}</p>
                                  <p className="text-xs font-black">{nextAppt.doctor}</p>
                              </div>
                          </div>
                          {nextAppt.status !== 'confirmed' && (
                              <button onClick={() => handleConfirmAppt(nextAppt.id)} className="px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 active:scale-95 transition-all">{t('common.confirm')}</button>
                          )}
                      </div>
                  </motion.div>

                  {/* Real-time Queue Status */}
                  {nextAppt.status === 'confirmed' && (
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={`p-6 rounded-[2.5rem] border flex items-center justify-between transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <Users size={24} />
                            </div>
                            <div>
                                <h4 className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t('mobile.patient.queue.liveStatus')}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-[10px] font-bold text-slate-400">{t('mobile.patient.queue.ahead', { count: 2 })}</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('mobile.patient.queue.estWait')}</p>
                            <p className="text-sm font-black text-indigo-500 tracking-tight">~15 MIN</p>
                        </div>
                    </motion.div>
                  )}
                </div>
              )}
            </header>

            <AnimatePresence>
                {outstanding > 0 && (
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="px-6 -mt-8 relative z-50"
                    >
                        <div className="p-6 bg-rose-500 rounded-[2.5rem] flex items-center justify-between text-white shadow-2xl shadow-rose-200 border border-white/20">
                            <div className="flex items-center gap-4">
                               <div className="w-14 h-14 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/10"><Wallet size={28} strokeWidth={2.5} /></div>
                               <div>
                                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70 leading-none mb-2">{t('mobile.patient.home.unpaidBalance')}</p>
                                  <p className="text-2xl font-black tracking-tighter leading-none">¥{outstanding.toLocaleString()}</p>
                               </div>
                            </div>
                            <button 
                                onClick={() => setShowPayModal(true)}
                                className="px-6 py-3 bg-white text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform"
                            >
                                {t('mobile.patient.home.payNow')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="p-6 pt-12 grid grid-cols-2 gap-4">
                {[
                   { id: 'records', label: t('mobile.patient.nav.history'), icon: <FileText className="text-primary" />, bg: 'bg-primary/5', sub: `${medicalRecords.filter(r => r.patientId === patient.id).length} items` },
                   { id: 'imaging', label: t('mobile.patient.nav.imaging'), icon: <Activity className="text-indigo-500" />, bg: 'bg-indigo-50', sub: `${imagingData.filter(i => i.patientId === patient.id).length} scans` },
                   { id: 'plans', label: t('mobile.patient.nav.plans'), icon: <Activity size={20} className="text-emerald-500" />, bg: 'bg-emerald-50', sub: 'Active' },
                   { id: 'wallet', label: t('mobile.patient.nav.wallet'), icon: <CreditCard className="text-amber-500" />, bg: 'bg-amber-50', sub: 'Past 3 mo' },
                ].map((item, i) => (
                    <motion.div 
                        key={i} 
                        whileTap={{ scale: 0.96 }} 
                        onClick={() => setActiveTab(item.id)}
                        className={`p-6 ${item.bg} rounded-[2.5rem] border border-white shadow-sm flex flex-col items-start gap-4 transition-all hover:shadow-lg cursor-pointer`}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-inner border border-slate-50">{item.icon}</div>
                        <div>
                            <span className="text-xs font-black text-slate-800 tracking-tight block">{item.label}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 block">{item.sub}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="px-6 pb-6">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex items-center justify-between group cursor-pointer active:scale-95 transition-all">
                    <div className="relative z-10 flex-1">
                        <h4 className="text-base font-black mb-1">{t('mobile.patient.home.invisalignSpecial')}</h4>
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{t('mobile.patient.home.freeSimulation')}</p>
                    </div>
                    <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/50 group-hover:rotate-12 transition-transform">
                        <ChevronRight size={24} strokeWidth={3} />
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
             <div className="h-full flex flex-col bg-slate-50 animate-in slide-in-from-right duration-300">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-xl z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/5 shadow-inner"><User size={24} strokeWidth={2.5} /></div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                        </div>
                        <div>
                             <h2 className="text-lg font-black text-slate-800 leading-none tracking-tight">Dr. Sterling</h2>
                             <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> {t('mobile.patient.chat.online')}</p>
                        </div>
                    </div>
                    <button onClick={() => setActiveTab('home')} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><IconPlus size={20} className="rotate-45" /></button>
                </div>
                
                <div className="flex-1 p-6 space-y-8 bg-transparent overflow-y-auto custom-scrollbar">
                    <div className="flex justify-center"><span className="px-4 py-1.5 bg-slate-200/50 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest backdrop-blur-sm">Conversation Started</span></div>
                    
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.type === 'sent' ? 'flex-row-reverse self-end ml-auto' : ''}`}>
                            <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border border-slate-100 shadow-sm ${msg.type === 'sent' ? 'bg-primary text-white font-black' : 'bg-white text-primary/40'}`}>
                                {msg.type === 'sent' ? 'L' : <User size={20} />}
                            </div>
                            <div className={`p-5 rounded-[2rem] text-[13px] font-bold leading-relaxed shadow-sm relative ${msg.type === 'sent' ? 'bg-primary text-white rounded-tr-none shadow-primary/20' : 'bg-white text-slate-600 rounded-tl-none border-slate-100'}`}>
                                {msg.text}
                                <div className={`absolute top-0 w-4 h-4 rotate-[45deg] z-[-1] ${msg.type === 'sent' ? '-right-2 bg-primary' : '-left-2 bg-white border-l border-t border-slate-100'}`} />
                            </div>
                        </div>
                    ))}
                 </div>
                 
                 <div className="p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                     <div className="bg-slate-50 rounded-[2.5rem] p-2 pr-2.5 flex items-center gap-3 border border-slate-100 focus-within:ring-2 ring-primary/20 transition-all">
                         <button className="w-11 h-11 rounded-full bg-white text-slate-400 flex items-center justify-center shadow-sm hover:text-primary transition-colors"><IconPlus size={20} /></button>
                         <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Message doctor..." 
                            className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-800 placeholder:text-slate-300 px-2" 
                         />
                         <button 
                            onClick={handleSendMessage}
                            className="w-14 h-12 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-400 active:scale-90 transition-all hover:bg-primary"
                        >
                            <MessageCircle size={20} />
                        </button>
                     </div>
                 </div>
             </div>
        )}

        {activeTab === 'wallet' && (
             <div className="h-full flex flex-col bg-white animate-in slide-in-from-right duration-300">
                <header className="p-8 pb-10 bg-slate-900 rounded-b-[3.5rem] text-white">
                    <div className="flex justify-between items-center mb-10">
                        <button onClick={() => setActiveTab('home')} className="text-white/40"><ChevronRight size={20} className="rotate-180" /></button>
                        <h2 className="text-xs font-black uppercase tracking-[0.3em]">{t('mobile.patient.wallet.title')}</h2>
                        <div className="w-5" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">{t('mobile.patient.wallet.totalOutstanding')}</p>
                    <h3 className="text-5xl font-black tracking-tighter tabular-nums">¥{outstanding.toLocaleString()}</h3>
                </header>
                
                <div className="flex-1 p-6 space-y-6 overflow-y-auto pt-10">
                    <div className="flex justify-between items-center px-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('mobile.patient.wallet.billingHistory')}</h4>
                        <button className="text-[10px] font-black text-primary uppercase">{t('mobile.patient.wallet.seeAll')}</button>
                    </div>
                    {myInvoices.map((inv, i) => (
                        <div key={inv.id || i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                    <IconCheck size={20} strokeWidth={3} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-800">{inv.desc}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{inv.date} • {inv.method}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-base font-black text-slate-800">¥{inv.amount.toLocaleString()}</p>
                                <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${inv.status === 'Paid' ? 'text-emerald-500' : 'text-rose-500'}`}>{inv.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        )}

        {activeTab === 'records' && (
             <div className="h-full flex flex-col bg-slate-50 animate-in slide-in-from-right duration-300">
                <header className="p-8 bg-white rounded-b-[3.5rem] shadow-sm flex items-center justify-between z-10">
                    <button onClick={() => setActiveTab('home')} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><ChevronRight size={20} className="rotate-180" /></button>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em]">{t('mobile.patient.records.title')}</h2>
                    <div className="w-12" />
                </header>
                <div className="flex-1 p-6 space-y-6 overflow-y-auto pt-8">
                    {medicalRecords.filter(r => r.patientId === patient.id).map((rec, i) => (
                        <motion.div 
                            key={rec.id || i}
                            whileTap={{ scale: 0.98 }}
                            className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4"
                        >
                            <div className="flex justify-between items-start">
                                <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest">{rec.type}</div>
                                <span className="text-[10px] font-black text-slate-300 uppercase">{rec.date}</span>
                            </div>
                            <h3 className="text-base font-black text-slate-800 leading-tight">{rec.dx}</h3>
                            <p className="text-xs font-bold text-slate-500 line-clamp-2 leading-relaxed">{rec.cc}</p>
                            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><User size={12} /></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase">{rec.dr}</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-200" />
                            </div>
                        </motion.div>
                    ))}
                </div>
             </div>
        )}

        {activeTab === 'imaging' && (
             <div className="h-full flex flex-col bg-white animate-in slide-in-from-right duration-300">
                <header className="p-8 bg-white border-b border-slate-50 flex items-center justify-between">
                    <button onClick={() => setActiveTab('home')} className="text-slate-400 rotate-180"><ChevronRight size={24} /></button>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] font-sans">{t('mobile.patient.imaging.title')}</h2>
                    <div className="w-6" />
                </header>
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        {imagingData.filter(img => img.patientId === patient.id).map((img, i) => (
                            <motion.div 
                                key={img.id || i} 
                                layoutId={`img-${img.id}`}
                                onClick={() => setSelectedImage(img)}
                                whileTap={{ scale: 0.95 }} 
                                className="group relative aspect-square rounded-[2rem] overflow-hidden bg-slate-900 cursor-pointer shadow-lg"
                            >
                                <img src={img.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                                    <p className="text-[9px] font-black text-white uppercase tracking-widest">{img.type}</p>
                                    <p className="text-[8px] font-bold text-white/50 mt-1">{img.date}</p>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Maximize2 size={16} className="text-white/50" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
             </div>
        )}

         {activeTab === 'plans' && (
             <div className="h-full flex flex-col bg-slate-50 animate-in slide-in-from-right duration-300">
                <header className="p-8 bg-indigo-600 rounded-b-[3.5rem] text-white">
                    <button onClick={() => setActiveTab('home')} className="mb-6 opacity-40"><ChevronRight size={20} className="rotate-180" /></button>
                    <h2 className="text-2xl font-black tracking-tight mb-2">{t('mobile.patient.plans.title')}</h2>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">{t('mobile.patient.plans.review')}</p>
                </header>
                <div className="flex-1 p-6 space-y-8 overflow-y-auto pt-10">
                    {treatmentPlans.filter(p => p.patientId === patient.id && p.status === 'proposing').map(plan => (
                        <div key={plan.id} className="p-8 bg-white rounded-[3rem] border border-primary/20 shadow-xl shadow-primary/5 space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-bl-2xl">New Proposal</div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1">{t(plan.title)}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{plan.date}</p>
                            </div>
                            <div className="space-y-4">
                                {plan.items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-slate-600">{t(item.title)}</span>
                                        <span className="font-black text-primary">¥{item.cost.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-6 border-t border-slate-50 flex flex-col gap-3">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Total</span>
                                    <span className="text-lg font-black text-slate-800">¥{plan.totalCost.toLocaleString()}</span>
                                </div>
                                <button 
                                    onClick={() => handleApprovePlan(plan.id)}
                                    className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/30"
                                >
                                    {t('mobile.patient.plans.approveStart')}
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="h-px bg-slate-200" />

                    {treatmentPlans.filter(p => p.patientId === patient.id && p.status === 'active').map(plan => (
                        <div key={plan.id} className="space-y-6">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">{t('mobile.patient.plans.inProgress')}</h3>
                            {plan.items.map((step, i) => (
                                <div key={i} className="flex gap-6 relative">
                                    {i !== plan.items.length - 1 && (
                                        <div className="absolute top-10 left-5 w-0.5 h-full bg-slate-200" />
                                    )}
                                    <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center z-10 shadow-sm border ${step.status === 'completed' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-300 border-slate-100'}`}>
                                        {step.status === 'completed' ? <IconCheck size={20} strokeWidth={3} /> : <span className="text-xs font-black">{step.phase}</span>}
                                    </div>
                                    <div className="flex-1 pb-10">
                                        <h4 className={`text-sm font-black ${step.status === 'completed' ? 'text-slate-400' : 'text-slate-800'}`}>{t(step.title)}</h4>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">¥{step.cost.toLocaleString()}</span>
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${step.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>{step.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
             </div>
         )}

        {activeTab === 'me' && (
             <div className={`h-full flex flex-col transition-colors ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'} animate-in slide-in-from-right duration-300`}>
                <header className={`p-10 rounded-b-[4rem] shadow-sm flex flex-col items-center transition-colors ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                    <div className={`w-24 h-24 rounded-[2.5rem] p-1 mb-6 shadow-xl border overflow-hidden ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-50'}`}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`} className="w-full h-full object-cover" alt="" />
                    </div>
                    <h2 className={`text-2xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{patient.name}</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{patient.phone}</p>
                    
                    <div className={`w-full grid grid-cols-3 gap-4 mt-8 pt-8 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                        <div className="text-center">
                            <p className={`text-xs font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>32</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase">{t('mobile.patient.me.age')}</p>
                        </div>
                        <div className={`text-center border-x px-4 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                            <p className="text-xs font-black text-emerald-500">Low</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase">{t('mobile.patient.me.risk')}</p>
                        </div>
                        <div className="text-center">
                            <p className={`text-xs font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>A+</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase">{t('mobile.patient.me.insure')}</p>
                        </div>
                    </div>
                </header>
                
                <div className="p-6 space-y-4">
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('mobile.records.statusChart')}</h3>
                            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded uppercase">Healthy</span>
                        </div>
                        <div className="flex justify-center h-48">
                            <MiniDentalChart 
                                selectedTeeth={[
                                    { id: 36, status: 'healthy' },
                                    { id: 11, status: 'healthy' },
                                    { id: 46, status: 'healthy' }
                                ]} 
                            />
                        </div>
                    </div>

                    <div 
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={`p-6 rounded-[2rem] flex items-center justify-between border cursor-pointer transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-white text-slate-800 shadow-sm'}`}
                    >
                        <div className="flex items-center gap-4">
                            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-500" />}
                            <span className="text-xs font-black">{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                        </div>
                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                             <motion.div 
                                animate={{ x: theme === 'dark' ? 16 : 0 }}
                                className="w-4 h-4 bg-white rounded-full shadow-sm" 
                             />
                        </div>
                    </div>
                    {[
                        { label: t('mobile.patient.nav.history'), icon: <User size={18} /> },
                        { label: t('mobile.patient.me.family'), icon: <Users size={18} /> },
                        { label: t('mobile.patient.me.location'), icon: <Activity size={18} /> },
                        { label: t('common.settings'), icon: <Settings size={18} /> },
                    ].map((item, i) => (
                        <div key={i} className={`p-6 rounded-[2rem] flex items-center justify-between border shadow-sm transition-all opacity-60 grayscale cursor-not-allowed ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-white text-slate-800'}`}>
                            <div className="flex items-center gap-4">
                                {item.icon}
                                <span className="text-xs font-black">{item.label}</span>
                            </div>
                            <ChevronRight size={18} className="text-slate-300" />
                        </div>
                    ))}
                    <button 
                        onClick={() => window.close()}
                        className={`w-full py-6 mt-6 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl transition-colors ${theme === 'dark' ? 'bg-white text-slate-950 shadow-white/5' : 'bg-slate-900 text-white shadow-slate-200'}`}
                    >
                        {t('mobile.patient.me.logout')}
                    </button>
                </div>
             </div>
        )}
      </main>

      <nav className={`h-24 transition-colors border-t flex items-center justify-around px-4 pb-6 z-50 fixed bottom-0 left-0 right-0 max-w-md mx-auto ${theme === 'dark' ? 'bg-slate-900/90 backdrop-blur-2xl border-slate-800' : 'bg-white/70 backdrop-blur-2xl border-white/20'}`}>
        {[
          { id: 'home', icon: <Home size={22} />, label: t('mobile.patient.nav.home') },
          { id: 'chat', icon: <MessageCircle size={22} />, label: t('mobile.patient.nav.chat') },
          { id: 'wallet', icon: <Wallet size={22} />, label: t('mobile.patient.nav.bill') },
          { id: 'me', icon: <User size={22} />, label: t('mobile.patient.nav.me') }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 transition-all relative group ${activeTab === tab.id ? 'text-primary' : (theme === 'dark' ? 'text-slate-600' : 'text-slate-300')}`}
          >
            <motion.div 
                whileTap={{ scale: 0.8 }}
                className={`w-12 h-10 rounded-2xl flex items-center justify-center transition-all ${activeTab === tab.id ? 'bg-primary/10 shadow-inner' : ''}`}
            >
                 {tab.icon}
            </motion.div>
            <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
            {activeTab === tab.id && <motion.div layoutId="nav-glow" className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_2px_rgba(var(--primary-rgb),0.5)]" />}
          </button>
        ))}
      </nav>

      <AnimatePresence>
          {showPayModal && (
              <div className="fixed inset-0 z-[100] flex items-end justify-center">
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    onClick={() => !paySuccess && setShowPayModal(false)}
                  />
                  <motion.div 
                    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className={`w-full rounded-t-[3.5rem] p-10 relative z-10 flex flex-col items-center shadow-2xl transition-colors ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}
                  >
                      <div className={`w-16 h-1.5 rounded-full mb-8 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`} />
                      
                      {paySuccess ? (
                           <div className="flex flex-col items-center py-10 animate-in zoom-in duration-500 text-center">
                               <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-6 shadow-2xl shadow-emerald-200">
                                   <IconCheck size={48} strokeWidth={4} />
                               </div>
                               <h3 className={`text-2xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t('mobile.patient.pay.successTitle')}</h3>
                               <p className="text-sm font-bold text-slate-400">{t('mobile.patient.pay.successSub')}</p>
                           </div>
                      ) : (
                           <>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{t('mobile.patient.pay.confirmTitle')}</h3>
                                <div className={`text-5xl font-black tracking-tighter mb-10 tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>¥{outstanding.toLocaleString()}</div>
                                
                                <div className="w-full space-y-4 mb-10">
                                    <div className={`p-6 rounded-3xl border flex items-center justify-between group cursor-pointer active:scale-98 transition-all ring-2 ring-primary ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center"><CreditCard size={24} /></div>
                                            <div>
                                                <p className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t('mobile.patient.pay.alipay')}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{t('mobile.patient.pay.selected')}</p>
                                            </div>
                                        </div>
                                        <IconCheck size={20} className="text-primary" strokeWidth={3} />
                                    </div>
                                    <div className={`p-6 rounded-3xl border flex items-center justify-between opacity-50 grayscale ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center"><Wallet size={24} /></div>
                                            <p className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t('mobile.patient.pay.wechat')}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={handlePay}
                                    className={`w-full py-6 rounded-[2rem] text-sm font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all ${theme === 'dark' ? 'bg-white text-slate-950 shadow-white/5 active:bg-slate-100' : 'bg-slate-900 text-white shadow-slate-200 active:bg-slate-800'}`}
                                >
                                    {t('mobile.patient.pay.confirmButton')}
                                </button>
                           </>
                      )}
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      <AnimatePresence>
          {selectedImage && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"
                    onClick={() => setSelectedImage(null)}
                  />
                  <motion.div 
                    layoutId={`img-${selectedImage.id}`}
                    className="relative w-full max-w-sm aspect-square rounded-[3rem] overflow-hidden shadow-2xl z-10"
                  >
                      <img src={selectedImage.url} className="w-full h-full object-contain bg-slate-900" alt="" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-10">
                          <h3 className="text-xl font-black text-white mb-2">{selectedImage.type}</h3>
                          <div className="flex items-center gap-4 text-xs font-bold text-white/60">
                              <div className="flex items-center gap-1.5"><Calendar size={12} /> {selectedImage.date}</div>
                              {selectedImage.note && <div className="flex items-center gap-1.5"><FileText size={12} /> {selectedImage.note}</div>}
                          </div>
                      </div>
                      <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white"
                      >
                        <IconCheck size={24} />
                      </button>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      <button 
        onClick={() => window.close()}
        className="absolute top-12 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-slate-800 hover:bg-slate-900 hover:text-white transition-all z-[100] border border-white/40 shadow-lg"
      >
        <ChevronRight size={20} className="rotate-180" strokeWidth={2.5} />
      </button>
    </div>
  );
};
