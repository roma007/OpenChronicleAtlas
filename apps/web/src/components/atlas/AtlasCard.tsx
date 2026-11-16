import { resolveLocalized, tagLabel, type AtlasSummary } from '@atlas/shared';
import { Link } from 'react-router-dom';
import { dataUrl } from '../../data/client';
import { useI18n } from '../../hooks/useI18n';

const SCRIM =
  'linear-gradient(90deg, rgba(243,234,217,0.97) 0%, rgba(243,234,217,0.92) 32%, rgba(243,234,217,0.7) 52%, rgba(243,234,217,0.25) 72%, rgba(243,234,217,0) 90%)';

export function AtlasCard({ atlas }: { atlas: AtlasSummary }) {
  const { locale, t } = useI18n();
  const title = resolveLocalized(atlas.title, locale);
  const subtitle = resolveLocalized(atlas.subtitle, locale);
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

  return (
    <Link
      to={`/atlas/${atlas.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-parchment shadow-sm transition hover:-translate-y-1 hover:border-cinnabar/30 hover:shadow-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinnabar"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-parchment-deep [container-type:inline-size]">
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
            <div className="pointer-events-none absolute inset-0" style={{ background: SCRIM }} />
            {detailed ? (
              <>
                <div className="absolute left-[6.9cqw] right-[14cqw] top-[8.6cqw] [text-shadow:0_1px_2px_rgba(243,234,217,0.95),0_0_10px_rgba(243,234,217,0.85)]">
                  <h3 className={`font-serif ${detailedTitleSize} whitespace-nowrap font-semibold leading-none tracking-wide text-ink`}>
                    {title}
                  </h3>
                  <p className="mt-[1.6cqw] font-serif text-[clamp(9px,2.15cqw,13px)] tracking-[0.14em] text-ink-soft">
                    {coverText.enTitle} · {coverText.years}
                  </p>
                  {coverText.keywords ? (
                    <p className="mt-[2.2cqw] text-[clamp(9.5px,1.75cqw,12px)] leading-snug text-ink-soft">
                      {coverText.keywords}
                    </p>
                  ) : null}
                  {coverText.keywordsEn ? (
                    <p className="mt-[1.1cqw] font-serif text-[clamp(8.5px,1.35cqw,11px)] leading-snug text-ink-soft/75">
                      {coverText.keywordsEn}
                    </p>
                  ) : null}
                </div>
                <p className="absolute bottom-[6.4cqw] left-[6.9cqw] [text-shadow:0_1px_2px_rgba(243,234,217,0.95),0_0_10px_rgba(243,234,217,0.85)] font-serif text-[clamp(8.5px,1.15cqw,11px)] tracking-[0.1em] text-ink-soft/85">
                  OPENCHRONICLE ATLAS · 史迹 · 时空地图
                </p>
              </>
            ) : (
              <>
                <div className="absolute left-[6.9cqw] right-[18cqw] top-[8.6cqw] [text-shadow:0_1px_2px_rgba(243,234,217,0.95),0_0_10px_rgba(243,234,217,0.85)]">
                  <h3 className={`font-serif ${simpleTitleSize} whitespace-nowrap font-semibold leading-none tracking-wide text-ink`}>
                    {title}
                  </h3>
                  <p className="mt-[1.8cqw] font-serif text-[clamp(10px,2.5cqw,15px)] tracking-[0.18em] text-ink-soft">
                    {coverText.years}
                  </p>
                  <p className="mt-[2.2cqw] text-[clamp(8.5px,1.45cqw,12px)] text-ink-soft">
                    <span className="font-serif">{coverText.brand}</span>
                    <span className="font-serif tracking-[0.08em]"> · OpenChronicle Atlas</span>
                  </p>
                </div>
                <div className="pointer-events-none absolute bottom-[10.4cqw] left-[6.9cqw] right-[10cqw] h-px bg-ink/15" />
                {note ? (
                  <p className="absolute bottom-[6.2cqw] left-[6.9cqw] [text-shadow:0_1px_2px_rgba(243,234,217,0.95),0_0_10px_rgba(243,234,217,0.85)] font-serif text-[clamp(8.5px,1.15cqw,11px)] text-ink-soft/80">
                    {note}
                  </p>
                ) : null}
              </>
            )}
          </>
        ) : null}

      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-wide text-ink">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-ink-soft">{subtitle}</p> : null}
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          {(atlas.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-ink/10 bg-parchment-deep/60 px-2.5 py-1 text-[11px] text-ink-soft"
            >
              {tagLabel(tag, locale)}
            </span>
          ))}
        </div>

        <span className="text-xs font-medium tracking-widest text-cinnabar">
          {t('card.enter')} <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
