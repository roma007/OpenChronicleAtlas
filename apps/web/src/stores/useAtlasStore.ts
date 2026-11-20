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
  isDataVersionNewer,
  createTimeline,
  normalizeLocale,
  normalizeRegionSelection,
  isRegionDescendant,
  ratioToTime,
  stepDays as addDays,
} from '@atlas/shared';
import { create } from 'zustand';
import { dataUrl, fetchAtlas, fetchAtlasIndex, fetchSearchIndex } from '../data/client';

export type PlaybackSpeed = 0.5 | 1 | 2 | 4;

function initialLocale(): Locale {
  if (typeof window === 'undefined') return 'zh';
  try {
    return normalizeLocale(window.localStorage.getItem('atlas-locale'));
  } catch {
    return 'zh';
  }
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

/** 切换图层后把当前时间夹到新的进度范围内。 */
function clampTimeToTimeline(currentTime: AtlasTime, timeline: Timeline): AtlasTime {
  return Math.min(timeline.end, Math.max(timeline.start, currentTime));
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
  preSoloEntityIds: Set<string> | null;
  filters: AtlasFilters;
  locale: Locale;
  showTerritories: boolean;
  showAdminBoundaries: boolean;
  showRegionLabels: boolean;

  timeline: Timeline | null;
  currentTime: AtlasTime;
  playing: boolean;
  /** 正在拖动时间轴：用于让地图临时进入「聚焦当前」的压暗状态 */
  scrubbing: boolean;
  speed: PlaybackSpeed;
  bubbleEventId: string | null;

  mapView: ShareView | null;
  viewRequest: ViewRequest | null;
  regionFocus: { regionId: string; nonce: number } | null;
  routeFocus: { entityId: string; order: number; nonce: number } | null;

  searchIndex: SearchIndexFile | null;
  searchLoading: boolean;
  searchError: string | null;

  dataVersion: string | null;
  dataUpdateAvailable: boolean;

  loadIndex(): Promise<void>;
  loadAtlas(atlasId: string): Promise<void>;
  selectEvent(eventId: string | null): void;
  toggleEntity(entityId: string): void;
  setActiveEntities(ids: string[]): void;
  soloEntity(entityId: string): void;
  showAllEntities(): void;
  toggleTerritories(): void;
  toggleAdminBoundaries(): void;
  toggleRegionLabels(): void;

  setLocale(locale: Locale): void;
  setFilters(filters: AtlasFilters): void;
  toggleCategory(category: string): void;
  toggleRegion(regionId: string): void;
  setRegions(regionIds: string[]): void;
  resetFilters(): void;

  setCurrentTime(time: AtlasTime): void;
  seekRatio(ratio: number): void;
  stepDays(days: number): void;
  play(): void;
  pause(): void;
  togglePlay(): void;
  setScrubbing(value: boolean): void;
  setSpeed(speed: PlaybackSpeed): void;
  resetPlayback(): void;
  setBubbleEvent(eventId: string | null): void;

  setMapView(view: ShareView): void;
  requestView(view: ShareView): void;
  focusRegion(regionId: string): void;
  focusRoute(entityId: string, order: number): void;

  loadSearchData(): Promise<void>;
  checkDataUpdate(): Promise<void>;
  applyDataUpdate(): void;
}

export const useAtlasStore = create<AtlasState>((set, get) => ({
  index: null,
  dataset: null,
  loading: false,
  error: null,
  selectedEventId: null,
  activeEntityIds: new Set(),
  preSoloEntityIds: null,
  filters: EMPTY_FILTERS,
  locale: initialLocale(),
  showTerritories: true,
  showAdminBoundaries: true,
  showRegionLabels: true,

  timeline: null,
  currentTime: 0,
  playing: false,
  scrubbing: false,
  speed: 1,
  bubbleEventId: null,

  mapView: null,
  viewRequest: null,
  regionFocus: null,
  routeFocus: null,

  searchIndex: null,
  searchLoading: false,
  searchError: null,

  dataVersion: null,
  dataUpdateAvailable: false,

  async loadIndex() {
    if (get().loading || get().index) return;
    set({ loading: true, error: null });
    try {
      const index = await fetchAtlasIndex();
      set({
        index: index.atlases,
        dataVersion: index.dataVersion ?? null,
        loading: false,
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
      playing: false,
      timeline: null,
      filters: EMPTY_FILTERS,
      bubbleEventId: null,
      mapView: null,
      viewRequest: null,
      regionFocus: null,
      routeFocus: null,
      showAdminBoundaries: true,
      showRegionLabels: true,
    });
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
        preSoloEntityIds: null,
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
    const activeEntityIds = new Set(next);
    const timeline = timelineForActiveLayers(dataset, activeEntityIds);
    set({
      activeEntityIds,
      timeline,
      currentTime: clampTimeToTimeline(get().currentTime, timeline),
      preSoloEntityIds: null,
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
      preSoloEntityIds: null,
    });
  },

  soloEntity(entityId) {
    const { dataset, activeEntityIds, preSoloEntityIds } = get();
    if (!dataset) return;
    if (!dataset.manifest.entities.some((entity) => entity.id === entityId)) return;
    const isSolo = activeEntityIds.size === 1 && activeEntityIds.has(entityId);
    if (isSolo && preSoloEntityIds) {
      const next = new Set(preSoloEntityIds);
      const timeline = timelineForActiveLayers(dataset, next);
      set({
        activeEntityIds: next,
        timeline,
        currentTime: clampTimeToTimeline(get().currentTime, timeline),
        preSoloEntityIds: null,
      });
      return;
    }
    const next = new Set([entityId]);
    const timeline = timelineForActiveLayers(dataset, next);
    set({
      preSoloEntityIds: new Set(activeEntityIds),
      activeEntityIds: next,
      timeline,
      currentTime: clampTimeToTimeline(get().currentTime, timeline),
    });
  },

  showAllEntities() {
    const dataset = get().dataset;
    if (!dataset) return;
    const activeEntityIds = new Set(
      dataset.manifest.entities.map((entity) => entity.id),
    );
    const timeline = timelineForActiveLayers(dataset, activeEntityIds);
    set({
      activeEntityIds,
      timeline,
      currentTime: clampTimeToTimeline(get().currentTime, timeline),
      preSoloEntityIds: null,
    });
  },

  toggleTerritories() {
    set({ showTerritories: !get().showTerritories });
  },

  toggleAdminBoundaries() {
    set({ showAdminBoundaries: !get().showAdminBoundaries });
  },

  toggleRegionLabels() {
    set({ showRegionLabels: !get().showRegionLabels });
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
    // 显式选省/市时，清掉其下的县/地点；选县/地点时，由 normalize 去掉祖先
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

  setScrubbing(value) {
    if (get().scrubbing !== value) set({ scrubbing: value });
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

  focusRegion(regionId) {
    set({ regionFocus: { regionId, nonce: (get().regionFocus?.nonce ?? 0) + 1 } });
  },

  focusRoute(entityId, order) {
    set({ routeFocus: { entityId, order, nonce: (get().routeFocus?.nonce ?? 0) + 1 } });
  },

  async checkDataUpdate() {
    const current = get().dataVersion;
    if (!current) return;
    try {
      const response = await fetch(dataUrl('index.json'), { cache: 'no-store' });
      if (!response.ok) return;
      const raw = (await response.json()) as { dataVersion?: string };
      if (isDataVersionNewer(current, raw.dataVersion)) {
        set({ dataUpdateAvailable: true });
      }
    } catch {
      // 网络失败时保持现状，下次再检查
    }
  },

  applyDataUpdate() {
    if (typeof window !== 'undefined') window.location.reload();
  },

  async loadSearchData() {
    if (get().searchLoading || get().searchIndex) return;
    set({ searchLoading: true, searchError: null });
    try {
      const searchIndex = await fetchSearchIndex();
      set({
        searchIndex,
        dataVersion: searchIndex.dataVersion ?? get().dataVersion,
        searchLoading: false,
      });
    } catch (error) {
      set({ searchError: (error as Error).message, searchLoading: false });
    }
  },
}));

if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as unknown as { __atlasStore?: typeof useAtlasStore }).__atlasStore =
    useAtlasStore;
}

