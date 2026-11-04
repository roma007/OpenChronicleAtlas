import { useRegisterSW } from 'virtual:pwa-register/react';
import { useI18n } from '../../hooks/useI18n';

export function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  const { t } = useI18n();

  if (!needRefresh) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 top-20 z-[70] w-[min(92vw,28rem)] -translate-x-1/2 rounded-2xl border border-cinnabar/20 bg-parchment/95 p-3 shadow-panel backdrop-blur"
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="min-w-0 flex-1 text-sm font-medium text-ink">
          {t('pwa.updateAvailable')}
        </p>
        <button
          type="button"
          onClick={() => void updateServiceWorker(true)}
          className="rounded-full bg-cinnabar px-3 py-1 text-xs text-parchment transition hover:bg-cinnabar/90"
        >
          {t('pwa.refresh')}
        </button>
        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          className="rounded-full border border-ink/15 px-3 py-1 text-xs text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
        >
          {t('pwa.later')}
        </button>
      </div>
    </div>
  );
}
