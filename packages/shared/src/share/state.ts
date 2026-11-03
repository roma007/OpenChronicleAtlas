import type { DateString } from '../types';
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
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ID_RE = /^[a-z0-9][a-z0-9-]*$/;

export function encodeShareState(state: ShareState): URLSearchParams {
  const params = new URLSearchParams();

  if (state.time) params.set('t', state.time);
  if (state.eventId) params.set('event', state.eventId);
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

  if (!time && !eventId && !view) return null;
  return { time, eventId, view };
}

export function buildShareUrl(baseUrl: string, atlasId: string, state: ShareState): string {
  const url = new URL(`/atlas/${encodeURIComponent(atlasId)}`, baseUrl);
  const params = encodeShareState(state);
  params.forEach((value, key) => url.searchParams.set(key, value));
  return url.toString();
}
