import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus,
  ChevronRight,
  Trash2,
  Share,
  ClipboardList,
  UserCircle,
  Database,
  CreditCard,
  FileText,
  Box,
  LayoutGrid,
  MessageSquare,
  CheckCircle,
  PanelRightOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RegionContext } from '../contexts/RegionContext';
import { useToast } from '../contexts/ToastContext';
import { DataPlaceholder } from '../components/UI';
import { ToothPositionSelect } from '../components/ToothPositionSelect';
import { formatCurrency } from '../utils/format';

// Sub-components
import { PatientSidebar } from './patient/PatientSidebar';
import { ClinicalTab } from './patient/ClinicalTab';
import { TreatmentPlansTab } from './patient/TreatmentPlansTab';
import { PerioTab } from './patient/PerioTab';
import { ImagingTab } from './patient/ImagingTab';
import { BillingTab } from './patient/BillingTab';
import { LabTab } from './patient/LabTab';
import { ConsentTab } from './patient/ConsentTab';
import { InfoSidebar } from './patient/InfoSidebar';
import { MessagesTab } from './patient/MessagesTab';
import { FollowupTab } from './patient/FollowupTab';
import { ProfileTab } from './patient/ProfileTab';
import { Diagnostic3DModel } from '../components/dental/Diagnostic3DModel';

