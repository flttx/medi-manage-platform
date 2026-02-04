import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegionContext, RegionProvider } from './contexts/RegionContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { SidebarBase } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { AppointmentView } from './views/AppointmentView';
import { PatientListView } from './views/PatientListView';
import { PatientDetailView } from './views/PatientDetailView';
import { CaseListView } from './views/CaseListView';
import { FinanceView } from './views/FinanceView';
import { 
  NewPatientForm, 
  NewAppointmentForm, 
  NewMedicalRecordForm, 
  ExportForm, 
  ReminderConfig 
} from './components/Forms';
import { DataPlaceholder } from './components/UI';

const AppContent = () => {
  const { 
    region, t, activeView, setActiveView, 
    selectedPatient, setSelectedPatient, 
    patients, setPatients, 
    appointments, setAppointments,
    medicalRecords, setMedicalRecords,
    globalModal, setGlobalModal
  } = useContext(RegionContext);
  
  const { showToast } = useToast();

  const handleCreatePatient = (newP) => {
    if (newP.id) {
       setPatients(patients.map(p => p.id === newP.id ? newP : p));
       if (selectedPatient?.id === newP.id) setSelectedPatient(newP);
       showToast(region === 'cn' ? "更新成功" : "Updated successfully", 'success');
    } else {
       const id = `P2026${String(patients.length + 1).padStart(3, '0')}`;
       const patientToAdd = { ...newP, id, lastVisit: "2026.02.03", status: 'confirmed', risk: 'Low' };
       setPatients([patientToAdd, ...patients]);
       showToast(region === 'cn' ? `已创建患者: ${newP.name}` : `Created patient: ${newP.name}`, 'success');
    }
  };

  const handleCreateAppointment = (newApp) => {
    setAppointments([{ ...newApp, status: 'pending', id: 'APP'+Date.now() }, ...appointments]);
    showToast(region === 'cn' ? `已预约: ${newApp.patient}` : `Booked: ${newApp.patient}`, 'success');
  };

  const handleCreateMedicalRecord = (newRec) => {
    if (newRec.id) {
       setMedicalRecords(medicalRecords.map(r => r.id === newRec.id ? newRec : r));
       showToast(region === 'cn' ? "病历更新成功" : "Record updated", 'success');
    } else {
       const recToAdd = { ...newRec, id: Date.now(), patientId: selectedPatient?.id || 'P2026001', i: medicalRecords.length + 1 };
       setMedicalRecords([recToAdd, ...medicalRecords]);
       showToast(region === 'cn' ? "新增病历成功" : "Record created", 'success');
    }
  };

  return (
    <div className="flex w-full h-screen bg-main text-[var(--text-main)] font-custom overflow-hidden">
      <SidebarBase />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 relative">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && <DashboardView key="dashboard" />}
            {activeView === 'appointmentManage' && <AppointmentView key="appointments" />}
            {activeView === 'patientManage' && <PatientListView key="patients" />}
            {activeView === 'patientDetail' && <PatientDetailView key="detail" />}
            {activeView === 'clinicalManage' && <CaseListView key="cases" />}
            {activeView === 'financeManage' && <FinanceView key="finance" />}
            {['operationsCenter', 'systemSettings', 'recycleBin', 'doctorManage'].includes(activeView) && 
              <DataPlaceholder key="placeholder" title={t[activeView]} />
            }
          </AnimatePresence>

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
                  className="bg-white rounded-[2.5rem] w-full max-w-lg relative shadow-2xl overflow-hidden"
                >
                  {globalModal.type === 'patient' && <NewPatientForm onSave={handleCreatePatient} onClose={() => setGlobalModal({ type: null, data: null })} data={globalModal.data} />}
                  {globalModal.type === 'appointment' && <NewAppointmentForm onSave={handleCreateAppointment} patients={patients} onClose={() => setGlobalModal({ type: null, data: null })} />}
                  {globalModal.type === 'clinical' && <NewMedicalRecordForm onSave={handleCreateMedicalRecord} onClose={() => setGlobalModal({ type: null, data: null })} data={globalModal.data} />}
                  {globalModal.type === 'export' && <ExportForm onClose={() => setGlobalModal({ type: null, data: null })} />}
                  {globalModal.type === 'reminder' && <ReminderConfig onClose={() => setGlobalModal({ type: null, data: null })} />}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <RegionProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </RegionProvider>
  );
};

export default App;