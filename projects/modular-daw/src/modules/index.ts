import { registerModule } from './registry';

import { masterOutputManifest } from './master-output/manifest';
import { masterOutputFactory } from './master-output/processor';
import { MasterOutputNode } from './master-output/MasterOutputNode';

import { testToneManifest } from './test-tone/manifest';
import { testToneFactory } from './test-tone/processor';
import { TestToneNode } from './test-tone/TestToneNode';

import { gainManifest } from './gain/manifest';
import { gainFactory } from './gain/processor';
import { GainModuleNode } from './gain/GainModuleNode';

import { trackManifest } from './track/manifest';
import { trackFactory } from './track/processor';
import { TrackNode } from './track/TrackNode';

import { delayManifest } from './delay/manifest';
import { delayFactory } from './delay/processor';
import { DelayModuleNode } from './delay/DelayNode';

import { reverbManifest } from './reverb/manifest';
import { reverbFactory } from './reverb/processor';
import { ReverbModuleNode } from './reverb/ReverbNode';

import { eqManifest } from './eq/manifest';
import { eqFactory } from './eq/processor';
import { EQModuleNode } from './eq/EQNode';

import { splitterManifest } from './splitter/manifest';
import { splitterFactory } from './splitter/processor';
import { SplitterModuleNode } from './splitter/SplitterNode';

import { mergerManifest } from './merger/manifest';
import { mergerFactory } from './merger/processor';
import { MergerModuleNode } from './merger/MergerNode';

import { mixerManifest } from './mixer/manifest';
import { mixerFactory } from './mixer/processor';
import { MixerModuleNode } from './mixer/MixerNode';

import { levelMeterManifest } from './level-meter/manifest';
import { levelMeterFactory } from './level-meter/processor';
import { LevelMeterNode } from './level-meter/LevelMeterNode';

import { spectrumAnalyzerManifest } from './spectrum-analyzer/manifest';
import { spectrumAnalyzerFactory } from './spectrum-analyzer/processor';
import { SpectrumAnalyzerNode } from './spectrum-analyzer/SpectrumAnalyzerNode';

import { compressorManifest } from './compressor/manifest';
import { compressorFactory } from './compressor/processor';
import { CompressorNode } from './compressor/CompressorNode';

import { limiterManifest } from './limiter/manifest';
import { limiterFactory } from './limiter/processor';
import { LimiterNode } from './limiter/LimiterNode';

import { gateManifest } from './gate/manifest';
import { gateFactory } from './gate/processor';
import { GateModuleNode } from './gate/GateNode';

import { expanderManifest } from './expander/manifest';
import { expanderFactory } from './expander/processor';
import { ExpanderModuleNode } from './expander/ExpanderNode';

import { deEsserManifest } from './de-esser/manifest';
import { deEsserFactory } from './de-esser/processor';
import { DeEsserModuleNode } from './de-esser/DeEsserNode';

import { filterManifest } from './filter/manifest';
import { filterFactory } from './filter/processor';
import { FilterModuleNode } from './filter/FilterNode';

import { chorusManifest } from './chorus/manifest';
import { chorusFactory } from './chorus/processor';
import { ChorusModuleNode } from './chorus/ChorusNode';

import { flangerManifest } from './flanger/manifest';
import { flangerFactory } from './flanger/processor';
import { FlangerModuleNode } from './flanger/FlangerNode';

import { phaserManifest } from './phaser/manifest';
import { phaserFactory } from './phaser/processor';
import { PhaserModuleNode } from './phaser/PhaserNode';

import { waveshaperManifest } from './waveshaper/manifest';
import { waveshaperFactory } from './waveshaper/processor';
import { WaveshaperModuleNode } from './waveshaper/WaveshaperNode';

import { bitcrusherManifest } from './bitcrusher/manifest';
import { bitcrusherFactory } from './bitcrusher/processor';
import { BitcrusherModuleNode } from './bitcrusher/BitcrusherNode';

import { tapeSaturationManifest } from './tape-saturation/manifest';
import { tapeSaturationFactory } from './tape-saturation/processor';
import { TapeSaturationModuleNode } from './tape-saturation/TapeSaturationNode';

