import {
  regionName,
  regionAncestors,
  resolveLocalized,
  type AtlasRegion,
} from '@atlas/shared';
import { useMemo, useState } from 'react';
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
  const { locale, t } = useI18n();
  const [query, setQuery] = useState('');

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

  if (!dataset || dataset.regions.length === 0) return null;

  const activeFirst = firstLevel.filter((region) => expandedFirst.has(region.id));
  const visibleFirst = firstLevel.filter(
    (region) =>
      (eventCounts.get(region.id) ?? 0) > 0 ||
      (routeCounts.get(region.id) ?? 0) > 0 ||
      selected.has(region.id) ||
      expandedFirst.has(region.id),
  );
  const children = activeFirst.length
    ? dataset.regions
        .filter((region) => {
          if (FIRST_LEVEL.has(region.level)) return false;
          let current: AtlasRegion | undefined = region;
          while (current && !FIRST_LEVEL.has(current.level)) {
            current = current.parentId ? dataset.regionsById.get(current.parentId) : undefined;
          }
          return current ? expandedFirst.has(current.id) : false;
        })
        .filter((region) => {
          if (!query.trim()) return true;
          const haystack = [
            regionName(region, locale),
            region.modernName ? resolveLocalized(region.modernName, locale) : '',
            ...(region.aliases ?? []),
          ].join(' ');
          return haystack.toLowerCase().includes(query.trim().toLowerCase());
        })
        .sort((a, b) => {
          const depth = (region: AtlasRegion) => {
            let count = 0;
            let current: AtlasRegion | undefined = region;
            while (current && current.parentId) {
              count += 1;
              current = dataset.regionsById.get(current.parentId);
            }
            return count;
          };
          const d = depth(a) - depth(b);
          return d !== 0 ? d : regionName(a, locale).localeCompare(regionName(b, locale), locale);
        })
    : [];

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
          <ul className="mt-1.5 max-h-56 space-y-0.5 overflow-y-auto pr-1">
            {children.map((region) => {
              const active = selected.has(region.id);
              const count = eventCounts.get(region.id) ?? 0;
              const routes = routeCounts.get(region.id) ?? 0;
              const isCounty = region.level === 'county';
              return (
                <li key={region.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleRegion(region.id)}
                    className={`flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[11px] transition ${
                      active
                        ? 'bg-cinnabar/10 text-cinnabar'
                        : 'text-ink-soft hover:bg-ink/5 hover:text-ink'
                    }`}
                  >
                    <span className={isCounty ? 'font-medium' : 'opacity-70'}>
                      {isCounty ? '' : '· '}
                      {regionName(region, locale)}
                    </span>
                    {region.modernName ? (
                      <span className="truncate text-[9px] opacity-50">
                        {resolveLocalized(region.modernName, locale)}
                      </span>
                    ) : null}
                    <span className="ml-auto shrink-0 tabular-nums text-[9px] opacity-60">
                      {count}
                      {routes > 0 ? ` / ${routes}` : ''}
                    </span>
                  </button>
                </li>
              );
            })}
            {children.length === 0 ? (
              <li className="px-1.5 py-1 text-[10px] text-ink-soft/50">{t('legend.noRegionMatch')}</li>
            ) : null}
          </ul>
          <p className="mt-1 text-[9px] leading-4 text-ink-soft/50">{t('legend.regionHint')}</p>
        </div>
      ) : null}
    </section>
  );
}
