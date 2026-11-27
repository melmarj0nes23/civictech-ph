interface JwkKey {
  kid?: string;
  kty: string;
  n?: string;
  e?: string;
  alg?: string;
  use?: string;
}

export interface VerifiedClerkUser {
  userId: string;
  role: string;
  email: string;
}

const DEFAULT_CLERK_ISSUER = 'https://lasting-dove-9316.clerk.accounts.dev';

let cachedJwks: { issuer: string; keys: JwkKey[]; fetchedAt: number } | null = null;

function base64UrlToUint8Array(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((input.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function decodeJwtPart<T>(part: string): T {
  const bytes = base64UrlToUint8Array(part);
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json) as T;
}

async function getJwks(issuer: string): Promise<JwkKey[]> {
  const now = Date.now();
  if (cachedJwks && cachedJwks.issuer === issuer && now - cachedJwks.fetchedAt < 5 * 60 * 1000) {
    return cachedJwks.keys;
  }
  const res = await fetch(`${issuer.replace(/\/+$/, '')}/.well-known/jwks.json`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Clerk JWKS (${res.status})`);
  }
  const data = (await res.json()) as { keys?: JwkKey[] };
  const keys = data.keys ?? [];
  cachedJwks = { issuer, keys, fetchedAt: now };
  return keys;
}

export async function verifyClerkRequest(
  request: Request,
  expectedIssuer?: string
): Promise<VerifiedClerkUser | null> {
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length).trim();
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerPart, payloadPart, sigPart] = parts;
  let header: { alg?: string; kid?: string };
  let payload: {
    sub?: string;
    iss?: string;
    exp?: number;
    nbf?: number;
    role?: string;
    email?: string;
    public_metadata?: { role?: string };
  };

  try {
    header = decodeJwtPart(headerPart);
    payload = decodeJwtPart(payloadPart);
  } catch {
    return null;
  }

  if (header.alg !== 'RS256' || !payload.sub || !payload.iss) return null;

  const allowedIssuer = (expectedIssuer || DEFAULT_CLERK_ISSUER).replace(/\/+$/, '');
  const tokenIssuer = payload.iss.replace(/\/+$/, '');
  if (tokenIssuer !== allowedIssuer) return null;

  const nowSec = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < nowSec - 10) return null;
  if (payload.nbf && payload.nbf > nowSec + 10) return null;

  try {
    const keys = await getJwks(allowedIssuer);
    const jwk = keys.find((k) => k.kid === header.kid) ?? keys[0];
    if (!jwk) return null;

    const cryptoKey = await crypto.subtle.importKey(
      'jwk',
      jwk as JsonWebKey,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const data = new TextEncoder().encode(`${headerPart}.${payloadPart}`);
    const sig = base64UrlToUint8Array(sigPart);
    const valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      sig as unknown as BufferSource,
      data
    );
    if (!valid) return null;

    const role = (payload.role || payload.public_metadata?.role || '').toLowerCase();
    return {
      userId: payload.sub,
      role,
      email: payload.email || '',
    };
  } catch {
    return null;
  }
}
