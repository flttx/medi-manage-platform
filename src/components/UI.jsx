import React, { useContext } from 'react';
import { Box, Globe } from 'lucide-react';
import { RegionContext } from '../contexts/RegionContext';

export const DataPlaceholder = ({ title }) => {
    const { t } = useContext(RegionContext);
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-50 space-y-4 min-h-[400px]">
            <Box size={64} strokeWidth={1} />
            <p className="font-black tracking-widest uppercase text-xs">{title} - {t('common.comingSoon')}</p>
        </div>
    );
};

export const EmptyState = ({ title, subtitle, icon: Icon = Box, action }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-300 space-y-4 min-h-[300px]">
            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-2 shadow-inner border border-slate-100">
                <Icon size={32} strokeWidth={1.5} className="text-slate-200" />
            </div>
            <div>
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">{title}</h4>
                {subtitle && <p className="text-xs font-bold text-slate-300 mt-1 max-w-xs mx-auto">{subtitle}</p>}
            </div>
            {action && (
                <div className="pt-4">
                    {action}
                </div>
            )}
        </div>
    );
};

export const Skeleton = ({ className, variant = 'rect' }) => {
    const variants = {
        circle: 'rounded-full',
        rect: 'rounded-lg',
        card: 'rounded-[2rem]',
        pill: 'rounded-full'
    };
    return (
        <div className={`animate-pulse bg-slate-200/50 ${variants[variant]} ${className}`} />
    );
};

export const PatientTableSkeleton = () => (
    <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-50 shadow-sm">
                <div className="flex items-center gap-4">
                   <Skeleton className="w-12 h-12" variant="circle" />
                   <div className="space-y-2">
                       <Skeleton className="w-24 h-4" />
                       <Skeleton className="w-16 h-2" />
                   </div>
                </div>
                <div className="flex gap-8">
                   <Skeleton className="w-20 h-4" />
                   <Skeleton className="w-20 h-4" />
                   <Skeleton className="w-20 h-4" />
                </div>
                <Skeleton className="w-24 h-10 pill" />
            </div>
        ))}
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
