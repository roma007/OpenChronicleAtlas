import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { reportClientError, type ClientErrorRecord } from '../../lib/observability';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  failed: boolean;
  record: ClientErrorRecord | null;
}

function ErrorFallback({ record }: { record: ClientErrorRecord | null }) {
  const { t } = useI18n();

  return (
    <div
      role="alert"
      className="flex min-h-screen items-center justify-center bg-parchment px-5 py-16 text-ink"
    >
      <div className="w-full max-w-xl rounded-2xl border border-ink/10 bg-parchment/95 p-8 shadow-panel">
        <p className="text-[11px] uppercase tracking-[0.3em] text-cinnabar">
          OpenChronicle Atlas
        </p>
        <h1 className="mt-4 font-serif text-2xl font-semibold tracking-wider">
          {t('errorBoundary.title')}
        </h1>
        <p className="mt-3 text-sm leading-7 text-ink-soft">
          {t('errorBoundary.body')}
        </p>

        {record ? (
          <p className="mt-4 rounded-lg bg-ink/5 px-3 py-2 font-mono text-xs text-ink-soft">
            {t('errorBoundary.errorId')}: {record.id}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-cinnabar px-4 py-2 text-sm text-parchment transition hover:bg-cinnabar/90"
          >
            {t('errorBoundary.reload')}
          </button>
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink-soft transition hover:border-cinnabar/40 hover:text-cinnabar"
          >
            {t('errorBoundary.home')}
          </button>
        </div>
      </div>
    </div>
  );
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { failed: false, record: null };

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    const context = info.componentStack
      ? `react.render:${info.componentStack.slice(0, 200)}`
      : 'react.render';
    this.setState({ record: reportClientError(error, context) });
  }

  override render(): ReactNode {
    if (this.state.failed) {
      return <ErrorFallback record={this.state.record} />;
    }
    return this.props.children;
  }
}
