'use client';
import { useCallback, useEffect, useState } from 'react';
import { MapPin, Bell, Camera, Mic, Bluetooth } from 'lucide-react';
import { useSys } from '@/store/useSys';

const Card = ({ children }) => <div className="rounded-2xl border border-white/15 bg-white/5 p-4">{children}</div>;

function usePerm(name) {
  const [st, setSt] = useState('unknown');
  const refresh = useCallback(async () => {
    try {
      const p = await navigator.permissions.query({ name });
      setSt(p.state);
      p.onchange = () => setSt(p.state);
    } catch { setSt('unknown'); }
  }, [name]);
  useEffect(() => { refresh(); }, [refresh]);
  return [st, refresh];
}

function PermRow({ icon: I, label, desc, name, ask }) {
  const [st, refresh] = usePerm(name);
  const color = st === 'granted' ? 'text-emerald-400' : st === 'denied' ? 'text-red-400' : 'text-white/60';
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3">
      <I size={24} stroke="url(#zgrad)" />
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-white/60">{desc}</div>
        {st === 'denied' && <div className="mt-1 text-[11px] text-red-300">Blocked. Address bar ke lock icon se allow karo.</div>}
      </div>
      <span className={`text-xs capitalize ${color}`}>{st}</span>
      {st !== 'granted' && st !== 'denied' && (
        <button onClick={async () => { try { await ask(); } catch {} refresh(); }} className="grad-bg rounded-full px-3 py-1 text-xs">Allow</button>
      )}
    </div>
  );
}

export function PrivacyPage() {
  const requestLocation = useSys((s) => s.requestLocation);
  const requestNotifications = useSys((s) => s.requestNotifications);
  const mediaAsk = (c) => async () => { const s = await navigator.mediaDevices.getUserMedia(c); s.getTracks().forEach((t) => t.stop()); };
  return (
    <Card>
      <h2 className="mb-3 text-xl">Privacy & permissions</h2>
      <div className="space-y-2">
        <PermRow icon={MapPin} label="Location" desc="Weather aur Maps" name="geolocation" ask={async () => requestLocation()} />
        <PermRow icon={Bell} label="Notifications" desc="System alerts" name="notifications" ask={requestNotifications} />
        <PermRow icon={Camera} label="Camera" desc="Camera app" name="camera" ask={mediaAsk({ video: true })} />
        <PermRow icon={Mic} label="Microphone" desc="Recorder app" name="microphone" ask={mediaAsk({ audio: true })} />
      </div>
      <button
        onClick={() => { try { new Notification('ZikriyonOS', { body: 'Test notification kaam kar raha hai', icon: '/logo.png' }); } catch {} }}
        className="mt-4 rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10">
        Send test notification
      </button>
    </Card>
  );
}

export function NetworkPage() {
  const online = useSys((s) => s.online);
  const net = useSys((s) => s.net);
  const btName = useSys((s) => s.btName);
  const pairBluetooth = useSys((s) => s.pairBluetooth);
  const row = (k, v) => <div className="flex justify-between border-b border-white/10 py-2 text-sm"><span className="text-white/60">{k}</span><span>{v}</span></div>;
  return (
    <>
      <Card>
        <h2 className="mb-2 text-xl">Network</h2>
        {row('Status', online ? 'Connected' : 'Offline')}
        {row('Connection', net.type ? net.type.toUpperCase() : 'Unknown')}
        {row('Downlink', net.downlink != null ? `${net.downlink} Mbps` : 'Unknown')}
        {row('Latency (RTT)', net.rtt != null ? `${net.rtt} ms` : 'Unknown')}
        {row('Data saver', net.saveData ? 'On' : 'Off')}
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><Bluetooth size={22} stroke="url(#zgrad)" /><div><div className="font-medium">Bluetooth</div><div className="text-xs text-white/60">{btName ? `Selected: ${btName}` : 'Nearby device chuno'}</div></div></div>
          <button onClick={pairBluetooth} className="grad-bg rounded-full px-4 py-1.5 text-sm">Scan</button>
        </div>
      </Card>
    </>
  );
}
