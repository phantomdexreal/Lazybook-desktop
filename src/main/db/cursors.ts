/*
LazyBooks | src/main/db/cursors.ts
Responsibility: Upsert layer + change tracking - per-device cursors and tombstone pruning
Introduced by: Phase 16 (upsert-layer)
STATUS: IMPLEMENTED (Phase 16)
A cursor is a vault change sequence number: "this device has everything up to and including seq N". The scheduler/serve code (Phase 18/22)
moves it only after the device applied the last chunk (SYNC_SPEC section 7). Cursor 0 = nothing sent yet (a new device gets an initial sync, not a delta).
*/

import type { Database } from 'better-sqlite3';
import { headSeq, setMeta, tombstoneFloor } from './seq';

export interface Cursors {
  /** Cursor of a device (0 when unknown). */
  cursor(deviceId: string): number;
  /** Moves a device cursor forward (never back, never past the head). Returns the stored value. */
  setCursor(deviceId: string, seq: number, now?: Date): number;
  /** Forgets a device (revoked or removed). */
  dropDevice(deviceId: string): void;
  /** Lowest cursor over all devices, or null when none is known. */
  minCursor(): number | null;
  /** Deletes tombstones every known device has already received; returns how many. No devices = nothing is pruned. */
  pruneTombstones(): number;
}

function check(deviceId: string): void {
  if (typeof deviceId !== 'string' || deviceId.length === 0 || deviceId.length > 200) throw new Error('Invalid device id');
}

export function createCursors(db: Database): Cursors {
  const api: Cursors = {
    cursor(deviceId) {
      check(deviceId);
      const r = db.prepare(`SELECT "cursor" FROM "_lb_device_cursors" WHERE "device_id" = ?`).get(deviceId) as { cursor: number } | undefined;
      return r ? Number(r.cursor) : 0;
    },
    setCursor(deviceId, seq, now = new Date()) {
      check(deviceId);
      if (!Number.isInteger(seq) || seq < 0) throw new Error('Invalid cursor');
      return db.transaction(() => {
        if (seq > headSeq(db)) throw new Error('Cursor is ahead of the vault');
        const cur = api.cursor(deviceId);
        const next = Math.max(cur, seq);
        db.prepare(`INSERT OR REPLACE INTO "_lb_device_cursors" ("device_id","cursor","updated_at") VALUES (?,?,?)`).run(deviceId, next, now.toISOString());
        return next;
      })();
    },
    dropDevice(deviceId) {
      check(deviceId);
      db.prepare(`DELETE FROM "_lb_device_cursors" WHERE "device_id" = ?`).run(deviceId);
    },
    minCursor() {
      const r = db.prepare(`SELECT MIN("cursor") AS m, COUNT(*) AS c FROM "_lb_device_cursors"`).get() as { m: number | null; c: number };
      return r.c === 0 || r.m === null ? null : Number(r.m);
    },
    pruneTombstones() {
      return db.transaction(() => {
        const m = api.minCursor();
        if (m === null) return 0;
        const n = db.prepare(`DELETE FROM "_lb_row_state" WHERE "deleted" = 1 AND "updated_seq" <= ?`).run(m).changes;
        if (m > tombstoneFloor(db)) setMeta(db, 'tombstone_floor', String(m));
        return n;
      })();
    },
  };
  return api;
}
