'use client';
import { useEffect, useRef, useState } from 'react';
import { Camera, SwitchCamera } from 'lucide-react';
import { useSys } from '@/store/useSys';

export default function CameraApp() {
  const vid = useRef(null);
  const stream = useRef(null);
  const [err, setErr] = useState('');
  const [facing, setFacing] = useState('user');
  const [flash, setFlash] = useState(false);
  const addPhoto = useSys((s) => s.addPhoto);

  useEffect(() => {
    let dead = false;
    setErr('');
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false });
        if (dead) return s.getTracks().forEach((t) => t.stop());
        stream.current = s;
        if (vid.current) vid.current.srcObject = s;
      } catch (e) {
        setErr(e.name === 'NotAllowedError' ? 'Camera permission denied. Address bar ke lock icon se allow karo.' : 'Camera nahi mila.');
      }
    })();
    return () => { dead = true; stream.current?.getTracks().forEach((t) => t.stop()); };
  }, [facing]);

  const snap = () => {
    const v = vid.current;
    if (!v?.videoWidth) return;
    const c = document.createElement('canvas');
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    addPhoto(c.toDataURL('image/jpeg', 0.92), `Photo ${new Date().toLocaleTimeString()}`);
    setFlash(true); setTimeout(() => setFlash(false), 150);
  };

  return (
    <div className="relative flex h-full flex-col items-center justify-center bg-black/30">
      {err ? <p className="px-8 text-center text-sm text-white/70">{err}</p> : (
        <video ref={vid} autoPlay playsInline muted className="h-full w-full object-contain" style={{ transform: facing === 'user' ? 'scaleX(-1)' : undefined }} />
      )}
      {flash && <div className="absolute inset-0 bg-white/80" />}
      <div className="absolute bottom-4 flex items-center gap-6">
        <button onClick={snap} className="grad-bg flex h-16 w-16 items-center justify-center rounded-full shadow-[0_0_25px_#8b3dff]"><Camera size={28} /></button>
        <button onClick={() => setFacing(facing === 'user' ? 'environment' : 'user')} className="glass flex h-12 w-12 items-center justify-center rounded-full"><SwitchCamera size={20} /></button>
      </div>
    </div>
  );
}
