import type { AtlasTime } from '../types';
import type { PlaybackStep, Timeline } from './types';

export const DEFAULT_PLAYBACK_DURATION_MS = 60_000;

/** 自动播放时，时间上相邻两个事件之间的过渡时长（1x 下的真实毫秒）。 */
export const EVENT_PLAYBACK_GAP_MS = 3_000;

export interface PlaybackOptions {
  /** 1x 下走完整条时间轴所需毫秒；未提供事件锚点时生效 */
  durationMs?: number;
  /** 由 createPlaybackAnchors 生成的播放锚点，严格升序；提供后相邻锚点之间固定过渡 */
  anchors?: readonly AtlasTime[];
}

/**
 * 把事件时间点整理成播放锚点：排序、去重，并补上时间轴首尾。
 * 返回的数组严格升序，可直接传给 advancePlayback。
 */
export function createPlaybackAnchors(
  timeline: Timeline,
  eventTimes: readonly AtlasTime[],
): AtlasTime[] {
  const middle = Array.from(
    new Set(eventTimes.filter((time) => time > timeline.start && time < timeline.end)),
  ).sort((a, b) => a - b);

  return [timeline.start, ...middle, timeline.end];
}

/**
 * 按真实经过时间推进播放。
 * 返回的时间保留亚日精度，避免每帧 snap 到日边界后无法前进。
 * @param deltaMs 距上一帧的真实毫秒
 * @param speed 0.5 / 1 / 2 / 4
 */
export function advancePlayback(
  current: AtlasTime,
  deltaMs: number,
  timeline: Timeline,
  speed: number,
  options: PlaybackOptions = {},
): PlaybackStep {
  if (timeline.totalMs <= 0) {
    return { time: timeline.start, ended: true };
  }

  // 锚点含首尾，至少要有 1 个事件（长度 > 2）才按事件间隔推进
  if (options.anchors && options.anchors.length > 2) {
    return advanceByAnchors(current, deltaMs, timeline, speed, options.anchors);
  }

  return advanceLinearly(current, deltaMs, timeline, speed, options.durationMs);
}

/** 按整条时间轴均速推进（无事件锚点时的回退行为）。 */
function advanceLinearly(
  current: AtlasTime,
  deltaMs: number,
  timeline: Timeline,
  speed: number,
  durationMs = DEFAULT_PLAYBACK_DURATION_MS,
): PlaybackStep {
  const safeDelta = Math.max(0, deltaMs);
  const timeDelta = durationMs > 0 ? (safeDelta / durationMs) * timeline.totalMs * speed : 0;
  const next = current + timeDelta;

  if (next >= timeline.end) {
    return { time: timeline.end, ended: true };
  }

  return { time: Math.max(timeline.start, next), ended: false };
}

/**
 * 按事件锚点推进：任意相邻两个锚点之间的过渡都固定为 EVENT_PLAYBACK_GAP_MS（1x），
 * 因此时间跨度大的间隔不会拖太久、跨度小的间隔也不会一闪而过。
 */
function advanceByAnchors(
  current: AtlasTime,
  deltaMs: number,
  timeline: Timeline,
  speed: number,
  anchors: readonly AtlasTime[],
): PlaybackStep {
  let time = Math.min(timeline.end, Math.max(timeline.start, current));
  let remaining = Math.max(0, deltaMs) * Math.max(0, speed);

  while (remaining > 0) {
    if (time >= timeline.end) {
      return { time: timeline.end, ended: true };
    }

    // 当前所在的锚点区间：[anchors[index], anchors[index + 1])
    const index = Math.max(0, Math.min(anchors.length - 2, findSegmentIndex(anchors, time)));
    const segmentStart = anchors[index] ?? timeline.start;
    const segmentEnd = anchors[index + 1] ?? timeline.end;
    const span = segmentEnd - segmentStart;

    if (span <= 0) {
      time = segmentEnd;
      continue;
    }

    // 该区间在 1x 下固定播放 EVENT_PLAYBACK_GAP_MS 毫秒
    const timePerMs = span / EVENT_PLAYBACK_GAP_MS;
    const needed = (segmentEnd - time) / timePerMs;

    if (remaining >= needed) {
      remaining -= needed;
      time = segmentEnd;
      continue;
    }

    time += remaining * timePerMs;
    remaining = 0;

    if (time >= timeline.end) {
      return { time: timeline.end, ended: true };
    }
  }

  return { time: Math.max(timeline.start, time), ended: time >= timeline.end };
}

/** 二分查找 time 所在的区间下标：满足 anchors[i] <= time < anchors[i + 1]。 */
function findSegmentIndex(anchors: readonly AtlasTime[], time: AtlasTime): number {
  let low = 0;
  let high = anchors.length - 1;

  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    const anchor = anchors[middle];
    if (anchor !== undefined && anchor <= time) low = middle;
    else high = middle - 1;
  }

  return low;
}