import { panManifest } from './pan/manifest';
import { panFactory } from './pan/processor';
import { PanModuleNode } from './pan/PanNode';

import { monoSumManifest } from './mono-sum/manifest';
import { monoSumFactory } from './mono-sum/processor';
import { MonoSumModuleNode } from './mono-sum/MonoSumNode';

import { phaseInvertManifest } from './phase-invert/manifest';
import { phaseInvertFactory } from './phase-invert/processor';
import { PhaseInvertModuleNode } from './phase-invert/PhaseInvertNode';

import { dcOffsetManifest } from './dc-offset/manifest';
import { dcOffsetFactory } from './dc-offset/processor';
import { DcOffsetModuleNode } from './dc-offset/DcOffsetNode';

import { abCompareManifest } from './ab-compare/manifest';
import { abCompareFactory } from './ab-compare/processor';
import { AbCompareModuleNode } from './ab-compare/AbCompareNode';

import { oscilloscopeManifest } from './oscilloscope/manifest';
import { oscilloscopeFactory } from './oscilloscope/processor';
import { OscilloscopeModuleNode } from './oscilloscope/OscilloscopeNode';

import { correlationMeterManifest } from './correlation-meter/manifest';
import { correlationMeterFactory } from './correlation-meter/processor';
import { CorrelationMeterModuleNode } from './correlation-meter/CorrelationMeterNode';

import { loudnessMeterManifest } from './loudness-meter/manifest';
import { loudnessMeterFactory } from './loudness-meter/processor';
import { LoudnessMeterModuleNode } from './loudness-meter/LoudnessMeterNode';

// Internal display nodes
import { portNodeManifest } from './internal/port-node/manifest';
import { portNodeFactory } from './internal/port-node/processor';
import { PortNode } from './internal/port-node/PortNode';

// Level 1 functional blocks
import { envelopeDetectorManifest } from './envelope-detector/manifest';
import { envelopeDetectorFactory } from './envelope-detector/processor';
import { EnvelopeDetectorNode } from './envelope-detector/EnvelopeDetectorNode';

import { gainComputerManifest } from './gain-computer/manifest';
import { gainComputerFactory } from './gain-computer/processor';
import { GainComputerNode } from './gain-computer/GainComputerNode';

// Atomic DSP primitives
import { multiplyManifest } from './atomic/multiply/manifest';
import { multiplyFactory } from './atomic/multiply/processor';
import { MultiplyNode } from './atomic/multiply/MultiplyNode';

import { addManifest } from './atomic/add/manifest';
import { addFactory } from './atomic/add/processor';
import { AddNode } from './atomic/add/AddNode';

import { subtractManifest } from './atomic/subtract/manifest';
import { subtractFactory } from './atomic/subtract/processor';
import { SubtractNode } from './atomic/subtract/SubtractNode';

import { absManifest } from './atomic/abs/manifest';
import { absFactory } from './atomic/abs/processor';
import { AbsNode } from './atomic/abs/AbsNode';

import { constantManifest } from './atomic/constant/manifest';
import { constantFactory } from './atomic/constant/processor';
import { ConstantNode } from './atomic/constant/ConstantNode';

import { maxManifest } from './atomic/max/manifest';
import { maxFactory } from './atomic/max/processor';
import { MaxNode } from './atomic/max/MaxNode';

import { unitDelayManifest } from './atomic/unit-delay/manifest';
import { unitDelayFactory } from './atomic/unit-delay/processor';
import { UnitDelayNode } from './atomic/unit-delay/UnitDelayNode';

import { selectorManifest } from './atomic/selector/manifest';
import { selectorFactory } from './atomic/selector/processor';
import { SelectorNode } from './atomic/selector/SelectorNode';

import { dbToLinManifest } from './atomic/db-to-lin/manifest';
import { dbToLinFactory } from './atomic/db-to-lin/processor';
import { DbToLinNode } from './atomic/db-to-lin/DbToLinNode';

import { linToDbManifest } from './atomic/lin-to-db/manifest';
import { linToDbFactory } from './atomic/lin-to-db/processor';
import { LinToDbNode } from './atomic/lin-to-db/LinToDbNode';

import { compareGtManifest } from './atomic/compare-gt/manifest';
import { compareGtFactory } from './atomic/compare-gt/processor';
import { CompareGtNode } from './atomic/compare-gt/CompareGtNode';

