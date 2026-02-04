import React, { useContext } from 'react';
import { Box, Globe } from 'lucide-react';
import { RegionContext } from '../contexts/RegionContext';

export const DataPlaceholder = ({ title }) => (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-50 space-y-4 min-h-[400px]">
        <Box size={64} strokeWidth={1} />
        <p className="font-black tracking-widest uppercase text-xs">{title} - Module Coming Soon</p>
    </div>
);

export const RegionToggle = () => {
    const { region, setRegion } = useContext(RegionContext);
    return (
        <button 
            onClick={() => setRegion(region === 'cn' ? 'en' : 'cn')}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all border border-slate-100 group"
        >
            <Globe size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{region === 'cn' ? 'EN' : 'CN'}</span>
        </button>
    );
};
