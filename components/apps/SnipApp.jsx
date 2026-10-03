'use client';
import { useState } from 'react';
import { Scissors } from 'lucide-react';
import { useSys } from '@/store/useSys';

export default function SnipApp() {
  const [shot, setShot] = useState(null);
  const [err, setErr] = useState('');
  const addPhoto = useSys((s) => s.addPhoto);

  const capture = async () => {
    setErr('');
    try {
      const s = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const v = document.createElement('video');
      v.srcObject = s; v.muted = true;
      await v.play();
      await new Promise((r) => setTimeout(r, 400));
      const c = document.createElement('canvas');
      c.width = v.videoWidth; c.height = v.videoHeight;
      c.getContext('2d').drawImage(v, 0, 0);
      s.getTracks().forEach((t) => t.stop());
      const src = c.toDataURL('image/png');
      setShot(src);
      addPhoto(src, `Screenshot ${new Date().toLocaleTimeString()}`);
    } catch {
      setErr('Screen capture cancel hua ya browser me supported nahi hai.');
    }
  };

  return (
    <div className="flex h-full flex-col items-center gap-4 p-5">
      <button onClick={capture} className="grad-bg flex items-center gap-2 rounded-full px-6 py-3 shadow-[0_0_20px_#8b3dff]">
        <Scissors size={18} /> New snip
      </button>
      {err && <p className="text-sm text-red-300">{err}</p>}
      {shot ? (
        <>
          <img src={shot} alt="" className="min-h-0 flex-1 rounded-xl border border-white/15 object-contain" />
          <a href={shot} download="screenshot.png" className="text-sm text-violet-300">Download</a>
        </>
      ) : <p className="mt-10 text-sm text-white/60">Screen, window ya tab chuno. Screenshot Photos me bhi save hoga.</p>}
    </div>
  );
}
