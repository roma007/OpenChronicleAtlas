import {
  applyEventFilters,
  categoryLabel,
  eventStart,
  formatDate,
  type AtlasEvent,
  neighborEvents,
  parseDateString,
  resolveLocalized,
  toDateString,
} from '@atlas/shared';
import { lazy, Suspense, useCallback, useEffect, useRef } from 'react';
import { dataUrl } from '../../data/client';
import { useShare } from '../../hooks/useShare';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { useI18n } from '../../hooks/useI18n';

const Markdown = lazy(() =>
  import('../common/Markdown').then((module) => ({ default: module.Markdown })),
);

export function EventDetailPanel() {
  const dataset = useAtlasStore((state) => state.dataset);
  const selectedEventId = useAtlasStore((state) => state.selectedEventId);
  const selectEvent = useAtlasStore((state) => state.selectEvent);
  const pause = useAtlasStore((state) => state.pause);
  const setCurrentTime = useAtlasStore((state) => state.setCurrentTime);
  const currentTime = useAtlasStore((state) => state.currentTime);
  const mapView = useAtlasStore((state) => state.mapView);
  const activeEntityIds = useAtlasStore((state) => state.activeEntityIds);
  const filters = useAtlasStore((state) => state.filters);
  const { share, lastResult } = useShare();
  const { locale, t, dateLocale } = useI18n();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const event =
    selectedEventId && dataset ? dataset.eventsById.get(selectedEventId) : undefined;

  const filtered = dataset
    ? applyEventFilters(dataset.events, filters).filter((item) =>
        item.entityIds.some((id) => activeEntityIds.has(id)),
      )
    : [];
  const pool =
    event && filtered.some((item) => item.id === event.id)
      ? filtered
      : (dataset?.events ?? []);
  const neighbors = event ? neighborEvents(pool, event.id) : {};

  const goToEvent = useCallback(
    (target?: AtlasEvent) => {
      if (!target) return;
      pause();
      setCurrentTime(eventStart(target));
      selectEvent(target.id);
    },
    [pause, setCurrentTime, selectEvent],
  );

  useEffect(() => {
    if (!event) return;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const onKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') selectEvent(null);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKeyDown);
      const previous = previousFocusRef.current;
      if (previous && document.contains(previous)) previous.focus();
    };
  }, [event, selectEvent]);

  useEffect(() => {
    if (!event) return;
    const onKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.altKey && keyboardEvent.key === 'ArrowLeft') {
        keyboardEvent.preventDefault();
        goToEvent(neighbors.previous);
      }
      if (keyboardEvent.altKey && keyboardEvent.key === 'ArrowRight') {
        keyboardEvent.preventDefault();
        goToEvent(neighbors.next);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [event, neighbors.previous, neighbors.next, goToEvent]);

  if (!event || !dataset) return null;

  const dateText = event.endDate
    ? `${formatDate(parseDateString(event.date), dateLocale)} — ${formatDate(
        parseDateString(event.endDate),
        dateLocale,
      )}`
    : formatDate(parseDateString(event.date), dateLocale);

  const entities = event.entityIds
    .map((id) => dataset.entitiesById.get(id))
    .filter((entity): entity is NonNullable<typeof entity> => Boolean(entity));

  const related = (event.relatedIds ?? [])
    .map((id) => dataset.eventsById.get(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const description = resolveLocalized(event.description, locale);

  const handleShare = () => {
    void share(dataset.manifest.id, {
      time: toDateString(currentTime),
      eventId: event.id,
      view: mapView ?? undefined,
      locale,
      entities: [...activeEntityIds],
      categories: filters.categories,
      from: filters.from,
      to: filters.to,
    });
  };

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="event-detail-title"
      aria-label={t('a11y.eventDialog')}
      className="atlas-scrollbar absolute inset-x-0 bottom-0 z-40 max-h-[72vh] overflow-y-auto rounded-t-2xl border-t border-ink/10 bg-parchment p-5 shadow-panel md:inset-y-auto md:bottom-44 md:left-auto md:right-6 md:top-24 md:max-h-[calc(100vh-16rem)] md:w-[26rem] md:rounded-2xl md:border"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full bg-cinnabar/10 px-2.5 py-1 text-[11px] tracking-wider text-cinnabar">
          {categoryLabel(event.category, locale)}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full border border-ink/10 px-3 py-1 text-[11px] text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
          >
            {lastResult === 'copied' || lastResult === 'shared' ? t('common.shared') : t('common.share')}
          </button>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label={t('detail.close')}
            onClick={() => selectEvent(null)}
            className="grid h-8 w-8 place-items-center rounded-full border border-ink/10 text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
          >
            ✕
          </button>
        </div>
      </div>

      <h2
        id="event-detail-title"
        className="mt-3 font-serif text-2xl font-semibold leading-snug tracking-wide text-ink"
      >
        {resolveLocalized(event.name, locale)}
      </h2>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex gap-3">
          <dt className="w-14 shrink-0 text-ink-soft/60">{t('common.time')}</dt>
          <dd className="text-ink-soft">{dateText}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-14 shrink-0 text-ink-soft/60">{t('common.place')}</dt>
          <dd className="text-ink-soft">
            {resolveLocalized(event.location.place, locale) || `${event.location.lng}, ${event.location.lat}`}
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-14 shrink-0 text-ink-soft/60">{t('common.entity')}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {entities.map((entity) => (
              <span
                key={entity.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-2 py-0.5 text-xs text-ink-soft"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: entity.color }}
                />
                {resolveLocalized(entity.name, locale)}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      <p className="mt-4 border-l-2 border-cinnabar/40 pl-3 text-sm leading-7 text-ink">
        {resolveLocalized(event.summary, locale)}
      </p>

      {description ? (
        <div className="mt-4">
          <Suspense fallback={<p className="text-sm text-ink-soft/70">{t('detail.rendering')}</p>}>
            <Markdown>{description}</Markdown>
          </Suspense>
        </div>
      ) : null}

      {event.images && event.images.length > 0 ? (
        <div className="mt-5 grid gap-2">
          {event.images.map((image) => (
            <figure key={image.src}>
              <img
                src={
                  image.src.startsWith('http')
                    ? image.src
                    : dataUrl(`${dataset.manifest.id}/${image.src}`)
                }
                alt={resolveLocalized(image.caption, locale)}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full rounded-lg border border-ink/10"
              />
              {image.caption ? (
                <figcaption className="mt-1 text-[11px] text-ink-soft/70">
                  {resolveLocalized(image.caption, locale)}
                  {image.credit ? ` · ${image.credit}` : ''}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}

      {related.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-xs tracking-[0.2em] text-ink-soft/60">{t('common.relatedEvents')}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {related.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectEvent(item.id)}
                className="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
              >
                {resolveLocalized(item.name, locale)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-2 border-t border-ink/10 pt-4">
        <button
          type="button"
          disabled={!neighbors.previous}
          onClick={() => goToEvent(neighbors.previous)}
          title={
            neighbors.previous
              ? `${t('event.previous')}: ${resolveLocalized(neighbors.previous.name, locale)} (Alt+←)`
              : undefined
          }
          className="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink-soft transition enabled:hover:border-cinnabar/40 enabled:hover:text-cinnabar disabled:opacity-35"
        >
          ← {t('event.previous')}
        </button>
        <button
          type="button"
          disabled={!neighbors.next}
          onClick={() => goToEvent(neighbors.next)}
          title={
            neighbors.next
              ? `${t('event.next')}: ${resolveLocalized(neighbors.next.name, locale)} (Alt+→)`
              : undefined
          }
          className="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink-soft transition enabled:hover:border-cinnabar/40 enabled:hover:text-cinnabar disabled:opacity-35"
        >
          {t('event.next')} →
        </button>
      </div>

      {event.sources && event.sources.length > 0 ? (
        <div className="mt-5 border-t border-ink/10 pt-4">
          <h3 className="text-xs tracking-[0.2em] text-ink-soft/60">{t('common.sources')}</h3>
          <ul className="mt-2 space-y-1.5 text-[11px] leading-5 text-ink-soft/80">
            {event.sources.map((source) => (
              <li key={`${source.title}-${source.year ?? ''}`}>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-ink/20 underline-offset-2 hover:text-cinnabar"
                  >
                    {source.title}
                  </a>
                ) : (
                  source.title
                )}
                {source.author ? ` · ${source.author}` : ''}
                {source.year ? ` · ${source.year}` : ''}
                {source.note ? (
                  <span className="block text-ink-soft/50">{source.note}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
