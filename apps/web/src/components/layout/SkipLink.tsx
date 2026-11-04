import { useI18n } from '../../hooks/useI18n';

export function SkipLink() {
  const { t } = useI18n();

  return (
    <a
      href="#main-content"
      className="sr-only rounded-full bg-cinnabar px-4 py-2 text-sm text-parchment shadow-panel focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-parchment"
    >
      {t('a11y.skipToContent')}
    </a>
  );
}
