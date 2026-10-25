/*
LazyBooks | src/main/db/seq.ts
Responsibility: Upsert layer + change tracking - the vault-wide change counter and small meta helpers
Introduced by: Phase 16 (upsert-layer)
STATUS: IMPLEMENTED (Phase 16)
`change_seq` only ever grows. `tombstone_floor` = highest seq whose tombstones were discarded: a device cursor below it cannot be served as a delta.
*/

import type { Database } from 'better-sqlite3';

export function getMeta(db: Database, key: string): string | null {
  const r = db.prepare(`SELECT "value" FROM "_lb_vault_meta" WHERE "key" = ?`).get(key) as { value: string } | undefined;
  return r ? r.value : null;
}

export function setMeta(db: Database, key: string, value: string): void {
  db.prepare(`INSERT OR REPLACE INTO "_lb_vault_meta" ("key","value") VALUES (?,?)`).run(key, value);
}

export function headSeq(db: Database): number {
  return Number(getMeta(db, 'change_seq') ?? 0);
}

export function tombstoneFloor(db: Database): number {
  return Number(getMeta(db, 'tombstone_floor') ?? 0);
}
