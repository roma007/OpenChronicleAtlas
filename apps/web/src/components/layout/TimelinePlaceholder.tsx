interface TimelinePlaceholderProps {
  start: string;
  end: string;
}

/** M1 占位：M2 替换为可拖动/播放的通用时间轴。 */
export function TimelinePlaceholder({ start, end }: TimelinePlaceholderProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3 pb-3 md:px-6 md:pb-5">
      <div className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-ink/10 bg-parchment/95 px-4 py-3 shadow-panel backdrop-blur">
        <div className="flex items-center justify-between text-[11px] tabular-nums text-ink-soft">
          <span>{start}</span>
          <span className="tracking-[0.2em] text-cinnabar/80">时间轴 · M2</span>
          <span>{end}</span>
        </div>
        <div className="relative mt-2 h-1.5 rounded-full bg-ink/15" aria-hidden>
          <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-cinnabar/50" />
          <div className="absolute -top-1 left-1/3 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-parchment bg-cinnabar shadow" />
        </div>
        <p className="mt-2 text-center text-[10px] text-ink-soft/70">
          拖动、播放与倍速将在 M2 上线
        </p>
      </div>
    </div>
  );
}
