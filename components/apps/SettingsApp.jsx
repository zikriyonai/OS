'use client';
import { useState } from 'react';
import {
  Settings, Sun, Wifi, Brush, LayoutGrid, User, Clock, Shield, RefreshCw, Monitor, Cpu,
  MemoryStick, HardDrive, Volume2, Bell, Moon, ChevronRight, Headphones, Mic,
} from 'lucide-react';
import { Slider, Toggle } from '../ui';
import { useOS } from '@/store/useOS';

const NAV = [
  ['System', Settings], ['Display', Sun], ['Network', Wifi], ['Personalization', Brush], ['Apps', LayoutGrid],
  ['Accounts', User], ['Time', Clock], ['Privacy', Shield], ['Update', RefreshCw],
];

const Card = ({ children }) => <div className="rounded-2xl border border-white/15 bg-white/5 p-4">{children}</div>;

function Spec({ icon: I, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5"><I size={20} stroke="url(#zgrad)" /></span>
      <div><div className="text-xs text-white/60">{label}</div><div className="text-sm">{value}</div></div>
    </div>
  );
}

export default function SettingsApp() {
  const { brightness, setBrightness, volume, setVolume, toggles, toggle } = useOS();
  const [page, setPage] = useState('System');
  const [hdr, setHdr] = useState(false);
  const [showN, setShowN] = useState(true);

  return (
    <div className="flex h-full">
      <div className="w-60 shrink-0 border-r border-white/10 p-3">
        {NAV.map(([n, I]) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm ${page === n ? 'grad-bg' : 'hover:bg-white/10'}`}
          >
            <I size={20} /> {n}
          </button>
        ))}
      </div>

      <div className="scroll-thin flex-1 space-y-3 overflow-y-auto p-4">
        {page !== 'System' ? (
          <Card>
            <h2 className="text-xl">{page}</h2>
            <p className="mt-2 text-sm text-white/70">Ye section jald aa raha hai. Abhi System page poora kaam karta hai.</p>
          </Card>
        ) : (
          <>
            <Card>
              <div className="flex items-center gap-6">
                <img src="/logo.png" alt="" className="w-40" />
                <div className="flex-1">
                  <h2 className="text-2xl">Zikriyon-PC</h2>
                  <p className="grad-text text-sm">Powering Your Digital Life</p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <Spec icon={Monitor} label="Device Name" value="Zikriyon-PC" />
                    <Spec icon={MemoryStick} label="Installed RAM" value="16.0 GB" />
                    <Spec icon={Cpu} label="Processor" value="Intel(R) Core(TM) i7-6700HQ 2.60 GHz" />
                    <Spec icon={HardDrive} label="Storage" value="512 GB SSD" />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3"><Sun size={22} stroke="url(#zgrad)" /><div><div className="font-medium">Display</div><div className="text-xs text-white/60">Brightness, night light and more</div></div></div>
                <ChevronRight size={18} />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">Brightness</span>
                <Slider value={brightness} onChange={setBrightness} className="flex-1" />
                <span className="w-10 text-sm">{brightness}%</span>
              </div>
              <div className="mt-3 flex gap-6">
                <label className="flex flex-1 items-center justify-between text-sm"><span className="flex items-center gap-2"><Moon size={16} /> Night Light</span><Toggle on={toggles.night} onChange={(v) => toggle('night', v)} /></label>
                <label className="flex flex-1 items-center justify-between text-sm"><span>HDR</span><Toggle on={hdr} onChange={setHdr} /></label>
              </div>
            </Card>

            <Card>
              <div className="mb-3 flex items-center gap-3"><Volume2 size={22} stroke="url(#zgrad)" /><div><div className="font-medium">Sound</div><div className="text-xs text-white/60">Volume, device output, input and more</div></div></div>
              <div className="flex items-center gap-4">
                <span className="text-sm">Master Volume</span>
                <Slider value={volume} onChange={setVolume} className="flex-1" />
                <span className="w-10 text-sm">{volume}%</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"><Headphones size={16} /> Speakers (Realtek Audio)</div>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"><Mic size={16} /> Microphone (Realtek Audio)</div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Bell size={22} stroke="url(#zgrad)" /><div><div className="font-medium">Notifications</div><div className="text-xs text-white/60">Manage alerts and system notifications</div></div></div>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-4">Show notifications <Toggle on={showN} onChange={setShowN} /></label>
                  <label className="flex items-center gap-4">Do Not Disturb <Toggle on={toggles.focus} onChange={(v) => toggle('focus', v)} /></label>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
