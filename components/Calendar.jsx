'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useClock } from '@/hooks/useClock';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function Calendar() {
  const now = useClock();
  const [off, setOff] = useState(0);
  const base = now || new Date(2026, 9, 2);
  const first = new Date(base.getFullYear(), base.getMonth() + off, 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  return (
    <div>
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-sm font-medium">
          {first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <div className="flex gap-1">
          <button onClick={() => setOff(off - 1)} className="rounded-full p-1 hover:bg-white/10"><ChevronLeft size={16} /></button>
          <button onClick={() => setOff(off + 1)} className="rounded-full p-1 hover:bg-white/10"><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
        {DAYS.map((d) => <div key={d} className="py-1 text-white/60">{d}</div>)}
        {days.map((d, i) => {
          const today = now && d.toDateString() === now.toDateString();
          const other = d.getMonth() !== first.getMonth();
          return (
            <div key={i} className="flex justify-center">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  today ? 'grad-bg font-semibold shadow-[0_0_14px_#8b3dff]' : other ? 'text-white/30' : 'text-white/90'
                }`}
              >
                {d.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
