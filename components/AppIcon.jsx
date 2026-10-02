export default function AppIcon({ icon: Icon, size = 56 }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="glass flex shrink-0 items-center justify-center rounded-2xl"
    >
      <Icon size={size * 0.5} stroke="url(#zgrad)" strokeWidth={1.8} />
    </div>
  );
}