import { probeManifest } from './atomic/probe/manifest';
import { probeFactory } from './atomic/probe/processor';
import { ProbeNode } from './atomic/probe/ProbeNode';

import { metronomeManifest } from './metronome/manifest';
import { metronomeFactory } from './metronome/processor';
import { MetronomeNode } from './metronome/MetronomeNode';

/** Register all built-in modules. Call once at startup. */
export function registerAllModules(): void {
  registerModule({
    manifest: masterOutputManifest,
    factory: masterOutputFactory,
    component: MasterOutputNode,
  });
  registerModule({
    manifest: testToneManifest,
    factory: testToneFactory,
    component: TestToneNode,
  });
  registerModule({
    manifest: gainManifest,
    factory: gainFactory,
    component: GainModuleNode,
  });
  registerModule({
    manifest: trackManifest,
    factory: trackFactory,
    component: TrackNode,
  });
  registerModule({
    manifest: delayManifest,
    factory: delayFactory,
    component: DelayModuleNode,
  });
  registerModule({
    manifest: reverbManifest,
    factory: reverbFactory,
    component: ReverbModuleNode,
  });
  registerModule({
    manifest: eqManifest,
    factory: eqFactory,
    component: EQModuleNode,
  });
  registerModule({
    manifest: splitterManifest,
    factory: splitterFactory,
    component: SplitterModuleNode,
  });
  registerModule({
    manifest: mergerManifest,
    factory: mergerFactory,
    component: MergerModuleNode,
  });
  registerModule({
    manifest: mixerManifest,
    factory: mixerFactory,
    component: MixerModuleNode,
  });
  registerModule({
    manifest: levelMeterManifest,
    factory: levelMeterFactory,
    component: LevelMeterNode,
  });
  registerModule({
    manifest: spectrumAnalyzerManifest,
    factory: spectrumAnalyzerFactory,
    component: SpectrumAnalyzerNode,
  });
  registerModule({
    manifest: compressorManifest,
    factory: compressorFactory,
    component: CompressorNode,
  });
  registerModule({
    manifest: limiterManifest,
    factory: limiterFactory,
    component: LimiterNode,
  });
  registerModule({
    manifest: gateManifest,
    factory: gateFactory,
    component: GateModuleNode,
  });
  registerModule({
    manifest: expanderManifest,
    factory: expanderFactory,
    component: ExpanderModuleNode,
  });
  registerModule({
    manifest: deEsserManifest,
    factory: deEsserFactory,
    component: DeEsserModuleNode,
  });
  registerModule({
    manifest: filterManifest,
    factory: filterFactory,
    component: FilterModuleNode,
  });
  registerModule({
    manifest: chorusManifest,
    factory: chorusFactory,
    component: ChorusModuleNode,
  });
  registerModule({
    manifest: flangerManifest,
    factory: flangerFactory,
    component: FlangerModuleNode,
  });
  registerModule({
    manifest: phaserManifest,
    factory: phaserFactory,
    component: PhaserModuleNode,
  });
  registerModule({
    manifest: waveshaperManifest,
    factory: waveshaperFactory,
    component: WaveshaperModuleNode,
  });
  registerModule({
    manifest: bitcrusherManifest,
    factory: bitcrusherFactory,
    component: BitcrusherModuleNode,
  });
  registerModule({
    manifest: tapeSaturationManifest,
    factory: tapeSaturationFactory,
    component: TapeSaturationModuleNode,
  });
  registerModule({
    manifest: panManifest,
    factory: panFactory,
    component: PanModuleNode,
  });
  registerModule({
    manifest: monoSumManifest,
    factory: monoSumFactory,
    component: MonoSumModuleNode,
  });
  registerModule({
    manifest: phaseInvertManifest,
    factory: phaseInvertFactory,
    component: PhaseInvertModuleNode,
  });
  registerModule({
    manifest: dcOffsetManifest,
    factory: dcOffsetFactory,
    component: DcOffsetModuleNode,
  });
  registerModule({
    manifest: abCompareManifest,
    factory: abCompareFactory,
    component: AbCompareModuleNode,
  });
  registerModule({
    manifest: oscilloscopeManifest,
    factory: oscilloscopeFactory,
    component: OscilloscopeModuleNode,
  });
  registerModule({
    manifest: correlationMeterManifest,
    factory: correlationMeterFactory,
    component: CorrelationMeterModuleNode,
  });
  registerModule({
    manifest: loudnessMeterManifest,
    factory: loudnessMeterFactory,
    component: LoudnessMeterModuleNode,
  });
  registerModule({
    manifest: metronomeManifest,
    factory: metronomeFactory,
    component: MetronomeNode,
  });

  // Internal display nodes
  registerModule({ manifest: portNodeManifest, factory: portNodeFactory, component: PortNode });

  // Level 1 functional blocks
  registerModule({ manifest: envelopeDetectorManifest, factory: envelopeDetectorFactory, component: EnvelopeDetectorNode });
  registerModule({ manifest: gainComputerManifest, factory: gainComputerFactory, component: GainComputerNode });

  // Atomic DSP primitives
  registerModule({ manifest: multiplyManifest, factory: multiplyFactory, component: MultiplyNode });
  registerModule({ manifest: addManifest, factory: addFactory, component: AddNode });
  registerModule({ manifest: subtractManifest, factory: subtractFactory, component: SubtractNode });
  registerModule({ manifest: absManifest, factory: absFactory, component: AbsNode });
  registerModule({ manifest: constantManifest, factory: constantFactory, component: ConstantNode });
  registerModule({ manifest: maxManifest, factory: maxFactory, component: MaxNode });
  registerModule({ manifest: unitDelayManifest, factory: unitDelayFactory, component: UnitDelayNode });
  registerModule({ manifest: selectorManifest, factory: selectorFactory, component: SelectorNode });
  registerModule({ manifest: dbToLinManifest, factory: dbToLinFactory, component: DbToLinNode });
  registerModule({ manifest: linToDbManifest, factory: linToDbFactory, component: LinToDbNode });
  registerModule({ manifest: compareGtManifest, factory: compareGtFactory, component: CompareGtNode });
  registerModule({ manifest: probeManifest, factory: probeFactory, component: ProbeNode });
}

