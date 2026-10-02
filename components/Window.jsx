'use client';
import { useEffect, useRef } from 'react';
import { motion, useDragControls, useMotionValue } from 'framer-motion';
import { Minus, Square, Copy, X } from 'lucide-react';
import { useOS } from '@/store/useOS';
import { APPS } from '@/lib/apps';

export default function Window({ win }) {
  const app = APPS[win.app];
  const focusWin = useOS((s) => s.focusWin);
  const closeWin = useOS((s) => s.closeWin);
  const minimizeWin = useOS((s) => s.minimizeWin);
  const toggleMax = useOS((s) => s.toggleMax);

  const controls = useDragControls();
  const x = useMotionValue(win.x);
  const y = useMotionValue(win.y);
  const saved = useRef({ x: win.x, y: win.y });
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (win.maximized) {
      saved.current = { x: x.get(), y: y.get() };
      x.set(0); y.set(0);
    } else {
      x.set(saved.current.x); y.set(saved.current.y);
    }
  }, [win.maximized, x, y]);

  const Icon = app.icon;
  const C = app.C;
  const stop = (e) => e.stopPropagation();

  return (
    <motion.div
      drag={!win.maximized}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: win.minimized ? 0 : 1, scale: win.minimized ? 0.9 : 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.18 }}
      onPointerDown={() => focusWin(win.id)}
      style={{
        x, y, left: 0, top: 0, zIndex: win.z,
        width: win.maximized ? '100%' : `min(${app.w}px, 96%)`,
        height: win.maximized ? 'calc(100% - 88px)' : `min(${app.h}px, calc(100% - 100px))`,
        pointerEvents: win.minimized ? 'none' : 'auto',
      }}
      className="glass-strong absolute flex flex-col overflow-hidden rounded-3xl"
    >
      <div
        onPointerDown={(e) => controls.start(e)}
        onDoubleClick={() => toggleMax(win.id)}
        className="flex h-12 shrink-0 cursor-default touch-none items-center gap-3 px-4"
      >
        <Icon size={18} stroke="url(#zgrad)" />
        <span className="text-sm">{app.title}</span>
        <div className="ml-auto flex items-center gap-1" onPointerDown={stop} onDoubleClick={stop}>
          <button onClick={() => minimizeWin(win.id)} className="rounded-lg p-2 hover:bg-white/10"><Minus size={16} /></button>
          <button onClick={() => toggleMax(win.id)} className="rounded-lg p-2 hover:bg-white/10">
            {win.maximized ? <Copy size={14} /> : <Square size={14} />}
          </button>
          <button onClick={() => closeWin(win.id)} className="rounded-lg p-2 hover:bg-red-500/70"><X size={16} /></button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <C meta={app} />
      </div>
    </motion.div>
  );
}
