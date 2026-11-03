import type { AtlasTime } from '../types';

export interface Timeline {
  start: AtlasTime;
  end: AtlasTime;
  totalMs: number;
  totalDays: number;
}

export type TickUnit = 'year' | 'month' | 'day';

export interface Tick {
  time: AtlasTime;
  /** 0..1，相对时间轴的位置 */
  ratio: number;
  label: string;
  unit: TickUnit;
  /** 主刻度显示标签；次刻度只显示短线 */
  major: boolean;
}

export interface RouteGeometry {
  coordinates: [number, number][];
  /** 每个顶点的累计长度（米） */
  cumulative: number[];
  totalLength: number;
}

export interface PlaybackStep {
  time: AtlasTime;
  ended: boolean;
}
