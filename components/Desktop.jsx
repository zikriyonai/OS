'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, Trash2, Folder, Globe } from 'lucide-react';
import Wallpaper from './Wallpaper';
import AppIcon from './AppIcon';
import Taskbar from './Taskbar';
import Window from './Window';
import StartMenu from './StartMenu';
import QuickSettings from './QuickSettings';
import Widgets from './Widgets';
import TaskView from './TaskView';
import PowerMenu from './PowerMenu';
import ContextMenu from './ContextMenu';
import WeatherIcon from './WeatherIcon';
import PermissionPrompt from './PermissionPrompt';
import { useOS } from '@/store/useOS';
import { useSys } from '@/store/useSys';
import { useClock, fmtTime, fmtDateLong } from '@/hooks/useClock';

const ICONS = [
  { id: 'explorer', label: 'This PC', icon: Monitor },
  { id: 'trash', label: 'Recycle Bin', icon: Trash2 },
  { id: 'explorer', label: 'Files', icon: Folder },
  { id: 'browser', label: 'Browser', icon: Globe },
];

export default function Desktop() {
  const windows = useOS((s) => s.windows);
  const overlay = useOS((s) => s.overlay);
  const context = useOS((s) => s.context);
  const brightness = useOS((s) => s.brightness);
  const night = useOS((s) => s.toggles.night);
  const closeOverlay = useOS((s) => s.closeOverlay);
  const openApp = useOS((s) => s.openApp);
  const setContext = useOS((s) => s.setContext);
  const toggleOverlay = useOS((s) => s.toggleOverlay);
  const [sel, setSel] = useState(null);
  const now = useClock();
  const weather = useSys((s) => s.weather);

  useEffect(() => { useSys.getState().init(); }, []);

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && closeOverlay();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [closeOverlay]);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onPointerDown={() => { closeOverlay(); setSel(null); }}
      onContextMenu={(e) => { e.preventDefault(); setContext({ x: e.clientX, y: e.clientY }); }}
    >
      <Wallpaper />

      {/* center logo */}
      <img
        src="/logo.png"
        alt=""
        className="pointer-events-none absolute left-1/2 top-[44%] w-[300px] -translate-x-1/2 -translate-y-1/2 opacity-90 drop-shadow-[0_0_40px_rgba(139,61,255,.7)]"
      />

      {/* desktop icons */}
      <div className="absolute left-3 top-3 flex flex-col gap-2">
        {ICONS.map((ic, i) => (
          <button
            key={i}
            onClick={() => setSel(i)}
            onDoubleClick={() => openApp(ic.id)}
            className={`flex w-[92px] flex-col items-center gap-1 rounded-xl p-2 text-sm ${sel === i ? 'bg-white/15' : 'hover:bg-white/10'}`}
          >
            <AppIcon icon={ic.icon} size={64} />
            <span className="drop-shadow">{ic.label}</span>
          </button>
        ))}
      </div>

      {/* top-right widget */}
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => toggleOverlay('widgets')}
        className="glass absolute right-4 top-4 flex items-center gap-5 rounded-3xl px-6 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <WeatherIcon code={weather?.code ?? 0} night={weather ? !weather.isDay : true} size={44} />
          <div>
            <div className="text-3xl font-light">{weather ? `${weather.temp}°C` : '--°C'}</div>
            <div className="text-xs text-white/70">{weather ? `${weather.city} · ${weather.label}` : 'Location allow karo'}</div>
          </div>
        </div>
        <span className="h-12 w-px bg-white/20" />
        <div className="text-right">
          <div className="text-5xl font-light">{fmtTime(now)}</div>
          <div className="text-sm text-white/80">{fmtDateLong(now)}</div>
        </div>
      </button>

      {/* windows */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {windows.map((w) => <Window key={w.id} win={w} />)}
        </AnimatePresence>
      </div>

      {/* overlays */}
      <AnimatePresence>{overlay === 'widgets' && <Widgets key="w" />}</AnimatePresence>
      <AnimatePresence>{overlay === 'start' && <StartMenu key="s" />}</AnimatePresence>
      <AnimatePresence>{overlay === 'quick' && <QuickSettings key="q" />}</AnimatePresence>
      <AnimatePresence>{overlay === 'taskview' && <TaskView key="t" />}</AnimatePresence>
      <Taskbar />
      <AnimatePresence>{overlay === 'power' && <PowerMenu key="p" />}</AnimatePresence>
      <AnimatePresence>{context && <ContextMenu key="c" />}</AnimatePresence>

      <PermissionPrompt />

      {/* brightness + night light */}
      <div className="pointer-events-none absolute inset-0 z-[9000]" style={{ background: `rgba(0,0,0,${((100 - brightness) / 100) * 0.7})` }} />
      {night && <div className="pointer-events-none absolute inset-0 z-[9001]" style={{ background: 'rgba(255,150,0,.1)' }} />}
    </motion.div>
  );
}
