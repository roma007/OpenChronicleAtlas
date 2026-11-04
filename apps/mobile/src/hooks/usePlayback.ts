import { advancePlayback } from '@atlas/shared';
import { useEffect } from 'react';
import { useAtlasStore } from '../stores/useAtlasStore';

const now = () => globalThis.performance?.now?.() ?? Date.now();

export function usePlayback() {
  const playing = useAtlasStore((state) => state.playing);
  const speed = useAtlasStore((state) => state.speed);
  const timeline = useAtlasStore((state) => state.timeline);

  useEffect(() => {
    if (!playing || !timeline) return;

    let frame = 0;
    let last = now();
    let accumulated = 0;

    const tick = () => {
      const current = now();
      accumulated += current - last;
      last = current;

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
}
