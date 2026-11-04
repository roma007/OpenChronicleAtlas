import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageToggle } from '../components/layout/LanguageToggle';
import { clearAppCaches, useCacheInfo } from '../hooks/useCacheInfo';
import { useI18n } from '../hooks/useI18n';

function formatBytes(value: number | null): string | null {
  if (value === null) return null;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  if (value < 1024 * 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  return `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function AboutPage() {
  const { t } = useI18n();
  const { usage, entries, refresh } = useCacheInfo();
  const [clearing, setClearing] = useState(false);

  const handleClear = async () => {
    if (!window.confirm(t('about.clearConfirm'))) return;
    setClearing(true);
    await clearAppCaches();
    window.location.reload();
  };

  const size = formatBytes(usage) ?? t('about.cacheUnknown');
  const cacheEntries = entries ?? t('about.cacheUnknown');

  return (
    <div className="min-h-full bg-parchment">
      <header className="border-b border-ink/10 bg-parchment/90">
        <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/"
              className="rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
            >
              {t('about.back')}
            </Link>
            <LanguageToggle />
          </div>
          <h1 className="mt-6 font-serif text-3xl font-semibold tracking-wider text-ink">
            {t('about.title')}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-5 py-8 text-sm leading-7 text-ink-soft sm:px-8">
        <section className="rounded-2xl border border-ink/10 bg-parchment p-5 shadow-sm">
          <dl className="space-y-2">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft/60">{t('about.version')}</dt>
              <dd className="font-medium text-ink">{__APP_VERSION__}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft/60">{t('about.dataContract')}</dt>
              <dd className="font-medium text-ink">v1.0.0</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft/60">{t('about.mapService')}</dt>
              <dd className="font-medium text-ink">AMap</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-parchment p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-lg font-semibold text-ink">{t('about.cache')}</h2>
            <button
              type="button"
              onClick={() => void refresh()}
              className="rounded-full border border-ink/10 px-3 py-1 text-[11px] text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
            >
              {t('pwa.refresh')}
            </button>
          </div>
          <p className="mt-2 text-xs text-ink-soft/70">
            {t('about.cacheUsage', { size })} ·{' '}
            {t('about.cacheEntries', { count: cacheEntries })}
          </p>
          <button
            type="button"
            disabled={clearing}
            onClick={() => void handleClear()}
            className="mt-3 rounded-full border border-cinnabar/30 px-4 py-1.5 text-xs text-cinnabar transition hover:bg-cinnabar hover:text-parchment disabled:opacity-50"
          >
            {clearing ? t('about.cleared') : t('about.clearCache')}
          </button>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-parchment p-5 shadow-sm">
          <h2 className="font-serif text-lg font-semibold text-ink">{t('about.repo')}</h2>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            <a
              className="text-cinnabar underline underline-offset-2"
              href="https://github.com/roma007/OpenChronicleAtlas"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub
            </a>
            <a
              className="text-cinnabar underline underline-offset-2"
              href="https://gitee.com/roma007007/OpenChronicleAtlas"
              target="_blank"
              rel="noreferrer noopener"
            >
              Gitee
            </a>
            <Link className="text-cinnabar underline underline-offset-2" to="/privacy">
              {t('privacy.link')}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
