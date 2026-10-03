'use client';
import { Wifi, WifiOff } from 'lucide-react';
import { useSys } from '@/store/useSys';

export default function NetIcon({ size = 18 }) {
  const online = useSys((s) => s.online);
  return online ? <Wifi size={size} /> : <WifiOff size={size} className="text-red-400" />;
}
