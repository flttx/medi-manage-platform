import React, { useContext, useState } from 'react';
import { 
  Box, 
  Search, 
  Filter, 
  Maximize2, 
  Download, 
  Share2,
  Layers,
  Activity,
  ChevronRight,
  Database,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegionContext } from '../contexts/RegionContext';
import { Diagnostic3DModel } from '../components/dental/Diagnostic3DModel';

const ScanCard = ({ scan, onClick, active }) => {
    return (
        <motion.div 
            whileHover={{ y: -4 }}
            onClick={onClick}
            className={`p-5 rounded-3xl border transition-all cursor-pointer group ${active ? 'bg-primary/5 border-primary shadow-xl shadow-primary/10' : 'bg-white border-slate-100 hover:border-primary/20 hover:shadow-lg hover:shadow-slate-100'}`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                    <Box size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight truncate">{scan.name}</span>
                        <span className="text-[8px] font-black px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded-md border border-slate-100 uppercase">{scan.format}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{scan.date} • {scan.size}</p>
                </div>
                <ChevronRight size={14} className={`transition-transform duration-300 ${active ? 'text-primary' : 'text-slate-200 group-hover:text-primary group-hover:translate-x-1'}`} />
            </div>
        </motion.div>
    );
};

export const ScanCenterView = () => {
    const { t } = useContext(RegionContext);
    const [selectedScan, setSelectedScan] = useState(0);

    const mockScans = [
        { id: 0, name: t('imaging.intraoral') + ' - Upper Arch', date: '2026.02.04', format: 'STL', size: '12.4 MB', tooth: 11 },
        { id: 1, name: t('imaging.intraoral') + ' - Lower Arch', date: '2026.02.04', format: 'STL', size: '11.8 MB', tooth: 36 },
        { id: 2, name: 'Diagnostic Waxup', date: '2026.02.05', format: 'OBJ', size: '24.1 MB', tooth: 11 },
        { id: 3, name: 'Post-Op Smile Simulation', date: '2026.02.06', format: 'PLY', size: '8.2 MB', tooth: 21 },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50/30">
            {/* Header */}
            <header className="p-8 lg:px-12 bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-xl">
                            <Box size={24} />
                        </div>
                        {t('modules.threed')}
                    </h2>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{t('imaging.threedScan') || '数字化 3D 扫描中心'}</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder={t('common.search')} 
                            className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100/50 rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none w-48 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-95">
                        <Filter size={14} /> {t('common.filter')}
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 border-none active:scale-95">
                        <Download size={14} /> {t('common.export')}
                    </button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden p-6 lg:p-8 gap-8">
                {/* Left Sidebar - Scan List */}
                <div className="w-80 flex flex-col gap-6 shrink-0 h-full">
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex-1 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none border-l-2 border-primary pl-2">{t('common.records')}</h4>
                            <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">{mockScans.length}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                            {mockScans.map((scan) => (
                                <ScanCard 
                                    key={scan.id} 
                                    scan={scan} 
                                    onClick={() => setSelectedScan(scan.id)}
                                    active={selectedScan === scan.id}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <h5 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">{t('common.comingSoon') || 'Cloud Sync'}</h5>
                        <p className="text-sm font-black leading-tight mb-4">Sync 3D scans directly from intraoral scanners.</p>
                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                            <Smartphone size={14} /> Connect Scanner
                        </button>
                    </div>
                </div>

                {/* Main Viewport - 3D Visualizer */}
                <div className="flex-1 bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
                    
                    <div className="absolute inset-0 z-10">
                        <Diagnostic3DModel activeToothId={mockScans[selectedScan].tooth} />
                    </div>

                    {/* Toolbar Overlay */}
                    <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-20 pointer-events-none">
                        <div className="p-2 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl shadow-slate-200/50 flex flex-col gap-2 pointer-events-auto">
                           {[
                               { icon: <Maximize2 size={16} />, label: t('lab.preview3d') },
                               { icon: <Layers size={16} />, label: t('lab.layers') },
                               { icon: <Activity size={16} />, label: t('lab.measurements') },
                               { icon: <Database size={16} />, label: t('imaging.enableAI') }
                           ].map((tool, i) => (
                               <button key={i} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-primary hover:bg-white transition-all">
                                   {tool.icon}
                               </button>
                           ))}
                        </div>

                        <div className="flex flex-col items-end gap-3 pointer-events-auto">
                            <div className="px-5 py-3 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl shadow-slate-200/50 text-right">
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{t('common.status')}</p>
                                <p className="text-xs font-black text-emerald-500 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    {t('lab.liveConnection') || 'Live Preview'}
                                </p>
                            </div>
                            <button className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-2xl shadow-xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Overlay */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 bg-white/80 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 z-20 flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{t('case.dentalDesign') || 'CAD DESIGN'}</p>
                                <p className="text-[10px] font-black text-slate-800 uppercase">{mockScans[selectedScan].name}</p>
                            </div>
                            <div className="w-px h-6 bg-slate-100" />
                            <div className="flex gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                <span className="text-primary">#11</span>
                                <span>#36</span>
                                <span>#46</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
