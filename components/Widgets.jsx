'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, CloudMoon, Moon, Cloud, Sun, Newspaper, Cpu, Clock } from 'lucide-react';
import Calendar from './Calendar';
import { useOS } from '@/store/useOS';

const HOURLY = [
  { t: 'Now', i: Moon, d: '22°' },
  { t: '11 PM', i: Moon, d: '20°' },
  { t: '2 AM', i: Cloud, d: '18°' },
  { t: '5 AM', i: Cloud, d: '17°' },
  { t: '8 AM', i: Sun, d: '21°' },
];

const NEWS = [
  ['New AI model achieves breakthrough in real-time reasoning', '2h ago', 'from-blue-600 to-cyan-400'],
  ['Global space mission sets new record for satellite deployment', '4h ago', 'from-indigo-700 to-sky-500'],
  ['Clean energy investment reaches new high', '6h ago', 'from-emerald-600 to-green-400'],
  ['Smart cities are shaping a more sustainable future', '8h ago', 'from-violet-600 to-fuchsia-500'],
];

function Ring({ value, label, sub, color }) {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-3">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} stroke="rgba(255,255,255,.12)" strokeWidth="6" fill="none" />
        <circle
          cx="32" cy="32" r={r} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} transform="rotate(-90 32 32)"
          style={{ transition: 'stroke-dashoffset .6s' }}
        />
      </svg>
      <div>
        <div className="text-xs text-white/70">{label}</div>
        <div className="text-2xl">{value}%</div>
        <div className="text-[11px] text-white/50">{sub}</div>
      </div>
    </div>
  );
}

export default function Widgets() {
  const closeOverlay = useOS((s) => s.closeOverlay);
  const [cpu, setCpu] = useState(28);
  const [ram, setRam] = useState(62);

  useEffect(() => {
    const t = setInterval(() => {
      setCpu(20 + Math.round(Math.random() * 25));
      setRam(58 + Math.round(Math.random() * 8));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}
      transition={{ duration: 0.22 }}
      onPointerDown={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.stopPropagation()}
      className="glass-strong scroll-thin absolute bottom-[92px] left-4 top-4 z-[6000] w-[660px] max-w-[96vw] overflow-y-auto rounded-3xl p-4"
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="font-semibold">Widgets</span>
        <button onClick={closeOverlay} className="rounded-lg p-1.5 hover:bg-white/10"><X size={18} /></button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* weather */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-start gap-3">
            <CloudMoon size={52} stroke="url(#zgrad)" />
            <div>
              <div className="text-sm">New Delhi</div>
              <div className="text-xs text-white/60">Clear sky</div>
              <div className="text-4xl font-light">22°C</div>
              <div className="text-xs text-white/60">H: 28° &nbsp; L: 16°</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-1 text-center text-[11px]">
            {HOURLY.map((h) => (
              <div key={h.t} className="rounded-lg bg-white/5 py-1.5">
                <div className="text-white/60">{h.t}</div>
                <h.i size={16} className="mx-auto my-1" stroke="url(#zgrad)" />
                <div>{h.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* calendar */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><Calendar /></div>

        {/* news */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium"><Newspaper size={16} /> Top News</div>
          <div className="flex flex-col gap-2.5">
            {NEWS.map(([t, time, g]) => (
              <div key={t} className="flex items-center gap-2.5">
                <div className={`h-11 w-14 shrink-0 rounded-lg bg-gradient-to-br ${g}`} />
                <div className="min-w-0">
                  <div className="line-clamp-2 text-xs leading-snug">{t}</div>
                  <div className="text-[11px] text-white/50">{time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* system */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium"><Cpu size={16} /> System</div>
          <div className="flex flex-col gap-4">
            <Ring value={cpu} label="CPU" sub="3.60 GHz" color="#38bdf8" />
            <Ring value={ram} label="RAM" sub={`${((ram / 100) * 16).toFixed(1)} / 16.0 GB`} color="#e040c8" />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-sm">
            <span className="flex items-center gap-2"><Clock size={16} /> Uptime</span><span>2h 34m</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
