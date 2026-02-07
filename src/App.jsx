import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RegionContext, RegionProvider } from './contexts/RegionContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { SidebarBase } from './components/Sidebar';
import { AppRouter } from './router';
import { InventoryProvider, InventoryContext } from './contexts/InventoryContext';
import { PatientH5 } from './views/mobile/PatientH5';
import { DoctorH5 } from './views/mobile/DoctorH5';
import { 
  NewPatientForm, 
  NewAppointmentForm, 
  NewMedicalRecordForm, 
  ExportForm, 
  ReminderConfig,
  TreatmentPlanForm,
  BillingForm,
  ComparePlans,
  PerioExamForm
} from './components/Forms';


const AppContent = () => {
  const { 
    t, region,
    patients, setPatients,
    selectedPatient, setSelectedPatient,
    appointments, setAppointments,
    medicalRecords, setMedicalRecords,
    treatmentPlans, setTreatmentPlans,
    invoices, setInvoices,
    perioRecords, setPerioRecords,
    globalModal, setGlobalModal,
    platform, setPlatform,
    setActiveView
  } = useContext(RegionContext);
  
  const { useItem } = useContext(InventoryContext);

  
  const { showToast } = useToast();
  const [h5Notification, setH5Notification] = React.useState(null);

  React.useEffect(() => {
    const handleNotify = (event) => {
      if (event.data.type === 'NOTIFY_DESKTOP') {
        setH5Notification(event.data);
        // Auto-dismiss after 8s
        setTimeout(() => setH5Notification(null), 8000);
      }
    };
    const bc = new BroadcastChannel('region_state_sync');
    bc.addEventListener('message', handleNotify);
    return () => bc.close();
  }, []);

  const handleCreatePatient = (newP) => {
    if (newP.id) {
       setPatients(patients.map(p => p.id === newP.id ? newP : p));
       if (selectedPatient?.id === newP.id) setSelectedPatient(newP);
       showToast(t('common.updated'), 'success');
    } else {
       const id = `P2026${String(patients.length + 1).padStart(3, '0')}`;
       const patientToAdd = { ...newP, id, lastVisit: "2026.02.03", status: 'confirmed', risk: 'Low' };
       setPatients([patientToAdd, ...patients]);
       showToast(t('common.created') + `: ${newP.name}`, 'success');
    }
  };

  const handleCreateAppointment = (newApp) => {
    setAppointments([{ ...newApp, status: 'pending', id: 'APP'+Date.now() }, ...appointments]);
    showToast(t('modules.appointmentManage') + `: ${newApp.patient}`, 'success');
  };

  const handleCreateMedicalRecord = (newRec) => {
    if (newRec.id) {
       setMedicalRecords(medicalRecords.map(r => r.id === newRec.id ? newRec : r));
       showToast(t('common.updated'), 'success');
    } else {
       const recToAdd = { ...newRec, id: Date.now(), patientId: selectedPatient?.id || 'P2026001', i: medicalRecords.length + 1 };
       setMedicalRecords([recToAdd, ...medicalRecords]);
       showToast(t('common.created'), 'success');

       // --- BUSINESS LOGIC LOOP: AUTOMATION ---
       // 1. Inventory Deduction
       if (newRec.type.includes('Implant') || newRec.type.includes('Surgery')) {
           useItem('I003', 1); // Implant Post
           useItem('I004', 2); // Anesthetics
           useItem('I005', 2); // Gloves
           showToast('Inventory Deducted: Implant Kit & Consumables', 'success');
       }
       
       // 2. Auto-Billing
       const costMap = { 'Implant': 12000, 'Root Canal': 3500, 'Crown': 4000 };
       const cost = Object.keys(costMap).find(k => newRec.type.includes(k)) ? costMap[Object.keys(costMap).find(k => newRec.type.includes(k))] : 500;
       
       const newInvoice = {
           id: `INV-${Date.now()}`,
           patientName: selectedPatient?.name || 'Guest',
           patientId: selectedPatient?.id,
           date: new Date().toISOString().split('T')[0],
           amount: cost,
           status: 'unpaid',
           items: [{ desc: newRec.type, cost: cost }]
       };
       setInvoices(prev => [newInvoice, ...prev]);
       showToast(`Auto-generated Invoice: $${cost}`, 'success');
    }
  };

  const handleCreateTreatmentPlan = (newPlan) => {
    if (newPlan.id) {
       setTreatmentPlans(treatmentPlans.map(p => p.id === newPlan.id ? newPlan : p));
       showToast(t('common.updated'), 'success');
    } else {
       const planToAdd = { ...newPlan, id: 'TP'+Date.now(), patientId: selectedPatient?.id || 'P2026001', totalCost: newPlan.items.reduce((s, i) => s + i.cost, 0) };
       setTreatmentPlans([planToAdd, ...treatmentPlans]);
       showToast(t('common.created'), 'success');
    }
  };

  const handleCreateInvoice = (newInv) => {
    setInvoices([newInv, ...invoices]);
    showToast(t('common.success'), 'success');
  };

  const handleCreatePerio = (newPerio) => {
    setPerioRecords([newPerio, ...perioRecords]);
    showToast(t('common.saved'), 'success');
  };


  const handleApprovePatient = (patientId) => {

    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, status: 'confirmed' } : p));
    setAppointments(prev => prev.map(a => a.id === patientId ? { ...a, status: 'confirmed' } : a));
    if (selectedPatient?.id === patientId) {
       setSelectedPatient({ ...selectedPatient, status: 'confirmed' });
    }
    showToast(t('common.approve') + ' ' + t('common.success'), 'success');
  };

  return (
    <div className="flex w-full h-screen bg-main text-[var(--text-main)] font-custom overflow-hidden">
      {platform === 'desktop' ? (
        <>
          <SidebarBase />
          <main className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 relative">
              <AppRouter onApprovePatient={handleApprovePatient} />



              {/* Global Modal System */}
              <AnimatePresence>
                {globalModal.type && (
                  <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                      onClick={() => setGlobalModal({ type: null, data: null })}
                    />
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                      className={`bg-white rounded-[2.5rem] w-full relative shadow-2xl overflow-hidden ${globalModal.type === 'treatmentPlan' ? 'max-w-2xl' : 'max-w-lg'}`}
                    >

                      {globalModal.type === 'patient' && <NewPatientForm onSave={handleCreatePatient} onClose={() => setGlobalModal({ type: null, data: null })} data={globalModal.data} />}
                      {globalModal.type === 'appointment' && <NewAppointmentForm onSave={handleCreateAppointment} patients={patients} onClose={() => setGlobalModal({ type: null, data: null })} />}
                      {globalModal.type === 'clinical' && <NewMedicalRecordForm onSave={handleCreateMedicalRecord} onClose={() => setGlobalModal({ type: null, data: null })} data={globalModal.data} />}
                      {globalModal.type === 'treatmentPlan' && <TreatmentPlanForm onSave={handleCreateTreatmentPlan} onClose={() => setGlobalModal({ type: null, data: null })} data={globalModal.data} />}
                      {globalModal.type === 'billing' && <BillingForm onSave={handleCreateInvoice} onClose={() => setGlobalModal({ type: null, data: null })} data={globalModal.data} />}
                      {globalModal.type === 'compare' && <ComparePlans data={globalModal.data} onClose={() => setGlobalModal({ type: null, data: null })} region={region} />}
                      {globalModal.type === 'perio' && <PerioExamForm onSave={handleCreatePerio} onClose={() => setGlobalModal({ type: null, data: null })} />}
                      {globalModal.type === 'export' && <ExportForm onClose={() => setGlobalModal({ type: null, data: null })} />}




                      {globalModal.type === 'reminder' && <ReminderConfig onClose={() => setGlobalModal({ type: null, data: null })} />}
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </>
      ) : (
        <div className="w-full h-full bg-[#0f172a] flex items-center justify-center p-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/10 pointer-events-none" />
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/10 text-[10px] font-black uppercase tracking-[1em] text-center pointer-events-none">
                MOBILE TERMINAL SIMULATION
            </div>
            
            <AnimatePresence mode="wait">
                {platform === 'patient-h5' && <PatientH5 key="patient" />}
                {platform === 'doctor-h5' && <DoctorH5 key="doctor" />}
            </AnimatePresence>

            {/* Platform Control for Simulator */}
            <div className="fixed top-8 right-8 flex flex-col gap-2">
                <button onClick={() => window.close()} className="px-4 py-2 bg-white/10 text-white rounded-lg text-[9px] font-black uppercase border border-white/5 hover:bg-white/20 transition-all">Close Window</button>
            </div>
        </div>
      )}

      {/* Real-time H5 Sync Notification Overlay */}
      <AnimatePresence>
        {h5Notification && (
          <motion.div 
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-10 right-10 z-[3000] w-80 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white p-2 overflow-hidden"
          >
             <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
                   {h5Notification.event === 'IMAGE_CAPTURED' ? (
                     <img src={h5Notification.url} className="w-full h-full object-cover rounded-2xl" alt="" />
                   ) : (
                     <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                   )}
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Real-time Sync</p>
                   </div>
                   <h4 className="text-xs font-black text-slate-800 truncate">
                      {h5Notification.event === 'IMAGE_CAPTURED' ? `New ${h5Notification.mode} Photo` : 'Clinical Record Saved'}
                   </h4>
                   <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{h5Notification.patient}</p>
                </div>
                <button onClick={() => setH5Notification(null)} className="p-2 text-slate-300 hover:text-slate-500">
                   <Plus size={16} className="rotate-45" />
                </button>
             </div>
             {h5Notification.event === 'IMAGE_CAPTURED' && (
               <div className="bg-slate-50 p-3 rounded-[1.8rem] m-1 flex items-center justify-between gap-3">
                  <div className="flex -space-x-2">
                     <div className="w-6 h-6 rounded-full bg-indigo-100 border border-white flex items-center justify-center text-[8px] font-black text-indigo-500">AI</div>
                     <div className="w-6 h-6 rounded-full bg-emerald-100 border border-white flex items-center justify-center text-[8px] font-black text-emerald-500">✓</div>
                  </div>
                  <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-indigo-50 shadow-sm" onClick={() => setActiveView('patientDetail')}>View Deep Analysis</button>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  return (
    <RegionProvider>
      <InventoryProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </InventoryProvider>
    </RegionProvider>
  );
};

export default App;