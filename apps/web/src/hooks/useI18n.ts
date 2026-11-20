import {
  localeTag,
  translate,
  type Locale,
  type MessageKey,
} from '@atlas/shared';
import { useCallback } from 'react';
import { useAtlasStore } from '../stores/useAtlasStore';

export function useI18n() {
  const locale = useAtlasStore((state) => state.locale);
  const setLocale = useAtlasStore((state) => state.setLocale);

  // t 必须保持引用稳定：地图等组件的 effect 把 t 写进了依赖数组，
  // 每次渲染都换新函数会让图层被反复重建（表现为省界/标注闪一下或整层消失）。
  const t = useCallback(
    (key: MessageKey, params?: Record<string, string | number>) =>
      translate(locale, key, params),
    [locale],
  );

  return {
    locale,
    setLocale,
    t,
    dateLocale: localeTag(locale),
  };
}

export type { Locale };
