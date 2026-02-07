import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// old translations will be removed later

export const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
  const queryParams = new URLSearchParams(window.location.search);
  const urlPlatform = queryParams.get('platform');
  
  const { t, i18n } = useTranslation();
  const [region, setRegion] = useState('cn');
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [recentPatients, setRecentPatients] = useState([
      { name: "林丽丽", id: "P2026001", age: 32, phone: "13511112222", gender: 'female', lastVisit: "2026.02.01", status: 'confirmed', risk: 'Low' },
      { name: "陈志强", id: "P2026002", age: 45, phone: "13611112222", gender: 'male', lastVisit: "2026.01.28", status: 'pending', risk: 'High' }
  ]);
  const [globalModal, setGlobalModal] = useState({ type: null, data: null });
  const [platform, setPlatform] = useState(urlPlatform || 'desktop'); 
  const [user, setUser] = useState({
    id: 'U101',
    name: 'Sterling Pro',
    phone: '100****0000',
    role: 'doctor', // roles: 'doctor', 'admin', 'nurse', 'receptionist'
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor'
  });
  const [userRole, setUserRole] = useState('clinic'); // 'clinic' | 'lab'
  const [theme, setTheme] = useState(localStorage.getItem('dental_theme') || 'light');
  const [privacyMode, setPrivacyMode] = useState(localStorage.getItem('privacy_mode') !== 'false');
  
  // Sync Channel for Multi-window simulation
  const syncChannel = React.useMemo(() => new BroadcastChannel('region_state_sync'), []);
  const [patients, setPatients] = useState([
    { name: "林丽丽", id: "P2026001", age: 32, phone: "13511112222", gender: 'female', lastVisit: "2026.02.01", status: 'confirmed', risk: 'Low' },
    { name: "陈志强", id: "P2026002", age: 45, phone: "13611112222", gender: 'male', lastVisit: "2026.01.28", status: 'pending', risk: 'High' },
    { name: "王小萌", id: "P2026003", age: 28, phone: "13711112222", gender: 'female', lastVisit: "2026.02.03", status: 'confirmed', risk: 'Low' },
    { name: "张大伟", id: "P2026004", age: 38, phone: "13811112222", gender: 'male', lastVisit: "2026.01.15", status: 'cancelled', risk: 'Medium' },
    { name: "李美琪", id: "P2026005", age: 24, phone: "13911112222", gender: 'female', lastVisit: "2026.02.04", status: 'confirmed', risk: 'Low' },
  ]);

  const [doctors] = useState([
    { id: 'D01', name: "史医生", role: "正畸专家", color: "bg-indigo-500", status: 'active' },
    { id: 'D02', name: "米医生", role: "颌面外科", color: "bg-emerald-500", status: 'active' },
    { id: 'D03', name: "王医生", role: "全科牙医", color: "bg-amber-500", status: 'away' },
  ]);

  const [appointments, setAppointments] = useState([
    { time: "09:00", patient: "林丽丽", type: "拔牙", status: "confirmed", id: 'P2026001', date: "2026-02-04", doctor: "史医生" },
    { time: "10:30", patient: "陈志强", type: "牙齿检查", status: "pending", id: 'P2026002', date: "2026-02-04", doctor: "史医生" },
    { time: "11:15", patient: "王小萌", type: "洗牙洁治", status: "confirmed", id: 'P2026003', date: "2026-02-04", doctor: "米医生" },
    { time: "14:00", patient: "张大伟", type: "根管治疗", status: "confirmed", id: 'P2026004', date: "2026-02-04", doctor: "史医生" },
    { time: "15:30", patient: "李美琪", type: "方案咨询", status: "pending", id: 'P2026005', date: "2026-02-04", doctor: "米医生" },
  ]);

  const [medicalRecords, setMedicalRecords] = useState([
    { 
       id: 1, patientId: 'P2026001', date: '2026.02.03', i: 1,
       type: '常规门诊', 
       dr: '史医生', 
       cc: "左侧后牙剧烈跳痛，影响入睡，冷热刺激加重。",
       dx: "36牙不可复性牙髓炎（急性发作）",
       plan: "建议行RCT（根管治疗）",
       images: true,
       affectedTeeth: [36]
     },
     { 
       id: 2, patientId: 'P2026001', date: '2026.01.15', i: 2,
       type: '初诊咨询', 
       dr: '史医生', 
       cc: "常规口腔检查，自述进食时偶有酸软感。",
       dx: "轻度牙周炎，36牙深龋",
       plan: "洁牙及针对性补牙治疗",
       images: false,
       affectedTeeth: [36, 11]
     }
  ]);

  const priceList = React.useMemo(() => [
    { id: 'RCT', name: '根管治疗 (RCT)', nameEn: 'Root Canal Treatment (RCT)', category: 'Endodontics', price: 3500, unit: t('common.unit.tooth') },
    { id: 'CROWN_ZR', name: '全瓷冠 (氧化锆)', nameEn: 'Zirconia Crown', category: 'Restoration', price: 5000, unit: t('common.unit.piece') },
    { id: 'EXT_SIMPLE', name: '简单拔牙', nameEn: 'Simple Extraction', category: 'Surgery', price: 500, unit: t('common.unit.tooth') },
    { id: 'EXT_IMPACTED', name: '智齿拔除', nameEn: 'Impacted Tooth Extraction', category: 'Surgery', price: 1500, unit: t('common.unit.tooth') },
    { id: 'IMPLANT_STRA', name: 'Straumann 种植体', nameEn: 'Straumann Implant', category: 'Implant', price: 12000, unit: t('common.unit.set') },
    { id: 'CLEANING', name: '超声波洁牙', nameEn: 'Ultrasonic Scaling', category: 'Periodontics', price: 380, unit: t('common.unit.visit') },
    { id: 'INLAY', name: '瓷嵌体修复', nameEn: 'Porcelain Inlay', category: 'Restoration', price: 2800, unit: t('common.unit.piece') },
    { id: 'SCAN', name: '数字化口腔扫描', nameEn: 'Digital Intraoral Scan', category: 'Common', price: 1000, unit: t('common.unit.fullArch') },
  ], [t]);

  const [treatmentPlans, setTreatmentPlans] = useState([
    {
      id: 'TP2026001',
      patientId: 'P2026001',
      doctorId: 'D01',
      title: '左下磨牙修复方案',
      titleEn: 'Lower Left Molar Restoration',
      status: 'active',
      date: '2026.02.01',
      totalCost: 12500,
      items: [
        { phase: 1, title: '36牙 根管治疗 (RCT)', titleEn: 'Root Canal Therapy #36', cost: 3500, status: 'completed', teeth: [36] },
        { phase: 1, title: '36牙 牙冠延长术', titleEn: 'Crown Lengthening #36', cost: 1500, status: 'completed', teeth: [36] },
        { phase: 2, title: '36牙 全瓷冠修复', titleEn: 'Full Ceramic Crown #36', cost: 5000, status: 'pending', teeth: [36] },
        { phase: 2, title: '37牙 嵌体修复', titleEn: 'Inlay Restoration #37', cost: 2500, status: 'pending', teeth: [37] }
      ]
    },
    {
      id: 'TP2026002',
      patientId: 'P2026001',
      doctorId: 'D01',
      title: '正畸前期咨询与影像',
      titleEn: 'Orthodontic Prep',
      status: 'proposing',
      date: '2026.02.04',
      totalCost: 2000,
      items: [
        { phase: 1, title: '口腔扫描与数字化建模', titleEn: 'Intraoral Scan & Digital Setup', cost: 1000, status: 'pending', teeth: [] },
        { phase: 1, title: '头影测量与全景片分析', titleEn: 'Cephalometric Analysis', cost: 1000, status: 'pending', teeth: [] }
      ]
    },
    {
      id: 'TP2026003',
      patientId: 'P2026002',
      doctorId: 'D02',
      title: '种植手术方案',
      titleEn: 'Implant Surgery',
      status: 'active',
      date: '2026.01.15',
      totalCost: 15000,
      items: [
        { phase: 1, title: '种植体植入', titleEn: 'Implant Placement', cost: 12000, status: 'pending', teeth: [46] },
        { phase: 2, title: '愈合基台安装', titleEn: 'Healing Abutment', cost: 3000, status: 'pending', teeth: [46] }
      ]
    },
    {
      id: 'TP2026004',
      patientId: 'P2026003',
      doctorId: 'D02',
      title: '全口洁治与牙周治疗',
      titleEn: 'Full Mouth Scaling',
      status: 'rejected',
      date: '2026.01.20',
      totalCost: 1200,
      items: [{ phase: 1, title: '深层龈下刮治', titleEn: 'Deep SRP', cost: 1200, status: 'pending', teeth: [] }]
    },
    {
      id: 'TP2026005',
      patientId: 'P2026004',
      doctorId: 'D03',
      title: '阻生智齿微创拔除',
      titleEn: 'Impacted Wisdom Extraction',
      status: 'active',
      date: '2026.02.05',
      totalCost: 1800,
      items: [{ phase: 1, title: '智齿拔除', titleEn: 'Extraction', cost: 1800, status: 'completed', teeth: [18] }]
    }
  ]);

  const [imagingData, setImagingData] = useState([
    { id: 'IMG001', patientId: 'P2026001', type: 'Panorama', date: '2026.02.01', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800', note: 'Initial checkup' },
    { id: 'IMG002', patientId: 'P2026001', type: 'CT', date: '2026.02.01', url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=800', note: '3D Scan #36' },
    { id: 'IMG003', patientId: 'P2026001', type: 'Intraoral', date: '2026.02.03', url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800', note: 'Pre-op #36' },
    { id: 'IMG004', patientId: 'P2026001', type: 'Intraoral', date: '2026.02.04', url: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?q=80&w=800', note: 'Post-op #36' },
  ]);
  
   const [perioRecords, setPerioRecords] = useState([
      { 
        id: 'PERIO-002', 
        patientId: 'P2026001', 
        date: '2026.02.04', 
        doctor: '史医生',
        data: {
          '11': { pd_b: [3, 2, 2], pd_l: [2, 2, 3], bi: 0 },
          '12': { pd_b: [2, 1, 2], pd_l: [2, 2, 2], bi: 0 },
          '16': { pd_b: [4, 3, 4], pd_l: [5, 3, 4], bi: 1 }, 
          '36': { pd_b: [5, 4, 6], pd_l: [4, 4, 5], bi: 2 }, 
          '46': { pd_b: [3, 2, 3], pd_l: [3, 2, 2], bi: 0 }
        }
      },
      { 
        id: 'PERIO-001', 
        patientId: 'P2026001', 
        date: '2025.11.12', 
        doctor: '史医生',
        data: {
          '11': { pd_b: [4, 3, 3], pd_l: [3, 3, 4], bi: 1 },
          '16': { pd_b: [5, 4, 5], pd_l: [6, 4, 5], bi: 2 }, 
          '36': { pd_b: [6, 5, 7], pd_l: [5, 5, 6], bi: 3 }
        }
      }
   ]);

   const [labOrders, setLabOrders] = useState([
     { id: 'LAB-2026-001', patientName: '林丽丽', doctorName: '史医生', age: 32, type: 'Zirconia Crown', teeth: [36], shade: 'A2', status: 'milling', date: '2026.02.04', priority: 'high' },
     { id: 'LAB-2026-002', patientName: '陈志强', doctorName: '史医生', age: 45, type: 'Implant Abutment', teeth: [46], shade: 'A3', status: 'designing', date: '2026.02.05', priority: 'normal' },
     { id: 'LAB-2026-003', patientName: '王小萌', doctorName: '米医生', age: 28, type: 'Veneer', teeth: [11], shade: 'BL2', status: 'received', date: '2026.02.06', priority: 'normal' },
     { id: 'LAB-2026-004', patientName: '张大伟', doctorName: '史医生', age: 38, type: 'Inlay', teeth: [26], shade: 'A3.5', status: 'shipping', date: '2026.02.02', priority: 'rush' },
   ]);

   const [invoices, setInvoices] = useState([
     { id: 'INV-2026-001', patientId: 'P2026001', date: '2026.02.04', desc: '根管治疗第一阶段', amount: 3500, status: 'Paid', method: 'AliPay', category: 'Treatment' },
     { id: 'INV-2026-002', patientId: 'P2026001', date: '2026.02.03', desc: '数字化取模与扫描', amount: 1500, status: 'Paid', method: 'WeChat', category: 'Exam' },
     { id: 'INV-2026-003', patientId: 'P2026001', date: '2026.01.20', desc: '正畸预付款', amount: 12500, status: 'Pending', method: '-', category: 'Ortho' },
     { id: 'INV-2026-004', patientId: 'P2026002', date: '2025.12.15', desc: '种植手术费', amount: 8000, status: 'Pending', method: '-', category: 'Implant' },
     { id: 'INV-2026-005', patientId: 'P2026003', date: '2026.02.05', desc: '洁牙套餐', amount: 380, status: 'Paid', method: 'Credit', category: 'Periodontics' },
     { id: 'INV-2026-006', patientId: 'P2026004', date: '2026.02.01', desc: '智齿拔除', amount: 1500, status: 'Paid', method: 'Cash', category: 'Surgery' },
     { id: 'INV-2026-007', patientId: 'P2026005', date: '2026.01.10', desc: '全瓷冠修复', amount: 5000, status: 'Pending', method: '-', category: 'Restoration' }
   ]);

  const [inventory, setInventory] = useState([]);
  
  // Membership & Marketing Data
  const [membershipLevels, setMembershipLevels] = useState([
      { id: 'v1', name: 'Silver Member', color: 'from-slate-400 to-slate-500', minSpend: 0, discount: 1.0, benefits: ['Free Oral Exam', 'Birthday Gift'] },
      { id: 'v2', name: 'Gold Member', color: 'from-amber-300 to-amber-500', minSpend: 10000, discount: 0.9, benefits: ['10% Off Treatments', 'Free Teeth Cleaning x1/yr'] },
      { id: 'v3', name: 'Platinum VIP', color: 'from-slate-900 via-purple-900 to-slate-900', minSpend: 50000, discount: 0.8, benefits: ['20% Off Treatments', 'Priority Booking', 'Family Sharing'] }
  ]);
  
  const [prepaidPlans, setPrepaidPlans] = useState([
      { id: 'p1', name: 'Starter Pack', amount: 1000, bonus: 50, tag: 'New' },
      { id: 'p2', name: 'Family Plan', amount: 5000, bonus: 400, tag: 'Popular' },
      { id: 'p3', name: 'Ortho Special', amount: 20000, bonus: 2000, tag: 'Best Value' }
  ]);

  const [campaigns, setCampaigns] = useState([
     { id: 'c1', name: 'Summer Whitening', status: 'active', type: 'Discount', discount: 0.5, target: 'All', sent: 1500, opened: 840, converted: 120 },
     { id: 'c2', name: 'Recall: 6-Month Checkup', status: 'active', type: 'Reminder', discount: 0, target: 'Inactive > 6m', sent: 300, opened: 150, converted: 45 },
     { id: 'c3', name: 'New Patient Welcome', status: 'paused', type: 'Voucher', discount: 100, target: 'New', sent: 50, opened: 40, converted: 10 }
  ]);

  const [patientCoupons, setPatientCoupons] = useState([
     { id: 'cp1', patientId: 'P2026001', title: '50% Off Whitening', expiry: '2026.12.31', status: 'active', discount: 0.5, type: 'percent' },
     { id: 'cp2', patientId: 'P2026001', title: '$100 Voucher', expiry: '2026.06.30', status: 'used', discount: 100, type: 'fixed' },
     { id: 'cp3', patientId: 'P2026001', title: 'Free Oral Exam', expiry: '2026.03.01', status: 'active', discount: 1.0, type: 'percent' }
  ]);

   const addToRecent = (patient) => {
    setRecentPatients(prev => {
      const filtered = prev.filter(p => p.id !== patient.id);
      return [patient, ...filtered].slice(0, 5);
    });
  };

  const viewPatient = (patient) => {
    setSelectedPatient(patient);
    addToRecent(patient);
    setActiveView('patientDetail');
  };



   const [messages, setMessages] = useState([
     { id: 1, sender: 'Dr. Sterling', text: '您好，李女士！系统监测到您已经完成了 36 牙的根管治疗，请问现在咬合感如何？', time: '10:45 AM', type: 'received' },
     { id: 2, sender: 'Me', text: '感觉好多了，稍微还有一点涨，但完全可以忍受。', time: '10:47 AM', type: 'sent' }
   ]);


  const updateInvoice = (id, updates) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...updates } : inv));
  };

  const updateAppointment = (id, updates) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, ...updates } : app));
  };

  useEffect(() => {
    i18n.changeLanguage(region);
    document.body.setAttribute('data-region', region);
  }, [region, i18n]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('dental_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('privacy_mode', privacyMode);
  }, [privacyMode]);

  // Sync state broadcast
  useEffect(() => {
    const syncState = { patients, appointments, invoices, imagingData, medicalRecords, perioRecords, messages };
    syncChannel.postMessage({ type: 'STATE_UPDATE', state: syncState });
  }, [patients, appointments, invoices, imagingData, medicalRecords, perioRecords, messages, syncChannel]);

  const notifyDesktop = (data) => {
    syncChannel.postMessage({ type: 'NOTIFY_DESKTOP', ...data });
  };

  // Listen for sync
  useEffect(() => {
    const handleSync = (event) => {
        if (event.data.type === 'STATE_UPDATE') {
            const { state } = event.data;
            if (state.patients) setPatients(state.patients);
            if (state.appointments) setAppointments(state.appointments);
            if (state.invoices) setInvoices(state.invoices);
            if (state.imagingData) setImagingData(state.imagingData);
            if (state.medicalRecords) setMedicalRecords(state.medicalRecords);
            if (state.perioRecords) setPerioRecords(state.perioRecords);
            if (state.messages) setMessages(state.messages);
        }
    };
    syncChannel.addEventListener('message', handleSync);
    return () => syncChannel.removeEventListener('message', handleSync);
  }, [syncChannel]);

  const value = {
    region, setRegion,
    t,
    activeView, setActiveView,
    selectedPatient, setSelectedPatient,
    patients, setPatients,
    appointments, setAppointments,
    doctors,
    medicalRecords, setMedicalRecords,
    globalModal, setGlobalModal,
    treatmentPlans, setTreatmentPlans,
    priceList,
    imagingData, setImagingData,
    perioRecords, setPerioRecords,
    invoices, setInvoices,
    messages, setMessages,
    updateInvoice, updateAppointment,
    platform, setPlatform,
    recentPatients, viewPatient,
    notifyDesktop, syncChannel,
    user, setUser,
    userRole, setUserRole,
    labOrders, setLabOrders,
    inventory, setInventory,
    membershipLevels, setMembershipLevels,
    prepaidPlans, setPrepaidPlans,
    campaigns, setCampaigns,
    patientCoupons, setPatientCoupons,
    theme, setTheme,
    privacyMode, setPrivacyMode
  };



  return (
    <RegionContext.Provider value={value}>
      {children}
    </RegionContext.Provider>
  );
};
