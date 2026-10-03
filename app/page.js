'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useOS } from '@/store/useOS';
import Boot from '@/components/Boot';
import Lock from '@/components/Lock';
import Login from '@/components/Login';
import Desktop from '@/components/Desktop';
import NativeBoot from '@/components/NativeBoot';

export default function Page() {
  const stage = useOS((s) => s.stage);
  const setStage = useOS((s) => s.setStage);

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#05030f]">
      <NativeBoot />

      {/* gradient used by all icons */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="zgrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0" stopColor="#38bdf8" />
            <stop offset=".5" stopColor="#8b3dff" />
            <stop offset="1" stopColor="#e040c8" />
          </linearGradient>
        </defs>
      </svg>

      <AnimatePresence mode="wait">
        {stage === 'boot' && <Boot key="boot" />}
        {stage === 'lock' && <Lock key="lock" />}
        {stage === 'login' && <Login key="login" />}
        {stage === 'desktop' && <Desktop key="desktop" />}
        {stage === 'off' && (
          <motion.div
            key="off"
            className="absolute inset-0 flex cursor-pointer items-end justify-center bg-black pb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setStage('boot')}
          >
            <span className="text-xs tracking-[0.3em] text-white/20">CLICK ANYWHERE TO POWER ON</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
