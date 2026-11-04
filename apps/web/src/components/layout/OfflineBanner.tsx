import { useI18n } from '../../hooks/useI18n';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export function OfflineBanner() {
  const online = useOnlineStatus();
  const { t } = useI18n();

  if (online) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-2 z-[60] flex justify-center px-4">
      <div
        role="status"
        className="rounded-full border border-ochre/50 bg-ochre/95 px-4 py-1.5 text-xs text-ink shadow-panel backdrop-blur"
      >
        {t('offline.banner')}
      </div>
    </div>
  );
}
