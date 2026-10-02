'use client';
import { useEffect, useState } from 'react';

export function useClock() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export const fmtTime = (d) =>
  d ? d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '--:--';

export const fmtDateLong = (d) =>
  d ? d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : '';

export const fmtDateShort = (d) =>
  d ? d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : '';
