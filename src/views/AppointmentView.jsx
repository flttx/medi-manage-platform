import React, { useState, useContext, useMemo } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RegionContext } from '../contexts/RegionContext';
import { useToast } from '../contexts/ToastContext';

export const AppointmentView = () => {
  const { region, t, setActiveView, setSelectedPatient, appointments, patients, setGlobalModal } = useContext(RegionContext);
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('calendar'); // board, calendar
  const [currentView, setCurrentView] = useState('week'); // week, month, day
  
  // Use a separate state for the mini calendar's displayed month
  const [miniCalendarMonth, setMiniCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  
  // The selected/focused date for the main calendar
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  // Calculate the start of the week (Monday) for the selected date
  const weekStartDate = useMemo(() => {
    const d = new Date(selectedDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }, [selectedDate]);

  const handlePatientClick = (name, status = 'confirmed') => {
    const realPatient = patients.find(p => p.name === name);
    const p = realPatient ? { ...realPatient, status } : { name, id: 'P2026XXX', age: 30, gender: 'female', phone: '138****8888', lastVisit: "2026.02.01", status, risk: 'Low' };
    setSelectedPatient(p);
    setActiveView('patientDetail');
    showToast(region === 'cn' ? `正在载入: ${name}` : `Loading: ${name}`, 'info');
  };

  // Navigate the main calendar view
  const navigateView = (direction) => {
    const newDate = new Date(selectedDate);
    if (currentView === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setSelectedDate(newDate);
    // Also update mini calendar month if the new date is in a different month
    if (newDate.getMonth() !== miniCalendarMonth.getMonth() || newDate.getFullYear() !== miniCalendarMonth.getFullYear()) {
      setMiniCalendarMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
    }
  };

  // Navigate the mini calendar's displayed month
  const navigateMiniCalendar = (direction) => {
    setMiniCalendarMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
  };

  // Handle clicking a date on the mini calendar
  const handleMiniCalendarDateClick = (date) => {
    setSelectedDate(date);
    // When clicking a date on mini calendar, switch to day view for better UX
    setCurrentView('day');
    // Update mini calendar month if clicked date is in a different month
    if (date.getMonth() !== miniCalendarMonth.getMonth() || date.getFullYear() !== miniCalendarMonth.getFullYear()) {
      setMiniCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const resetToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setMiniCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const currentRange = () => {
    const months = region === 'cn' ? 
      ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] :
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (currentView === 'day') {
      return `${selectedDate.getDate()} ${months[selectedDate.getMonth()]}, ${selectedDate.getFullYear()}`;
    } else if (currentView === 'week') {
      const end = new Date(weekStartDate);
      end.setDate(end.getDate() + 6);
      if (weekStartDate.getMonth() === end.getMonth()) {
        return `${weekStartDate.getDate()} - ${end.getDate()} ${months[weekStartDate.getMonth()]}, ${weekStartDate.getFullYear()}`;
      }
      return `${weekStartDate.getDate()} ${months[weekStartDate.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]}, ${weekStartDate.getFullYear()}`;
    } else {
      return `${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    }
  };

  const getColDate = (base, offset) => {
    const d = new Date(base);
    d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getTimePos = (time) => {
    const [h, m] = time.split(':').map(Number);
    const startHour = 9;
    const pixelsPerHour = 80;
    return (h - startHour) * pixelsPerHour + (m / 60) * pixelsPerHour;
  };

  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
    const days = [];
    
    for (let i = 0; i < startOffset; i++) {
        const d = new Date(year, month, 1 - (startOffset - i));
        days.push({ date: d, currentMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push({ date: new Date(year, month, i), currentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({ date: new Date(year, month + 1, i), currentMonth: false });
    }
    return days;
  };

  // Check if a date is the currently selected date
  const isSelectedDate = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Check if a date is today
  const isToday = (date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const MiniCalendar = () => {
    const [showYearMonthPicker, setShowYearMonthPicker] = useState(false);
    // Temporary state for year/month selection before confirmation
    const [tempYear, setTempYear] = useState(miniCalendarMonth.getFullYear());
    const [tempMonth, setTempMonth] = useState(miniCalendarMonth.getMonth());
    
    const days = getMonthDays(miniCalendarMonth);
    const weekDays = region === 'cn' ? ['一', '二', '三', '四', '五', '六', '日'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const months = region === 'cn' ? 
      ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] :
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const years = [];
    for (let y = tempYear - 5; y <= tempYear + 5; y++) {
      years.push(y);
    }

    const openPicker = () => {
      // Reset temp values to current calendar month when opening
      setTempYear(miniCalendarMonth.getFullYear());
      setTempMonth(miniCalendarMonth.getMonth());
      setShowYearMonthPicker(true);
    };

    const handleConfirm = () => {
      setMiniCalendarMonth(new Date(tempYear, tempMonth, 1));
      setShowYearMonthPicker(false);
    };

    const handleCancel = () => {
      setShowYearMonthPicker(false);
    };
    
    return (
      <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4 relative">
        <div className="flex justify-between items-center px-2">
           <button 
             onClick={openPicker}
             className="text-[10px] font-black uppercase text-slate-800 tracking-widest hover:text-primary transition-colors flex items-center gap-1"
           >
             {miniCalendarMonth.getFullYear()}年 {months[miniCalendarMonth.getMonth()]}
             <ChevronRight size={12} className={`transition-transform ${showYearMonthPicker ? 'rotate-90' : ''}`} />
           </button>
           <div className="flex gap-1">
              <button onClick={() => navigateMiniCalendar(-1)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors"><ChevronLeft size={14} /></button>
              <button onClick={() => navigateMiniCalendar(1)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors"><ChevronRight size={14} /></button>
           </div>
        </div>
        
        {/* Year/Month Quick Picker */}
        {showYearMonthPicker && (
          <>
            {/* Invisible overlay to capture clicks outside */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={handleCancel}
            />
            <div className="absolute top-14 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-4 space-y-4">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{region === 'cn' ? '选择年份' : 'Year'}</p>
                <select 
                  value={tempYear}
                  onChange={(e) => setTempYear(parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none text-sm font-black text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                >
                  {Array.from({ length: 51 }, (_, i) => 2000 + i).map(y => (
                    <option key={y} value={y}>{y}年</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{region === 'cn' ? '选择月份' : 'Month'}</p>
                <select 
                  value={tempMonth}
                  onChange={(e) => setTempMonth(parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none text-sm font-black text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                >
                  {months.map((m, idx) => (
                    <option key={idx} value={idx}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button 
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  {region === 'cn' ? '取消' : 'Cancel'}
                </button>
                <button 
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  {region === 'cn' ? '确定' : 'Confirm'}
                </button>
              </div>
            </div>
          </>
        )}


        <div className="grid grid-cols-7 gap-1">
           {weekDays.map((d, idx) => <span key={idx} className="text-[8px] font-black text-slate-300 text-center uppercase">{d}</span>)}
           {days.map((d, i) => {
             const selected = isSelectedDate(d.date);
             const today = isToday(d.date);
             return (
               <button 
                 key={i} 
                 onClick={() => handleMiniCalendarDateClick(d.date)}
                 className={`h-7 w-7 rounded-lg text-[9px] font-bold transition-all flex items-center justify-center
                   ${selected ? 'bg-primary text-white shadow-lg shadow-primary/20 font-black' : 
                     today ? 'bg-primary/10 text-primary font-black hover:bg-primary hover:text-white' : 
                     d.currentMonth ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-300 hover:bg-slate-50 hover:text-slate-500'}
                 `}
               >
                 {d.date.getDate()}
               </button>
             );
           })}
        </div>
      </div>
    );
  };



  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6 h-[calc(100vh-120px)] overflow-hidden">
        <div className="w-72 space-y-8 flex flex-col shrink-0">
          <button 
            onClick={() => setGlobalModal({ type: 'appointment' })}
            className="w-full bg-primary text-white p-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all group active:scale-95 border-none"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            {region === 'cn' ? '新增预约' : 'New Appointment'}
          </button>

          <MiniCalendar />

         <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">{region === 'cn' ? '我的日历' : 'My Calendars'}</h4>
               <div className="space-y-1">
                  {[
                    { label: t.confirmed, color: 'bg-indigo-500' },
                    { label: t.pending, color: 'bg-amber-500' },
                    { label: t.cancelled, color: 'bg-rose-500' }
                  ].map((cat, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-2xl cursor-pointer transition-all">
                       <div className={`w-3 h-3 rounded-md ${cat.color}`} />
                       <span className="text-[11px] font-bold text-slate-600">{cat.label}</span>
                       <div className="ml-auto w-4 h-4 rounded-full border border-slate-200" />
                    </div>
                  ))}
               </div>
            </div>

            <div className="card p-6 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] space-y-6">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.stratification}</h4>
               <div className="space-y-4">
                  {[
                    { label: t.confirmed, value: "85%", color: "bg-indigo-500" },
                    { label: t.pending, value: "15%", color: "bg-amber-500" }
                  ].map((stat, idx) => (
                    <div key={idx} className="space-y-2">
                       <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black text-slate-700">{stat.label}</span>
                          <span className="text-[9px] font-black text-slate-400">{stat.value}</span>
                       </div>
                       <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: stat.value }} className={`h-full ${stat.color}`} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
         <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-6">
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setActiveTab('board')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === 'board' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {region === 'cn' ? '看板' : 'Board'}
                  </button>
                  <button 
                    onClick={() => setActiveTab('calendar')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === 'calendar' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {region === 'cn' ? '日历' : 'Calendar'}
                  </button>
               </div>

               {activeTab === 'calendar' && (
                 <div className="flex items-center gap-4">
                    <button onClick={resetToday} className="px-5 py-2 rounded-xl bg-slate-50 text-[10px] font-black text-slate-500 hover:bg-slate-100 hover:text-primary transition-all uppercase tracking-widest">{region === 'cn' ? '今天' : 'Today'}</button>
                    <div className="flex items-center gap-1">
                       <button onClick={() => navigateView(-1)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-all"><ChevronLeft size={16} /></button>
                       <button onClick={() => navigateView(1)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-all"><ChevronRight size={16} /></button>
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tabular-nums tracking-tight ml-2">{currentRange()}</h3>
                 </div>
               )}
            </div>

            <div className="flex items-center gap-3">
               {activeTab === 'calendar' && (
                 <select 
                   value={currentView}
                   onChange={(e) => setCurrentView(e.target.value)}
                   className="bg-slate-50 border-none rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 py-2.5 focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer pr-10"
                 >
                   <option value="day">{region === 'cn' ? '日' : 'Day'}</option>
                   <option value="week">{region === 'cn' ? '周' : 'Week'}</option>
                   <option value="month">{region === 'cn' ? '月' : 'Month'}</option>
                 </select>
               )}
               <div className="flex gap-2">
                 <button onClick={() => setGlobalModal({ type: 'reminder' })} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all"><Bell size={18} /></button>
                 <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"><Search size={18} /></button>
               </div>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto relative custom-scrollbar">
            {activeTab === 'board' ? (
               <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {['confirmed', 'pending', 'cancelled'].map(status => (
                    <div key={status} className="space-y-6">
                      <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${status === 'confirmed' ? 'bg-indigo-500 shadow-[0_0_10px_var(--indigo-500)]' : status === 'pending' ? 'bg-amber-500 shadow-[0_0_10px_var(--amber-500)]' : 'bg-rose-500 shadow-[0_0_10px_var(--rose-500)]'}`} />
                          <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{t[status]}</h4>
                        </div>
                        <span className="text-[10px] font-black text-slate-300 tabular-nums bg-slate-50 px-2 py-0.5 rounded-md">
                          {appointments.filter(a => a.status === status).length}
                        </span>
                      </div>
                      <div className="space-y-4">
                        {appointments.filter(a => a.status === status).map((app, i) => (
                          <motion.div 
                            key={i} 
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="p-6 bg-white rounded-[2rem] shadow-sm border border-slate-50 space-y-4 cursor-pointer group hover:shadow-2xl hover:shadow-slate-200/50 transition-all relative overflow-hidden"
                            onClick={() => handlePatientClick(app.patient, app.status)}
                          >
                            <div className="flex justify-between items-start">
                               <div className="space-y-1">
                                  <p className="text-xs font-black text-slate-800 group-hover:text-primary transition-colors">{app.patient}</p>
                                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{app.id || 'P2026XXX'}</p>
                               </div>
                               <span className="text-[10px] font-black text-slate-400 tabular-nums">{app.time}</span>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                               <span className="px-3 py-1 bg-slate-50 text-[9px] font-black text-slate-400 rounded-xl group-hover:bg-primary/5 group-hover:text-primary transition-all uppercase tracking-widest">
                                  {t[app.type.toLowerCase()] || app.type}
                               </span>
                               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=dr${i}`} className="w-6 h-6 rounded-full border border-white shadow-sm" alt="" />
                            </div>
                            <div className={`absolute top-0 left-0 w-1 h-full ${status === 'confirmed' ? 'bg-indigo-500' : status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
               </div>
            ) : (
               <>
                 {currentView === 'month' ? (
                   <div className="h-full grid grid-cols-7 border-l border-t border-slate-50">
                      {(region === 'cn' ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']).map(d => (
                        <div key={d} className="p-4 text-[10px] font-black text-slate-300 text-center uppercase tracking-[0.2em] border-r border-b border-slate-50 bg-slate-50/20">{d}</div>
                      ))}
                      {getMonthDays(selectedDate).map((d, i) => {
                        const selected = isSelectedDate(d.date);
                        const today = isToday(d.date);
                        return (
                          <div 
                            key={i} 
                            onClick={() => { setSelectedDate(d.date); setCurrentView('day'); }}
                            className={`min-h-[140px] p-4 border-r border-b border-slate-50 relative group hover:bg-slate-50/30 transition-all cursor-pointer ${!d.currentMonth ? 'opacity-30' : ''} ${selected ? 'bg-primary/5' : ''}`}
                          >
                             <span className={`text-[11px] font-black inline-flex items-center justify-center w-6 h-6 rounded-full ${today ? 'bg-primary text-white' : selected ? 'bg-primary/20 text-primary' : 'text-slate-400'}`}>{d.date.getDate()}</span>
                             <div className="mt-4 space-y-1">
                                {appointments.filter(a => {
                                  const dateStr = `${d.date.getFullYear()}-${String(d.date.getMonth() + 1).padStart(2, '0')}-${String(d.date.getDate()).padStart(2, '0')}`;
                                  return a.date === dateStr;
                                }).slice(0, 3).map((app, ai) => (
                                  <div key={ai} className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase truncate border-l-2 ${
                                    app.status === 'confirmed' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 
                                    app.status === 'pending' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-rose-50 border-rose-500 text-rose-700'
                                  }`}>
                                     {app.time} {app.patient}
                                  </div>
                                ))}
                             </div>
                          </div>
                        );
                      })}
                   </div>
                 ) : (
                   <div className="grid grid-cols-[auto,1fr] bg-white">
                     <div className="bg-white border-r border-slate-50 p-6 pt-24 space-y-[64px]">
                        {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map(time => (
                          <div key={time} className="h-4 text-[10px] font-black text-slate-300 tabular-nums uppercase">{time}</div>
                        ))}
                     </div>
                     
                     <div className={`grid ${currentView === 'day' ? 'grid-cols-1' : 'grid-cols-7'} flex-1`}>
                        {(currentView === 'day' ? [0] : [0,1,2,3,4,5,6]).map(offset => {
                          const baseDate = currentView === 'day' ? selectedDate : weekStartDate;
                          const colDateStr = getColDate(baseDate, offset);
                          const colDate = new Date(colDateStr);
                          const dayInWeek = colDate.getDay();
                          const todayFlag = isToday(colDate);
                          const selectedFlag = isSelectedDate(colDate);
                          
                          return (
                            <div 
                              key={offset} 
                              onClick={() => { if (currentView === 'week') { setSelectedDate(colDate); setCurrentView('day'); } }}
                              className={`border-r border-slate-50 last:border-0 relative ${dayInWeek === 0 || dayInWeek === 6 ? 'bg-slate-50/10' : ''} ${currentView === 'week' ? 'cursor-pointer hover:bg-slate-50/20' : ''}`}
                            >
                               <div className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md p-6 border-b border-slate-50 text-center space-y-1 ${selectedFlag && currentView === 'week' ? 'bg-primary/5' : ''}`}>
                                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">
                                    {(region === 'cn' ? ['周日','周一','周二','周三','周四','周五','周六'] : ['SUN','MON','TUE','WED','THU','FRI','SAT'])[dayInWeek]}
                                  </p>
                                  <p className={`text-2xl font-black tabular-nums transition-all inline-flex items-center justify-center w-10 h-10 rounded-full ${todayFlag ? 'bg-primary text-white' : selectedFlag ? 'bg-primary/10 text-primary' : 'text-slate-800'}`}>{colDate.getDate()}</p>
                               </div>

                               <div className="relative h-[800px] group">
                                  {appointments
                                    .filter(app => app.date === colDateStr)
                                    .map((app, ai) => (
                                      <motion.div 
                                        key={ai}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        style={{ top: `${getTimePos(app.time)}px` }}
                                        onClick={(e) => { e.stopPropagation(); handlePatientClick(app.patient, app.status); }}
                                        className={`absolute left-2 right-2 h-20 rounded-2xl p-4 shadow-sm group/card cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all z-10 border-l-4 ${
                                          app.status === 'confirmed' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 
                                          app.status === 'pending' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-rose-50 border-rose-500 text-rose-700'
                                        }`}
                                      >
                                         <div className="flex justify-between items-start mb-1">
                                            <p className="text-[10px] font-black truncate">{app.patient}</p>
                                            <Bell size={10} className="opacity-40" />
                                         </div>
                                         <p className="text-[8px] font-bold uppercase tracking-widest opacity-60 truncate">{t[app.type.toLowerCase()] || app.type}</p>
                                         <p className="text-[8px] font-black mt-2 tabular-nums bg-white/30 px-1.5 py-0.5 rounded-md inline-block">{app.time}</p>
                                      </motion.div>
                                    ))
                                  }
                                  {[...Array(10)].map((_, li) => (
                                     <div key={li} className="h-20 border-b border-slate-50/50 w-full" />
                                  ))}
                                  
                                  {todayFlag && (
                                    <div className="absolute left-0 right-0 border-t-2 border-primary z-20 pointer-events-none" style={{ top: `${getTimePos(new Date().toTimeString().slice(0,5))}px` }}>
                                       <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-primary rounded-full shadow-[0_0_8px_var(--primary)]" />
                                    </div>
                                  )}
                               </div>
                            </div>
                          );
                        })}
                     </div>
                   </div>
                 )}
               </>
            )}
         </div>
      </div>
    </motion.div>
  );
};
