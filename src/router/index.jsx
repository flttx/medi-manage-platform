import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { RegionContext } from '../contexts/RegionContext';

// Views
import { DashboardView } from '../views/DashboardView';
import { AppointmentView } from '../views/AppointmentView';
import { PatientListView } from '../views/PatientListView';
import { PatientDetailView } from '../views/PatientDetailView';
import { CaseListView } from '../views/CaseListView';
import { FinanceView } from '../views/FinanceView';
import { OperationsView } from '../views/OperationsView';
import { LabOrdersView } from '../views/LabOrdersView';
import { InventoryView } from '../views/InventoryView';
import { DataPlaceholder } from '../components/UI';

export const AppRouter = ({ onApprovePatient }) => {
  const { t } = useContext(RegionContext);

  return (
    <AnimatePresence>
      <Routes>
        {/* Core Modules */}
        <Route path="/" element={<DashboardView />} />
        <Route path="/appointments" element={<AppointmentView />} />
        <Route path="/patients" element={<PatientListView />} />
        
        {/* Detail Views */}
        <Route path="/patients/detail/:id" element={<PatientDetailView onApprove={onApprovePatient} />} />
        
        {/* Clinical & Ops */}
        <Route path="/clinical" element={<CaseListView />} />
        <Route path="/finance" element={<FinanceView />} />
        <Route path="/operations" element={<OperationsView />} />
        <Route path="/lab" element={<LabOrdersView />} />
        <Route path="/inventory" element={<InventoryView />} />
        
        {/* Placeholders for Future Modules */}
        <Route path="/settings" element={<DataPlaceholder title={t('modules.systemSettings')} />} />
        <Route path="/recycle-bin" element={<DataPlaceholder title={t('modules.recycleBin')} />} />
        <Route path="/doctors" element={<DataPlaceholder title={t('modules.doctorManage')} />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};
