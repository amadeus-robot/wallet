import { bls12_381 as bls } from '@noble/curves/bls12-381';
import { blake3 } from '@noble/hashes/blake3';
import { globalState, setGlobalState } from './state.js'
import { encode, decode } from "@amadeus/vecpak-js";

export var SEED64_TEMPORAL;

export function format_9(number, precision) {
	if (!precision)
		precision = 2
	var str = number.toString()
	var prefix = str.slice(0, -9).padStart(9, "0")
	var suffix = str.slice(-9).padStart(9, "0")
	return Number(`${prefix}.${suffix}`).toFixed(precision)
}

const BLS12_381_ORDER = window.BigInt('0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001');
function reduce512To256LE(bytes64) {
  if (!(bytes64 instanceof Uint8Array) || bytes64.length !== 64) {
    throw new Error('Expected 64-byte Uint8Array');
  }
  // 1. Convert 64 bytes LE -> BigInt
  let x = 0n;
  for (let i = 0; i < 64; i++) {
    x += window.BigInt(bytes64[i]) << (8n * window.BigInt(i));
  }
  // 2. Reduce mod the group order
  x = x % BLS12_381_ORDER;

  // 3. Convert to 32-byte BIG-ENDIAN
  const out = new Uint8Array(32);
  for (let i = 31; i >= 0; i--) {
    out[i] = Number(x & 0xffn);
    x >>= 8n;
  }
  return out;
}

export function generate_random_seed64() {
	const array = new Uint8Array(64);
	var seed64 = window.crypto.getRandomValues(array);
	return seed64;
}

export function seed64_to_keypair(seed64) {
	const sk = reduce512To256LE(seed64);
	const pk = bls.getPublicKey(sk);
  return [pk, sk]
}

export function set_seed64(seed64) {
  SEED64_TEMPORAL = seed64;
  if (localStorage) {
    localStorage.setItem("seed64:0", to_b58(seed64));
  }
}

export function read_seed64_as_keypair() {
  var seed64 = SEED64_TEMPORAL;
  if (!seed64 && !!localStorage) {
    seed64 = localStorage.getItem("seed64:0");
		if (seed64) { seed64 = from_b58(seed64); }
  }
  if (!seed64) {
    return [null, null];
  } else {
    return seed64_to_keypair(seed64)
  }
}

export function sign_oob(msg) {
	const sk = globalState.sk;
	return bls.sign(msg, sk, {DST: "AMADEUS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_OOB_"});
}

export function sign_tx(tx) {
	const sk = globalState.sk;
	return bls.sign(tx, sk, {DST: "AMADEUS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_TX_"});
}

export function build_tx(contract, func, args) {
	const tx = {
		signer: globalState.pk,
		nonce: window.BigInt(Date.now()) * 1_000_000n,
		actions: [{op: "call", contract: contract, function: func, args: args}]
	}

  const tx_encoded = encode(tx);
  const hash = blake3(tx_encoded);
	const signature = sign_tx(hash);

	const tx_packed = encode({tx_encoded: tx_encoded, hash: hash, signature: signature});

	//console.log(hash, signature);
	//console.log(tx_packed);
	//console.log(to_b58(tx_packed));

	return tx_packed;
}

export async function api_node(node_url, path, body, token) {
  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  if (!body) {
    body = {}
  }

  if (typeof body === 'string' || body instanceof String) {
  } else {
    body = JSON.stringify(body)
  }
  var response = await fetch(`${node_url}${path}`, {
    method: 'POST',
    headers: headers,
    body: body,
  })
  return await response.json();
}

const MAP = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export function to_b58(term) {return (typeof term === 'string' || term instanceof String) ? to_b58_1(new TextEncoder().encode(term)) : to_b58_1(term)}
window.to_b58 = to_b58;
// eslint-disable-next-line
function to_b58_1(B,A) {if(!A){A=MAP};var d=[],s="",i,j,c,n;for(i in B){j=0,c=B[i];s+=c||s.length^i?"":1;while(j in d||c){n=d[j];n=n?n*256+c:c;c=n/58|0;d[j]=n%58;j++}}while(j--)s+=A[d[j]];return s};
export function from_b58(term) {return from_b58_1(term)}
window.from_b58 = from_b58;
// eslint-disable-next-line
function from_b58_1(S,A) {if(!A){A=MAP};var d=[],b=[],i,j,c,n;for(i in S){j=0,c=A.indexOf(S[i]);if(c<0)return undefined;c||b.length^i?i:b.push(0);while(j in d||c){n=d[j];n=n?n*58+c:c;c=n>>8;d[j]=n%256;j++}}while(j--)b.push(d[j]);return new Uint8Array(b)};
