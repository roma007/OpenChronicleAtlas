import {
  categoryLabel,
  collectCategories,
  parseDateString,
  resolveLocalized,
  searchEvents,
  type SearchHit,
} from '@atlas/shared';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAtlasStore } from '../stores/useAtlasStore';
import { LanguageToggle } from '../components/layout/LanguageToggle';
import { useI18n } from '../hooks/useI18n';

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-ochre/30 px-0.5 text-ink">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}

export function SearchPage() {
  const searchIndex = useAtlasStore((state) => state.searchIndex);
  const loading = useAtlasStore((state) => state.searchLoading);
  const error = useAtlasStore((state) => state.searchError);
  const loadSearchData = useAtlasStore((state) => state.loadSearchData);
  const { locale, t } = useI18n();

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [atlasFilter, setAtlasFilter] = useState('');
  const [category, setCategory] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchIndex && !loading) void loadSearchData();
  }, [searchIndex, loading, loadSearchData]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query.trim()), 200);
    return () => window.clearTimeout(timer);
  }, [query]);

  const toTime = (value: string) => {
    if (!value) return undefined;
    try {
      return parseDateString(value);
    } catch {
      return undefined;
    }
  };

  const hits = useMemo(() => {
    if (!searchIndex || !debounced) return [];
    return searchEvents(debounced, searchIndex, {
      atlasId: atlasFilter || undefined,
      category: category || undefined,
      from: toTime(from),
      to: toTime(to),
      limit: 50,
    });
  }, [searchIndex, debounced, atlasFilter, category, from, to]);

  const categories = useMemo(
    () =>
      searchIndex
        ? collectCategories(searchIndex.entries.map((entry) => entry.event))
        : [],
    [searchIndex],
  );

  const resetFilters = () => {
    setAtlasFilter('');
    setCategory('');
    setFrom('');
    setTo('');
  };

  const atlases = useMemo(() => {
    const map = new Map<string, { id: string; title: string }>();
    for (const entry of searchIndex?.entries ?? []) {
      if (!map.has(entry.atlasId)) {
        map.set(entry.atlasId, {
          id: entry.atlasId,
          title: resolveLocalized(entry.atlasTitle, locale),
        });
      }
    }
    return [...map.values()];
  }, [searchIndex, locale]);

  const openHit = (hit: SearchHit) => {
    const params = new URLSearchParams({ t: hit.event.date, event: hit.event.id });
    navigate(`/atlas/${hit.atlasId}?${params.toString()}`);
  };

  return (
    <div className="min-h-full bg-parchment">
      <header className="border-b border-ink/10 bg-parchment/90">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
            >
              {t('nav.backToAtlases')}
            </Link>
            <div className="flex items-center gap-3">
              <p className="text-xs tracking-[0.3em] text-cinnabar">OPENCHRONICLE ATLAS</p>
              <LanguageToggle />
            </div>
          </div>

          <h1 className="mt-6 font-serif text-3xl font-semibold tracking-wider text-ink">
            {t('search.title')}
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {t('search.subtitle')}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('search.placeholder')}
              aria-label={t('search.title')}
              autoFocus
              className="flex-1 rounded-xl border border-ink/15 bg-parchment px-4 py-3 text-sm text-ink shadow-sm placeholder:text-ink-soft/40 focus:border-cinnabar/50 focus:outline-none focus:ring-2 focus:ring-cinnabar/10"
            />
            <select
              value={atlasFilter}
              onChange={(event) => setAtlasFilter(event.target.value)}
              aria-label={t('search.atlasFilter')}
              className="rounded-xl border border-ink/15 bg-parchment px-3 py-3 text-sm text-ink-soft focus:border-cinnabar/50 focus:outline-none"
            >
              <option value="">{t('search.allAtlases')}</option>
              {atlases.map((atlas) => (
                <option key={atlas.id} value={atlas.id}>
                  {atlas.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-ink-soft/60">{t('search.filters')}</span>
            <button
              type="button"
              aria-pressed={category === ''}
              onClick={() => setCategory('')}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                category === ''
                  ? 'border-cinnabar/40 bg-cinnabar/10 text-cinnabar'
                  : 'border-ink/10 text-ink-soft hover:border-cinnabar/30'
              }`}
            >
              {t('search.allCategories')}
            </button>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                  category === item
                    ? 'border-cinnabar/40 bg-cinnabar/10 text-cinnabar'
                    : 'border-ink/10 text-ink-soft hover:border-cinnabar/30'
                }`}
              >
                {categoryLabel(item, locale)}
              </button>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-ink-soft/70">
            <label className="flex items-center gap-1">
              {t('common.start')}
              <input
                type="date"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                className="rounded-md border border-ink/15 bg-parchment px-2 py-1 text-[11px] text-ink-soft focus:border-cinnabar/50 focus:outline-none"
              />
            </label>
            <label className="flex items-center gap-1">
              {t('common.end')}
              <input
                type="date"
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className="rounded-md border border-ink/15 bg-parchment px-2 py-1 text-[11px] text-ink-soft focus:border-cinnabar/50 focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-ink/10 px-2.5 py-1 text-[10px] text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
            >
              {t('search.resetFilters')}
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        {loading && !searchIndex ? (
          <div className="space-y-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-xl border border-ink/10 bg-parchment-deep/50"
              />
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-cinnabar/30 bg-cinnabar/5 p-6">
            <h2 className="font-serif text-lg text-cinnabar">{t('search.errorTitle')}</h2>
            <p className="mt-2 break-words text-sm leading-6 text-ink-soft">{error}</p>
            <button
              type="button"
              onClick={() => void loadSearchData()}
              className="mt-4 rounded-full border border-cinnabar/40 px-4 py-2 text-sm text-cinnabar transition hover:bg-cinnabar hover:text-parchment"
            >
              {t('nav.retry')}
            </button>
          </div>
        ) : null}

        {!error && debounced ? (
          <p className="mb-3 text-xs text-ink-soft/70">
            {t(hits.length === 1 ? 'search.result' : 'search.results', {
              count: hits.length,
            })}
          </p>
        ) : null}

        {!error && !debounced ? (
          <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center">
            <p className="font-serif text-lg text-ink">{t('search.promptTitle')}</p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {t('search.promptBody')}
            </p>
          </div>
        ) : null}

        {!error && debounced && hits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center">
            <p className="font-serif text-lg text-ink">{t('search.emptyTitle')}</p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {t('search.emptyBody')}
            </p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mt-4 rounded-full border border-ink/15 px-4 py-2 text-sm text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
            >
              {t('search.clear')}
            </button>
          </div>
        ) : null}

        <div className="space-y-3">
          {hits.map((hit) => (
            <button
              key={`${hit.atlasId}:${hit.event.id}`}
              type="button"
              onClick={() => openHit(hit)}
              className="block w-full rounded-xl border border-ink/10 bg-parchment p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-cinnabar/30 hover:shadow-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinnabar"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-serif text-base font-semibold text-ink">
                  <Highlight text={resolveLocalized(hit.event.name, locale)} query={debounced} />
                </span>
                <span className="shrink-0 text-[11px] tabular-nums text-ink-soft/60">
                  {hit.event.date.replace(/^0+/, '')}
                </span>
              </div>

              <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-ink-soft">
                <Highlight text={hit.snippet} query={debounced} />
              </p>

              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-ink-soft/60">
                <span>{resolveLocalized(hit.atlasTitle, locale)}</span>
                <span>{categoryLabel(hit.event.category, locale)}</span>
                {resolveLocalized(hit.event.location.place, locale) ? (
                  <span>{resolveLocalized(hit.event.location.place, locale)}</span>
                ) : null}
              </div>
            </button>
          ))}
        </div>

        {!error && debounced ? (
          <p className="mt-8 text-center text-[11px] leading-5 text-ink-soft/50">
            {t('search.note')}
          </p>
        ) : null}
      </main>
    </div>
  );
}
