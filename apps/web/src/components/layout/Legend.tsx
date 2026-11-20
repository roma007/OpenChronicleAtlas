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
import { RegionFilter } from './RegionFilter';

interface LegendProps {
  className?: string;
}

export function Legend({ className = '' }: LegendProps) {
  const dataset = useAtlasStore((state) => state.dataset);
  const activeEntityIds = useAtlasStore((state) => state.activeEntityIds);
  const toggleEntity = useAtlasStore((state) => state.toggleEntity);
  const soloEntity = useAtlasStore((state) => state.soloEntity);
  const showAllEntities = useAtlasStore((state) => state.showAllEntities);
  const showTerritories = useAtlasStore((state) => state.showTerritories);
  const toggleTerritories = useAtlasStore((state) => state.toggleTerritories);
  const showAdminBoundaries = useAtlasStore((state) => state.showAdminBoundaries);
  const toggleAdminBoundaries = useAtlasStore((state) => state.toggleAdminBoundaries);
  const filters = useAtlasStore((state) => state.filters);
  const setFilters = useAtlasStore((state) => state.setFilters);
  const toggleCategory = useAtlasStore((state) => state.toggleCategory);
  const resetFilters = useAtlasStore((state) => state.resetFilters);
  const { locale, t } = useI18n();

  if (!dataset) return null;

  // 图例只列有路线或事件的实体；纯疆域实体保留在地图上，但不占图例行。
  // 标记 legend: false 的实体（如海防线）只作为地图背景，不进入图例。
  const legendRoutes = dataset.routes.filter((route) => {
    const entity = dataset.entitiesById.get(route.properties.entityId);
    return entity?.extensions?.legend !== false;
  });
  const entitiesWithData = new Set([
    ...legendRoutes.map((route) => route.properties.entityId),
    ...dataset.events.flatMap((event) => event.entityIds),
  ]);
  const entities = dataset.manifest.entities
    .filter(
      (entity) =>
        entity.extensions?.legend !== false && entitiesWithData.has(entity.id),
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const notes = Array.isArray(dataset.manifest.extensions?.notes)
    ? (dataset.manifest.extensions.notes as Array<{ zh: string; en?: string }>)
    : [];
  const categories = collectCategories(dataset.events);
  const segmentTypes = [
    ...new Set(
      legendRoutes
        .map((route) => route.properties.segmentType)
        .filter((type): type is NonNullable<typeof type> => Boolean(type)),
    ),
  ];
  const hasDefenseRoutes = legendRoutes.some(
    (route) =>
      route.properties.segmentType === 'defense' && Boolean(route.properties.label),
  );
  // 线头箭头对所有非防御路线生效，图例说明也随之出现
  const hasMovingRoutes = legendRoutes.some(
    (route) => route.properties.segmentType !== 'defense',
  );
  const filteredEvents = applyEventFilters(dataset.events, filters).filter((event) =>
    event.entityIds.some((entityId) => activeEntityIds.has(entityId)),
  );
  const hasFilters =
    filters.categories.length > 0 ||
    filters.regionIds.length > 0 ||
    Boolean(filters.from) ||
    Boolean(filters.to);
  const allEntitiesActive = entities.every((entity) => activeEntityIds.has(entity.id));

  return (
    <section
      aria-label={t('legend.layers')}
      className={`rounded-2xl border border-ink/10 bg-parchment/95 p-4 shadow-panel backdrop-blur ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-serif text-sm tracking-[0.2em] text-ink">{t('legend.layers')}</h2>
        <button
          type="button"
          onClick={showAllEntities}
          disabled={allEntitiesActive}
          title={t('legend.showAll')}
          className="rounded-full border border-ink/10 px-2.5 py-0.5 text-[10px] text-ink-soft transition enabled:hover:border-cinnabar/40 enabled:hover:text-cinnabar disabled:opacity-40"
        >
          {t('legend.showAll')}
        </button>
      </div>

      {dataset.territories.some(
        (feature) => feature.properties.extensions?.kind !== 'admin-boundary',
      ) ? (
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

      {dataset.territories.some(
        (feature) => feature.properties.extensions?.kind === 'admin-boundary',
      ) ? (
        <button
          type="button"
          aria-pressed={showAdminBoundaries}
          onClick={toggleAdminBoundaries}
          className={`mt-2 flex w-full items-center gap-2.5 rounded-lg border px-2 py-1.5 text-left text-[11px] transition ${
            showAdminBoundaries
              ? 'border-cinnabar/30 bg-cinnabar/10 text-cinnabar'
              : 'border-ink/10 text-ink-soft/60 hover:border-cinnabar/30'
          }`}
        >
          <span
            aria-hidden
            className="h-3 w-3 shrink-0 rounded-sm border border-current"
            style={{ opacity: 0.5 }}
          />
          <span className="flex-1">{t('legend.adminBoundaries')}</span>
          <span className="tabular-nums opacity-70">
            {t(showAdminBoundaries ? 'legend.on' : 'legend.off')}
          </span>
        </button>
      ) : null}

      <RegionFilter />

      <ul className="mt-3 space-y-1">
        {entities.map((entity) => {
          const active = activeEntityIds.has(entity.id);
          const solo = active && activeEntityIds.size === 1;
          const entityName = resolveLocalized(entity.name, locale);
          const segments = dataset.routes.filter(
            (route) => route.properties.entityId === entity.id,
          ).length;
          const eventCount = dataset.events.filter((event) =>
            event.entityIds.includes(entity.id),
          ).length;

          return (
            <li
              key={entity.id}
              className="flex items-center gap-1 rounded-lg px-1 transition hover:bg-ink/5"
            >
              <button
                type="button"
                aria-pressed={active}
                onClick={() => toggleEntity(entity.id)}
                className={`flex min-w-0 flex-1 flex-col items-start gap-0.5 rounded-md px-1 py-1.5 text-left text-sm transition ${
                  active ? 'text-ink' : 'text-ink/40'
                }`}
              >
                <span className="flex w-full min-w-0 items-center gap-2">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-parchment"
                    style={{
                      backgroundColor: entity.color,
                      opacity: active ? 1 : 0.35,
                    }}
                  />
                  <span className="min-w-0 flex-1 truncate">{entityName}</span>
                </span>
                <span className="whitespace-nowrap pl-[18px] text-[10px] tabular-nums text-ink-soft/70">
                  {segments > 0 || eventCount > 0
                    ? t('legend.counts', { events: eventCount, routes: segments })
                    : '—'}
                </span>
              </button>
              <button
                type="button"
                aria-pressed={active}
                aria-label={active ? t('legend.hide') : t('legend.show')}
                title={active ? t('legend.hide') : t('legend.show')}
                onClick={() => toggleEntity(entity.id)}
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border transition ${
                  active
                    ? 'border-cinnabar/30 bg-cinnabar/10 text-cinnabar'
                    : 'border-ink/10 text-ink-soft/60 hover:border-cinnabar/30 hover:text-cinnabar'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
                  <circle cx="12" cy="12" r="2.6" />
                  {active ? null : <path d="M4 20 20 4" />}
                </svg>
              </button>
              <button
                type="button"
                aria-pressed={solo}
                aria-label={t('legend.solo')}
                title={t('legend.solo')}
                onClick={() => soloEntity(entity.id)}
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border transition ${
                  solo
                    ? 'border-cinnabar/30 bg-cinnabar/10 text-cinnabar'
                    : 'border-ink/10 text-ink-soft/60 hover:border-cinnabar/30 hover:text-cinnabar'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="6.5" />
                  <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
                  <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>

      {notes.length > 0 ? (
        <div className="mt-3 border-t border-ink/10 pt-3">
          <h2 className="font-serif text-sm tracking-[0.2em] text-ink">
            {t('legend.notes')}
          </h2>
          <ul className="mt-2 space-y-1.5">
            {notes.map((note, index) => (
              <li
                key={index}
                className="rounded-lg bg-ink/[0.03] px-2.5 py-2 text-[11px] leading-relaxed text-ink-soft"
              >
                {resolveLocalized(note, locale)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

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
