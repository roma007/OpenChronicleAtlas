import { eventStart, formatDate, resolveLocalized } from '@atlas/shared';
import { useAtlasStore } from '../../stores/useAtlasStore';

/** 播放跨过事件时出现的轻量气泡；固定在时间轴上方，避免被地图视口裁切。 */
export function EventBubble() {
  const dataset = useAtlasStore((state) => state.dataset);
  const bubbleEventId = useAtlasStore((state) => state.bubbleEventId);
  const selectEvent = useAtlasStore((state) => state.selectEvent);
  const pause = useAtlasStore((state) => state.pause);
  const setBubbleEvent = useAtlasStore((state) => state.setBubbleEvent);

  const event =
    bubbleEventId && dataset ? dataset.eventsById.get(bubbleEventId) : undefined;

  if (!event) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-40 z-40 flex justify-center px-4 md:bottom-36">
      <div className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border border-cinnabar/20 bg-parchment/95 px-4 py-2.5 shadow-panel backdrop-blur">
        <div className="min-w-0">
          <p className="truncate font-serif text-sm font-semibold text-ink">
            {resolveLocalized(event.name)}
          </p>
          <p className="mt-0.5 text-[10px] tabular-nums text-ink-soft/70">
            {formatDate(eventStart(event), 'zh-CN')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            pause();
            selectEvent(event.id);
            setBubbleEvent(null);
          }}
          className="shrink-0 rounded-full bg-cinnabar px-3 py-1 text-[11px] text-parchment transition hover:bg-cinnabar/90"
        >
          查看详情
        </button>

        <button
          type="button"
          aria-label="关闭事件气泡"
          onClick={() => setBubbleEvent(null)}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink/10 text-xs text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
