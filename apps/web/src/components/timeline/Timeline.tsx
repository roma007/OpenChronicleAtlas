import {
  MAX_TIMELINE_ZOOM,
  applyEventFilters,
  centerViewportStart,
  createViewport,
  eventStart,
  formatDate,
  generateTicks,
  latestEventAt,
  parseDateString,
  ratioToTime,
  resolveLocalized,
  timelineEventMarkers,
  timeToRatio,
  toDateString,
} from '@atlas/shared';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePlayback } from '../../hooks/usePlayback';
import { useI18n } from '../../hooks/useI18n';
import { useAtlasStore, type PlaybackSpeed } from '../../stores/useAtlasStore';

const SPEEDS: PlaybackSpeed[] = [0.5, 1, 2, 4];

export function Timeline() {
  const dataset = useAtlasStore((state) => state.dataset);
  const timeline = useAtlasStore((state) => state.timeline);
  const currentTime = useAtlasStore((state) => state.currentTime);
  const playing = useAtlasStore((state) => state.playing);
  const speed = useAtlasStore((state) => state.speed);
  const activeEntityIds = useAtlasStore((state) => state.activeEntityIds);
  const filters = useAtlasStore((state) => state.filters);
  const selectEvent = useAtlasStore((state) => state.selectEvent);
  const togglePlay = useAtlasStore((state) => state.togglePlay);
  const pause = useAtlasStore((state) => state.pause);
  const setSpeed = useAtlasStore((state) => state.setSpeed);
  const stepDays = useAtlasStore((state) => state.stepDays);
  const setCurrentTime = useAtlasStore((state) => state.setCurrentTime);

  usePlayback();
  const { locale, t, dateLocale } = useI18n();

  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [viewStart, setViewStart] = useState<number | null>(null);

  useEffect(() => {
    const element = trackRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      setTrackWidth(entries[0]?.contentRect.width ?? 0);
    });
    observer.observe(element);
    setTrackWidth(element.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, [timeline]);

  useEffect(() => {
    setZoomLevel(0);
    setViewStart(null);
  }, [timeline]);

  const viewport = useMemo(
    () => (timeline ? createViewport(timeline, zoomLevel, viewStart) : null),
    [timeline, zoomLevel, viewStart],
  );

  useEffect(() => {
    if (!timeline || !viewport || viewStart === null) return;
    if (currentTime >= viewport.start && currentTime <= viewport.end) return;
    setViewStart(centerViewportStart(timeline, zoomLevel, currentTime));
  }, [currentTime, timeline, viewport, viewStart, zoomLevel]);

  const changeZoom = (delta: number) => {
    if (!timeline) return;
    const nextLevel = Math.min(
      MAX_TIMELINE_ZOOM,
      Math.max(0, zoomLevel + delta),
    );
    if (nextLevel === zoomLevel) return;
    setZoomLevel(nextLevel);
    setViewStart(centerViewportStart(timeline, nextLevel, currentTime));
  };

  const ticks = useMemo(() => {
    if (!viewport) return [];
    const width = trackWidth || 800;
    return generateTicks(viewport, width, {
      minLabelPx: width < 640 ? 56 : 72,
    });
  }, [viewport, trackWidth]);

  const currentEvent = useMemo(() => {
    if (!dataset) return undefined;
    const activeEvents = dataset.events.filter((event) =>
      event.entityIds.some((id) => activeEntityIds.has(id)),
    );
    return latestEventAt(activeEvents, currentTime);
  }, [dataset, activeEntityIds, currentTime]);

  const markers = useMemo(() => {
    if (!dataset || !viewport) return [];
    const events = applyEventFilters(dataset.events, filters).filter((event) =>
      event.entityIds.some((id) => activeEntityIds.has(id)),
    );
    return timelineEventMarkers(events, viewport).filter(
      (marker) => marker.ratio >= 0 && marker.ratio <= 1,
    );
  }, [dataset, filters, activeEntityIds, viewport]);

  if (!dataset || !timeline) return null;

  const ratio = viewport ? timeToRatio(currentTime, viewport) : 0;
  const dateValue = toDateString(currentTime);

  const seekFromClientX = (clientX: number) => {
    const element = trackRef.current;
    if (!element || !viewport) return;
    const rect = element.getBoundingClientRect();
    if (rect.width === 0) return;
    setCurrentTime(ratioToTime((clientX - rect.left) / rect.width, viewport));
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    pause();
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    seekFromClientX(event.clientX);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    seekFromClientX(event.clientX);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const days = event.shiftKey ? 7 : 1;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        stepDays(-days);
        break;
      case 'ArrowRight':
        event.preventDefault();
        stepDays(days);
        break;
      case 'PageUp':
        event.preventDefault();
        stepDays(30);
        break;
      case 'PageDown':
        event.preventDefault();
        stepDays(-30);
        break;
      case 'Home':
        event.preventDefault();
        pause();
        setCurrentTime(timeline.start);
        break;
      case 'End':
        event.preventDefault();
        pause();
        setCurrentTime(timeline.end);
        break;
      case ' ':
      case 'Spacebar':
        event.preventDefault();
        togglePlay();
        break;
      default:
        break;
    }
  };

  const handleDateChange = (value: string) => {
    if (!value) return;
    try {
      pause();
      setCurrentTime(parseDateString(value));
    } catch {
      // 浏览器日期输入非法时忽略
    }
  };

  return (
    <section
      aria-label={t('timeline.label')}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3 pb-3 md:px-6 md:pb-5"
    >
      <div className="pointer-events-auto mx-auto max-w-4xl rounded-2xl border border-ink/10 bg-parchment/95 px-3 py-3 shadow-panel backdrop-blur md:px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? t('timeline.pause') : t('timeline.play')}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cinnabar text-parchment shadow-sm transition hover:bg-cinnabar/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinnabar"
          >
            <span aria-hidden className="text-[13px] leading-none">
              {playing ? '❚❚' : '▶'}
            </span>
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2 text-[11px]">
              <span className="shrink-0 font-medium tabular-nums text-ink">
                {formatDate(currentTime, dateLocale)}
              </span>
              <span className="truncate text-ink-soft/70">
                {currentEvent ? resolveLocalized(currentEvent.name, locale) : t('timeline.hint')}
              </span>
              <span className="hidden shrink-0 tabular-nums text-ink-soft/60 sm:inline">
                {formatDate(viewport?.end ?? timeline.end, dateLocale)}
              </span>
            </div>

            <div className="relative mt-1 h-4">
              {markers
                .filter((marker) => marker.endRatio > marker.ratio)
                .map((marker) => {
                  const active = marker.event.id === currentEvent?.id;
                  const past = eventStart(marker.event) <= currentTime;
                  return (
                    <div
                      key={`bar-${marker.event.id}`}
                      aria-hidden
                      className={`absolute top-1/2 h-1 -translate-y-1/2 rounded-full ${
                        active
                          ? 'bg-cinnabar/40'
                          : past
                            ? 'bg-cinnabar/20'
                            : 'bg-ink/10'
                      }`}
                      style={{
                        left: `${marker.ratio * 100}%`,
                        width: `${Math.max(0.2, (marker.endRatio - marker.ratio) * 100)}%`,
                      }}
                    />
                  );
                })}
              {markers.map((marker) => {
                const active = marker.event.id === currentEvent?.id;
                const past = eventStart(marker.event) <= currentTime;
                return (
                  <button
                    key={marker.event.id}
                    type="button"
                    aria-label={`${resolveLocalized(marker.event.name, locale)}，${formatDate(
                      eventStart(marker.event),
                      dateLocale,
                    )}`}
                    title={resolveLocalized(marker.event.name, locale)}
                    onClick={() => {
                      pause();
                      setCurrentTime(eventStart(marker.event));
                      selectEvent(marker.event.id);
                    }}
                    className={`absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinnabar ${
                      active
                        ? 'z-10 scale-150 bg-cinnabar ring-2 ring-cinnabar/20'
                        : past
                          ? 'bg-cinnabar/70 hover:scale-125'
                          : 'bg-ink/25 hover:bg-cinnabar/50'
                    }`}
                    style={{ left: `${marker.ratio * 100}%` }}
                  />
                );
              })}
            </div>

            <div
              ref={trackRef}
              role="slider"
              tabIndex={0}
              aria-label={t('timeline.label')}
              aria-valuemin={viewport?.start ?? timeline.start}
              aria-valuemax={viewport?.end ?? timeline.end}
              aria-valuenow={currentTime}
              aria-valuetext={formatDate(currentTime, dateLocale)}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onKeyDown={handleKeyDown}
              className="relative mt-1 h-10 cursor-pointer touch-none select-none rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinnabar"
            >
              <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink/15" />
              <div
                className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-cinnabar/60"
                style={{ width: `${ratio * 100}%` }}
              />

              {ticks.map((tick) => (
                <div
                  key={tick.time}
                  className="pointer-events-none absolute top-1/2 h-3 -translate-y-1/2"
                  style={{ left: `${tick.ratio * 100}%` }}
                >
                  <span
                    className={`block w-px ${
                      tick.major ? 'h-3 bg-ink/40' : 'h-1.5 bg-ink/20'
                    }`}
                  />
                  {tick.major ? (
                    <span className="absolute bottom-full left-0 -translate-x-1/2 whitespace-nowrap pb-1 text-[10px] leading-none text-ink-soft/70">
                      {tick.label}
                    </span>
                  ) : null}
                </div>
              ))}

              <div
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-parchment bg-cinnabar shadow"
                style={{ left: `${ratio * 100}%` }}
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label={t('timeline.zoomOut')}
              disabled={zoomLevel === 0}
              onClick={() => changeZoom(-1)}
              className="grid h-7 w-7 place-items-center rounded-full border border-ink/15 text-sm text-ink-soft transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-35"
            >
              −
            </button>
            <span className="w-8 text-center text-[10px] tabular-nums text-ink-soft/70">
              {zoomLevel === 0 ? t('timeline.zoomAll') : `${2 ** zoomLevel}×`}
            </span>
            <button
              type="button"
              aria-label={t('timeline.zoomIn')}
              disabled={zoomLevel === 8}
              onClick={() => changeZoom(1)}
              className="grid h-7 w-7 place-items-center rounded-full border border-ink/15 text-sm text-ink-soft transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-35"
            >
              +
            </button>
          </div>

          <div className="hidden shrink-0 items-center gap-1 sm:flex">
            {SPEEDS.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={speed === value}
                onClick={() => setSpeed(value)}
                className={`rounded-full px-2 py-1 text-[11px] tabular-nums transition ${
                  speed === value
                    ? 'bg-cinnabar text-parchment'
                    : 'text-ink-soft hover:bg-ink/5'
                }`}
              >
                {value}x
              </button>
            ))}
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-[10px] tabular-nums text-ink-soft/60">
            {formatDate(viewport?.start ?? timeline.start, dateLocale)}
          </span>

          <div className="flex items-center gap-1 sm:hidden">
            {SPEEDS.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={speed === value}
                onClick={() => setSpeed(value)}
                className={`rounded-full px-2 py-1 text-[10px] tabular-nums transition ${
                  speed === value
                    ? 'bg-cinnabar text-parchment'
                    : 'text-ink-soft hover:bg-ink/5'
                }`}
              >
                {value}x
              </button>
            ))}
          </div>

          <input
            type="date"
            aria-label={t('timeline.jumpToDate')}
            min={toDateString(timeline.start)}
            max={toDateString(timeline.end)}
            value={dateValue}
            onChange={(event) => handleDateChange(event.target.value)}
            className="hidden rounded-md border border-ink/15 bg-parchment px-2 py-1 text-[11px] text-ink-soft focus:border-cinnabar/50 focus:outline-none md:block"
          />
        </div>
      </div>
    </section>
  );
}
