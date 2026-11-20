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
  datasetDateRange,
  createTimeline,
  isDataVersionNewer,
  isRegionDescendant,
  normalizeLocale,
  normalizeRegionSelection,
  ratioToTime,
  stepDays as addDays,
} from '@atlas/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import {
  fetchAtlas,
  fetchAtlasIndex,
  fetchLatestDataVersion,
  fetchSearchIndex,
} from '../data/client';
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
  showAdminBoundaries: boolean;
  showRegionLabels: boolean;
  locale: Locale;
  fromCache: boolean;
  mapView: ShareView | null;
  regionFocus: { regionId: string; nonce: number } | null;
  routeFocus: { entityId: string; order: number; nonce: number } | null;
  selectedRoute: { entityId: string; order: number } | null;

  searchIndex: SearchIndexFile | null;
  searchLoading: boolean;
  searchError: string | null;

  dataVersion: string | null;
  dataUpdateAvailable: boolean;

  loadIndex(): Promise<void>;
  loadAtlas(atlasId: string): Promise<void>;
  selectEvent(eventId: string | null): void;
  setBubbleEvent(eventId: string | null): void;
  toggleEntity(entityId: string): void;
  setActiveEntities(ids: string[]): void;
  setLocale(locale: Locale): void;
  hydrateLocale(): Promise<void>;
  clearCache(): Promise<void>;
  setFilters(filters: AtlasFilters): void;
  toggleCategory(category: string): void;
  toggleRegion(regionId: string): void;
  setRegions(regionIds: string[]): void;
  toggleAdminBoundaries(): void;
  toggleRegionLabels(): void;
  setShowRegionLabels(value: boolean): void;
  setShowAdminBoundaries(value: boolean): void;
  resetFilters(): void;
  setCurrentTime(time: AtlasTime): void;
  seekRatio(ratio: number): void;
  stepDays(days: number): void;
  play(): void;
  pause(): void;
  togglePlay(): void;
  setSpeed(speed: PlaybackSpeed): void;
  setMapView(view: ShareView): void;
  focusRegion(regionId: string): void;
  focusRoute(entityId: string, order: number): void;
  selectRoute(route: { entityId: string; order: number } | null): void;
  loadSearchData(): Promise<void>;
  checkDataUpdate(): Promise<void>;
  applyDataUpdate(): Promise<void>;
}

/**
 * 进度条范围跟随用户筛选出的图层：
 * 取这些图层中路线与事件的最早/最晚日期；没有可用路线与事件时回退到专题 timeRange。
 * 事件即使 `routeEvent: false` 也参与，避免政治、外交事件被进度条裁掉。
 * 不进入图例的背景线（legend: false，如海防线）不参与范围计算。
 */
function timelineForActiveLayers(
  dataset: AtlasDataset,
  activeEntityIds: ReadonlySet<string>,
): Timeline {
  const range = datasetDateRange(dataset.routes, dataset.events, (entityId) => {
    if (!activeEntityIds.has(entityId)) return false;
    const entity = dataset.entitiesById.get(entityId);
    return entity?.extensions?.legend !== false;
  });
  return createTimeline(range ?? dataset.manifest.timeRange);
}

