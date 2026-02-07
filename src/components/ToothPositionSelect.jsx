import React, { useState, useMemo, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, LayoutGrid, ArrowUp, ArrowDown, X, Check } from 'lucide-react';
import { RegionContext } from '../contexts/RegionContext';
import { TOOTH_DATA, TOOTH_STATUSES, TOOTH_SURFACES } from './ToothData';



export const ToothPositionSelect = ({ 
  visible, 
  onClose, 
  onSelect, 
  initialSelected = [], 
  single = false 
}) => {
  const { region, t } = useContext(RegionContext);
  const [selected, setSelected] = useState(new Map(initialSelected.map(t => [t.id, { status: t.status, surfaces: t.surfaces || [] }])));
  const [activeStatus, setActiveStatus] = useState('caries');
  const [hoveredId, setHoveredId] = useState(null);
  const [focusedTooth, setFocusedTooth] = useState(null); // { id, side }





  const toggleTooth = (id) => {
    const newSelected = new Map(selected);
    if (newSelected.has(id)) {
        if (newSelected.get(id).status === activeStatus && !focusedTooth) {
            newSelected.delete(id);
        } else {
            newSelected.set(id, { ...newSelected.get(id), status: activeStatus });
        }
    } else {
        if (single) newSelected.clear();
        newSelected.set(id, { status: activeStatus, surfaces: [] });
    }
    setSelected(newSelected);
  };

  const handleConfirm = () => {
    const results = Array.from(selected.entries()).map(([id, data]) => ({ id, ...data }));
    onSelect(results.sort((a, b) => a.id - b.id));
    onClose();
  };

  const selectAll = () => {
    const all = [...TOOTH_DATA.upper, ...TOOTH_DATA.lower].map(t => [t.id, { status: activeStatus, surfaces: [] }]);
    setSelected(new Map(all));
  };

  const selectUpper = () => {
    const upper = TOOTH_DATA.upper.map(t => [t.id, { status: activeStatus, surfaces: [] }]);
    setSelected(new Map([...selected, ...upper]));
  };

  const selectLower = () => {
    const lower = TOOTH_DATA.lower.map(t => [t.id, { status: activeStatus, surfaces: [] }]);
    setSelected(new Map([...selected, ...lower]));
  };

  const clear = () => setSelected(new Map());

  const updateSurfaces = (id, surfaces) => {
      const newSelected = new Map(selected);
      if (!newSelected.has(id)) {
          newSelected.set(id, { status: activeStatus, surfaces });
      } else {
          newSelected.set(id, { ...newSelected.get(id), surfaces });
      }
      setSelected(newSelected);
  };



  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] w-full max-w-2xl relative shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
                {t('toothChart.selectPosition')}
            </h3>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all">
                <X size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="px-8 flex-1 overflow-y-auto">
            {/* Status Palette */}
            <div className="flex flex-wrap gap-3 mb-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                {TOOTH_STATUSES.map(s => (
                    <button 
                        key={s.id}
                        onClick={() => setActiveStatus(s.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${activeStatus === s.id ? `${s.color} text-white border-transparent shadow-lg scale-105` : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                    >
                        <div className={`w-2 h-2 rounded-full ${activeStatus === s.id ? 'bg-white' : s.color}`} />
                        {t('toothChart.status.' + s.id)}
                    </button>
                ))}
            </div>

            {/* Quick Actions */}
            {!single && (

                <div className="flex gap-2 mb-6">
                    <button onClick={selectAll} className="px-4 py-2 bg-slate-50 hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 group">
                        <LayoutGrid size={14} className="group-hover:scale-110 transition-transform" /> {t('toothChart.fullArch')}
                    </button>
                    <button onClick={selectUpper} className="px-4 py-2 bg-slate-50 hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 group">
                        <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" /> {t('toothChart.upperArch')}
                    </button>
                    <button onClick={selectLower} className="px-4 py-2 bg-slate-50 hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 group">
                        <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" /> {t('toothChart.lowerArch')}
                    </button>
                    <button onClick={clear} className="px-4 py-2 bg-slate-100 hover:bg-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider ml-auto transition-all flex items-center gap-2">
                        <RotateCcw size={14} /> {t('toothChart.clear')}
                    </button>
                </div>
            )}

            {/* SVG Wrapper */}
            <div className="relative aspect-[180/290] max-w-[320px] mx-auto bg-slate-50/20 rounded-[3rem] p-8 border border-slate-100 mb-8 shadow-inner">
                <svg viewBox="0 0 180 290" className="w-full h-auto overflow-visible select-none drop-shadow-sm">
                    {/* Upper Jaw */}
                    <g transform="translate(0, 0)">
                        {/* We render regular teeth first */}
                        {TOOTH_DATA.upper.map(t => {
                            const isSelected = selected.has(t.id);
                            const statusObj = isSelected ? TOOTH_STATUSES.find(s => s.id === selected.get(t.id)?.status) : null;
                            
                            return (
                                <g 
                                    key={t.id} 
                                    className="cursor-pointer group" 
                                    onMouseEnter={() => setHoveredId(t.id)} 
                                    onMouseLeave={() => setHoveredId(null)}
                                    onClick={() => toggleTooth(t.id)}
                                >
                                    <path 
                                        d={t.tooth} 
                                        className={`transition-all duration-200 ${isSelected ? (
                                            `${statusObj?.fill || 'fill-primary'} ${statusObj?.stroke || 'stroke-primary'} animate-in zoom-in-95 brightness-100 hover:brightness-90`
                                        ) : (
                                            'fill-white stroke-slate-200 group-hover:fill-blue-100/50 group-hover:stroke-blue-400 group-hover:shadow-lg'
                                        )}`} 
                                        strokeWidth="0.8"
                                        strokeDasharray={isSelected && statusObj?.dashed ? "2,1" : "0"}
                                    />
                                    {/* Render original text path for perfect positioning */}
                                    <path 
                                        d={t.text} 
                                        className={`pointer-events-none transition-all duration-200 ${isSelected ? 'fill-white' : 'fill-slate-300 group-hover:fill-primary'}`} 
                                        fillRule="evenodd"
                                    />
                                </g>
                            );
                        })}
                    </g>

                    {/* Lower Jaw */}
                    <g transform="translate(0, 155)">
                        {TOOTH_DATA.lower.map(t => {
                            const isSelected = selected.has(t.id);
                            const statusObj = isSelected ? TOOTH_STATUSES.find(s => s.id === selected.get(t.id)?.status) : null;

                            return (
                                <g 
                                    key={t.id} 
                                    className="cursor-pointer group" 
                                    onMouseEnter={() => setHoveredId(t.id)} 
                                    onMouseLeave={() => setHoveredId(null)}
                                    onClick={() => toggleTooth(t.id)}
                                >
                                    <path 
                                        d={t.tooth} 
                                        className={`transition-all duration-200 ${isSelected ? (
                                            `${statusObj?.fill || 'fill-primary'} ${statusObj?.stroke || 'stroke-primary'} animate-in zoom-in-95 brightness-100 hover:brightness-90`
                                        ) : (
                                            'fill-white stroke-slate-200 group-hover:fill-blue-100/50 group-hover:stroke-blue-400 group-hover:shadow-lg'
                                        )}`} 
                                        strokeWidth="0.8"
                                        strokeDasharray={isSelected && statusObj?.dashed ? "2,1" : "0"}
                                    />
                                    {/* Render original text path for perfect positioning */}
                                    <path 
                                        d={t.text} 
                                        className={`pointer-events-none transition-all duration-200 ${isSelected ? 'fill-white' : 'fill-slate-300 group-hover:fill-primary'}`} 
                                        fillRule="evenodd"
                                    />
                                </g>
                            );
                        })}
                    </g>
                    
                    {/* Hover Display */}
                    <foreignObject x="40" y="100" width="100" height="80" style={{ pointerEvents: 'none' }}>
                        <div className="w-full h-full flex items-center justify-center pointer-events-none">
                            <AnimatePresence>
                                {hoveredId ? (
                                    (() => {
                                        const record = selected.get(hoveredId);
                                        const status = record ? TOOTH_STATUSES.find(s => s.id === record.status) : null;
                                        return (
                                            <motion.div 
                                                key={hoveredId}
                                                initial={{ opacity: 0, scale: 0.8, y: 10 }} 
                                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                                className={`text-5xl font-black ${status ? status.iconColor : 'text-primary'} flex flex-col items-center justify-center`}
                                            >
                                                <span className={`text-[10px] uppercase tracking-widest mb-1 ${status ? status.iconColor : 'text-slate-400'}`}>
                                                    {status ? t('toothChart.status.' + status.id) : t('toothChart.tooth')}
                                                </span>
                                                {hoveredId}
                                            </motion.div>
                                        );
                                    })()
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                                        className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] text-center"
                                    >
                                        {t('toothChart.hoverPreview')}
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </div>
                    </foreignObject>
                </svg>
            </div>

            {/* Result Panel */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-8 relative group/panel overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover/panel:bg-primary/10 transition-all duration-500" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex justify-between">
                    <span>{t('toothChart.selectedTeeth')}</span>
                    <span className="text-primary/40 font-black">{selected.size} {t('toothChart.unit')}</span>
                </p>
                <div className="flex flex-wrap gap-2 relative z-10">
                    <AnimatePresence>
                        {focusedTooth && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute bottom-full mb-4 left-0 z-50 origin-bottom-left"
                            >
                                <ToothSurfacePicker 
                                    selectedSurfaces={selected.get(focusedTooth)?.surfaces || []}
                                    region={region}
                                    onChange={(surfaces) => updateSurfaces(focusedTooth, surfaces)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {selected.size === 0 ? (

                        <span className="text-sm font-bold text-slate-300 italic flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-200 animate-pulse" />
                             {t('toothChart.clickToSelect')}
                        </span>
                    ) : (
                        Array.from(selected.entries()).sort((a,b)=>a[0]-b[0]).map(([id, data]) => (
                            <motion.span 
                                key={id} 
                                layoutId={`selected-${id}`}
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }}
                                className={`px-3 py-1.5 bg-white text-[11px] font-black rounded-xl border flex items-center gap-2 group-hover:scale-105 transition-all shadow-sm ${TOOTH_STATUSES.find(s => s.id === data.status)?.stroke || 'border-primary/10'} ${focusedTooth === id ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFocusedTooth(id === focusedTooth ? null : id);
                                }}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${TOOTH_STATUSES.find(s => s.id === data.status)?.color || 'bg-primary'}`} />
                                <span className="text-slate-700">#{id}</span>
                                {data.surfaces?.length > 0 && (
                                    <span className="text-[8px] font-black text-primary/50 border-l border-slate-100 pl-1.5 ml-0.5">{data.surfaces.join(',')}</span>
                                )}
                                <button className="ml-1 text-slate-300 hover:text-red-500 transition-colors" onClick={(e) => { e.stopPropagation(); toggleTooth(id); }}><X size={10} strokeWidth={4} /></button>
                            </motion.span>
                        ))
                    )}


                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-0 flex gap-4">
            <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-xs text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest">{t('common.cancel')}</button>
            <button onClick={handleConfirm} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-2 group">
                <Check size={18} strokeWidth={3} className="group-hover:scale-110 transition-transform" /> {t('common.save')}
            </button>

        </div>
      </motion.div>
    </div>
  );
};

