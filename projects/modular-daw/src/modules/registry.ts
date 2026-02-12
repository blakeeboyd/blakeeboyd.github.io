import type { ComponentType } from 'react';
import type { ModuleManifest } from '../types/modules';
import type { ProcessorFactory } from '../types/audio';

interface ModuleRegistration {
  manifest: ModuleManifest;
  factory: ProcessorFactory;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
}

const registry = new Map<string, ModuleRegistration>();

export function registerModule(reg: ModuleRegistration): void {
  registry.set(reg.manifest.type, reg);
}

export function getManifest(type: string): ModuleManifest {
  const reg = registry.get(type);
  if (!reg) throw new Error(`Unknown module type: ${type}`);
  return reg.manifest;
}

export function getProcessorFactory(type: string): ProcessorFactory {
  const reg = registry.get(type);
  if (!reg) throw new Error(`Unknown module type: ${type}`);
  return reg.factory;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNodeTypes(): Record<string, ComponentType<any>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const types: Record<string, ComponentType<any>> = {};
  for (const [key, reg] of registry) {
    types[key] = reg.component;
  }
  return types;
}

export function getAllManifests(): ModuleManifest[] {
  return Array.from(registry.values()).map(r => r.manifest);
}