/** Lookup table of all module registrations keyed by type string. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const moduleTable: Record<string, { manifest: any; factory: any; component: any }> = {
  'master-output': { manifest: masterOutputManifest, factory: masterOutputFactory, component: MasterOutputNode },
  'test-tone': { manifest: testToneManifest, factory: testToneFactory, component: TestToneNode },
  'gain': { manifest: gainManifest, factory: gainFactory, component: GainModuleNode },
  'track': { manifest: trackManifest, factory: trackFactory, component: TrackNode },
  'delay': { manifest: delayManifest, factory: delayFactory, component: DelayModuleNode },
  'reverb': { manifest: reverbManifest, factory: reverbFactory, component: ReverbModuleNode },
  'eq': { manifest: eqManifest, factory: eqFactory, component: EQModuleNode },
  'splitter': { manifest: splitterManifest, factory: splitterFactory, component: SplitterModuleNode },
  'merger': { manifest: mergerManifest, factory: mergerFactory, component: MergerModuleNode },
  'mixer': { manifest: mixerManifest, factory: mixerFactory, component: MixerModuleNode },
  'level-meter': { manifest: levelMeterManifest, factory: levelMeterFactory, component: LevelMeterNode },
  'spectrum-analyzer': { manifest: spectrumAnalyzerManifest, factory: spectrumAnalyzerFactory, component: SpectrumAnalyzerNode },
  'compressor': { manifest: compressorManifest, factory: compressorFactory, component: CompressorNode },
  'limiter': { manifest: limiterManifest, factory: limiterFactory, component: LimiterNode },
  'gate': { manifest: gateManifest, factory: gateFactory, component: GateModuleNode },
  'expander': { manifest: expanderManifest, factory: expanderFactory, component: ExpanderModuleNode },
  'de-esser': { manifest: deEsserManifest, factory: deEsserFactory, component: DeEsserModuleNode },
  'filter': { manifest: filterManifest, factory: filterFactory, component: FilterModuleNode },
  'chorus': { manifest: chorusManifest, factory: chorusFactory, component: ChorusModuleNode },
  'flanger': { manifest: flangerManifest, factory: flangerFactory, component: FlangerModuleNode },
  'phaser': { manifest: phaserManifest, factory: phaserFactory, component: PhaserModuleNode },
  'waveshaper': { manifest: waveshaperManifest, factory: waveshaperFactory, component: WaveshaperModuleNode },
  'bitcrusher': { manifest: bitcrusherManifest, factory: bitcrusherFactory, component: BitcrusherModuleNode },
  'tape-saturation': { manifest: tapeSaturationManifest, factory: tapeSaturationFactory, component: TapeSaturationModuleNode },
  'pan': { manifest: panManifest, factory: panFactory, component: PanModuleNode },
  'mono-sum': { manifest: monoSumManifest, factory: monoSumFactory, component: MonoSumModuleNode },
  'phase-invert': { manifest: phaseInvertManifest, factory: phaseInvertFactory, component: PhaseInvertModuleNode },
  'dc-offset': { manifest: dcOffsetManifest, factory: dcOffsetFactory, component: DcOffsetModuleNode },
  'ab-compare': { manifest: abCompareManifest, factory: abCompareFactory, component: AbCompareModuleNode },
  'oscilloscope': { manifest: oscilloscopeManifest, factory: oscilloscopeFactory, component: OscilloscopeModuleNode },
  'correlation-meter': { manifest: correlationMeterManifest, factory: correlationMeterFactory, component: CorrelationMeterModuleNode },
  'loudness-meter': { manifest: loudnessMeterManifest, factory: loudnessMeterFactory, component: LoudnessMeterModuleNode },
  'metronome': { manifest: metronomeManifest, factory: metronomeFactory, component: MetronomeNode },
  'port-node': { manifest: portNodeManifest, factory: portNodeFactory, component: PortNode },
  'envelope-detector': { manifest: envelopeDetectorManifest, factory: envelopeDetectorFactory, component: EnvelopeDetectorNode },
  'gain-computer': { manifest: gainComputerManifest, factory: gainComputerFactory, component: GainComputerNode },
  'atomic-multiply': { manifest: multiplyManifest, factory: multiplyFactory, component: MultiplyNode },
  'atomic-add': { manifest: addManifest, factory: addFactory, component: AddNode },
  'atomic-subtract': { manifest: subtractManifest, factory: subtractFactory, component: SubtractNode },
  'atomic-abs': { manifest: absManifest, factory: absFactory, component: AbsNode },
  'atomic-constant': { manifest: constantManifest, factory: constantFactory, component: ConstantNode },
  'atomic-max': { manifest: maxManifest, factory: maxFactory, component: MaxNode },
  'atomic-unit-delay': { manifest: unitDelayManifest, factory: unitDelayFactory, component: UnitDelayNode },
  'atomic-selector': { manifest: selectorManifest, factory: selectorFactory, component: SelectorNode },
  'atomic-db-to-lin': { manifest: dbToLinManifest, factory: dbToLinFactory, component: DbToLinNode },
  'atomic-lin-to-db': { manifest: linToDbManifest, factory: linToDbFactory, component: LinToDbNode },
  'atomic-compare-gt': { manifest: compareGtManifest, factory: compareGtFactory, component: CompareGtNode },
  'atomic-probe': { manifest: probeManifest, factory: probeFactory, component: ProbeNode },
};

/** Resolve composite module dependencies (e.g., compressor needs envelope-detector, gain-computer, etc.) */
function collectDependencies(types: string[]): string[] {
  const all = new Set(types);
  // Always include port-node for composite internals
  all.add('port-node');
  for (const type of all) {
    const entry = moduleTable[type];
    if (entry?.manifest.composition?.internalGraph) {
      for (const node of entry.manifest.composition.internalGraph.nodes) {
        all.add(node.moduleType);
      }
    }
  }
  return Array.from(all);
}

/** Register only the specified module types (plus their composite dependencies). */
export function registerModules(types: string[]): void {
  const resolved = collectDependencies(types);
  for (const type of resolved) {
    const entry = moduleTable[type];
    if (entry) {
      registerModule(entry);
    } else {
      console.warn(`registerModules: unknown module type "${type}"`);
    }
  }
}
