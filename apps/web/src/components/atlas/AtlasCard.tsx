import { resolveLocalized, type AtlasSummary } from '@atlas/shared';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { dataUrl } from '../../data/client';
import { useI18n } from '../../hooks/useI18n';

export type CoverMaskMode = 'full' | 'local' | 'glass' | 'outline';

function clampAlpha(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function scrimGradient(max: number): string {
  const a = clampAlpha(max);
  return `linear-gradient(90deg, rgba(243,234,217,${a}) 0%, rgba(243,234,217,${a * 0.95}) 32%, rgba(243,234,217,${a * 0.72}) 52%, rgba(243,234,217,${a * 0.26}) 72%, rgba(243,234,217,0) 90%)`;
}

function localGradient(max: number): string {
  const a = clampAlpha(max);
  return `radial-gradient(115% 125% at 9% 34%, rgba(243,234,217,${a}) 0%, rgba(243,234,217,${a * 0.9}) 40%, rgba(243,234,217,${a * 0.45}) 62%, rgba(243,234,217,0) 82%)`;
}

const SUB_SCALE = 'var(--cover-sub-scale, 1)';

function subSize(value: string): string {
  return `calc(${value} * ${SUB_SCALE})`;
}

function subGap(value: string): string {
  return `calc(${value} * ${SUB_SCALE})`;
}

const SOFT_SHADOW =
  '0 1px 2px rgba(243,234,217,0.95), 0 0 10px rgba(243,234,217,0.85)';
const STRONG_SHADOW =
  '0 1px 1px rgba(243,234,217,1), 0 0 3px rgba(243,234,217,1), 0 0 8px rgba(243,234,217,0.95), 0 0 16px rgba(243,234,217,0.8)';

export function AtlasCard({
  atlas,
  scrimOpacity = 0.97,
  subScale = 1,
  maskMode = 'full',
}: {
  atlas: AtlasSummary;
  scrimOpacity?: number;
  subScale?: number;
  maskMode?: CoverMaskMode;
}) {
  const { locale, t } = useI18n();
  const title = resolveLocalized(atlas.title, locale);
  const coverText = atlas.coverText;
  const detailed = Boolean(coverText?.enTitle);
  const titleLength = title.length;
  const detailedTitleSize =
    titleLength >= 7
      ? 'text-[clamp(18px,7cqw,34px)]'
      : titleLength >= 5
        ? 'text-[clamp(20px,8cqw,38px)]'
        : 'text-[clamp(22px,8.6cqw,40px)]';
  const simpleTitleSize =
    titleLength >= 5 ? 'text-[clamp(22px,8.4cqw,42px)]' : 'text-[clamp(26px,9.4cqw,46px)]';
  const note = locale === 'en' ? coverText?.noteEn : coverText?.note;
  const textShadow = maskMode === 'outline' ? STRONG_SHADOW : SOFT_SHADOW;



  return (
    <Link
      to={`/atlas/${atlas.id}`}
      aria-label={title}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-parchment shadow-sm transition hover:-translate-y-1 hover:border-cinnabar/30 hover:shadow-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinnabar"
    >
      <div
        className="relative aspect-[16/9] overflow-hidden bg-parchment-deep [container-type:inline-size]"
        style={{ '--cover-sub-scale': subScale } as CSSProperties}
      >
        {atlas.cover ? (
          <img
            src={dataUrl(atlas.cover)}
            alt={t('card.coverAlt', { title })}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center font-serif text-4xl text-ink/20">
            {title.slice(0, 1)}
          </div>
        )}

        {coverText ? (
          <>
            {maskMode === 'full' ? (
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: scrimGradient(scrimOpacity) }}
              />
            ) : null}
            {maskMode === 'local' ? (
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: localGradient(scrimOpacity) }}
              />
            ) : null}
            {maskMode === 'glass' ? (
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-[56%]"
                style={{
                  background: `rgba(243,234,217,${clampAlpha(scrimOpacity) * 0.18})`,
                  backdropFilter: 'blur(10px) saturate(1.04)',
                  WebkitBackdropFilter: 'blur(10px) saturate(1.04)',
                  WebkitMaskImage: 'linear-gradient(90deg, black 72%, transparent 100%)',
                  maskImage: 'linear-gradient(90deg, black 72%, transparent 100%)',
                }}
              />
            ) : null}

            {detailed ? (
              <>
                <div
                  className="absolute left-[6.9cqw] right-[14cqw] top-[8.6cqw]"
                  style={{ textShadow }}
                >
                  <h3
                    className={`font-serif ${detailedTitleSize} whitespace-nowrap font-semibold leading-none tracking-wide text-ink`}
                  >
                    {title}
                  </h3>
                  <p
                    className="font-serif font-semibold tracking-[0.14em] text-ink-soft"
                    style={{
                      marginTop: subGap('1.6cqw'),
                      fontSize: subSize('clamp(9px,2.15cqw,13px)'),
                    }}
                  >
                    {coverText.enTitle} · {coverText.years}
                  </p>
                  {coverText.keywords ? (
                    <p
                      className="font-semibold leading-snug text-ink-soft"
                      style={{
                        marginTop: subGap('2.2cqw'),
                        fontSize: subSize('clamp(9.5px,1.75cqw,12px)'),
                      }}
                    >
                      {coverText.keywords}
                    </p>
                  ) : null}
                  {coverText.keywordsEn ? (
                    <p
                      className="font-serif font-semibold leading-snug text-ink-soft/75"
                      style={{
                        marginTop: subGap('1.1cqw'),
                        fontSize: subSize('clamp(8.5px,1.35cqw,11px)'),
                      }}
                    >
                      {coverText.keywordsEn}
                    </p>
                  ) : null}
                </div>
                <p
                  className="absolute bottom-[6.4cqw] left-[6.9cqw] font-serif font-semibold tracking-[0.1em] text-ink-soft/85"
                  style={{ fontSize: subSize('clamp(8.5px,1.15cqw,11px)'), textShadow }}
                >
                  OPENCHRONICLE ATLAS · 史迹 · 时空地图
                </p>
              </>
            ) : (
              <>
                <div
                  className="absolute left-[6.9cqw] right-[18cqw] top-[8.6cqw]"
                  style={{ textShadow }}
                >
                  <h3
                    className={`font-serif ${simpleTitleSize} whitespace-nowrap font-semibold leading-none tracking-wide text-ink`}
                  >
                    {title}
                  </h3>
                  <p
                    className="font-serif font-semibold tracking-[0.18em] text-ink-soft"
                    style={{
                      marginTop: subGap('1.8cqw'),
                      fontSize: subSize('clamp(10px,2.5cqw,15px)'),
                    }}
                  >
                    {coverText.years}
                  </p>
                  <p
                    className="font-semibold text-ink-soft"
                    style={{
                      marginTop: subGap('2.2cqw'),
                      fontSize: subSize('clamp(8.5px,1.45cqw,12px)'),
                    }}
                  >
                    <span className="font-serif">{coverText.brand}</span>
                    <span className="font-serif tracking-[0.08em]"> · OpenChronicle Atlas</span>
                  </p>
                </div>
                <div className="pointer-events-none absolute bottom-[10.4cqw] left-[6.9cqw] right-[10cqw] h-px bg-ink/15" />
                {note ? (
                  <p
                    className="absolute bottom-[6.2cqw] left-[6.9cqw] font-serif font-semibold text-ink-soft/80"
                    style={{ fontSize: subSize('clamp(8px,1.15cqw,10px)'), textShadow }}
                  >
                    {note}
                  </p>
                ) : null}
              </>
            )}
          </>
        ) : null}
      </div>
    </Link>
  );
}
