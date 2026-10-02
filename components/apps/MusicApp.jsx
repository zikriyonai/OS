'use client';
import { useState } from 'react';
import { Home, Library, ListMusic, Mic2, Disc3, Shapes, Heart, Play, Pause } from 'lucide-react';

const NAV = [['Home', Home], ['Library', Library], ['Playlists', ListMusic], ['Artists', Mic2], ['Albums', Disc3], ['Genres', Shapes], ['Favorites', Heart]];
const RECENT = [
  ['Neon Dreams', 'from-fuchsia-600 to-indigo-900'],
  ['Skyline', 'from-sky-500 to-indigo-900'],
  ['Infinite', 'from-pink-500 to-violet-900'],
  ['Midnight', 'from-blue-600 to-purple-900'],
];

export default function MusicApp() {
  const [nav, setNav] = useState('Home');
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex h-full">
      <div className="w-56 shrink-0 border-r border-white/10 p-3">
        {NAV.map(([n, I]) => (
          <button key={n} onClick={() => setNav(n)} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm ${nav === n ? 'grad-bg' : 'hover:bg-white/10'}`}>
            <I size={18} /> {n}
          </button>
        ))}
      </div>
      <div className="scroll-thin flex-1 overflow-y-auto p-5">
        <div className="flex items-center gap-5 rounded-2xl border border-white/15 bg-white/5 p-4">
          <div className="h-28 w-28 shrink-0 rounded-xl bg-gradient-to-br from-fuchsia-600 via-violet-700 to-blue-900 shadow-[0_0_25px_#8b3dff]" />
          <div className="flex-1">
            <div className="text-2xl font-semibold">Better Tomorrow</div>
            <div className="text-sm text-white/70">Zikriyon Music</div>
            <div className="mt-3 flex items-center gap-4">
              <button onClick={() => setPlaying(!playing)} className="grad-bg flex h-11 w-11 items-center justify-center rounded-full shadow-[0_0_18px_#8b3dff]">
                {playing ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <div className="flex h-10 flex-1 items-end gap-[3px]">
                {Array.from({ length: 48 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-[3px] rounded-full bg-gradient-to-t from-sky-400 to-fuchsia-500 ${playing ? 'animate-pulse' : ''}`}
                    style={{ height: `${25 + Math.abs(Math.sin(i * 0.7)) * 75}%`, animationDelay: `${i * 40}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <h3 className="mb-3 mt-6 font-semibold">Recently Played</h3>
        <div className="grid grid-cols-4 gap-4">
          {RECENT.map(([n, g]) => (
            <div key={n} className="cursor-pointer transition hover:scale-105">
              <div className={`aspect-square rounded-xl bg-gradient-to-br ${g}`} />
              <div className="mt-2 text-sm">{n}</div>
              <div className="text-xs text-white/60">Zikriyon Music</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
