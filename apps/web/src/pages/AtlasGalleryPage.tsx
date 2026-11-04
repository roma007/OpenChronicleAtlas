import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAtlasStore } from '../stores/useAtlasStore';
import { AtlasCard } from '../components/atlas/AtlasCard';
import { LanguageToggle } from '../components/layout/LanguageToggle';
import { useI18n } from '../hooks/useI18n';

export function AtlasGalleryPage() {
  const { index, loading, error, loadIndex } = useAtlasStore();
  const { t } = useI18n();

  useEffect(() => {
    void loadIndex();
  }, [loadIndex]);

  return (
    <div className="min-h-full bg-parchment">
      <header className="border-b border-ink/10 bg-parchment/90">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:px-8 md:py-14">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium tracking-[0.35em] text-cinnabar">
              OPENCHRONICLE ATLAS
            </p>
            <LanguageToggle />
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-semibold tracking-wider text-ink md:text-5xl">
                {t('app.title')}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft md:text-base">
                {t('app.tagline')}
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <Link
                to="/search"
                className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
              >
                {t('gallery.searchEvents')}
              </Link>
              <p className="text-xs leading-6 text-ink-soft/80 md:text-right">
                {t('gallery.dataContract')}
                <br />
                {t('gallery.mapService')}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-14">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-serif text-xl tracking-widest text-ink">{t('gallery.subtitle')}</h2>
          <span className="text-xs text-ink-soft">
            {t('gallery.count', { count: index?.length ?? 0 })}
          </span>
        </div>

        {loading && !index ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl border border-ink/10 bg-parchment-deep/60"
              />
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-cinnabar/30 bg-cinnabar/5 p-6">
            <h3 className="font-serif text-lg text-cinnabar">{t('gallery.errorTitle')}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{error}</p>
            <button
              type="button"
              onClick={() => void loadIndex()}
              className="mt-4 rounded-full border border-cinnabar/40 px-4 py-2 text-sm text-cinnabar transition hover:bg-cinnabar hover:text-parchment"
            >
              {t('nav.retry')}
            </button>
          </div>
        ) : null}

        {index ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {index.map((atlas) => (
              <AtlasCard key={atlas.id} atlas={atlas} />
            ))}
          </div>
        ) : null}

        {index && index.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/20 p-10 text-center text-sm text-ink-soft">
            {t('gallery.empty')}
          </p>
        ) : null}
      </main>

      <footer className="border-t border-ink/10 px-5 py-8 text-center text-xs leading-6 text-ink-soft/70">
        {t('app.footer')}
        <br />
        {t('app.footerData')} ·{' '}
        <Link
          to="/privacy"
          className="underline decoration-ink/20 underline-offset-2 hover:text-cinnabar"
        >
          {t('privacy.link')}
        </Link>
      </footer>
    </div>
  );
}
