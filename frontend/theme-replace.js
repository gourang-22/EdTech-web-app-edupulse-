const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, callback);
    else if (p.endsWith('.tsx') || p.endsWith('.ts')) callback(p);
  });
}

const map = {
  'text-white/40': 'text-slate-500',
  'text-white/30': 'text-slate-400',
  'text-white/50': 'text-slate-500',
  'text-white/60': 'text-slate-600',
  'text-white/70': 'text-slate-700',
  'text-white/80': 'text-slate-800',
  'text-white': 'text-slate-900',
  'bg-[#16162A]': 'bg-white',
  'bg-[#0D0D1A]': 'bg-slate-50',
  'border-white/10': 'border-slate-200',
  'border-white/5': 'border-slate-100',
  'border-white/[0.04]': 'border-slate-100',
  'divide-white/[0.04]': 'divide-slate-100',
  'bg-white/5': 'bg-slate-100',
  'bg-white/10': 'bg-slate-200',
  'bg-white/[0.02]': 'bg-slate-50',
  'hover:bg-white/5': 'hover:bg-slate-100',
  'hover:bg-white/[0.02]': 'hover:bg-slate-50',
  'hover:text-white/60': 'hover:text-slate-600',
  'text-indigo-400': 'text-violet-600',
  'text-indigo-300': 'text-violet-500',
  'hover:text-indigo-300': 'hover:text-violet-700',
  'hover:text-indigo-400': 'hover:text-violet-800',
  'bg-indigo-500/15': 'bg-violet-100',
  'bg-indigo-500/20': 'bg-violet-100',
  'from-indigo-500': 'from-violet-500',
  'to-purple-600': 'to-fuchsia-600',
  'hover:bg-indigo-500/20': 'hover:bg-violet-100',
  'shadow-indigo-500/25': 'shadow-violet-500/25'
};

walk('c:/Users/GOURANG MILIND/Desktop/Antigravity Worksapce/EdTech website/frontend/src', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  for (const [key, value] of Object.entries(map)) {
    if (content.includes(key)) {
      content = content.split(key).join(value);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + filePath);
  }
});
