import type { AtlasTime } from '../types';
import { timeToRatio } from './core';
import type { Tick, TickUnit, Timeline } from './types';

const STEP_CANDIDATES: Record<TickUnit, number[]> = {
  // 千年以上的专题（如京杭大运河 605—1901）必须有百年级步长，
  // 否则所有候选都超过 maxTicks，会退化成 47 万个日刻度。
  year: [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000],
  month: [1, 3, 6, 12],
  day: [1, 2, 5, 10, 30, 90],
};

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function startOfMonth(time: AtlasTime): AtlasTime {
  const date = new Date(time);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
}

function addMonths(time: AtlasTime, months: number): AtlasTime {
  const date = new Date(time);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1);
}

function boundaries(
  timeline: Timeline,
  unit: TickUnit,
  step: number,
  limit = Number.POSITIVE_INFINITY,
): AtlasTime[] {
  const result: AtlasTime[] = [];
  const overLimit = () => result.length > limit;

  if (unit === 'year') {
    const startYear = new Date(timeline.start).getUTCFullYear();
    const endYear = new Date(timeline.end).getUTCFullYear();
    for (let year = startYear; year <= endYear; year += step) {
      const time = Date.UTC(year, 0, 1);
      if (time >= timeline.start && time <= timeline.end) result.push(time);
      if (overLimit()) break;
    }
    return result;
  }

  if (unit === 'month') {
    let cursor = startOfMonth(timeline.start);
    while (cursor <= timeline.end) {
      if (cursor >= timeline.start) result.push(cursor);
      if (overLimit()) break;
      cursor = addMonths(cursor, step);
    }
    return result;
  }

  const day = 86_400_000;
  let cursor = timeline.start;
  while (cursor <= timeline.end) {
    result.push(cursor);
    if (overLimit()) break;
    cursor += step * day;
  }
  return result;
}

function labelFor(time: AtlasTime, unit: TickUnit, timeline: Timeline): string {
  const date = new Date(time);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  if (unit === 'year') return String(year);
  if (unit === 'month') return `${year}-${pad(month)}`;

  const spansYears =
    new Date(timeline.start).getUTCFullYear() !== new Date(timeline.end).getUTCFullYear();
  return spansYears ? `${year}-${pad(month)}-${pad(day)}` : `${pad(month)}-${pad(day)}`;
}

interface Candidate {
  unit: TickUnit;
  step: number;
  times: AtlasTime[];
}

export interface GenerateTicksOptions {
  /** 两个标签之间至少占用的像素，默认 72 */
  minLabelPx?: number;
  /** 目标刻度数上限，默认 12 */
  maxTicks?: number;
}

/**
 * 按时间跨度与可用宽度选择年/月/日刻度。
 * 优先选择「不超过目标数量且数量最多」的候选，数量相同时优先大单位。
 */
export function generateTicks(
  timeline: Timeline,
  widthPx: number,
  options: GenerateTicksOptions = {},
): Tick[] {
  const minLabelPx = options.minLabelPx ?? 72;
  const maxTicks = options.maxTicks ?? 12;
  const target = Math.max(2, Math.min(maxTicks, Math.floor(widthPx / minLabelPx) || 2));

  const units: TickUnit[] = ['year', 'month', 'day'];
  const candidates: Candidate[] = [];

  for (const unit of units) {
    for (const step of STEP_CANDIDATES[unit]) {
      // 只生成到 target + 1 个边界即可判断是否超限，
      // 避免为千年跨度先造出几十万个日刻度。
      const times = boundaries(timeline, unit, step, target + 1);
      if (times.length >= 2 && times.length <= target) {
        candidates.push({ unit, step, times });
      }
    }
  }

  let chosen: Candidate;
  if (candidates.length === 0) {
    // 极端跨度（超过最长年步长）或零跨度：按年回退，绝不退化成日刻度。
    const startYear = new Date(timeline.start).getUTCFullYear();
    const endYear = new Date(timeline.end).getUTCFullYear();
    const spanYears = Math.max(1, endYear - startYear + 1);
    const step =
      STEP_CANDIDATES.year.find((candidate) => Math.ceil(spanYears / candidate) <= maxTicks) ??
      STEP_CANDIDATES.year.at(-1)!;
    chosen = {
      unit: 'year',
      step,
      times: boundaries(timeline, 'year', step, target + 1),
    };
  } else {
    // 数量优先，同时给更粗的单位加权，避免「90 天步长的日刻度」压过月刻度
    const unitWeight: Record<TickUnit, number> = { year: 3, month: 2, day: 1 };
    candidates.sort((a, b) => {
      const scoreA = a.times.length + unitWeight[a.unit];
      const scoreB = b.times.length + unitWeight[b.unit];
      if (scoreB !== scoreA) return scoreB - scoreA;
      return units.indexOf(a.unit) - units.indexOf(b.unit);
    });
    chosen = candidates[0]!;
  }

  const majorEvery = chosen.times.length <= maxTicks ? 1 : 2;

  return chosen.times.map((time, index) => ({
    time,
    ratio: timeToRatio(time, timeline),
    label: labelFor(time, chosen.unit, timeline),
    unit: chosen.unit,
    major: index % majorEvery === 0,
  }));
}
