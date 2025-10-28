const TYPE_NULL   = 0x00;
const TYPE_TRUE  = 0x01;
const TYPE_FALSE   = 0x02;
const TYPE_INT    = 0x03;
const TYPE_BYTES  = 0x05;
const TYPE_LIST  = 0x06;
const TYPE_OBJECT = 0x07;

export function canonicalSerialize(value) {
  const bytesOut = [];
  encodeValue(value, bytesOut);
  return new Uint8Array(bytesOut);
}

export function canonicalDeserialize() {
}

function appendBytes(out, bytes) {
  for (const b of bytes) {
    out.push(b);
  }
}

function encodeVarint(n, out) {
	let value = typeof n === 'bigint' ? n : window.BigInt(n);

	const isNegative = value < 0n;
  if (isNegative) value = -value;

  let bytes = [];
  if (value === 0n) {
    bytes = [];
  } else {
    while (value > 0n) {
      bytes.push(Number(value & 0xFFn));
      value >>= 8n;
    }
    bytes.reverse();
  }

  const length = bytes.length;
  if (length > 127) { throw new Error("Value is too large: length exceeds 127 bytes."); }

  const header = (Number(isNegative) << 7) | length;

  const output = new Uint8Array(1 + length);
  output[0] = header;
  for (let i = 0; i < length; i++) {
    output[i + 1] = bytes[i];
  }

	appendBytes(out, output);
}

function decodeVarint(data, ref) {
	const header = data[ref.offset++];
  const signBit = header >> 7;
  const length = header & 0x7F;

  let value = 0n;
  for (let i = 0; i < length; i++) {
    value = (value << 8n) | window.BigInt(data[ref.offset++]);
  }
  if (signBit === 1) {
    value = -value;
  }
  return value;
}

function compareBytes(a, b) {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return a.length - b.length; // shorter wins if prefix equal
}

function encodeKeyBytes(k) {
  const tmp = [];
  encodeValue(k, tmp);
  return tmp;
}

function encodeValue(value, out) {
  if (value === null) {
    out.push(TYPE_NULL);
  } else if (typeof value === 'boolean') {
    out.push(value ? TYPE_TRUE : TYPE_FALSE);
  } else if (typeof value === 'number' || typeof value === 'bigint') {
    out.push(TYPE_INT);
    encodeVarint(value, out);
  } else if (typeof value === 'string') {
    out.push(TYPE_BYTES);
    const utf8 = new TextEncoder().encode(value);
    encodeVarint(utf8.length, out);
    appendBytes(out, utf8);
  } else if (value instanceof Uint8Array) {
    out.push(TYPE_BYTES);
    encodeVarint(value.length, out);
    appendBytes(out, value);
  } else if (Array.isArray(value)) {
    out.push(TYPE_LIST);
    encodeVarint(value.length, out);
    for (const element of value) {
      encodeValue(element, out);
    }
  } else if (typeof value === 'object') {
    const entries = Object.keys(value).map(k => ({k, bytes: encodeKeyBytes(k)}));
    entries.sort((a, b) => compareBytes(a.bytes, b.bytes));

    out.push(TYPE_OBJECT);
    encodeVarint(entries.length, out);
    for (const key of entries) {
      encodeValue(key.k, out);
      encodeValue(value[key.k], out);
    }
  } else {
    throw new Error(`Unsupported type: ${typeof value}`);
  }
}

function decodeBytes(data, ref) {
	if (ref.offset >= data.length) {
		throw new Error("decodeByes: Out of bounds read");
	}

	const type = data[ref.offset++];

	switch(type) {
		case TYPE_NULL:
			return null;
		case TYPE_TRUE:
			return true;
		case TYPE_FALSE:
			return false;
		case TYPE_INT:
			return decodeVarint(data, ref);
		case TYPE_BYTES:
			const length = decodeVarint(data, ref);
			const bytes = data.slice(ref.offset, ref.offset + length);
			ref.offset += length;
			return bytes;
		default:
		  throw new Error("decodeBytes: Unknown type")
	}
}
