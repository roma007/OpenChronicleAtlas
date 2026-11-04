import {
  EMPTY_FILTERS,
  decodeShareState,
  parseDateString,
  resolveLocalized,
} from '@atlas/shared';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { EventDetailPanel } from '../components/detail/EventDetailPanel';
import { EventBubble } from '../components/map/EventBubble';
import { Legend } from '../components/layout/Legend';
import { Timeline } from '../components/timeline/Timeline';
import { MapCanvas } from '../components/map/MapCanvas';
import { useAtlasStore } from '../stores/useAtlasStore';
import { LanguageToggle } from '../components/layout/LanguageToggle';
import { useI18n } from '../hooks/useI18n';

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
  const setLocale = useAtlasStore((state) => state.setLocale);
  const setActiveEntities = useAtlasStore((state) => state.setActiveEntities);
  const setFilters = useAtlasStore((state) => state.setFilters);
  const { locale, t } = useI18n();

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
    if (state.locale) setLocale(state.locale);
    if (state.entities) setActiveEntities(state.entities);
    if (state.categories || state.from || state.to) {
      setFilters({
        ...EMPTY_FILTERS,
        categories: state.categories ?? [],
        from: state.from,
        to: state.to,
      });
    }
    if (state.time) setCurrentTime(parseDateString(state.time));
    if (state.eventId && dataset.eventsById.has(state.eventId)) {
      selectEvent(state.eventId);
    }
    if (state.view) requestView(state.view);
  }, [
    dataset,
    searchParams,
    pause,
    setLocale,
    setActiveEntities,
    setFilters,
    setCurrentTime,
    selectEvent,
    requestView,
  ]);

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
              {t('nav.backToAtlases')}
            </Link>
            <Link
              to="/search"
              className="shrink-0 rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
            >
              {t('nav.search')}
            </Link>
            <div className="min-w-0">
              <h1 className="truncate font-serif text-lg font-semibold tracking-wider text-ink">
                {manifest ? resolveLocalized(manifest.title, locale) : t('common.loading')}
              </h1>
              {manifest?.subtitle ? (
                <p className="truncate text-[11px] tracking-wider text-ink-soft/70">
                  {resolveLocalized(manifest.subtitle, locale)}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <LanguageToggle />
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar md:hidden"
            >
              {t('atlas.filters')}
            </button>
            <div className="hidden text-right text-[11px] leading-5 text-ink-soft/60 md:block">
              {t('atlas.mapAttribution')}
              <br />
              {t('atlas.draft')}
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
                aria-label={t('nav.closeFilters')}
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
            <p className="text-sm tracking-widest text-ink-soft">{t('atlas.loading')}</p>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="absolute inset-0 z-50 grid place-items-center bg-parchment p-6">
          <div className="max-w-lg rounded-2xl border border-cinnabar/30 bg-parchment p-6 shadow-panel">
            <h2 className="font-serif text-xl text-cinnabar">{t('atlas.errorTitle')}</h2>
            <p className="mt-3 break-words text-sm leading-6 text-ink-soft">{error}</p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => atlasId && void loadAtlas(atlasId)}
                className="rounded-full bg-cinnabar px-4 py-2 text-sm text-parchment transition hover:bg-cinnabar/90"
              >
                {t('nav.retry')}
              </button>
              <Link
                to="/"
                className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
              >
                {t('atlas.backToGallery')}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
