'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import Wallpaper from './Wallpaper';
import { useOS } from '@/store/useOS';
import { APPS } from '@/lib/apps';

export default function TaskView() {
  const windows = useOS((s) => s.windows);
  const focusWin = useOS((s) => s.focusWin);
  const closeWin = useOS((s) => s.closeWin);
  const openApp = useOS((s) => s.openApp);
  const closeOverlay = useOS((s) => s.closeOverlay);
  const [desks, setDesks] = useState([1, 2, 3]);
  const [active, setActive] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={closeOverlay}
      className="absolute inset-0 z-[5500] overflow-hidden"
    >
      <Wallpaper blur={22} dim={0.5} />

      <div className="relative flex justify-center pt-5" onClick={(e) => e.stopPropagation()}>
        <div className="glass flex items-center gap-3 rounded-3xl p-3">
          {desks.map((d, i) => (
            <button key={d} onClick={() => setActive(i)} className="flex flex-col items-center gap-1.5">
              <div
                className={`h-16 w-28 rounded-xl bg-cover bg-center ${active === i ? 'ring-2 ring-[#8b3dff] shadow-[0_0_18px_#8b3dff]' : 'opacity-70'}`}
                style={{ backgroundImage: 'url(/wallpaper.png)', backgroundPosition: `${i * 40}% 50%` }}
              />
              <span className="text-xs">Desktop {i + 1}</span>
            </button>
          ))}
          <button
            onClick={() => desks.length < 6 && setDesks([...desks, Date.now()])}
            className="flex h-[88px] w-28 flex-col items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/5"
          >
            <Plus size={26} /><span className="text-xs">New desktop</span>
          </button>
        </div>
      </div>

      <div className="relative mx-auto mt-8 grid max-w-[1000px] grid-cols-2 gap-6 px-6" onClick={(e) => e.stopPropagation()}>
        {windows.length === 0 && (
          <p className="col-span-2 mt-20 text-center text-white/70">Koi window khuli nahi hai. Koi app kholo!</p>
        )}
        {windows.slice(0, 4).map((w) => {
          const app = APPS[w.app];
          return (
            <motion.div
              key={w.id}
              whileHover={{ scale: 1.03 }}
              onClick={() => focusWin(w.id) || openApp(w.app)}
              className="glass-strong cursor-pointer overflow-hidden rounded-2xl"
            >
              <div className="flex items-center gap-2 px-3 py-2 text-sm">
                <app.icon size={16} stroke="url(#zgrad)" />
                <span className="flex-1">{app.title}</span>
                <button onClick={(e) => { e.stopPropagation(); closeWin(w.id); }} className="rounded p-1 hover:bg-red-500/60"><X size={14} /></button>
              </div>
              <div className="flex h-44 items-center justify-center bg-black/20">
                <app.icon size={72} stroke="url(#zgrad)" strokeWidth={1.2} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
