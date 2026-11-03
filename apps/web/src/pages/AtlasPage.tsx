import { resolveLocalized } from '@atlas/shared';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EventDetailPanel } from '../components/detail/EventDetailPanel';
import { EventBubble } from '../components/map/EventBubble';
import { Legend } from '../components/layout/Legend';
import { Timeline } from '../components/timeline/Timeline';
import { MapCanvas } from '../components/map/MapCanvas';
import { useAtlasStore } from '../stores/useAtlasStore';

export function AtlasPage() {
  const { atlasId } = useParams<{ atlasId: string }>();
  const dataset = useAtlasStore((state) => state.dataset);
  const loading = useAtlasStore((state) => state.loading);
  const error = useAtlasStore((state) => state.error);
  const loadAtlas = useAtlasStore((state) => state.loadAtlas);

  useEffect(() => {
    if (atlasId) void loadAtlas(atlasId);
  }, [atlasId, loadAtlas]);

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

          <div className="hidden shrink-0 text-right text-[11px] leading-5 text-ink-soft/60 md:block">
            高德地图 · 坐标 WGS84 → GCJ-02
            <br />
            数据初稿 · 待史料校订
          </div>
        </div>
      </header>

      <Legend />

      {manifest ? <Timeline /> : null}

      <EventDetailPanel />
      <EventBubble />

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
