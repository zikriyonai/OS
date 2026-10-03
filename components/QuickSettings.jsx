'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Bluetooth, Plane, Battery, Sun, Moon, Volume2, ChevronDown } from 'lucide-react';
import Calendar from './Calendar';
import BatteryInfo from './BatteryInfo';
import { Slider } from './ui';
import { useOS } from '@/store/useOS';
import { useSys } from '@/store/useSys';
import { NOTIF_ICON } from '@/lib/apps';
import { useClock, fmtDateLong } from '@/hooks/useClock';

const TILES = [
  { k: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { k: 'bluetooth', label: 'Bluetooth', icon: Bluetooth },
  { k: 'airplane', label: 'Airplane mode', icon: Plane },
  { k: 'saver', label: 'Battery Saver', icon: Battery },
  { k: 'night', label: 'Night Light', icon: Sun },
  { k: 'focus', label: 'Focus', icon: Moon },
];

export default function QuickSettings() {
  const { notifications, clearNotifications, toggles, toggle, brightness, setBrightness, volume, setVolume, openApp } = useOS();
  const { online, btName, pairBluetooth } = useSys();
  const [cal, setCal] = useState(true);
  const now = useClock();

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 30, opacity: 0 }}
      transition={{ duration: 0.2 }}
      onPointerDown={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.stopPropagation()}
      className="scroll-thin absolute bottom-[92px] right-4 z-[6000] flex max-h-[calc(100%-110px)] w-[470px] max-w-[96vw] flex-col gap-3 overflow-y-auto"
    >
      {/* notifications + calendar */}
      <div className="glass-strong rounded-3xl p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          <button onClick={clearNotifications} className="rounded-full bg-white/10 px-3 py-1 text-xs">Clear all</button>
        </div>
        <div className="flex flex-col gap-2">
          {notifications.length === 0 && <p className="py-3 text-center text-sm text-white/60">Koi nayi notification nahi</p>}
          {notifications.map((n) => {
            const Icon = NOTIF_ICON[n.icon] || NOTIF_ICON.sys;
            return (
              <div key={n.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2.5">
                <div className="grad-bg flex h-9 w-9 items-center justify-center rounded-lg"><Icon size={18} /></div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="truncate text-xs text-white/70">{n.body}</div>
                </div>
                <span className="self-start text-[11px] text-white/60">{n.time}</span>
              </div>
            );
          })}
        </div>
        <button onClick={() => setCal(!cal)} className="mt-3 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
          {fmtDateLong(now)} <ChevronDown size={16} className={cal ? 'rotate-180' : ''} />
        </button>
        {cal && <div className="mt-3"><Calendar /></div>}
      </div>

      {/* quick tiles */}
      <div className="glass-strong rounded-3xl p-4">
        <div className="grid grid-cols-3 gap-2.5">
          {TILES.map((t) => {
            const on = t.k === 'wifi' ? online : t.k === 'bluetooth' ? !!btName || toggles.bluetooth : toggles[t.k];
            const sub =
              t.k === 'wifi' ? (online ? 'Connected' : 'Offline')
              : t.k === 'bluetooth' && btName ? btName
              : on ? 'On' : 'Off';
            return (
              <button
                key={t.k}
                onClick={() => (t.k === 'bluetooth' ? pairBluetooth() : t.k === 'wifi' ? openApp('settings') : toggle(t.k))}
                className={`flex h-[62px] items-center gap-2.5 rounded-xl border border-white/15 px-3 text-left ${on ? 'tile-on' : 'bg-white/5'}`}
              >
                <t.icon size={20} />
                <div className="min-w-0">
                  <div className="text-xs font-medium leading-tight">{t.label}</div>
                  <div className="truncate text-[11px] text-white/70">{sub}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-3"><Sun size={20} /><Slider value={brightness} onChange={setBrightness} /></div>
        <div className="mt-4 flex items-center gap-3">
          <Volume2 size={20} /><Slider value={volume} onChange={setVolume} />
          <BatteryInfo size={20} className="gap-1 text-sm shrink-0" />
        </div>
      </div>
    </motion.div>
  );
}
