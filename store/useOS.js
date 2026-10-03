import { create } from 'zustand';
import { Zikriyon } from '@/lib/native';

let zc = 10;

export const useOS = create((set, get) => ({
  stage: 'boot',
  setStage: (stage) =>
    set((s) => ({
      stage,
      overlay: null,
      context: null,
      windows: stage === 'boot' || stage === 'off' ? [] : s.windows,
    })),

  overlay: null,
  context: null,
  setOverlay: (overlay) => set({ overlay, context: null }),
  toggleOverlay: (o) => set((s) => ({ overlay: s.overlay === o ? null : o, context: null })),
  closeOverlay: () => set({ overlay: null, context: null }),
  setContext: (context) => set({ context, overlay: null }),

  windows: [],
  openApp: (app) => {
    const ex = get().windows.find((w) => w.app === app);
    if (ex) {
      set((s) => ({
        windows: s.windows.map((w) => (w.id === ex.id ? { ...w, minimized: false, z: ++zc } : w)),
        overlay: null,
        context: null,
      }));
      return;
    }
    const n = get().windows.length % 6;
    set((s) => ({
      windows: [
        ...s.windows,
        { id: `${app}-${Date.now()}`, app, z: ++zc, minimized: false, maximized: false, x: 90 + n * 32, y: 40 + n * 32 },
      ],
      overlay: null,
      context: null,
    }));
  },
  focusWin: (id) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, z: ++zc } : w)) })),
  closeWin: (id) => set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),
  minimizeWin: (id) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)) })),
  toggleMax: (id) =>
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized, z: ++zc } : w)) })),

  // hwBrightness true tab hota hai jab laptop screen ki asli brightness control ho sake
  hwBrightness: false,
  brightness: 78,
  volume: 78,
  setBrightness: (brightness) => {
    set({ brightness });
    if (get().hwBrightness) Zikriyon.setBrightness({ value: brightness }).catch(() => {});
  },
  setVolume: (volume) => {
    set({ volume });
    Zikriyon.setVolume({ value: volume }).catch(() => {});
  },
  toggles: { wifi: true, bluetooth: true, airplane: false, saver: false, night: false, focus: false },
  toggle: (k, v) => set((s) => ({ toggles: { ...s.toggles, [k]: v === undefined ? !s.toggles[k] : v } })),

  notifications: [
    { id: 1, icon: 'msg', title: 'Messages', body: 'You have 3 new messages', time: '2m ago' },
    { id: 2, icon: 'sys', title: 'System Update', body: 'ZikriyonOS 1.0.0 is ready to install', time: '12m ago' },
    { id: 3, icon: 'tip', title: 'Tips', body: 'Discover new features in ZikriyonOS', time: '30m ago' },
  ],
  clearNotifications: () => set({ notifications: [] }),
}));
