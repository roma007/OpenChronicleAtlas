import { resolveLocalized, tagLabel, type AtlasSummary } from '@atlas/shared';
import { Link } from 'react-router-dom';
import { dataUrl } from '../../data/client';
import { useI18n } from '../../hooks/useI18n';

export function AtlasCard({ atlas }: { atlas: AtlasSummary }) {
  const { locale, t } = useI18n();
  const title = resolveLocalized(atlas.title, locale);
  const subtitle = resolveLocalized(atlas.subtitle, locale);
  const startYear = String(Number(atlas.timeRange.start.slice(0, 4)));
  const endYear = String(Number(atlas.timeRange.end.slice(0, 4)));

  return (
    <Link
      to={`/atlas/${atlas.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-parchment shadow-sm transition hover:-translate-y-1 hover:border-cinnabar/30 hover:shadow-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinnabar"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-parchment-deep">
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
        <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-[11px] tracking-wider text-parchment">
          {startYear} — {endYear}
        </span>
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
