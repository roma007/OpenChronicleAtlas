import { useEffect } from 'react';
import { useAtlasStore } from '../stores/useAtlasStore';
import { AtlasCard } from '../components/atlas/AtlasCard';

export function AtlasGalleryPage() {
  const { index, loading, error, loadIndex } = useAtlasStore();

  useEffect(() => {
    void loadIndex();
  }, [loadIndex]);

  return (
    <div className="min-h-full bg-parchment">
      <header className="border-b border-ink/10 bg-parchment/90">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:px-8 md:py-14">
          <p className="text-xs font-medium tracking-[0.35em] text-cinnabar">OPENCHRONICLE ATLAS</p>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-semibold tracking-wider text-ink md:text-5xl">
                史迹 · 时空地图
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft md:text-base">
                以地图与时间轴浏览历史专题的路线、事件与时空演变。专题以数据包接入，平台不绑定单一历史叙事。
              </p>
            </div>
            <p className="text-xs leading-6 text-ink-soft/80 md:text-right">
              数据契约 v1.0.0
              <br />
              地图服务 · 高德
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-14">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-serif text-xl tracking-widest text-ink">专题</h2>
          <span className="text-xs text-ink-soft">{index?.length ?? 0} 个专题</span>
        </div>

        {loading && !index ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl border border-ink/10 bg-parchment-deep/60"
              />
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-cinnabar/30 bg-cinnabar/5 p-6">
            <h3 className="font-serif text-lg text-cinnabar">专题索引加载失败</h3>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{error}</p>
            <button
              type="button"
              onClick={() => void loadIndex()}
              className="mt-4 rounded-full border border-cinnabar/40 px-4 py-2 text-sm text-cinnabar transition hover:bg-cinnabar hover:text-parchment"
            >
              重试
            </button>
          </div>
        ) : null}

        {index ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {index.map((atlas) => (
              <AtlasCard key={atlas.id} atlas={atlas} />
            ))}
          </div>
        ) : null}

        {index && index.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/20 p-10 text-center text-sm text-ink-soft">
            还没有专题数据包。请按 docs/schema/atlas-schema-v1.0.0.md 添加。
          </p>
        ) : null}
      </main>

      <footer className="border-t border-ink/10 px-5 py-8 text-center text-xs leading-6 text-ink-soft/70">
        史迹 · 时空地图 — M1 静态地图验证版
        <br />
        数据为示意初稿，待史料校订
      </footer>
    </div>
  );
}
