import { create } from 'zustand';
import { useOS } from './useOS';
import { wmo } from '@/lib/weather';

let inited = false;
let wTimer = null;
let lowNotified = false;

async function loadWeather(lat, lon, set) {
  try {
    const [w, g] = await Promise.all([
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=2`
      ).then((r) => r.json()),
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      ).then((r) => r.json()).catch(() => null),
    ]);
    const c = w.current;
    const start = Math.max(0, w.hourly.time.findIndex((t) => t >= c.time.slice(0, 13)));
    const hourly = [0, 3, 6, 9, 12]
      .map((o, i) => {
        const idx = start + o;
        const t = w.hourly.time[idx];
        if (!t) return null;
        const h = +t.slice(11, 13);
        return {
          label: i === 0 ? 'Now' : `${h % 12 || 12} ${h < 12 ? 'AM' : 'PM'}`,
          temp: Math.round(w.hourly.temperature_2m[idx]),
          code: w.hourly.weather_code[idx],
          night: h < 6 || h >= 19,
        };
      })
      .filter(Boolean);
    set({
      weather: {
        temp: Math.round(c.temperature_2m),
        code: c.weather_code,
        isDay: !!c.is_day,
        label: wmo(c.weather_code),
        city: g?.city || g?.locality || g?.principalSubdivision || 'Your location',
        hi: Math.round(w.daily.temperature_2m_max[0]),
        lo: Math.round(w.daily.temperature_2m_min[0]),
        hourly,
      },
    });
  } catch {}
}

export const useSys = create((set, get) => ({
  battery: null,
  online: true,
  net: {},
  loc: null,
  locState: 'idle', // idle | asking | granted | denied | unsupported
  weather: null,
  notifPerm: 'default',
  btName: null,
  gallery: [],

  addPhoto: (src, name) => set((s) => ({ gallery: [{ id: Date.now() + Math.random(), src, name }, ...s.gallery] })),

  notify: (title, body, icon = 'sys') => {
    if (useOS.getState().toggles.focus) return;
    useOS.setState((s) => ({
      notifications: [{ id: Date.now() + Math.random(), icon, title, body, time: 'now' }, ...s.notifications],
    }));
    try {
      if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/logo.png' });
      }
    } catch {}
  },

  requestLocation: () => {
    if (!navigator.geolocation) return set({ locState: 'unsupported' });
    set({ locState: 'asking' });
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const loc = { lat: p.coords.latitude, lon: p.coords.longitude, acc: Math.round(p.coords.accuracy) };
        set({ loc, locState: 'granted' });
        loadWeather(loc.lat, loc.lon, set);
        clearInterval(wTimer);
        wTimer = setInterval(() => loadWeather(loc.lat, loc.lon, set), 15 * 60 * 1000);
      },
      () => set({ locState: 'denied' }),
      { timeout: 15000, maximumAge: 600000 }
    );
  },

  requestNotifications: async () => {
    if (!('Notification' in window)) return set({ notifPerm: 'unsupported' });
    const r = await Notification.requestPermission();
    set({ notifPerm: r });
  },

  pairBluetooth: async () => {
    if (!navigator.bluetooth) {
      get().notify('Bluetooth', 'Ye browser Web Bluetooth support nahi karta. Chrome ya Edge use karo.');
      return;
    }
    try {
      const d = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
      set({ btName: d.name || 'Unknown device' });
      get().notify('Bluetooth', `${d.name || 'Device'} select hua`);
    } catch {}
  },

  toggleFullscreen: () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  },

  init: () => {
    if (inited || typeof window === 'undefined') return;
    inited = true;

    // network
    set({ online: navigator.onLine });
    const readNet = () => {
      const c = navigator.connection;
      set({ net: c ? { type: c.effectiveType, downlink: c.downlink, rtt: c.rtt, saveData: c.saveData } : {} });
    };
    readNet();
    navigator.connection?.addEventListener?.('change', readNet);
    window.addEventListener('online', () => { set({ online: true }); get().notify('Network', 'Internet wapas connect ho gaya'); });
    window.addEventListener('offline', () => { set({ online: false }); get().notify('Network', 'Internet disconnect ho gaya'); });

    // battery
    navigator.getBattery?.().then((b) => {
      const up = () => {
        const level = Math.round(b.level * 100);
        set({ battery: { level, charging: b.charging } });
        if (level <= 20 && !b.charging && !lowNotified) {
          lowNotified = true;
          get().notify('Battery low', `Sirf ${level}% bacha hai. Charger lagao.`);
        }
        if (b.charging || level > 25) lowNotified = false;
      };
      up();
      b.addEventListener('levelchange', up);
      b.addEventListener('chargingchange', up);
    });

    // notifications permission
    set({ notifPerm: 'Notification' in window ? Notification.permission : 'unsupported' });

    // auto-load location if already allowed earlier
    navigator.permissions?.query({ name: 'geolocation' }).then((p) => {
      if (p.state === 'granted') get().requestLocation();
    }).catch(() => {});
  },
}));
