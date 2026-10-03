import { Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';

export default function WeatherIcon({ code = 0, night = false, size = 24 }) {
  let I = Cloud;
  if (code === 0) I = night ? Moon : Sun;
  else if (code <= 2) I = night ? CloudMoon : CloudSun;
  else if (code === 45 || code === 48) I = CloudFog;
  else if (code >= 51 && code <= 57) I = CloudDrizzle;
  else if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) I = CloudRain;
  else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) I = CloudSnow;
  else if (code >= 95) I = CloudLightning;
  return <I size={size} stroke="url(#zgrad)" strokeWidth={1.8} />;
}
