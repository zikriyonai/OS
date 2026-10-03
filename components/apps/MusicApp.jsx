'use client';
import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, FolderOpen, Music as MusicIcon } from 'lucide-react';
import { useOS } from '@/store/useOS';

const fmt = (s) => (!isFinite(s) ? '0:00' : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`);

export default function MusicApp() {
  const volume = useOS((s) => s.volume);
  const audio = useRef(null);
  const input = useRef(null);
  const [tracks, setTracks] = useState([]);
  const [idx, setIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => { if (audio.current) audio.current.volume = volume / 100; }, [volume]);
  useEffect(() => { if (idx >= 0) audio.current?.play().catch(() => {}); }, [idx]);

  const next = () => tracks.length && setIdx((i) => (i + 1) % tracks.length);
  const prev = () => tracks.length && setIdx((i) => (i - 1 + tracks.length) % tracks.length);
  const toggle = () => (audio.current?.paused ? audio.current.play() : audio.current?.pause());

  useEffect(() => {
    if (!('mediaSession' in navigator) || idx < 0 || !tracks[idx]) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: tracks[idx].name,
      artist: 'ZikriyonOS Music',
      artwork: [{ src: '/logo.png', sizes: '512x512', type: 'image/png' }],
    });
    navigator.mediaSession.setActionHandler('play', () => audio.current?.play());
    navigator.mediaSession.setActionHandler('pause', () => audio.current?.pause());
    navigator.mediaSession.setActionHandler('nexttrack', next);
    navigator.mediaSession.setActionHandler('previoustrack', prev);
  }, [idx, tracks]);

  const add = (e) => {
    const fs = [...e.target.files].map((f) => ({ name: f.name.replace(/\.[^.]+$/, ''), url: URL.createObjectURL(f) }));
    if (!fs.length) return;
    if (idx < 0) setIdx(tracks.length);
    setTracks((t) => [...t, ...fs]);
    e.target.value = '';
  };

  return (
    <div className="flex h-full">
      <audio
        ref={audio}
        src={tracks[idx]?.url}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={next}
        onTimeUpdate={(e) => setCur(e.target.currentTime)}
        onLoadedMetadata={(e) => setDur(e.target.duration)}
      />
      <div className="w-64 shrink-0 border-r border-white/10 p-3">
        <button onClick={() => input.current.click()} className="grad-bg mb-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm">
          <FolderOpen size={16} /> Add songs from device
        </button>
        <input ref={input} type="file" accept="audio/*" multiple hidden onChange={add} />
        <div className="scroll-thin max-h-[390px] space-y-1 overflow-y-auto">
          {tracks.map((t, i) => (
            <button key={t.url} onClick={() => setIdx(i)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${i === idx ? 'bg-white/15' : 'hover:bg-white/10'}`}>
              <MusicIcon size={14} /> <span className="truncate">{t.name}</span>
            </button>
          ))}
          {tracks.length === 0 && <p className="p-3 text-xs text-white/50">Koi gaana nahi. Upar se add karo.</p>}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6">
        <div className="h-40 w-40 rounded-2xl bg-gradient-to-br from-fuchsia-600 via-violet-700 to-blue-900 shadow-[0_0_35px_#8b3dff]" />
        <div className="text-center">
          <div className="text-xl font-semibold">{tracks[idx]?.name || 'Better Tomorrow'}</div>
          <div className="text-sm text-white/60">ZikriyonOS Music</div>
        </div>
        <div className="flex h-10 items-end gap-[3px]">
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} className={`w-[3px] rounded-full bg-gradient-to-t from-sky-400 to-fuchsia-500 ${playing ? 'animate-pulse' : ''}`}
              style={{ height: `${25 + Math.abs(Math.sin(i * 0.7)) * 75}%`, animationDelay: `${i * 40}ms` }} />
          ))}
        </div>
        <div className="flex w-full max-w-sm items-center gap-3 text-xs">
          <span>{fmt(cur)}</span>
          <input type="range" min="0" max={dur || 0} value={cur} onChange={(e) => (audio.current.currentTime = +e.target.value)}
            className="zslider flex-1" style={{ '--v': `${dur ? (cur / dur) * 100 : 0}%` }} />
          <span>{fmt(dur)}</span>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={prev}><SkipBack size={24} /></button>
          <button onClick={toggle} className="grad-bg flex h-14 w-14 items-center justify-center rounded-full shadow-[0_0_20px_#8b3dff]">
            {playing ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button onClick={next}><SkipForward size={24} /></button>
        </div>
      </div>
    </div>
  );
}
