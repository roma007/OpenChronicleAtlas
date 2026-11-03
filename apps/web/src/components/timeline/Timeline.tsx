import {
  formatDate,
  generateTicks,
  latestEventAt,
  parseDateString,
  resolveLocalized,
  timeToRatio,
  toDateString,
} from '@atlas/shared';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePlayback } from '../../hooks/usePlayback';
import { useAtlasStore, type PlaybackSpeed } from '../../stores/useAtlasStore';

const SPEEDS: PlaybackSpeed[] = [0.5, 1, 2, 4];

export function Timeline() {
  const dataset = useAtlasStore((state) => state.dataset);
  const timeline = useAtlasStore((state) => state.timeline);
  const currentTime = useAtlasStore((state) => state.currentTime);
  const playing = useAtlasStore((state) => state.playing);
  const speed = useAtlasStore((state) => state.speed);
  const activeEntityIds = useAtlasStore((state) => state.activeEntityIds);
  const togglePlay = useAtlasStore((state) => state.togglePlay);
  const pause = useAtlasStore((state) => state.pause);
  const setSpeed = useAtlasStore((state) => state.setSpeed);
  const seekRatio = useAtlasStore((state) => state.seekRatio);
  const stepDays = useAtlasStore((state) => state.stepDays);
  const setCurrentTime = useAtlasStore((state) => state.setCurrentTime);

  usePlayback();

  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [trackWidth, setTrackWidth] = useState(0);

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

  const ticks = useMemo(() => {
    if (!timeline) return [];
    const width = trackWidth || 800;
    return generateTicks(timeline, width, {
      minLabelPx: width < 640 ? 56 : 72,
    });
  }, [timeline, trackWidth]);

  const currentEvent = useMemo(() => {
    if (!dataset) return undefined;
    const activeEvents = dataset.events.filter((event) =>
      event.entityIds.some((id) => activeEntityIds.has(id)),
    );
    return latestEventAt(activeEvents, currentTime);
  }, [dataset, activeEntityIds, currentTime]);

  if (!dataset || !timeline) return null;

  const ratio = timeToRatio(currentTime, timeline);
  const dateValue = toDateString(currentTime);

  const seekFromClientX = (clientX: number) => {
    const element = trackRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    if (rect.width === 0) return;
    seekRatio((clientX - rect.left) / rect.width);
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
      aria-label="专题时间轴"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3 pb-3 md:px-6 md:pb-5"
    >
      <div className="pointer-events-auto mx-auto max-w-4xl rounded-2xl border border-ink/10 bg-parchment/95 px-3 py-3 shadow-panel backdrop-blur md:px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? '暂停' : '播放'}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cinnabar text-parchment shadow-sm transition hover:bg-cinnabar/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinnabar"
          >
            <span aria-hidden className="text-[13px] leading-none">
              {playing ? '❚❚' : '▶'}
            </span>
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2 text-[11px]">
              <span className="shrink-0 font-medium tabular-nums text-ink">
                {formatDate(currentTime, 'zh-CN')}
              </span>
              <span className="truncate text-ink-soft/70">
                {currentEvent ? resolveLocalized(currentEvent.name) : '拖动时间轴或播放'}
              </span>
              <span className="hidden shrink-0 tabular-nums text-ink-soft/60 sm:inline">
                {formatDate(timeline.end, 'zh-CN')}
              </span>
            </div>

            <div
              ref={trackRef}
              role="slider"
              tabIndex={0}
              aria-label="专题时间轴"
              aria-valuemin={timeline.start}
              aria-valuemax={timeline.end}
              aria-valuenow={currentTime}
              aria-valuetext={formatDate(currentTime, 'zh-CN')}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onKeyDown={handleKeyDown}
              className="relative mt-2 h-10 cursor-pointer touch-none select-none rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinnabar"
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
            {formatDate(timeline.start, 'zh-CN')}
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
            aria-label="跳转到日期"
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
