import {
  buildSearchIndex,
  resolveLocalized,
  searchEvents,
  type SearchHit,
} from '@atlas/shared';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAtlasStore } from '../stores/useAtlasStore';

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-ochre/30 px-0.5 text-ink">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}

export function SearchPage() {
  const datasets = useAtlasStore((state) => state.searchDatasets);
  const loading = useAtlasStore((state) => state.searchLoading);
  const error = useAtlasStore((state) => state.searchError);
  const loadSearchData = useAtlasStore((state) => state.loadSearchData);

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [atlasFilter, setAtlasFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!datasets && !loading) void loadSearchData();
  }, [datasets, loading, loadSearchData]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query.trim()), 200);
    return () => window.clearTimeout(timer);
  }, [query]);

  const index = useMemo(() => (datasets ? buildSearchIndex(datasets) : null), [datasets]);

  const hits = useMemo(() => {
    if (!index || !debounced) return [];
    return searchEvents(debounced, index, {
      atlasId: atlasFilter || undefined,
      limit: 50,
    });
  }, [index, debounced, atlasFilter]);

  const atlases =
    datasets?.map((dataset) => ({
      id: dataset.manifest.id,
      title: resolveLocalized(dataset.manifest.title),
    })) ?? [];

  const openHit = (hit: SearchHit) => {
    const params = new URLSearchParams({ t: hit.event.date, event: hit.event.id });
    navigate(`/atlas/${hit.atlasId}?${params.toString()}`);
  };

  return (
    <div className="min-h-full bg-parchment">
      <header className="border-b border-ink/10 bg-parchment/90">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
            >
              ← 专题
            </Link>
            <p className="text-xs tracking-[0.3em] text-cinnabar">OPENCHRONICLE ATLAS</p>
          </div>

          <h1 className="mt-6 font-serif text-3xl font-semibold tracking-wider text-ink">
            检索
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            按事件名、地名、类型或日期查找，点击结果直接跳到对应时间点。
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="例如：遵义、贵州、1935"
              aria-label="搜索事件"
              autoFocus
              className="flex-1 rounded-xl border border-ink/15 bg-parchment px-4 py-3 text-sm text-ink shadow-sm placeholder:text-ink-soft/40 focus:border-cinnabar/50 focus:outline-none focus:ring-2 focus:ring-cinnabar/10"
            />
            <select
              value={atlasFilter}
              onChange={(event) => setAtlasFilter(event.target.value)}
              aria-label="按专题筛选"
              className="rounded-xl border border-ink/15 bg-parchment px-3 py-3 text-sm text-ink-soft focus:border-cinnabar/50 focus:outline-none"
            >
              <option value="">全部专题</option>
              {atlases.map((atlas) => (
                <option key={atlas.id} value={atlas.id}>
                  {atlas.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        {loading && !datasets ? (
          <div className="space-y-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-xl border border-ink/10 bg-parchment-deep/50"
              />
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-cinnabar/30 bg-cinnabar/5 p-6">
            <h2 className="font-serif text-lg text-cinnabar">搜索数据加载失败</h2>
            <p className="mt-2 break-words text-sm leading-6 text-ink-soft">{error}</p>
            <button
              type="button"
              onClick={() => void loadSearchData()}
              className="mt-4 rounded-full border border-cinnabar/40 px-4 py-2 text-sm text-cinnabar transition hover:bg-cinnabar hover:text-parchment"
            >
              重试
            </button>
          </div>
        ) : null}

        {!error && debounced ? (
          <p className="mb-3 text-xs text-ink-soft/70">
            找到 <span className="font-medium text-ink">{hits.length}</span> 条结果
          </p>
        ) : null}

        {!error && !debounced ? (
          <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center">
            <p className="font-serif text-lg text-ink">输入关键词开始检索</p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              支持事件名、地名、类型与日期，例如「遵义」「贵州」「1935」「重要会议」。
            </p>
          </div>
        ) : null}

        {!error && debounced && hits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center">
            <p className="font-serif text-lg text-ink">没有找到匹配事件</p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              试试更短的关键词，或切换到「全部专题」。
            </p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mt-4 rounded-full border border-ink/15 px-4 py-2 text-sm text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
            >
              清空搜索
            </button>
          </div>
        ) : null}

        <div className="space-y-3">
          {hits.map((hit) => (
            <button
              key={`${hit.atlasId}:${hit.event.id}`}
              type="button"
              onClick={() => openHit(hit)}
              className="block w-full rounded-xl border border-ink/10 bg-parchment p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-cinnabar/30 hover:shadow-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinnabar"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-serif text-base font-semibold text-ink">
                  <Highlight text={resolveLocalized(hit.event.name)} query={debounced} />
                </span>
                <span className="shrink-0 text-[11px] tabular-nums text-ink-soft/60">
                  {hit.event.date}
                </span>
              </div>

              <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-ink-soft">
                <Highlight text={hit.snippet} query={debounced} />
              </p>

              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-ink-soft/60">
                <span>{hit.atlasTitle}</span>
                <span>{hit.event.category}</span>
                {resolveLocalized(hit.event.location.place) ? (
                  <span>{resolveLocalized(hit.event.location.place)}</span>
                ) : null}
              </div>
            </button>
          ))}
        </div>

        {!error && debounced ? (
          <p className="mt-8 text-center text-[11px] leading-5 text-ink-soft/50">
            M3 检索为子串匹配，暂不支持拼音与分词。
          </p>
        ) : null}
      </main>
    </div>
  );
}