const ToothSurfacePicker = ({ selectedSurfaces = [], onChange, region }) => {
    const { t } = useContext(RegionContext); // Added t here
    const toggleSurface = (id) => {
        if (selectedSurfaces.includes(id)) {
            onChange(selectedSurfaces.filter(s => s !== id));
        } else {
            onChange([...selectedSurfaces, id]);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative">
            <div className="relative w-32 h-32 flex items-center justify-center p-2">
                {/* 5-Surface Cross Diagram */}
                <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-1">
                    <div />
                    <SurfaceButton id="B" active={selectedSurfaces.includes('B')} onClick={() => toggleSurface('B')} label="B" classes="rounded-t-lg" />
                    <div />
                    
                    <SurfaceButton id="M" active={selectedSurfaces.includes('M')} onClick={() => toggleSurface('M')} label="M" classes="rounded-l-lg" />
                    <SurfaceButton id="O" active={selectedSurfaces.includes('O')} onClick={() => toggleSurface('O')} label="O" classes="rounded-none" />
                    <SurfaceButton id="D" active={selectedSurfaces.includes('D')} onClick={() => toggleSurface('D')} label="D" classes="rounded-r-lg" />
                    
                    <div />
                    <SurfaceButton id="L" active={selectedSurfaces.includes('L')} onClick={() => toggleSurface('L')} label="L" classes="rounded-b-lg" />
                    <div />
                </div>
            </div>
            <div className="text-center">
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{t('toothChart.clickToMarkSurfaces')}</p>
                <div className="flex gap-1 justify-center mt-2">
                    {TOOTH_SURFACES.map(s => (
                        <div key={s.id} className={`w-1.5 h-1.5 rounded-full ${selectedSurfaces.includes(s.id) ? 'bg-primary' : 'bg-slate-100'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const SurfaceButton = ({ active, onClick, label, classes }) => (
    <button 
        onClick={onClick}
        type="button"
        className={`w-full h-full flex items-center justify-center text-[10px] font-black transition-all ${active ? 'bg-primary text-white shadow-inner scale-[0.98]' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'} ${classes}`}
    >
        {label}
    </button>
);
