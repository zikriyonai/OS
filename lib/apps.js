import {
  Folder, Globe, Settings, Music, Image as ImageIcon, Play, Mail, CalendarDays, ShoppingBag,
  Calculator, Clock, FileText, Palette, Cloud, MapPin, Mic, Scissors, Terminal, Lightbulb,
  Trash2, MessageCircle, Camera as CameraIcon,
} from 'lucide-react';
import Explorer from '@/components/apps/Explorer';
import Browser from '@/components/apps/Browser';
import SettingsApp from '@/components/apps/SettingsApp';
import MusicApp from '@/components/apps/MusicApp';
import Photos from '@/components/apps/Photos';
import CameraApp from '@/components/apps/CameraApp';
import RecorderApp from '@/components/apps/RecorderApp';
import SnipApp from '@/components/apps/SnipApp';
import MapsApp from '@/components/apps/MapsApp';
import WeatherApp from '@/components/apps/WeatherApp';
import { Placeholder, CalendarApp, CalcApp, ClockApp, Notepad } from '@/components/apps/Misc';

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
  weather: A('Weather', Cloud, WeatherApp, 640, 460),
  maps: A('Maps', MapPin, MapsApp, 860, 540),
  recorder: A('Recorder', Mic, RecorderApp, 560, 480),
  snip: A('Snipping Tool', Scissors, SnipApp, 760, 520),
  camera: A('Camera', CameraIcon, CameraApp, 760, 540),
  terminal: A('Terminal', Terminal, Placeholder, 720, 440),
  tips: A('Tips', Lightbulb, Placeholder, 640, 400),
  trash: A('Recycle Bin', Trash2, Placeholder, 640, 400),
};

export const START_APPS = [
  'browser', 'mail', 'calendar', 'photos', 'settings', 'store',
  'music', 'videos', 'calculator', 'clock', 'notepad', 'paint',
  'weather', 'maps', 'recorder', 'snip', 'terminal', 'tips',
  'camera',
];

export const PINNED = ['explorer', 'music', 'photos', 'settings', 'videos'];

export const NOTIF_ICON = { msg: MessageCircle, sys: Settings, tip: Lightbulb };
