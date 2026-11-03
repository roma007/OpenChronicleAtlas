import { decodeShareState, parseDateString, resolveLocalized } from '@atlas/shared';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { EventDetailPanel } from '../components/detail/EventDetailPanel';
import { EventBubble } from '../components/map/EventBubble';
import { Legend } from '../components/layout/Legend';
import { Timeline } from '../components/timeline/Timeline';
import { MapCanvas } from '../components/map/MapCanvas';
import { useAtlasStore } from '../stores/useAtlasStore';

export function AtlasPage() {
  const { atlasId } = useParams<{ atlasId: string }>();
  const [searchParams] = useSearchParams();
  const dataset = useAtlasStore((state) => state.dataset);
  const loading = useAtlasStore((state) => state.loading);
  const error = useAtlasStore((state) => state.error);
  const loadAtlas = useAtlasStore((state) => state.loadAtlas);
  const setCurrentTime = useAtlasStore((state) => state.setCurrentTime);
  const selectEvent = useAtlasStore((state) => state.selectEvent);
  const requestView = useAtlasStore((state) => state.requestView);
  const pause = useAtlasStore((state) => state.pause);

  const appliedShareRef = useRef(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (atlasId) void loadAtlas(atlasId);
  }, [atlasId, loadAtlas]);

  useEffect(() => {
    appliedShareRef.current = false;
  }, [atlasId, dataset]);

  useEffect(() => {
    if (!dataset || appliedShareRef.current) return;
    appliedShareRef.current = true;

    const state = decodeShareState(searchParams);
    if (!state) return;

    pause();
    if (state.time) setCurrentTime(parseDateString(state.time));
    if (state.eventId && dataset.eventsById.has(state.eventId)) {
      selectEvent(state.eventId);
    }
    if (state.view) requestView(state.view);
  }, [dataset, searchParams, pause, setCurrentTime, selectEvent, requestView]);

  const manifest = dataset && dataset.manifest.id === atlasId ? dataset.manifest : null;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-ink">
      <MapCanvas />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-30">
        <div className="pointer-events-auto flex items-center justify-between gap-4 border-b border-ink/10 bg-parchment/95 px-4 py-3 shadow-sm backdrop-blur md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              className="shrink-0 rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
            >
              ← 专题
            </Link>
            <Link
              to="/search"
              className="shrink-0 rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
            >
              搜索
            </Link>
            <div className="min-w-0">
              <h1 className="truncate font-serif text-lg font-semibold tracking-wider text-ink">
                {manifest ? resolveLocalized(manifest.title) : '加载中…'}
              </h1>
              {manifest?.subtitle ? (
                <p className="truncate text-[11px] tracking-wider text-ink-soft/70">
                  {resolveLocalized(manifest.subtitle)}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar md:hidden"
            >
              筛选
            </button>
            <div className="hidden text-right text-[11px] leading-5 text-ink-soft/60 md:block">
              高德地图 · 坐标 WGS84 → GCJ-02
              <br />
              数据初稿 · 待史料校订
            </div>
          </div>
        </div>
      </header>

      <Legend className="absolute left-4 top-24 z-20 hidden w-64 md:block" />

      {manifest ? <Timeline /> : null}

      <EventDetailPanel />
      <EventBubble />

      {filtersOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 p-4 pt-20 md:hidden"
          onClick={() => setFiltersOpen(false)}
        >
          <div className="w-full max-w-sm" onClick={(event) => event.stopPropagation()}>
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                aria-label="关闭筛选"
                onClick={() => setFiltersOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-parchment text-ink-soft shadow"
              >
                ✕
              </button>
            </div>
            <Legend className="max-h-[75vh] overflow-y-auto" />
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="absolute inset-0 z-40 grid place-items-center bg-parchment/85 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-cinnabar/30 border-t-cinnabar" />
            <p className="text-sm tracking-widest text-ink-soft">正在加载专题数据…</p>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="absolute inset-0 z-50 grid place-items-center bg-parchment p-6">
          <div className="max-w-lg rounded-2xl border border-cinnabar/30 bg-parchment p-6 shadow-panel">
            <h2 className="font-serif text-xl text-cinnabar">专题加载失败</h2>
            <p className="mt-3 break-words text-sm leading-6 text-ink-soft">{error}</p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => atlasId && void loadAtlas(atlasId)}
                className="rounded-full bg-cinnabar px-4 py-2 text-sm text-parchment transition hover:bg-cinnabar/90"
              >
                重试
              </button>
              <Link
                to="/"
                className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
              >
                返回专题列表
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
