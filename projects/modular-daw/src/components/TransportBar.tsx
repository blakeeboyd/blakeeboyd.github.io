import { useCallback } from 'react';
import { useTransportStore } from '../store/transport-store';
import { useRecordingStore } from '../store/recording-store';
import { formatTime } from '../utils/format-time';

export function TransportBar() {
  const isPlaying = useTransportStore(s => s.isPlaying);
  const position = useTransportStore(s => s.position);
  const loopEnabled = useTransportStore(s => s.loopEnabled);
  const play = useTransportStore(s => s.play);
  const stop = useTransportStore(s => s.stop);
  const pause = useTransportStore(s => s.pause);
  const seek = useTransportStore(s => s.seek);
  const toggleLoop = useTransportStore(s => s.toggleLoop);
  const isRecording = useRecordingStore(s => s.isRecording);
  const hasArmedTracks = useRecordingStore(s => s.armedTrackIds.length > 0);
  const setRecording = useRecordingStore(s => s.setRecording);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const handleStop = useCallback(() => {
    if (isRecording) {
      setRecording(false);
    }
    stop();
  }, [stop, isRecording, setRecording]);

  const handleRecord = useCallback(() => {
    if (isRecording) {
      setRecording(false);
    } else if (hasArmedTracks) {
      setRecording(true);
    }
  }, [isRecording, hasArmedTracks, setRecording]);

  const handleReturnToZero = useCallback(() => {
    seek(0);
  }, [seek]);

  return (
    <div className="daw-transport">
      <button
        className="daw-transport__btn"
        onClick={handleReturnToZero}
        title="Return to start (Enter)"
        aria-label="Return to start"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <rect x="2" y="3" width="2" height="8" />
          <polygon points="12,3 12,11 5,7" />
        </svg>
      </button>
      <button
        className={`daw-transport__btn daw-transport__btn--play ${isPlaying ? 'active' : ''}`}
        onClick={handlePlayPause}
        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="3" y="2" width="3" height="10" rx="0.5" />
            <rect x="8" y="2" width="3" height="10" rx="0.5" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <polygon points="3,2 12,7 3,12" />
          </svg>
        )}
      </button>
      <button
        className="daw-transport__btn"
        onClick={handleStop}
        title="Stop"
        aria-label="Stop"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <rect x="3" y="3" width="8" height="8" rx="1" />
        </svg>
      </button>
      <button
        className={`daw-transport__btn ${loopEnabled ? 'active' : ''}`}
        onClick={toggleLoop}
        title={`Loop ${loopEnabled ? 'on' : 'off'} (L)`}
        aria-label={`Toggle loop ${loopEnabled ? 'off' : 'on'}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 3H5a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H4" />
          <polyline points="8,1 10,3 8,5" />
          <polyline points="6,9 4,11 6,13" />
        </svg>
      </button>
      <button
        className={`daw-transport__btn daw-transport__btn--record ${isRecording ? 'active' : ''}`}
        onClick={handleRecord}
        disabled={!hasArmedTracks && !isRecording}
        title={isRecording ? 'Stop recording' : hasArmedTracks ? 'Record' : 'Arm a track first'}
        aria-label={isRecording ? 'Stop recording' : 'Record'}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <circle cx="7" cy="7" r="5" />
        </svg>
      </button>
      <div className="daw-transport__position">
        {formatTime(position)}
      </div>
    </div>
  );
}
