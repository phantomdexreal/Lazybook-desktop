/*
LazyBooks | src/main/tools.ts
Responsibility: Maintenance tools - full resync, reset vault, diagnostics bundle, open data folder
Introduced by: Phase 37 (ui-tools)
STATUS: IMPLEMENTED (Phase 37)
*/

/**
 * Self-service recovery. No Electron import: the vault swap, the scheduler, the file dialog and the shell are injected.
 *
 *  - fullResync: forget the sync memory so the next cycle pulls every master and the whole books window again
 *    (assessment `first_sync`, vault kept: rows are replaced by key, stale rows and deleted vouchers are removed by the
 *    scheduler's own rules). Paired devices keep their position and only receive what changed.
 *  - resetVault: wait for a running cycle, close the vault, delete the database file, its WAL files and the rolling
 *    backups, open a fresh empty vault and start a sync. Every device cursor is gone with the file, so each device gets a
 *    full copy on its next request. Config, license, login, passphrase and pairing are untouched.
 *  - exportDiagnostics: one ZIP with a redacted summary and the redacted logs; never the vault, never secrets.
 *  - openDataFolder: opens the data folder in the file manager; the renderer cannot choose a path.
 */
import { createZip } from './zip';

export type ToolResult = { ok: true; message: string; path?: string } | { ok: false; code: string; message: string; canceled?: boolean };

export interface VaultHandle {
  db: unknown;
  close(): void;
}

export interface ToolsDeps<V extends VaultHandle = VaultHandle> {
  getVault(): V | null;
  /** swap the vault held by the app (null while it is being replaced) */
  setVault(v: V | null): void;
  /** open a fresh vault in the vault folder after the files were deleted (throws when it cannot) */
  openVault(): V;
  /** delete the database, its WAL files and the backups */
  deleteVaultFiles(): void;
  /** make the next sync cycle a full one (scheduler memory) */
  forgetSyncMemory(v: V): void;
  /** start a sync now; not awaited by the tools except to join a cycle that is already running */
  syncNow(): Promise<unknown>;
  syncRunning(): boolean;
  /** the folder the person is allowed to open */
  dataFolder(): string;
  openPath(path: string): Promise<string>;
  /** where to save the diagnostics zip: the native dialog; null = canceled */
  chooseZipPath(defaultName: string): Promise<string | null>;
  writeFile(path: string, data: Buffer): void;
  /** every kept log file, redacted, oldest first, as text */
  logsText(): string;
  /** summary object for diagnostics.json (no secrets are expected; masked again here) */
  summary(): Record<string, unknown>;
  /** mask license keys, e-mails and tokens in text (logs.ts maskText) */
  mask(text: string): string;
  log?(msg: string, data?: Record<string, unknown>): void;
  now?: () => number;
}

const fail = (code: string, message: string): ToolResult => ({ ok: false, code, message });

export function createTools<V extends VaultHandle>(d: ToolsDeps<V>) {
  const log = d.log ?? (() => undefined);
  const now = d.now ?? Date.now;
  let busy = false;

  async function exclusive(fn: () => Promise<ToolResult>): Promise<ToolResult> {
    if (busy) return fail('BUSY', 'Another maintenance action is still running. Wait for it to finish.');
    busy = true;
    try {
      return await fn();
    } finally {
      busy = false;
    }
  }

  function fullResync(): Promise<ToolResult> {
    return exclusive(async () => {
      const v = d.getVault();
      if (!v) return fail('VAULT_CLOSED', 'The local data store is not open, so there is nothing to refresh. Restart LazyBooks, or use Reset vault.');
      try {
        d.forgetSyncMemory(v);
      } catch (e) {
        log('full resync failed', { message: (e as Error).message });
        return fail('FAILED', 'The resync could not be prepared. Try again.');
      }
      void d.syncNow().catch(() => undefined);
      log('full resync requested');
      return { ok: true, message: 'A full resync has started. Every master and the whole financial year are read from Tally again. Progress shows on the Status page.' };
    });
  }

  function resetVault(input: unknown): Promise<ToolResult> {
    return exclusive(async () => {
      if (!input || typeof input !== 'object' || (input as { confirm?: unknown }).confirm !== 'RESET') {
        return fail('NOT_CONFIRMED', 'Reset was not confirmed, nothing was changed.');
      }
      // Let a running cycle finish first: it holds the open vault. Nothing awaits between the last check and the swap below.
      for (let i = 0; i < 20 && d.syncRunning(); i++) await d.syncNow().catch(() => undefined);
      if (d.syncRunning()) return fail('SYNC_RUNNING', 'A sync is still running. Try again in a minute.');
      const old = d.getVault();
      d.setVault(null);
      try {
        old?.close();
      } catch {
        /* a vault that cannot close is deleted anyway */
      }
      try {
        d.deleteVaultFiles();
      } catch (e) {
        log('vault reset: delete failed', { message: (e as Error).message });
        try {
          d.setVault(d.openVault());
        } catch {
          /* stays closed; the message below says so */
        }
        return fail('DELETE_FAILED', 'The local data could not be deleted (is another program using the file?). Nothing was lost; try again after closing other programs.');
      }
      try {
        d.setVault(d.openVault());
      } catch (e) {
        log('vault reset: reopen failed', { message: (e as Error).message });
        return fail('REOPEN_FAILED', 'The old data was deleted but a new store could not be created. Restart LazyBooks to try again.');
      }
      void d.syncNow().catch(() => undefined);
      log('vault reset');
      return { ok: true, message: 'The local data was deleted and a fresh sync has started. Paired devices receive a full copy on their next sync. Your license, login and passphrase were kept.' };
    });
  }

  function exportDiagnostics(): Promise<ToolResult> {
    return exclusive(async () => {
      const stamp = new Date(now()).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
      let dest: string | null;
      try {
        dest = await d.chooseZipPath(`lazybooks-diagnostics-${stamp}.zip`);
      } catch {
        return fail('FAILED', 'The save dialog could not be shown.');
      }
      if (!dest) return { ok: false, code: 'CANCELED', message: 'Export canceled.', canceled: true };
      try {
        const summary = d.mask(JSON.stringify({ generatedAt: new Date(now()).toISOString(), ...d.summary() }, null, 2));
        const logs = d.mask(d.logsText());
        const readme =
          'LazyBooks diagnostics\n\n' +
          'diagnostics.json  app and system summary (no company data, no secrets)\n' +
          'logs.txt          the kept log files, oldest first, secrets masked\n\n' +
          'The data store (vault), configuration file, license key and passphrase are not included.\n';
        const zip = createZip([
          { name: 'README.txt', data: readme },
          { name: 'diagnostics.json', data: summary },
          { name: 'logs.txt', data: logs },
        ]);
        d.writeFile(dest, zip);
        log('diagnostics exported', { bytes: zip.length });
        return { ok: true, message: 'Diagnostics saved. Send the file to support; it holds no secrets or company data.', path: dest };
      } catch (e) {
        log('diagnostics export failed', { message: (e as Error).message });
        return fail('FAILED', 'The diagnostics file could not be saved. Choose another folder and try again.');
      }
    });
  }

  async function openDataFolder(): Promise<ToolResult> {
    try {
      const err = await d.openPath(d.dataFolder());
      if (err) {
        log('open data folder failed');
        return fail('FAILED', 'The folder could not be opened.');
      }
      return { ok: true, message: 'Opened the data folder.' };
    } catch {
      return fail('FAILED', 'The folder could not be opened.');
    }
  }

  return { fullResync, resetVault, exportDiagnostics, openDataFolder };
}

export type Tools = ReturnType<typeof createTools>;
