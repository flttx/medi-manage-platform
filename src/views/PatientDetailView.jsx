import React, { useState, useEffect, useContext } from 'react';
import { 
  Search,
  Plus,
  ChevronRight,
  Settings,
  Trash2,
  Share,
  MessageSquare,
  ClipboardList,
  UserCircle,
  Database,
  CreditCard,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Box
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RegionContext } from '../contexts/RegionContext';
import { useToast } from '../contexts/ToastContext';
import { DataPlaceholder } from '../components/UI';

export const PatientDetailView = () => {
  const { 
    region, t, selectedPatient, setActiveView, setSelectedPatient, 
    globalModal, setGlobalModal, medicalRecords, patients 
  } = useContext(RegionContext);
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('clinical');
  const [searchQuery, setSearchQuery] = useState('');

  if (!selectedPatient) return <DataPlaceholder title="No Patient Selected" />;

  // Filter patients for the sidebar switch list
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentIndex = patients.findIndex(p => p.id === selectedPatient.id);
  
  const switchPatient = (dir) => {
     if (patients.length === 0) return;
     const nextIdx = (currentIndex + dir + patients.length) % patients.length;
     setSelectedPatient(patients[nextIdx]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') switchPatient(-1);
      if (e.key === 'ArrowRight') switchPatient(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPatient, patients]);

  const handleSelectPatient = (p) => {
    setSelectedPatient(p);
    setSearchQuery('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-0 h-[calc(100vh-120px)] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      {/* Left Patient Navigation Sidebar */}
      <div className="w-80 flex flex-col border-r border-slate-50 bg-slate-50/20">
         <div className="p-6 border-b border-slate-50 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{region === 'cn' ? '接诊列表' : 'Patient Queue'}</h3>
               <button onClick={() => setActiveView('patientManage')} className="p-1 px-2 rounded-lg bg-slate-100 text-[9px] font-black text-slate-400 hover:text-primary transition-all uppercase">{region === 'cn' ? '返回列表' : 'Exit'}</button>
            </div>
            <div className="relative">
               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
               <input 
                 placeholder={region === 'cn' ? '快捷切换患者...' : 'Quick Switch...'}
                 className="w-full pl-9 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold outline-none shadow-sm focus:ring-2 focus:ring-primary/10 transition-all"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
            {filteredPatients.map((p, i) => (
               <div 
                 key={i} 
                 onClick={() => handleSelectPatient(p)}
                 className={`flex items-center gap-4 p-4 rounded-[1.5rem] cursor-pointer transition-all border-2 ${
                   p.id === selectedPatient.id 
                   ? 'bg-white border-primary/20 shadow-xl shadow-slate-200/30' 
                   : 'hover:bg-white border-transparent text-slate-500'
                 }`}
               >
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} className={`w-10 h-10 rounded-xl bg-white shadow-sm border ${p.id === selectedPatient.id ? 'border-primary/20' : 'border-white'}`} alt="" />
                  <div className="flex-1 min-w-0">
                     <p className={`text-[13px] font-black truncate leading-none mb-1.5 ${p.id === selectedPatient.id ? 'text-primary' : 'text-slate-800'}`}>{p.name}</p>
                     <p className="text-[10px] font-bold text-slate-400">ID: {p.id}</p>
                  </div>
                  {p.id === selectedPatient.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                  )}
               </div>
            ))}
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white z-10 sticky top-0">
          <div className="flex items-center gap-6 p-2 pr-8 bg-slate-50/50 rounded-2xl border border-slate-100/50 shadow-inner">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPatient.name}`} className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-white" alt="" />
             <div>
                <div className="flex items-center gap-3 mb-1.5">
                   <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">{selectedPatient.name}</h2>
                   <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded uppercase tracking-tighter">{selectedPatient.risk || 'Low'} Risk</span>
                      {selectedPatient.status === 'pending' ? (
                         <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-[8px] font-black rounded uppercase tracking-tighter animate-pulse">Pending Review</span>
                      ) : (
                         <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[8px] font-black rounded uppercase tracking-tighter">Active Case</span>
                      )}
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">ID: {selectedPatient.id}</p>
                   {selectedPatient.status === 'confirmed' && (
                      <div className="hidden sm:flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">In System</span>
                      </div>
                   )}
                </div>
             </div>
          </div>

         <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl">
               <button onClick={() => switchPatient(-1)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-white transition-all text-[10px] font-black flex items-center gap-1">
                  <ChevronRight size={14} className="rotate-180" /> {region === 'cn' ? '上一个' : 'PREV'}
               </button>
               <div className="w-px h-4 bg-slate-200 mx-1 self-center" />
               <button onClick={() => switchPatient(1)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-white transition-all text-[10px] font-black flex items-center gap-1">
                  {region === 'cn' ? '下一个' : 'NEXT'} <ChevronRight size={14} />
               </button>
            </div>
            
            <div className="flex gap-2">
               <button onClick={() => showToast(t.systemSettings, 'info')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-400 hover:text-primary transition-all border border-slate-50"><Settings size={16} /></button>
               <button onClick={() => showToast(t.recycleBin, 'error')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-400 hover:text-rose-500 transition-all border border-slate-50"><Trash2 size={16} /></button>
               <button onClick={() => showToast(region === 'cn' ? '生成分享海报...' : 'Generating share poster...', 'success')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-400 hover:text-primary transition-all border border-slate-50"><Share size={16} /></button>
                {selectedPatient.status === 'pending' ? (
                   <button 
                     onClick={() => {
                        setSelectedPatient({ ...selectedPatient, status: 'confirmed' });
                        showToast(region === 'cn' ? '预约已通过审核' : 'Appointment Approved', 'success');
                     }} 
                     className="btn btn-primary text-xs px-6 py-2 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200 font-black tracking-tight"
                   >
                     {region === 'cn' ? '通过审核' : 'APPROVE'}
                   </button>
                ) : (
                   <button onClick={() => showToast(t.genPlan, 'success')} className="btn btn-primary text-xs px-6 py-2 bg-primary shadow-lg shadow-primary/20 font-black tracking-tight">+ {t.genPlan || 'Plan'}</button>
                )}
            </div>
         </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/10">
         <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-3">
             <div className="card p-8 border border-slate-100 shadow-xl shadow-slate-200/30 bg-white space-y-8 rounded-[2rem] sticky top-0">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none border-l-2 border-primary pl-2">{region === 'cn' ? '就诊备注' : 'Clinical Notes'}</h4>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">Patient is sensitive to cold on lower left molars. Prefers am appointments.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none border-l-2 border-slate-200 pl-2">{t.contact || 'Direct Contact'}</h4>
                   {[
                     { icon: <Phone size={14} />, label: t.contact, value: selectedPatient.phone },
                     { icon: <Mail size={14} />, label: t.email || 'Email', value: "lily@example.com" },
                     { icon: <MapPin size={14} />, label: region === 'cn' ? '常驻地' : 'Location', value: "California, USA" }
                   ].map((item, i) => (
                     <div key={i} className="group">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5">{item.label}</p>
                        <div className="flex items-center gap-3 text-slate-600">
                           <span className="p-2 bg-slate-50 rounded-lg group-hover:bg-primary/5 group-hover:text-primary transition-colors">{item.icon}</span>
                           <span className="text-xs font-black group-hover:text-primary transition-colors cursor-pointer truncate">{item.value}</span>
                        </div>
                     </div>
                   ))}
                </div>

                 <div className="pt-6 border-t border-slate-50">
                   <button className="w-full btn btn-primary py-4 rounded-2xl justify-center bg-primary shadow-xl shadow-primary/20 text-xs font-black uppercase tracking-widest active:scale-95 transition-all flex items-center gap-3" onClick={() => setActiveTab('messages')}>
                     <MessageSquare size={16} /> {t.startChat}
                   </button>
                </div>
             </div>
          </div>

          <div className="col-span-12 lg:col-span-9 space-y-6">
              <div className="flex items-center justify-between gap-4 mb-8 border-b border-slate-50 pb-1">
                 <div className="flex overflow-x-auto gap-2 scrollbar-hide pb-4 flex-1">
                    {[
                      { id: 'clinical', label: region === 'cn' ? '病历管理' : 'Medical Records', icon: <ClipboardList size={16} /> },
                      { id: 'profile', label: t.fullName, icon: <UserCircle size={16} /> },
                      { id: 'imaging', label: t.uploadImaging, icon: <Database size={16} /> },
                      { id: 'billing', label: t.financeManage, icon: <CreditCard size={16} /> },
                      { id: 'consent', label: t.consentForm, icon: <FileText size={16} /> },
                      { id: 'messages', label: t.messages, icon: <MessageSquare size={16} /> }
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-400 hover:text-slate-600'}`}
                      >
                        {tab.icon} {tab.label}
                      </button>
                    ))}
                 </div>
                 {activeTab === 'clinical' && (
                    <button 
                      onClick={() => setGlobalModal({ type: 'clinical' })}
                      className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/30 border-none mb-4"
                    >
                      <Plus size={16} /> {region === 'cn' ? '新增病历' : 'Add Case'}
                    </button>
                 )}
              </div>

             <div className="space-y-6">
                 {activeTab === 'clinical' && (
                   <div className="flex gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="w-[1.5px] bg-slate-100 rounded-full relative ml-32">
                          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-transparent h-60 rounded-full" />
                      </div>
                      
                      <div className="flex-1 space-y-16 pb-20">
                         {medicalRecords.filter(r => r.patientId === selectedPatient.id).map((record, i) => (
                           <div key={i} className="relative group">
                              <div className="absolute -left-[140px] top-6 flex flex-col items-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                  <span className="text-[11px] font-black text-slate-900 tabular-nums tracking-tighter">{record.date.split('.')[1]}.{record.date.split('.')[2]}</span>
                                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none bg-slate-50 px-1.5 py-0.5 rounded-md">{record.date.split('.')[0]}</span>
                              </div>
                              <div className="absolute -left-[54px] top-7 w-3 h-3 rounded-full bg-white border-2 border-slate-200 group-hover:border-primary group-hover:scale-125 transition-all z-10 shadow-sm" />
                              
                              <div className="card p-10 border-none shadow-xl shadow-slate-200/50 space-y-8 hover:translate-x-0 transition-all bg-white relative hover:shadow-2xl hover:shadow-slate-200/50">
                                 <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                                     <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center font-black text-lg shadow-none group-hover:scale-100 transition-all">
                                           0{record.i || i+1}
                                        </div>
                                        <div>
                                           <div className="flex items-center gap-3 mb-1.5">
                                              <h3 className="text-lg font-black text-slate-800 tracking-tight">{record.type}</h3>
                                              <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black rounded-lg uppercase tracking-widest">{record.dr}</span>
                                           </div>
                                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{record.plan || 'Diagnostic Observation'}</p>
                                        </div>
                                     </div>
                                     <div className="flex gap-2">
                                        <button onClick={() => setGlobalModal({ type: 'clinical', data: record })} className="p-2.5 rounded-xl bg-slate-50 text-slate-300 hover:text-slate-500 transition-all"><Settings size={18} /></button>
                                        <button className="p-2.5 rounded-xl bg-slate-50 text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={18} /></button>
                                     </div>
                                 </div>
                                 
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                       <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t.chiefComplaint}</h4>
                                       <p className="text-xs font-bold text-slate-600 leading-relaxed bg-slate-50/50 p-5 rounded-3xl border border-slate-100">{record.cc}</p>
                                    </div>
                                    <div className="space-y-3">
                                       <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t.diagnosis}</h4>
                                       <p className="text-xs font-bold text-slate-600 leading-relaxed bg-slate-50/50 p-5 rounded-3xl border border-slate-100">{record.dx}</p>
                                    </div>
                                 </div>

                                 {record.images && (
                                   <div className="pt-4 flex gap-4">
                                      {[1, 2].map(img => (
                                        <div key={img} className="w-24 h-24 rounded-2xl bg-slate-100 flex flex-col items-center justify-center gap-2 border border-slate-200/50 group/img cursor-pointer hover:border-primary/40 transition-all">
                                           <Database size={20} className="text-slate-300 group-hover/img:scale-110 transition-transform" />
                                           <span className="text-[8px] font-black text-slate-400 uppercase">Imaging</span>
                                        </div>
                                      ))}
                                      <div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:text-primary hover:border-primary transition-all cursor-pointer">
                                         <Plus size={20} />
                                      </div>
                                   </div>
                                 )}

                                  <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                     <div className="flex gap-3">
                                        <button onClick={() => showToast(t.aiDesign, 'success')} className="px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"><Box size={14} /> {t.aiDesign}</button>
                                        <button onClick={() => showToast(t.paymentNotice, 'info')} className="px-6 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-none transition-all active:scale-95 flex items-center gap-2 hover:bg-slate-100"><CreditCard size={14} /> {t.paymentNotice}</button>
                                     </div>
                                     <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-primary transition-all uppercase tracking-widest group/btn">
                                        {t.share}
                                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                     </button>
                                  </div>
                              </div>
                           </div>
                         ))}
                         
                         <div className="flex justify-center pt-8">
                            <button className="px-12 py-4 rounded-[2rem] bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:bg-slate-100 hover:text-slate-600 transition-all flex items-center gap-3">
                               <Clock size={16} /> Load History Records
                            </button>
                         </div>
                      </div>
                   </div>
                 )}
                 {activeTab === 'profile' && (
                  <div className="card p-12 border-none shadow-xl shadow-slate-200/50 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white rounded-[2.5rem] relative">
                     <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-16 rounded-3xl bg-slate-50 p-1 flex items-center justify-center">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPatient.name}`} className="w-full h-full rounded-2xl bg-white shadow-sm" alt="" />
                           </div>
                           <div>
                              <h2 className="text-2xl font-black text-slate-800">{selectedPatient.name}</h2>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Patient Registry • {selectedPatient.id}</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => setGlobalModal({ type: 'patient', data: selectedPatient })}
                          className="btn btn-primary bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all border-none"
                        >
                           <Plus size={16} /> {t.edit}
                        </button>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8">
                        {[
                           { label: "Full Name", value: selectedPatient.name },
                           { label: "Gender", value: t[selectedPatient.gender] || selectedPatient.gender },
                           { label: "Date of Birth", value: "1994.05.20" },
                           { label: "Phone", value: selectedPatient.phone },
                           { label: "Email", value: "lily@example.com" },
                           { label: "Occupation", value: "Designer" },
                           { label: "Emergency Contact", value: "John Smith (13800138000)" },
                           { label: "Allergy", value: "Penicillin" },
                           { label: "Insurance", value: "AIG Health Plus" }
                        ].map((item, i) => (
                           <div key={i} className="space-y-2 group">
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{item.label}</p>
                              <p className="text-sm font-black text-slate-700 p-4 rounded-2xl bg-slate-50/50 border border-transparent group-hover:border-primary/20 transition-all">{item.value}</p>
                           </div>
                        ))}
                     </div>
                  </div>
                )}
                {activeTab === 'imaging' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="aspect-square card p-2 bg-white border-none shadow-lg overflow-hidden group cursor-pointer">
                           <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center relative">
                              <Database size={24} className="text-slate-300 group-hover:scale-110 transition-transform" />
                              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                           </div>
                           <p className="mt-2 text-[9px] font-black text-slate-400 text-center uppercase tracking-tighter">Scan_{i}.jpg</p>
                        </div>
                     ))}
                     <div className="aspect-square card p-2 bg-slate-100/50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-primary transition-all cursor-pointer group">
                        <Plus size={24} className="text-slate-300 group-hover:text-primary" />
                        <span className="text-[9px] font-black text-slate-400 uppercase">{t.uploadImaging}</span>
                     </div>
                  </div>
                )}
                {activeTab === 'billing' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { label: 'Total Billed', value: '$2,840', color: 'text-slate-800' },
                          { label: 'Paid Amount', value: '$1,640', color: 'text-emerald-600' },
                          { label: 'Outstanding', value: '$1,200', color: 'text-rose-500' }
                        ].map((stat, i) => (
                          <div key={i} className="card p-6 border-none shadow-xl shadow-slate-200/50 bg-white rounded-3xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                          </div>
                        ))}
                     </div>
                     <div className="card overflow-hidden border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem]">
                        <table className="w-full text-left">
                           <thead className="bg-slate-50 border-b border-slate-100">
                              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                 <th className="p-5">Record ID</th>
                                 <th className="p-5">Treatment</th>
                                 <th className="p-5">Amount</th>
                                 <th className="p-5">Status</th>
                                 <th className="p-5 text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody className="text-xs font-bold text-slate-600 divide-y divide-slate-50">
                              {[
                                { id: 'INV-2026-001', type: 'Initial Cleaning', amount: '$120', status: 'Paid' },
                                { id: 'INV-2026-042', type: 'Root Canal Therapy', amount: '$1200', status: 'Pending' }
                              ].map((inv, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                  <td className="p-5 font-mono text-slate-400">{inv.id}</td>
                                  <td className="p-5 text-slate-800">{inv.type}</td>
                                  <td className="p-5 font-black text-slate-800">{inv.amount}</td>
                                  <td className="p-5">
                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{inv.status}</span>
                                  </td>
                                  <td className="p-5 text-right pr-6">
                                    <button onClick={() => setGlobalModal({ type: 'export' })} className="text-primary hover:underline">Receipt</button>
                                  </td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
                )}
                {activeTab === 'consent' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     {[
                       { title: 'General Consent', date: '2026.02.01', status: 'Signed' },
                       { title: 'Surgery Agreement', date: '2026.02.04', status: 'Pending' }
                     ].map((doc, i) => (
                        <div key={i} className="card p-6 bg-white border-none shadow-lg space-y-4 group cursor-pointer hover:shadow-2xl transition-all">
                           <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                              <FileText size={24} />
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-800">{doc.title}</p>
                              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Date: {doc.date}</p>
                           </div>
                           <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase ${doc.status === 'Signed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{doc.status}</span>
                        </div>
                     ))}
                  </div>
                )}
                {activeTab === 'messages' && (
                  <div className="card h-[600px] border-none shadow-2xl shadow-slate-200/60 bg-white rounded-[2.5rem] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">AI</div>
                            <div>
                               <p className="text-xs font-black text-slate-800">Support Assistant</p>
                               <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online</p>
                            </div>
                         </div>
                      </div>
                      <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50/20">
                         <div className="flex gap-4">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPatient.name}`} className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100" alt="" />
                            <div className="p-4 bg-white rounded-2xl rounded-tl-none shadow-sm border border-slate-100 max-w-[70%]">
                               <p className="text-xs font-bold text-slate-600">When should I come back for the checkup?</p>
                               <span className="text-[8px] font-black text-slate-300 uppercase mt-2 block">10:30 AM</span>
                            </div>
                         </div>
                         <div className="flex flex-row-reverse gap-4">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-primary/20">DR</div>
                            <div className="p-4 bg-primary text-white rounded-2xl rounded-tr-none shadow-xl shadow-primary/20 max-w-[70%]">
                               <p className="text-xs font-bold">In about 2 weeks. I've sent you the appointment slots via WeChat.</p>
                               <span className="text-[8px] font-black text-white/60 uppercase mt-2 block">10:32 AM</span>
                            </div>
                         </div>
                      </div>
                      <div className="p-6 bg-white border-t border-slate-50">
                         <div className="bg-slate-50 rounded-2xl p-2 flex items-center gap-2 border border-slate-100">
                            <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Plus size={18} /></button>
                            <input className="flex-1 bg-transparent border-none outline-none text-xs font-bold px-2 py-2" placeholder="Send clinical directions..." />
                            <button className="bg-primary text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all">Send</button>
                         </div>
                      </div>
                  </div>
                )}
             </div>
          </div>
         </div>
        </div>
      </div>
    </motion.div>
  );
};