export const PatientDetailView = ({ onApprove }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    region, t, selectedPatient: contextPatient, setActiveView, setSelectedPatient, 
    setGlobalModal, medicalRecords, patients,
    treatmentPlans, perioRecords, invoices
  } = useContext(RegionContext);
  const { showToast } = useToast();

  // Prioritize the patient matching the URL ID to ensure immediate UI update
  // while the context syncs in the background
  const selectedPatient = (id ? patients.find(p => p.id === id) : null) || contextPatient;

  useEffect(() => {
    if (id && selectedPatient && (!contextPatient || contextPatient.id !== id)) {
        setSelectedPatient(selectedPatient);
    }
  }, [id, selectedPatient, contextPatient, setSelectedPatient]);
  
  const [activeTab, setActiveTab] = useState('clinical');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [infoSidebarOpen, setInfoSidebarOpen] = useState(true);
  const [toothModalVisible, setToothModalVisible] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [selectedToothFilter, setSelectedToothFilter] = useState(null);

  const [patientTeeth, setPatientTeeth] = useState([
    { id: 11, status: 'caries' }, 
    { id: 21, status: 'filling' }, 
    { id: 36, status: 'implant' }
  ]); 

  if (!selectedPatient) return <DataPlaceholder title={t('patient.noPatientSelected')} />;

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentIndex = patients.findIndex(p => p.id === selectedPatient.id);
  
  const switchPatient = (dir) => {
     if (patients.length === 0) return;
     const nextIdx = (currentIndex + dir + patients.length) % patients.length;
     navigate(`/patients/detail/${patients[nextIdx].id}`);
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
    navigate(`/patients/detail/${p.id}`);
    setSearchQuery('');
  };

  const patientInvoices = invoices.filter(inv => inv.patientId === selectedPatient.id);
  const totalPaid = patientInvoices.reduce((sum, inv) => inv.status === 'Paid' ? sum + inv.amount : sum, 0);
  const totalOutstanding = patientInvoices.reduce((sum, inv) => inv.status === 'Pending' ? sum + inv.amount : sum, 0);
  const planTotal = treatmentPlans.filter(p => p.patientId === selectedPatient.id).reduce((sum, p) => sum + p.totalCost, 0);
  const outstandingDisplay = totalOutstanding > 0 ? totalOutstanding : Math.max(0, planTotal - totalPaid);

  const generateAISummary = () => {
    let summary = t('ai.patternPeriodontitis', { tooth: 36 });
    
    if (outstandingDisplay > 5000) {
      summary += t('ai.financialAlert', { amount: formatCurrency(outstandingDisplay, region === 'zh-CN' ? 'CN' : 'US') });
    }
    
    const activePlans = treatmentPlans.filter(p => p.patientId === selectedPatient.id && p.status === 'active');
    if (activePlans.length > 0) {
      summary += t('ai.activePlans', { count: activePlans.length });
    }
    
    return summary;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-0 h-full bg-white rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
      <PatientSidebar 
        sidebarOpen={sidebarOpen}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredPatients={filteredPatients}
        handleSelectPatient={handleSelectPatient}
      />

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="p-4 lg:p-6 border-b border-slate-50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white z-10 sticky top-0">
          <div className="flex items-center gap-3 lg:gap-6">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-primary transition-all lg:flex xl:hidden"
            >
              <ChevronRight size={16} className={`transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className="flex items-center gap-3 lg:gap-6 p-2 pr-4 lg:pr-8 bg-slate-50/50 rounded-xl lg:rounded-2xl border border-slate-100/50 shadow-inner">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPatient.name}`} className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-white shadow-sm border border-white" alt="" />
               <div>
                  <div className="flex items-center gap-2 lg:gap-3 mb-1.5 flex-wrap">
                     <h2 className="text-base lg:text-xl font-black text-slate-800 tracking-tight leading-none truncate max-w-[150px] lg:max-w-none">{selectedPatient.name}</h2>
                     <div className="flex gap-2">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded uppercase tracking-tighter">{t(`risk.${(selectedPatient.risk || 'Low').toLowerCase()}`)} {t('patient.risk')}</span>
                        {selectedPatient.status === 'pending' ? (
                           <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-[8px] font-black rounded uppercase tracking-tighter animate-pulse">{t('status.pending')}</span>
                        ) : (
                           <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[8px] font-black rounded uppercase tracking-tighter">{t('patient.activeCase')}</span>
                        )}
                     </div>
                  </div>
                   <div className="flex items-center gap-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('patient.id')}: {selectedPatient.id}</p>
                     {selectedPatient.status === 'confirmed' && (
                        <div className="hidden sm:flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('patient.inSystem')}</span>
                        </div>
                     )}
                  </div>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4 flex-wrap">
            <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl">
               <button onClick={() => switchPatient(-1)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-white transition-all text-[10px] font-black flex items-center gap-1">
                  <ChevronRight size={14} className="rotate-180" /> <span className="hidden md:inline">{t('common.prev')}</span>
               </button>
               <div className="w-px h-4 bg-slate-200 mx-1 self-center" />
               <button onClick={() => switchPatient(1)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-white transition-all text-[10px] font-black flex items-center gap-1">
                  <span className="hidden md:inline">{t('common.next')}</span> <ChevronRight size={14} />
               </button>
            </div>
            
            <div className="flex gap-2">
               <button onClick={() => showToast(t('common.error'), 'error')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-400 hover:text-rose-500 transition-all border border-slate-50"><Trash2 size={16} /></button>
               <button onClick={() => showToast(t('ai.analyzing'), 'info')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-400 hover:text-primary transition-all border border-slate-50"><Share size={16} /></button>
                {selectedPatient.status === 'pending' ? (
                   <button onClick={() => onApprove(selectedPatient.id)} className="btn btn-primary text-xs px-6 py-2 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200 font-black tracking-tight">{t('common.approve')}</button>
                ) : null}
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden bg-slate-50/10 relative">
          <div className={`flex-1 flex flex-col overflow-hidden relative ${activeTab === 'messages' ? '' : 'overflow-y-auto custom-scrollbar p-4 lg:p-8'}`}>
          <div className={`w-full h-full flex flex-col ${activeTab === 'messages' ? 'p-4 lg:p-8' : ''}`}>
               {/* Tabs */}
               <div className="flex items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4 shrink-0">
                 <div className="flex overflow-x-auto gap-2 scrollbar-hide flex-1">
                    {[
                      { id: 'clinical', label: t('modules.clinicalManage'), icon: <ClipboardList size={16} /> },
                      { id: 'plans', label: t('treatmentPlan.title'), icon: <Box size={16} /> },
                      { id: 'followup', label: t('followup.title'), icon: <CheckCircle size={16} /> },
                      { id: 'perio', label: t('perio.title'), icon: <LayoutGrid size={16} /> },
                      { id: 'threed', label: t('modules.threed'), icon: <Box size={16} /> },
                      { id: 'lab', label: t('modules.labManage'), icon: <Box size={16} /> },
                      { id: 'profile', label: t('patient.detail'), icon: <UserCircle size={16} /> },
                      { id: 'imaging', label: t('imaging.center'), icon: <Database size={16} /> },
                      { id: 'billing', label: t('billing.title'), icon: <CreditCard size={16} /> },
                      { id: 'consent', label: t('consent.title'), icon: <FileText size={16} /> },
                      { id: 'messages', label: t('common.messages'), icon: <MessageSquare size={16} /> }
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'}`}
                      >
                        {tab.icon} <span className="truncate">{tab.label}</span>
                      </button>
                    ))}
                 </div>
               </div>

               {/* Content Area */}
               <div className={`flex-1 ${activeTab === 'messages' ? 'h-0 overflow-hidden' : ''}`}>
                  {activeTab === 'clinical' && (
                     <ClinicalTab 
                         selectedToothFilter={selectedToothFilter}
                         setSelectedToothFilter={setSelectedToothFilter}
                     />
                  )}
                  {activeTab === 'plans' && (
                     <TreatmentPlansTab 
                         compareMode={compareMode}
                         setCompareMode={setCompareMode}
                         selectedPlans={selectedPlans}
                         setSelectedPlans={setSelectedPlans}
                     />
                  )}
                  {activeTab === 'lab' && <LabTab />}
                  {activeTab === 'profile' && <ProfileTab />}
                  {activeTab === 'imaging' && <ImagingTab />}
                  {activeTab === 'billing' && (
                     <BillingTab 
                         outstandingDisplay={outstandingDisplay}
                         totalPaid={totalPaid}
                         patientInvoices={patientInvoices}
                     />
                  )}
                  {activeTab === 'perio' && <PerioTab />}
                  {activeTab === 'threed' && (
                     <div className="h-full min-h-[500px] animate-in zoom-in duration-700">
                        <Diagnostic3DModel activeToothId={selectedToothFilter || 36} />
                     </div>
                  )}
                  {activeTab === 'consent' && <ConsentTab />}
                  {activeTab === 'messages' && <MessagesTab />}
                  {activeTab === 'followup' && <FollowupTab />}
               </div>
            </div>
          </div>

          <InfoSidebar 
            infoSidebarOpen={infoSidebarOpen}
            setInfoSidebarOpen={setInfoSidebarOpen}
            selectedToothFilter={selectedToothFilter}
            setSelectedToothFilter={setSelectedToothFilter}
            patientTeeth={patientTeeth}
            setToothModalVisible={setToothModalVisible}
            outstandingDisplay={outstandingDisplay}
            generateAISummary={generateAISummary}
            setActiveTab={setActiveTab}
          />

          {!infoSidebarOpen && (
            <button 
              onClick={() => setInfoSidebarOpen(true)}
              className="absolute right-6 bottom-6 flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-indigo-100/50 text-slate-500 hover:text-primary hover:scale-105 transition-all group z-40"
            >
              <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <PanelRightOpen size={18} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">{t('common.expand')}</p>
                <p className="text-xs font-black text-slate-700">{t('clinical.notes')}</p>
              </div>
            </button>
          )}
        </div>
      </div>

      <ToothPositionSelect 
        visible={toothModalVisible}
        onClose={() => setToothModalVisible(false)}
        selectedTeeth={patientTeeth}
        onSave={setPatientTeeth}
      />
    </motion.div>
  );
};
