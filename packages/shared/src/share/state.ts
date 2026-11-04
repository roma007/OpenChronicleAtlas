import type { DateString } from '../types';
import type { Locale } from '../i18n/locale';
import { parseDateString } from '../time/date';

export interface ShareView {
  lng: number;
  lat: number;
  zoom: number;
}

export interface ShareState {
  atlasId?: string;
  time?: DateString;
  eventId?: string;
  view?: ShareView;
  locale?: Locale;
  entities?: string[];
  categories?: string[];
  from?: DateString;
  to?: DateString;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ID_RE = /^[a-z0-9][a-z0-9-]*$/;

export function encodeShareState(state: ShareState): URLSearchParams {
  const params = new URLSearchParams();

  if (state.time) params.set('t', state.time);
  if (state.eventId) params.set('event', state.eventId);
  if (state.locale) params.set('lang', state.locale);
  if (state.entities?.length) params.set('entities', state.entities.join(','));
  if (state.categories?.length) params.set('categories', state.categories.join(','));
  if (state.from) params.set('from', state.from);
  if (state.to) params.set('to', state.to);
  if (state.view) {
    const { lng, lat, zoom } = state.view;
    params.set('view', `${lng.toFixed(6)},${lat.toFixed(6)},${zoom.toFixed(2)}`);
  }

  return params;
}

export function decodeShareState(params: URLSearchParams): ShareState | null {
  const timeRaw = params.get('t');
  const eventRaw = params.get('event');
  const viewRaw = params.get('view');
  const langRaw = params.get('lang');
  const entitiesRaw = params.get('entities');
  const categoriesRaw = params.get('categories');
  const fromRaw = params.get('from');
  const toRaw = params.get('to');

  let time: DateString | undefined;
  if (timeRaw && DATE_RE.test(timeRaw)) {
    try {
      parseDateString(timeRaw);
      time = timeRaw;
    } catch {
      time = undefined;
    }
  }

  const eventId = eventRaw && ID_RE.test(eventRaw) ? eventRaw : undefined;
  const locale: Locale | undefined =
    langRaw === 'zh' || langRaw === 'en' ? langRaw : undefined;

  const entities = entitiesRaw
    ? Array.from(
        new Set(
          entitiesRaw
            .split(',')
            .map((id) => id.trim())
            .filter((id) => ID_RE.test(id)),
        ),
      ).slice(0, 50)
    : [];
  const categories = categoriesRaw
    ? Array.from(
        new Set(
          categoriesRaw
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0 && item.length <= 40),
        ),
      ).slice(0, 50)
    : [];

  let from: DateString | undefined;
  if (fromRaw && DATE_RE.test(fromRaw)) {
    try {
      parseDateString(fromRaw);
      from = fromRaw;
    } catch {
      from = undefined;
    }
  }

  let to: DateString | undefined;
  if (toRaw && DATE_RE.test(toRaw)) {
    try {
      parseDateString(toRaw);
      to = toRaw;
    } catch {
      to = undefined;
    }
  }
  if (from && to && to < from) to = undefined;

  let view: ShareView | undefined;
  if (viewRaw) {
    const parts = viewRaw.split(',').map(Number);
    if (parts.length === 3) {
      const [lng, lat, zoom] = parts;
      if (
        Number.isFinite(lng) &&
        Math.abs(lng!) <= 180 &&
        Number.isFinite(lat) &&
        Math.abs(lat!) <= 85 &&
        Number.isFinite(zoom) &&
        zoom! >= 0 &&
        zoom! <= 22
      ) {
        view = { lng: lng!, lat: lat!, zoom: zoom! };
      }
    }
  }

  if (
    !time &&
    !eventId &&
    !view &&
    !locale &&
    entities.length === 0 &&
    categories.length === 0 &&
    !from &&
    !to
  ) {
    return null;
  }

  return {
    time,
    eventId,
    view,
    locale,
    entities: entities.length > 0 ? entities : undefined,
    categories: categories.length > 0 ? categories : undefined,
    from,
    to,
  };
}

export function buildShareUrl(baseUrl: string, atlasId: string, state: ShareState): string {
  const url = new URL(`/atlas/${encodeURIComponent(atlasId)}`, baseUrl);
  const params = encodeShareState(state);
  params.forEach((value, key) => url.searchParams.set(key, value));
  return url.toString();
}
