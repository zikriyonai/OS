'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, User, Power, FileText, Image as ImageIcon, FileType } from 'lucide-react';
import AppIcon from './AppIcon';
import { useOS } from '@/store/useOS';
import { useNative } from '@/store/useNative';
import { APPS, START_APPS } from '@/lib/apps';

const RECENT = [
  { name: 'Project Nebula.docx', time: '2h ago', icon: FileText },
  { name: 'Cyber City Wallpaper.png', time: '5h ago', icon: ImageIcon },
  { name: 'ZikriyonOS Overview.pdf', time: 'Yesterday at 4:30 PM', icon: FileType },
  { name: 'System Update.log', time: 'Yesterday at 11:20 AM', icon: FileText },
];

export default function StartMenu() {
  const openApp = useOS((s) => s.openApp);
  const setOverlay = useOS((s) => s.setOverlay);
  const closeOverlay = useOS((s) => s.closeOverlay);
  const nativeApps = useNative((s) => s.apps);
  const launch = useNative((s) => s.launch);
  const [q, setQ] = useState('');

  const list = START_APPS.filter((id) => APPS[id].label.toLowerCase().includes(q.toLowerCase()));
  const real = nativeApps.filter((a) => a.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[92px] z-[6000] flex justify-center">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.22 }}
        onPointerDown={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.stopPropagation()}
        className="glass-strong pointer-events-auto w-[740px] max-w-[96vw] rounded-[28px] p-6"
      >
        <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2.5">
          <Search size={18} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search apps, files, web"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/50"
          />
        </div>

        <div className="scroll-thin mt-4 max-h-[48vh] overflow-y-auto">
          <h3 className="mb-2 font-semibold">Pinned</h3>
          <div className="grid grid-cols-6 gap-y-3">
            {list.map((id) => (
              <button key={id} onClick={() => openApp(id)} className="flex flex-col items-center gap-1.5 rounded-xl p-1.5 hover:bg-white/10">
                <AppIcon icon={APPS[id].icon} size={54} />
                <span className="text-xs">{APPS[id].label}</span>
              </button>
            ))}
          </div>

          {real.length > 0 && (
            <>
              <h3 className="mb-2 mt-5 font-semibold">All apps ({real.length})</h3>
              <div className="grid grid-cols-6 gap-y-3">
                {real.map((a) => (
                  <button
                    key={a.pkg}
                    onClick={() => { launch(a.pkg); closeOverlay(); }}
                    className="flex flex-col items-center gap-1.5 rounded-xl p-1.5 hover:bg-white/10"
                  >
                    <img src={`data:image/png;base64,${a.icon}`} alt="" className="h-[54px] w-[54px] rounded-2xl object-contain" />
                    <span className="line-clamp-1 w-full text-center text-xs">{a.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {list.length === 0 && real.length === 0 && <p className="py-6 text-center text-sm text-white/60">Koi app nahi mila</p>}

          <div className="mb-2 mt-5 flex items-center justify-between">
            <h3 className="font-semibold">Recommended</h3>
            <button className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs">More <ChevronRight size={14} /></button>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {RECENT.map((r) => (
              <button key={r.name} className="flex items-center gap-3 rounded-xl p-2 text-left hover:bg-white/10">
                <AppIcon icon={r.icon} size={40} />
                <div className="min-w-0">
                  <div className="truncate text-sm">{r.name}</div>
                  <div className="text-xs text-white/60">{r.time}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-4">
          <button className="flex items-center gap-3 rounded-xl px-2 py-1 hover:bg-white/10">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10"><User size={18} /></span>
            <span className="text-sm">Zikriyon</span>
          </button>
          <button onClick={() => setOverlay('power')} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 hover:bg-white/10">
            <Power size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
