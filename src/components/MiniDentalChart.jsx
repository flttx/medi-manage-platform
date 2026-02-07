import React from 'react';
import { TOOTH_DATA, TOOTH_STATUSES } from './ToothData';

export const MiniDentalChart = ({ 
  selectedTeeth = [], // Array of { id, status }
  onToothClick,
  className = "" 
}) => {
  const getToothStatus = (id) => {
    const record = selectedTeeth.find(t => t.id === id || t === id);
    if (!record) return null;
    const statusId = typeof record === 'object' ? record.status : 'healthy';
    return TOOTH_STATUSES.find(s => s.id === statusId) || TOOTH_STATUSES[0];
  };

  return (
    <div className={`relative aspect-[180/280] w-full bg-slate-50/30 rounded-2xl p-4 border border-slate-100/50 shadow-inner overflow-hidden ${className}`}>
      <svg viewBox="0 0 180 280" className="w-full h-auto overflow-visible select-none drop-shadow-sm">
        {/* Upper Jaw */}
        <g transform="translate(0, 0)">
          {TOOTH_DATA.upper.map(t => {
            const status = getToothStatus(t.id);
            const isSelected = !!selectedTeeth.find(st => (st.id === t.id || st === t.id));
            return (
              <g 
                key={t.id} 
                className="cursor-pointer group"
                onClick={() => onToothClick?.(t.id)}
              >
                <path 
                  d={t.tooth} 
                  className={`transition-all duration-200 ${isSelected ? `${status?.fill || 'fill-primary'} ${status?.stroke || 'stroke-primary'}` : 'fill-white stroke-slate-200 group-hover:stroke-primary/50'}`} 
                  strokeWidth="0.8"
                  strokeDasharray={status?.dashed ? "2,1" : "0"}
                />
                {isSelected && selectedTeeth.find(st => st.id === t.id)?.surfaces?.length > 0 && (
                    <SurfaceIndicator surfaces={selectedTeeth.find(st => st.id === t.id).surfaces} status={status} />
                )}
                <path 
                  d={t.text} 
                  className={`transition-all duration-200 pointer-events-none ${isSelected ? 'fill-white' : 'fill-slate-300 group-hover:fill-primary'}`}
                  fillRule="evenodd"
                />

              </g>
            );
          })}
        </g>

        {/* Lower Jaw */}
        <g transform="translate(0, 155)">
          {TOOTH_DATA.lower.map(t => {
            const status = getToothStatus(t.id);
            const isSelected = !!selectedTeeth.find(st => (st.id === t.id || st === t.id));
            return (
              <g 
                key={t.id} 
                className="cursor-pointer group"
                onClick={() => onToothClick?.(t.id)}
              >
                <path 
                  d={t.tooth} 
                  className={`transition-all duration-200 ${isSelected ? `${status?.fill || 'fill-primary'} ${status?.stroke || 'stroke-primary'}` : 'fill-white stroke-slate-200 group-hover:stroke-primary/50'}`} 
                  strokeWidth="0.8"
                  strokeDasharray={status?.dashed ? "2,1" : "0"}
                />
                {isSelected && selectedTeeth.find(st => st.id === t.id)?.surfaces?.length > 0 && (
                    <SurfaceIndicator surfaces={selectedTeeth.find(st => st.id === t.id).surfaces} status={status} />
                )}
                <path 
                  d={t.text} 
                  className={`transition-all duration-200 pointer-events-none ${isSelected ? 'fill-white' : 'fill-slate-300 group-hover:fill-primary'}`}
                  fillRule="evenodd"
                />

              </g>
            );
          })}
        </g>
      </svg>

      
      {/* Visual Indicator for interaction */}
      <div className="absolute bottom-2 right-2 flex gap-1">
        <div className="w-1 h-1 rounded-full bg-primary/20" />
        <div className="w-1 h-1 rounded-full bg-primary/40" />
        <div className="w-1 h-1 rounded-full bg-primary/60" />
      </div>
    </div>
  );
};

const SurfaceIndicator = ({ surfaces = [], status, toothId }) => {
    // Predicted centers for teeth in the 180x280 mini chart
    // This is a rough mapping based on the tooth layout
    const getPos = (id) => {
        const isUpper = id >= 11 && id <= 28;
        const row = isUpper ? 0 : 1;
        const col = id % 10;
        // Logic to estimate SVG center for each tooth...
        // For now, we'll use a relative transform if we had the parent's center
        return { x: 0, y: 0 }; 
    };
    
    return (
        <g className="pointer-events-none opacity-90 transition-all duration-500">
            {/* We'll use the scale property to make it fit inside the tooth */}
            <g transform="scale(0.8)">
                {surfaces.includes('O') && <rect x="-2" y="-2" width="4" height="4" fill="white" rx="0.5" />}
                {surfaces.includes('B') && <rect x="-2" y="-6" width="4" height="3" fill="white" fillOpacity="0.6" rx="0.5" />}
                {surfaces.includes('L') && <rect x="-2" y="3" width="4" height="3" fill="white" fillOpacity="0.6" rx="0.5" />}
                {surfaces.includes('M') && <rect x="-6" y="-2" width="3" height="4" fill="white" fillOpacity="0.6" rx="0.5" />}
                {surfaces.includes('D') && <rect x="3" y="-2" width="3" height="4" fill="white" fillOpacity="0.6" rx="0.5" />}
            </g>
        </g>
    );
};

