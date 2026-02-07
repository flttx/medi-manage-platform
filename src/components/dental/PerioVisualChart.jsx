import React from 'react';
import { motion } from 'framer-motion';
import { TOOTH_DATA } from '../ToothData';

const ToothVisual = ({ id, data, isUpper, isLingual, history = [] }) => {
  const toothPath = [...TOOTH_DATA.upper, ...TOOTH_DATA.lower].find(t => t.id === parseInt(id))?.tooth;
  
  if (!toothPath) return <div className="w-8 h-12" />;

  const pd = isLingual ? data?.pd_l || [0, 0, 0] : data?.pd_b || [0, 0, 0];
  const bop = data?.bi || 0;

  const isHighRisk = pd.some(v => v > 4) || (pd.reduce((a, b) => a + b, 0) / 3 > 3);
  const isSerious = pd.some(v => v > 5);

  return (
    <div className="flex flex-col items-center gap-1 group/tooth relative">
      {!isUpper && (
        <div className="flex gap-0.5 mb-1 h-3 items-end">
            {pd.map((v, i) => (
                <div key={i} className={`text-[7px] font-black w-2 text-center ${v > 3 ? 'text-rose-500' : 'text-slate-400 opacity-60'}`}>
                    {v || ''}
                </div>
            ))}
        </div>
      )}

      <div className={`relative w-8 h-14 transition-all duration-500 group-hover/tooth:scale-110 ${isUpper ? '' : 'rotate-180'}`}>
        <svg viewBox="0 0 180 140" className="w-full h-full drop-shadow-sm overflow-visible">
          <path
            d={toothPath}
            className={`transition-all duration-500 ${
              isSerious ? 'fill-rose-100 stroke-rose-400' : 
              isHighRisk ? 'fill-amber-50 stroke-amber-300' : 
              'fill-slate-50 stroke-slate-200 group-hover/tooth:fill-indigo-50 group-hover/tooth:stroke-indigo-300'
            }`}
            strokeWidth="2"
          />
          
          {bop > 0 && (
              <circle cx="90" cy={isUpper ? "110" : "30"} r="15" className="fill-rose-500 animate-pulse" />
          )}

          {/* Pocket Depth Bars (Visual indicator) */}
          <g opacity="0.4">
             {pd.map((v, i) => {
                 const x = 30 + i * 60;
                 const h = v * 8;
                 return (
                     <rect 
                        key={i} 
                        x={x} 
                        y={isUpper ? 110 - h : 30} 
                        width="15" 
                        height={h} 
                        className={v > 3 ? 'fill-rose-500' : 'fill-indigo-600'} 
                        rx="2"
                     />
                 );
             })}
          </g>
        </svg>
        
        <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center opacity-0 group-hover/tooth:opacity-100 pointer-events-none transition-opacity z-50">
            <div className="bg-slate-900/90 text-white p-2 rounded-xl shadow-2xl backdrop-blur-sm -translate-y-12">
                <p className="text-[8px] font-black uppercase text-white/50 mb-1 tracking-tighter">Tooth #{id}</p>
                <div className="flex gap-2 items-center">
                    <span className="text-[10px] font-black text-rose-400">PD: {pd.join('/')}</span>
                    {bop > 0 && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                </div>
            </div>
            <span className="absolute bottom-2 bg-indigo-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-lg">#{id}</span>
        </div>
      </div>

      {isUpper && (
        <div className="flex gap-0.5 mt-1 h-3 items-start">
            {pd.map((v, i) => (
                <div key={i} className={`text-[7px] font-black w-2 text-center ${v > 3 ? 'text-rose-500' : 'text-slate-400 opacity-60'}`}>
                    {v || ''}
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip, 
    ResponsiveContainer 
} from 'recharts';

// Polyline Chart for PD Profile
const PDProfilePath = ({ teeth, data, isUpper }) => {
    const points = [];
    const toothWidth = 36; // Approx width of ToothVisual + gap
    
    teeth.forEach((id, tIndex) => {
        const pd = data[id]?.pd_b || [2, 2, 2];
        pd.forEach((v, pIndex) => {
            const x = (tIndex * toothWidth) + (pIndex * (toothWidth / 3)) + (toothWidth / 6);
            // Higher PD means lower on chart for upper, higher for lower
            const y = isUpper ? 40 + v * 5 : 40 - v * 5;
            points.push(`${x},${y}`);
        });
    });

    return (
        <svg className="absolute inset-0 w-full h-[60px] pointer-events-none overflow-visible z-20" preserveAspectRatio="none">
            <polyline
                points={points.join(' ')}
                fill="none"
                stroke={isUpper ? "#6366f1" : "#818cf8"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-40"
            />
            {points.map((p, i) => {
                const [x, y] = p.split(',');
                return <circle key={i} cx={x} cy={y} r="2" fill="#6366f1" opacity="0.6" />;
            })}
        </svg>
    );
};

import { RegionContext } from '../../contexts/RegionContext';

export const PerioVisualChart = ({ record, history = [] }) => {
  const { t } = React.useContext(RegionContext);

  if (!record) return (
    <div className="p-20 text-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('perio.noRecord')}</p>
    </div>
  );

  const teethData = record.data || {};

  // FDI Sequences (Dental Chart logic)
  const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  // Calculate Trend Data from history
  const trendData = [...history].reverse().map(h => {
      const allVals = Object.values(h.data).flatMap(d => [...d.pd_b, ...d.pd_l]);
      const avgPD = (allVals.reduce((a, b) => a + b, 0) / allVals.length).toFixed(1);
      const bopCount = Object.values(h.data).filter(d => d.bi > 0).length;
      return { date: h.date, avgPD: parseFloat(avgPD), bop: bopCount };
  });

  return (
    <div className="space-y-16 p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 relative group/chart">
      
      {/* Upper Arch */}
      <section className="space-y-6">
        <header className="flex items-center justify-between px-4">
           <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
               <span className="w-8 h-px bg-slate-100" /> {t('perio.maxillary')}
           </h5>
           <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
               <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-100 border border-slate-200" /> {t('perio.riskLow')}</div>
               <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-100 border border-amber-300" /> {t('perio.riskMid')}</div>
               <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-100 border border-rose-400" /> {t('perio.riskHigh')}</div>
           </div>
        </header>

        <div className="flex justify-center items-end gap-1 px-4 relative">
           <PDProfilePath teeth={upperTeeth} data={teethData} isUpper />
           <div className="flex gap-1 items-end relative z-10">
              {upperTeeth.map(id => (
                <ToothVisual key={id} id={id} data={teethData[id]} isUpper />
              ))}
           </div>
        </div>
      </section>

      {/* Lower Arch */}
      <section className="space-y-6">
        <div className="flex justify-center items-start gap-1 px-4 relative">
           <PDProfilePath teeth={lowerTeeth} data={teethData} isUpper={false} />
           <div className="flex gap-1 items-start relative z-10">
              {lowerTeeth.map(id => (
                <ToothVisual key={id} id={id} data={teethData[id]} isUpper={false} />
              ))}
           </div>
        </div>
        <header className="flex justify-center">
           <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
               {t('perio.mandibular')} <span className="w-8 h-px bg-slate-100" />
           </h5>
        </header>
      </section>

      {/* Historical Trend Section */}
      {trendData.length > 1 && (
        <div className="pt-10 border-t border-slate-100 grid grid-cols-12 gap-8">
            <div className="col-span-4 space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('perio.clinicalTrend')}</h4>
                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-black text-indigo-600 tracking-tighter tabular-nums">{trendData[trendData.length-1].avgPD}</span>
                        <span className="text-xs font-bold text-slate-400">mm</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        {t('perio.avgPdImprovement')} 
                        <span className="text-emerald-500 font-bold">-{ (trendData[0].avgPD - trendData[trendData.length-1].avgPD).toFixed(1) }mm</span>
                    </p>
                </div>
            </div>
            
            <div className="col-span-8 h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" hide />
                        <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                        <RechartsTooltip 
                             contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                             labelStyle={{ fontWeight: 'black', fontSize: '10px', textTransform: 'uppercase' }}
                        />
                        <Line type="monotone" dataKey="avgPD" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#fff', strokeWidth: 3 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="bop" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
      )}
    </div>
  );
};
