/**
 * Typed message helpers for worker communication
 */

import type { WorkerRequest, WorkerResponse } from '@/types/normalizer';

export function postToWorker(
  worker: Worker,
  msg: WorkerRequest,
  transfer?: Transferable[],
): void {
  worker.postMessage(msg, { transfer: transfer ?? [] });
}

export function isWorkerResponse(data: unknown): data is WorkerResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    typeof (data as WorkerResponse).type === 'string'
  );
}
