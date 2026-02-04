import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../constants/translations';

export const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
  const [region, setRegion] = useState('cn');
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [globalModal, setGlobalModal] = useState({ type: null, data: null });
  
  // Centralized Data
  const [patients, setPatients] = useState([
    { name: "Lily Smith", id: "P2026001", age: 32, phone: "13511112222", gender: 'female', lastVisit: "2026.02.01", status: 'confirmed', risk: 'Low' },
    { name: "Michael Chen", id: "P2026002", age: 45, phone: "13611112222", gender: 'male', lastVisit: "2026.01.28", status: 'pending', risk: 'High' },
    { name: "Emma Wilson", id: "P2026003", age: 28, phone: "13711112222", gender: 'female', lastVisit: "2026.02.03", status: 'confirmed', risk: 'Low' },
    { name: "David Zhang", id: "P2026004", age: 38, phone: "13811112222", gender: 'male', lastVisit: "2026.01.15", status: 'cancelled', risk: 'Medium' },
    { name: "Sarah Lee", id: "P2026005", age: 24, phone: "13911112222", gender: 'female', lastVisit: "2026.02.04", status: 'confirmed', risk: 'Low' },
  ]);

  const [appointments, setAppointments] = useState([
    { time: "09:00", patient: "Lily Smith", type: "Extraction", status: "confirmed", id: 'P2026001', date: "2026-02-04" },
    { time: "10:30", patient: "Michael Chen", type: "Checkup", status: "pending", id: 'P2026002', date: "2026-02-04" },
    { time: "11:15", patient: "Emma Wilson", type: "Cleaning", status: "confirmed", id: 'P2026003', date: "2026-02-04" },
    { time: "14:00", patient: "David Zhang", type: "Root Canal", status: "confirmed", id: 'P2026004', date: "2026-02-04" },
    { time: "15:30", patient: "Sarah Lee", type: "Consult", status: "pending", id: 'P2026005', date: "2026-02-04" },
  ]);

  const [medicalRecords, setMedicalRecords] = useState([
    { 
       id: 1, patientId: 'P2026001', date: '2026.02.03', i: 1,
       type: region === 'cn' ? '常规门诊' : 'Routine Checkup', 
       dr: 'Sterling', 
       cc: "Toothache on the left side, sensitive to cold.",
       dx: "K04.0 Irreversible pulpitis on 36",
       plan: "Root Canal Treatment",
       images: true
     },
     { 
       id: 2, patientId: 'P2026001', date: '2026.01.15', i: 2,
       type: region === 'cn' ? '初诊咨询' : 'Consultation', 
       dr: 'Sterling', 
       cc: "Routine check-up, requested scaling.",
       dx: "Mild gingivitis, deep caries on 36 found",
       plan: "Scaling & Full Exams",
       images: false
     }
  ]);

  const t = translations[region];

  useEffect(() => {
    document.body.setAttribute('data-region', region);
  }, [region]);

  const value = {
    region, setRegion,
    t,
    activeView, setActiveView,
    selectedPatient, setSelectedPatient,
    patients, setPatients,
    appointments, setAppointments,
    medicalRecords, setMedicalRecords,
    globalModal, setGlobalModal
  };

  return (
    <RegionContext.Provider value={value}>
      {children}
    </RegionContext.Provider>
  );
};
