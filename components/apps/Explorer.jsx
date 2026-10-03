'use client';
import { useRef, useState } from 'react';
import {
  Home, Monitor, FileText, Download, Image as ImageIcon, Music, Video, Code2, Brush, Mountain,
  Crop, Archive, StickyNote, ArrowLeft, ArrowRight, ArrowUp, Search, List, LayoutGrid, Grid3x3,
  ChevronDown, Folder, FolderOpen, File,
} from 'lucide-react';

const SIDE = [['Home', Home], ['Desktop', Monitor], ['Documents', FileText], ['Downloads', Download], ['Pictures', ImageIcon], ['Music', Music]];
const FOLDERS = [
  ['Desktop', Monitor], ['Documents', FileText], ['Downloads', Download], ['Pictures', ImageIcon],
  ['Music', Music], ['Videos', Video], ['Projects', Code2], ['Themes', Brush],
  ['Wallpapers', Mountain], ['Screenshots', Crop], ['Archives', Archive], ['Notes', StickyNote],
];

function FolderTile({ icon: Icon }) {
  return (
    <div className="relative h-[68px] w-[84px]">
      <div className="absolute -top-2 left-0 h-4 w-9 rounded-t-lg bg-gradient-to-r from-blue-500 to-violet-500" />
      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#4f8bff] via-[#6b4dff] to-[#b43fe8] shadow-[0_0_20px_rgba(139,61,255,.5)]">
        <Icon size={30} color="white" />
      </div>
    </div>
  );
}

export default function Explorer() {
  const [side, setSide] = useState('Home');
  const [sel, setSel] = useState('Documents');
  const [real, setReal] = useState(null); // { stack, items }
  const fallback = useRef(null);

  const enter = async (stack) => {
    const h = stack[stack.length - 1].handle;
    const items = [];
    for await (const [name, handle] of h.entries()) {
      items.push({ name, handle, kind: handle.kind });
      if (items.length >= 500) break;
    }
    items.sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === 'directory' ? -1 : 1));
    setReal({ stack, items });
  };

  const openDevice = async () => {
    if (window.showDirectoryPicker) {
      try {
        const h = await window.showDirectoryPicker({ mode: 'read' });
        await enter([{ name: h.name, handle: h }]);
      } catch {}
    } else fallback.current?.click();
  };

  const onFallback = (e) => {
    const files = [...e.target.files];
    if (!files.length) return;
    setReal({ stack: [{ name: 'Selected folder' }], items: files.map((f) => ({ name: f.webkitRelativePath || f.name, kind: 'file', file: f })) });
  };

  const openItem = async (it) => {
    if (it.kind === 'directory') return enter([...real.stack, { name: it.name, handle: it.handle }]);
    const f = it.file || (await it.handle.getFile());
    window.open(URL.createObjectURL(f), '_blank');
  };

  const up = () => {
    if (!real) return;
    if (real.stack.length > 1 && real.stack[0].handle) enter(real.stack.slice(0, -1));
    else setReal(null);
  };

  const path = real ? real.stack.map((s) => s.name).join(' › ') : null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-3 px-4 pb-3">
        <div className="glass flex items-center gap-1 rounded-xl px-2">
          <button onClick={up} className="p-2"><ArrowLeft size={18} /></button>
          <button className="p-2 opacity-40"><ArrowRight size={18} /></button>
          <button onClick={up} className="p-2"><ArrowUp size={18} /></button>
        </div>
        <div className="glass flex flex-1 items-center gap-3 truncate rounded-xl px-3 text-sm">
          <ChevronDown size={16} />
          {real ? <span className="truncate text-white/90">{path}</span> : <>This PC <span className="text-white/40">›</span> <span className="text-white/80">{sel}</span></>}
        </div>
        <div className="glass flex w-56 items-center gap-2 rounded-xl px-3 text-sm">
          <Search size={16} /><span className="text-white/60">Search</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 border-t border-white/10">
        <div className="w-56 shrink-0 p-3">
          {SIDE.map(([n, I]) => (
            <button key={n} onClick={() => { setSide(n); setReal(null); }}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${side === n && !real ? 'grad-bg' : 'hover:bg-white/10'}`}>
              <I size={18} /> {n}
            </button>
          ))}
          <div className="my-2 h-px bg-white/15" />
          <button onClick={openDevice} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${real ? 'grad-bg' : 'hover:bg-white/10'}`}>
            <FolderOpen size={18} /> Open device folder
          </button>
          <input ref={fallback} type="file" hidden multiple webkitdirectory="" onChange={onFallback} />
        </div>

        <div className="scroll-thin flex-1 overflow-y-auto p-4">
          {real ? (
            <div className="space-y-1">
              {real.items.length === 0 && <p className="py-10 text-center text-sm text-white/60">Folder khali hai</p>}
              {real.items.map((it) => (
                <button key={it.name} onClick={() => openItem(it)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-white/10">
                  {it.kind === 'directory' ? <Folder size={20} stroke="url(#zgrad)" /> : <File size={20} />}
                  <span className="truncate">{it.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Folders</h3>
                <div className="flex items-center gap-3">
                  <div className="glass flex rounded-lg p-1"><List size={16} className="m-1" /><LayoutGrid size={16} className="m-1" /><Grid3x3 size={16} className="m-1 opacity-60" /></div>
                  <div className="glass rounded-lg px-3 py-1.5 text-xs">Sort by: Name ▾</div>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-x-2 gap-y-6">
                {FOLDERS.map(([n, I]) => (
                  <button key={n} onClick={() => setSel(n)} onDoubleClick={openDevice}
                    className={`flex flex-col items-center gap-3 rounded-xl px-1 py-3 text-sm ${sel === n ? 'bg-white/15' : 'hover:bg-white/10'}`}>
                    <FolderTile icon={I} />{n}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-5 py-2.5 text-xs text-white/80">
        <span className="flex items-center gap-2"><Folder size={16} /> {real ? `${real.items.length} items` : '12 items'}</span>
        <span>{real ? 'Device folder (read-only)' : 'Double-click folder: device folder kholo'}</span>
      </div>
    </div>
  );
}
