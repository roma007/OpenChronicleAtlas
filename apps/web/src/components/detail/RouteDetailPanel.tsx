import { eventsNearPoint, parseDateString, resolveLocalized, segmentTypeLabel } from '@atlas/shared';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { useI18n } from '../../hooks/useI18n';

export function RouteDetailPanel() {
  const dataset = useAtlasStore((state) => state.dataset);
  const selectedRoute = useAtlasStore((state) => state.selectedRoute);
  const selectedEventId = useAtlasStore((state) => state.selectedEventId);
  const selectRoute = useAtlasStore((state) => state.selectRoute);
  const focusRoute = useAtlasStore((state) => state.focusRoute);
  const selectEvent = useAtlasStore((state) => state.selectEvent);
  const setCurrentTime = useAtlasStore((state) => state.setCurrentTime);
  const pause = useAtlasStore((state) => state.pause);
  const setRegions = useAtlasStore((state) => state.setRegions);
  const focusRegion = useAtlasStore((state) => state.focusRegion);
  const { locale, t } = useI18n();

  if (!dataset || !selectedRoute || selectedEventId) return null;

  const route = dataset.routes.find(
    (item) =>
      item.properties.entityId === selectedRoute.entityId &&
      item.properties.order === selectedRoute.order,
  );
  if (!route) return null;

  const entity = dataset.entitiesById.get(route.properties.entityId);
  const name =
    resolveLocalized(route.properties.name, locale) ||
    resolveLocalized(entity?.name, locale) ||
    route.properties.entityId;
  const description = resolveLocalized(route.properties.description, locale);
  const dateText = `${route.properties.startDate} — ${route.properties.endDate}`;
  const start = route.geometry.coordinates[0];
  const end = route.geometry.coordinates.at(-1);
  const routeRegions = Array.from(
    new Set(
      (route.properties.regionIds ?? [])
        .map((id) => dataset.regionsById.get(id))
        .filter((item): item is NonNullable<typeof item> => {
          if (!item) return false;
          return (
            item.level === 'province' ||
            item.level === 'municipality' ||
            item.level === 'county'
          );
        })
        .map((item) => item.id),
    ),
  )
    .map((id) => dataset.regionsById.get(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => {
      const rank = (level: string) =>
        level === 'province' ? 0 : level === 'municipality' ? 1 : 2;
      return rank(a.level) - rank(b.level) || resolveLocalized(a.name, locale).localeCompare(resolveLocalized(b.name, locale));
    });
  const startEvents = start ? eventsNearPoint(dataset.events, start, 20, 3) : [];
  const startIds = new Set(startEvents.map((item) => item.event.id));
  const endEvents = end
    ? eventsNearPoint(dataset.events, end, 20, 3).filter(
        (item) => !startIds.has(item.event.id),
      )
    : [];

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-label={t('route.detail')}
      className="atlas-scrollbar absolute inset-x-0 bottom-0 z-40 max-h-[62vh] overflow-y-auto rounded-t-2xl border-t border-ink/10 bg-parchment p-5 shadow-panel md:inset-y-auto md:bottom-44 md:left-auto md:right-6 md:top-24 md:max-h-[calc(100vh-16rem)] md:w-[24rem] md:rounded-2xl md:border"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-cinnabar/10 px-2.5 py-1 text-[11px] tracking-wider text-cinnabar">
          {segmentTypeLabel(route.properties.segmentType, locale)}
        </span>
        <button
          type="button"
          aria-label={t('detail.close')}
          onClick={() => selectRoute(null)}
          className="grid h-8 w-8 place-items-center rounded-full border border-ink/10 text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
        >
          ✕
        </button>
      </div>

      <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug tracking-wide text-ink">
        {name}
      </h2>
      <p className="mt-1 text-[11px] text-ink-soft/60">{t('route.highlighted')}</p>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex gap-3">
          <dt className="w-14 shrink-0 text-ink-soft/60">{t('common.time')}</dt>
          <dd className="text-ink-soft">{dateText}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-14 shrink-0 text-ink-soft/60">{t('common.entity')}</dt>
          <dd className="inline-flex items-center gap-1.5 text-ink-soft">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: entity?.color ?? '#8c2f24' }}
            />
            {resolveLocalized(entity?.name, locale) || route.properties.entityId}
          </dd>
        </div>
      </dl>

      {description ? (
        <p className="mt-4 whitespace-pre-line border-l-2 border-cinnabar/40 pl-3 text-sm leading-7 text-ink">
          {description}
        </p>
      ) : null}

      {routeRegions.length > 0 ? (
        <div className="mt-4">
          <h3 className="text-[10px] tracking-[0.18em] text-ink-soft/50">
            {t('route.regions')}
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {routeRegions.slice(0, 14).map((region) => (
              <button
                key={region.id}
                type="button"
                onClick={() => {
                  setRegions([region.id]);
                  focusRegion(region.id);
                  selectRoute(null);
                }}
                className="rounded-full border border-ink/10 px-2 py-0.5 text-[10px] text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
              >
                {resolveLocalized(region.name, locale)}
              </button>
            ))}
            {routeRegions.length > 14 ? (
              <span className="px-1 py-0.5 text-[9px] text-ink-soft/50">
                {t('route.moreRegions', { count: routeRegions.length - 14 })}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      {startEvents.length > 0 ? (
        <div className="mt-4">
          <h3 className="text-[10px] tracking-[0.18em] text-ink-soft/50">
            {t('route.nearStart')}
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {startEvents.map(({ event, distanceKm }) => (
              <button
                key={event.id}
                type="button"
                onClick={() => {
                  pause();
                  setCurrentTime(parseDateString(event.date));
                  selectEvent(event.id);
                }}
                title={`${event.date} · ${distanceKm.toFixed(1)} km`}
                className="rounded-full border border-ink/10 px-2 py-0.5 text-[10px] text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
              >
                {resolveLocalized(event.name, locale)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {endEvents.length > 0 ? (
        <div className="mt-3">
          <h3 className="text-[10px] tracking-[0.18em] text-ink-soft/50">
            {t('route.nearEnd')}
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {endEvents.map(({ event, distanceKm }) => (
              <button
                key={event.id}
                type="button"
                onClick={() => {
                  pause();
                  setCurrentTime(parseDateString(event.date));
                  selectEvent(event.id);
                }}
                title={`${event.date} · ${distanceKm.toFixed(1)} km`}
                className="rounded-full border border-ink/10 px-2 py-0.5 text-[10px] text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
              >
                {resolveLocalized(event.name, locale)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => focusRoute(route.properties.entityId, route.properties.order)}
          className="rounded-full bg-cinnabar px-4 py-2 text-xs text-parchment transition hover:bg-cinnabar/90"
        >
          {t('route.focus')}
        </button>
        <button
          type="button"
          onClick={() => selectRoute(null)}
          className="rounded-full border border-ink/15 px-4 py-2 text-xs text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
        >
          {t('detail.close')}
        </button>
      </div>
    </aside>
  );
}
