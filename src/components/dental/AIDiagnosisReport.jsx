import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight,
  BrainCircuit,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIDiagnosisReport = ({ findings, onAccept, t }) => {
  const [stage, setStage] = useState('analyzing'); // analyzing, generating, done
  const [typedText, setTypedText] = useState('');
  
  const reportText = "AI 分析显示 #36 和 #37 远中面存在潜在龋坏。骨密度在正常范围内。#46 周围观察到轻微牙周膜增宽。建议：进行临床验证并考虑修复治疗。";

  useEffect(() => {
    if (stage === 'analyzing') {
       const timer = setTimeout(() => setStage('generating'), 2000);
       return () => clearTimeout(timer);
    }
    
    if (stage === 'generating') {
        let i = 0;
        const interval = setInterval(() => {
            setTypedText(reportText.slice(0, i));
            i++;
            if (i > reportText.length) {
                clearInterval(interval);
                setStage('done');
            }
        }, 20);
        return () => clearInterval(interval);
    }
  }, [stage]);

  return (
    <div className="w-80 h-full bg-slate-900/95 border-l border-white/10 flex flex-col backdrop-blur-xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                    <BrainCircuit size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-black text-white tracking-tight">AI 智能诊断</h3>
                    <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">Beta v2.0</p>
                </div>
            </div>
            {stage === 'analyzing' && <Activity size={16} className="text-indigo-500 animate-pulse" />}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
            
            {/* Status */}
            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">系统状态</p>
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className={`w-2 h-2 rounded-full ${stage === 'done' ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`} />
                    <span className="text-xs font-bold text-white">
                        {stage === 'analyzing' && '正在扫描影像...'}
                        {stage === 'generating' && '正在生成报告...'}
                        {stage === 'done' && '分析完成'}
                    </span>
                </div>
            </div>

            {/* Findings List */}
            <AnimatePresence>
                {stage !== 'analyzing' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">关键发现</p>
                        <div className="space-y-2">
                            {findings.map((f, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors group cursor-pointer"
                                >
                                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${f.confidence > 0.9 ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'}`}>
                                        <AlertTriangle size={10} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white">{f.label}</p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-1">{f.detail}</p>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <span className="text-[9px] font-black text-emerald-400">{Math.round(f.confidence*100)}%</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Generated Report */}
            <AnimatePresence>
                {stage !== 'analyzing' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">AI 病例报告</p>
                         <div className="p-4 bg-indigo-950/30 rounded-2xl border border-indigo-500/20 font-mono text-[10px] leading-relaxed text-indigo-200">
                             {typedText}
                             {stage === 'generating' && <span className="w-1.5 h-3 inline-block bg-indigo-500 ml-1 animate-pulse" />}
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-slate-900/50">
            <button 
                disabled={stage !== 'done'}
                onClick={onAccept}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2"
            >
                <Bot size={16} /> 接受并保存至病历
            </button>
        </div>
    </div>
  );
};
