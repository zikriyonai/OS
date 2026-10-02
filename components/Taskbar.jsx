'use client';
import { Search, LayoutPanelLeft, Wifi, Volume2, BatteryMedium } from 'lucide-react';
import { useOS } from '@/store/useOS';
import { APPS, PINNED } from '@/lib/apps';
import { useClock, fmtTime, fmtDateShort } from '@/hooks/useClock';

export default function Taskbar() {
  const windows = useOS((s) => s.windows);
  const overlay = useOS((s) => s.overlay);
  const toggleOverlay = useOS((s) => s.toggleOverlay);
  const openApp = useOS((s) => s.openApp);
  const minimizeWin = useOS((s) => s.minimizeWin);
  const now = useClock();

  const top = [...windows].filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0];
  const extra = windows.map((w) => w.app).filter((a) => !PINNED.includes(a));
  const items = [...PINNED, ...extra];

  const clickApp = (id) => {
    const w = windows.find((x) => x.app === id);
    if (w && !w.minimized && top?.id === w.id) minimizeWin(w.id);
    else openApp(id);
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-[5000] flex justify-center">
      <div
        onPointerDown={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.stopPropagation()}
        className="glass pointer-events-auto flex items-center gap-1 rounded-full px-3 py-2"
      >
        <button
          onClick={() => toggleOverlay('start')}
          className={`rounded-full p-1.5 transition hover:bg-white/10 ${overlay === 'start' ? 'bg-white/15 shadow-[0_0_18px_#8b3dff]' : ''}`}
        >
          <img src="/logo.png" alt="start" className="h-10 w-10 object-contain" />
        </button>
        <span className="mx-1 h-7 w-px bg-white/20" />
        <button onClick={() => toggleOverlay('start')} className="rounded-xl p-2.5 hover:bg-white/10">
          <Search size={24} stroke="url(#zgrad)" />
        </button>
        <button
          onClick={() => toggleOverlay('taskview')}
          className={`rounded-xl p-2.5 hover:bg-white/10 ${overlay === 'taskview' ? 'bg-white/15' : ''}`}
        >
          <LayoutPanelLeft size={24} stroke="url(#zgrad)" />
        </button>
        <span className="mx-1 h-7 w-px bg-white/20" />

        {items.map((id) => {
          const Icon = APPS[id].icon;
          const running = windows.some((w) => w.app === id);
          const active = top?.app === id;
          return (
            <button
              key={id}
              onClick={() => clickApp(id)}
              title={APPS[id].label}
              className={`relative rounded-xl p-2.5 transition hover:bg-white/10 ${active ? 'bg-white/15' : ''}`}
            >
              <Icon size={24} stroke="url(#zgrad)" />
              {running && <span className="absolute bottom-0.5 left-1/2 h-1 w-3 -translate-x-1/2 rounded-full grad-bg" />}
            </button>
          );
        })}

        <span className="mx-1 h-7 w-px bg-white/20" />
        <button
          onClick={() => toggleOverlay('quick')}
          className={`flex items-center gap-3 rounded-2xl px-3 py-1.5 hover:bg-white/10 ${overlay === 'quick' ? 'bg-white/15' : ''}`}
        >
          <Wifi size={18} />
          <Volume2 size={18} />
          <span className="flex items-center gap-1 text-xs"><BatteryMedium size={20} /> 78%</span>
          <span className="text-right text-xs leading-tight">
            <div>{fmtTime(now)}</div>
            <div className="text-white/70">{fmtDateShort(now)}</div>
          </span>
        </button>
      </div>
    </div>
  );
}
