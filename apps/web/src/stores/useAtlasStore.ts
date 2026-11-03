import type { AtlasDataset, AtlasSummary, AtlasTime, Timeline } from '@atlas/shared';
import {
  clampToTimeline,
  createTimeline,
  ratioToTime,
  stepDays as addDays,
} from '@atlas/shared';
import { create } from 'zustand';
import { fetchAtlas, fetchAtlasIndex } from '../data/client';

export type PlaybackSpeed = 0.5 | 1 | 2 | 4;

interface AtlasState {
  index: AtlasSummary[] | null;
  dataset: AtlasDataset | null;
  loading: boolean;
  error: string | null;
  selectedEventId: string | null;
  activeEntityIds: Set<string>;

  timeline: Timeline | null;
  currentTime: AtlasTime;
  playing: boolean;
  speed: PlaybackSpeed;
  bubbleEventId: string | null;

  loadIndex(): Promise<void>;
  loadAtlas(atlasId: string): Promise<void>;
  selectEvent(eventId: string | null): void;
  toggleEntity(entityId: string): void;

  setCurrentTime(time: AtlasTime): void;
  seekRatio(ratio: number): void;
  stepDays(days: number): void;
  play(): void;
  pause(): void;
  togglePlay(): void;
  setSpeed(speed: PlaybackSpeed): void;
  resetPlayback(): void;
  setBubbleEvent(eventId: string | null): void;
}

export const useAtlasStore = create<AtlasState>((set, get) => ({
  index: null,
  dataset: null,
  loading: false,
  error: null,
  selectedEventId: null,
  activeEntityIds: new Set(),

  timeline: null,
  currentTime: 0,
  playing: false,
  speed: 1,
  bubbleEventId: null,

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
      bubbleEventId: null,
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

  toggleEntity(entityId) {
    const next = new Set(get().activeEntityIds);
    if (next.has(entityId)) next.delete(entityId);
    else next.add(entityId);
    set({ activeEntityIds: next });
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
}));
