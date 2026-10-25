/*
LazyBooks | src/main/db/index.ts
Responsibility: SQLite schema + migrations - public surface of the vault module
Introduced by: Phase 15 (sqlite-schema)
STATUS: IMPLEMENTED (Phase 15)
*/

export { openVault, deleteVaultFiles, vaultPath, VAULT_FILE, BACKUP_DIR } from './vault';
export type { Vault, VaultInfo, OpenVaultOptions, IntegrityResult } from './vault';
export { migrate, seedReference, currentVersion, MIGRATIONS } from './migrate';
export type { Migration, MigrateResult } from './migrate';
export { schemaSql, schemaStatements, schemaHash } from './schema';
export { createUpsertLayer } from './upsert';
export type { UpsertLayer, VaultOp, OpResult, ChangedBatch, ChangedSince } from './upsert';
export { createCursors } from './cursors';
export type { Cursors } from './cursors';
export { toMinor, fromMinor } from './codec';
export type { Row } from './codec';
export { dataModel } from './model';
