import { formatDate, parseDateString, resolveLocalized } from '@atlas/shared';
import { useEffect } from 'react';
import { useAtlasStore } from '../../stores/useAtlasStore';

export function EventDetailPanel() {
  const dataset = useAtlasStore((state) => state.dataset);
  const selectedEventId = useAtlasStore((state) => state.selectedEventId);
  const selectEvent = useAtlasStore((state) => state.selectEvent);

  const event =
    selectedEventId && dataset ? dataset.eventsById.get(selectedEventId) : undefined;

  useEffect(() => {
    if (!event) return;
    const onKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') selectEvent(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [event, selectEvent]);

  if (!event || !dataset) return null;

  const dateText = event.endDate
    ? `${formatDate(parseDateString(event.date), 'zh-CN')} — ${formatDate(
        parseDateString(event.endDate),
        'zh-CN',
      )}`
    : formatDate(parseDateString(event.date), 'zh-CN');

  const entities = event.entityIds
    .map((id) => dataset.entitiesById.get(id))
    .filter((entity): entity is NonNullable<typeof entity> => Boolean(entity));

  const related = (event.relatedIds ?? [])
    .map((id) => dataset.eventsById.get(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const description = resolveLocalized(event.description)
    .split(/\n{2,}/)
    .filter(Boolean);

  return (
    <aside
      aria-label="事件详情"
      className="atlas-scrollbar absolute inset-x-0 bottom-0 z-40 max-h-[72vh] overflow-y-auto rounded-t-2xl border-t border-ink/10 bg-parchment p-5 shadow-panel md:inset-y-auto md:bottom-44 md:left-auto md:right-6 md:top-24 md:max-h-[calc(100vh-16rem)] md:w-[26rem] md:rounded-2xl md:border"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full bg-cinnabar/10 px-2.5 py-1 text-[11px] tracking-wider text-cinnabar">
          {event.category}
        </span>
        <button
          type="button"
          aria-label="关闭详情"
          onClick={() => selectEvent(null)}
          className="grid h-8 w-8 place-items-center rounded-full border border-ink/10 text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
        >
          ✕
        </button>
      </div>

      <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug tracking-wide text-ink">
        {resolveLocalized(event.name)}
      </h2>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex gap-3">
          <dt className="w-14 shrink-0 text-ink-soft/60">时间</dt>
          <dd className="text-ink-soft">{dateText}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-14 shrink-0 text-ink-soft/60">地点</dt>
          <dd className="text-ink-soft">
            {resolveLocalized(event.location.place) || `${event.location.lng}, ${event.location.lat}`}
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-14 shrink-0 text-ink-soft/60">主体</dt>
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
                {resolveLocalized(entity.name)}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      <p className="mt-4 border-l-2 border-cinnabar/40 pl-3 text-sm leading-7 text-ink">
        {resolveLocalized(event.summary)}
      </p>

      {description.length > 0 ? (
        <div className="mt-4 space-y-3 text-sm leading-7 text-ink-soft">
          {description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      {event.images && event.images.length > 0 ? (
        <div className="mt-5 grid gap-2">
          {event.images.map((image) => (
            <figure key={image.src}>
              <img
                src={image.src}
                alt={resolveLocalized(image.caption)}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full rounded-lg border border-ink/10"
              />
              {image.caption ? (
                <figcaption className="mt-1 text-[11px] text-ink-soft/70">
                  {resolveLocalized(image.caption)}
                  {image.credit ? ` · ${image.credit}` : ''}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}

      {related.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-xs tracking-[0.2em] text-ink-soft/60">关联事件</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {related.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectEvent(item.id)}
                className="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
              >
                {resolveLocalized(item.name)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {event.sources && event.sources.length > 0 ? (
        <div className="mt-5 border-t border-ink/10 pt-4">
          <h3 className="text-xs tracking-[0.2em] text-ink-soft/60">史料来源</h3>
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
