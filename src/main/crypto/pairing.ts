/*
LazyBooks | src/main/crypto/pairing.ts
Responsibility: Pairing link and QR for new devices
Introduced by: Phase 21 (encryption) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 21)
*/

/**
 * Pairing QR payload (SHARED_CONTRACTS section 7): `lazybooks://pair?l=<license_key>&s=<salt_b64url>&c=<kcv_b64url>`.
 * It carries NO secret; the user still types the passphrase on the new device. The optional in-person key mode
 * (`&k=&exp=`) is deliberately not built here.
 */
import qrcode from 'qrcode-generator';
import { fromB64Url, toB64Url } from './envelope';

export function pairingUri(licenseKey: string, saltB64: string, kcvB64: string): string {
  return `lazybooks://pair?l=${encodeURIComponent(licenseKey)}&s=${toB64Url(Buffer.from(saltB64, 'base64'))}&c=${toB64Url(Buffer.from(kcvB64, 'base64'))}`;
}

export interface PairingParts {
  licenseKey: string;
  saltB64: string;
  kcv: string;
}

/** Reads a pairing link back (used by tests and by anything that must show what a QR contains). Null when malformed. */
export function parsePairingUri(uri: string): PairingParts | null {
  const m = /^lazybooks:\/\/pair\?(.*)$/.exec(uri);
  if (!m) return null;
  const q = new URLSearchParams(m[1]);
  const l = q.get('l');
  const s = q.get('s');
  const c = q.get('c');
  if (!l || !s || !c) return null;
  return { licenseKey: l, saltB64: fromB64Url(s).toString('base64'), kcv: fromB64Url(c).toString('base64') };
}

/** SVG of the QR for the link. Colours use currentColor so the renderer's theme tokens decide them. */
export function pairingQrSvg(uri: string): string {
  const qr = qrcode(0, 'M');
  qr.addData(uri);
  qr.make();
  const n = qr.getModuleCount();
  const quiet = 2;
  const size = n + quiet * 2;
  let path = '';
  for (let r = 0; r < n; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (qr.isDark(r, c)) path += `M${c + quiet} ${r + quiet}h1v1h-1z`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" role="img" aria-label="Pairing QR code"><path fill="currentColor" d="${path}"/></svg>`;
}
