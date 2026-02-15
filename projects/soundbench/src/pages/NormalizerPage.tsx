import { NormalizerEditor } from '@/components/normalizer/NormalizerEditor';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export function NormalizerPage() {
  return (
    <div className="sb-page--full">
      <div className="sb-toolbar">
        <h2 className="sb-toolbar__title">Normalizer</h2>
      </div>
      <ErrorBoundary>
        <NormalizerEditor />
      </ErrorBoundary>
    </div>
  );
}
