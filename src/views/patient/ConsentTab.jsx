import React, { useContext } from 'react';
import { FileText, Edit, Check } from 'lucide-react';
import { RegionContext } from '../../contexts/RegionContext';

export const ConsentTab = () => {
  const { t, selectedPatient } = useContext(RegionContext);
  const [selectedDoc, setSelectedDoc] = React.useState(null);
  const [signedDoc, setSignedDoc] = React.useState(null);

  const handleSign = () => {
      if (!selectedDoc) return;
      const signed = { ...selectedDoc, signedAt: new Date().toLocaleString(), signature: selectedPatient.name };
      setSignedDoc(signed);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{t('consent.title')}</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t('consent.templates')}</h4>
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: t('consent.rct'), date: 'V2.0 2026', id: 'CONS-RCT' },
              { title: t('consent.ext'), date: 'V1.5 2026', id: 'CONS-EXT' },
              { title: t('consent.ortho'), date: 'V3.1 2026', id: 'CONS-ORTHO' },
              { title: t('consent.an'), date: 'V1.0 2025', id: 'CONS-AN' }
            ].map((doc, i) => (
              <div 
                key={i} 
                onClick={() => { setSelectedDoc(doc); setSignedDoc(null); }}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group ${selectedDoc?.id === doc.id ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10' : 'bg-white border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/20'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedDoc?.id === doc.id ? 'bg-primary text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-primary group-hover:text-white'}`}><FileText size={20} /></div>
                  <div>
                    <p className={`text-sm font-black ${selectedDoc?.id === doc.id ? 'text-primary' : 'text-slate-700'}`}>{doc.title}</p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{doc.date} • {doc.id}</p>
                  </div>
                </div>
                <button className={`p-2 rounded-lg transition-colors ${selectedDoc?.id === doc.id ? 'text-primary' : 'text-slate-300 hover:text-primary'}`}><Plus size={18} /></button>
              </div>
            ))}
          </div>
        </div>

        {selectedDoc ? (
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
             
              {signedDoc ? (
                   <>
                        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 mb-2 animate-in zoom-in spin-in-180 duration-700">
                             <Check size={40} strokeWidth={4} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">{t('consent.signSuccess')}</h3>
                        <p className="text-xs font-bold text-emerald-600/80 max-w-[240px] leading-relaxed mb-4 uppercase tracking-widest border border-emerald-100 bg-emerald-50 py-2 px-4 rounded-xl">
                            {selectedPatient?.name} • {signedDoc.signedAt}
                        </p>
                        <div className="w-full h-32 bg-slate-50 rounded-2xl flex items-center justify-center">
                            <span className="font-handwriting text-3xl text-slate-600 rotate-[-5deg]">{selectedPatient?.name}</span>
                        </div>
                   </>
              ) : (
                  <>
                    <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center text-amber-500 mb-2">
                        <Edit size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">{selectedDoc.title}</h3>
                    <p className="text-xs font-bold text-slate-400 max-w-[240px] leading-relaxed mb-8 uppercase tracking-widest">{t('consent.needsSign', { name: selectedPatient?.name })}</p>
                    
                    <div className="w-full aspect-[4/3] bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group cursor-crosshair hover:bg-white hover:border-primary/30 transition-all hover:shadow-inner" onClick={handleSign}>
                        <Edit size={24} className="text-slate-200 group-hover:text-primary/20 mb-4" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">{t('consent.signHere')}</p>
                    </div>
                    
                    <button onClick={handleSign} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-primary transition-all">{t('consent.confirmSign')}</button>
                 </>
              )}
            </div>
        ) : (
            <div className="bg-slate-50/50 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center p-10 opacity-50">
                 <FileText size={48} className="text-slate-300 mb-4" />
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('consent.selectTemplate')}</p>
            </div>
        )}
      </div>
    </div>
  );
};

const Plus = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
