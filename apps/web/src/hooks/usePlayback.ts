import { advancePlayback } from '@atlas/shared';
import { useEffect } from 'react';
import { useAtlasStore } from '../stores/useAtlasStore';

/** 播放循环：requestAnimationFrame 驱动，地图更新节流到约 30fps。 */
export function usePlayback() {
  const playing = useAtlasStore((state) => state.playing);
  const speed = useAtlasStore((state) => state.speed);
  const timeline = useAtlasStore((state) => state.timeline);

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
        const step = advancePlayback(state.currentTime, accumulated, timeline, state.speed);
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
  }, [playing, speed, timeline]);

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
