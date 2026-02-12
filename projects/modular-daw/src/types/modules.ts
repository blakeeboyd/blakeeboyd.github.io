import type { PortDef, ParameterDef } from './graph';

/** Module manifest: static declaration of what a module type provides */
export interface ModuleManifest {
  type: string;
  label: string;
  category: 'io' | 'utility' | 'generator' | 'effect';
  ports: PortDef[];
  parameters: ParameterDef[];
  singleton?: boolean;
}
