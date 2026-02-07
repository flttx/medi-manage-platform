import React, { useContext } from 'react';
import { User, Phone, MapPin, Calendar, Activity, AlertCircle, Mail, Heart } from 'lucide-react';
import { RegionContext } from '../../contexts/RegionContext';

export const ProfileTab = () => {
  const { t, selectedPatient } = useContext(RegionContext);

  if (!selectedPatient) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      {/* Header Info Card */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/0 p-8 rounded-[2.5rem] border border-primary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
           <img 
             src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPatient.name}`} 
             className="w-32 h-32 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 border-4 border-white" 
             alt="Avatar" 
           />
           <div className="text-center md:text-left space-y-4 flex-1">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">{selectedPatient.name}</h2>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                   <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1">
                      <User size={12} /> {selectedPatient.gender === 'male' ? t('patient.male') : t('patient.female')} • {selectedPatient.age} {t('patient.age')}
                   </span>
                   <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1">
                      <Calendar size={12} /> 出生日期: 1990.05.20
                   </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                 <div className="p-4 bg-white/60 rounded-2xl border border-white/50 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                       <Phone size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">电话</p>
                        <p className="text-sm font-black text-slate-700">{selectedPatient.phone}</p>
                    </div>
                 </div>
                 <div className="p-4 bg-white/60 rounded-2xl border border-white/50 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                       <Mail size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">电子邮箱</p>
                        <p className="text-sm font-black text-slate-700">patient@example.com</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Info */}
         <div className="lg:col-span-2 space-y-6">
            <div className="card p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/20">
               <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-6">
                  <Activity size={18} className="text-primary" />
                  病史与警示
               </h3>
               
               <div className="space-y-4">
                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex gap-4">
                     <AlertCircle size={24} className="text-rose-500 shrink-0 mt-1" />
                     <div>
                        <h4 className="text-sm font-black text-rose-700 mb-1">过敏史</h4>
                        <p className="text-xs font-medium text-rose-600/80 leading-relaxed">青霉素 (严重), 乳胶 (轻微)</p>
                     </div>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                     <Heart size={24} className="text-amber-500 shrink-0 mt-1" />
                     <div>
                        <h4 className="text-sm font-black text-amber-700 mb-1">全身病史</h4>
                        <p className="text-xs font-medium text-amber-600/80 leading-relaxed">高血压 (药物控制中), 2型糖尿病</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="card p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/20">
               <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-6">
                  <MapPin size={18} className="text-emerald-500" />
                  地址与医保
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">家庭住址</p>
                        <p className="text-sm font-bold text-slate-700">浙江省杭州市西湖大道 88 号</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">紧急联系人</p>
                        <p className="text-sm font-bold text-slate-700">王力 (配偶) - 13900000000</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">医保单位</p>
                         <p className="text-sm font-bold text-slate-700">平安健康</p>
                     </div>
                     <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">保单号</p>
                         <p className="text-sm font-bold text-slate-700">PA-9928381-002</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Side Stats */}
         <div className="space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-lg font-black mb-6">患者统计</h3>
                  
                  <div className="space-y-6">
                     <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">建档日期</p>
                        <p className="text-2xl font-black">2023.05</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">总就诊次数</p>
                        <p className="text-2xl font-black text-emerald-400">12</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">爽约率</p>
                        <p className="text-2xl font-black text-primary">0%</p>
                     </div>
                  </div>
               </div>
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            </div>

            <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
               <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">备注</h4>
               <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  患者偏好周末预约。对疼痛较为敏感，建议治疗前进行充分表面麻醉。
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};
