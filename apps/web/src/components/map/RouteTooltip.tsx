interface RouteTooltipProps {
  x: number;
  y: number;
  title: string;
  meta: string;
  detail?: string;
}

/** 路线悬停浮签：固定定位，避免被地图视口裁切 */
export function RouteTooltip({ x, y, title, meta, detail }: RouteTooltipProps) {
  return (
    <div
      role="tooltip"
      className="pointer-events-none fixed z-40 max-w-[16rem] rounded-lg border border-cinnabar/25 bg-parchment/95 px-2.5 py-1.5 shadow-panel backdrop-blur"
      style={{ left: x + 14, top: y + 12 }}
    >
      <p className="font-serif text-[12px] font-semibold leading-5 text-ink">{title}</p>
      <p className="text-[10px] leading-4 text-ink-soft">{meta}</p>
      {detail ? (
        <p className="text-[10px] leading-4 text-ink-soft/70">{detail}</p>
      ) : null}
    </div>
  );
}
