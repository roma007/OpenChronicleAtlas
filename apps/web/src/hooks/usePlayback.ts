import { advancePlayback, applyEventFilters, createPlaybackAnchors, eventStart } from '@atlas/shared';
import { useEffect, useMemo } from 'react';
import { useAtlasStore } from '../stores/useAtlasStore';

/** 播放循环：requestAnimationFrame 驱动，地图更新节流到约 30fps。 */
export function usePlayback() {
  const playing = useAtlasStore((state) => state.playing);
  const speed = useAtlasStore((state) => state.speed);
  const timeline = useAtlasStore((state) => state.timeline);
  const dataset = useAtlasStore((state) => state.dataset);
  const filters = useAtlasStore((state) => state.filters);
  const activeEntityIds = useAtlasStore((state) => state.activeEntityIds);

  // 可见事件的时间点：相邻两个事件之间固定过渡 3 秒，避免长间隔拖太久、短间隔一闪而过
  const anchors = useMemo(() => {
    if (!dataset || !timeline) return undefined;
    const eventTimes = applyEventFilters(dataset.events, filters)
      .filter((event) => event.entityIds.some((id) => activeEntityIds.has(id)))
      .map(eventStart);
    return createPlaybackAnchors(timeline, eventTimes);
  }, [dataset, timeline, filters, activeEntityIds]);

  useEffect(() => {
    if (!playing || !timeline) return;

    let frame = 0;
    let last = performance.now();
    let accumulated = 0;

    const tick = (now: number) => {
      accumulated += now - last;
      last = now;

      if (accumulated >= 33) {
        const state = useAtlasStore.getState();
        const step = advancePlayback(state.currentTime, accumulated, timeline, state.speed, {
          anchors,
        });
        accumulated = 0;
        state.setCurrentTime(step.time);

        if (step.ended) {
          state.pause();
          return;
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, speed, timeline, anchors]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        useAtlasStore.getState().pause();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);
}
