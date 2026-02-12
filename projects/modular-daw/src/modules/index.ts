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
}
