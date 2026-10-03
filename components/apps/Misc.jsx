'use client';
import { useState, useEffect } from 'react';
import Calendar from '../Calendar';
import { useClock, fmtTime, fmtDateLong } from '@/hooks/useClock';

export function Placeholder({ meta }) {
  const Icon = meta.icon;
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <Icon size={80} stroke="url(#zgrad)" strokeWidth={1.2} />
      <h2 className="text-2xl">{meta.title}</h2>
      <p className="text-sm text-white/60">Ye app jald aa raha hai.</p>
    </div>
  );
}

export function CalendarApp() {
  return <div className="p-6"><Calendar /></div>;
}

export function ClockApp() {
  const now = useClock();
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="grad-text text-7xl font-light">{fmtTime(now)}</div>
      <div className="mt-2 text-white/70">{fmtDateLong(now)}</div>
    </div>
  );
}

export function Notepad() {
  const [t, setT] = useState('');

  useEffect(() => {
    try { setT(localStorage.getItem('zk-note') || ''); } catch {}
  }, []);

  const change = (v) => {
    setT(v);
    try { localStorage.setItem('zk-note', v); } catch {}
  };

  const save = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([t], { type: 'text/plain' }));
    a.download = 'note.txt';
    a.click();
  };

  return (
    <div className="flex h-full flex-col">
      <textarea
        value={t}
        onChange={(e) => change(e.target.value)}
        placeholder="Yahan likho..."
        className="flex-1 resize-none bg-transparent p-5 text-sm outline-none placeholder:text-white/40"
        style={{ userSelect: 'text' }}
      />
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-xs text-white/60">
        <span>Auto-saved in browser</span>
        <button onClick={save} className="grad-bg rounded-full px-3 py-1 text-white">Save to device</button>
      </div>
    </div>
  );
}

export function CalcApp() {
  const [d, setD] = useState('0');
  const [acc, setAcc] = useState(null);
  const [op, setOp] = useState(null);
  const [fresh, setFresh] = useState(true);

  const compute = (a, b, o) => (o === '+' ? a + b : o === '-' ? a - b : o === '×' ? a * b : o === '÷' ? (b === 0 ? 0 : a / b) : b);
  const num = (n) => {
    if (fresh || d === '0') { setD(n === '.' ? '0.' : n); setFresh(false); }
    else if (n === '.' && d.includes('.')) return;
    else setD(d + n);
  };
  const oper = (o) => {
    const cur = parseFloat(d);
    if (acc !== null && op && !fresh) { const r = compute(acc, cur, op); setAcc(r); setD(String(+r.toFixed(10))); }
    else setAcc(cur);
    setOp(o); setFresh(true);
  };
  const eq = () => {
    if (op === null || acc === null) return;
    setD(String(+compute(acc, parseFloat(d), op).toFixed(10)));
    setAcc(null); setOp(null); setFresh(true);
  };
  const clear = () => { setD('0'); setAcc(null); setOp(null); setFresh(true); };
  const press = (k) => (/[\d.]/.test(k) ? num(k) : k === '=' ? eq() : oper(k));

  const keys = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '=', '+'];

  return (
    <div className="flex h-full flex-col p-4">
      <div className="truncate px-3 py-5 text-right text-5xl font-light">{d}</div>
      <div className="grid flex-1 grid-cols-4 gap-2">
        <button onClick={clear} className="col-span-4 rounded-xl bg-white/10 text-lg hover:bg-white/20">C</button>
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => press(k)}
            className={`rounded-xl text-xl ${/[÷×\-+=]/.test(k) ? 'grad-bg' : 'bg-white/10 hover:bg-white/20'}`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
