import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAtlasStore } from '../stores/useAtlasStore';
import { AtlasCard, type CoverMaskMode } from '../components/atlas/AtlasCard';
import { LanguageToggle } from '../components/layout/LanguageToggle';
import { useI18n } from '../hooks/useI18n';

const SCRIM_STORAGE_KEY = 'atlas-cover-scrim';
const DEFAULT_SCRIM = 97;
const SUB_SCALE_STORAGE_KEY = 'atlas-cover-subscale';
const DEFAULT_SUB_SCALE = 100;
const MASK_MODE_STORAGE_KEY = 'atlas-cover-mode';
const MASK_MODES: Array<{ value: CoverMaskMode; zh: string; en: string }> = [
  { value: 'full', zh: '整图', en: 'Full' },
  { value: 'local', zh: '局部', en: 'Local' },
  { value: 'glass', zh: '毛玻璃', en: 'Glass' },
  { value: 'outline', zh: '描边', en: 'Outline' },
];

function readMaskMode(): CoverMaskMode {
  try {
    const raw = window.localStorage.getItem(MASK_MODE_STORAGE_KEY);
    if (raw && MASK_MODES.some((item) => item.value === raw)) return raw as CoverMaskMode;
  } catch {
    // 忽略隐私模式下的读取失败
  }
  return 'full';
}

function readStored(key: string, fallback: number, min: number, max: number): number {
  try {
    const raw = window.localStorage.getItem(key);
    const value = raw === null ? Number.NaN : Number(raw);
    if (Number.isFinite(value)) return Math.min(max, Math.max(min, value));
  } catch {
    // 忽略隐私模式下的读取失败
  }
  return fallback;
}

export function AtlasGalleryPage() {
  const { index, loading, error, loadIndex } = useAtlasStore();
  const { t, locale } = useI18n();
  const [scrim, setScrim] = useState(() => readStored(SCRIM_STORAGE_KEY, DEFAULT_SCRIM, 0, 100));
  const [subScale, setSubScale] = useState(() =>
    readStored(SUB_SCALE_STORAGE_KEY, DEFAULT_SUB_SCALE, 60, 200),
  );
  const [maskMode, setMaskMode] = useState<CoverMaskMode>(readMaskMode);

  useEffect(() => {
    void loadIndex();
  }, [loadIndex]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SCRIM_STORAGE_KEY, String(scrim));
      window.localStorage.setItem(SUB_SCALE_STORAGE_KEY, String(subScale));
      window.localStorage.setItem(MASK_MODE_STORAGE_KEY, maskMode);
    } catch {
      // 忽略隐私模式下的写入失败
    }
  }, [scrim, subScale, maskMode]);

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

      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-4">
            <h2 className="font-serif text-xl tracking-widest text-ink">{t('gallery.subtitle')}</h2>
            <span className="text-xs text-ink-soft">
              {t('gallery.count', { count: index?.length ?? 0 })}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-parchment p-1 text-[11px] text-ink-soft">
              {MASK_MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  aria-pressed={maskMode === mode.value}
                  onClick={() => setMaskMode(mode.value)}
                  className={`rounded-full px-2 py-0.5 transition ${
                    maskMode === mode.value
                      ? 'bg-cinnabar text-parchment'
                      : 'hover:bg-ink/5'
                  }`}
                >
                  {locale === 'en' ? mode.en : mode.zh}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-parchment px-3 py-1.5 text-[11px] text-ink-soft">
              <span>{locale === 'en' ? 'Cover mask' : '封面遮罩'}</span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={scrim}
                onChange={(event) => setScrim(Number(event.target.value))}
                aria-label={locale === 'en' ? 'Cover mask opacity' : '封面遮罩不透明度'}
                className="h-1 w-24 cursor-pointer accent-cinnabar sm:w-32"
              />
              <span className="w-8 text-right tabular-nums">{scrim}%</span>
              <button
                type="button"
                onClick={() => setScrim(DEFAULT_SCRIM)}
                className="rounded-full px-1 text-ink-soft/70 underline decoration-ink/20 underline-offset-2 hover:text-cinnabar"
              >
                {locale === 'en' ? 'Reset' : '重置'}
              </button>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-parchment px-3 py-1.5 text-[11px] text-ink-soft">
              <span>{locale === 'en' ? 'Sub text' : '副文字'}</span>
              <input
                type="range"
                min={60}
                max={200}
                step={5}
                value={subScale}
                onChange={(event) => setSubScale(Number(event.target.value))}
                aria-label={locale === 'en' ? 'Cover sub-text size' : '封面副文字大小'}
                className="h-1 w-24 cursor-pointer accent-cinnabar sm:w-32"
              />
              <span className="w-10 text-right tabular-nums">{subScale}%</span>
              <button
                type="button"
                onClick={() => setSubScale(DEFAULT_SUB_SCALE)}
                className="rounded-full px-1 text-ink-soft/70 underline decoration-ink/20 underline-offset-2 hover:text-cinnabar"
              >
                {locale === 'en' ? 'Reset' : '重置'}
              </button>
            </div>
          </div>
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
              <AtlasCard
                key={atlas.id}
                atlas={atlas}
                scrimOpacity={scrim / 100}
                subScale={subScale / 100}
                maskMode={maskMode}
              />
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
        </Link>{' '}
        ·{' '}
        <Link
          to="/about"
          className="underline decoration-ink/20 underline-offset-2 hover:text-cinnabar"
        >
          {t('about.link')}
        </Link>
      </footer>
    </div>
  );
}
