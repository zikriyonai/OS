'use client';
import { useEffect, useRef, useState } from 'react';
import { Mic, Square } from 'lucide-react';

export default function RecorderApp() {
  const [rec, setRec] = useState(false);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');
  const [level, setLevel] = useState(0);
  const [secs, setSecs] = useState(0);
  const mr = useRef(null), stream = useRef(null), raf = useRef(0), ctx = useRef(null), timer = useRef(null);

  const cleanup = () => {
    stream.current?.getTracks().forEach((t) => t.stop());
    cancelAnimationFrame(raf.current);
    clearInterval(timer.current);
    try { ctx.current?.close(); } catch {}
  };
  useEffect(() => cleanup, []);

  const start = async () => {
    setErr('');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = s;
      const chunks = [];
      const m = new MediaRecorder(s);
      mr.current = m;
      m.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      m.onstop = () => {
        const blob = new Blob(chunks, { type: m.mimeType || 'audio/webm' });
        setItems((i) => [{ id: Date.now(), url: URL.createObjectURL(blob), name: `Recording ${i.length + 1}` }, ...i]);
      };
      const AC = window.AudioContext || window.webkitAudioContext;
      const ac = new AC();
      ctx.current = ac;
      const an = ac.createAnalyser();
      an.fftSize = 256;
      ac.createMediaStreamSource(s).connect(an);
      const buf = new Uint8Array(an.frequencyBinCount);
      const tick = () => {
        an.getByteTimeDomainData(buf);
        let peak = 0;
        for (const v of buf) peak = Math.max(peak, Math.abs(v - 128));
        setLevel(Math.min(100, peak * 1.6));
        raf.current = requestAnimationFrame(tick);
      };
      tick();
      m.start();
      setRec(true); setSecs(0);
      timer.current = setInterval(() => setSecs((x) => x + 1), 1000);
    } catch (e) {
      setErr(e.name === 'NotAllowedError' ? 'Mic permission denied. Address bar ke lock icon se allow karo.' : 'Mic nahi mila.');
    }
  };

  const stop = () => {
    mr.current?.stop();
    cleanup();
    setRec(false); setLevel(0);
  };

  const mmss = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;

  return (
    <div className="flex h-full flex-col items-center p-6">
      <div className="text-5xl font-light">{mmss}</div>
      <div className="mt-4 flex h-12 items-end gap-1">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="w-1.5 rounded-full bg-gradient-to-t from-sky-400 to-fuchsia-500 transition-all"
            style={{ height: `${8 + (rec ? level * (0.4 + Math.abs(Math.sin(i * 1.3)) * 0.6) * 0.4 : 0)}px` }} />
        ))}
      </div>
      <button onClick={rec ? stop : start} className={`mt-5 flex h-16 w-16 items-center justify-center rounded-full shadow-[0_0_25px_#8b3dff] ${rec ? 'bg-red-500' : 'grad-bg'}`}>
        {rec ? <Square size={24} /> : <Mic size={28} />}
      </button>
      {err && <p className="mt-3 text-sm text-red-300">{err}</p>}
      <div className="scroll-thin mt-5 w-full flex-1 space-y-2 overflow-y-auto">
        {items.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2.5">
            <span className="text-sm">{r.name}</span>
            <audio src={r.url} controls className="h-8 flex-1" />
            <a href={r.url} download={`${r.name}.webm`} className="text-xs text-violet-300">Save</a>
          </div>
        ))}
      </div>
    </div>
  );
}
