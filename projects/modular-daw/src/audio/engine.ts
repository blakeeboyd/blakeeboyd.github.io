import type { DawNode, DawEdge } from '../types/graph';
import type { ProcessorInstance } from '../types/audio';
import type { Region } from '../types/region';
import { getProcessorFactory, getManifest } from '../modules/registry';
import { createChannelAdapter } from './channel-utils';
import { getBuffer } from '../store/audio-buffer-cache';
import { setSharedAudioContext } from './audio-context';
import { ensureWorklets } from './worklet-loader';

/** Converts dB to linear gain */
export function dbToLinear(db: number): number {
  if (db <= -70) return 0;
  return Math.pow(10, db / 20);
}

interface LiveConnection {
  gate: GainNode;
  from: AudioNode;
  to: AudioNode | AudioParam;
  adapter?: { input: AudioNode; output: AudioNode };
  disconnectTimer?: ReturnType<typeof setTimeout>;
}

/**
 * AudioEngine: reconciles abstract graph state into live Web Audio connections.
 * Uses incremental patching (not full teardown) and click-free GainNode gating.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private processors = new Map<string, ProcessorInstance>();
  private connections = new Map<string, LiveConnection>();
  private prevNodes: DawNode[] = [];
  private prevEdges: DawEdge[] = [];
  private currentMuteState = new Map<string, boolean>();

  get audioContext(): AudioContext | null {
    return this.ctx;
  }

  async initialize(): Promise<void> {
    this.ctx = new AudioContext();
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    await ensureWorklets(this.ctx);
    setSharedAudioContext(this.ctx);
  }

  /** Called on every store change to sync Web Audio with graph state */
  reconcile(nodes: DawNode[], edges: DawEdge[]): void {
    if (!this.ctx) return;

    // 1. Removed nodes: dispose processors
    const currentNodeIds = new Set(nodes.map(n => n.id));
    for (const prevNode of this.prevNodes) {
      if (!currentNodeIds.has(prevNode.id)) {
        this.removeProcessor(prevNode.id);
      }
    }

    // 2. Added nodes: create processors
    const prevNodeIds = new Set(this.prevNodes.map(n => n.id));
    for (const node of nodes) {
      if (!prevNodeIds.has(node.id)) {
        this.createProcessor(node);
      }
    }

    // 3. Changed parameters: update processor params
    for (const node of nodes) {
      const prevNode = this.prevNodes.find(pn => pn.id === node.id);
      if (prevNode) {
        for (const [paramId, value] of Object.entries(node.data.parameters)) {
          if (prevNode.data.parameters[paramId] !== value) {
            this.processors.get(node.id)?.setParameter(
              paramId, value, this.ctx.currentTime
            );
          }
        }
      }
    }

    // 3b. Bypass state changes
    for (const node of nodes) {
      const prevNode = this.prevNodes.find(pn => pn.id === node.id);
      const wasBypassed = prevNode?.data.bypassed ?? false;
      const isBypassed = node.data.bypassed ?? false;
      if (wasBypassed !== isBypassed) {
        this.processors.get(node.id)?.setBypass?.(isBypassed, this.ctx.currentTime);
      }
    }

    // 3c. Buffer assignment for track nodes
    for (const node of nodes) {
      if (!node.data.bufferRef) continue;
      const prevNode = this.prevNodes.find(pn => pn.id === node.id);
      if (prevNode?.data.bufferRef === node.data.bufferRef) continue;
      const proc = this.processors.get(node.id);
      if (proc?.setBuffer) {
        const entry = getBuffer(node.data.bufferRef);
        if (entry) proc.setBuffer(entry.buffer);
      }
    }

    // 4. Removed edges: disconnect with ramp-down
    const currentEdgeIds = new Set(edges.map(e => e.id));
    for (const prevEdge of this.prevEdges) {
      if (!currentEdgeIds.has(prevEdge.id)) {
        this.removeConnection(prevEdge.id);
      }
    }

    // 5. Added edges: connect with ramp-up
    const prevEdgeIds = new Set(this.prevEdges.map(e => e.id));
    for (const edge of edges) {
      if (!prevEdgeIds.has(edge.id)) {
        this.createConnection(edge, nodes);
      }
    }

    this.prevNodes = nodes;
    this.prevEdges = edges;
  }

  private createProcessor(node: DawNode): void {
    if (!this.ctx || !node.type) return;
    try {
      const factory = getProcessorFactory(node.type);
      const instance = factory.create(this.ctx, node.data.parameters);
      this.processors.set(node.id, instance);
    } catch (e) {
      console.warn(`Failed to create processor for ${node.type}:`, e);
    }
  }

  private removeProcessor(nodeId: string): void {
    // Remove all connections involving this node first
    for (const [edgeId] of this.connections) {
      const edge = this.prevEdges.find(e => e.id === edgeId);
      if (edge && (edge.source === nodeId || edge.target === nodeId)) {
        this.removeConnection(edgeId);
      }
    }

    const proc = this.processors.get(nodeId);
    if (proc) {
      proc.dispose();
      this.processors.delete(nodeId);
    }
  }

  private createConnection(edge: DawEdge, currentNodes: DawNode[]): void {
    if (!this.ctx) return;

    const sourceProc = this.processors.get(edge.source);
    const targetProc = this.processors.get(edge.target);
    if (!sourceProc || !targetProc) return;

    const fromNode = sourceProc.outputs[edge.sourceHandle];
    const toTarget = targetProc.inputs[edge.targetHandle];
    if (!fromNode || !toTarget) return;

    if (edge.data.signalType === 'parameter' && toTarget instanceof AudioParam) {
      // Parameter connection: direct connect to AudioParam
      fromNode.connect(toTarget);
      this.connections.set(edge.id, {
        gate: null as unknown as GainNode,
        from: fromNode,
        to: toTarget,
      });
    } else if (toTarget instanceof AudioNode) {
      // Determine channel formats for adapter
      const sourceNode = currentNodes.find(n => n.id === edge.source);
      const targetNode = currentNodes.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) return;

      let sourceFormat = edge.data.channelFormat;
      let targetFormat = edge.data.channelFormat;
      try {
        const srcManifest = getManifest(sourceNode.type);
        const srcPort = srcManifest.ports.find(p => p.id === edge.sourceHandle);
        if (srcPort) sourceFormat = srcPort.channelFormat;

        const tgtManifest = getManifest(targetNode.type);
        const tgtPort = tgtManifest.ports.find(p => p.id === edge.targetHandle);
        if (tgtPort) targetFormat = tgtPort.channelFormat;
      } catch { /* use edge defaults */ }

      const adapter = createChannelAdapter(this.ctx, sourceFormat, targetFormat);

      // Audio connection: use GainNode gate for click-free connect/disconnect
      const gate = this.ctx.createGain();
      gate.gain.value = 0;

      if (adapter) {
        fromNode.connect(gate);
        gate.connect(adapter.input);
        adapter.output.connect(toTarget);
      } else {
        fromNode.connect(gate);
        gate.connect(toTarget);
      }

      gate.gain.setTargetAtTime(1, this.ctx.currentTime, 0.02);
      this.connections.set(edge.id, { gate, from: fromNode, to: toTarget, adapter: adapter ?? undefined });
    }
  }

  private removeConnection(edgeId: string): void {
    const conn = this.connections.get(edgeId);
    if (!conn) return;

    // Clear any pending disconnect timer
    if (conn.disconnectTimer) {
      clearTimeout(conn.disconnectTimer);
    }

    if (conn.to instanceof AudioParam) {
      // Parameter connection: direct disconnect
      try {
        conn.from.disconnect(conn.to);
      } catch (_) { /* already disconnected */ }
      this.connections.delete(edgeId);
    } else if (conn.gate && this.ctx) {
      // Audio connection: ramp down then disconnect
      conn.gate.gain.setTargetAtTime(0, this.ctx.currentTime, 0.02);
      conn.disconnectTimer = setTimeout(() => {
        try {
          conn.from.disconnect(conn.gate);
          conn.gate.disconnect();
          if (conn.adapter) {
            conn.adapter.input.disconnect();
            conn.adapter.output.disconnect();
          }
        } catch (_) { /* already disconnected */ }
        this.connections.delete(edgeId);
      }, 80);
    } else {
      this.connections.delete(edgeId);
    }
  }

  /** Update regions on a track processor */
  updateTrackRegions(trackId: string, regions: Region[]): void {
    const proc = this.processors.get(trackId);
    if (proc?.setRegions) {
      proc.setRegions(regions);
    }
  }

  /** Start playback on all track processors from a given offset */
  startPlayback(offset: number): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (const proc of this.processors.values()) {
      proc.schedulePlayback?.(now, offset);
    }
  }

  /** Stop playback on all track processors */
  stopPlayback(): void {
    for (const proc of this.processors.values()) {
      proc.stopPlayback?.();
    }
  }

  /** Apply mute state by ramping connection gates */
  applyMuteState(muteMap: Map<string, boolean>): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    for (const [edgeId, conn] of this.connections) {
      // Skip parameter connections (no gate)
      if (!conn.gate) continue;

      // Find the source node for this edge
      const edge = this.prevEdges.find(e => e.id === edgeId);
      if (!edge) continue;

      const sourceMuted = muteMap.get(edge.source) ?? false;
      const prevMuted = this.currentMuteState.get(edge.source) ?? false;

      // Only ramp if state changed
      if (sourceMuted !== prevMuted) {
        const target = sourceMuted ? 0 : 1;
        conn.gate.gain.setTargetAtTime(target, now, 0.02);
      }
    }

    this.currentMuteState = new Map(muteMap);
  }

  /** Get a live processor instance by node ID (for metering/visualization) */
  getProcessor(nodeId: string): ProcessorInstance | undefined {
    return this.processors.get(nodeId);
  }

  /** Get the AudioContext currentTime (for position tracking) */
  get currentTime(): number {
    return this.ctx?.currentTime ?? 0;
  }

  dispose(): void {
    for (const edgeId of this.connections.keys()) {
      this.removeConnection(edgeId);
    }
    for (const nodeId of this.processors.keys()) {
      const proc = this.processors.get(nodeId);
      proc?.dispose();
    }
    this.processors.clear();
    this.connections.clear();
    this.ctx?.close();
    this.ctx = null;
  }
}
