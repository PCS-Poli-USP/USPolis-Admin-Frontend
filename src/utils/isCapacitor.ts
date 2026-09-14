import { Capacitor } from '@capacitor/core';

export function isCapacitor(): boolean {
  return Capacitor.isNativePlatform();
}