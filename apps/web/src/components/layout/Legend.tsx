import { resolveLocalized } from '@atlas/shared';
import { useAtlasStore } from '../../stores/useAtlasStore';

export function Legend() {
  const dataset = useAtlasStore((state) => state.dataset);
  const activeEntityIds = useAtlasStore((state) => state.activeEntityIds);
  const toggleEntity = useAtlasStore((state) => state.toggleEntity);

  if (!dataset) return null;

  const entities = [...dataset.manifest.entities].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  return (
    <section
      aria-label="路线图层"
      className="absolute left-4 top-24 z-20 hidden w-64 rounded-2xl border border-ink/10 bg-parchment/95 p-4 shadow-panel backdrop-blur md:block"
    >
      <h2 className="font-serif text-sm tracking-[0.2em] text-ink">路线图层</h2>
      <ul className="mt-3 space-y-1">
        {entities.map((entity) => {
          const active = activeEntityIds.has(entity.id);
          const segments = dataset.routes.filter(
            (route) => route.properties.entityId === entity.id,
          ).length;

          return (
            <li key={entity.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => toggleEntity(entity.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition ${
                  active ? 'text-ink hover:bg-ink/5' : 'text-ink/40 hover:bg-ink/5'
                }`}
              >
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-parchment"
                  style={{
                    backgroundColor: entity.color,
                    opacity: active ? 1 : 0.35,
                  }}
                />
                <span className="flex-1 truncate">{resolveLocalized(entity.name)}</span>
                <span className="text-[10px] tabular-nums text-ink-soft/70">
                  {segments > 0 ? `${segments} 段` : '—'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 border-t border-ink/10 pt-3 text-[11px] leading-5 text-ink-soft/70">
        点击显示或隐藏该主体的路线与节点。
      </p>
    </section>
  );
}
