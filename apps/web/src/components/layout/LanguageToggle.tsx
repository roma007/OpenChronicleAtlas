import { useI18n } from '../../hooks/useI18n';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { locale, setLocale, t } = useI18n();
  const next = locale === 'zh' ? 'en' : 'zh';

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={t('language.toggle')}
      className={`inline-flex items-center gap-1 rounded-full border border-ink/15 px-2.5 py-1 text-[11px] text-ink-soft transition hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinnabar ${className}`}
    >
      <span className={locale === 'zh' ? 'font-semibold text-cinnabar' : ''}>中文</span>
      <span className="text-ink-soft/40">/</span>
      <span className={locale === 'en' ? 'font-semibold text-cinnabar' : ''}>EN</span>
    </button>
  );
}
