'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock as LockIcon, Eye, EyeOff, Power, Wifi } from 'lucide-react';
import Wallpaper from './Wallpaper';
import { useOS } from '@/store/useOS';

export default function Login() {
  const setStage = useOS((s) => s.setStage);
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
    >
      <Wallpaper blur={18} dim={0.35} />
      <div className="absolute left-1/2 top-1/2 w-[540px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass flex flex-col items-center rounded-[28px] px-10 py-8 shadow-[0_0_50px_rgba(139,61,255,.45)]"
        >
          <img src="/logo.png" alt="" className="w-24" />
          <div className="mt-2 rounded-full p-[3px] grad-bg">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#0b0630]">
              <User size={56} stroke="url(#zgrad)" />
            </div>
          </div>
          <div className="mt-4 text-2xl tracking-[0.3em]">Zikriyon</div>

          <div className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-4 py-3.5">
            <LockIcon size={20} />
            <input
              autoFocus
              type={show ? 'text' : 'password'}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setStage('desktop')}
              placeholder="Password (kuch bhi daalo)"
              className="flex-1 bg-transparent text-sm tracking-widest outline-none placeholder:tracking-normal placeholder:text-white/40"
            />
            <button onClick={() => setShow(!show)}>{show ? <EyeOff size={20} /> : <Eye size={20} />}</button>
          </div>

          <button
            onClick={() => setStage('desktop')}
            className="grad-bg mt-4 w-full rounded-full py-3.5 text-lg tracking-widest shadow-[0_0_25px_rgba(139,61,255,.6)] transition hover:brightness-110"
          >
            Sign in
          </button>
          <button className="mt-4 text-sm text-violet-300">Forgot password?</button>
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-8 flex gap-3">
        <button onClick={() => useOS.getState().setStage('lock')} className="glass flex h-12 w-12 items-center justify-center rounded-full"><Power size={20} /></button>
        <div className="glass flex h-12 w-12 items-center justify-center rounded-full"><Wifi size={20} /></div>
      </div>
    </motion.div>
  );
}
