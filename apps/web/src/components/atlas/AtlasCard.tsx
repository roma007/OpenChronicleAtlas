import { resolveLocalized, type AtlasSummary } from '@atlas/shared';
import { Link } from 'react-router-dom';
import { dataUrl } from '../../data/client';
import { useI18n } from '../../hooks/useI18n';

const SCRIM =
  'linear-gradient(90deg, rgba(243,234,217,0.7) 0%, rgba(243,234,217,0.665) 32%, rgba(243,234,217,0.504) 52%, rgba(243,234,217,0.182) 72%, rgba(243,234,217,0) 90%)';

const TEXT_SHADOW = '0 1px 2px rgba(243,234,217,0.95), 0 0 10px rgba(243,234,217,0.85)';

/** 封面副文字（年代）统一放大 130%。 */
const SUB_SCALE = 1.3;

export function AtlasCard({ atlas }: { atlas: AtlasSummary }) {
  const { locale, t } = useI18n();
  const title = resolveLocalized(atlas.title, locale);
  const years = atlas.coverText?.years;
  const titleLength = title.length;
  const titleSize =
    titleLength >= 7
      ? 'text-[clamp(18px,7cqw,34px)]'
      : titleLength >= 5
        ? 'text-[clamp(20px,8cqw,38px)]'
        : 'text-[clamp(22px,8.6cqw,40px)]';

  return (
    <Link
      to={`/atlas/${atlas.id}`}
      aria-label={`${title} · ${t('card.aiCover')}`}
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

        <div className="pointer-events-none absolute inset-0" style={{ background: SCRIM }} />

        <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-ink/65 px-2 py-0.5 text-[10px] font-medium tracking-wide text-parchment shadow-sm">
          {t('card.aiCover')}
        </span>

        <div
          className="absolute left-[6.9cqw] right-[14cqw] top-[8.6cqw]"
          style={{ textShadow: TEXT_SHADOW }}
        >
          <h3
            className={`font-serif ${titleSize} whitespace-nowrap font-semibold leading-none tracking-wide text-ink`}
          >
            {title}
          </h3>
          {years ? (
            <p
              className="font-serif font-semibold tracking-[0.18em] text-ink-soft"
              style={{
                marginTop: `calc(1.8cqw * ${SUB_SCALE})`,
                fontSize: `calc(clamp(10px,2.5cqw,15px) * ${SUB_SCALE})`,
              }}
            >
              {years}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
