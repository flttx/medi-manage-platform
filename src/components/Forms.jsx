import React, { useState, useContext } from 'react';
import { Plus, FileText } from 'lucide-react';
import { RegionContext } from '../contexts/RegionContext';
import { useToast } from '../contexts/ToastContext';

export const NewPatientForm = ({ onSave, onClose, data }) => {
  const { region, t } = useContext(RegionContext);
  const [form, setForm] = useState(data || { name: '', gender: 'female', phone: '', dob: '', allergy: '' });
  
  return (
    <div className="p-10 space-y-8 animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{data ? (region === 'cn' ? '编辑患者' : 'Edit Patient') : t.newPatient}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:rotate-90 transition-all"><Plus size={20} className="rotate-45" /></button>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.fullName}</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-sm" placeholder="e.g. Lily Smith" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.gender}</label>
            <div className="flex bg-slate-50 p-1 rounded-2xl">
              {['male', 'female'].map(g => (
                <button key={g} onClick={() => setForm({...form, gender: g})} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${form.gender === g ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}>{t[g]}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.contact}</label>
          <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-sm" placeholder="138 **** ****" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.dob}</label>
          <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-sm" />
        </div>
      </div>
      <div className="flex gap-4 pt-4">
        <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-xs text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest">{t.cancel}</button>
        <button onClick={() => { onSave(form); onClose(); }} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">{t.save}</button>
      </div>
    </div>
  );
};

export const NewAppointmentForm = ({ onSave, onClose, patients }) => {
  const { region, t } = useContext(RegionContext);
  const [form, setForm] = useState({ patient: patients[0]?.name || '', type: 'Cleaning', time: '09:00', date: '2026-02-04' });
  
  return (
    <div className="p-10 space-y-8 animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{t.quickAppointment}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all"><Plus size={20} className="rotate-45" /></button>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.fullName}</label>
          <select value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm appearance-none cursor-pointer">
            {patients.map(p => <option key={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.serviceType}</label>
            <input type="text" value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.preferredTime}</label>
            <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm" />
          </div>
        </div>
      </div>
      <div className="flex gap-4 pt-4">
        <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-xs text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest">{t.cancel}</button>
        <button onClick={() => { onSave(form); onClose(); }} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">{t.save}</button>
      </div>
    </div>
  );
};

export const NewMedicalRecordForm = ({ onSave, onClose, data }) => {
  const { region, t } = useContext(RegionContext);
  const [form, setForm] = useState(data || { 
    date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
    type: region === 'cn' ? '常规门诊' : 'Routine Checkup',
    dr: 'Sterling',
    cc: '',
    dx: '',
    plan: '',
    tags: []
  });

  return (
    <div className="p-10 space-y-8 animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{data ? (region === 'cn' ? '编辑病历' : 'Edit Case') : (region === 'cn' ? '新增病历' : 'New Case')}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all"><Plus size={20} className="rotate-45" /></button>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{region === 'cn' ? '就诊日期' : 'Visit Date'}</label>
            <input type="text" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{region === 'cn' ? '就诊类别' : 'Visit Type'}</label>
            <input type="text" value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm" />
          </div>
        </div>
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.chiefComplaint}</label>
            <textarea value={form.cc} onChange={e => setForm({...form, cc: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm min-h-[80px]" placeholder="Enter patient complaints..." />
        </div>
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.diagnosis}</label>
            <textarea value={form.dx} onChange={e => setForm({...form, dx: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm min-h-[80px]" placeholder="Enter clinical diagnosis..." />
        </div>
      </div>
      <div className="flex gap-4 pt-4">
        <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-xs text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest">{t.cancel}</button>
        <button onClick={() => { onSave(form); onClose(); }} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">{t.save}</button>
      </div>
    </div>
  );
};

export const ExportForm = ({ onClose }) => {
  const { region, t } = useContext(RegionContext);
  const { showToast } = useToast();
  
  return (
    <div className="p-10 space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{region === 'cn' ? '数据导出预览' : 'Data Export Preview'}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-all"><Plus size={20} className="rotate-45" /></button>
      </div>
      <div className="space-y-4">
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
          <FileText size={32} className="text-primary" />
          <div>
            <p className="font-black text-sm text-slate-800">patient_registry_2026.csv</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Size: 4.2 MB • Records: 128</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {['PDF Report', 'Excel Sheet', 'CSV Raw', 'JSON Data'].map(format => (
            <button key={format} onClick={() => showToast(`Exported as ${format}`, 'success')} className="p-4 bg-white border border-slate-100 rounded-2xl text-xs font-black text-slate-600 hover:border-primary/50 hover:bg-slate-50 transition-all">{format}</button>
          ))}
        </div>
      </div>
      <button onClick={onClose} className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all border-none">Close</button>
    </div>
  );
};

export const ReminderConfig = ({ onClose }) => {
  const { region, t } = useContext(RegionContext);
  const { showToast } = useToast();
  
  return (
    <div className="p-10 space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{t.autoReminder}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-all"><Plus size={20} className="rotate-45" /></button>
      </div>
      <div className="space-y-6">
        {[
          { label: 'WeChat Notification', enabled: true },
          { label: 'SMS Reminder (T-1)', enabled: true },
          { label: 'Email Confirmations', enabled: false },
          { label: 'AI Voice Call', enabled: false }
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
            <span className="text-xs font-black text-slate-700">{item.label}</span>
            <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${item.enabled ? 'bg-primary' : 'bg-slate-200'}`} onClick={() => showToast('Setting updated', 'info')}>
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${item.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>
        ))}
      </div>
      <button onClick={onClose} className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">Save Configuration</button>
    </div>
  );
};
