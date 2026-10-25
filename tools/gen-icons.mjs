// LazyBooks | tools/gen-icons.mjs
// Generates the neutral placeholder installer icons (violet rounded square with a pixel "LB").
// The owner replaces build/icon.png and build/icon.ico with real artwork; this script is only a fallback.
// Usage: node tools/gen-icons.mjs
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'build');
const L = ['10000', '10000', '10000', '10000', '10000', '10000', '11111'];
const B = ['11110', '10001', '10001', '11110', '10001', '10001', '11110'];

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

/** RGBA pixels of the placeholder at `size` px. */
function render(size) {
  const px = Buffer.alloc(size * size * 4, 0);
  const put = (x, y, r, g, b) => { const i = (y * size + x) * 4; px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = 255; };
  const radius = size * 0.22;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = Math.max(radius - x - 0.5, x + 0.5 - (size - radius), 0);
      const dy = Math.max(radius - y - 0.5, y + 0.5 - (size - radius), 0);
      if (dx * dx + dy * dy <= radius * radius) put(x, y, 109, 40, 217);
    }
  }
  // Two 5x7 glyphs side by side with a 1-cell gap: 11 cells wide, 7 tall.
  const cell = Math.max(1, Math.floor(size / 16));
  const w = 11 * cell, h = 7 * cell;
  const ox = Math.floor((size - w) / 2), oy = Math.floor((size - h) / 2);
  const glyph = (rows, gx) => rows.forEach((row, ry) => [...row].forEach((c, rx) => {
    if (c !== '1') return;
    for (let yy = 0; yy < cell; yy++) for (let xx = 0; xx < cell; xx++) put(ox + (gx + rx) * cell + xx, oy + ry * cell + yy, 255, 255, 255);
  }));
  glyph(L, 0); glyph(B, 6);
  return px;
}

function png(size) {
  const px = render(size);
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) { raw[y * (size * 4 + 1)] = 0; px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4); }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

/** ICO with PNG-compressed images (supported since Windows Vista). */
function ico(sizes) {
  const imgs = sizes.map((s) => png(s));
  const head = Buffer.alloc(6); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length;
  const dir = sizes.map((s, i) => {
    const e = Buffer.alloc(16);
    e[0] = s >= 256 ? 0 : s; e[1] = s >= 256 ? 0 : s; e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
    e.writeUInt32LE(imgs[i].length, 8); e.writeUInt32LE(offset, 12);
    offset += imgs[i].length;
    return e;
  });
  return Buffer.concat([head, ...dir, ...imgs]);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'icon.png'), png(512));
writeFileSync(join(outDir, 'icon.ico'), ico([16, 24, 32, 48, 64, 128, 256]));
console.log('wrote build/icon.png and build/icon.ico (placeholder)');
