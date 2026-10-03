'use client';
import { useEffect } from 'react';
import { useNative } from '@/store/useNative';

export default function NativeBoot() {
  useEffect(() => { useNative.getState().init(); }, []);
  return null;
}
