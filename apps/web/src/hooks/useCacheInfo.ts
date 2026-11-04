import { useCallback, useEffect, useState } from 'react';

export interface CacheInfo {
  usage: number | null;
  quota: number | null;
  entries: number | null;
}

export async function clearAppCaches(): Promise<void> {
  if (typeof caches === 'undefined') return;
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));
}

export function useCacheInfo() {
  const [info, setInfo] = useState<CacheInfo>({
    usage: null,
    quota: null,
    entries: null,
  });

  const refresh = useCallback(async () => {
    let entries: number | null = null;
    try {
      if (typeof caches !== 'undefined') {
        entries = (await caches.keys()).length;
      }
    } catch {
      entries = null;
    }

    let usage: number | null = null;
    let quota: number | null = null;
    try {
      const estimate = await navigator.storage?.estimate?.();
      usage = estimate?.usage ?? null;
      quota = estimate?.quota ?? null;
    } catch {
      usage = null;
      quota = null;
    }

    setInfo({ usage, quota, entries });
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...info, refresh };
}
