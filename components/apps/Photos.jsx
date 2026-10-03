'use client';
import { useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useSys } from '@/store/useSys';

export default function Photos() {
  const gallery = useSys((s) => s.gallery);
  const addPhoto = useSys((s) => s.addPhoto);
  const input = useRef(null);
  const [view, setView] = useState(null);

  const onFiles = (e) => {
    [...e.target.files].forEach((f) => addPhoto(URL.createObjectURL(f), f.name));
    e.target.value = '';
  };

  return (
    <div className="relative h-full">
      <div className="scroll-thin h-full overflow-y-auto p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">All photos ({gallery.length})</h3>
          <button onClick={() => input.current.click()} className="grad-bg flex items-center gap-1 rounded-full px-4 py-1.5 text-sm"><Plus size={16} /> Add from device</button>
          <input ref={input} type="file" accept="image/*" multiple hidden onChange={onFiles} />
        </div>
        {gallery.length === 0 && <p className="mt-16 text-center text-sm text-white/60">Abhi koi photo nahi. Camera se click karo, screenshot lo, ya device se add karo.</p>}
        <div className="grid grid-cols-3 gap-3">
          {gallery.map((g) => (
            <button key={g.id} onClick={() => setView(g)} className="aspect-video overflow-hidden rounded-xl border border-white/15">
              <img src={g.src} alt={g.name} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      {view && (
        <div className="absolute inset-0 z-10 flex flex-col items-center gap-3 bg-black/85 p-4">
          <button onClick={() => setView(null)} className="self-end rounded-lg p-1.5 hover:bg-white/10"><X size={20} /></button>
          <img src={view.src} alt="" className="min-h-0 flex-1 object-contain" />
          <a href={view.src} download={view.name} className="text-sm text-violet-300">Download</a>
        </div>
      )}
    </div>
  );
}
