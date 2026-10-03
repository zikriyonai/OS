'use client';
import { useEffect, useState } from 'react';

export function useLiveStats() {
  const [s, setS] = useState({ cpu: null, cpuLabel: '', ram: null, up: 0 });

  useEffect(() => {
    let last = performance.now();
    let lag = 0;
    let pressure = null;
    let po = null;
    try {
      if ('PressureObserver' in window) {
        po = new PressureObserver((r) => {
          const st = r[r.length - 1].state;
          pressure = { nominal: 15, fair: 45, serious: 75, critical: 95 }[st];
        });
        po.observe('cpu', { sampleInterval: 1000 }).catch(() => { po = null; });
      }
    } catch {}

    const t = setInterval(() => {
      const now = performance.now();
      const drift = Math.max(0, now - last - 1000);
      last = now;
      lag = lag * 0.6 + drift * 0.4;
      const m = performance.memory;
      setS({
        cpu: pressure ?? Math.min(100, Math.round(5 + lag / 4)),
        cpuLabel: pressure != null ? 'Device CPU pressure' : 'Browser load',
        ram: m ? { used: m.usedJSHeapSize, limit: m.jsHeapSizeLimit } : null,
        up: Math.floor(now / 60000),
      });
    }, 1000);

    return () => { clearInterval(t); try { po?.disconnect(); } catch {} };
  }, []);

  return s;
}
