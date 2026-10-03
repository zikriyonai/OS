'use client';
import { BatteryFull, BatteryMedium, BatteryLow, BatteryCharging } from 'lucide-react';
import { useSys } from '@/store/useSys';

export default function BatteryInfo({ size = 20, className = 'gap-1 text-xs' }) {
  const b = useSys((s) => s.battery);
  let I = BatteryFull;
  if (b) I = b.charging ? BatteryCharging : b.level > 60 ? BatteryFull : b.level > 25 ? BatteryMedium : BatteryLow;
  return (
    <span className={`flex items-center ${className}`}>
      <I size={size} /> {b ? `${b.level}%` : '--'}
    </span>
  );
}
