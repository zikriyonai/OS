'use client';
import { useEffect, useState } from 'react';

export function useDevice() {
  const [d, setD] = useState({ cores: '--', mem: '--', platform: 'Device', gpu: '--', storage: null, screen: '' });
  useEffect(() => {
    let gpu = 'Unknown GPU';
    try {
      const gl = document.createElement('canvas').getContext('webgl');
      const e = gl?.getExtension('WEBGL_debug_renderer_info');
      if (e) gpu = gl.getParameter(e.UNMASKED_RENDERER_WEBGL);
    } catch {}
    setD({
      cores: navigator.hardwareConcurrency || '--',
      mem: navigator.deviceMemory ? `${navigator.deviceMemory}+ GB` : 'Unknown',
      platform: navigator.userAgentData?.platform || navigator.platform || 'Device',
      gpu,
      storage: null,
      screen: `${screen.width}×${screen.height} @${window.devicePixelRatio}x`,
    });
    navigator.storage?.estimate?.().then((e) => setD((p) => ({ ...p, storage: e }))).catch(() => {});
  }, []);
  return d;
}
