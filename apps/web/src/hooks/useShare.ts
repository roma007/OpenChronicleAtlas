import { buildShareUrl, translate, type ShareState } from '@atlas/shared';
import { useAtlasStore } from '../stores/useAtlasStore';
import { useState } from 'react';

export type ShareResult = 'shared' | 'copied' | 'failed';

function copyWithTextarea(text: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }

  document.body.removeChild(textarea);
  return ok;
}

function shareWithTimeout(
  data: ShareData,
  timeoutMs = 1500,
): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve(ok);
    };
    const timer = window.setTimeout(() => finish(false), timeoutMs);

    try {
      const result = navigator.share(data);
      if (result && typeof result.then === 'function') {
        result.then(() => finish(true)).catch(() => finish(false));
      } else {
        finish(true);
      }
    } catch {
      finish(false);
    }
  });
}

/** Web Share API 优先，不支持或超时则复制链接。 */
export function useShare() {
  const [lastResult, setLastResult] = useState<ShareResult | null>(null);
  const locale = useAtlasStore((state) => state.locale);

  const share = async (atlasId: string, state: Omit<ShareState, 'atlasId'>) => {
    const url = buildShareUrl(window.location.origin, atlasId, { ...state, atlasId });

    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (typeof nav.share === 'function') {
      const shared = await shareWithTimeout({ title: translate(locale, 'app.title'), url });
      if (shared) {
        setLastResult('shared');
        return 'shared' as const;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setLastResult('copied');
      return 'copied' as const;
    } catch {
      if (copyWithTextarea(url)) {
        setLastResult('copied');
        return 'copied' as const;
      }
      setLastResult('failed');
      return 'failed' as const;
    }
  };

  return { share, lastResult };
}
