import React, { useContext, useState } from 'react';
import { InventoryContext } from '../contexts/InventoryContext';
import { RegionContext } from '../contexts/RegionContext';
import { 
  Package, 
  AlertTriangle, 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  History,
  ShoppingCart,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InventoryView = () => {
  const { items, alerts, useItem, restockItem } = useContext(InventoryContext);
  const { t } = useContext(RegionContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', ...new Set(items.map(i => i.category))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.batch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       {/* Header & Stats */}
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
               <Package size={28} className="text-emerald-500" />
               {t('modules.inventoryManage') || 'Inventory Management'}
            </h2>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest pl-10">
               Total Assets: {items.reduce((acc, i) => acc + i.stock, 0)} Units
            </p>
          </div>
          
          <div className="flex gap-4">
             {alerts.length > 0 && (
                <div className="px-4 py-3 bg-rose-50 text-rose-600 rounded-2xl flex items-center gap-3 border border-rose-100 shadow-sm animate-pulse">
                   <AlertTriangle size={18} />
                   <span className="text-[10px] font-black uppercase tracking-widest">{alerts.length} Low Stock Alerts</span>
                </div>
             )}
             <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                <ShoppingCart size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Order Supplies</span>
             </button>
          </div>
       </div>

       {/* Toolbar */}
       <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-[1.5rem] border border-white shadow-sm">
           <div className="flex items-center gap-4 flex-1">
               <div className="relative flex-1 max-w-md">
                   <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                      type="text" 
                      placeholder="Search supplies or batch numbers..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-none text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 transition-all"
                   />
               </div>
               <div className="flex items-center gap-2">
                   {categories.map(cat => (
                       <button 
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${categoryFilter === cat ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-white/50 text-slate-400 hover:bg-slate-50'}`}
                       >
                           {cat}
                       </button>
                   ))}
               </div>
           </div>
           <div className="flex gap-2 text-slate-300">
               <Filter size={18} />
               <History size={18} />
           </div>
       </div>

       {/* Inventory List */}
       <div className="grid gap-3 pb-8">
           <div className="grid grid-cols-12 px-6 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
               <div className="col-span-4">Item Name / Batch</div>
               <div className="col-span-2">Category</div>
               <div className="col-span-2 text-center">Status</div>
               <div className="col-span-2 text-center">Stock Level</div>
               <div className="col-span-2 text-right">Actions</div>
           </div>

           <AnimatePresence>
               {filteredItems.map(item => (
                   <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`grid grid-cols-12 items-center px-6 py-5 rounded-2xl border transition-all group ${
                          item.stock <= item.minStock 
                          ? 'bg-rose-50/50 border-rose-100' 
                          : 'bg-white border-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5'
                      }`}
                   >
                       {/* Name & ID */}
                       <div className="col-span-4 flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.stock <= item.minStock ? 'bg-rose-100 text-rose-500' : 'bg-slate-100 text-slate-500'}`}>
                               <Box size={20} />
                           </div>
                           <div>
                               <h4 className="font-black text-slate-800 dark:text-white text-sm">{item.name}</h4>
                               <p className="text-[10px] font-bold text-slate-400 mt-0.5 font-mono">{item.batch}</p>
                           </div>
                       </div>

                       {/* Category */}
                       <div className="col-span-2">
                           <span className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-[9px] font-black text-slate-500 uppercase tracking-wider">
                               {item.category}
                           </span>
                       </div>

                       {/* Status Badge */}
                       <div className="col-span-2 flex justify-center">
                           {item.stock <= item.minStock ? (
                               <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                   <AlertTriangle size={10} /> Low Stock
                               </div>
                           ) : (
                               <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                   In Stock
                               </div>
                           )}
                       </div>

                       {/* Stock Controls */}
                       <div className="col-span-2 flex flex-col items-center justify-center">
                           <div className="text-lg font-black text-slate-800 dark:text-white">{item.stock} <span className="text-[10px] text-slate-400 ml-0.5">{item.unit}s</span></div>
                           <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                               <div 
                                  className={`h-full rounded-full ${item.stock <= item.minStock ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                  style={{ width: `${Math.min(100, (item.stock / (item.minStock * 3)) * 100)}%` }} 
                               />
                           </div>
                       </div>

                       {/* Actions */}
                       <div className="col-span-2 flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                              onClick={() => useItem(item.id, 1)}
                              className="w-8 h-8 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-all active:scale-90"
                              title="Use 1 Unit"
                           >
                               <Minus size={14} strokeWidth={3} />
                           </button>
                           <button 
                              onClick={() => restockItem(item.id, 10)}
                              className="w-8 h-8 rounded-xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center text-slate-400 transition-all active:scale-90"
                              title="Restock 10 Units"
                           >
                               <Plus size={14} strokeWidth={3} />
                           </button>
                       </div>
                   </motion.div>
               ))}
           </AnimatePresence>
       </div>
    </div>
  );
};