function clampTimeToTimeline(currentTime: AtlasTime, timeline: Timeline): AtlasTime {
  return Math.min(timeline.end, Math.max(timeline.start, currentTime));
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
  showAdminBoundaries: true,
  showRegionLabels: true,
  locale: 'zh',
  fromCache: false,
  mapView: null,
  regionFocus: null,
  routeFocus: null,
  selectedRoute: null,

  searchIndex: null,
  searchLoading: false,
  searchError: null,

  dataVersion: null,
  dataUpdateAvailable: false,

  async loadIndex() {
    if (get().loading || get().index) return;
    set({ loading: true, error: null });
    resetCacheHit();
    try {
      const index = await fetchAtlasIndex();
      set({
        index: index.atlases,
        dataVersion: index.dataVersion ?? null,
        loading: false,
        fromCache: consumeCacheHit(),
      });
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
      regionFocus: null,
      routeFocus: null,
      selectedRoute: null,
      fromCache: false,
      showAdminBoundaries: true,
      showRegionLabels: true,
    });
    resetCacheHit();
    try {
      const dataset = await fetchAtlas(atlasId);
      const activeEntityIds = new Set(
        dataset.manifest.entities.map((entity) => entity.id),
      );
      const timeline = timelineForActiveLayers(dataset, activeEntityIds);
      set({
        dataset,
        loading: false,
        activeEntityIds,
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
    set({
      selectedEventId: eventId,
      ...(eventId ? { selectedRoute: null } : {}),
    });
  },

  setBubbleEvent(eventId) {
    set({ bubbleEventId: eventId });
  },

  setActiveEntities(ids) {
    const dataset = get().dataset;
    if (!dataset) return;
    const valid = new Set(dataset.manifest.entities.map((entity) => entity.id));
    const next = ids.filter((id) => valid.has(id));
    if (next.length === 0) return;
    const activeEntityIds = new Set(next);
    const timeline = timelineForActiveLayers(dataset, activeEntityIds);
    set({
      activeEntityIds,
      timeline,
      currentTime: clampTimeToTimeline(get().currentTime, timeline),
    });
  },

  toggleEntity(entityId) {
    const dataset = get().dataset;
    if (!dataset) return;
    const activeEntityIds = new Set(get().activeEntityIds);
    if (activeEntityIds.has(entityId)) activeEntityIds.delete(entityId);
    else activeEntityIds.add(entityId);
    const timeline = timelineForActiveLayers(dataset, activeEntityIds);
    set({
      activeEntityIds,
      timeline,
      currentTime: clampTimeToTimeline(get().currentTime, timeline),
    });
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
    const dataset = get().dataset;
    const regionIds = dataset
      ? normalizeRegionSelection(dataset.regionsById, filters.regionIds ?? [])
      : filters.regionIds;
    set({ filters: { ...filters, regionIds } });
  },

  toggleCategory(category) {
    const current = get().filters;
    const categories = current.categories.includes(category)
      ? current.categories.filter((item) => item !== category)
      : [...current.categories, category];
    set({ filters: { ...current, categories } });
  },

  toggleRegion(regionId) {
    const { dataset, filters } = get();
    if (!dataset) return;
    if (!dataset.regionsById.has(regionId)) return;
    const current = normalizeRegionSelection(dataset.regionsById, filters.regionIds ?? []);
    if (current.includes(regionId)) {
      set({ filters: { ...filters, regionIds: current.filter((id) => id !== regionId) } });
      return;
    }
    const next = current.filter(
      (id) => !isRegionDescendant(dataset.regionsById, id, regionId),
    );
    next.push(regionId);
    set({
      filters: {
        ...filters,
        regionIds: normalizeRegionSelection(dataset.regionsById, next),
      },
    });
  },

  setRegions(regionIds) {
    const dataset = get().dataset;
    const next = dataset
      ? normalizeRegionSelection(dataset.regionsById, regionIds)
      : regionIds;
    set({ filters: { ...get().filters, regionIds: next } });
  },

  toggleAdminBoundaries() {
    set({ showAdminBoundaries: !get().showAdminBoundaries });
  },

  toggleRegionLabels() {
    set({ showRegionLabels: !get().showRegionLabels });
  },

  setShowRegionLabels(value) {
    set({ showRegionLabels: value });
  },

  setShowAdminBoundaries(value) {
    set({ showAdminBoundaries: value });
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

  focusRegion(regionId) {
    set({ regionFocus: { regionId, nonce: (get().regionFocus?.nonce ?? 0) + 1 } });
  },

  focusRoute(entityId, order) {
    set({
      selectedRoute: { entityId, order },
      routeFocus: { entityId, order, nonce: (get().routeFocus?.nonce ?? 0) + 1 },
    });
  },

  selectRoute(route) {
    set({ selectedRoute: route });
  },

  async checkDataUpdate() {
    const current = get().dataVersion;
    if (!current) return;
    try {
      const latest = await fetchLatestDataVersion();
      if (latest && isDataVersionNewer(current, latest)) {
        set({ dataUpdateAvailable: true });
      }
    } catch {
      // 网络失败时保持现状，下次再检查
    }
  },

  async applyDataUpdate() {
    await clearAtlasCache();
    set({
      dataUpdateAvailable: false,
      index: null,
      dataset: null,
      searchIndex: null,
      error: null,
      fromCache: false,
    });
    await get().loadIndex();
  },

  async loadSearchData() {
    if (get().searchLoading || get().searchIndex) return;
    set({ searchLoading: true, searchError: null });
    resetCacheHit();
    try {
      const searchIndex = await fetchSearchIndex();
      set({
        searchIndex,
        dataVersion: searchIndex.dataVersion ?? get().dataVersion,
        searchLoading: false,
        fromCache: consumeCacheHit(),
      });
    } catch (error) {
      set({ searchError: (error as Error).message, searchLoading: false });
    }
  },
}));
