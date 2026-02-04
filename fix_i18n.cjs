const fs = require('fs');
const path = 'd:\\Projects\\医患管理平台\\src\\App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replace Status
content = content.replace(/<p className="text-\[9px\] font-black opacity-40 uppercase tracking-widest mb-1">Status<\/p>/g, 
                          '<p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">{t.status || "Status"}</p>');

// Replace SYSTEM ACTIVE
content = content.replace(/<p className="text-xl font-black tracking-tight">SYSTEM ACTIVE<\/p>/g, 
                          '<p className="text-xl font-black tracking-tight uppercase">{t.systemActive || "System Active"}</p>');

// Replace Confirmed/Pending tags
content = content.replace(/{ label: 'Confirmed', value: '85%', color: 'bg-indigo-500' }/g, 
                          '{ label: t.confirmed, value: "85%", color: "bg-indigo-500" }');
content = content.replace(/{ label: 'Pending', value: '15%', color: 'bg-amber-500' }/g, 
                          '{ label: t.pending, value: "15%", color: "bg-amber-500" }');

// Replace View Analytics
content = content.replace(/"w-full py-4 rounded-2xl bg-slate-50 text-\[10px\] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 hover:text-slate-600 transition-all">View Analytics<\/button>/g,
                          '"w-full py-4 rounded-2xl bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 hover:text-slate-600 transition-all">{t.viewAnalytics}</button>');

fs.writeFileSync(path, content);
console.log('Successfully updated App.jsx localization');
