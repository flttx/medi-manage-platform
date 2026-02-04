import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, TrendingUp } from 'lucide-react';

export const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast, toasts }}>
      {children}
      {/* Central Toast System */}
      <div className="fixed bottom-12 right-6 space-y-2 z-[9999]">
         <AnimatePresence>
            {toasts.map(toast => (
               <motion.div 
                 key={toast.id}
                 initial={{ opacity: 0, x: 20, scale: 0.9 }}
                 animate={{ opacity: 1, x: 0, scale: 1 }}
                 exit={{ opacity: 0, x: 20, scale: 0.9 }}
                 className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border ${
                    toast.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 
                    toast.type === 'info' ? 'bg-slate-800 border-slate-700 text-white' : 
                    'bg-rose-600 border-rose-500 text-white'
                 }`}
               >
                  {toast.type === 'success' ? <TrendingUp size={18} /> : <Bell size={18} />}
                  <span className="text-sm font-black tracking-tight">{toast.message}</span>
               </motion.div>
            ))}
         </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
