'use client';

export function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? 'grad-bg' : 'bg-white/15'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-[22px]' : 'left-0.5'}`}
      />
    </button>
  );
}

export function Slider({ value, onChange, className = '' }) {
  return (
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(+e.target.value)}
      className={`zslider ${className}`}
      style={{ '--v': `${value}%` }}
    />
  );
}
