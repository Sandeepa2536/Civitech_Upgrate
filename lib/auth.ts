const getBcrypt = async () => (await import('bcryptjs'));

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await getBcrypt();
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await getBcrypt();
  return bcrypt.compare(password, hash);
}

const SECRET = process.env.AUTH_SECRET || 'fallback-secret-for-dev-only';
const encoder = new TextEncoder();

async function getHmac(data: string): Promise<string> {
  const keyData = encoder.encode(SECRET);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  );
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function signToken(payload: string, expiresIn: number): Promise<string> {
  const expires = Date.now() + expiresIn * 1000;
  const data = `${payload}.${expires}`;
  const signature = await getHmac(data);
  return `${data}.${signature}`;
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const [payload, expires, signature] = token.split('.');
    if (!payload || !expires || !signature) return null;

    if (Date.now() > Number(expires)) return null;

    const data = `${payload}.${expires}`;
    const expectedSignature = await getHmac(data);

    if (signature !== expectedSignature) return null;

    return payload;
  } catch {
    return null;
  }
}
