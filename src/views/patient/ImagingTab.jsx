import React, { useContext, useState, useRef } from 'react';
import { Plus, Search, Trash2, X, Maximize2, Columns, Check, UploadCloud, Activity, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegionContext } from '../../contexts/RegionContext';
import { useToast } from '../../contexts/ToastContext';
import { AIDiagnosisReport } from '../../components/dental/AIDiagnosisReport';

const AILayer = ({ type }) => {
    const findings = [
        { x: '25%', y: '40%', label: '继发龋', confidence: 0.94, detail: '修复体远中边缘可见复发性病变。' },
        { x: '65%', y: '55%', label: '根尖透射影', confidence: 0.88, detail: '慢性根尖周炎迹象。' },
        { x: '45%', y: '30%', label: '牙冠折裂', confidence: 0.91, detail: '检测到早期釉质裂纹。' },
    ].slice(0, type === 'Panorama' ? 3 : 1);

    return (
        <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Radar Scan Effect */}
            <motion.div 
                initial={{ left: '-10%' }}
                animate={{ left: '110%' }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent skew-x-12 z-20 backdrop-blur-[2px]"
            />

            <svg className="w-full h-full overflow-visible">
                {findings.map((f, i) => (
                    <g key={i} className="pointer-events-auto cursor-help group/finding">
                        <motion.circle 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                            transition={{ duration: 2, repeat: Infinity }}
                            cx={f.x} cy={f.y} r="20" 
                            className="fill-rose-500/20 stroke-rose-500 stroke-2" 
                        />
                        <circle cx={f.x} cy={f.y} r="4" className="fill-rose-500 shadow-lg shadow-rose-200" />
                        
                        {/* Tooltip */}
                        <foreignObject x={`calc(${f.x} + 25px)`} y={`calc(${f.y} - 40px)`} width="200" height="100" className="opacity-0 group-hover/finding:opacity-100 transition-opacity">
                            <div className="p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl space-y-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-[9px] font-black text-white uppercase tracking-widest">{f.label}</p>
                                    <span className="text-[8px] font-bold text-emerald-400">{Math.round(f.confidence*100)}% Match</span>
                                </div>
                                <p className="text-[11px] font-bold text-white/60 leading-tight">{f.detail}</p>
                            </div>
                        </foreignObject>
                    </g>
                ))}
            </svg>
        </div>
    );
};

