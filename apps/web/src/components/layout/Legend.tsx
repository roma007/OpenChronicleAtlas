import {
  applyEventFilters,
  categoryLabel,
  collectCategories,
  resolveLocalized,
  routeStyleForSegmentType,
  segmentTypeLabel,
} from '@atlas/shared';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { useI18n } from '../../hooks/useI18n';

interface LegendProps {
  className?: string;
}

export function Legend({ className = '' }: LegendProps) {
  const dataset = useAtlasStore((state) => state.dataset);
  const activeEntityIds = useAtlasStore((state) => state.activeEntityIds);
  const toggleEntity = useAtlasStore((state) => state.toggleEntity);
  const showTerritories = useAtlasStore((state) => state.showTerritories);
  const toggleTerritories = useAtlasStore((state) => state.toggleTerritories);
  const filters = useAtlasStore((state) => state.filters);
  const setFilters = useAtlasStore((state) => state.setFilters);
  const toggleCategory = useAtlasStore((state) => state.toggleCategory);
  const resetFilters = useAtlasStore((state) => state.resetFilters);
  const { locale, t } = useI18n();

  if (!dataset) return null;

  const entities = [...dataset.manifest.entities].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  const categories = collectCategories(dataset.events);
  const segmentTypes = [
    ...new Set(
      dataset.routes
        .map((route) => route.properties.segmentType)
        .filter((type): type is NonNullable<typeof type> => Boolean(type)),
    ),
  ];
  const hasDefenseRoutes = dataset.routes.some(
    (route) =>
      route.properties.segmentType === 'defense' && Boolean(route.properties.label),
  );
  // 线头箭头对所有非防御路线生效，图例说明也随之出现
  const hasMovingRoutes = dataset.routes.some(
    (route) => route.properties.segmentType !== 'defense',
  );
  const filteredEvents = applyEventFilters(dataset.events, filters).filter((event) =>
    event.entityIds.some((entityId) => activeEntityIds.has(entityId)),
  );
  const hasFilters =
    filters.categories.length > 0 || Boolean(filters.from) || Boolean(filters.to);

  return (
    <section
      aria-label={t('legend.layers')}
      className={`rounded-2xl border border-ink/10 bg-parchment/95 p-4 shadow-panel backdrop-blur ${className}`}
    >
      <h2 className="font-serif text-sm tracking-[0.2em] text-ink">{t('legend.layers')}</h2>

      {dataset.territories.length > 0 ? (
        <button
          type="button"
          aria-pressed={showTerritories}
          onClick={toggleTerritories}
          className={`mt-2 flex w-full items-center gap-2.5 rounded-lg border px-2 py-1.5 text-left text-[11px] transition ${
            showTerritories
              ? 'border-cinnabar/30 bg-cinnabar/10 text-cinnabar'
              : 'border-ink/10 text-ink-soft/60 hover:border-cinnabar/30'
          }`}
        >
          <span
            aria-hidden
            className="h-3 w-3 shrink-0 rounded-sm border border-current"
            style={{
              backgroundColor: showTerritories ? 'currentColor' : 'transparent',
              opacity: 0.35,
            }}
          />
          <span className="flex-1">{t('legend.territories')}</span>
          <span className="tabular-nums opacity-70">
            {t(showTerritories ? 'legend.on' : 'legend.off')}
          </span>
        </button>
      ) : null}

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
                <span className="flex-1 truncate">{resolveLocalized(entity.name, locale)}</span>
                <span className="text-[10px] tabular-nums text-ink-soft/70">
                  {segments > 0
                    ? t(segments === 1 ? 'common.segment' : 'common.segments', {
                        count: segments,
                      })
                    : '—'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {segmentTypes.length > 0 ? (
        <div className="mt-3 border-t border-ink/10 pt-3">
          <h2 className="font-serif text-sm tracking-[0.2em] text-ink">
            {t('legend.routeStyles')}
          </h2>
          <ul className="mt-2 space-y-1.5">
            {segmentTypes.map((type) => {
              const style = routeStyleForSegmentType(type);
              return (
                <li
                  key={type}
                  className="flex items-center gap-2.5 text-[11px] text-ink-soft"
                >
                  {type === 'defense' && hasDefenseRoutes ? (
                    <span aria-hidden className="relative h-3 w-6 shrink-0">
                      <span className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-cinnabar" />
                      <span className="absolute left-0 top-0 h-3 w-0.5 bg-cinnabar" />
                      <span className="absolute left-[9px] top-0 h-3 w-0.5 bg-cinnabar" />
                      <span className="absolute right-0 top-0 h-3 w-0.5 bg-cinnabar" />
                    </span>
                  ) : (
                    <span
                      aria-hidden
                      className="w-6 shrink-0 border-t-2 border-cinnabar"
                      style={{
                        borderStyle:
                          style.dash === 'dotted'
                            ? 'dotted'
                            : style.dash === 'dashed'
                              ? 'dashed'
                              : 'solid',
                        borderTopWidth: style.weight,
                      }}
                    />
                  )}
                  <span>{segmentTypeLabel(type, locale)}</span>
                </li>
              );
            })}
          </ul>
          {hasDefenseRoutes || hasMovingRoutes ? (
            <div className="mt-2 space-y-1 text-[10px] leading-4 text-ink-soft/70">
              {hasDefenseRoutes ? <p>{t('legend.defenseHint')}</p> : null}
              {hasMovingRoutes ? <p>{t('legend.routeHeadHint')}</p> : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-3 border-t border-ink/10 pt-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-serif text-sm tracking-[0.2em] text-ink">{t('legend.filters')}</h2>
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
                {categoryLabel(category, locale)}
              </button>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="text-[10px] text-ink-soft/70">
            {t('common.start')}
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
            {t('common.end')}
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
            {t('legend.hint')}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            disabled={!hasFilters}
            className="shrink-0 rounded-full border border-ink/10 px-2.5 py-1 text-[10px] text-ink-soft transition enabled:hover:border-cinnabar/40 enabled:hover:text-cinnabar disabled:opacity-40"
          >
            {t('legend.reset')}
          </button>
        </div>
      </div>
    </section>
  );
}
