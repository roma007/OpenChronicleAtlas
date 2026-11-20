import {
  applyEventFilters,
  parseDateString,
  regionName,
  regionAncestors,
  resolveLocalized,
  type AtlasRegion,
} from '@atlas/shared';
import { useEffect, useMemo, useState } from 'react';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { useI18n } from '../../hooks/useI18n';

const FIRST_LEVEL = new Set<AtlasRegion['level']>(['province', 'municipality', 'overseas']);

interface RegionFilterProps {
  className?: string;
}

export function RegionFilter({ className = '' }: RegionFilterProps) {
  const dataset = useAtlasStore((state) => state.dataset);
  const filters = useAtlasStore((state) => state.filters);
  const toggleRegion = useAtlasStore((state) => state.toggleRegion);
  const setRegions = useAtlasStore((state) => state.setRegions);
  const focusRegion = useAtlasStore((state) => state.focusRegion);
  const selectEvent = useAtlasStore((state) => state.selectEvent);
  const setCurrentTime = useAtlasStore((state) => state.setCurrentTime);
  const pause = useAtlasStore((state) => state.pause);
  const { locale, t } = useI18n();
  const [query, setQuery] = useState('');
  const [expandedCounties, setExpandedCounties] = useState<Set<string>>(new Set());
  const [showEvents, setShowEvents] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);

  const selected = useMemo(() => new Set(filters.regionIds), [filters.regionIds]);

  const expandedFirst = useMemo(() => {
    if (!dataset) return new Set<string>();
    const result = new Set<string>();
    for (const id of selected) {
      const ancestors = regionAncestors(dataset.regionsById, id);
      const first = ancestors.find((region) => FIRST_LEVEL.has(region.level));
      if (first) result.add(first.id);
    }
    return result;
  }, [dataset, selected]);

  const firstLevel = useMemo(() => {
    if (!dataset) return [];
    return dataset.regions
      .filter((region) => FIRST_LEVEL.has(region.level))
      .sort((a, b) => regionName(a, locale).localeCompare(regionName(b, locale), locale));
  }, [dataset, locale]);

  const childrenByParent = useMemo(() => {
    const map = new Map<string, AtlasRegion[]>();
    if (!dataset) return map;
    for (const region of dataset.regions) {
      if (!region.parentId || FIRST_LEVEL.has(region.level)) continue;
      const list = map.get(region.parentId) ?? [];
      list.push(region);
      map.set(region.parentId, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => regionName(a, locale).localeCompare(regionName(b, locale), locale));
    }
    return map;
  }, [dataset, locale]);

  const eventCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const event of dataset?.events ?? []) {
      for (const id of event.location.regionIds ?? []) {
        counts.set(id, (counts.get(id) ?? 0) + 1);
      }
    }
    return counts;
  }, [dataset]);

  const routeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const route of dataset?.routes ?? []) {
      for (const id of route.properties.regionIds ?? []) {
        counts.set(id, (counts.get(id) ?? 0) + 1);
      }
    }
    return counts;
  }, [dataset]);

  // 选中县/地点时自动展开其所属县
  useEffect(() => {
    if (!dataset) return;
    setExpandedCounties((previous) => {
      const next = new Set(previous);
      let changed = false;
      for (const id of filters.regionIds) {
        const region = dataset.regionsById.get(id);
        if (!region) continue;
        if (region.level === 'county') {
          if (!next.has(region.id)) {
            next.add(region.id);
            changed = true;
          }
        } else if (region.level === 'place' && region.parentId) {
          const parent = dataset.regionsById.get(region.parentId);
          if (parent?.level === 'county' && !next.has(parent.id)) {
            next.add(parent.id);
            changed = true;
          }
        }
      }
      return changed ? next : previous;
    });
  }, [dataset, filters.regionIds]);

  if (!dataset || dataset.regions.length === 0) return null;

  const activeFirst = firstLevel.filter((region) => expandedFirst.has(region.id));
  const visibleFirst = firstLevel.filter(
    (region) =>
      (eventCounts.get(region.id) ?? 0) > 0 ||
      (routeCounts.get(region.id) ?? 0) > 0 ||
      selected.has(region.id) ||
      expandedFirst.has(region.id),
  );
  const queryText = query.trim().toLowerCase();
  const matchesQuery = (region: AtlasRegion) => {
    if (!queryText) return true;
    const haystack = [
      regionName(region, locale),
      region.modernName ? resolveLocalized(region.modernName, locale) : '',
      ...(region.aliases ?? []),
    ].join(' ');
    return haystack.toLowerCase().includes(queryText);
  };
  const countLabel = (region: AtlasRegion) => {
    const events = eventCounts.get(region.id) ?? 0;
    const routes = routeCounts.get(region.id) ?? 0;
    return routes > 0 ? `${events} / ${routes}` : String(events);
  };

  const regionEvents = applyEventFilters(dataset.events, filters).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const visibleRegionEvents = showAllEvents ? regionEvents : regionEvents.slice(0, 12);

  const groups = activeFirst.map((first) => {
    const direct = childrenByParent.get(first.id) ?? [];
    const counties = direct.filter((region) => region.level === 'county');
    const directPlaces = direct.filter((region) => region.level === 'place');
    const visibleCounties = counties
      .map((county) => {
        const places = childrenByParent.get(county.id) ?? [];
        const matchingPlaces = places.filter(matchesQuery);
        const countyMatches = matchesQuery(county);
        const visible = countyMatches || matchingPlaces.length > 0;
        return {
          county,
          places: countyMatches ? places : matchingPlaces,
          visible,
          countyMatches,
        };
      })
      .filter((entry) => entry.visible);
    const visiblePlaces = directPlaces.filter(matchesQuery);
    return { first, counties: visibleCounties, directPlaces: visiblePlaces };
  });
  const hasRows = groups.some(
    (group) => group.counties.length > 0 || group.directPlaces.length > 0,
  );

  return (
    <section className={`mt-3 border-t border-ink/10 pt-3 ${className}`} aria-label={t('legend.regions')}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[11px] tracking-[0.18em] text-ink-soft">{t('legend.regions')}</h3>
        {filters.regionIds.length > 0 ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => focusRegion(filters.regionIds[0]!)}
              className="rounded-full border border-cinnabar/30 px-2 py-0.5 text-[10px] text-cinnabar transition hover:border-cinnabar/60"
            >
              {t('legend.focusRegion')}
            </button>
            <button
              type="button"
              onClick={() => setRegions([])}
              className="rounded-full border border-ink/10 px-2 py-0.5 text-[10px] text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
            >
              {t('legend.clearRegions')}
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex max-h-28 flex-wrap gap-1 overflow-y-auto pr-1">
        {visibleFirst.map((region) => {
          const active = selected.has(region.id);
          const partial = !active && expandedFirst.has(region.id);
          const count = eventCounts.get(region.id) ?? 0;
          return (
            <button
              key={region.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggleRegion(region.id)}
              className={`rounded-full border px-2 py-0.5 text-[10px] transition ${
                active
                  ? 'border-cinnabar/50 bg-cinnabar/10 text-cinnabar'
                  : partial
                    ? 'border-cinnabar/30 bg-cinnabar/5 text-cinnabar/80'
                    : 'border-ink/10 text-ink-soft hover:border-cinnabar/30 hover:text-cinnabar'
              }`}
              title={`${regionName(region, locale)} · ${count}`}
            >
              {regionName(region, locale)}
              <span className="ml-1 tabular-nums opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {activeFirst.length > 0 ? (
        <div className="mt-2">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('legend.searchRegion')}
            className="w-full rounded-lg border border-ink/10 bg-parchment/70 px-2 py-1 text-[11px] text-ink outline-none placeholder:text-ink-soft/50 focus:border-cinnabar/40"
          />
          <ul className="mt-1.5 max-h-64 space-y-0.5 overflow-y-auto pr-1">
            {groups.map((group) => (
              <li key={group.first.id}>
                <div className="px-1.5 py-1 text-[9px] tracking-[0.16em] text-ink-soft/45">
                  {regionName(group.first, locale)}
                </div>
                {group.counties.map(({ county, places }) => {
                  const expanded = expandedCounties.has(county.id) || Boolean(queryText);
                  const active = selected.has(county.id);
                  return (
                    <div key={county.id}>
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedCounties((previous) => {
                              const next = new Set(previous);
                              if (next.has(county.id)) next.delete(county.id);
                              else next.add(county.id);
                              return next;
                            })
                          }
                          aria-label={t(expanded ? 'legend.collapseCounty' : 'legend.expandCounty')}
                          className="grid h-5 w-5 shrink-0 place-items-center rounded text-[10px] text-ink-soft/50 hover:bg-ink/5 hover:text-ink"
                        >
                          {expanded ? '▾' : '▸'}
                        </button>
                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleRegion(county.id)}
                          className={`flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-1 py-1 text-left text-[11px] transition ${
                            active
                              ? 'bg-cinnabar/10 text-cinnabar'
                              : 'text-ink-soft hover:bg-ink/5 hover:text-ink'
                          }`}
                        >
                          <span className="font-medium">{regionName(county, locale)}</span>
                          <span className="ml-auto shrink-0 tabular-nums text-[9px] opacity-60">
                            {countLabel(county)}
                          </span>
                        </button>
                      </div>
                      {expanded ? (
                        <ul className="space-y-0.5">
                          {places.map((place) => {
                            const placeActive = selected.has(place.id);
                            return (
                              <li key={place.id}>
                                <button
                                  type="button"
                                  aria-pressed={placeActive}
                                  onClick={() => toggleRegion(place.id)}
                                  className={`flex w-full items-center gap-1.5 rounded-md py-1 pl-7 pr-1.5 text-left text-[10px] transition ${
                                    placeActive
                                      ? 'bg-cinnabar/10 text-cinnabar'
                                      : 'text-ink-soft/80 hover:bg-ink/5 hover:text-ink'
                                  }`}
                                >
                                  <span>· {regionName(place, locale)}</span>
                                  {place.modernName ? (
                                    <span className="truncate text-[9px] opacity-45">
                                      {resolveLocalized(place.modernName, locale)}
                                    </span>
                                  ) : null}
                                  <span className="ml-auto shrink-0 tabular-nums text-[9px] opacity-55">
                                    {countLabel(place)}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                          {places.length === 0 ? (
                            <li className="py-1 pl-7 pr-1.5 text-[9px] text-ink-soft/40">
                              {t('legend.noRegionMatch')}
                            </li>
                          ) : null}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
                {group.directPlaces.map((place) => {
                  const active = selected.has(place.id);
                  return (
                    <button
                      key={place.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleRegion(place.id)}
                      className={`flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[10px] transition ${
                        active
                          ? 'bg-cinnabar/10 text-cinnabar'
                          : 'text-ink-soft/80 hover:bg-ink/5 hover:text-ink'
                      }`}
                    >
                      <span>· {regionName(place, locale)}</span>
                      {place.modernName ? (
                        <span className="truncate text-[9px] opacity-45">
                          {resolveLocalized(place.modernName, locale)}
                        </span>
                      ) : null}
                      <span className="ml-auto shrink-0 tabular-nums text-[9px] opacity-55">
                        {countLabel(place)}
                      </span>
                    </button>
                  );
                })}
              </li>
            ))}
            {!hasRows ? (
              <li className="px-1.5 py-1 text-[10px] text-ink-soft/50">{t('legend.noRegionMatch')}</li>
            ) : null}
          </ul>
          <p className="mt-1 text-[9px] leading-4 text-ink-soft/50">{t('legend.regionHint')}</p>

          <div className="mt-2 border-t border-ink/10 pt-2">
            <button
              type="button"
              onClick={() => setShowEvents((value) => !value)}
              className="flex w-full items-center justify-between rounded-md px-1.5 py-1 text-[10px] tracking-wider text-ink-soft transition hover:bg-ink/5"
            >
              <span>{t('legend.regionEvents')} · {regionEvents.length}</span>
              <span className="text-ink-soft/50">{showEvents ? '▾' : '▸'}</span>
            </button>
            {showEvents ? (
              <ul className="mt-1 max-h-52 space-y-0.5 overflow-y-auto pr-1">
                {visibleRegionEvents.map((event) => {
                  const color =
                    dataset.entitiesById.get(event.entityIds[0] ?? '')?.color ?? '#8c2f24';
                  return (
                    <li key={event.id}>
                      <button
                        type="button"
                        onClick={() => {
                          pause();
                          setCurrentTime(parseDateString(event.date));
                          selectEvent(event.id);
                        }}
                        className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[10px] text-ink-soft transition hover:bg-ink/5 hover:text-ink"
                        title={`${event.date} · ${resolveLocalized(event.name, locale)}`}
                      >
                        <span className="w-[62px] shrink-0 tabular-nums text-[9px] opacity-55">
                          {event.date}
                        </span>
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="min-w-0 flex-1 truncate">
                          {resolveLocalized(event.name, locale)}
                        </span>
                      </button>
                    </li>
                  );
                })}
                {regionEvents.length === 0 ? (
                  <li className="px-1.5 py-1 text-[9px] text-ink-soft/50">
                    {t('legend.noRegionEvents')}
                  </li>
                ) : null}
              </ul>
            ) : null}
            {showEvents && regionEvents.length > 12 ? (
              <button
                type="button"
                onClick={() => setShowAllEvents((value) => !value)}
                className="mt-1 w-full rounded-md px-1.5 py-1 text-[9px] text-cinnabar/80 transition hover:bg-cinnabar/5"
              >
                {t(showAllEvents ? 'legend.showLessRegionEvents' : 'legend.showAllRegionEvents')}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
