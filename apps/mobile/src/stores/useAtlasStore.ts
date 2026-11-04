import type {
  AtlasDataset,
  AtlasFilters,
  AtlasSummary,
  AtlasTime,
  Locale,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { fetchAtlas, fetchAtlasIndex } from '../data/client';
import {
  clearAtlasCache,
  consumeCacheHit,
  resetCacheHit,
} from '../data/cache';

export type PlaybackSpeed = 0.5 | 1 | 2 | 4;

interface MobileAtlasState {
  index: AtlasSummary[] | null;
  dataset: AtlasDataset | null;
  loading: boolean;
  error: string | null;

  timeline: Timeline | null;
  currentTime: AtlasTime;
  playing: boolean;
  speed: PlaybackSpeed;
  selectedEventId: string | null;
  bubbleEventId: string | null;

  activeEntityIds: Set<string>;
  filters: AtlasFilters;
  locale: Locale;
  fromCache: boolean;
  mapView: ShareView | null;

  searchDatasets: AtlasDataset[] | null;
  searchLoading: boolean;
  searchError: string | null;

  loadIndex(): Promise<void>;
  loadAtlas(atlasId: string): Promise<void>;
  selectEvent(eventId: string | null): void;
  setBubbleEvent(eventId: string | null): void;
  toggleEntity(entityId: string): void;
  setLocale(locale: Locale): void;
  hydrateLocale(): Promise<void>;
  clearCache(): Promise<void>;
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
  setMapView(view: ShareView): void;
  loadSearchData(): Promise<void>;
}

export const useAtlasStore = create<MobileAtlasState>((set, get) => ({
  index: null,
  dataset: null,
  loading: false,
  error: null,

  timeline: null,
  currentTime: 0,
  playing: false,
  speed: 1,
  selectedEventId: null,
  bubbleEventId: null,

  activeEntityIds: new Set(),
  filters: EMPTY_FILTERS,
  locale: 'zh',
  fromCache: false,
  mapView: null,

  searchDatasets: null,
  searchLoading: false,
  searchError: null,

  async loadIndex() {
    if (get().loading || get().index) return;
    set({ loading: true, error: null });
    resetCacheHit();
    try {
      const index = await fetchAtlasIndex();
      set({ index: index.atlases, loading: false, fromCache: consumeCacheHit() });
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
      bubbleEventId: null,
      playing: false,
      timeline: null,
      filters: EMPTY_FILTERS,
      mapView: null,
      fromCache: false,
    });
    resetCacheHit();
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
        fromCache: consumeCacheHit(),
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  selectEvent(eventId) {
    set({ selectedEventId: eventId });
  },

  setBubbleEvent(eventId) {
    set({ bubbleEventId: eventId });
  },

  toggleEntity(entityId) {
    const next = new Set(get().activeEntityIds);
    if (next.has(entityId)) next.delete(entityId);
    else next.add(entityId);
    set({ activeEntityIds: next });
  },

  setLocale(locale) {
    set({ locale });
    void AsyncStorage.setItem('atlas-locale', locale).catch(() => {});
  },

  async hydrateLocale() {
    try {
      const stored = await AsyncStorage.getItem('atlas-locale');
      if (stored) set({ locale: normalizeLocale(stored) });
    } catch {
      // 读取失败时保持默认中文
    }
  },

  async clearCache() {
    await clearAtlasCache();
    set({ fromCache: false });
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

  setMapView(view) {
    set({ mapView: view });
  },

  async loadSearchData() {
    if (get().searchLoading || get().searchDatasets) return;
    set({ searchLoading: true, searchError: null });
    resetCacheHit();
    try {
      const index = await fetchAtlasIndex();
      const datasets = await Promise.all(index.atlases.map((atlas) => fetchAtlas(atlas.id)));
      set({
        searchDatasets: datasets,
        searchLoading: false,
        fromCache: consumeCacheHit(),
      });
    } catch (error) {
      set({ searchError: (error as Error).message, searchLoading: false });
    }
  },
}));
