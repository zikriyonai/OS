'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useOS } from '@/store/useOS';

export default function Boot() {
  const setStage = useOS((s) => s.setStage);
  const [p, setP] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setP((v) => Math.min(100, v + 2)), 70);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (p >= 100) {
      const t = setTimeout(() => setStage('lock'), 500);
      return () => clearTimeout(t);
    }
  }, [p, setStage]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#05030f]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 0% 60%, rgba(47,107,255,.35), transparent 40%), radial-gradient(ellipse at 100% 60%, rgba(139,61,255,.35), transparent 40%)',
        }}
      />
      <motion.img
        src="/logo.png"
        alt="logo"
        className="relative w-[300px]"
        animate={{ scale: [1, 1.04, 1], filter: ['drop-shadow(0 0 20px #2f6bff)', 'drop-shadow(0 0 45px #e040c8)', 'drop-shadow(0 0 20px #2f6bff)'] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      <h1 className="relative mt-4 text-4xl font-extralight tracking-[0.5em] text-white">ZikriyonOS</h1>
      <div className="relative mt-10 h-3 w-[460px] max-w-[80vw] overflow-hidden rounded-full border border-white/10 bg-white/5">
        <div className="grad-bg h-full rounded-full shadow-[0_0_14px_#8b3dff]" style={{ width: `${p}%` }} />
      </div>
      <p className="absolute bottom-12 text-[11px] tracking-[0.35em] text-violet-300/70">Loading your world</p>
    </motion.div>
  );
}
