'use client';
import { MapPin } from 'lucide-react';
import { useSys } from '@/store/useSys';

export default function MapsApp() {
  const { loc, locState, requestLocation } = useSys();
  if (!loc)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <MapPin size={70} stroke="url(#zgrad)" strokeWidth={1.2} />
        <p className="text-sm text-white/70">{locState === 'denied' ? 'Location blocked hai. Browser settings se allow karo.' : 'Apni location dekhne ke liye allow karo'}</p>
        <button onClick={requestLocation} className="grad-bg rounded-full px-6 py-2.5">{locState === 'asking' ? 'Locating...' : 'Allow location'}</button>
      </div>
    );
  const d = 0.008;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${loc.lon - d},${loc.lat - d},${loc.lon + d},${loc.lat + d}&layer=mapnik&marker=${loc.lat},${loc.lon}`;
  return (
    <div className="flex h-full flex-col">
      <iframe title="map" src={src} className="min-h-0 flex-1 border-0" />
      <div className="border-t border-white/10 px-4 py-2 text-xs text-white/70">
        {loc.lat.toFixed(5)}, {loc.lon.toFixed(5)} · accuracy ±{loc.acc} m
      </div>
    </div>
  );
}
