'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bell, Check } from 'lucide-react';
import { useSys } from '@/store/useSys';

export default function PermissionPrompt() {
  const [show, setShow] = useState(false);
  const locState = useSys((s) => s.locState);
  const notifPerm = useSys((s) => s.notifPerm);
  const requestLocation = useSys((s) => s.requestLocation);
  const requestNotifications = useSys((s) => s.requestNotifications);

  useEffect(() => {
    try { if (!localStorage.getItem('zk-perm-done')) setShow(true); } catch {}
  }, []);

  const done = () => {
    try { localStorage.setItem('zk-perm-done', '1'); } catch {}
    setShow(false);
  };
  if (!show) return null;

  const Row = ({ icon: I, title, desc, ok, onAllow }) => (
    <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-4">
      <I size={28} stroke="url(#zgrad)" />
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-white/60">{desc}</div>
      </div>
      {ok ? <Check size={22} className="text-emerald-400" /> : <button onClick={onAllow} className="grad-bg rounded-full px-4 py-1.5 text-sm">Allow</button>}
    </div>
  );

  return (
    <div
      className="absolute inset-0 z-[9500] flex items-center justify-center bg-black/55"
      onPointerDown={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.stopPropagation()}
    >
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong w-[480px] max-w-[92vw] rounded-3xl p-6">
        <img src="/logo.png" alt="" className="mx-auto w-20" />
        <h2 className="mt-2 text-center text-xl tracking-widest">Welcome to ZikriyonOS</h2>
        <p className="mt-1 text-center text-xs text-white/60">Real weather, maps aur alerts ke liye ye permissions chahiye. Camera aur mic tab puchhenge jab app khologe.</p>
        <div className="mt-5 space-y-3">
          <Row icon={MapPin} title="Location" desc="Live weather aur Maps" ok={locState === 'granted'} onAllow={requestLocation} />
          <Row icon={Bell} title="Notifications" desc="Battery low, network alerts" ok={notifPerm === 'granted'} onAllow={requestNotifications} />
        </div>
        <button onClick={done} className="mt-5 w-full rounded-full border border-white/20 py-2.5 text-sm hover:bg-white/10">Continue</button>
      </motion.div>
    </div>
  );
}
