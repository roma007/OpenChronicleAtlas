import { Link } from 'react-router-dom';
import { LanguageToggle } from '../components/layout/LanguageToggle';
import { useI18n } from '../hooks/useI18n';

const SECTIONS = [
  { title: 'privacy.s1.title', body: 'privacy.s1.body' },
  { title: 'privacy.s2.title', body: 'privacy.s2.body' },
  { title: 'privacy.s3.title', body: 'privacy.s3.body' },
  { title: 'privacy.s4.title', body: 'privacy.s4.body' },
  { title: 'privacy.s5.title', body: 'privacy.s5.body' },
  { title: 'privacy.s6.title', body: 'privacy.s6.body' },
] as const;

export function PrivacyPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-full bg-parchment">
      <header className="border-b border-ink/10 bg-parchment/90">
        <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/"
              className="rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
            >
              {t('privacy.back')}
            </Link>
            <LanguageToggle />
          </div>
          <h1 className="mt-6 font-serif text-3xl font-semibold tracking-wider text-ink">
            {t('privacy.title')}
          </h1>
          <p className="mt-2 text-xs text-ink-soft/70">{t('privacy.updated')}</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-5 py-8 text-sm leading-7 text-ink-soft sm:px-8">
        {SECTIONS.map((section, index) => (
          <section key={section.title}>
            <h2 className="font-serif text-lg font-semibold text-ink">
              {t(section.title)}
            </h2>
            <p className="whitespace-pre-line">{t(section.body)}</p>
            {index === 1 ? (
              <p className="mt-2">
                {t('privacy.amapPolicy')}：
                <a
                  className="text-cinnabar underline underline-offset-2"
                  href="https://lbs.amap.com/pages/privacy/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  https://lbs.amap.com/pages/privacy/
                </a>
              </p>
            ) : null}
            {index === 5 ? (
              <p className="mt-2">
                <a
                  className="text-cinnabar underline underline-offset-2"
                  href="https://github.com/roma007/OpenChronicleAtlas"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  GitHub Issues
                </a>
              </p>
            ) : null}
          </section>
        ))}
      </main>
    </div>
  );
}
