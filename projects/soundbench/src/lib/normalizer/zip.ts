/**
 * Minimal ZIP encoder using STORE compression (no DEFLATE).
 * WAV files don't compress meaningfully, so STORE is the right choice
 * and avoids any dependency on a compression library.
 */

interface ZipEntry {
  name: string;
  data: ArrayBuffer;
}

// CRC-32 lookup table (IEEE polynomial)
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[i] = c;
}

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function encodeUtf8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export function createZip(entries: ZipEntry[]): ArrayBuffer {
  // Calculate total size for pre-allocation
  // Each entry: local header (30 + nameLen) + data + central dir entry (46 + nameLen)
  // End of central directory: 22 bytes
  let totalSize = 22; // EOCD
  for (const entry of entries) {
    const nameBytes = encodeUtf8(entry.name);
    totalSize += 30 + nameBytes.length + entry.data.byteLength; // local header + data
    totalSize += 46 + nameBytes.length; // central directory entry
  }

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  let offset = 0;

  const centralDirEntries: { nameBytes: Uint8Array; crc: number; size: number; localOffset: number }[] = [];

  // Write local file headers + data
  for (const entry of entries) {
    const nameBytes = encodeUtf8(entry.name);
    const data = new Uint8Array(entry.data);
    const crc = crc32(data);
    const localOffset = offset;

    // Local file header signature
    view.setUint32(offset, 0x04034b50, true); offset += 4;
    // Version needed to extract (2.0)
    view.setUint16(offset, 20, true); offset += 2;
    // General purpose bit flag
    view.setUint16(offset, 0, true); offset += 2;
    // Compression method (0 = STORE)
    view.setUint16(offset, 0, true); offset += 2;
    // Last mod file time
    view.setUint16(offset, 0, true); offset += 2;
    // Last mod file date
    view.setUint16(offset, 0, true); offset += 2;
    // CRC-32
    view.setUint32(offset, crc, true); offset += 4;
    // Compressed size (same as uncompressed for STORE)
    view.setUint32(offset, data.length, true); offset += 4;
    // Uncompressed size
    view.setUint32(offset, data.length, true); offset += 4;
    // File name length
    view.setUint16(offset, nameBytes.length, true); offset += 2;
    // Extra field length
    view.setUint16(offset, 0, true); offset += 2;
    // File name
    bytes.set(nameBytes, offset); offset += nameBytes.length;
    // File data
    bytes.set(data, offset); offset += data.length;

    centralDirEntries.push({ nameBytes, crc, size: data.length, localOffset });
  }

  // Write central directory
  const centralDirOffset = offset;

  for (const entry of centralDirEntries) {
    // Central directory file header signature
    view.setUint32(offset, 0x02014b50, true); offset += 4;
    // Version made by (2.0)
    view.setUint16(offset, 20, true); offset += 2;
    // Version needed to extract (2.0)
    view.setUint16(offset, 20, true); offset += 2;
    // General purpose bit flag
    view.setUint16(offset, 0, true); offset += 2;
    // Compression method (0 = STORE)
    view.setUint16(offset, 0, true); offset += 2;
    // Last mod file time
    view.setUint16(offset, 0, true); offset += 2;
    // Last mod file date
    view.setUint16(offset, 0, true); offset += 2;
    // CRC-32
    view.setUint32(offset, entry.crc, true); offset += 4;
    // Compressed size
    view.setUint32(offset, entry.size, true); offset += 4;
    // Uncompressed size
    view.setUint32(offset, entry.size, true); offset += 4;
    // File name length
    view.setUint16(offset, entry.nameBytes.length, true); offset += 2;
    // Extra field length
    view.setUint16(offset, 0, true); offset += 2;
    // File comment length
    view.setUint16(offset, 0, true); offset += 2;
    // Disk number start
    view.setUint16(offset, 0, true); offset += 2;
    // Internal file attributes
    view.setUint16(offset, 0, true); offset += 2;
    // External file attributes
    view.setUint32(offset, 0, true); offset += 4;
    // Relative offset of local header
    view.setUint32(offset, entry.localOffset, true); offset += 4;
    // File name
    bytes.set(entry.nameBytes, offset); offset += entry.nameBytes.length;
  }

  const centralDirSize = offset - centralDirOffset;

  // End of central directory record
  view.setUint32(offset, 0x06054b50, true); offset += 4;
  // Number of this disk
  view.setUint16(offset, 0, true); offset += 2;
  // Disk where central directory starts
  view.setUint16(offset, 0, true); offset += 2;
  // Number of central directory records on this disk
  view.setUint16(offset, entries.length, true); offset += 2;
  // Total number of central directory records
  view.setUint16(offset, entries.length, true); offset += 2;
  // Size of central directory
  view.setUint32(offset, centralDirSize, true); offset += 4;
  // Offset of start of central directory
  view.setUint32(offset, centralDirOffset, true); offset += 4;
  // Comment length
  view.setUint16(offset, 0, true); offset += 2;

  return buffer;
}
