import { create } from 'zustand';
import { isNative, Zikriyon } from '@/lib/native';
import { useOS } from './useOS';

export const useNative = create((set, get) => ({
  apps: [],
  ready: false,

  load: async () => {
    try {
      const { apps } = await Zikriyon.getApps();
      apps.sort((a, b) => a.name.localeCompare(b.name));
      set({ apps });
    } catch {}
  },

  launch: (pkg) => Zikriyon.launchApp({ pkg }).catch(() => {}),

  init: async () => {
    if (!isNative() || get().ready) return;
    set({ ready: true });
    get().load();
    try {
      const v = await Zikriyon.getVolume();
      useOS.setState({ volume: v.value });
    } catch {}
    try {
      const b = await Zikriyon.getBrightness();
      useOS.setState({ brightness: b.value, hwBrightness: true });
    } catch {
      useOS.setState({ hwBrightness: false }); // desktop monitor: UI dimming overlay chalega
    }
  },
}));
