'use client';
import { motion } from 'framer-motion';
import { Moon, RotateCw, Power } from 'lucide-react';
import Wallpaper from './Wallpaper';
import { useOS } from '@/store/useOS';

export default function PowerMenu() {
  const setStage = useOS((s) => s.setStage);
  const closeOverlay = useOS((s) => s.closeOverlay);

  const items = [
    { label: 'Sleep', icon: Moon, go: () => setStage('lock') },
    { label: 'Restart', icon: RotateCw, go: () => setStage('boot') },
    { label: 'Shut down', icon: Power, go: () => setStage('off') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={closeOverlay}
      className="absolute inset-0 z-[7000]"
    >
      <Wallpaper blur={24} dim={0.6} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-10">
        <img src="/logo.png" alt="" className="w-[260px] opacity-90 drop-shadow-[0_0_40px_rgba(139,61,255,.7)]" />
        <div className="flex gap-6" onClick={(e) => e.stopPropagation()}>
          {items.map((it) => (
            <button
              key={it.label}
              onClick={it.go}
              className="glass flex h-36 w-52 flex-col items-center justify-center gap-3 rounded-3xl transition hover:scale-105 hover:shadow-[0_0_35px_#8b3dff]"
            >
              <it.icon size={44} stroke="url(#zgrad)" strokeWidth={1.8} />
              <span className="text-lg">{it.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="absolute bottom-12 flex w-full items-center justify-center gap-4 text-xs tracking-widest text-white/60">
        <span className="h-px w-20 bg-cyan-400/60" /> ZikriyonOS <span className="h-px w-20 bg-fuchsia-500/60" />
      </div>
    </motion.div>
  );
}
