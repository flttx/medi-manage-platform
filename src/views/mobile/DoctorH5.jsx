import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  Calendar, 
  Users, 
  Settings, 
  Scan, 
  Plus, 
  Search, 
  ChevronRight, 
  Clock,
  Camera,
  Activity,
  User,
  Check as IconCheck,
  Brain,
  Sparkles,
  Zap,
  RotateCcw,
  Bell,
  Box,
  Mic,
  MicOff
} from 'lucide-react';
import { RegionContext } from '../../contexts/RegionContext';
import { NewMedicalRecordForm } from '../../components/Forms';

const IconSearch = ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

export const DoctorH5 = () => {
  const { 
    region, t, i18n, appointments, patients, imagingData, 
    setImagingData, updateAppointment, medicalRecords, setMedicalRecords,
    treatmentPlans, setTreatmentPlans, labOrders // Get labOrders
  } = useContext(RegionContext);
  const [activeTab, setActiveTab] = useState('schedule');
  const [activeSession, setActiveSession] = useState(null);
  const [showImageMode, setShowImageMode] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [island, setIsland] = useState({ show: false, text: '' });
  const [notifications, setNotifications] = useState([]); 
  const [isListening, setIsListening] = useState(false); // Voice AI State
// Local state for mobile notifications
  const [shutterEffect, setShutterEffect] = useState(false);
  const [cameraMode, setCameraMode] = useState('Intraoral'); // Intraoral, Extraoral, X-Ray
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [activeAISuggestions, setActiveAISuggestions] = useState([
    { id: 1, type: 'finding', text: 'Findings: Deep caries on #36 Distal', icon: <Activity size={12} className="text-amber-500" /> },
    { id: 2, type: 'plan', text: 'Suggest: Consider Endodontic consultation', icon: <Zap size={12} className="text-indigo-500" /> },
    { id: 3, type: 'alert', text: 'Alert: Patient has history of latex allergy', icon: <Zap size={12} className="text-rose-500" /> }
  ]);

  const cameraModes = [
    { id: 'Intraoral', label: '口内照' },
    { id: 'Extraoral', label: '面部照' },
    { id: 'X-Ray', label: 'X光片' }
  ];

  // Helper for desktop communication (mock if not exists in context for H5)
  const notifyDesktop = (data) => {
     const bc = new BroadcastChannel('region_state_sync');
     bc.postMessage({ type: 'NOTIFY_DESKTOP', ...data });
     bc.close();
  };

  // Effect to listen for Lab Orders Shipping
  React.useEffect(() => {
     const shipped = labOrders.filter(o => o.status === 'shipping');
     if (shipped.length > 0) {
        // Mock: push the latest shipped order to notifications if not already there
        const latest = shipped[shipped.length - 1];
        setNotifications(prev => {
            if (prev.find(n => n.id === latest.id)) return prev;
            // Trigger Island Notification
            triggerIsland(`Lab Order Shipped: ${latest.patientName}`);
            return [{ id: latest.id, title: 'Lab Order Shipped', text: `For ${latest.patientName} (${latest.type})`, type: 'lab' }, ...prev];
        });
     }
  }, [labOrders]);

  const triggerIsland = (text) => {
      setIsland({ show: true, text });
      setTimeout(() => setIsland({ show: false, text: '' }), 3000);
  };

  const startVisit = (app) => {
      updateAppointment(app.id, { status: 'in-progress' });
      setActiveSession(app);
  };

  const finishVisit = () => {
      updateAppointment(activeSession.id, { status: 'completed' });
      setActiveSession(null);
      triggerIsland(t('mobile.doctor.island.sessionCompleted'));
  };

  const handleSaveRecord = (record) => {
      const recToAdd = { 
          ...record, 
          id: Date.now(), 
          patientId: activeSession?.patientId || patients[0].id, 
          sessionId: activeSession?.id,
          dr: t('mobile.doctor.header.doctorName')
      };
      setMedicalRecords([recToAdd, ...medicalRecords]);
      notifyDesktop({ 
          event: 'RECORD_SAVED', 
          patient: activeSession?.patient || patients[0].name,
          type: record.type 
      });
      triggerIsland(t('mobile.doctor.island.recordSynced'));
      setShowRecordForm(false);
  };

  const handleProposePlan = (planId) => {
      setTreatmentPlans(prev => prev.map(p => p.id === planId ? { ...p, status: 'proposing' } : p));
      notifyDesktop({ event: 'PLAN_PROPOSED', planId });
      triggerIsland(t('mobile.doctor.island.planPushed'));
  };

   const captureImage = () => {
      setShutterEffect(true);
      setTimeout(() => setShutterEffect(false), 150);
      
      const newImg = {
          id: Date.now(),
          patientId: activeSession?.patientId || patients[0].id,
          type: cameraMode,
          url: cameraMode === 'X-Ray' 
            ? 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=60'
            : 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=60',
          date: new Date().toLocaleDateString(),
          note: `Captured via Mobile (${cameraMode})`
      };
      setImagingData([...imagingData, newImg]);
      notifyDesktop({ 
          event: 'IMAGE_CAPTURED', 
          url: newImg.url, 
          patient: activeSession?.patient || patients[0].name,
          mode: cameraMode
      });
      triggerIsland(t('mobile.doctor.island.imageUploaded'));
  };

  const handleVoiceInput = () => {
      setIsListening(true);
      // Simulate listening
      setTimeout(() => {
          setIsListening(false);
          triggerIsland('AI Note: "Caries on Tooth 36"');
          setNotifications(prev => [{ id: Date.now(), title: 'Voice Note', text: 'Caries detected on #36 (AI Transcribed)', type: 'voice', icon: <Mic size={20} className="text-indigo-500" /> }, ...prev]);
      }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col font-sans max-w-md mx-auto shadow-2xl border-x border-slate-200 overflow-hidden select-none">
      {/* Dynamic Island Simulation */}
      <AnimatePresence>
          {island.show && (
              <motion.div 
                initial={{ y: -100, x: '-50%', scale: 0.5 }}
                animate={{ y: 12, x: '-50%', scale: 1 }}
                exit={{ y: -100, x: '-50%', scale: 0.5 }}
                className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] h-10 bg-slate-900 rounded-full flex items-center justify-center px-6 shadow-2xl border border-white/10"
              >
                  <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">{island.text}</span>
              </motion.div>
          )}
      </AnimatePresence>

      {/* Simulation Header */}
      <div className={`transition-all duration-700 ${activeSession ? 'bg-indigo-600 h-72' : 'bg-slate-900 h-64'} px-6 pt-12 rounded-b-[4rem] shadow-2xl relative z-20 overflow-hidden`}>
         {/* Background pattern for active session */}
         {activeSession && (
           <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,white_0%,transparent_70%)]" />
           </div>
         )}

         <div className="flex justify-between items-center mb-10 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-white border border-white/10 shadow-lg backdrop-blur-md">
                   {activeSession ? (
                     <div className="relative">
                       <Activity size={28} strokeWidth={2.5} />
                       <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-indigo-600 animate-pulse" />
                     </div>
                   ) : <Activity size={28} strokeWidth={2.5} />}
               </div>
               <div>
                  <h1 className="text-xl font-black text-white tracking-tight leading-none">{activeSession ? t('mobile.doctor.header.inSession') : t('mobile.doctor.header.doctorName')}</h1>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">{activeSession ? activeSession.patient : t('mobile.doctor.header.specialist')}</p>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/5 active:scale-95 transition-all relative">
                   <Bell size={22} />
                   {notifications.length > 0 && <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border border-indigo-900" />}
               </button>
               <button className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/5 active:scale-95 transition-all"><IconSearch size={22} /></button>
            </div>
         </div>

         {activeSession ? (
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3 animate-in slide-in-from-top duration-500 delay-100">
                  <button onClick={() => setShowImageMode(true)} className="flex-1 py-5 bg-white text-indigo-600 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-xl shadow-indigo-900/20"><Camera size={14} /> {t('mobile.doctor.header.photo')}</button>
                  <button onClick={() => setShowRecordForm(true)} className="flex-1 py-5 bg-white/10 text-white rounded-[1.8rem] border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/20 transition-all backdrop-blur-md shadow-inner"><ClipboardList size={14} /> {t('mobile.doctor.header.record')}</button>
              </div>
              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-indigo-600 flex items-center justify-center text-[10px] font-black">{i}</div>)}
                </div>
                <button 
                  onClick={() => setShowAIAssistant(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-all group"
                >
                  <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <Brain size={16} className="text-indigo-300" />
                  </motion.div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{t('mobile.doctor.ai.triggers')}</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </button>
              </div>
              <button onClick={finishVisit} className="w-full py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-rose-900/20 active:scale-95 transition-all">{t('mobile.doctor.header.finish')}</button>
            </div>
         ) : (
            <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="p-5 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-xl group" onClick={handleVoiceInput}>
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{t('mobile.doctor.dashboard.efficiency')}</p>
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60"><Mic size={12} /></div>
                    </div>
                    <div className="flex items-end gap-2">
                        <p className="text-2xl font-black text-white tracking-tighter">Voice</p>
                        <span className="text-[8px] font-black text-emerald-400 mb-1">AI Ready</span>
                    </div>
                </div>
                <div className="p-5 bg-indigo-500/20 rounded-[2.5rem] border border-indigo-400/20 backdrop-blur-xl">
                    <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1.5">{t('mobile.doctor.dashboard.target')}</p>
                    <div className="flex items-end gap-2">
                        <p className="text-2xl font-black text-white tracking-tighter">18/24</p>
                    </div>
                </div>
            </div>
         )}

         <button 
           onClick={() => window.close()}
           className="absolute top-12 right-6 text-white/20 hover:text-white transition-colors z-20"
         >
           <Plus size={24} className="rotate-45" />
         </button>
      </div>

      <main className="flex-1 overflow-y-auto pb-24 px-6 space-y-6 pt-8 custom-scrollbar bg-slate-50/50">
        {activeTab === 'schedule' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('mobile.doctor.queue.title')}</h3>
                <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live</span>
            </div>

            <div className="space-y-4">
                {appointments.map((app, i) => (
                    <motion.div 
                      key={app.id || i}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 rounded-[2.5rem] border transition-all ${app.status === 'in-progress' ? 'bg-primary/5 border-primary/20 shadow-xl shadow-primary/10' : 'bg-white border-slate-200 shadow-sm'}`}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-14 items-center flex flex-col justify-center border-r border-slate-100 pr-4 ${app.status === 'completed' ? 'opacity-30' : ''}`}>
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{app.time.split(':')[0]}</span>
                                <span className="text-base font-black text-slate-800 tracking-tighter leading-none">{app.time.split(':')[1]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-black text-slate-800 truncate ${app.status === 'completed' ? 'line-through opacity-30 shadow-none' : ''}`}>{app.patient}</h4>
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-widest rounded-lg">{app.type}</span>
                                    {app.status === 'in-progress' && <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg animate-pulse">In Progress</span>}
                                    {app.status === 'confirmed' && <span className="px-2 py-0.5 bg-indigo-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg">Arrived</span>}
                                </div>
                            </div>
                        </div>
                        
                        {!activeSession && app.status !== 'completed' && (
                            <button 
                                onClick={() => startVisit(app)}
                                className="w-full py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-200 active:bg-primary transition-colors"
                            >
                                {t('mobile.doctor.queue.start')}
                            </button>
                        )}
                        
                        {app.status === 'completed' && (
                            <div className="flex items-center justify-center gap-2 py-2 opacity-30">
                                <IconCheck size={14} className="text-emerald-500" strokeWidth={3} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Session Record Saved</span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Helper Section */}
            {!activeSession && (
                <div className="p-8 bg-indigo-600 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="relative z-10">
                        <h4 className="text-base font-black mb-2">AI Report Helper</h4>
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-6 leading-relaxed">System has summarized 4 clinical findings for Dr. Sterling</p>
                        <button className="px-5 py-2.5 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Review</button>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                 <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('mobile.doctor.tasks.title')}</h3>
                    <div className="flex gap-2">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-500 text-[8px] font-black rounded-lg uppercase">Clinical</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[8px] font-black rounded-lg uppercase">Admin</span>
                    </div>
                </div>
                
                <div className="space-y-4">
                    {[
                        ...notifications.map(n => ({ title: n.title + ': ' + n.text, date: 'Just now', priority: 'high', icon: <Box size={20} className="text-amber-500" /> })),
                        { title: t('mobile.doctor.tasks.reviewPlan') || 'Review Plan: Mr. Chen', date: 'Due 2h', priority: 'high' },
                        { title: t('mobile.doctor.tasks.orthoFinalize') || 'Ortho Retainer Finalize', date: 'Due 5h', priority: 'medium' },
                        { title: t('mobile.doctor.tasks.centerFeedback') || 'Center Feedback', date: 'Tomorrow', priority: 'low' },
                    ].map((task, i) => (
                        <motion.div key={i} whileTap={{ scale: 0.98 }} className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-[1.2rem] flex items-center justify-center ${task.priority === 'high' ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'}`}>
                                    {task.icon || <ClipboardList size={20} />}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-800 tracking-tight">{task.title}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{task.date}</p>
                                </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-slate-200'}`} />
                        </motion.div>
                    ))}
                </div>
                
                <div className="p-10 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center opacity-40">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4"><Plus size={24} /></div>
                    <p className="text-[10px] font-black uppercase tracking-widest">{t('mobile.doctor.tasks.add')}</p>
                </div>
            </div>
        )}

        {activeTab === 'patients' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                 <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('mobile.doctor.patient.title')}</h3>
                    <div className="px-3 py-1 bg-indigo-50 text-indigo-500 text-[8px] font-black rounded-lg uppercase">Cloud Sync</div>
                </div>

                {activeSession ? (
                    <div className="space-y-8">
                        {/* Patient Quick Info */}
                        <div className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-6">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeSession.patient}`} className="w-20 h-20 rounded-[2rem] bg-slate-50 border border-slate-100" alt="" />
                            <div>
                                <h4 className="text-xl font-black text-slate-800 tracking-tight">{activeSession.patient}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: {activeSession.patientId || 'P2026001'}</p>
                                <div className="flex gap-2 mt-3">
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-500 text-[8px] font-black rounded uppercase">Low Risk</span>
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-500 text-[8px] font-black rounded uppercase">Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* Treatment Plans Coordination */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Treatment Plans</h3>
                            {treatmentPlans.filter(p => p.patientId === (activeSession.patientId || 'P2026001')).map(plan => (
                                <div key={plan.id} className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-black text-slate-800 tracking-tight">{t(plan.titleKey || plan.title)}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{plan.date}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${plan.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{plan.status}</div>
                                    </div>
                                    
                                    {plan.status === 'proposing' && (
                                        <div className="py-2 px-4 bg-amber-50 rounded-xl flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                            <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Waiting for patient approval</p>
                                        </div>
                                    )}

                                    {plan.status === 'active' && (
                                        <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-emerald-500 h-full w-[65%]" />
                                        </div>
                                    )}

                                    {plan.status !== 'active' && plan.status !== 'proposing' && (
                                        <button 
                                            onClick={() => handleProposePlan(plan.id)}
                                            className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Activity size={12} /> {t('mobile.doctor.patient.pushPlan')}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center space-y-4 bg-white rounded-[3.5rem] border border-slate-100 opacity-60">
                         <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300"><Users size={32} /></div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Please start a session to<br/>view patient clinical data</p>
                    </div>
                )}
            </div>
        )}
      </main>

      {/* Navigation Bar */}
      <nav className="h-24 bg-white/80 backdrop-blur-2xl border-t border-slate-100 flex items-center justify-around px-4 pb-6 z-50 fixed bottom-0 left-0 right-0 max-w-md mx-auto">
        {[
          { id: 'schedule', icon: <Calendar size={22} />, label: t('mobile.doctor.nav.schedule') },
          { id: 'tasks', icon: <ClipboardList size={22} />, label: t('mobile.doctor.nav.tasks') },
          { id: 'patients', icon: <User size={22} />, label: t('mobile.doctor.nav.cases') },
          { id: 'settings', icon: <Activity size={22} />, label: t('mobile.doctor.nav.system') }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 transition-all relative group ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-300'}`}
          >
            <motion.div 
                whileTap={{ scale: 0.8 }}
                className={`w-12 h-10 rounded-2xl flex items-center justify-center transition-all ${activeTab === tab.id ? 'bg-indigo-50 shadow-inner' : ''}`}
            >
                 {tab.icon}
            </motion.div>
            <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
            {activeTab === tab.id && <motion.div layoutId="doc-nav-glow" className="absolute -bottom-1 w-1 h-1 bg-indigo-600 rounded-full shadow-[0_0_10px_2px_rgba(79,70,229,0.5)]" />}
          </button>
        ))}
      </nav>

      {/* Camera Simulator Overlay */}
      <AnimatePresence>
        {showImageMode && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black"
          >
             {/* Flash Effect */}
             <AnimatePresence>
                 {shutterEffect && (
                     <motion.div 
                         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                         className="absolute inset-0 bg-white z-[110]"
                     />
                 )}
             </AnimatePresence>

             <div className="absolute inset-0 flex flex-col pt-16 pb-12 px-6">
                <div className="flex justify-between items-center mb-8">
                    <button onClick={() => setShowImageMode(false)} className="text-white/40 hover:text-white"><ChevronRight size={24} className="rotate-180" /></button>
                    <div className="flex gap-4">
                        <div className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/5">Auto Focus</div>
                        <div className="px-3 py-1 bg-indigo-500 rounded-full text-[9px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-500/50">High Res</div>
                    </div>
                </div>

                <div className="flex-1 rounded-[3.5rem] overflow-hidden border border-white/10 relative group">
                    <img 
                      src={cameraMode === 'X-Ray' 
                        ? "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80"
                        : "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80"
                      } 
                      className="w-full h-full object-cover transition-all duration-500" 
                      alt="" 
                    />
                    
                    {/* Mode Selector */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                        {cameraModes.map(mode => (
                          <button 
                            key={mode.id}
                            onClick={() => setCameraMode(mode.id)}
                            className={`text-[10px] font-black uppercase tracking-widest transition-all ${cameraMode === mode.id ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
                          >
                            {mode.label}
                          </button>
                        ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-32 h-32 border border-white/20 rounded-2xl relative"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-white/40 rounded-full" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-white/40 rounded-full" />
                        </motion.div>
                    </div>
                </div>

                <div className="mt-12 flex justify-center items-center gap-12">
                     <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/40"><ChevronRight size={24} className="rotate-180" /></div>
                     <button 
                         onClick={captureImage}
                         className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center group active:scale-90 transition-all"
                     >
                         <div className="w-16 h-16 bg-white rounded-full scale-90 group-hover:scale-100 transition-transform" />
                     </button>
                     <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 overflow-hidden">
                         <img src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=100&q=40" className="w-full h-full object-cover opacity-60" alt="" />
                     </div>
                </div>
                
                <p className="text-center text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mt-8">Dental AI Capture Engine v2.4</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Medical Record Form Overlay */}
      <AnimatePresence>
         {showRecordForm && (
           <motion.div 
             initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
             className="fixed inset-0 z-[110] bg-white flex flex-col"
           >
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                 <NewMedicalRecordForm 
                     onSave={handleSaveRecord} 
                     onClose={() => setShowRecordForm(false)} 
                 />
              </div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Clinical AI Assistant Overlay */}
      <AnimatePresence>
        {showAIAssistant && (
          <div className="fixed inset-0 z-[120] flex items-end">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
               onClick={() => setShowAIAssistant(false)}
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full rounded-t-[3rem] p-8 shadow-2xl relative z-10 max-h-[85vh] flex flex-col"
            >
              <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100"><Sparkles size={24} /></div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">{t('mobile.doctor.ai.title')}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('mobile.doctor.ai.subtitle')}</p>
                    </div>
                </div>
                <button onClick={() => setShowAIAssistant(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><Plus size={20} className="rotate-45" /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pb-10 custom-scrollbar">
                {activeAISuggestions.map((sug) => (
                    <motion.div 
                        key={sug.id} 
                        initial={{ x: 20, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }}
                        className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-colors"
                    >
                        <div className="flex gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                                {sug.icon}
                            </div>
                            <p className="text-xs font-bold text-slate-700 leading-relaxed">{sug.text}</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">{t('common.ignore') || 'Ignore'}</button>
                            <button 
                                onClick={() => {
                                    triggerIsland(t('mobile.doctor.island.aiApplied') || 'AI Suggestion Applied');
                                    setShowAIAssistant(false);
                                }}
                                className="flex-1 py-3 bg-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-50 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                            >
                                <IconCheck size={12} /> {t('common.apply') || 'Apply'}
                            </button>
                        </div>
                    </motion.div>
                ))}

                <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4 animate-pulse">
                        <RotateCcw size={20} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('mobile.doctor.ai.refresh')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Voice Listening Overlay */}
      <AnimatePresence>
        {isListening && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center text-white"
           >
              <div className="relative mb-8">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-50 animate-pulse" />
                  <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center relative z-10 shadow-2xl shadow-indigo-500/50">
                      <Mic size={40} />
                  </div>
                  {/* Ripples */}
                  {[1, 2, 3].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                        className="absolute inset-0 border border-indigo-400 rounded-full z-0"
                      />
                  ))}
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Listening...</h3>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Speak your clinical notes</p>
              
              <div className="mt-12 flex gap-1 h-8 items-end">
                 {[1,2,3,4,5,4,3,2,1].map((h, i) => (
                    <motion.div 
                       key={i}
                       animate={{ height: [10, h*8, 10] }}
                       transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                       className="w-1.5 bg-indigo-400 rounded-full" 
                    />
                 ))}
              </div>
              
              <button onClick={() => setIsListening(false)} className="mt-16 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:bg-white/20 hover:text-white transition-all">
                  <MicOff size={24} />
              </button>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const IconPlus = ({ size, strokeWidth, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
