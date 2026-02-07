import React, { useContext, useState } from 'react';
import { Calendar, CheckCircle, Clock, Plus, Phone, Bell } from 'lucide-react';
import { RegionContext } from '../../contexts/RegionContext';
import { useToast } from '../../contexts/ToastContext';

export const FollowupTab = () => {
  const { region, t, selectedPatient } = useContext(RegionContext);
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([
    { id: 1, title: '术后回访', date: '2026-02-10', type: 'Call', status: 'pending', note: '检查 36 牙拔牙创口愈合情况' },
    { id: 2, title: '满意度调查', date: '2026-02-15', type: 'SMS', status: 'pending', note: '系统自动发送' }
  ]);

  const completeTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'completed' } : t));
    showToast(t('common.success'), 'success');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{t('followup.title', { defaultValue: '回访管理' })}</h3>
        <button onClick={() => showToast('New Task', 'info')} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/30 border-none">
            <Plus size={18} /> {t('common.new', { defaultValue: '新增任务' })}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-4">
             {tasks.map((task, i) => (
                 <div key={task.id} className={`p-6 rounded-[2.5rem] border transition-all ${task.status === 'completed' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/30'}`}>
                     <div className="flex justify-between items-start">
                         <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                                 {task.type === 'Call' ? <Phone size={20} /> : <Bell size={20} />}
                             </div>
                             <div>
                                 <h4 className={`text-base font-black ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{task.title}</h4>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{task.note}</p>
                             </div>
                         </div>
                         <div className="text-right">
                             <div className="flex items-center gap-2 mb-2 justify-end">
                                 <Calendar size={14} className="text-slate-400" />
                                 <span className="text-xs font-black text-slate-600">{task.date}</span>
                             </div>
                             {task.status === 'pending' && (
                                 <button onClick={() => completeTask(task.id)} className="px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200">
                                     {t('common.complete', { defaultValue: '完成' })}
                                 </button>
                             )}
                         </div>
                     </div>
                 </div>
             ))}
             
             {tasks.length === 0 && (
                <div className="p-10 text-center text-slate-400">
                    <p>暂无回访任务</p>
                </div>
             )}
         </div>

         <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
             <div className="relative z-10 space-y-6">
                 <div>
                    <h3 className="text-xl font-black mb-2">智能回访分析</h3>
                    <p className="text-white/60 text-xs font-bold leading-relaxed">系统建议于 2月20日 进行回访，鉴于上次检查发现的高风险牙周状况。</p>
                 </div>
                 
                 <div className="p-4 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-md">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80">建议采取行动</span>
                        <span className="px-2 py-0.5 bg-rose-500 text-white text-[8px] font-black rounded">紧急</span>
                     </div>
                     <p className="text-sm font-black">牙周复查</p>
                     <p className="text-[10px] font-bold text-white/40 mt-1">建议日期：2026-02-20</p>
                 </div>

                 <button className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                     接受建议
                 </button>
             </div>
             
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         </div>
      </div>
    </div>
  );
};
