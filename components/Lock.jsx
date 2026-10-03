'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Accessibility } from 'lucide-react';
import Wallpaper from './Wallpaper';
import BatteryInfo from './BatteryInfo';
import NetIcon from './NetIcon';
import { useOS } from '@/store/useOS';
import { useSys } from '@/store/useSys';
import { NOTIF_ICON } from '@/lib/apps';
import { useClock, fmtTime, fmtDateLong } from '@/hooks/useClock';

export default function Lock() {
  const setStage = useOS((s) => s.setStage);
  const notifications = useOS((s) => s.notifications);
  const now = useClock();

  useEffect(() => { useSys.getState().init(); }, []);

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Enter' || e.key === ' ') setStage('login');
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [setStage]);

  return (
    <motion.div
      className="absolute inset-0 cursor-pointer"
      onClick={() => setStage('login')}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Wallpaper />
      <div className="absolute inset-x-0 top-[6%] flex flex-col items-center">
        <div className="text-[9rem] font-extralight leading-none tracking-wide drop-shadow-[0_0_25px_rgba(120,100,255,.6)]">
          {fmtTime(now)}
        </div>
        <div className="mt-2 text-2xl tracking-[0.25em] text-white/90">{fmtDateLong(now)}</div>

        <div className="mt-8 flex w-[560px] max-w-[92vw] flex-col gap-3">
          {notifications.slice(0, 2).map((n) => {
            const Icon = NOTIF_ICON[n.icon] || NOTIF_ICON.sys;
            return (
              <div key={n.id} className="glass flex items-center gap-4 rounded-3xl p-4">
                <div className="grad-bg flex h-11 w-11 items-center justify-center rounded-xl"><Icon size={22} /></div>
                <div className="flex-1">
                  <div className="font-medium">{n.title}</div>
                  <div className="text-sm text-white/70">{n.body}</div>
                </div>
                <div className="self-start text-xs text-white/70">{n.time}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 flex flex-col items-center">
        <div className="rounded-full p-[3px] grad-bg shadow-[0_0_30px_#8b3dff]">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#0b0630]">
            <img src="/logo.png" alt="" className="w-20" />
          </div>
        </div>
        <div className="mt-3 text-xl tracking-[0.3em]">Zikriyon</div>
        <div className="mt-1 text-xs tracking-[0.25em] text-white/70">Press Enter to unlock</div>
      </div>

      <img src="/logo.png" alt="" className="absolute bottom-6 left-6 w-16" />
      <div className="glass absolute bottom-6 right-6 flex items-center gap-4 rounded-full px-5 py-3">
        <NetIcon size={20} />
        <span className="h-5 w-px bg-white/20" />
        <BatteryInfo size={22} className="gap-2 text-sm" />
        <span className="h-5 w-px bg-white/20" />
        <Accessibility size={20} />
      </div>
    </motion.div>
  );
}
