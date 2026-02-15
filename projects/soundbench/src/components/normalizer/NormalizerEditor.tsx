import { useCallback, useRef } from 'react';
import { useNormalizerStore } from '@/store/normalizer-store';
import { decodeAudioFile } from '@/lib/normalizer/decode';
import { computeLoudestGain, computeAlbumGain, computeBatchLimiterReduction } from '@/lib/normalizer/batch-gain';
import type { WorkerResponse, ProcessingJobSettings } from '@/types/normalizer';
import { FileDropZone } from './FileDropZone';
import { FileList } from './FileList';
import { NormalizerSettings } from './NormalizerSettings';
import { ProcessingProgress } from './ProcessingProgress';
import { ResultsPanel } from './ResultsPanel';

// Inline worker import for single-bundle build
import NormalizerWorker from '@/lib/normalizer/worker.ts?worker&inline';

// Store decoded channel data keyed by file ID (kept outside React state
// because Float32Arrays are large and should not be in Zustand)
const decodedCache = new Map<string, { channelData: Float32Array[]; sampleRate: number }>();

export function NormalizerEditor() {
  const files = useNormalizerStore(s => s.files);
  const isProcessing = useNormalizerStore(s => s.isProcessing);
  const output = useNormalizerStore(s => s.output);
  const addFiles = useNormalizerStore(s => s.addFiles);
  const removeFile = useNormalizerStore(s => s.removeFile);
  const clearFiles = useNormalizerStore(s => s.clearFiles);
  const updateFile = useNormalizerStore(s => s.updateFile);
  const setIsProcessing = useNormalizerStore(s => s.setIsProcessing);
  const getSettings = useNormalizerStore(s => s.getSettings);

  const workerRef = useRef<Worker | null>(null);

  const handleAddFiles = useCallback(async (newFiles: File[]) => {
    addFiles(newFiles);

    // Get the newly added entries from the store (they'll be at the end)
    const currentFiles = useNormalizerStore.getState().files;
    const newEntries = currentFiles.slice(currentFiles.length - newFiles.length);

    // Decode each file
    for (const entry of newEntries) {
      updateFile(entry.id, { status: 'decoding' });

      try {
        const decoded = await decodeAudioFile(entry.file);
        decodedCache.set(entry.id, {
          channelData: decoded.channelData,
          sampleRate: decoded.sampleRate,
        });

        updateFile(entry.id, {
          status: 'ready',
          sampleRate: decoded.sampleRate,
          channelCount: decoded.channelCount,
          durationSec: decoded.durationSec,
        });

        // Quick measurement via worker
        const worker = getOrCreateWorker();
        worker.postMessage(
          {
            type: 'measure',
            fileId: entry.id,
            channelData: decoded.channelData,
            sampleRate: decoded.sampleRate,
          },
          // Don't transfer here since we need the data for processing later
        );
      } catch (err) {
        let message = 'Failed to decode audio file';
        if (err instanceof Error) {
          if (err.message.includes('Unable to decode')) {
            message = 'Unsupported audio format or corrupted file';
          } else if (err.message.includes('buffer')) {
            message = 'File is too large to decode in the browser';
          } else {
            message = err.message;
          }
        }
        updateFile(entry.id, { status: 'error', error: message });
      }
    }
  }, [addFiles, updateFile]);

  const handleRemove = useCallback((id: string) => {
    decodedCache.delete(id);
    removeFile(id);
  }, [removeFile]);

  const handleClear = useCallback(() => {
    decodedCache.clear();
    clearFiles();
  }, [clearFiles]);

  const handleCancel = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    const currentFiles = useNormalizerStore.getState().files;
    for (const f of currentFiles) {
      if (f.status === 'processing' || f.status === 'decoding') {
        updateFile(f.id, { status: 'error', error: 'Cancelled', progress: 0 });
      }
    }

    setIsProcessing(false);
  }, [updateFile, setIsProcessing]);

  function getOrCreateWorker(): Worker {
    if (!workerRef.current) {
      const worker = new NormalizerWorker();

      worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const msg = event.data;

        if (msg.type === 'measurements') {
          updateFile(msg.fileId, { inputMeasurements: msg.measurements });
        } else if (msg.type === 'progress') {
          updateFile(msg.fileId, { progress: msg.percent });
        } else if (msg.type === 'result') {
          updateFile(msg.fileId, {
            status: 'done',
            progress: 100,
            outputBuffer: msg.wavBuffer,
            outputBufferL: msg.wavBufferL,
            outputBufferR: msg.wavBufferR,
            outputMeasurements: msg.measurements,
            appliedGainDb: msg.appliedGainDb,
          });

          // Check if all files are done
          const currentFiles = useNormalizerStore.getState().files;
          const allDone = currentFiles.every(
            f => f.status === 'done' || f.status === 'error'
          );
          if (allDone) {
            setIsProcessing(false);
          }
        } else if (msg.type === 'error') {
          updateFile(msg.fileId, { status: 'error', error: msg.message });

          const currentFiles = useNormalizerStore.getState().files;
          const allDone = currentFiles.every(
            f => f.status === 'done' || f.status === 'error'
          );
          if (allDone) {
            setIsProcessing(false);
          }
        }
      };

      worker.onerror = () => {
        const currentFiles = useNormalizerStore.getState().files;
        for (const f of currentFiles) {
          if (f.status === 'processing' || f.status === 'decoding') {
            updateFile(f.id, { status: 'error', error: 'Worker crashed unexpectedly' });
          }
        }
        setIsProcessing(false);
        workerRef.current?.terminate();
        workerRef.current = null;
      };

      workerRef.current = worker;
    }
    return workerRef.current!;
  }

  function sendProcessMessages(
    readyFiles: typeof files,
    settings: ProcessingJobSettings,
  ): void {
    const worker = getOrCreateWorker();

    for (const entry of readyFiles) {
      const cached = decodedCache.get(entry.id);
      if (!cached) {
        updateFile(entry.id, { status: 'error', error: 'Audio data not found' });
        continue;
      }

      updateFile(entry.id, {
        status: 'processing',
        progress: 0,
        outputBuffer: undefined,
        outputBufferL: undefined,
        outputBufferR: undefined,
        outputMeasurements: undefined,
        appliedGainDb: undefined,
      });

      worker.postMessage({
        type: 'process',
        fileId: entry.id,
        channelData: cached.channelData,
        sampleRate: cached.sampleRate,
        settings,
      });
    }
  }

  const handleProcess = useCallback(() => {
    const readyFiles = useNormalizerStore.getState().files.filter(
      f => f.status === 'ready' || f.status === 'done'
    );

    if (readyFiles.length === 0) return;

    setIsProcessing(true);
    const settings = getSettings();

    const isBatchNorm = settings.normalize.enabled
      && settings.normalize.batchMode !== 'each'
      && readyFiles.length > 1;

    const isBatchLimit = settings.limiter.enabled
      && settings.limiter.batchMode === 'together'
      && readyFiles.length > 1;

    if (!isBatchNorm && !isBatchLimit) {
      // Single-pass: current behavior, no overrides
      sendProcessMessages(readyFiles, settings);
      return;
    }

    // Two-pass: compute batch gains, then process with overrides
    const filesWithMeasurements = readyFiles.filter(f => f.inputMeasurements && f.durationSec);

    if (filesWithMeasurements.length === 0) {
      // No measurements available; fall back to single-pass
      sendProcessMessages(readyFiles, settings);
      return;
    }

    const batchFiles = filesWithMeasurements.map(f => ({
      measurements: f.inputMeasurements!,
      durationSec: f.durationSec!,
    }));

    // Calculate batch normalization gain
    let overrideGainDb: number | undefined;

    if (isBatchNorm) {
      const { type, targetValue, condition, batchMode } = settings.normalize;
      const gain = batchMode === 'loudest'
        ? computeLoudestGain(batchFiles, type, targetValue, condition)
        : computeAlbumGain(batchFiles, type, targetValue, condition);
      if (gain !== null) {
        overrideGainDb = gain;
      }
    }

    // Calculate batch limiter reduction
    let overrideLimiterReduction: number | undefined;

    if (isBatchLimit) {
      const appliedGain = overrideGainDb ?? 0;
      const useTruePeak = settings.limiter.type === 'true-peak';
      const reduction = computeBatchLimiterReduction(
        batchFiles,
        appliedGain,
        settings.limiter.ceiling,
        useTruePeak,
      );
      if (reduction < 0) {
        overrideLimiterReduction = reduction;
      }
    }

    // Send process messages with overrides
    const batchSettings: ProcessingJobSettings = {
      ...settings,
      overrideGainDb,
      overrideLimiterReduction,
    };

    sendProcessMessages(readyFiles, batchSettings);
  }, [getSettings, setIsProcessing, updateFile]);

  const readyCount = files.filter(f => f.status === 'ready' || f.status === 'done').length;
  const hasDone = files.some(f => f.status === 'done' && f.outputBuffer);

  return (
    <div className="norm-editor">
      <div className="norm-editor__main">
        <FileDropZone onFiles={handleAddFiles} disabled={isProcessing} />
        <FileList files={files} onRemove={handleRemove} onClear={handleClear} />

        {isProcessing && <ProcessingProgress files={files} onCancel={handleCancel} />}

        {!isProcessing && readyCount > 0 && (
          <button className="norm-process-btn" onClick={handleProcess}>
            Process {readyCount} file{readyCount !== 1 ? 's' : ''}
          </button>
        )}

        {hasDone && <ResultsPanel files={files} filenameSuffix={output.filenameSuffix} />}
      </div>

      <div className="norm-editor__sidebar">
        <NormalizerSettings />
      </div>
    </div>
  );
}
