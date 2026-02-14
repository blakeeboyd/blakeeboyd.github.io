import { useCallback, useRef } from 'react';
import { useNormalizerStore } from '@/store/normalizer-store';
import { decodeAudioFile } from '@/lib/normalizer/decode';
import type { WorkerResponse } from '@/types/normalizer';
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
        const message = err instanceof Error ? err.message : 'Failed to decode audio file';
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

      workerRef.current = worker;
    }
    return workerRef.current!;
  }

  const handleProcess = useCallback(() => {
    const readyFiles = useNormalizerStore.getState().files.filter(
      f => f.status === 'ready' || f.status === 'done'
    );

    if (readyFiles.length === 0) return;

    setIsProcessing(true);
    const settings = getSettings();
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
  }, [getSettings, setIsProcessing, updateFile]);

  const readyCount = files.filter(f => f.status === 'ready' || f.status === 'done').length;
  const hasDone = files.some(f => f.status === 'done' && f.outputBuffer);

  return (
    <div className="norm-editor">
      <div className="norm-editor__main">
        <FileDropZone onFiles={handleAddFiles} disabled={isProcessing} />
        <FileList files={files} onRemove={handleRemove} onClear={handleClear} />

        {isProcessing && <ProcessingProgress files={files} />}

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
