import { useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useAtlasStore } from '../../stores/useAtlasStore';

const CHECK_INTERVAL_MS = 5 * 60 * 1000;

export function DataUpdatePrompt() {
  const dataVersion = useAtlasStore((state) => state.dataVersion);
  const available = useAtlasStore((state) => state.dataUpdateAvailable);
  const checkDataUpdate = useAtlasStore((state) => state.checkDataUpdate);
  const applyDataUpdate = useAtlasStore((state) => state.applyDataUpdate);
  const { t } = useI18n();

  useEffect(() => {
    if (!dataVersion) return;

    void checkDataUpdate();
    const interval = window.setInterval(() => {
      void checkDataUpdate();
    }, CHECK_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void checkDataUpdate();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [dataVersion, checkDataUpdate]);

  if (!available) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-14 z-[60] flex justify-center px-4">
      <div
        role="status"
        className="pointer-events-auto flex items-center gap-3 rounded-full border border-cinnabar/30 bg-parchment/95 px-4 py-2 text-xs text-ink shadow-panel backdrop-blur"
      >
        <span>{t('dataUpdate.available')}</span>
        <button
          type="button"
          onClick={applyDataUpdate}
          className="rounded-full bg-cinnabar px-3 py-1 text-parchment transition hover:bg-cinnabar/90"
        >
          {t('dataUpdate.refresh')}
        </button>
      </div>
    </div>
  );
}
