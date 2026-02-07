import React, { useState, useContext } from 'react';
import { Plus, FileText, Activity, Trash2, ChevronDown, Check } from 'lucide-react';
import { RegionContext } from '../contexts/RegionContext';
import { useToast } from '../contexts/ToastContext';
import { ToothPositionSelect } from './ToothPositionSelect';
import { TOOTH_STATUSES } from './ToothData';



export const NewPatientForm = ({ onSave, onClose, data }) => {
  const { t } = useContext(RegionContext);
  const [form, setForm] = useState(data || { name: '', gender: 'female', phone: '', dob: '', allergy: '' });
  
  return (
    <div className="p-10 space-y-8 animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{data ? t('common.edit') : t('patient.new')}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:rotate-90 transition-all"><Plus size={20} className="rotate-45" /></button>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('forms.fullName')}</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-sm" placeholder="e.g. Lily Smith" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('patient.gender')}</label>
            <div className="flex bg-slate-50 p-1 rounded-2xl">
              {['male', 'female'].map(g => (
                <button key={g} onClick={() => setForm({...form, gender: g})} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${form.gender === g ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}>{t(`patient.${g}`)}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('patient.phone')}</label>
          <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-sm" placeholder="138 **** ****" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('common.date')}</label>
          <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-sm" />
        </div>
      </div>
      <div className="flex gap-4 pt-4">
        <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-xs text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest">{t('common.cancel')}</button>
        <button onClick={() => { onSave(form); onClose(); }} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">{t('common.save')}</button>
      </div>
    </div>
  );
};

export const NewAppointmentForm = ({ onSave, onClose, patients }) => {
  const { t } = useContext(RegionContext);
  const [form, setForm] = useState({ patient: patients[0]?.name || '', type: 'Cleaning', time: '09:00', date: '2026-02-04' });
  
  return (
    <div className="p-10 space-y-8 animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{t('forms.quickAppointment')}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all"><Plus size={20} className="rotate-45" /></button>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('forms.fullName')}</label>
          <select value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm appearance-none cursor-pointer">
            {patients.map(p => <option key={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('forms.serviceType')}</label>
            <input type="text" value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('forms.preferredTime')}</label>
            <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm" />
          </div>
        </div>
      </div>
      <div className="flex gap-4 pt-4">
        <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-xs text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest">{t('common.cancel')}</button>
        <button onClick={() => { onSave(form); onClose(); }} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">{t('common.save')}</button>
      </div>
    </div>
  );
};

export const NewMedicalRecordForm = ({ onSave, onClose, data }) => {
  const { t } = useContext(RegionContext);
  
  const TEMPLATES = {
    cc: [
        { label: t('common.info'), text: t('forms.cc.pain') },
        { label: t('common.warning'), text: t('forms.cc.checkup') },
        { label: t('common.error'), text: t('forms.cc.fracture') }
    ],
    dx: [
        { label: t('forms.dx.pulpitis'), text: t('forms.dx.pulpitis') },
        { label: t('forms.dx.caries'), text: t('forms.dx.caries') },
        { label: t('forms.dx.gingivitis'), text: t('forms.dx.gingivitis') }
    ],
    tx: [
        { label: t('forms.tx.checkup'), text: t('forms.tx.checkup') },
        { label: t('forms.tx.rct'), text: t('forms.tx.rct') },
        { label: t('forms.tx.filling'), text: t('forms.tx.filling') }
    ]
  };

  const [form, setForm] = useState(data || { 
    date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
    type: t('mobile.doctor.header.routineCheckup'),
    dr: 'Sterling',
    cc: '',
     dx: '',
     plan: '',
     tags: [],
     affectedTeeth: data?.affectedTeeth || []
   });
   const [toothSelectVisible, setToothSelectVisible] = useState(false);


  return (
    <div className="p-10 space-y-8 animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{data ? t('common.edit') : t('common.new')}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all"><Plus size={20} className="rotate-45" /></button>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('common.date')}</label>
            <input type="text" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('common.type')}</label>
            <input type="text" value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm" />
          </div>
        </div>
        <div className="space-y-2">
            <div className="flex justify-between items-end px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('forms.chiefComplaint')}</label>
                <div className="flex gap-1">
                    {TEMPLATES.cc.map(tmp => (
                        <button key={tmp.label} onClick={() => setForm(f => ({ ...f, cc: tmp.text }))} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold hover:bg-primary/10 hover:text-primary transition-colors">{tmp.label}</button>
                    ))}
                </div>
            </div>
            <textarea value={form.cc} onChange={e => setForm({...form, cc: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm min-h-[80px]" placeholder="Enter patient complaints..." />
        </div>
         <div className="space-y-2">
             <div className="flex justify-between items-end px-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('forms.diagnosis')}</label>
                 <div className="flex gap-1">
                    {TEMPLATES.dx.map(tmp => (
                        <button key={tmp.label} onClick={() => setForm(f => ({ ...f, dx: tmp.text }))} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold hover:bg-primary/10 hover:text-primary transition-colors">{tmp.label}</button>
                    ))}
                 </div>
             </div>
             <textarea value={form.dx} onChange={e => setForm({...form, dx: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm min-h-[80px]" placeholder="Enter clinical diagnosis..." />
         </div>

         {/* Tooth Selector Field */}
         <div className="space-y-3">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('mobile.records.affectedTeeth')}</label>
             <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                  {form.affectedTeeth.length === 0 ? (
                    <button 
                        onClick={() => setToothSelectVisible(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-slate-400 text-[10px] font-black uppercase rounded-xl border border-slate-100 hover:text-primary hover:border-primary transition-all shadow-sm"
                    >
                        <Plus size={14} /> {t('forms.select')}
                    </button>
                 ) : (
                    <>
                        {form.affectedTeeth.map(tooth => {
                            const id = typeof tooth === 'object' ? tooth.id : tooth;
                            const statusId = typeof tooth === 'object' ? tooth.status : 'healthy';
                            const status = TOOTH_STATUSES.find(s => s.id === statusId);
                            return (
                                <span key={id} className={`px-3 py-1 bg-white text-[10px] font-black rounded-lg border flex items-center gap-2 shadow-sm ${status?.stroke || 'border-primary/10'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${status?.color || 'bg-primary'}`} />
                                    <span className="text-slate-700">#{id}</span>
                                    <button onClick={() => setForm({...form, affectedTeeth: form.affectedTeeth.filter(t => (typeof t === 'object' ? t.id : t) !== id)})} className="ml-1 text-slate-300 hover:text-red-500 transition-colors">×</button>
                                </span>
                            );
                        })}
                        <button 
                            onClick={() => setToothSelectVisible(true)}
                            className="w-8 h-8 flex items-center justify-center bg-white text-primary rounded-lg border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm"
                        >
                            <Plus size={14} />
                        </button>
                    </>
                 )}

             </div>
         </div>

         <ToothPositionSelect 
            visible={toothSelectVisible}
            onClose={() => setToothSelectVisible(false)}
            initialSelected={form.affectedTeeth}
            onSelect={(teeth) => setForm({...form, affectedTeeth: teeth})}
         />
       </div>

      <div className="flex gap-4 pt-4">
        <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-xs text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest">{t('common.cancel')}</button>
        <button onClick={() => { onSave(form); onClose(); }} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">{t('common.save')}</button>
      </div>
    </div>
  );
};

export const ExportForm = ({ onClose }) => {
  const { t } = useContext(RegionContext);
  const { showToast } = useToast();
  
  return (
    <div className="p-10 space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{t('forms.exportTitle')}</h3>
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
          {[
            { id: 'pdf', label: t('forms.exportFormat.pdf') },
            { id: 'excel', label: t('forms.exportFormat.excel') },
            { id: 'csv', label: t('forms.exportFormat.csv') },
            { id: 'json', label: t('forms.exportFormat.json') }
          ].map(format => (
            <button key={format.id} onClick={() => showToast(`${t('common.success')}: ${format.label}`, 'success')} className="p-4 bg-white border border-slate-100 rounded-2xl text-xs font-black text-slate-600 hover:border-primary/50 hover:bg-slate-50 transition-all">{format.label}</button>
          ))}
        </div>
      </div>
      <button onClick={onClose} className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all border-none">{t('common.exit')}</button>
    </div>
  );
};

export const ReminderConfig = ({ onClose }) => {
  const { t } = useContext(RegionContext);
  const { showToast } = useToast();
  
  return (
    <div className="p-10 space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{t('forms.autoReminder')}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-all"><Plus size={20} className="rotate-45" /></button>
      </div>
      <div className="space-y-6">
        {[
          { label: t('forms.reminders.wechat'), enabled: true },
          { label: t('forms.reminders.sms'), enabled: true },
          { label: t('forms.reminders.email'), enabled: false },
          { label: t('forms.reminders.voice'), enabled: false }
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
            <span className="text-xs font-black text-slate-700">{item.label}</span>
            <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${item.enabled ? 'bg-primary' : 'bg-slate-200'}`} onClick={() => showToast(t('common.saved'), 'info')}>
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${item.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>
        ))}
      </div>
      <button onClick={onClose} className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">{t('forms.saveConfiguration')}</button>
    </div>
  );
};

export const TreatmentPlanForm = ({ onSave, onClose, data }) => {
  const { region, t, priceList } = useContext(RegionContext);
  const [form, setForm] = useState(data || {
    title: '',
    items: [],
    status: 'proposing',
    date: new Date().toISOString().split('T')[0].replace(/-/g, '.')
  });
  
  const [toothModalVisible, setToothModalVisible] = useState(false);
  const [editingItemIdx, setEditingItemIdx] = useState(null);

  const addItem = (priceItem) => {
    const newItem = {
      ...priceItem,
      title: priceItem.name,
      titleEn: priceItem.nameEn || priceItem.name,
      phase: 1,
      status: 'pending',
      teeth: [],
      cost: priceItem.price
    };
    setForm({ ...form, items: [...form.items, newItem] });
  };

  const updateItem = (index, updates) => {
    const newItems = [...form.items];
    const item = { ...newItems[index], ...updates };
    
    // Recalculate cost if teeth changed
    if (updates.teeth !== undefined) {
        // If teeth array is empty, cost is base price. If not, it's Price * TeethCount
        const count = updates.teeth.length;
        // Default to at least 1 unit cost if 0 teeth (e.g. general procedure)
        item.cost = item.price * Math.max(1, count);
    }
    
    newItems[index] = item;
    setForm({ ...form, items: newItems });
  };

  const removeItem = (index) => {
    const newItems = [...form.items];
    newItems.splice(index, 1);
    setForm({ ...form, items: newItems });
  };

  const totalCost = form.items.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="p-8 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">
          {data ? t('treatmentPlan.edit') : t('treatmentPlan.newPlan')}
        </h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all">
          <Plus size={20} className="rotate-45" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('treatmentPlan.planTitle')}</label>
          <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-sm" placeholder="e.g. Lower Molar Restoration" />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('treatmentPlan.addProcedure')}</label>
          <div className="flex flex-wrap gap-2">
            {priceList.map(item => (
              <button key={item.id} onClick={() => addItem(item)} className="px-3 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 hover:border-primary/50 hover:text-primary transition-all shadow-sm">+ {region === 'cn' ? item.name : (item.nameEn || item.name)}</button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('treatmentPlan.itemList')}</label>
          {form.items.length === 0 ? (
            <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
               <Activity size={32} className="mb-2 opacity-20" />
               <p className="text-[9px] font-black uppercase tracking-[0.2em]">{t('treatmentPlan.noItems')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {form.items.map((item, idx) => (
                <div key={idx} className="p-5 bg-slate-50 rounded-3xl border border-slate-100/50 space-y-4 group hover:bg-white hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => updateItem(idx, { phase: (item.phase % 3) + 1 })}
                      className="bg-primary/10 text-primary w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs hover:bg-primary hover:text-white transition-all shadow-sm"
                      title={t('treatmentPlan.phase')}
                    >
                      P{item.phase}
                    </button>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-black text-slate-700">{region === 'cn' ? (item.title || item.name) : (item.titleEn || item.nameEn || item.name)}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">¥{item.price.toLocaleString()} x {Math.max(1, item.teeth.length)} = ¥{item.cost.toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeItem(idx)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pl-14">
                    <div className="flex-1 flex flex-wrap gap-1.5">
                      {item.teeth?.length > 0 ? (
                        item.teeth.map(tooth => (
                          <span key={typeof tooth === 'object' ? tooth.id : tooth} className="px-2 py-0.5 bg-white border border-slate-100 text-primary text-[9px] font-black rounded-lg shadow-sm">
                            #{typeof tooth === 'object' ? tooth.id : tooth}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] font-bold text-slate-300 italic">{t('treatmentPlan.selectTeeth')}...</span>
                      )}
                    </div>
                    <button 
                      onClick={() => { setEditingItemIdx(idx); setToothModalVisible(true); }}
                      className="p-1.5 px-3 bg-white border border-slate-100 rounded-lg text-[9px] font-black text-primary hover:bg-primary hover:text-white transition-all shadow-inner"
                    >
                      {t('treatmentPlan.selectTeeth')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <div className="flex justify-between items-center mb-6 px-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('treatmentPlan.totalEstCost')}</span>
          <span className="text-xl font-black text-primary">¥{totalCost.toLocaleString()}</span>
        </div>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-xs text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest">{t('common.cancel')}</button>
          <button onClick={() => { onSave(form); onClose(); }} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-95 transition-all uppercase tracking-widest">{t('common.save')}</button>
        </div>
      </div>

      <ToothPositionSelect 
        visible={toothModalVisible}
        onClose={() => { setToothModalVisible(false); setEditingItemIdx(null); }}
        initialSelected={editingItemIdx !== null ? form.items[editingItemIdx].teeth : []}
        onSelect={(teeth) => {
          if (editingItemIdx !== null) {
            updateItem(editingItemIdx, { teeth });
          }
        }}
      />
    </div>
  );
};

export const BillingForm = ({ onSave, onClose, data }) => {
  const { t } = useContext(RegionContext);
  const [form, setForm] = useState(data || {
    desc: '',
    amount: 0,
    category: 'Treatment',
    method: 'AliPay',
    date: new Date().toISOString().split('T')[0].replace(/-/g, '.')
  });

  return (
    <div className="p-10 space-y-8 animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{t('forms.createInvoice')}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all focus:outline-none"><Plus size={20} className="rotate-45" /></button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('forms.description')}</label>
          <input type="text" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-sm" placeholder="e.g. Scaling & Root Planing" />
        </div>

        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('common.amount')}</label>
                <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400">¥</span>
                    <input type="number" value={form.amount} onChange={e => setForm({...form, amount: parseFloat(e.target.value) || 0})} className="w-full pl-10 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-sm" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('billing.category')}</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm appearance-none cursor-pointer">
                    <option value="Exam">Exam / Checkup</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Deposit">Deposit / Plan</option>
                    <option value="Supplies">Lab / Supplies</option>
                </select>
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('billing.method')}</label>
            <div className="grid grid-cols-3 gap-3">
                {['AliPay', 'WeChat', 'Cash', 'Credit Card', 'Insurance'].map(m => (
                    <button key={m} onClick={() => setForm({...form, method: m})} className={`py-3 rounded-xl text-[10px] font-black tracking-widest transition-all border ${form.method === m ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-slate-100 text-slate-400 hover:border-primary/20'}`}>{m.toUpperCase()}</button>
                ))}
            </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-xs text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest">{t('common.cancel')}</button>
        <button onClick={() => { onSave({...form, id: 'INV-'+Date.now(), status: 'Paid', date: new Date().toISOString().split('T')[0].replace(/-/g, '.')}); onClose(); }} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">{t('forms.confirmPay')}</button>
      </div>
    </div>
  );
};

export const ComparePlans = ({ data = [], onClose }) => {
    const { region, t } = useContext(RegionContext);
    return (
        <div className="p-10 space-y-8 max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{t('forms.planComparison')}</h3>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all"><Plus size={24} className="rotate-45" /></button>
            </div>
            
            <div className={`grid gap-6 ${data.length >= 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {data.map((plan, i) => (
                    <div key={plan.id} className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <FileText size={80} />
                        </div>
                        <div className="mb-6">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-widest mb-2 inline-block">{t('treatmentPlan.option')} {i + 1}</span>
                            <h4 className="text-xl font-black text-slate-800">{region === 'cn' ? plan.title : (plan.titleEn || plan.title)}</h4>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                            {plan.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-bold truncate max-w-[150px]">{region === 'cn' ? item.title : (item.titleEn || item.title)}</span>
                                    <span className="text-slate-800 font-black">¥{item.cost.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('treatmentPlan.totalCost')}</p>
                                <p className="text-2xl font-black text-primary">¥{plan.totalCost.toLocaleString()}</p>
                            </div>
                            <button onClick={onClose} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">{t('treatmentPlan.select')}</button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100/50">
                <p className="text-xs font-bold text-amber-700 leading-relaxed italic text-center">
                    {t('forms.analysisDetails', { delta: Math.abs((data[0]?.totalCost || 0) - (data[1]?.totalCost || 0)).toLocaleString() })}
                </p>
            </div>
        </div>
    );
};

export const PerioExamForm = ({ onSave, onClose }) => {
  const { t } = useContext(RegionContext);
  const [data, setData] = useState({
    '16': { pd_b: [3, 2, 3], pd_l: [3, 2, 3], bi: 0 },
    '11': { pd_b: [2, 2, 2], pd_l: [2, 2, 2], bi: 0 },
    '36': { pd_b: [3, 3, 3], pd_l: [3, 3, 3], bi: 0 },
  });

  const teeth = [
    18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
    48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38
  ];

  const updateVal = (id, type, idx, val) => {
    const tooth = data[id] || { pd_b: [2, 2, 2], pd_l: [2, 2, 2], bi: 0 };
    const newVal = parseInt(val) || 0;
    if (type === 'bi') {
        setData({ ...data, [id]: { ...tooth, bi: tooth.bi === 1 ? 0 : 1 } });
    } else {
        const arr = [...tooth[type]];
        arr[idx] = newVal;
        setData({ ...data, [id]: { ...tooth, [type]: arr } });
    }
  };

  return (
    <div className="p-8 space-y-6 max-h-[90vh] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center">
        <div>
           <h3 className="text-xl font-black text-slate-800 tracking-tight">{t('perio.newExam')}</h3>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-primary">{t('perio.depthRecord')}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all"><Plus size={20} className="rotate-45" /></button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="space-y-4">
          <div className="grid grid-cols-8 gap-2 sticky top-0 bg-white z-10 py-2 border-b border-slate-50 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">
            <div className="col-span-1">{t('perio.tooth')}</div>
            <div className="col-span-3">{t('perio.buccal')} (D/M/M)</div>
            <div className="col-span-3">{t('perio.lingual')} (D/M/M)</div>
            <div className="col-span-1">{t('perio.bop')}</div>
          </div>
          
          {teeth.map(id => {
            const tooth = data[id] || { pd_b: [0, 0, 0], pd_l: [0, 0, 0], bi: 0 };
            return (
              <div key={id} className="grid grid-cols-8 gap-2 items-center group">
                <div className="text-xs font-black text-slate-700 bg-slate-50 rounded-xl py-2 text-center group-hover:bg-primary/5 group-hover:text-primary transition-all">#{id}</div>
                
                <div className="col-span-3 flex gap-1">
                  {[0, 1, 2].map(idx => (
                    <input key={idx} type="number" value={tooth.pd_b[idx] || ''} onChange={e => updateVal(id, 'pd_b', idx, e.target.value)} className={`w-full p-2 bg-slate-50 border-none rounded-lg text-center text-xs font-black transition-all focus:ring-2 ${tooth.pd_b[idx] > 3 ? 'text-rose-500 bg-rose-50' : 'text-slate-600'}`} placeholder="-" />
                  ))}
                </div>

                <div className="col-span-3 flex gap-1">
                  {[0, 1, 2].map(idx => (
                    <input key={idx} type="number" value={tooth.pd_l[idx] || ''} onChange={e => updateVal(id, 'pd_l', idx, e.target.value)} className={`w-full p-2 bg-slate-50 border-none rounded-lg text-center text-xs font-black transition-all focus:ring-2 ${tooth.pd_l[idx] > 3 ? 'text-rose-500 bg-rose-50' : 'text-slate-600'}`} placeholder="-" />
                  ))}
                </div>

                <div className="col-span-1 flex justify-center">
                    <button onClick={() => updateVal(id, 'bi')} className={`w-6 h-6 rounded-full border-2 transition-all ${tooth.bi === 1 ? 'bg-rose-500 border-rose-500 shadow-lg shadow-rose-200' : 'border-slate-100 hover:border-rose-200'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex gap-4">
        <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-xs text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest">{t('common.cancel')}</button>
        <button onClick={() => { onSave({ id: 'PERIO-'+Date.now(), date: new Date().toISOString().split('T')[0].replace(/-/g, '.'), doctor: 'Dr. Zhang', data }); onClose(); }} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">{t('common.confirm')}</button>
      </div>
    </div>
  );
};
