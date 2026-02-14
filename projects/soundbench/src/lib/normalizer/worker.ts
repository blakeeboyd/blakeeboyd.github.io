/**
 * Web Worker entry point for audio normalization.
 *
 * Receives typed messages, runs DSP pipeline, posts results back.
 * Import paths use relative paths since workers don't support @ aliases.
 */

import { measureLufsI } from './lufs';
import { measureRms } from './rms';
import { measureSamplePeak, measureTruePeak } from './true-peak';
import { runPipeline } from './pipeline';
import type { WorkerRequest, WorkerResponse, AudioFileMeasurements } from '../../types/normalizer';

function post(msg: WorkerResponse, transfer?: Transferable[]): void {
  self.postMessage(msg, { transfer: transfer ?? [] });
}

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const msg = event.data;

  try {
    if (msg.type === 'measure') {
      const measurements: AudioFileMeasurements = {
        peakDb: measureSamplePeak(msg.channelData),
        truePeakDb: measureTruePeak(msg.channelData),
        lufsI: measureLufsI(msg.channelData, msg.sampleRate),
        rmsDb: measureRms(msg.channelData, msg.sampleRate),
      };

      post({ type: 'measurements', fileId: msg.fileId, measurements });
    } else if (msg.type === 'process') {
      const result = runPipeline(
        msg.channelData,
        msg.sampleRate,
        msg.settings,
        (percent, stage) => {
          post({ type: 'progress', fileId: msg.fileId, percent, stage });
        },
      );

      post(
        {
          type: 'result',
          fileId: msg.fileId,
          wavBuffer: result.wavBuffer,
          measurements: result.outputMeasurements,
          appliedGainDb: result.appliedGainDb,
        },
        [result.wavBuffer],
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown worker error';
    post({ type: 'error', fileId: msg.fileId, message });
  }
};
