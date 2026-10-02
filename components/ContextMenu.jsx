'use client';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, ArrowDownUp, RefreshCw, Monitor, Brush, ChevronRight } from 'lucide-react';
import { useOS } from '@/store/useOS';

export default function ContextMenu() {
  const ctx = useOS((s) => s.context);
  const closeOverlay = useOS((s) => s.closeOverlay);
  const openApp = useOS((s) => s.openApp);

  const left = Math.min(ctx.x, window.innerWidth - 260);
  const top = Math.min(ctx.y, window.innerHeight - 330);

  const items = [
    { label: 'New', icon: Plus, arrow: true },
    { label: 'View', icon: LayoutGrid, arrow: true },
    { label: 'Sort by', icon: ArrowDownUp, arrow: true },
    { label: 'Refresh', icon: RefreshCw, go: closeOverlay },
    'sep',
    { label: 'Display settings', icon: Monitor, go: () => openApp('settings') },
    { label: 'Personalize', icon: Brush, go: () => openApp('settings') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      onPointerDown={(e) => e.stopPropagation()}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
      style={{ left, top }}
      className="glass-strong absolute z-[8000] w-60 rounded-2xl p-1.5"
    >
      {items.map((it, i) =>
        it === 'sep' ? (
          <div key={i} className="my-1 h-px bg-white/15" />
        ) : (
          <button
            key={it.label}
            onClick={() => (it.go ? it.go() : null)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-white/10"
          >
            <it.icon size={18} />
            <span className="flex-1">{it.label}</span>
            {it.arrow && <ChevronRight size={16} className="text-white/60" />}
          </button>
        )
      )}
    </motion.div>
  );
}
