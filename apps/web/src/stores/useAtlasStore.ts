import type { AtlasDataset, AtlasSummary } from '@atlas/shared';
import { create } from 'zustand';
import { fetchAtlas, fetchAtlasIndex } from '../data/client';

interface AtlasState {
  index: AtlasSummary[] | null;
  dataset: AtlasDataset | null;
  loading: boolean;
  error: string | null;
  selectedEventId: string | null;
  activeEntityIds: Set<string>;
  loadIndex(): Promise<void>;
  loadAtlas(atlasId: string): Promise<void>;
  selectEvent(eventId: string | null): void;
  toggleEntity(entityId: string): void;
}

export const useAtlasStore = create<AtlasState>((set, get) => ({
  index: null,
  dataset: null,
  loading: false,
  error: null,
  selectedEventId: null,
  activeEntityIds: new Set(),

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
    set({ loading: true, error: null, dataset: null, selectedEventId: null });
    try {
      const dataset = await fetchAtlas(atlasId);
      set({
        dataset,
        loading: false,
        activeEntityIds: new Set(dataset.manifest.entities.map((entity) => entity.id)),
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
}));
