import {
  applyEventFilters,
  collectCategories,
  resolveLocalized,
} from '@atlas/shared';
import { useAtlasStore } from '../../stores/useAtlasStore';

interface LegendProps {
  className?: string;
}

export function Legend({ className = '' }: LegendProps) {
  const dataset = useAtlasStore((state) => state.dataset);
  const activeEntityIds = useAtlasStore((state) => state.activeEntityIds);
  const toggleEntity = useAtlasStore((state) => state.toggleEntity);
  const filters = useAtlasStore((state) => state.filters);
  const setFilters = useAtlasStore((state) => state.setFilters);
  const toggleCategory = useAtlasStore((state) => state.toggleCategory);
  const resetFilters = useAtlasStore((state) => state.resetFilters);

  if (!dataset) return null;

  const entities = [...dataset.manifest.entities].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  const categories = collectCategories(dataset.events);
  const filteredEvents = applyEventFilters(dataset.events, filters).filter((event) =>
    event.entityIds.some((entityId) => activeEntityIds.has(entityId)),
  );
  const hasFilters =
    filters.categories.length > 0 || Boolean(filters.from) || Boolean(filters.to);

  return (
    <section
      aria-label="路线图层与筛选"
      className={`rounded-2xl border border-ink/10 bg-parchment/95 p-4 shadow-panel backdrop-blur ${className}`}
    >
      <h2 className="font-serif text-sm tracking-[0.2em] text-ink">路线图层</h2>
      <ul className="mt-3 space-y-1">
        {entities.map((entity) => {
          const active = activeEntityIds.has(entity.id);
          const segments = dataset.routes.filter(
            (route) => route.properties.entityId === entity.id,
          ).length;

          return (
            <li key={entity.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => toggleEntity(entity.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition ${
                  active ? 'text-ink hover:bg-ink/5' : 'text-ink/40 hover:bg-ink/5'
                }`}
              >
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-parchment"
                  style={{
                    backgroundColor: entity.color,
                    opacity: active ? 1 : 0.35,
                  }}
                />
                <span className="flex-1 truncate">{resolveLocalized(entity.name)}</span>
                <span className="text-[10px] tabular-nums text-ink-soft/70">
                  {segments > 0 ? `${segments} 段` : '—'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 border-t border-ink/10 pt-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-serif text-sm tracking-[0.2em] text-ink">筛选</h2>
          <span className="text-[10px] tabular-nums text-ink-soft/70">
            {filteredEvents.length} / {dataset.events.length}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {categories.map((category) => {
            const active = filters.categories.includes(category);
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => toggleCategory(category)}
                className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                  active
                    ? 'border-cinnabar/40 bg-cinnabar/10 text-cinnabar'
                    : 'border-ink/10 text-ink-soft hover:border-cinnabar/30'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="text-[10px] text-ink-soft/70">
            开始
            <input
              type="date"
              value={filters.from ?? ''}
              min={dataset.manifest.timeRange.start}
              max={filters.to ?? dataset.manifest.timeRange.end}
              onChange={(event) =>
                setFilters({ ...filters, from: event.target.value || undefined })
              }
              className="mt-1 w-full rounded-md border border-ink/15 bg-parchment px-2 py-1 text-[11px] text-ink-soft focus:border-cinnabar/50 focus:outline-none"
            />
          </label>
          <label className="text-[10px] text-ink-soft/70">
            结束
            <input
              type="date"
              value={filters.to ?? ''}
              min={filters.from ?? dataset.manifest.timeRange.start}
              max={dataset.manifest.timeRange.end}
              onChange={(event) =>
                setFilters({ ...filters, to: event.target.value || undefined })
              }
              className="mt-1 w-full rounded-md border border-ink/15 bg-parchment px-2 py-1 text-[11px] text-ink-soft focus:border-cinnabar/50 focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-[10px] leading-4 text-ink-soft/60">
            与时间轴叠加：只显示已发生且符合条件的事件。
          </p>
          <button
            type="button"
            onClick={resetFilters}
            disabled={!hasFilters}
            className="shrink-0 rounded-full border border-ink/10 px-2.5 py-1 text-[10px] text-ink-soft transition enabled:hover:border-cinnabar/40 enabled:hover:text-cinnabar disabled:opacity-40"
          >
            重置
          </button>
        </div>
      </div>
    </section>
  );
}
