export default function Wallpaper({ blur = 0, dim = 0 }) {
  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: 'url(/wallpaper.png)',
        filter: blur ? `blur(${blur}px)` : undefined,
        transform: blur ? 'scale(1.1)' : undefined,
      }}
    >
      <div className="absolute inset-0" style={{ background: `rgba(5,3,15,${dim})` }} />
    </div>
  );
}