const ImagingPreviewModal = ({ img, onClose, t, onSaveRecord }) => {
    const [aiMode, setAiMode] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const handleToggleAI = () => {
        if (!aiMode) {
            setAiMode(true);
            setIsScanning(true);
            setTimeout(() => setIsScanning(false), 2500);
        } else {
            setAiMode(false);
            setIsScanning(false);
        }
    };
    
    const handleAcceptAI = () => {
        onSaveRecord();
        onClose();
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1200] flex flex-col items-center justify-center p-4 lg:p-8"
        >
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl" onClick={onClose} />
            
            <div className="w-full flex justify-between items-center relative z-10 mb-8 max-w-6xl">
                <div className="flex gap-4">
                    <button 
                        onClick={handleToggleAI}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border ${aiMode ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xl shadow-indigo-500/40' : 'bg-white/10 text-white/60 border-white/10 hover:bg-white/20'}`}
                    >
                        <Activity size={18} className={aiMode ? 'animate-pulse' : ''} />
                        {aiMode ? t('imaging.activeAI') : t('imaging.enableAI')}
                    </button>
                    <div className="h-12 w-px bg-white/10" />
                    <div>
                        <h4 className="text-xl font-black text-white leading-none">{img.note}</h4>
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-2">{t(`imaging.${img.type.toLowerCase()}`)} • {img.date}</p>
                    </div>
                </div>
                <button onClick={onClose} className="w-14 h-14 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-full transition-all group flex items-center justify-center">
                    <X size={28} className="group-hover:rotate-90 transition-transform" />
                </button>
            </div>

            <div className="w-full flex-1 min-h-0 flex gap-6 relative max-w-[90vw]">
                {/* Image Container */}
                <motion.div 
                   layout
                   initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
                   className={`relative bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl flex-1 flex items-center justify-center transition-all duration-500`}
                >
                   <div className="w-full h-full relative">
                        <img 
                            src={img.url} 
                            alt="Full View" 
                            className="w-full h-full object-contain"
                        />
                        {aiMode && <AILayer type={img.type} isScanning={isScanning} />}
                   </div>
                   
                   {/* Scanning Grid Overlay */}
                   {isScanning && (
                       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
                   )}
                </motion.div>

                {/* AI Side Panel */}
                <AnimatePresence>
                    {aiMode && (
                        <motion.div 
                            initial={{ width: 0, opacity: 0 }} 
                            animate={{ width: 340, opacity: 1 }} 
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shrink-0 origin-right"
                        >
                            <AIDiagnosisReport 
                                findings={[
                                    { x: '25%', y: '40%', label: '继发龋', confidence: 0.94, detail: '修复体远中边缘可见复发性病变。' },
                                    { x: '65%', y: '55%', label: '根尖透射影', confidence: 0.88, detail: '慢性根尖周炎迹象。' },
                                    { x: '45%', y: '30%', label: '牙冠折裂', confidence: 0.91, detail: '检测到早期釉质裂纹。' },
                                ]} 
                                onAccept={handleAcceptAI} 
                                t={t} 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export const ImagingTab = () => {
    const { region, t, selectedPatient, imagingData, setImagingData, medicalRecords, setMedicalRecords } = useContext(RegionContext);
    const { showToast } = useToast();
    
    const [filter, setFilter] = useState('All');
    const [compareMode, setCompareMode] = useState(false);
    const [selectedForCompare, setSelectedForCompare] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(null);
    const fileInputRef = useRef(null);
  
    const patientImaging = imagingData.filter(img => img.patientId === selectedPatient?.id);
    const filteredImaging = filter === 'All' ? patientImaging : patientImaging.filter(img => img.type === filter);
  
    const handleUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      // Simulated upload
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            const newImg = {
              id: 'IMG' + Date.now(),
              patientId: selectedPatient.id,
              type: 'Intraoral',
              date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
              url: URL.createObjectURL(file),
              note: file.name
            };
            setImagingData([newImg, ...imagingData]);
            showToast(t('common.success'), 'success');
            setUploadProgress(null);
            return null;
          }
          return prev + 5;
        });
      }, 100);
    };
  
    const toggleCompare = (img) => {
      if (selectedForCompare.find(i => i.id === img.id)) {
        setSelectedForCompare(selectedForCompare.filter(i => i.id !== img.id));
      } else {
        if (selectedForCompare.length >= 2) {
          showToast(t('imaging.selectToCompare'), 'info');
          return;
        }
        setSelectedForCompare([...selectedForCompare, img]);
      }
    };
  
    const deleteImage = (id, e) => {
      e.stopPropagation();
      setImagingData(imagingData.filter(img => img.id !== id));
      showToast(t('common.delete'), 'info');
    };

    const handleSaveAIRecord = () => {
        const newRecord = {
            id: Date.now(),
            patientId: selectedPatient.id,
            date: new Date().toLocaleDateString('zh-CN').replace(/\//g, '.'),
            i: medicalRecords.length + 1,
            type: 'AI 辅助诊断',
            dr: '智能助手',
            cc: "AI 影像分析发现疑似病灶",
            dx: "疑似继发龋 (#36), 根尖主要透射影 (#36), 牙冠折裂 (#46)",
            plan: "建议进行临床探查确认，必要时进行根管治疗或冠修复。",
            images: true,
            affectedTeeth: [36, 46]
        };
        setMedicalRecords([newRecord, ...medicalRecords]);
        showToast('已生成 AI 诊断病历', 'success');
    };
  
    const categories = ['All', 'Panorama', 'CT', 'Intraoral', 'Cephalometric'];
  
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 bg-white/50 p-6 rounded-[2.5rem] border border-white shadow-sm backdrop-blur-md">
          <div className="space-y-4 w-full md:w-auto">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{t('imaging.center')}</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
                >
                  {cat === 'All' ? t('common.all') : t(`imaging.${cat.toLowerCase()}`)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => {
                if (compareMode && selectedForCompare.length === 2) {
                  // Keep selected for view
                } else {
                  setCompareMode(!compareMode);
                  setSelectedForCompare([]);
                }
              }}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${compareMode ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-slate-400 border-slate-100 hover:text-primary hover:border-primary/30'}`}
            >
              <Columns size={16} /> 
              {compareMode ? (selectedForCompare.length === 2 ? t('common.compare') : t('imaging.exitCompare')) : t('common.compare')}
            </button>
            
            <button 
              onClick={() => fileInputRef.current.click()}
              disabled={uploadProgress !== null}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 border-none disabled:opacity-50"
            >
              {uploadProgress !== null ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('common.uploading', { progress: uploadProgress })}
                </div>
              ) : (
                <><UploadCloud size={18} /> {t('imaging.upload')}</>
              )}
            </button>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} accept="image/*" />
          </div>
        </div>
  
        {/* Compare View Overlay */}
        <AnimatePresence>
          {compareMode && selectedForCompare.length === 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 z-[1200] bg-slate-950 p-4 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center px-4">
                <h2 className="text-white font-black text-xs uppercase tracking-[0.3em]">{t('imaging.compareMode')}</h2>
                <button onClick={() => { setCompareMode(false); setSelectedForCompare([]); }} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all group">
                  <X size={24} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                {selectedForCompare.map(img => (
                  <div key={img.id} className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/5 flex flex-col">
                    <div className="flex-1 relative">
                      <img src={img.url} className="w-full h-full object-contain" alt="" />
                    </div>
                    <div className="p-6 bg-black/40 backdrop-blur-md flex justify-between items-center">
                      <div>
                        <p className="text-white font-black text-sm">{img.note}</p>
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{img.type} • {img.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Grid Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredImaging.map(img => (
              <motion.div 
                key={img.id} 
                layout
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => {
                  if (compareMode) toggleCompare(img);
                  else setPreviewImage(img);
                }}
                className={`group relative bg-white rounded-[2.5rem] border shadow-xl shadow-slate-200/20 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer ${selectedForCompare.find(i => i.id === img.id) ? 'border-primary ring-4 ring-primary/20 bg-primary/5' : 'border-slate-100'}`}
              >
                <div className="aspect-square relative overflow-hidden bg-slate-50">
                  <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  
                  {/* Selection Badge for Compare */}
                  {compareMode && selectedForCompare.find(i => i.id === img.id) && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg animate-in zoom-in">
                        <Check size={24} strokeWidth={4} />
                      </div>
                    </div>
                  )}
  
                  {/* Overlays */}
                  {!compareMode && (
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30"><Maximize2 size={22} /></div>
                      <button onClick={(e) => deleteImage(img.id, e)} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-rose-500 transition-all border border-white/30"><Trash2 size={22} /></button>
                    </div>
                  )}
  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-primary text-[9px] font-black rounded-xl border border-white/50 shadow-sm uppercase tracking-widest">{t(`imaging.${img.type.toLowerCase()}`)}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-black text-slate-700 truncate">{img.note}</p>
                    <span className="text-[10px] font-black text-slate-300 tabular-nums">{img.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
  
        {/* Image Preview Lightbox with AI Mode */}
        <AnimatePresence>
          {previewImage && (
            <ImagingPreviewModal 
              img={previewImage} 
              onClose={() => setPreviewImage(null)} 
              t={t}
              onSaveRecord={handleSaveAIRecord}
            />
          )}
        </AnimatePresence>
  
        {/* Empty State */}
        {filteredImaging.length === 0 && (
          <div className="p-20 flex flex-col items-center justify-center text-slate-300 space-y-4 bg-white/30 rounded-[3rem] border-2 border-dashed border-slate-100">
             <Search size={48} strokeWidth={1} className="opacity-20" />
             <p className="font-black text-xs uppercase tracking-[0.2em]">{t('patient.notFound')}</p>
          </div>
        )}
      </div>
    );
  };
