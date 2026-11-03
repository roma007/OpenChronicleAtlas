import type { AtlasTime } from '../types';
import type { PlaybackStep, Timeline } from './types';

export const DEFAULT_PLAYBACK_DURATION_MS = 60_000;

/**
 * 按真实经过时间推进播放。
 * 返回的时间保留亚日精度，避免每帧 snap 到日边界后无法前进。
 * @param deltaMs 距上一帧的真实毫秒
 * @param speed 0.5 / 1 / 2 / 4
 * @param durationMs 1x 下走完整条时间轴所需毫秒
 */
export function advancePlayback(
  current: AtlasTime,
  deltaMs: number,
  timeline: Timeline,
  speed: number,
  durationMs = DEFAULT_PLAYBACK_DURATION_MS,
): PlaybackStep {
  if (timeline.totalMs <= 0) {
    return { time: timeline.start, ended: true };
  }

  const safeDelta = Math.max(0, deltaMs);
  const timeDelta = (safeDelta / durationMs) * timeline.totalMs * speed;
  const next = current + timeDelta;

  if (next >= timeline.end) {
    return { time: timeline.end, ended: true };
  }

  return { time: Math.max(timeline.start, next), ended: false };
}
