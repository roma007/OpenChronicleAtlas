import {
  localeTag,
  translate,
  type Locale,
  type MessageKey,
} from '@atlas/shared';
import { useAtlasStore } from '../stores/useAtlasStore';

export function useI18n() {
  const locale = useAtlasStore((state) => state.locale);
  const setLocale = useAtlasStore((state) => state.setLocale);

  const t = (key: MessageKey, params?: Record<string, string | number>) =>
    translate(locale, key, params);

  return {
    locale,
    setLocale,
    t,
    dateLocale: localeTag(locale),
  };
}

export type { Locale };
