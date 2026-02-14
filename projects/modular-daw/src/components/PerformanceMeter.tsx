import { useState, useEffect } from 'react';
import { getEngine } from '../hooks/use-audio-engine';
import { useGraphStore } from '../store/graph-store';

interface PerfStats {
  ctxState: string;
  sampleRate: number;
  moduleCount: number;
  connectionCount: number;
  memoryMB: number | null;
  memoryPct: number | null;
}

export function PerformanceMeter() {
  const [stats, setStats] = useState<PerfStats>({
    ctxState: 'suspended',
    sampleRate: 0,
    moduleCount: 0,
    connectionCount: 0,
    memoryMB: null,
    memoryPct: null,
  });

  useEffect(() => {
    const tick = () => {
      const engine = getEngine();
      const ctx = engine?.audioContext ?? null;
      const { nodes, edges } = useGraphStore.getState();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mem = (performance as any).memory;

      setStats({
        ctxState: ctx?.state ?? 'closed',
        sampleRate: ctx?.sampleRate ?? 0,
        moduleCount: nodes.length,
        connectionCount: edges.length,
        memoryMB: mem ? Math.round(mem.usedJSHeapSize / (1024 * 1024)) : null,
        memoryPct: mem ? Math.round((mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100) : null,
      });
    };

    tick();
    const id = setInterval(tick, 2000);
    return () => clearInterval(id);
  }, []);

  const hasMemory = stats.memoryMB !== null;
  const memTier = stats.memoryPct! < 50 ? 'low' : stats.memoryPct! < 80 ? 'mid' : 'high';

  return (
    <div className="daw-perf">
      <span className={`daw-perf__dot daw-perf__dot--${stats.ctxState}`} />
      <span className="daw-perf__stats">
        {stats.moduleCount}M {stats.connectionCount}C
        {hasMemory && ` ${stats.memoryMB}MB`}
      </span>

      {hasMemory && (
        <div className="daw-perf__bar">
          <div
            className={`daw-perf__bar-fill daw-perf__bar-fill--${memTier}`}
            style={{ width: `${Math.min(100, stats.memoryPct!)}%` }}
          />
        </div>
      )}

      <div className="daw-perf__tooltip">
        <div className="daw-perf__tooltip-row">
          <span className="daw-perf__tooltip-label">Audio engine</span>
          <span className="daw-perf__tooltip-value">{stats.ctxState}</span>
        </div>
        <div className="daw-perf__tooltip-row">
          <span className="daw-perf__tooltip-label">Sample rate</span>
          <span className="daw-perf__tooltip-value">{stats.sampleRate} Hz</span>
        </div>
        <div className="daw-perf__tooltip-row">
          <span className="daw-perf__tooltip-label">Modules</span>
          <span className="daw-perf__tooltip-value">{stats.moduleCount}</span>
        </div>
        <div className="daw-perf__tooltip-row">
          <span className="daw-perf__tooltip-label">Connections</span>
          <span className="daw-perf__tooltip-value">{stats.connectionCount}</span>
        </div>
        {hasMemory && (
          <div className="daw-perf__tooltip-row">
            <span className="daw-perf__tooltip-label">JS Heap</span>
            <span className="daw-perf__tooltip-value">
              {stats.memoryMB} MB ({stats.memoryPct}%)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
