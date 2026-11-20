import type { AtlasRegion, LocalizedString } from './types';
import { resolveLocalized } from './i18n/localized';
import type { Locale } from './i18n/locale';

export interface RegionTreeNode {
  region: AtlasRegion;
  children: RegionTreeNode[];
}

export interface RegionOption {
  id: string;
  name: string;
  shortName: string;
  level: AtlasRegion['level'];
  parentId: string | null;
  depth: number;
  modernName?: string;
}

export function buildRegionTree(regions: AtlasRegion[]): RegionTreeNode[] {
  const nodes = new Map<string, RegionTreeNode>();
  for (const region of regions) {
    nodes.set(region.id, { region, children: [] });
  }
  const roots: RegionTreeNode[] = [];
  for (const region of regions) {
    const node = nodes.get(region.id)!;
    if (region.parentId && nodes.has(region.parentId)) {
      nodes.get(region.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  const sort = (list: RegionTreeNode[]) => {
    list.sort((a, b) => (a.region.name ? 0 : 1) - (b.region.name ? 0 : 1));
    for (const node of list) sort(node.children);
  };
  sort(roots);
  return roots;
}

export function regionName(region: AtlasRegion, locale: Locale): string {
  return resolveLocalized(region.name, locale);
}

export function regionShortName(region: AtlasRegion, locale: Locale): string {
  return resolveLocalized(region.shortName ?? region.name, locale);
}

/** 返回从一级地区到该地区的名称路径 */
export function regionPath(
  regionsById: ReadonlyMap<string, AtlasRegion>,
  ids: readonly string[],
  locale: Locale,
): string[] {
  return ids
    .map((id) => regionsById.get(id))
    .filter((region): region is AtlasRegion => Boolean(region))
    .map((region) => regionName(region, locale));
}

export function regionAncestors(
  regionsById: ReadonlyMap<string, AtlasRegion>,
  id: string,
): AtlasRegion[] {
  const result: AtlasRegion[] = [];
  const seen = new Set<string>();
  let current = regionsById.get(id);
  while (current && !seen.has(current.id)) {
    result.unshift(current);
    seen.add(current.id);
    current = current.parentId ? regionsById.get(current.parentId) : undefined;
  }
  return result;
}

/** 选中集合为空表示不过滤；否则事件/路线只要命中任一地区即保留 */
export function matchesRegionFilter(
  regionIds: readonly string[] | undefined,
  selected: readonly string[],
): boolean {
  if (selected.length === 0) return true;
  if (!regionIds || regionIds.length === 0) return false;
  const set = new Set(regionIds);
  return selected.some((id) => set.has(id));
}

/** 把一个地区的祖先链展开，便于“选省看县”时反向匹配 */
export function expandRegionSelection(
  regionsById: ReadonlyMap<string, AtlasRegion>,
  selected: readonly string[],
): Set<string> {
  const result = new Set<string>();
  for (const id of selected) {
    for (const region of regionAncestors(regionsById, id)) {
      result.add(region.id);
    }
  }
  return result;
}

/**
 * 只保留最具体的选区：同时选中省和县时，省的 id 会被县覆盖。
 * 这样按县筛选不会因为事件同时带有省 id 而退化成按省筛选。
 */
export function normalizeRegionSelection(
  regionsById: ReadonlyMap<string, AtlasRegion>,
  selected: readonly string[],
): string[] {
  const set = new Set(selected ?? []);
  for (const id of selected) {
    for (const ancestor of regionAncestors(regionsById, id)) {
      if (ancestor.id !== id) set.delete(ancestor.id);
    }
  }
  return [...set];
}

export function isRegionDescendant(
  regionsById: ReadonlyMap<string, AtlasRegion>,
  id: string,
  ancestorId: string,
): boolean {
  return regionAncestors(regionsById, id).some((region) => region.id === ancestorId);
}

export function regionOptions(
  regions: AtlasRegion[],
  locale: Locale,
  levels: AtlasRegion['level'][],
): RegionOption[] {
  const levelSet = new Set(levels);
  return regions
    .filter((region) => levelSet.has(region.level))
    .map((region) => ({
      id: region.id,
      name: regionName(region, locale),
      shortName: regionShortName(region, locale),
      level: region.level,
      parentId: region.parentId,
      depth: 0,
      modernName: region.modernName ? resolveLocalized(region.modernName, locale) : undefined,
    }));
}

export function localizedRegionLabel(
  value: LocalizedString | undefined,
  locale: Locale,
): string {
  return value ? resolveLocalized(value, locale) : '';
}
