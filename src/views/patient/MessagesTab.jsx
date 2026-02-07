import React, { useContext, useState } from 'react';
import { Send, Phone, Video, Mic, Paperclip, MessageSquare, FileText, CheckCircle } from 'lucide-react';
import { RegionContext } from '../../contexts/RegionContext';
import { useToast } from '../../contexts/ToastContext';

export const MessagesTab = () => {
  const { region, t, selectedPatient } = useContext(RegionContext);
  const { showToast } = useToast();
  const [subTab, setSubTab] = useState('chat');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    showToast('Message sent', 'success');
    setMessage('');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden relative">
      {/* Premium Chat Header */}
      <div className="flex justify-between items-center shrink-0 px-8 py-5 border-b border-slate-50 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
           <div className="relative">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPatient?.name}`} className="w-12 h-12 rounded-2xl bg-slate-50 border-2 border-white shadow-sm" alt="" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
           </div>
           <div>
              <h3 className="text-base font-black text-slate-800 tracking-tight leading-none mb-1.5">{selectedPatient?.name}</h3>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">在线就诊中</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 mr-2">
              {['chat', 'advice', 'video'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setSubTab(tab)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {t(`communication.${tab}`, { defaultValue: tab })}
                </button>
              ))}
           </div>
           <button className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-500 hover:border-emerald-100 transition-all shadow-sm group">
              <Phone size={20} className="group-hover:scale-110 transition-transform" />
           </button>
           <button className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-primary/5 hover:text-primary hover:border-primary/10 transition-all shadow-sm group">
              <Video size={20} className="group-hover:scale-110 transition-transform" />
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-50/20">
        {subTab === 'chat' && (
          <>
             {/* Chat History */}
             <div className="flex-1 p-8 overflow-y-auto space-y-8 custom-scrollbar scroll-smooth">
                <div className="flex justify-center">
                   <span className="text-[10px] font-black text-slate-300 bg-white border border-slate-100 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm">
                      2026年2月6日
                   </span>
                </div>
                
                {/* Patient Message */}
                <div className="flex gap-5 max-w-[85%] group">
                   <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-sm shrink-0 flex items-center justify-center p-0.5 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPatient?.name}`} className="w-full h-full rounded-xl" alt="" />
                   </div>
                   <div className="space-y-2">
                      <div className="bg-white p-5 rounded-[2rem] rounded-tl-none border border-slate-100 shadow-xl shadow-slate-200/20">
                         <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                            医生您好，昨晚治疗后左下牙有点疼，这正常吗？
                         </p>
                      </div>
                      <div className="flex items-center gap-2 pl-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">10:23 AM</span>
                      </div>
                   </div>
                </div>

                {/* Doctor Message */}
                <div className="flex gap-5 max-w-[85%] flex-row-reverse self-end ml-auto group">
                   <div className="w-10 h-10 rounded-2xl bg-primary shadow-lg shadow-primary/20 shrink-0 flex items-center justify-center p-0.5 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=doctor`} className="w-full h-full rounded-xl" alt="" />
                   </div>
                   <div className="space-y-2 flex flex-col items-end">
                      <div className="bg-gradient-to-br from-primary to-blue-600 p-5 rounded-[2rem] rounded-tr-none shadow-2xl shadow-primary/30 text-white min-w-[200px]">
                         <p className="text-sm font-black leading-relaxed">
                            您好 {selectedPatient?.name} 先生，治疗后 24-48 小时内有轻微敏感是正常的。如果疼痛加剧或持续不退，请及时告知。目前的饮食建议避开过冷或过热的食物。
                         </p>
                      </div>
                      <div className="flex items-center gap-2 pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <CheckCircle size={10} className="text-emerald-500" />
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">10:25 AM</span>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Rich Input Area */}
             <div className="p-6 bg-white border-t border-slate-50 relative shrink-0 z-10">
                <div className="max-w-4xl mx-auto flex gap-4 items-end bg-slate-50 p-3 rounded-[2.5rem] border border-slate-100/50 shadow-inner">
                   <div className="flex gap-1 pl-2 mb-1.5">
                      <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white rounded-xl transition-all"><Paperclip size={20} /></button>
                      <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white rounded-xl transition-all"><Mic size={20} /></button>
                   </div>
                   
                   <div className="flex-1 min-h-[48px] flex items-center pb-1">
                      <textarea 
                         value={message}
                         onChange={e => setMessage(e.target.value)}
                         placeholder="输入您的消息..." 
                         className="w-full bg-transparent border-none focus:ring-0 outline-none p-0 text-sm font-bold text-slate-700 placeholder:text-slate-300 resize-none max-h-32 custom-scrollbar"
                         onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                               e.preventDefault();
                               handleSend();
                            }
                         }}
                         rows={1}
                      />
                   </div>

                   <button 
                      onClick={handleSend} 
                      disabled={!message.trim()}
                      className={`w-12 h-12 rounded-[1.5rem] flex items-center justify-center transition-all shadow-xl ${message.trim() ? 'bg-primary text-white shadow-primary/30 hover:scale-110 active:scale-95' : 'bg-slate-200 text-slate-400 scale-90 opacity-50'}`}
                   >
                      <Send size={20} strokeWidth={2.5} />
                   </button>
                </div>
             </div>
          </>
        )}

        {subTab === 'advice' && (
           <div className="p-12 flex flex-col items-center justify-center h-full text-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-xl shadow-indigo-100/50">
                 <FileText size={40} />
              </div>
              <div className="space-y-3">
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">智能指令模板</h3>
                 <p className="text-xs font-bold text-slate-400 max-w-sm leading-relaxed uppercase tracking-widest">快速发送术后注意事项、日常护理建议或处方告知到患者移动端。</p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
                 {[
                   { t: '术后护理', icon: '🩹' }, 
                   { t: '刷牙指导', icon: '🪥' }, 
                   { t: '饮食建议', icon: '🥗' }, 
                   { t: '用药指南', icon: '💊' }
                 ].map(item => (
                    <button 
                       key={item.t} 
                       onClick={() => showToast(`已发送: ${item.t}`, 'success')} 
                       className="p-6 bg-white border border-slate-100 rounded-[2rem] text-sm font-black text-slate-600 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all flex flex-col items-center gap-3 active:scale-95"
                    >
                       <span className="text-2xl">{item.icon}</span>
                       {item.t}
                    </button>
                 ))}
              </div>
           </div>
        )}

        {subTab === 'video' && (
           <div className="flex-1 bg-slate-900 relative">
               <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000" className="w-full h-full object-cover opacity-60 mix-blend-overlay" alt="Video Call" />
               <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/80" />
               <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
                  <div className="w-32 h-32 rounded-full border-[6px] border-white/10 flex items-center justify-center animate-pulse shadow-2xl bg-white/5 backdrop-blur-sm mb-8">
                     <Video size={56} className="text-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-4xl font-black tracking-tighter mb-4 drop-shadow-md">{selectedPatient?.name}</h3>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full mb-12">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">正在建立加密专线...</span>
                  </div>
                  <div className="flex gap-10">
                     <button className="w-20 h-20 rounded-[2.5rem] bg-rose-500 flex items-center justify-center shadow-2xl shadow-rose-900/50 hover:scale-110 active:scale-90 transition-all border border-rose-400/50 group">
                        <Phone size={32} className="rotate-[135deg] group-hover:scale-110 transition-transform" />
                     </button>
                     <button className="w-20 h-20 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all shadow-2xl group">
                        <Mic size={32} className="group-hover:scale-110 transition-transform" />
                     </button>
                  </div>
               </div>
           </div>
        )}
      </div>
    </div>
  );
};
