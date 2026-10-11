/**
 * Read the pixel dimensions of a WebP file from its RIFF header, without
 * decoding the image. Supports lossy (VP8), lossless (VP8L) and extended
 * (VP8X) files. Throws if the bytes are not a well-formed WebP header.
 * @param {Uint8Array} bytes
 * @returns {{ width: number, height: number, format: 'VP8' | 'VP8L' | 'VP8X' }}
 */
export function readWebpSize(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.length < 30)
    throw new Error('Too short to be a WebP file');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const ascii = (offset, length) =>
    String.fromCharCode(...bytes.subarray(offset, offset + length));
  if (ascii(0, 4) !== 'RIFF' || ascii(8, 4) !== 'WEBP')
    throw new Error('Missing RIFF/WEBP signature');
  const chunk = ascii(12, 4);
  if (chunk === 'VP8 ') {
    // Frame tag (3 bytes) then the key-frame start code 9d 01 2a.
    if (bytes[23] !== 0x9d || bytes[24] !== 0x01 || bytes[25] !== 0x2a)
      throw new Error('Bad VP8 key-frame start code');
    return {
      width: view.getUint16(26, true) & 0x3fff,
      height: view.getUint16(28, true) & 0x3fff,
      format: 'VP8',
    };
  }
  if (chunk === 'VP8L') {
    if (bytes[20] !== 0x2f) throw new Error('Bad VP8L signature');
    const bits = view.getUint32(21, true);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >>> 14) & 0x3fff) + 1,
      format: 'VP8L',
    };
  }
  if (chunk === 'VP8X') {
    const u24 = (o) => bytes[o] | (bytes[o + 1] << 8) | (bytes[o + 2] << 16);
    return { width: u24(24) + 1, height: u24(27) + 1, format: 'VP8X' };
  }
  throw new Error(`Unknown WebP chunk "${chunk}"`);
}
