'use client';
import { useState } from 'react';
import {
  ArrowLeft, ArrowRight, RotateCw, Lock, Star, Shield, MoreVertical, Home, Globe, ShoppingBag,
  X, Plus, Folder, Search, Mic, Youtube, Github, Bot, GraduationCap, Mail, Cloud,
} from 'lucide-react';
import { useOS } from '@/store/useOS';

const BOOKMARKS = ['Educational', 'Tools', 'Social', 'Entertainment', 'Work', 'Others'];

export default function Browser() {
  const openApp = useOS((s) => s.openApp);
  const [q, setQ] = useState('');
  const [addr, setAddr] = useState('');
  const [tabs, setTabs] = useState([
    { id: 1, title: 'New Tab', icon: Home },
    { id: 2, title: 'ZikriyonOS', icon: Globe },
    { id: 3, title: 'Web Store', icon: ShoppingBag },
  ]);
  const [active, setActive] = useState(1);

  const go = (text) => {
    const t = text.trim();
    if (!t) return;
    const url = /^https?:\/\//.test(t) ? t : t.includes('.') && !t.includes(' ') ? `https://${t}` : `https://www.google.com/search?q=${encodeURIComponent(t)}`;
    window.open(url, '_blank', 'noopener');
  };

  const tiles = [
    { n: 'YouTube', i: <Youtube size={30} color="#ff3b5c" />, go: () => go('https://youtube.com') },
    { n: 'Google', i: <span className="text-3xl font-bold text-sky-400">G</span>, go: () => go('https://google.com') },
    { n: 'GitHub', i: <Github size={30} />, go: () => go('https://github.com') },
    { n: 'ChatGPT', i: <Bot size={30} />, go: () => go('https://chatgpt.com') },
    { n: 'Files', i: <Folder size={30} stroke="url(#zgrad)" />, go: () => openApp('explorer') },
    { n: 'Learning', i: <GraduationCap size={30} stroke="url(#zgrad)" />, go: () => go('https://www.khanacademy.org') },
    { n: 'Mail', i: <Mail size={30} stroke="url(#zgrad)" />, go: () => openApp('mail') },
    { n: 'Cloud', i: <Cloud size={30} stroke="url(#zgrad)" />, go: () => go('https://drive.google.com') },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* tabs */}
      <div className="flex items-end gap-1 px-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex w-48 items-center gap-2 rounded-t-xl px-3 py-2 text-sm ${active === t.id ? 'bg-white/15' : 'hover:bg-white/5'}`}
          >
            <t.icon size={15} /> <span className="flex-1 truncate text-left">{t.title}</span>
            <X size={14} onClick={(e) => { e.stopPropagation(); setTabs(tabs.filter((x) => x.id !== t.id)); }} />
          </button>
        ))}
        <button onClick={() => setTabs([...tabs, { id: Date.now(), title: 'New Tab', icon: Home }])} className="p-2"><Plus size={16} /></button>
      </div>

      {/* address */}
      <div className="flex items-center gap-2 border-t border-white/10 px-4 py-2.5">
        {[ArrowLeft, ArrowRight, RotateCw].map((I, i) => (
          <button key={i} className="glass flex h-9 w-9 items-center justify-center rounded-full"><I size={16} /></button>
        ))}
        <div className="glass flex flex-1 items-center gap-3 rounded-full px-4 py-2 text-sm">
          <Lock size={14} />
          <input
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && go(addr)}
            placeholder="Search or enter address..."
            className="flex-1 bg-transparent outline-none placeholder:text-white/50"
          />
          <Star size={16} />
        </div>
        <Shield size={18} className="mx-1" /><MoreVertical size={18} />
      </div>

      {/* bookmarks */}
      <div className="flex items-center gap-5 border-y border-white/10 px-5 py-2 text-xs">
        <span className="flex items-center gap-1.5 text-sky-300"><Star size={14} /> Bookmarks</span>
        {BOOKMARKS.map((b) => (
          <span key={b} className="flex items-center gap-1.5 text-white/90"><Folder size={14} stroke="#8b9cff" /> {b}</span>
        ))}
      </div>

      {/* new tab page */}
      <div className="scroll-thin flex flex-1 flex-col items-center overflow-y-auto pt-6">
        <img src="/logo.png" alt="" className="w-40 drop-shadow-[0_0_30px_rgba(139,61,255,.7)]" />
        <div className="glass mt-4 flex w-[520px] max-w-[85%] items-center gap-3 rounded-full px-5 py-3">
          <Search size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && go(q)}
            placeholder="Search the web..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/50"
          />
          <Mic size={18} stroke="#38bdf8" />
          <button onClick={() => go(q)} className="grad-bg rounded-full px-3 py-1.5">→</button>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-4 pb-6">
          {tiles.map((t) => (
            <button key={t.n} onClick={t.go} className="glass flex h-[84px] w-[130px] flex-col items-center justify-center gap-2 rounded-2xl text-xs transition hover:scale-105">
              {t.i}{t.n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
