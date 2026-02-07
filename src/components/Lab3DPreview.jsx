import React, { useState } from 'react';
import { Diagnostic3DModel } from './dental/Diagnostic3DModel';
import { Check, X, MessageSquare, Plus, Ruler, Eye, Smartphone, LayoutGrid, Box } from 'lucide-react';
import { motion } from 'framer-motion';

export const Lab3DPreview = ({ order, onClose, onApprove, onRequestChanges, t }) => {
  const [activeTool, setActiveTool] = useState('view');
  
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
        
        <div className="w-full max-w-7xl h-full max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative border border-white z-10 animate-in zoom-in-95 duration-300">
          
          {/* Header - Floating Glass */}
          <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
               <div className="flex items-center gap-4 pointer-events-auto bg-white/80 backdrop-blur-xl border border-slate-100 p-2 pr-6 rounded-2xl shadow-xl">
                   <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                       <Box size={20} strokeWidth={2} />
                   </div>
                  <div>
                           <h2 className="text-sm font-black text-slate-800 tracking-wide">{t ? t('lab.preview3d') : '3D Preview'}</h2>
                           <div className="flex items-center gap-2">
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order?.patientName}</span>
                               <span className="w-1 h-1 rounded-full bg-slate-200" />
                               <span className="text-[10px] font-bold text-primary uppercase tracking-widest">#{order?.teeth?.join(',') || '36'}</span>
                           </div>
                       </div>
                   </div>
   
                   <div className="flex items-center gap-3 pointer-events-auto">
                      <div className="bg-white/80 backdrop-blur-xl border border-slate-100 px-4 py-2 rounded-xl flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{t ? t('lab.liveConnection') : 'Live Connection'}</span>
                      </div>
                      <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-xl border border-slate-100 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-xl">
                          <X size={18} />
                      </button>
                   </div>
               </div>

           {/* Main 3D Area */}
           <div className="flex-1 relative bg-slate-50">
             <Diagnostic3DModel activeToothId={order?.teeth?.[0] || 36} status="implant" />
             
             {/* Floating Toolbar */}
             <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                 {[
                    { id: 'measure', icon: Ruler, label: t ? t('lab.measurements') : 'Measurements' },
                    { id: 'view', icon: Eye, label: t ? t('lab.viewModes') : 'View Modes' },
                    { id: 'grid', icon: LayoutGrid, label: t ? t('lab.gridOverlay') : 'Grid Overlay' },
                    { id: 'mobile', icon: Smartphone, label: t ? t('lab.sendToPatient') : 'Send to Patient' },
                 ].map(tool => (
                    <button 
                       key={tool.id}
                       onClick={() => setActiveTool(tool.id)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border backdrop-blur-md shadow-xl group relative ${
                           activeTool === tool.id 
                           ? 'bg-primary border-primary text-white' 
                           : 'bg-white/80 border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-primary hover:border-primary/20'
                        }`}
                    >
                        <tool.icon size={20} strokeWidth={2} />
                         {/* Tooltip */}
                         <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transform -translate-x-2 group-hover:translate-x-0">
                            {tool.label}
                         </div>
                    </button>
                 ))}
             </div>

               <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none">
                   <div className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-slate-100 p-1.5 rounded-2xl flex gap-1 shadow-2xl">
                      <button className="px-4 py-2 rounded-xl hover:bg-slate-50 transition-all text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">{t ? t('lab.layers') : 'Layers'}</button>
                      <button className="px-4 py-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 text-[10px] font-black uppercase tracking-widest">{t ? t('lab.composite') : 'Composite'}</button>
                      <button className="px-4 py-2 rounded-xl hover:bg-slate-50 transition-all text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">{t ? t('lab.marginLine') : 'Margin Line'}</button>
                   </div>

                 <div className="flex gap-4 pointer-events-auto">
                     <button 
                        onClick={onRequestChanges}
                        className="px-6 py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-xl"
                     >
                         <MessageSquare size={16} strokeWidth={2.5} />
                          <span>{t ? t('lab.requestChanges') : 'Request Changes'}</span>
                     </button>
                     <button 
                        onClick={onApprove}
                        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest backdrop-blur-xl active:scale-95"
                     >
                         <Check size={16} strokeWidth={3} />
                          <span>{t ? t('lab.approveDesign') : 'Approve Design'}</span>
                     </button>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );
};
