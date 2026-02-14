export interface PatchSheetMetadata {
  venue: string;
  date: string;
  fohEngineer: string;
  monitorEngineer: string;
  notes: string;
}

export type MicType = 'dynamic' | 'condenser' | 'di' | 'ribbon' | 'wireless' | '';
export type ConnectionType = 'analog-snake' | 'dante' | 'direct' | '';

export interface InputChannel {
  id: string;
  channelNumber: string;
  name: string;
  micType: MicType;
  device: string;
  phantom: boolean;
  connection: ConnectionType;
  connectionDetails: string;
  notes: string;
  isStereo: boolean;
  stereoChannelNumber: string;
}

export interface OutputChannel {
  id: string;
  channelNumber: string;
  name: string;
  sourceType: string;
  sourceDetails: string;
  destinationType: string;
  destinationGear: string;
  notes: string;
}

export interface PatchSheetDoc {
  version: 1;
  type: 'patch-sheet';
  metadata: PatchSheetMetadata;
  inputs: InputChannel[];
  outputs: OutputChannel[];
}
