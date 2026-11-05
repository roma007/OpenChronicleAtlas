import type {
  AtlasDataset,
  AtlasFilters,
  AtlasSummary,
  AtlasTime,
  Locale,
  SearchIndexFile,
  ShareView,
  Timeline,
} from '@atlas/shared';
import {
  EMPTY_FILTERS,
  clampToTimeline,
  createTimeline,
  normalizeLocale,
  ratioToTime,
  stepDays as addDays,
} from '@atlas/shared';
import { create } from 'zustand';
import { fetchAtlas, fetchAtlasIndex, fetchSearchIndex } from '../data/client';

export type PlaybackSpeed = 0.5 | 1 | 2 | 4;

function initialLocale(): Locale {
  if (typeof window === 'undefined') return 'zh';
  try {
    return normalizeLocale(window.localStorage.getItem('atlas-locale'));
  } catch {
    return 'zh';
  }
}

interface ViewRequest {
  view: ShareView;
  nonce: number;
}

interface AtlasState {
  index: AtlasSummary[] | null;
  dataset: AtlasDataset | null;
  loading: boolean;
  error: string | null;
  selectedEventId: string | null;
  activeEntityIds: Set<string>;
  filters: AtlasFilters;
  locale: Locale;

  timeline: Timeline | null;
  currentTime: AtlasTime;
  playing: boolean;
  speed: PlaybackSpeed;
  bubbleEventId: string | null;

  mapView: ShareView | null;
  viewRequest: ViewRequest | null;

  searchIndex: SearchIndexFile | null;
  searchLoading: boolean;
  searchError: string | null;

  loadIndex(): Promise<void>;
  loadAtlas(atlasId: string): Promise<void>;
  selectEvent(eventId: string | null): void;
  toggleEntity(entityId: string): void;
  setActiveEntities(ids: string[]): void;

  setLocale(locale: Locale): void;
  setFilters(filters: AtlasFilters): void;
  toggleCategory(category: string): void;
  resetFilters(): void;

  setCurrentTime(time: AtlasTime): void;
  seekRatio(ratio: number): void;
  stepDays(days: number): void;
  play(): void;
  pause(): void;
  togglePlay(): void;
  setSpeed(speed: PlaybackSpeed): void;
  resetPlayback(): void;
  setBubbleEvent(eventId: string | null): void;

  setMapView(view: ShareView): void;
  requestView(view: ShareView): void;

  loadSearchData(): Promise<void>;
}

export const useAtlasStore = create<AtlasState>((set, get) => ({
  index: null,
  dataset: null,
  loading: false,
  error: null,
  selectedEventId: null,
  activeEntityIds: new Set(),
  filters: EMPTY_FILTERS,
  locale: initialLocale(),

  timeline: null,
  currentTime: 0,
  playing: false,
  speed: 1,
  bubbleEventId: null,

  mapView: null,
  viewRequest: null,

  searchIndex: null,
  searchLoading: false,
  searchError: null,

  async loadIndex() {
    if (get().loading || get().index) return;
    set({ loading: true, error: null });
    try {
      const index = await fetchAtlasIndex();
      set({ index: index.atlases, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  async loadAtlas(atlasId) {
    set({
      loading: true,
      error: null,
      dataset: null,
      selectedEventId: null,
      playing: false,
      timeline: null,
      filters: EMPTY_FILTERS,
      bubbleEventId: null,
      mapView: null,
      viewRequest: null,
    });
    try {
      const dataset = await fetchAtlas(atlasId);
      const timeline = createTimeline(dataset.manifest.timeRange);
      set({
        dataset,
        loading: false,
        activeEntityIds: new Set(dataset.manifest.entities.map((entity) => entity.id)),
        timeline,
        currentTime: timeline.start,
        playing: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  selectEvent(eventId) {
    set({ selectedEventId: eventId });
  },

  setActiveEntities(ids) {
    const dataset = get().dataset;
    if (!dataset) return;
    const valid = new Set(dataset.manifest.entities.map((entity) => entity.id));
    const next = ids.filter((id) => valid.has(id));
    if (next.length === 0) return;
    set({ activeEntityIds: new Set(next) });
  },

  toggleEntity(entityId) {
    const next = new Set(get().activeEntityIds);
    if (next.has(entityId)) next.delete(entityId);
    else next.add(entityId);
    set({ activeEntityIds: next });
  },

  setLocale(locale) {
    set({ locale });
    try {
      window.localStorage.setItem('atlas-locale', locale);
    } catch {
      // 忽略隐私模式下的写入失败
    }
  },

  setFilters(filters) {
    set({ filters });
  },

  toggleCategory(category) {
    const current = get().filters;
    const categories = current.categories.includes(category)
      ? current.categories.filter((item) => item !== category)
      : [...current.categories, category];
    set({ filters: { ...current, categories } });
  },

  resetFilters() {
    set({ filters: EMPTY_FILTERS });
  },

  setCurrentTime(time) {
    const timeline = get().timeline;
    if (!timeline) return;
    set({ currentTime: clampToTimeline(time, timeline) });
  },

  seekRatio(ratio) {
    const timeline = get().timeline;
    if (!timeline) return;
    set({ currentTime: ratioToTime(ratio, timeline) });
  },

  stepDays(days) {
    const { timeline, currentTime } = get();
    if (!timeline) return;
    set({
      currentTime: clampToTimeline(addDays(currentTime, days), timeline),
      playing: false,
    });
  },

  play() {
    const { timeline, currentTime } = get();
    if (!timeline) return;
    set({
      playing: true,
      currentTime: currentTime >= timeline.end ? timeline.start : currentTime,
    });
  },

  pause() {
    set({ playing: false });
  },

  togglePlay() {
    if (get().playing) get().pause();
    else get().play();
  },

  setSpeed(speed) {
    set({ speed });
  },

  resetPlayback() {
    const timeline = get().timeline;
    set({ playing: false, currentTime: timeline?.start ?? 0, bubbleEventId: null });
  },

  setBubbleEvent(eventId) {
    set({ bubbleEventId: eventId });
  },

  setMapView(view) {
    set({ mapView: view });
  },

  requestView(view) {
    set({ viewRequest: { view, nonce: (get().viewRequest?.nonce ?? 0) + 1 }, mapView: view });
  },

  async loadSearchData() {
    if (get().searchLoading || get().searchIndex) return;
    set({ searchLoading: true, searchError: null });
    try {
      const searchIndex = await fetchSearchIndex();
      set({ searchIndex, searchLoading: false });
    } catch (error) {
      set({ searchError: (error as Error).message, searchLoading: false });
    }
  },
}));

