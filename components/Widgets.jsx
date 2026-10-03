'use client';
import { motion } from 'framer-motion';
import { X, Newspaper, Cpu, Clock } from 'lucide-react';
import Calendar from './Calendar';
import WeatherIcon from './WeatherIcon';
import { useOS } from '@/store/useOS';
import { useSys } from '@/store/useSys';
import { useLiveStats } from '@/hooks/useLiveStats';

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
  const weather = useSys((s) => s.weather);
  const requestLocation = useSys((s) => s.requestLocation);
  const { cpu, cpuLabel, ram, up } = useLiveStats();

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
          {weather ? (
            <>
              <div className="flex items-start gap-3">
                <WeatherIcon code={weather.code} night={!weather.isDay} size={52} />
                <div>
                  <div className="text-sm">{weather.city}</div>
                  <div className="text-xs text-white/60">{weather.label}</div>
                  <div className="text-4xl font-light">{weather.temp}°C</div>
                  <div className="text-xs text-white/60">H: {weather.hi}° &nbsp; L: {weather.lo}°</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-1 text-center text-[11px]">
                {weather.hourly.map((h) => (
                  <div key={h.label} className="rounded-lg bg-white/5 py-1.5">
                    <div className="text-white/60">{h.label}</div>
                    <div className="my-1 flex justify-center"><WeatherIcon code={h.code} night={h.night} size={16} /></div>
                    <div>{h.temp}°</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <button onClick={requestLocation} className="grad-bg rounded-full px-4 py-2 text-sm">Location allow karo</button>
          )}
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
            <Ring value={cpu ?? 0} label="CPU" sub={cpuLabel || 'Measuring...'} color="#38bdf8" />
            <Ring
              value={ram ? Math.round((ram.used / ram.limit) * 100) : 0}
              label="Browser RAM"
              sub={ram ? `${(ram.used / 1048576).toFixed(0)} MB used` : 'Chrome/Edge only'}
              color="#e040c8"
            />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-sm">
            <span className="flex items-center gap-2"><Clock size={16} /> Uptime</span>
            <span>{Math.floor(up / 60)}h {up % 60}m</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
