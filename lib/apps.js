import {
  Folder, Globe, Settings, Music, Image as ImageIcon, Play, Mail, CalendarDays, ShoppingBag,
  Calculator, Clock, FileText, Palette, Cloud, MapPin, Mic, Scissors, Terminal, Lightbulb,
  Trash2, MessageCircle,
} from 'lucide-react';
import Explorer from '@/components/apps/Explorer';
import Browser from '@/components/apps/Browser';
import SettingsApp from '@/components/apps/SettingsApp';
import MusicApp from '@/components/apps/MusicApp';
import { Placeholder, Photos, CalendarApp, CalcApp, ClockApp, Notepad } from '@/components/apps/Misc';

const A = (label, icon, C, w = 760, h = 480, title = label) => ({ label, icon, C, w, h, title });

export const APPS = {
  explorer: A('Files', Folder, Explorer, 940, 560, 'ZikriyonOS Explorer'),
  browser: A('Browser', Globe, Browser, 1040, 620, 'Zikri Browser'),
  settings: A('Settings', Settings, SettingsApp, 1000, 620, 'ZikriyonOS Settings'),
  music: A('Music', Music, MusicApp, 900, 540),
  photos: A('Photos', ImageIcon, Photos, 900, 560),
  videos: A('Videos', Play, Placeholder, 720, 440),
  mail: A('Mail', Mail, Placeholder, 720, 440),
  calendar: A('Calendar', CalendarDays, CalendarApp, 440, 500),
  store: A('Store', ShoppingBag, Placeholder, 720, 440),
  calculator: A('Calculator', Calculator, CalcApp, 340, 500),
  clock: A('Clock', Clock, ClockApp, 420, 300),
  notepad: A('Notepad', FileText, Notepad, 640, 420),
  paint: A('Paint', Palette, Placeholder, 720, 440),
  weather: A('Weather', Cloud, Placeholder, 720, 440),
  maps: A('Maps', MapPin, Placeholder, 720, 440),
  recorder: A('Recorder', Mic, Placeholder, 640, 400),
  snip: A('Snipping Tool', Scissors, Placeholder, 640, 400),
  terminal: A('Terminal', Terminal, Placeholder, 720, 440),
  tips: A('Tips', Lightbulb, Placeholder, 640, 400),
  trash: A('Recycle Bin', Trash2, Placeholder, 640, 400),
};

export const START_APPS = [
  'browser', 'mail', 'calendar', 'photos', 'settings', 'store',
  'music', 'videos', 'calculator', 'clock', 'notepad', 'paint',
  'weather', 'maps', 'recorder', 'snip', 'terminal', 'tips',
];

export const PINNED = ['explorer', 'music', 'photos', 'settings', 'videos'];

export const NOTIF_ICON = { msg: MessageCircle, sys: Settings, tip: Lightbulb };
