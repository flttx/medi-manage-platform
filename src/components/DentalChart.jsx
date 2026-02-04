import React from 'react';

export const DentalChart = () => {
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-1.5">
                {[18, 17, 16, 15, 14, 13, 12, 11].map(n => (
                    <div key={n} className="w-7 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[9px] font-black text-slate-400 hover:bg-primary/5 hover:text-primary cursor-pointer transition-all">
                        {n}
                    </div>
                ))}
                <div className="w-4" />
                {[21, 22, 23, 24, 25, 26, 27, 28].map(n => (
                    <div key={n} className={`w-7 h-9 border rounded-lg flex items-center justify-center text-[9px] font-black transition-all cursor-pointer ${n === 26 ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white border-slate-200 text-slate-400 hover:bg-primary/5 hover:text-primary'}`}>
                        {n}
                    </div>
                ))}
            </div>
            <div className="w-full h-px bg-slate-100 max-w-xs" />
            <div className="flex gap-1.5">
                {[48, 47, 46, 45, 44, 43, 42, 41].map(n => (
                    <div key={n} className="w-7 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[9px] font-black text-slate-400 hover:bg-primary/5 hover:text-primary cursor-pointer transition-all">
                        {n}
                    </div>
                ))}
                <div className="w-4" />
                {[31, 32, 33, 34, 35, 36, 37, 38].map(n => (
                    <div key={n} className="w-7 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[9px] font-black text-slate-400 hover:bg-primary/5 hover:text-primary cursor-pointer transition-all">
                        {n}
                    </div>
                ))}
            </div>
        </div>
    );
};
