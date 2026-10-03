'use client';
import { useSys } from '@/store/useSys';
import WeatherIcon from '@/components/WeatherIcon';

export default function WeatherApp() {
  const { weather, locState, requestLocation } = useSys();
  if (!weather)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-sm text-white/70">{locState === 'denied' ? 'Location blocked hai. Browser settings se allow karo.' : 'Live weather ke liye location allow karo'}</p>
        <button onClick={requestLocation} className="grad-bg rounded-full px-6 py-2.5">{locState === 'asking' ? 'Locating...' : 'Allow location'}</button>
      </div>
    );
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-6">
      <div className="flex items-center gap-6">
        <WeatherIcon code={weather.code} night={!weather.isDay} size={96} />
        <div>
          <div className="text-xl">{weather.city}</div>
          <div className="text-6xl font-light">{weather.temp}°C</div>
          <div className="text-sm text-white/70">{weather.label} · H {weather.hi}° L {weather.lo}°</div>
        </div>
      </div>
      <div className="grid w-full max-w-md grid-cols-5 gap-2 text-center text-sm">
        {weather.hourly.map((h) => (
          <div key={h.label} className="rounded-xl border border-white/10 bg-white/5 py-3">
            <div className="text-xs text-white/60">{h.label}</div>
            <div className="my-2 flex justify-center"><WeatherIcon code={h.code} night={h.night} size={22} /></div>
            {h.temp}°
          </div>
        ))}
      </div>
    </div>
  );
}
