/*
LazyBooks | src/main/entries/masters/index.ts
Responsibility: public surface of the master writers (ledger and stock item creation)
Introduced by: Phase 26 (master-writers)
STATUS: IMPLEMENTED (Phase 26)
*/
export { buildMasterImport } from './build';
export type { MasterEnvelope } from './build';
export { validateMasterEntry, duplicateOf } from './validate';
export type { MasterInput, MasterValidation } from './validate';
export { masterLookupFromTables } from './lookup';
export { MASTER_KINDS } from './types';
export type { ExistingMaster, MasterKind, MasterLookup, MasterResult } from './types';
